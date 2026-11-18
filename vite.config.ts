import { globSync, readFileSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'

const DESKTOP_CONTENT_PATH = new URL('./src/data/desktopContent.ts', import.meta.url)

// Vite copies public HTML without running its HTML transform hooks.
function trackStandalonePages(): Plugin {
  let pages: string[] = []
  return {
    name: 'track-standalone-pages',
    apply: 'build',
    configResolved(config) {
      if (config.publicDir && config.build.copyPublicDir) {
        pages = globSync('**/*.html', { cwd: config.publicDir })
      }
    },
    writeBundle({ dir }) {
      if (!dir) return
      for (const page of pages) {
        const path = resolve(dir, page)
        const html = readFileSync(path, 'utf8')
        const analytics = '<script defer src="/_vercel/insights/script.js"></script>'
        writeFileSync(path, html.replace(/<\/head>/i, `${analytics}\n</head>`))
      }
    },
  }
}

// Dev-only endpoint behind the desktop's "Save layout" button: rewrites the
// x/y of each dragged icon in desktopContent.ts so the arrangement ships.
function saveIconLayout(): Plugin {
  return {
    name: 'save-icon-layout',
    apply: 'serve',
    configureServer(server) {
      server.middlewares.use('/__save-icon-layout', (req, res) => {
        if (req.method !== 'POST') {
          res.statusCode = 405
          res.end()
          return
        }
        let body = ''
        req.on('data', (chunk) => (body += chunk))
        req.on('end', () => {
          const positions: Record<string, { x: number; y: number }> = JSON.parse(body)
          let source = readFileSync(DESKTOP_CONTENT_PATH, 'utf8')
          const missing: string[] = []
          for (const [id, { x, y }] of Object.entries(positions)) {
            const pattern = new RegExp(
              `(id: '${id}',[\\s\\S]*?\\n(\\s*)x: )[\\d.-]+(,\\n\\s*y: )[\\d.-]+,`,
            )
            if (!pattern.test(source)) {
              missing.push(id)
              continue
            }
            source = source.replace(pattern, `$1${x}$3${y},`)
          }
          writeFileSync(DESKTOP_CONTENT_PATH, source)
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify({ missing }))
        })
      })
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), trackStandalonePages(), saveIconLayout()],
})
