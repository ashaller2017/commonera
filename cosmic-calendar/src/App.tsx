import { FormEvent, useEffect, useRef, useState } from "react";
import { flushSync } from "react-dom";
import {
  buildPersonalThread,
  createStoredBirthProfile,
  formatBirthdayInput,
  getBirthMonthEntry,
  getCurrentSeason,
  GROUNDING_COPY,
  loadBirthProfile,
  saveBirthProfile,
  type MonthKey,
  type StoredBirthProfileV1,
} from "./content.js";
import {
  createInitialFlow,
  FlowAction,
  FlowLandmark,
  FlowState,
  transitionFlow,
  visibleLandmarksForFlow,
} from "./flow.js";

const blueZodiacUrl = `${import.meta.env?.BASE_URL ?? "/"}blue-zodiac.jpg`;
const zodiacTransitionDuration = 3_000;
const zodiacTransitionHold = 500;
const welcomeFadeOutDuration = 900;
const welcomeLineRevealDuration = 1_100;
const welcomeLineStagger = 1_350;

const constellationUrls: Record<MonthKey, string> = {
  nisan: new URL("./assets/constellations/aries.png", import.meta.url).href,
  iyar: new URL("./assets/constellations/taurus.png", import.meta.url).href,
  sivan: new URL("./assets/constellations/gemini.png", import.meta.url).href,
  tammuz: new URL("./assets/constellations/cancer.png", import.meta.url).href,
  av: new URL("./assets/constellations/leo.png", import.meta.url).href,
  elul: new URL("./assets/constellations/virgo.png", import.meta.url).href,
  tishrei: new URL("./assets/constellations/libra.png", import.meta.url).href,
  cheshvan: new URL("./assets/constellations/scorpio.png", import.meta.url).href,
  kislev: new URL("./assets/constellations/sagittarius.png", import.meta.url).href,
  tevet: new URL("./assets/constellations/capricorn.png", import.meta.url).href,
  shevat: new URL("./assets/constellations/aquarius.png", import.meta.url).href,
  adar: new URL("./assets/constellations/pisces.png", import.meta.url).href,
};

const lalouGlyphUrls: Record<MonthKey, string> = {
  tishrei: new URL("./assets/hebrew-letter-illustrations/lalou/02-transparent/01-tishrei-lamed.png", import.meta.url).href,
  cheshvan: new URL("./assets/hebrew-letter-illustrations/lalou/02-transparent/02-cheshvan-nun.png", import.meta.url).href,
  kislev: new URL("./assets/hebrew-letter-illustrations/lalou/02-transparent/03-kislev-samekh.png", import.meta.url).href,
  tevet: new URL("./assets/hebrew-letter-illustrations/lalou/02-transparent/04-tevet-ayin.png", import.meta.url).href,
  shevat: new URL("./assets/hebrew-letter-illustrations/lalou/02-transparent/05-shevat-tsade.png", import.meta.url).href,
  adar: new URL("./assets/hebrew-letter-illustrations/lalou/02-transparent/06-adar-qof.png", import.meta.url).href,
  nisan: new URL("./assets/hebrew-letter-illustrations/lalou/02-transparent/07-nisan-he.png", import.meta.url).href,
  iyar: new URL("./assets/hebrew-letter-illustrations/lalou/02-transparent/08-iyar-vav.png", import.meta.url).href,
  sivan: new URL("./assets/hebrew-letter-illustrations/lalou/02-transparent/09-sivan-zayin.png", import.meta.url).href,
  tammuz: new URL("./assets/hebrew-letter-illustrations/lalou/02-transparent/10-tammuz-het.png", import.meta.url).href,
  av: new URL("./assets/hebrew-letter-illustrations/lalou/02-transparent/11-av-tet.png", import.meta.url).href,
  elul: new URL("./assets/hebrew-letter-illustrations/lalou/02-transparent/12-elul-yod.png", import.meta.url).href,
};

const welcomeLines = [
  ["Where were you", "when the universe began?"],
  ["Some part of you", "was already on its way."],
  ["Through stars.", "Through seasons.", "Through those who came before you."],
  ["And even then,", "the heavens knew your name.", "Welcome."],
] as const;

