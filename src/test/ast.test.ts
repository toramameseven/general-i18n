import path from 'node:path';

import { expect, test } from 'vitest'

import { getTranslationInfo, getTranslationJs, getLang, type LocaleInfo, mdPathInfo } from '../sample'

const testLocaleInfo: LocaleInfo = {
  contentFolder: "docs",
  locales: {
      en: {
          label: "English",
          lang: "en"
      },
      ja: {
          label: "日本語",
          lang: "ja "
      },
      cn: {
          label: "中国語",
          lang: "cn "
      }
  }
};


test('finds i18n config file', () => {
  const filePath = path.resolve(__dirname, "../../demo/content/docs/ja/index.mdx")
  
  // eslint-disable-next-line no-console
  console.log(filePath);
  const configPath = getTranslationJs(filePath);

  expect(configPath).toBe('C:\\home\\githubs\\general-i18n\\demo\\.translation.js')
})

test('finds lang', () => {
  const filePath = path.resolve(__dirname, "../../demo/content/docs/ja/index.mdx")
  const filePath2 = path.resolve(__dirname, "../../demo/content/docs/index.mdx")
  // eslint-disable-next-line no-console
  console.log(filePath);
  const configPath = getLang(filePath, testLocaleInfo);
  expect(configPath).toBe('ja')
  expect(getLang(filePath2, testLocaleInfo)).toBe(undefined)
})


test('finds locales inlined in the configuration', () => {
  const myPath = path.resolve(__dirname, "../../demo/.translation.js")
  // eslint-disable-next-line no-console
  console.log(myPath);
  const locales = getTranslationInfo(myPath);

  // eslint-disable-next-line no-console
  console.log("%o", locales)

  expect(locales.locales["en"].lang).toBe('en')
})

test('make other lang file', () => {
  const filePath = path.resolve(__dirname, "../../demo/content/docs/ja/index.mdx")
  const pathTranslate = mdPathInfo(filePath, "cn", "docs");

  // eslint-disable-next-line no-console
  console.log("%o", pathTranslate)

  expect(pathTranslate).toBe('C:\\home\\githubs\\general-i18n\\demo\\content\\docs\\cn\\index.mdx')
})