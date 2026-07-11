import { HDate } from "@hebcal/core";

export type MonthKey =
  | "nisan"
  | "iyar"
  | "sivan"
  | "tammuz"
  | "av"
  | "elul"
  | "tishrei"
  | "cheshvan"
  | "kislev"
  | "tevet"
  | "shevat"
  | "adar";

export type MoonPhaseKey =
  | "new"
  | "waxing-crescent"
  | "waxing-gibbous"
  | "full"
  | "waning-gibbous"
  | "waning-crescent"
  | "dark";

export type MoonNarrativeMode =
  | "gathering"
  | "becoming"
  | "revealing"
  | "releasing";

export interface MonthCorrespondence {
  key: MonthKey;
  names: { english: string; hebrew: string };
  mazal: {
    hebrewName: string;
    englishName: string;
    zodiacLabel: string;
    symbol: string;
  };
  tribe: string;
  letter: { glyph: string; name: string; transliteration: string };
  faculty: { sourceLabel: string; displayLabel: string };
  lineage: "gra-arizal";
  sourceIds: string[];
  confidence: "high" | "medium-high";
}

export interface MonthReading {
  monthKey: MonthKey;
  dramaTitle: string;
  archetype: string;
  reading: string;
  ritual: string;
  witnessingQuestion: string;
  contentVersion: "2026.07-prototype";
}

export interface MonthEntry {
  correspondence: MonthCorrespondence;
  reading: MonthReading;
}

export interface HebrewDateFacts {
  day: number;
  year: number;
  exactMonthLabel: string;
  monthKey: MonthKey;
  displayLabel: string;
  hebrewDisplay: string;
}

export interface MoonFacts {
  phaseKey: MoonPhaseKey;
  label: string;
  narrativeMode: MoonNarrativeMode;
  basis: "hebrew-calendar-symbolic";
}

export interface StoredBirthProfileV1 {
  schemaVersion: 1;
  profileId: string;
  dataSource: "calculated";
  input: { civilDateISO: string; displayName?: string };
  derived: { hebrewDate: HebrewDateFacts; moon: MoonFacts };
  contentVersion: "2026.07-prototype";
}

export interface CurrentSeason {
  hebrewDate: HebrewDateFacts;
  moon: MoonFacts;
  entry: MonthEntry;
}

const CONTENT_VERSION = "2026.07-prototype" as const;
export const BIRTH_PROFILE_STORAGE_KEY = "cosmic-calendar.birth-profile.v1";

export const GROUNDING_COPY =
  "This reading follows a Gra / Arizal-Gra arrangement of Sefer Yetzirah correspondences, pairing each Hebrew month with a letter, mazal, tribe, and faculty. Other Jewish mystical lineages arrange some correspondences differently; this is a reflective lens, not a prediction.";

function entry(
  correspondence: Omit<MonthCorrespondence, "lineage" | "sourceIds">,
  reading: Omit<MonthReading, "monthKey" | "contentVersion">,
): MonthEntry {
  return {
    correspondence: {
      ...correspondence,
      lineage: "gra-arizal",
      sourceIds: [`GE-${correspondence.key.toUpperCase()}`, "SY-GRA"],
    },
    reading: {
      ...reading,
      monthKey: correspondence.key,
      contentVersion: CONTENT_VERSION,
    },
  };
}

