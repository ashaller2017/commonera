# Month Attributions Research

Status: implementation-ready research draft
Captured: 2026-07-10
Scope: 12-month Sefer Yetzirah / Hebrew-calendar attribution spine for Cosmic Calendar

## Recommendation

Use the Gra / Arizal-Gra lineage as the working attribution spine. This matches the GalEinai / Rabbi Yitzchak Ginsburgh month series found for the research pass and agrees with the PRD Section 5 zodiac sequence. It should be presented as the app's chosen lineage, not as a universal or uncontested Sefer Yetzirah table.

Do not include Divine-name permutations in the product data yet. This pass found enough agreement for month, mazal, tribe, letter, and sense, but not enough product-safe, consistently cited material for permutations.

## Canonical Table

Gregorian spans are approximate because Hebrew months drift across civil dates each year.

| Hebrew month | Approx. Gregorian span | Mazal / zodiac | Tribe | Hebrew letter | Sense / faculty | Sources | Confidence |
|---|---|---|---|---|---|---|---|
| Nisan | Mar-Apr | T'leh / Aries / Lamb | Judah | ה Hei | Speech | [GE-NISAN], [SY-GRA], PRD Section 5 | High; span medium |
| Iyar | Apr-May | Shor / Taurus / Ox | Issachar | ו Vav | Thought | [GE-IYAR], [SY-GRA], PRD Section 5 | High; span medium |
| Sivan | May-Jun | Teomim / Gemini / Twins | Zebulun | ז Zayin | Walking / motion / progress | [GE-SIVAN], [SY-GRA], PRD Section 5 | High; span medium |
| Tammuz | Jun-Jul | Sartan / Cancer | Reuben | ח Chet | Sight | [GE-TAMMUZ], [SY-GRA], PRD Section 5 | High; span medium |
| Av | Jul-Aug | Aryeh / Leo | Shimon | ט Tet | Hearing | [GE-AV], [SY-GRA], PRD Section 5 | High; span medium |
| Elul | Aug-Sep | Betulah / Virgo | Gad | י Yud | Action | [GE-ELUL], [SY-GRA], PRD Section 5 | High; span medium |
| Tishrei | Sep-Oct | Moznayim / Libra / Scales | Ephraim | ל Lamed | Touch / intimacy / relationship | [GE-TISHREI], [GE-CHART], [SY-GRA], PRD Section 5 | Medium-high; source shape is less direct |
| Cheshvan | Oct-Nov | Akrav / Scorpio | Menasheh | נ Nun | Smell | [GE-CHESHVAN], [SY-GRA], PRD Section 5 | High; span medium |
| Kislev | Nov-Dec | Keshet / Sagittarius / Bow | Benjamin | ס Samech | Sleep | [GE-KISLEV], [SY-GRA], PRD Section 5 | High; span medium |
| Tevet | Dec-Jan | Gedi / Capricorn / Kid | Dan | ע Ayin | Anger / indignation | [GE-TEVET], [SY-GRA], PRD Section 5 | High; span medium |
| Shevat | Jan-Feb | D'li / Aquarius / Pail | Asher | צ Tzadik / Tzadi | Eating / taste | [GE-SHEVAT], [SY-GRA], PRD Section 5 | High; span medium |
| Adar | Feb-Mar | Dagim / Pisces / Fish | Naftali | ק Kuf / Qof | Laughter / humor | [GE-ADAR], [SY-GRA], PRD Section 5 | High; leap-year treatment product-defined |

## PRD Cross-Check

PRD Section 5 gives the zodiac sequence from Tishrei through Elul:

Tishrei / Libra, Cheshvan / Scorpio, Kislev / Sagittarius, Tevet / Capricorn, Shevat / Aquarius, Adar / Pisces, Nisan / Aries, Iyar / Taurus, Sivan / Gemini, Tammuz / Cancer, Av / Leo, Elul / Virgo.

The researched zodiac column matches that sequence exactly. The research table is ordered Nisan through Adar because the brief requested that order and because Nisan is the first month in the Sefer Yetzirah / GalEinai month series used here.

## Variance and Editorial Notes

