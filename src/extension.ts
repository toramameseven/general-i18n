/* 
original code is licensed under the MIT License, Copyright © HiDeoo.
See [LICENSE](https://github.com/HiDeoo/starlight-i18n/blob/main/LICENSE) for more information. 
*/

import { commands, type ExtensionContext, window, workspace, Uri } from 'vscode'


import { mdPathInfo, pickTranslationGeneral, prepareTranslationX } from './translation'
import { isWorkspaceWithSingleFolder, outputLog } from './vsc'


export function activate(context: ExtensionContext): void {
  context.subscriptions.push(
    commands.registerCommand('general-i18n.start', openOtherTranslation),
  )
  outputLog('general i18n ready');
}

async function openOtherTranslation(uriFile: Uri) {
  try {
    if (!isWorkspaceWithSingleFolder(workspace.workspaceFolders)) {
      throw new Error('Starlight i18n only supports single folder workspaces.')
    }



    // if (!pathInfo.head) {
    //   throw new Error('Failed to find a content folder.')
    // }

    const locales = {
      en:{
        lang: "en",
        label: "english"
      },
      ja:{
        lang: "ja",
        label: "日本語"
      }
    }

    const localePickItem = await pickTranslationGeneral(locales)
    const pathInfo = mdPathInfo(uriFile.fsPath, localePickItem?.locale.lang ?? "");

    const fileSet:FileSet = {
      source: uriFile,
      translation:Uri.file(pathInfo),
      isContent: true
    }


    outputLog(`========================>`)
    localePickItem
    outputLog(`label: ${localePickItem?.label}`)
    // outputLog(`fileSet: ${fileSet.source.toString()}`)
    // outputLog(`fileSet: ${fileSet.translation.toString()}`)

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