export const MONTH_ENTRIES: Record<MonthKey, MonthEntry> = {
  nisan: entry(
    {
      key: "nisan",
      names: { english: "Nisan", hebrew: "ניסן" },
      mazal: { hebrewName: "T’leh", englishName: "Lamb", zodiacLabel: "Aries", symbol: "♈" },
      tribe: "Judah",
      letter: { glyph: "ה", name: "Hei", transliteration: "He" },
      faculty: { sourceLabel: "Speech", displayLabel: "Expression" },
      confidence: "high",
    },
    {
      dramaTitle: "The Drama of Speech",
      archetype: "The Open Door",
      reading: "Nisan carries the first movement outward: the moment a private knowing becomes a spoken beginning. Freedom here is less an escape than a willingness to name what can no longer remain closed.",
      ritual: "Name one thing you are ready to leave behind. Say it aloud, then set down one object that represents it.",
      witnessingQuestion: "What becomes possible once you give it words?",
    },
  ),
  iyar: entry(
    {
      key: "iyar",
      names: { english: "Iyar", hebrew: "אייר" },
      mazal: { hebrewName: "Shor", englishName: "Ox", zodiacLabel: "Taurus", symbol: "♉" },
      tribe: "Issachar",
      letter: { glyph: "ו", name: "Vav", transliteration: "Vav" },
      faculty: { sourceLabel: "Thought", displayLabel: "Thought" },
      confidence: "high",
    },
    {
      dramaTitle: "The Drama of Thought",
      archetype: "The Slow Repair",
      reading: "Iyar lives between liberation and revelation, where the dramatic opening has to become a daily practice. Healing gathers through repetition: one counted step, one quiet adjustment, one honest return.",
      ritual: "Count one meaningful thing for seven days—rest, gratitude, or steps toward a promise.",
      witnessingQuestion: "Which small repetition is quietly changing you?",
    },
  ),
  sivan: entry(
    {
      key: "sivan",
      names: { english: "Sivan", hebrew: "סיון" },
      mazal: { hebrewName: "Teomim", englishName: "Twins", zodiacLabel: "Gemini", symbol: "♊" },
      tribe: "Zebulun",
      letter: { glyph: "ז", name: "Zayin", transliteration: "Zayin" },
      faculty: { sourceLabel: "Walking / motion", displayLabel: "Movement" },
      confidence: "high",
    },
    {
      dramaTitle: "The Drama of Movement",
      archetype: "The Act of Receiving",
      reading: "Sivan asks what it means to arrive at the mountain ready to receive rather than conquer. Wisdom moves when certainty loosens enough for another voice to enter.",
      ritual: "Read one page that challenges a small certainty. Let one sentence follow you for the day.",
      witnessingQuestion: "What are you finally ready to receive?",
    },
  ),
  tammuz: entry(
    {
      key: "tammuz",
      names: { english: "Tammuz", hebrew: "תמוז" },
      mazal: { hebrewName: "Sartan", englishName: "Crab", zodiacLabel: "Cancer", symbol: "♋" },
      tribe: "Reuben",
      letter: { glyph: "ח", name: "Chet", transliteration: "Chet" },
      faculty: { sourceLabel: "Sight", displayLabel: "Sight" },
      confidence: "high",
    },
    {
      dramaTitle: "The Drama of Sight",
      archetype: "Honest Seeing",
      reading: "Tammuz holds a tension between presence and retreat—the desire to see clearly and the instinct to withdraw from what clarity asks of us. Seeing becomes care when we remain present long enough for what is visible to change us.",
      ritual: "Look directly at one thing you have been avoiding. Write one unedited sentence about what you see.",
      witnessingQuestion: "What changes when you stop looking away?",
    },
  ),
  av: entry(
    {
      key: "av",
      names: { english: "Av", hebrew: "אב" },
      mazal: { hebrewName: "Aryeh", englishName: "Lion", zodiacLabel: "Leo", symbol: "♌" },
      tribe: "Shimon",
      letter: { glyph: "ט", name: "Tet", transliteration: "Tet" },
      faculty: { sourceLabel: "Hearing", displayLabel: "Listening" },
      confidence: "high",
    },
    {
      dramaTitle: "The Drama of Hearing",
      archetype: "The Seed in the Ruins",
      reading: "Av makes room for grief without making grief the ending. Beneath the noise of what broke, attentive listening can locate the small intact thing from which rebuilding begins.",
      ritual: "Give one loss five uninterrupted minutes. Then write down what remains.",
      witnessingQuestion: "What can you hear beneath the story of the loss?",
    },
  ),
  elul: entry(
    {
      key: "elul",
      names: { english: "Elul", hebrew: "אלול" },
      mazal: { hebrewName: "Betulah", englishName: "Maiden", zodiacLabel: "Virgo", symbol: "♍" },
      tribe: "Gad",
      letter: { glyph: "י", name: "Yud", transliteration: "Yud" },
      faculty: { sourceLabel: "Action", displayLabel: "Action" },
      confidence: "high",
    },
    {
      dramaTitle: "The Drama of Action",
      archetype: "The Way Back",
      reading: "Elul is the practice of return before the new year arrives: not perfection, but the courage to close the distance between intention and action. Preparation begins with one honest movement toward what matters.",
      ritual: "Write one question you want to carry into the next cycle. Do not answer it yet.",
      witnessingQuestion: "What would a real return look like today?",
    },
  ),
  tishrei: entry(
    {
      key: "tishrei",
      names: { english: "Tishrei", hebrew: "תשרי" },
      mazal: { hebrewName: "Moznayim", englishName: "Scales", zodiacLabel: "Libra", symbol: "♎" },
      tribe: "Ephraim",
      letter: { glyph: "ל", name: "Lamed", transliteration: "Lamed" },
      faculty: { sourceLabel: "Touch / intimacy", displayLabel: "Relationship" },
      confidence: "medium-high",
    },
    {
      dramaTitle: "The Drama of Balance",
      archetype: "The Great Weighing",
      reading: "Tishrei brings judgment and mercy onto the same scale. Balance is not a flawless center; it is the living adjustment that lets responsibility and tenderness remain in relationship.",
      ritual: "Name one thing you are releasing and one thing you are calling in. Say both aloud.",
      witnessingQuestion: "Where can mercy make your judgment more truthful?",
    },
  ),
  cheshvan: entry(
    {
      key: "cheshvan",
      names: { english: "Cheshvan", hebrew: "חשוון" },
      mazal: { hebrewName: "Akrav", englishName: "Scorpion", zodiacLabel: "Scorpio", symbol: "♏" },
      tribe: "Menasheh",
      letter: { glyph: "נ", name: "Nun", transliteration: "Nun" },
      faculty: { sourceLabel: "Smell", displayLabel: "Scent / intuition" },
      confidence: "high",
    },
    {
      dramaTitle: "The Drama of Scent",
      archetype: "The Quiet Depth",
      reading: "Cheshvan arrives after the ceremonial noise and leaves an open field. Its quiet is not empty; it gives subtler forms of knowing enough room to surface.",
      ritual: "Spend ten minutes without a phone, music, or task. Notice what arrives first.",
      witnessingQuestion: "What do you know before you can explain it?",
    },
  ),
  kislev: entry(
    {
      key: "kislev",
      names: { english: "Kislev", hebrew: "כסלו" },
      mazal: { hebrewName: "Keshet", englishName: "Bow", zodiacLabel: "Sagittarius", symbol: "♐" },
      tribe: "Benjamin",
      letter: { glyph: "ס", name: "Samekh", transliteration: "Samekh" },
      faculty: { sourceLabel: "Sleep", displayLabel: "Dreaming" },
      confidence: "high",
    },
    {
      dramaTitle: "The Drama of Sleep",
      archetype: "The Kindled Dream",
      reading: "Kislev keeps a small flame inside the longest nights. Dreaming here is not escape; it is a way of protecting possibility until it is ready to become direction.",
      ritual: "Light one candle before turning on a screen. Sit with it for sixty seconds.",
      witnessingQuestion: "Which possibility still has a pulse in the dark?",
    },
  ),
  tevet: entry(
    {
      key: "tevet",
      names: { english: "Tevet", hebrew: "טבת" },
      mazal: { hebrewName: "Gedi", englishName: "Kid", zodiacLabel: "Capricorn", symbol: "♑" },
      tribe: "Dan",
      letter: { glyph: "ע", name: "Ayin", transliteration: "Ayin" },
      faculty: { sourceLabel: "Anger / indignation", displayLabel: "Discernment" },
      confidence: "high",
    },
    {
      dramaTitle: "The Drama of Discernment",
      archetype: "Devotion in the Dark",
      reading: "Tevet asks what commitment can hold when inspiration goes quiet. Contraction can become a boundary that protects what matters rather than a wall built from fear.",
      ritual: "Choose one small daily practice for this week. Do it without waiting to feel motivated.",
      witnessingQuestion: "What deserves your discipline rather than your force?",
    },
  ),
  shevat: entry(
    {
      key: "shevat",
      names: { english: "Shevat", hebrew: "שבט" },
      mazal: { hebrewName: "D’li", englishName: "Pail", zodiacLabel: "Aquarius", symbol: "♒" },
      tribe: "Asher",
      letter: { glyph: "צ", name: "Tzadi", transliteration: "Tzadi" },
      faculty: { sourceLabel: "Eating / taste", displayLabel: "Taste" },
      confidence: "high",
    },
    {
      dramaTitle: "The Drama of Taste",
      archetype: "The Rising Sap",
      reading: "Shevat notices renewal before it becomes visible. Beneath a winter surface, the first sweetness is already moving toward form.",
      ritual: "Eat one piece of fruit slowly. Consider what you are growing before anyone else can see it.",
      witnessingQuestion: "What is quietly thawing inside your life?",
    },
  ),
  adar: entry(
    {
      key: "adar",
      names: { english: "Adar", hebrew: "אדר" },
      mazal: { hebrewName: "Dagim", englishName: "Fish", zodiacLabel: "Pisces", symbol: "♓" },
      tribe: "Naftali",
      letter: { glyph: "ק", name: "Qof", transliteration: "Qof" },
      faculty: { sourceLabel: "Laughter / humor", displayLabel: "Laughter" },
      confidence: "high",
    },
    {
      dramaTitle: "The Drama of Masking",
      archetype: "The Hidden Joy",
      reading: "Adar turns the expected order over and asks what truth can appear through play. Joy is not denial here; it is a practice that loosens the mask enough for another possibility to breathe.",
      ritual: "Do one harmless thing that is spontaneous and slightly silly. Let joy be an action.",
      witnessingQuestion: "What becomes true when you stop performing certainty?",
    },
  ),
};