export function easeInOutCubic(progress: number): number {
  return progress < 0.5
    ? 4 * progress * progress * progress
    : 1 - Math.pow(-2 * progress + 2, 3) / 2;
}

function ZodiacVisual({
  variant,
}: {
  variant: "immersive" | "compact" | "arc";
}) {
  return (
    <div
      className={`zodiac-visual zodiac-visual--${variant}`}
      aria-hidden="true"
    >
      <img src={blueZodiacUrl} alt="" />
    </div>
  );
}

function HebrewGlyphArt({
  monthKey,
}: {
  monthKey: MonthKey;
}) {
  return (
    <div className="hero-glyph-art" aria-hidden="true">
      <img src={lalouGlyphUrls[monthKey]} alt="" />
    </div>
  );
}

function ConstellationArt({
  monthKey,
  label,
}: {
  monthKey: MonthKey;
  label: string;
}) {
  return (
    <div
      className="constellation-art constellation-art--month"
      role="img"
      aria-label={`${label} constellation`}
    >
      <img src={constellationUrls[monthKey]} alt="" />
    </div>
  );
}

export function scrollToLandmarkUnlessReducedMotion(
  landmark: FlowLandmark,
  targetDocument: Document = document,
  targetWindow: Window = window,
): boolean {
  if (targetWindow.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    return false;
  }

  const target = targetDocument.querySelector<HTMLElement>(
    `[data-landmark="${landmark}"]`,
  );
  if (!target) {
    return false;
  }

  const startY = targetWindow.scrollY;
  const targetY = target.getBoundingClientRect().top + startY;
  const distance = targetY - startY;
  const duration = 480;
  const startedAt = targetWindow.performance.now();

  const animate = (now: number) => {
    const progress = Math.min((now - startedAt) / duration, 1);
    targetWindow.scrollTo(0, startY + distance * easeInOutCubic(progress));
    if (progress < 1) {
      targetWindow.requestAnimationFrame(animate);
    }
  };

  targetWindow.requestAnimationFrame(animate);
  return true;
}

interface FlowSectionsProps {
  state: FlowState;
  nameValue: string;
  nameError: string | null;
  birthdayValue: string;
  welcomeLine: number;
  welcomeExiting: boolean;
  onAdvanceWelcome: () => void;
  onAdvance: () => void;
  onNameChange: (value: string) => void;
  onBirthdayChange: (value: string) => void;
  onBirthdaySubmit: (event: FormEvent<HTMLFormElement>) => void;
  onSkip: () => void;
}

export function FlowSections({
  state,
  nameValue,
  nameError,
  birthdayValue,
  welcomeLine,
  welcomeExiting,
  onAdvanceWelcome,
  onAdvance,
  onNameChange,
  onBirthdayChange,
  onBirthdaySubmit,
  onSkip,
}: FlowSectionsProps) {
  const landmarks = visibleLandmarksForFlow(state);
  const birthProfile = state.birthday
    ? createStoredBirthProfile(state.birthday, nameValue)
    : null;

  return (
    <main className={`flow-page flow-page--${state.step}`}>
      {landmarks.map((landmark) => {
        switch (landmark) {
          case "welcome":
            return (
              <WelcomeScreen
                key={landmark}
                line={welcomeLine}
                exiting={welcomeExiting}
                onAdvance={onAdvanceWelcome}
              />
            );
          case "zodiac-transition":
            return (
              <ZodiacTransition key={landmark} onAdvance={onAdvance} />
            );
          case "birthday":
            return (
              <BirthdayStep
                key={landmark}
                nameValue={nameValue}
                nameError={nameError}
                birthdayValue={birthdayValue}
                birthdayError={state.validationError}
                onNameChange={onNameChange}
                onBirthdayChange={onBirthdayChange}
                onSubmit={onBirthdaySubmit}
                onSkip={onSkip}
              />
            );
          case "personal":
            return (
              <PersonalPlaceholder key={landmark} profile={birthProfile} />
            );
          case "month":
            return <MonthPlaceholder key={landmark} />;
          case "upcoming":
            return <UpcomingPlaceholder key={landmark} />;
        }
      })}
    </main>
  );
}

