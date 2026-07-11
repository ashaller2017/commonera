import assert from "node:assert/strict";
import test from "node:test";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";

import {
  createInitialFlow,
  formatBirthdayFieldValue,
  transitionFlow,
  visibleLandmarksForFlow,
} from "./build/flow-test/flow.js";
import {
  FlowSections,
  scrollToLandmarkUnlessReducedMotion,
} from "./build/flow-test/App.js";
import {
  buildPersonalThread,
  createStoredBirthProfile,
  getCurrentSeason,
  MONTH_ENTRIES,
} from "./build/flow-test/content.js";

function advanceToBirthday() {
  const welcome = createInitialFlow();
  const zodiacTransition = transitionFlow(welcome, { type: "advance" });
  return transitionFlow(zodiacTransition, { type: "advance" });
}

test("birthday entry inserts date slashes while typing and pasting", () => {
  assert.equal(formatBirthdayFieldValue(""), "");
  assert.equal(formatBirthdayFieldValue("1"), "1");
  assert.equal(formatBirthdayFieldValue("12", "1"), "12/");
  assert.equal(formatBirthdayFieldValue("123"), "12/3");
  assert.equal(formatBirthdayFieldValue("1234", "12/3"), "12/34/");
  assert.equal(formatBirthdayFieldValue("12345"), "12/34/5");
  assert.equal(formatBirthdayFieldValue("12-34-1998"), "12/34/1998");
  assert.equal(formatBirthdayFieldValue("123456789"), "12/34/5678");
  assert.equal(formatBirthdayFieldValue("12", "12/"), "12");
  assert.equal(formatBirthdayFieldValue("12/34", "12/34/"), "12/34");
});

test("initial flow advances through the zodiac transition to birthday entry", () => {
  const welcome = createInitialFlow();
  assert.equal(welcome.step, "welcome");

  const zodiacTransition = transitionFlow(welcome, { type: "advance" });
  assert.equal(zodiacTransition.step, "zodiac-transition");

  const birthday = transitionFlow(zodiacTransition, { type: "advance" });
  assert.equal(birthday.step, "birthday");
});

test("valid birthday records the date and shows personal before month", () => {
  const birthday = advanceToBirthday();
  const personal = transitionFlow(birthday, {
    type: "submit-birthday",
    value: "07/10/1998",
  });

  assert.equal(personal.step, "personal");
  assert.equal(personal.birthday, "07/10/1998");
  assert.equal(personal.validationError, null);
  assert.deepEqual(visibleLandmarksForFlow(personal), [
    "personal",
    "month",
    "upcoming",
  ]);
});

test("welcome and birthday skips reach month without personal data", () => {
  const welcomeSkip = transitionFlow(createInitialFlow(), {
    type: "skip-to-month",
  });
  const birthdaySkip = transitionFlow(advanceToBirthday(), {
    type: "skip-to-month",
  });

  for (const state of [welcomeSkip, birthdaySkip]) {
    assert.equal(state.step, "month");
    assert.equal(state.birthday, null);
    assert.deepEqual(visibleLandmarksForFlow(state), ["month", "upcoming"]);
  }
});

test("invalid birthday stays active and exposes validation feedback", () => {
  const birthday = advanceToBirthday();
  const invalid = transitionFlow(birthday, {
    type: "submit-birthday",
    value: "02/30/1998",
  });

  assert.equal(invalid.step, "birthday");
  assert.equal(invalid.birthday, null);
  assert.match(invalid.validationError ?? "", /valid date/i);
  assert.deepEqual(visibleLandmarksForFlow(invalid), ["birthday"]);
});

const renderFlow = (state, welcomeLine = 0) =>
  renderToStaticMarkup(
    createElement(FlowSections, {
      state,
      nameValue: "Mara",
      nameError: null,
      birthdayValue: "",
      welcomeLine,
      welcomeExiting: false,
      onAdvanceWelcome() {},
      onAdvance() {},
      onNameChange() {},
      onBirthdayChange() {},
      onBirthdaySubmit() {},
      onSkip() {},
    }),
  );

