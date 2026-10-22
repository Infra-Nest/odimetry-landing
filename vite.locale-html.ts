import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import type { Plugin, ViteDevServer } from 'vite'
import {
  FAQ_KEYS,
  LOCALES,
  applyLocaleToHtml,
  type Locale,
  type LocaleSeoInput,
} from './src/seo/site'

const root = join(dirname(fileURLToPath(import.meta.url)))

type TranslationFile = {
  seo: { title: string; description: string; imageAlt: string }
  faq: {
    items: Record<string, { question: string; answer: string }>
  }
}

async function loadLocaleInput(locale: Locale): Promise<LocaleSeoInput> {
  const raw = await readFile(
    join(root, 'src/i18n/locales', locale, 'translation.json'),
    'utf8',
  )
  const translation = JSON.parse(raw) as TranslationFile
  return {
    locale,
    seo: {
      title: translation.seo.title,
      description: translation.seo.description,
      imageAlt: translation.seo.imageAlt,
    },
    faqItems: FAQ_KEYS.map((key) => ({
      question: translation.faq.items[key].question,
      answer: translation.faq.items[key].answer,
    })),
  }
}

async function localizeHtml(template: string, locale: Locale): Promise<string> {
  return applyLocaleToHtml(template, await loadLocaleInput(locale))
}

function localeFromUrl(url: string): Locale | null {
  const path = url.split('?')[0]?.split('#')[0] || '/'
  if (path === '/en' || path === '/en/') return 'en'
  if (path === '/fr' || path === '/fr/') return 'fr'
  if (path === '/de' || path === '/de/') return 'de'
  return null
}

/**
 * Serves localized HTML for /en, /fr, /de in dev and writes those pages after build.
 * Does not add a catch-all SPA fallback — unknown routes stay 404.
 */
export function localeHtmlPlugin(): Plugin {
  let outDir = 'dist'

  return {
    name: 'odimetry-locale-html',
    configResolved(config) {
      outDir = config.build.outDir
    },
    configureServer(server: ViteDevServer) {
      server.middlewares.use(async (req, res, next) => {
        if (req.method === 'GET') {
          const path = (req.url || '/').split('?')[0]?.split('#')[0] || '/'
          if (path === '/es' || path === '/es/') {
            res.statusCode = 301
            res.setHeader('Location', '/')
            res.end()
            return
          }
        }

        const locale = localeFromUrl(req.url || '/')
        if (!locale || req.method !== 'GET') {
          next()
          return
        }

        try {
          const template = await readFile(join(root, 'index.html'), 'utf8')
          const localized = await localizeHtml(template, locale)
          const transformed = await server.transformIndexHtml(
            `/${locale}`,
            localized,
          )
          res.statusCode = 200
          res.setHeader('Content-Type', 'text/html; charset=utf-8')
          res.end(transformed)
        } catch (error) {
          next(error)
        }
      })
    },
    transformIndexHtml: {
      order: 'pre',
      async handler(html, ctx) {
        // Only rewrite the Spanish root index during Vite's default transform.
        if (ctx.path && ctx.path !== '/' && ctx.path !== '/index.html') {
          return html
        }
        return localizeHtml(html, 'es')
      },
    },
    async writeBundle() {
      const distRoot = join(root, outDir)
      const template = await readFile(join(distRoot, 'index.html'), 'utf8')

      for (const locale of LOCALES) {
        // Re-read Spanish template before Spanish rewrite so other locales
        // still get a clean base; Spanish index was already localized in
        // transformIndexHtml, so rebuild from that file's asset tags.
        const html = await localizeHtml(template, locale)
        if (locale === 'es') {
          await writeFile(join(distRoot, 'index.html'), html, 'utf8')
          continue
        }
        const outFile = join(distRoot, locale, 'index.html')
        await mkdir(dirname(outFile), { recursive: true })
        await writeFile(outFile, html, 'utf8')
      }
    },
  }
}