function normalizeMonthName(monthName: string): MonthKey {
  const value = monthName.toLowerCase().replace(/[’'\s-]/g, "");
  const aliases: Record<string, MonthKey> = {
    nisan: "nisan",
    nissan: "nisan",
    iyar: "iyar",
    iyyar: "iyar",
    sivan: "sivan",
    tamuz: "tammuz",
    tammuz: "tammuz",
    av: "av",
    elul: "elul",
    tishrei: "tishrei",
    cheshvan: "cheshvan",
    heshvan: "cheshvan",
    marcheshvan: "cheshvan",
    kislev: "kislev",
    tevet: "tevet",
    shevat: "shevat",
    adar: "adar",
    adari: "adar",
    adarii: "adar",
  };
  const key = aliases[value];
  if (!key) throw new Error(`Unsupported Hebrew month: ${monthName}`);
  return key;
}

function symbolicMoon(day: number): MoonFacts {
  if (day <= 2) return { phaseKey: "new", label: "New moon", narrativeMode: "gathering", basis: "hebrew-calendar-symbolic" };
  if (day <= 7) return { phaseKey: "waxing-crescent", label: "Waxing crescent", narrativeMode: "becoming", basis: "hebrew-calendar-symbolic" };
  if (day <= 13) return { phaseKey: "waxing-gibbous", label: "Waxing moon", narrativeMode: "becoming", basis: "hebrew-calendar-symbolic" };
  if (day <= 16) return { phaseKey: "full", label: "Full moon", narrativeMode: "revealing", basis: "hebrew-calendar-symbolic" };
  if (day <= 22) return { phaseKey: "waning-gibbous", label: "Waning moon", narrativeMode: "releasing", basis: "hebrew-calendar-symbolic" };
  if (day <= 27) return { phaseKey: "waning-crescent", label: "Waning crescent", narrativeMode: "releasing", basis: "hebrew-calendar-symbolic" };
  return { phaseKey: "dark", label: "Dark moon", narrativeMode: "gathering", basis: "hebrew-calendar-symbolic" };
}

function hebrewFacts(date: Date): { hebrewDate: HebrewDateFacts; moon: MoonFacts } {
  const hdate = new HDate(date);
  const exactMonthLabel = String(hdate.getMonthName());
  const monthKey = normalizeMonthName(exactMonthLabel);
  return {
    hebrewDate: {
      day: hdate.getDate(),
      year: hdate.getFullYear(),
      exactMonthLabel,
      monthKey,
      displayLabel: hdate.render("en"),
      hebrewDisplay: hdate.renderGematriya(true),
    },
    moon: symbolicMoon(hdate.getDate()),
  };
}

function parseBirthday(value: string): { date: Date; civilDateISO: string } | null {
  const match = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(value);
  if (!match) return null;
  const month = Number(match[1]);
  const day = Number(match[2]);
  const year = Number(match[3]);
  const date = new Date(year, month - 1, day, 12);
  if (
    year < 1000 ||
    month < 1 ||
    month > 12 ||
    day < 1 ||
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day
  ) return null;
  return {
    date,
    civilDateISO: `${String(year).padStart(4, "0")}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`,
  };
}

export function getCurrentSeason(date: Date = new Date()): CurrentSeason {
  const facts = hebrewFacts(date);
  return { ...facts, entry: MONTH_ENTRIES[facts.hebrewDate.monthKey] };
}

export function createStoredBirthProfile(
  value: string,
  displayName?: string,
): StoredBirthProfileV1 | null {
  const parsed = parseBirthday(value);
  if (!parsed) return null;
  const derived = hebrewFacts(parsed.date);
  const normalizedName = displayName?.trim();
  return {
    schemaVersion: 1,
    profileId: `birth-${parsed.civilDateISO}`,
    dataSource: "calculated",
    input: normalizedName
      ? { civilDateISO: parsed.civilDateISO, displayName: normalizedName }
      : { civilDateISO: parsed.civilDateISO },
    derived,
    contentVersion: CONTENT_VERSION,
  };
}

export function getBirthMonthEntry(profile: StoredBirthProfileV1): MonthEntry {
  return MONTH_ENTRIES[profile.derived.hebrewDate.monthKey];
}

export function buildPersonalThread(profile: StoredBirthProfileV1): string {
  const entry = getBirthMonthEntry(profile);
  const { correspondence, reading } = entry;
  return `You arrived through ${correspondence.names.english}, ${reading.dramaTitle.toLowerCase()}. Its faculty of ${correspondence.faculty.displayLabel.toLowerCase()} offers a lens—not a fixed identity—and your symbolic ${profile.derived.moon.label.toLowerCase()} gives this thread a tempo of ${profile.derived.moon.narrativeMode}.`;
}

export function formatBirthdayInput(civilDateISO: string): string {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(civilDateISO);
  return match ? `${match[2]}/${match[3]}/${match[1]}` : "";
}

export function saveBirthProfile(profile: StoredBirthProfileV1, storage: Storage): void {
  storage.setItem(BIRTH_PROFILE_STORAGE_KEY, JSON.stringify(profile));
}

export function loadBirthProfile(storage: Storage): StoredBirthProfileV1 | null {
  try {
    const value = storage.getItem(BIRTH_PROFILE_STORAGE_KEY);
    if (!value) return null;
    const parsed = JSON.parse(value) as Partial<StoredBirthProfileV1>;
    if (parsed.schemaVersion !== 1 || !parsed.input?.civilDateISO) return null;
    return createStoredBirthProfile(
      formatBirthdayInput(parsed.input.civilDateISO),
      parsed.input.displayName,
    );
  } catch {
    return null;
  }
}