test("welcome renders the approved two-page sequence", () => {
  const pages = [
    ["When the universe began,", "some part of you", "was already on its way."],
    ["Long before you were born,", "the heavens knew your name."],
  ];

  pages.forEach((page, index) => {
    const markup = renderFlow(createInitialFlow(), index);
    let previousLine = -1;
    page.forEach((line) => {
      const currentLine = markup.indexOf(`>${line}</span>`);
      assert.ok(currentLine > previousLine);
      previousLine = currentLine;
    });
  });
});

test("welcome uses one tap action and birthday owns the month skip", () => {
  const welcomeMarkup = renderFlow(createInitialFlow());
  const birthdayMarkup = renderFlow(advanceToBirthday());

  assert.match(welcomeMarkup, />tap to continue</);
  assert.doesNotMatch(welcomeMarkup, /Skip to this month/);
  assert.match(birthdayMarkup, /Skip to this month/);
  assert.match(birthdayMarkup, /placeholder="Name"/);
  assert.ok(
    birthdayMarkup.indexOf('placeholder="Name"') <
      birthdayMarkup.indexOf('placeholder="MM\/DD\/YYYY"'),
  );
});

test("both skip origins render month and upcoming without personal", () => {
  const welcomeSkip = transitionFlow(createInitialFlow(), {
    type: "skip-to-month",
  });
  const birthdaySkip = transitionFlow(advanceToBirthday(), {
    type: "skip-to-month",
  });

  for (const state of [welcomeSkip, birthdaySkip]) {
    const markup = renderFlow(state);
    assert.doesNotMatch(markup, /data-landmark="personal"/);
    assert.match(markup, /data-landmark="month"/);
    assert.match(markup, /data-landmark="upcoming"/);
  }
});

test("birthday path renders personal before month and upcoming", () => {
  const state = transitionFlow(advanceToBirthday(), {
    type: "submit-birthday",
    value: "07/10/1998",
  });
  const profile = createStoredBirthProfile("07/10/1998", "Mara");
  const markup = renderFlow(state);

  assert.ok(profile);

  const personal = markup.indexOf('data-landmark="personal"');
  const month = markup.indexOf('data-landmark="month"');
  const upcoming = markup.indexOf('data-landmark="upcoming"');

  assert.ok(personal >= 0);
  assert.ok(personal < month);
  assert.ok(month < upcoming);
  assert.match(markup, /id="personal-title" class="personal-name">Mara<\/h1>/);
  const birthMonth = MONTH_ENTRIES[profile.derived.hebrewDate.monthKey];
  const personalMarkup = markup.slice(personal, month);
  assert.match(
    personalMarkup,
    new RegExp(`<span>${birthMonth.correspondence.mazal.zodiacLabel}<\\/span>`),
  );
  const personalThread = buildPersonalThread(profile);
  assert.match(personalThread, /^The season of your birth /);
  assert.equal(
    personalThread.includes(birthMonth.correspondence.mazal.zodiacLabel),
    false,
  );
  assert.match(
    personalMarkup,
    new RegExp(
      `${birthMonth.correspondence.names.english} asks: ${birthMonth.reading.witnessingQuestion}`,
    ),
  );
  assert.equal(
    (personalMarkup.match(
      new RegExp(birthMonth.correspondence.names.english, "g"),
    ) ?? []).length,
    1,
  );
  assert.equal(markup.includes(profile.derived.hebrewDate.displayLabel), false);
  assert.equal(markup.includes(profile.derived.hebrewDate.hebrewDisplay), false);
  assert.doesNotMatch(markup, /Personal Thread/);
});

test("Tevet saves its voice for the closing question", () => {
  assert.match(
    MONTH_ENTRIES.tevet.reading.reading,
    /^Endurance can carry us through the dark/,
  );
  assert.equal(MONTH_ENTRIES.tevet.reading.reading.includes("Tevet asks"), false);
  assert.equal(
    MONTH_ENTRIES.tevet.reading.witnessingQuestion,
    "What deserves your discipline rather than your force?",
  );
});