function WelcomeScreen({
  line,
  exiting,
  onAdvance,
}: {
  line: number;
  exiting: boolean;
  onAdvance: () => void;
}) {
  const lines = welcomeLines[line] ?? welcomeLines[3];

  return (
    <section
      className="flow-section welcome-section"
      data-landmark="welcome"
      aria-labelledby="welcome-line"
    >
      <ZodiacVisual variant="immersive" />
      <div className="welcome-content">
        <p
          key={line}
          id="welcome-line"
          className={`welcome-line${exiting ? " welcome-line--exiting" : ""}`}
          aria-live="polite"
        >
          {lines.map((text, index) => (
            <span
              key={text}
              className={`welcome-line-part${text === "Welcome." ? " welcome-line-part--stanza" : ""}`}
              style={{ animationDelay: `${index * welcomeLineStagger}ms` }}
            >
              {text}
            </span>
          ))}
        </p>
        <button className="welcome-tap" onClick={onAdvance}>
          tap to continue
        </button>
      </div>
    </section>
  );
}

function ZodiacTransition({ onAdvance }: { onAdvance: () => void }) {
  useEffect(() => {
    const delay = window.matchMedia("(prefers-reduced-motion: reduce)").matches
      ? 500
      : zodiacTransitionDuration + zodiacTransitionHold;
    const timeout = window.setTimeout(onAdvance, delay);

    return () => window.clearTimeout(timeout);
  }, [onAdvance]);

  return (
    <section
      className="flow-section transition-section"
      data-landmark="zodiac-transition"
      aria-labelledby="transition-title"
    >
      <h1 id="transition-title" className="visually-hidden">
        The zodiac moves into place
      </h1>
      <ZodiacVisual variant="compact" />
    </section>
  );
}

function BirthdayStep({
  nameValue,
  nameError,
  birthdayValue,
  birthdayError,
  onNameChange,
  onBirthdayChange,
  onSubmit,
  onSkip,
}: {
  nameValue: string;
  nameError: string | null;
  birthdayValue: string;
  birthdayError: string | null;
  onNameChange: (value: string) => void;
  onBirthdayChange: (value: string) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onSkip: () => void;
}) {
  return (
    <section
      className="flow-section birthday-section"
      data-landmark="birthday"
      aria-labelledby="birthday-title"
    >
      <ZodiacVisual variant="compact" />
      <div className="section-copy birthday-copy">
        <h1 id="birthday-title" className="visually-hidden">
          Enter your name and birthday
        </h1>
        <form className="birthday-form" onSubmit={onSubmit} noValidate>
          <div className="birthday-fields">
            <div className="birthday-field">
              <label className="visually-hidden" htmlFor="display-name">
                Name
              </label>
              <input
                id="display-name"
                name="display-name"
                type="text"
                autoComplete="name"
                maxLength={40}
                placeholder="Name"
                value={nameValue}
                aria-describedby={nameError ? "name-error" : undefined}
                aria-invalid={Boolean(nameError)}
                onChange={(event) => onNameChange(event.target.value)}
              />
            </div>
            <div className="birthday-field">
              <label className="visually-hidden" htmlFor="birthday">
                Birthday
              </label>
              <input
                id="birthday"
                name="birthday"
                type="text"
                inputMode="numeric"
                autoComplete="bday"
                placeholder="MM/DD/YYYY"
                value={birthdayValue}
                aria-describedby={birthdayError ? "birthday-error" : "birthday-hint"}
                aria-invalid={Boolean(birthdayError)}
                onChange={(event) => onBirthdayChange(event.target.value)}
              />
            </div>
          </div>
          <span id="birthday-hint" className="visually-hidden">
            Enter the date as month, day, and four-digit year.
          </span>
          {nameError ? (
            <span id="name-error" className="field-error" role="alert">
              {nameError}
            </span>
          ) : null}
          {birthdayError ? (
            <span id="birthday-error" className="field-error" role="alert">
              {birthdayError}
            </span>
          ) : null}
          <button className="primary-action" type="submit">
            Continue
          </button>
        </form>
        <button className="text-action" onClick={onSkip}>
          Skip to this month
        </button>
      </div>
    </section>
  );
}

