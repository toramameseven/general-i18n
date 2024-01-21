/* 
original code is licensed under the MIT License, Copyright © HiDeoo.
See [LICENSE](https://github.com/HiDeoo/starlight-i18n/blob/main/LICENSE) for more information. 
*/

import { type Uri, workspace } from 'vscode'

import type { Locale, LocalesConfig } from './starlightAst'

//import type { Locale, LocalesConfig } from './config';


// https://github.com/withastro/astro/blob/c23ddb9ab31c34633b3a0f163fd4c24c852073de/packages/astro/src/core/constants.ts#L5
// https://github.com/withastro/astro/blob/c23ddb9ab31c34633b3a0f163fd4c24c852073de/packages/astro/src/core/errors/dev/vite.ts#L126
// const contentExtensions = ['md', 'mdx', 'mdoc', 'markdown', 'mdown', 'mkdn', 'mkd', 'mdwn']

export function getLocalesInConfig(localesConfig: LocalesConfig) {

  const locales: Locales = {}
  for (const [localeDirectory, locale] of Object.entries(localesConfig.locales)) {
    if (localeDirectory === localesConfig.defaultLocale) {
      continue
    }
    locales[localeDirectory] = locale
  }
  return locales
}


export async function getPageRawFrontmatter(page: Uri) {
  const data = await workspace.fs.readFile(page)
  const content = Buffer.from(data).toString('utf8')
  const matches = content.match(/^(---\n[\S\s]*?\n---)\n/)

  return matches ? matches[1] : ''
}

export type Locales = Record<
  string,
  Locale
>
