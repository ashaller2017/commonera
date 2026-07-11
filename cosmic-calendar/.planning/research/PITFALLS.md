# Implementation Pitfalls

Status: optional research artifact from brief
Captured: 2026-07-10
Scope: date handling, Hebrew/RTL text, font licensing, and share-image export

## Date and Calendar Pitfalls

| Risk | Why it matters | Recommendation |
|---|---|---|
| Date-only input cannot know sunset | Hebrew dates begin at sundown, but the product decision uses date-only input with no time or location. | Treat the result as civil-date based. Add optional copy: "If the birth was after sunset, the Hebrew date may be the next Hebrew day." |
| `new Date("YYYY-MM-DD")` can shift the date | JavaScript parses date-only strings as UTC, which can become the prior local day in negative offsets. | Split the input manually and create `new Date(year, monthIndex, day, 12)`. |
| `HDate` is date-only | Hebcal `HDate` stores Hebrew year/month/day, not time or location. | This is acceptable for the locked scope. Do not promise sunset-accurate conversion without time/location. |
| Hebrew leap years add Adar I / Adar II | The app has a 12-month content model, while the Hebrew calendar sometimes has 13 months. | Normalize both Adar I and Adar II to `adar`; optionally display the exact source month label to the user. |
| Cheshvan/Kislev lengths vary | Hebrew year types alter month lengths. | Use Hebcal helpers such as `daysInMonth()`, `daysInYear()`, `longCheshvan()`, and `shortKislev()` instead of fixed month lengths. |
| Israel/Diaspora differences can distract | Holidays vary by location, but the first app does not need holiday schedules. | Do not expose Israel/Diaspora settings in the first version unless holiday content enters scope. |

Sources:

- Hebcal HDate docs: https://hebcal.github.io/api/core/classes/HDate.html
- Hebcal HebrewCalendar docs: https://hebcal.github.io/api/core/classes/HebrewCalendar.html
- MDN `Date.parse()`: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/parse

## Hebrew, RTL, and Typography Pitfalls

| Risk | Why it matters | Recommendation |
|---|---|---|
| Mixed English and Hebrew text can reorder badly | Browser bidirectional behavior can surprise when Hebrew glyphs, punctuation, and Latin labels are mixed. | Keep the page LTR, but wrap Hebrew runs in `<bdi lang="he" dir="rtl">...</bdi>` or `<span lang="he" dir="rtl">...</span>`. |
| CSS direction is not enough for semantic bidi | Direction affects text order and assistive tech semantics. | Prefer HTML `dir` attributes for directional changes; use CSS logical properties for layout spacing. |
| Decorative Hebrew letters may be read awkwardly | Large glyphs are visual symbols, not always meaningful screen-reader text. | If decorative, mark the glyph `aria-hidden="true"` and provide the letter name in nearby accessible text. |
| Web fonts may not be ready before image export | Share-card captures can render fallback fonts if capture starts too early. | Await `document.fonts.ready` before generating a PNG. |
| Font licenses can block client distribution | Hebrew fonts are often open, but licensing still needs to be captured. | Prefer OFL fonts and self-host WOFF2 files with license files in the repo. |

Recommended font pair:

- Display Hebrew letter: Frank Ruhl Libre or Noto Serif Hebrew.
- UI/body: Heebo, Assistant, or Noto Sans Hebrew.

Font source leads:

- SIL Open Font License: https://openfontlicense.org/
- Frank Ruhl Libre: https://fonts.google.com/specimen/Frank+Ruhl+Libre
- Noto Serif Hebrew: https://fonts.google.com/noto/specimen/Noto+Serif+Hebrew
- Heebo: https://fonts.google.com/specimen/Heebo
- Assistant: https://fonts.google.com/specimen/Assistant
- Noto Sans Hebrew: https://fonts.google.com/noto/specimen/Noto+Sans+Hebrew
- W3C HTML direction: https://www.w3.org/International/questions/qa-html-dir
- W3C inline bidi markup: https://www.w3.org/International/articles/inline-bidi-markup/

## Share-Image and Mobile Sharing Pitfalls

| Risk | Why it matters | Recommendation |
|---|---|---|
| Web Share files are not universally supported | Desktop browsers and some in-app browsers may support text sharing but not file sharing. | Check `navigator.canShare({ files })`; provide download/preview fallback. |
| Share must be user-activated | `navigator.share()` generally requires a transient user gesture. | Generate or prepare the blob before the tap when possible, but call share directly from the button handler. |
| Canvas tainting breaks export | Cross-origin images or fonts without proper CORS can make canvas export fail. | Use same-origin assets or CORS-enabled image responses. Avoid remote images in the share card. |
| `toDataURL()` can be memory-heavy | Large cards can create huge base64 strings and freeze mobile browsers. | Prefer `toBlob()` and `File` objects. |
| DOM-to-image libraries have CSS gaps | Filters, pseudo-elements, video/canvas, web fonts, and external assets can render inconsistently. | Keep the export card visually simple and test on iOS Safari, Android Chrome, and desktop Chrome. |
| Dynamic layout can crop text | Long month names, source labels, and Hebrew/English mixes may overflow fixed share dimensions. | Use a fixed export layout with explicit max lines and measured text styles. |

Recommended export flow:

```ts
await document.fonts.ready;
const blob = await toBlob(cardNode, { pixelRatio: 1 });
const file = new File([blob], "cosmic-calendar.png", { type: "image/png" });

if (navigator.canShare?.({ files: [file] })) {
  await navigator.share({ files: [file], title: "Cosmic Calendar" });
} else {
  showDownloadFallback(blob);
}
```

Sources:

- MDN Web Share API: https://developer.mozilla.org/en-US/docs/Web/API/Navigator/share
- MDN `navigator.canShare()`: https://developer.mozilla.org/en-US/docs/Web/API/Navigator/canShare
- MDN CORS-enabled images: https://developer.mozilla.org/en-US/docs/Web/HTML/How_to/CORS_enabled_image
- MDN `HTMLCanvasElement.toBlob()`: https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement/toBlob
- MDN `FontFaceSet.ready`: https://developer.mozilla.org/en-US/docs/Web/API/FontFaceSet/ready
- `html-to-image`: https://github.com/bubkoo/html-to-image

## Product-Copy Pitfalls

- Avoid presenting mazal as deterministic astrology. Keep the tone symbolic, reflective, and seasonal.
- Use source-backed words in internal data, then editorially translate them for the app. For example, "anger" can become "discernment around intensity"; "coition" can become "intimacy" or "connection"; "consumption" can become "taste."
- Keep confidence and source notes out of the first-run user experience, but preserve them in structured content metadata for review.
- Add a visible but calm note for leap-year Adar if the displayed Hebrew month is Adar I or Adar II and the content profile says Adar.