function PersonalPlaceholder({
  profile,
}: {
  profile: StoredBirthProfileV1 | null;
}) {
  const month = profile ? getBirthMonthEntry(profile) : null;
  const displayName = profile?.input.displayName?.trim() || "Your Reading";

  return (
    <section
      className="flow-section reading-section personal-section"
      data-landmark="personal"
      aria-labelledby="personal-title"
    >
      <ZodiacVisual variant="arc" />
      <div className="section-copy reading-copy">
        {month ? (
          <HebrewGlyphArt monthKey={month.correspondence.key} />
        ) : (
          <p className="hero-glyph" aria-hidden="true">א</p>
        )}
        {profile && month ? (
          <>
            <p className="eyebrow">{profile.derived.hebrewDate.displayLabel}</p>
            <h1 id="personal-title" className="personal-name">{displayName}</h1>
            <p className="profile-facts">
              <span lang="he" dir="rtl">{profile.derived.hebrewDate.hebrewDisplay}</span>
              <span>
                {month.correspondence.mazal.zodiacLabel} · {month.correspondence.tribe} ·{" "}
                {profile.derived.moon.label} · {month.correspondence.letter.name}
              </span>
            </p>
            <p>{buildPersonalThread(profile)}</p>
            <p className="return-question">
              {month.reading.witnessingQuestion}
            </p>
          </>
        ) : (
          <>
            <h1 id="personal-title" className="personal-name">{displayName}</h1>
            <p>Your Hebrew birth profile will appear here.</p>
          </>
        )}
      </div>
    </section>
  );
}

function MonthPlaceholder() {
  const season = getCurrentSeason();
  const { correspondence, reading } = season.entry;

  return (
    <section
      className="flow-section reading-section month-section"
      data-landmark="month"
      aria-labelledby="month-title"
    >
      <ConstellationArt
        monthKey={correspondence.key}
        label={correspondence.mazal.zodiacLabel}
      />
      <div className="section-copy reading-copy month-copy">
        <p className="eyebrow">
          This month · {" "}
          <span lang="he" dir="rtl">{correspondence.names.hebrew}</span>
        </p>
        <h1 id="month-title">
          {correspondence.names.english}{" "}
          <span lang="he" dir="rtl">{correspondence.names.hebrew}</span>
        </h1>
        <p className="month-archetype">{reading.archetype}</p>
        <p className="profile-facts">{correspondence.mazal.zodiacLabel}</p>
        <p>{reading.reading}</p>
        <aside className="ritual-card">
          <span>Small ritual</span>
          <p>{reading.ritual}</p>
        </aside>
        <details className="grounding-note">
          <summary>Where this comes from</summary>
          <p>{GROUNDING_COPY}</p>
        </details>
      </div>
    </section>
  );
}

function UpcomingPlaceholder() {
  return (
    <section
      className="flow-section reading-section upcoming-section"
      data-landmark="upcoming"
      aria-labelledby="upcoming-title"
    >
      <div className="section-copy reading-copy">
        <h1 id="upcoming-title">Moon / Upcoming</h1>
        <div className="moon-placeholder" aria-label="Moon phase placeholder" />
        <p>What is gathering this Friday and in the next moon phase will land here.</p>
      </div>
    </section>
  );
}

