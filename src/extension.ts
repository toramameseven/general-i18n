/* 
original code is licensed under the MIT License, Copyright © HiDeoo.
See [LICENSE](https://github.com/HiDeoo/starlight-i18n/blob/main/LICENSE) for more information. 
*/

import { commands, type ExtensionContext, window, workspace, Uri } from 'vscode'


import { getTranslationJs, mdPathInfo as makeOtherLangFile, getTranslationInfo, getLang } from './sample'
import { pickTranslationGeneral, prepareTranslationX } from './translation'
import { isWorkspaceWithSingleFolder, outputLog } from './vsc'


export function activate(context: ExtensionContext): void {
  context.subscriptions.push(
    commands.registerCommand('general-i18n.start', openOtherLangFile),
  )
  outputLog('general i18n ready');
}

async function openOtherLangFile(uriFile: Uri) {
  try {
    if (!isWorkspaceWithSingleFolder(workspace.workspaceFolders)) {
      // throw new Error('General i18n only supports single folder workspaces.')
    }
    const translationJs = getTranslationJs(uriFile.fsPath);
    if (!translationJs){
      throw new Error('No .translation.js file.')
    }
    
    
    const translationInfo = getTranslationInfo(translationJs);
    const lang = getLang(uriFile.fsPath, translationInfo);
    if (!lang){
      throw new Error('No language')
    }

    delete translationInfo.locales[lang];
    const locales = translationInfo.locales;

    const localePickItem = await pickTranslationGeneral(locales)
    const pathInfo = makeOtherLangFile(uriFile.fsPath, localePickItem?.locale.lang ?? "", translationInfo.contentFolder);

    const fileSet: FileSet = {
      source: uriFile,
      translation: Uri.file(pathInfo),
      isContent: true
    }

    await prepareTranslationX(fileSet)
  } catch (error) {
    const isError = error instanceof Error
    const message = isError ? error.message : 'Something went wrong!'

    outputLog(message)

    if (isError && error.stack) {
      outputLog(error.stack)
    }

    await window.showErrorMessage(message)
  }
}

export interface FileSet {
  isContent: boolean,
  source: Uri,
  translation: Uri,
}
