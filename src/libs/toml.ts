/* eslint-disable no-console */
import { load as parseToml } from 'js-toml';
import { workspace, type Uri } from 'vscode'

import type { LocalesConfig } from './starlightAst';

//import type { LocalesConfig } from './config';


export function toml() {
    const doc = `
baseURL = "http://localhost:1313/"
hasCJKLanguage = true
DefaultContentLanguage = "ja"
defaultContentLanguageInSubdir = true

[languages]
    [languages.ja]
        languageName = "日本語"
        languageCode = "ja"
        contentDir = "content/ja"
        weight = 1
        testme = 'ddddd'
    [languages.en]
        languageName = "English"
        languageCode = "en"
        contentDir = "content/en"
        weight = 2
`;

const a = getHugoConfigFromToml(doc);
console.log(a);

}


export async function getHugoConfig(configUri: Uri): Promise<LocalesConfig> {
    const configData = await workspace.fs.readFile(configUri)
    const configStr = Buffer.from(configData).toString('utf8')
    return getHugoConfigFromToml(configStr)
}

export function getHugoConfigFromToml(configStr: string) {
    const localesConfig: LocalesConfig = {
        defaultLocale: "",
        locales: {},
        isUseRoot: false
    }

    const toml = parseToml(configStr)
    const hasLang = "languages" in toml
    if (hasLang) {
        const languages = toml.languages as [HugoLanguage];
        for (const [key, value] of Object.entries(languages)) {
            localesConfig.locales[key] = {label:value.languageName, lang: value.languageCode}
        }
    }
    return localesConfig
}

// interface LocalesConfig {
//     defaultLocale: string
//     locales: Record<string, Locale>
//     isUseRoot?: boolean
// }

// interface Locale {
//     label: string
//     lang?: string
//   }

interface HugoLanguage {
    contentDir: string
    languageCode: string
    languageName: string
    weight: number
}