export default function App() {
  const [flow, setFlow] = useState<FlowState>(createInitialFlow);
  const [welcomeLine, setWelcomeLine] = useState(0);
  const [isWelcomeExiting, setIsWelcomeExiting] = useState(false);
  const welcomePageTimer = useRef<number | null>(null);
  const welcomeUnlockTimer = useRef<number | null>(null);
  const [nameValue, setNameValue] = useState("");
  const [nameError, setNameError] = useState<string | null>(null);
  const [birthdayValue, setBirthdayValue] = useState("");
  const [pendingLandmark, setPendingLandmark] =
    useState<FlowLandmark | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedProfile = loadBirthProfile(window.localStorage);
      if (storedProfile) {
        setNameValue(storedProfile.input.displayName ?? "");
        setBirthdayValue(
          formatBirthdayInput(storedProfile.input.civilDateISO),
        );
      }
    }
  }, []);

  useEffect(() => {
    if (!pendingLandmark) {
      return;
    }
    scrollToLandmarkUnlessReducedMotion(pendingLandmark);
    setPendingLandmark(null);
  }, [flow.step, pendingLandmark]);

  useEffect(
    () => () => {
      if (welcomePageTimer.current !== null) {
        window.clearTimeout(welcomePageTimer.current);
      }
      if (welcomeUnlockTimer.current !== null) {
        window.clearTimeout(welcomeUnlockTimer.current);
      }
    },
    [],
  );

  const applyAction = (action: FlowAction, destination?: FlowLandmark) => {
    setFlow((current) => transitionFlow(current, action));
    if (destination) {
      setPendingLandmark(destination);
    }
  };

  const advanceWelcome = () => {
    if (isWelcomeExiting) {
      return;
    }

    if (welcomeUnlockTimer.current !== null) {
      window.clearTimeout(welcomeUnlockTimer.current);
      welcomeUnlockTimer.current = null;
    }

    if (welcomeLine < welcomeLines.length - 1) {
      const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      if (prefersReducedMotion) {
        setWelcomeLine((current) => current + 1);
        return;
      }

      const nextPage = welcomeLine + 1;
      const nextPageLines = welcomeLines[nextPage] ?? welcomeLines[3];
      const revealDuration =
        welcomeLineRevealDuration +
        (nextPageLines.length - 1) * welcomeLineStagger;

      setIsWelcomeExiting(true);
      welcomePageTimer.current = window.setTimeout(() => {
        welcomePageTimer.current = null;
        setWelcomeLine(nextPage);
        setIsWelcomeExiting(false);
        welcomeUnlockTimer.current = window.setTimeout(() => {
          welcomeUnlockTimer.current = null;
        }, revealDuration);
      }, welcomeFadeOutDuration);
      return;
    }

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (prefersReducedMotion) {
      applyAction({ type: "advance" });
      return;
    }

    setIsWelcomeExiting(true);
    welcomePageTimer.current = window.setTimeout(() => {
      welcomePageTimer.current = null;
      applyAction({ type: "advance" });
      setIsWelcomeExiting(false);
    }, welcomeFadeOutDuration);
  };

  const advanceFromZodiac = () => {
    const showBirthday = () => {
      flushSync(() => {
        setFlow((current) => transitionFlow(current, { type: "advance" }));
      });
    };
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (typeof document.startViewTransition === "function" && !prefersReducedMotion) {
      document.startViewTransition(showBirthday);
      return;
    }

    showBirthday();
  };

  const submitBirthday = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const normalizedName = nameValue.trim();
    const next = transitionFlow(flow, {
      type: "submit-birthday",
      value: birthdayValue,
    });
    if (!normalizedName) {
      setNameError("Enter your name.");
      if (next.step !== "personal") {
        setFlow(next);
      }
      return;
    }
    setNameError(null);
    if (next.step !== "personal") {
      setFlow(next);
      return;
    }

    const profile = createStoredBirthProfile(birthdayValue, normalizedName);
    if (profile && typeof window !== "undefined") {
      saveBirthProfile(profile, window.localStorage);
    }

    const showPersonalReading = () => {
      flushSync(() => setFlow(next));
    };
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (typeof document.startViewTransition === "function" && !prefersReducedMotion) {
      document.startViewTransition(showPersonalReading);
      return;
    }

    showPersonalReading();
  };

  return (
    <FlowSections
      state={flow}
      nameValue={nameValue}
      nameError={nameError}
      birthdayValue={birthdayValue}
      welcomeLine={welcomeLine}
      welcomeExiting={isWelcomeExiting}
      onAdvanceWelcome={advanceWelcome}
      onAdvance={advanceFromZodiac}
      onNameChange={(value) => {
        setNameValue(value);
        setNameError(null);
      }}
      onBirthdayChange={setBirthdayValue}
      onBirthdaySubmit={submitBirthday}
      onSkip={() => applyAction({ type: "skip-to-month" })}
    />
  );
}
