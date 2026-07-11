// Rasterizes public/favicon.svg into the PNG sizes browsers/OSes still require
// (SVG favicons aren't universally supported for apple-touch-icon or manifest
// icons). Re-run after editing favicon.svg or the brand color changes.
import { readFileSync, writeFileSync } from 'node:fs'
import { Resvg } from '@resvg/resvg-js'

const svg = readFileSync('public/favicon.svg', 'utf8')

const targets = [
  { file: 'public/favicon-32.png', size: 32 },
  { file: 'public/apple-touch-icon.png', size: 180 },
  { file: 'public/icon-192.png', size: 192 },
  { file: 'public/icon-512.png', size: 512 },
]

for (const { file, size } of targets) {
  const png = new Resvg(svg, { fitTo: { mode: 'width', value: size } }).render().asPng()
  writeFileSync(file, png)
  console.log(`wrote ${file} (${size}x${size})`)
}
