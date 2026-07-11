import { Resvg } from '@resvg/resvg-js'
import satori from 'satori'
import type { TemplateKey } from '@/lib/content/types'
import { FRAUNCES_600, NUNITO_400, NUNITO_700 } from '@/server/og/fonts'
import type { SharedCard } from '@/utils/share.server'

// Brand teal (sRGB conversion of DESIGN.md's --primary oklch(0.52 0.11 180)),
// used for the site-wide default OG card so it reads as "the brand" rather
// than any one journey template.
const BRAND_PRIMARY = '#007d6b'

// Per-template background hex (sRGB conversions of the DESIGN.md OKLCH base
// colors). satori/resvg render hex reliably; oklch() is not safe across both.
export const OG_TEMPLATE_COLORS: Record<TemplateKey, string> = {
  'into-the-wild': '#287c42',
  'make-something-real': '#bf4a7f',
  'make-a-difference': '#bd413f',
  'mind-and-meaning': '#3e5fad',
  'roots-and-rituals': '#a76c12',
  'my-own-path': '#8256af',
}

const FONTS = [
  { name: 'Fraunces', data: FRAUNCES_600, weight: 600 as const, style: 'normal' as const },
  { name: 'Nunito Sans', data: NUNITO_400, weight: 400 as const, style: 'normal' as const },
  { name: 'Nunito Sans', data: NUNITO_700, weight: 700 as const, style: 'normal' as const },
]

// Minimal hyperscript for satori (avoids a JSX runtime in this server module).
type Style = Record<string, string | number>
type Node = string | { type: string; props: { style?: Style; children?: unknown } }
const box = (style: Style, children: unknown): Node => ({ type: 'div', props: { style, children } })

function titleSize(name: string): number {
  if (name.length > 30) return 60
  if (name.length > 20) return 76
  return 96
}

function OgCard(card: SharedCard): Node {
  const bg = OG_TEMPLATE_COLORS[card.template]
  const pct =
    card.milestonesTotal > 0 ? Math.round((card.milestonesDone / card.milestonesTotal) * 100) : 0

  return box(
    {
      width: '1200px',
      height: '630px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      padding: '76px 88px',
      backgroundColor: bg,
      color: 'white',
      fontFamily: 'Nunito Sans',
    },
    [
      box({ display: 'flex', flexDirection: 'column' }, [
        box(
          {
            fontSize: '28px',
            fontWeight: 700,
            letterSpacing: '3px',
            textTransform: 'uppercase',
            opacity: 0.82,
          },
          `${card.firstName}'s B'Mitzvah journey`,
        ),
        box(
          {
            fontFamily: 'Fraunces',
            fontWeight: 600,
            fontSize: `${titleSize(card.journeyName)}px`,
            lineHeight: 1.02,
            letterSpacing: '-1px',
            marginTop: '14px',
          },
          card.journeyName,
        ),
        box(
          { fontSize: '34px', marginTop: '22px', opacity: 0.92 },
          `${card.templateName} · ${card.templateTagline}`,
        ),
      ]),
      box({ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }, [
        box({ display: 'flex', flexDirection: 'column', width: '640px' }, [
          box(
            {
              display: 'flex',
              width: '100%',
              height: '16px',
              borderRadius: '999px',
              backgroundColor: 'rgba(255,255,255,0.28)',
            },
            box(
              {
                width: `${Math.max(pct, 2)}%`,
                height: '16px',
                borderRadius: '999px',
                backgroundColor: 'white',
              },
              '',
            ),
          ),
          box(
            { fontSize: '24px', fontWeight: 700, marginTop: '14px', opacity: 0.92 },
            `${card.milestonesDone} of ${card.milestonesTotal} milestones`,
          ),
        ]),
        box({ fontSize: '30px', fontWeight: 800, letterSpacing: '-0.5px' }, "B'Mitzvah 2.0"),
      ]),
    ],
  )
}

export async function renderShareCardPng(card: SharedCard): Promise<Uint8Array> {
  // satori types expect a React node; the hyperscript shape is structurally
  // compatible, so cast at the boundary.
  const svg = await satori(OgCard(card) as unknown as Parameters<typeof satori>[0], {
    width: 1200,
    height: 630,
    fonts: FONTS,
  })
  return new Resvg(svg, { fitTo: { mode: 'width', value: 1200 } }).render().asPng()
}

// The milestone-path motif (dots joined by a line) echoes the "done" markers
// on the kid dashboard, so the site's own social card carries the same visual
// language as the product instead of being a bare wordmark.
function dot(filled: boolean): Node {
  return box(
    {
      width: '22px',
      height: '22px',
      borderRadius: '999px',
      backgroundColor: filled ? 'white' : 'rgba(255,255,255,0.35)',
    },
    '',
  )
}

function connector(): Node {
  return box({ width: '40px', height: '3px', backgroundColor: 'rgba(255,255,255,0.5)' }, '')
}

function DefaultCard(): Node {
  return box(
    {
      width: '1200px',
      height: '630px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      padding: '88px',
      backgroundColor: BRAND_PRIMARY,
      color: 'white',
      fontFamily: 'Nunito Sans',
    },
    [
      box({ display: 'flex', alignItems: 'center', gap: '0px', marginBottom: '32px' }, [
        dot(true),
        connector(),
        dot(true),
        connector(),
        dot(false),
      ]),
      box(
        {
          fontFamily: 'Fraunces',
          fontWeight: 600,
          fontSize: '104px',
          lineHeight: 1.02,
          letterSpacing: '-1px',
        },
        "B'Mitzvah 2.0",
      ),
      box({ fontSize: '38px', marginTop: '22px', opacity: 0.92 }, "Your B'Mitzvah. Your way."),
    ],
  )
}

export async function renderDefaultCardPng(): Promise<Uint8Array> {
  const svg = await satori(DefaultCard() as unknown as Parameters<typeof satori>[0], {
    width: 1200,
    height: 630,
    fonts: FONTS,
  })
  return new Resvg(svg, { fitTo: { mode: 'width', value: 1200 } }).render().asPng()
}
