import fs from "node:fs";
import path from "node:path";


export interface LocaleInfo {
    contentFolder: string
    locales: Locales
}
export type Locales = Record<
    string,
    Locale
>

export interface Locale {
    label: string
    lang?: string
}

export function getTranslationInfo(translationJs: string) {
    delete require.cache[require.resolve(translationJs)]
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-var-requires
    const r: LocaleInfo = require(translationJs);
    return r;
}


export function getTranslationJs(filePath: string) {
    const settingFile = ".translation.js"
    const splitPaths = filePath.split('\\');

    for (let i = 1; i < splitPaths.length; i++) {
        const tPath = path.join(...splitPaths.slice(0, -i), settingFile);
        if (fs.existsSync(tPath)) {
            return tPath;
        }
    }
    return undefined;
}

export function getLang(fsPath: string, translationInfo: LocaleInfo) {
    const pathSplitter = "\\";
    const topFolders = fsPath.split(pathSplitter).filter(x => x === translationInfo.contentFolder).length;
    if (topFolders > 1){
        throw new Error(`More than two ${translationInfo.contentFolder} folders exist.`);
    }
    if (topFolders < 1){
        throw new Error(`No ${translationInfo.contentFolder} exists.`)
    }

    const beforeAfterTopFolder = fsPath.split(translationInfo.contentFolder + pathSplitter);
    const lang = beforeAfterTopFolder[1]?.split(pathSplitter)[0];

    if (Object.keys(translationInfo.locales).includes(lang)){
        return lang;
    }
    return undefined;
}

export function mdPathInfo(fsPath: string, targetLang: string, contentFolder: string) {
    const pathSplitter = "\\";
    const topFolders = fsPath.split(pathSplitter).filter(x => x === contentFolder).length;
    if (topFolders > 1){
        throw new Error(`More than two ${contentFolder} folders exist.`);
    }
    if (topFolders < 1){
        throw new Error(`No ${contentFolder} exists.`)
    }

    const beforeAfterTopFolder = fsPath.split(contentFolder + pathSplitter);
    const head = beforeAfterTopFolder[0] ?? "";
    const lang = beforeAfterTopFolder[1]?.split(pathSplitter)[0];
    const tail = beforeAfterTopFolder[1]?.slice(lang.length) ?? "";
    // return {head, contentFolder, lang, tail};
    return path.join(head, contentFolder, targetLang, tail)
}