- Recensions matter. Online Kaplan Short Version material gives a different order for the twelve faculties: sight, hearing, smell, speech, taste, coition, action, motion, anger, laughter, thought, sleep. If applied to the same month order, that would not match the GalEinai / Gra attribution spine above. Product copy should name this as the adopted Gra / Arizal-Gra lineage.
- Tribe ordering is not birth order. The working sequence follows the wilderness-camp / Arizal-style order: Judah, Issachar, Zebulun, Reuben, Shimon, Gad, Ephraim, Menasheh, Benjamin, Dan, Asher, Naftali. Levi is omitted from the core 12 and Joseph is represented by Ephraim and Menasheh.
- Faculty wording needs editorial softening. Source terms such as coition, anger, and consumption are accurate in source contexts but can feel awkward in consumer copy. Recommended user-facing language: touch/intimacy, discernment around anger, taste, laughter, walking/progress.
- Tishrei is the only uneven direct-source row in this pass. The GalEinai Tishrei index points to a PDF on the letter Lamed of Tishrei, and the all-month chart cross-check supplies the clean table shape. Use the row, but keep it flagged for future source review.
- Adar in leap years is product-defined. The project decision collapses Adar I and Adar II into one Adar / Pisces content key. Traditional practice distinguishes Adar I and Adar II, and GalEinai notes an Arizal tradition assigning Levi to Second Adar. The app can display the actual Hebrew month name while normalizing both Adars to the Adar content profile.

## Source Leads and Citations

- [SY-GRA] Sefer Yetzirah, Gra Version, chapter 5, Sefaria API: https://www.sefaria.org/api/texts/Sefer_Yetzirah_Gra_Version.5?commentary=0&context=0
- [SY-KAPLAN] Aryeh Kaplan, *Sefer Yetzirah: The Book of Creation in Theory and Practice*, Samuel Weiser, 1990. Used as a print-source lead from the brief; verify page-level citations before publication copy.
- [SY-KAPLAN-SHORT] Kaplan Short Version variant: https://www.psyche.com/psyche/txt/kaplan_sy_short.html
- [GE-CHART] GalEinai all-month chart, "Freedom of Choice": https://inner.org/hebrew_calendar/freedom-of-choice-2.php
- [GE-NISAN] GalEinai, Nisan: https://inner.org/times/nissan/nissan.htm
- [GE-IYAR] GalEinai, Iyar: https://inner.org/times/iyar/iyar.htm
- [GE-SIVAN] GalEinai, Sivan: https://inner.org/times/sivan/sivan.htm
- [GE-TAMMUZ] GalEinai, Tammuz / Tamuz: https://inner.org/times/tamuz/tamuz.htm
- [GE-AV] GalEinai, Av: https://inner.org/times/av/av.htm
- [GE-ELUL] GalEinai, Elul: https://inner.org/times/elul/elul.htm
- [GE-TISHREI] GalEinai, Tishrei resource index and "Letter Lamed of Tishrei" PDF: https://inner.org/times/tishrei/index/ and https://inner.org/wp-content/uploads/2014/03/4%2BTishrei%2B5773.pdf
- [GE-CHESHVAN] GalEinai, Cheshvan: https://inner.org/times/cheshvan/cheshvan-book-formation.php
- [GE-KISLEV] GalEinai, Kislev: https://inner.org/times/kislev/kislev.htm
- [GE-TEVET] GalEinai, Tevet: https://inner.org/times/tevet/tevet.htm
- [GE-SHEVAT] GalEinai, Shevat: https://inner.org/times/shevat/shevat.htm
- [GE-ADAR] GalEinai, Adar: https://inner.org/times/adar/adar.htm
- [MAZZAROTH] Betemunah Mazzaroth source capture, secondary enrichment only: `.planning/research/sources/mazaroth-betemunah-org.md`

## Implementation Notes

- Store the table as source-backed structured data, but keep source labels in a separate citation map so UI copy stays clean.
- Use a normalized content key for month logic: `nisan`, `iyar`, `sivan`, `tammuz`, `av`, `elul`, `tishrei`, `cheshvan`, `kislev`, `tevet`, `shevat`, `adar`.
- For leap years, map both Adar I and Adar II to `adar`, and optionally show the exact Hebrew month label beside the normalized archetype.