test("birthday and month compositions render real visual assets", () => {
  const birthdayState = transitionFlow(advanceToBirthday(), {
    type: "submit-birthday",
    value: "07/10/1998",
  });
  const birthdayMarkup = renderFlow(birthdayState);
  const monthMarkup = renderFlow(
    transitionFlow(createInitialFlow(), { type: "skip-to-month" }),
  );

  assert.match(birthdayMarkup, /class="hero-glyph-art"/);
  assert.equal(
    (birthdayMarkup.match(/constellation-art--month/g) ?? []).length,
    1,
  );
  assert.equal(
    (monthMarkup.match(/constellation-art--month/g) ?? []).length,
    1,
  );
  assert.ok(
    birthdayMarkup.indexOf("constellation-art--month") >
      birthdayMarkup.indexOf('data-landmark="month"'),
  );
  assert.match(
    monthMarkup,
    /This month ·\s*<span lang="he" dir="rtl">[^<]+<\/span>/u,
  );
  assert.doesNotMatch(
    monthMarkup,
    new RegExp(`This month · ${getCurrentSeason().hebrewDate.exactMonthLabel}`),
  );
  assert.doesNotMatch(
    monthMarkup,
    new RegExp(`profile-facts">[^<]+ · ${getCurrentSeason().moon.label}`),
  );
  assert.doesNotMatch(birthdayMarkup, /[♈♉♊♋♌♍♎♏♐♑♒♓]/u);
  assert.doesNotMatch(monthMarkup, /[♈♉♊♋♌♍♎♏♐♑♒♓]/u);
  assert.doesNotMatch(birthdayMarkup, /constellation-placeholder/);
});

test("reduced motion returns before querying a landmark or scrolling", () => {
  let landmarkQueries = 0;
  let scrollCalls = 0;

  const didScroll = scrollToLandmarkUnlessReducedMotion(
    "personal",
    {
      querySelector() {
        landmarkQueries += 1;
        return null;
      },
    },
    {
      matchMedia() {
        return { matches: true };
      },
      scrollTo() {
        scrollCalls += 1;
      },
    },
  );

  assert.equal(didScroll, false);
  assert.equal(landmarkQueries, 0);
  assert.equal(scrollCalls, 0);
});

test("the content model contains 12 current-month readings with rituals", () => {
  const entries = Object.values(MONTH_ENTRIES);

  assert.equal(entries.length, 12);
  for (const entry of entries) {
    assert.ok(entry.reading.reading.length > 0);
    assert.ok(entry.reading.ritual.length > 0);
    assert.equal(entry.reading.monthKey, entry.correspondence.key);
  }
});

test("a birthday produces stable facts without storing authored prose", () => {
  const profile = createStoredBirthProfile("07/10/1998", "  Mara  ");

  assert.ok(profile);
  assert.equal(profile.input.displayName, "Mara");
  assert.equal(profile.derived.hebrewDate.monthKey, "tammuz");
  assert.equal(MONTH_ENTRIES.tammuz.correspondence.letter.glyph, "ח");
  assert.doesNotMatch(JSON.stringify(profile), /reading|ritual/i);
});

test("Adar I and Adar II retain their exact labels but share one month entry", () => {
  const adarI = createStoredBirthProfile("02/15/2024");
  const adarII = createStoredBirthProfile("03/15/2024");

  assert.ok(adarI);
  assert.ok(adarII);
  assert.equal(adarI.derived.hebrewDate.exactMonthLabel, "Adar I");
  assert.equal(adarII.derived.hebrewDate.exactMonthLabel, "Adar II");
  assert.equal(adarI.derived.hebrewDate.monthKey, "adar");
  assert.equal(adarII.derived.hebrewDate.monthKey, "adar");
});

test("current season derives Tishrei from a fixed civil date", () => {
  const season = getCurrentSeason(new Date(2024, 9, 3, 12));

  assert.equal(season.hebrewDate.monthKey, "tishrei");
  assert.equal(season.entry.correspondence.names.english, "Tishrei");
});
