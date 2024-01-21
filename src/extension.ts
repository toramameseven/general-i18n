/* 
original code is licensed under the MIT License, Copyright © HiDeoo.
See [LICENSE](https://github.com/HiDeoo/starlight-i18n/blob/main/LICENSE) for more information. 
*/

import { relative } from 'node:path'

import { commands, type ExtensionContext, window, workspace, Uri } from 'vscode'

import { getLocalesInConfig, } from './libs/content'
import { getStarlightLocalesConfig } from './libs/starlightAst';
import { getStarlightUris, type StarlightUris } from './libs/starlightConfigUri';
import { toml } from './libs/toml';
import { pickTranslationGeneral, prepareTranslationX } from './libs/translation'
import { isWorkspaceWithSingleFolder, outputLog } from './libs/vsc'


export function activate(context: ExtensionContext): void {
  context.subscriptions.push(
    commands.registerCommand('general-i18n.start', openSourceTranslation),
    commands.registerCommand('starlight-i18n.test', toml),
  )

  outputLog('general i18n ready');
}

/**
 * 
 * @param uriFile
 */
async function openSourceTranslation(uriFile: Uri) {
  try {
    if (!isWorkspaceWithSingleFolder(workspace.workspaceFolders)) {
      throw new Error('Starlight i18n only supports single folder workspaces.')
    }

    const starlightUris = await getStarlightUris(
      workspace.workspaceFolders[0],
      workspace.getConfiguration('starlight-i18n').get<string[]>('configDirectories') ?? ['.'],
    )

    if (!starlightUris) {
      throw new Error('Failed to find a Starlight instance in the current workspace.')
    }

    const fileSet = await createFileSet(starlightUris, uriFile)
    outputLog(`========================>`)
    outputLog(`fileSet: ${fileSet.isContent}`)
    outputLog(`fileSet: ${fileSet.source.toString()}`)
    outputLog(`fileSet: ${fileSet.translation.toString()}`)

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

async function createFileSet(starlightUris: StarlightUris, uriFile: Uri) {
  const directorySeparatorChar = process.platform === 'win32' ? '\\' : '/'
  const localesConfig = await getStarlightLocalesConfig(starlightUris.config)
  // localesConfig.locales does not include default
  const allLocales = Object.entries(localesConfig.locales)
  const relativePathToDocs = relative(starlightUris.content.fsPath, uriFile.fsPath)
  const [firstPath, ...restPath] = relativePathToDocs.split(directorySeparatorChar)
  // if not defaultLocale, localeEntry is true.
  const localeEntry = allLocales.find(([directory]) => directory === firstPath)
  const isContent = !!localeEntry || firstPath !== '..'

  if (!isContent){
    return {
      isContent,
      source: Uri.joinPath(starlightUris.content, ""),
      translation: Uri.joinPath(starlightUris.content, ""),
    }
  }

  let fileIdWithoutLocale = ''
  if (localeEntry) {
    fileIdWithoutLocale = restPath.join(directorySeparatorChar)
  } else {
    fileIdWithoutLocale = localesConfig.isUseRoot ? relativePathToDocs : restPath.join(directorySeparatorChar)
  }

  const sourceLocaleDirectory = localesConfig.isUseRoot ? '' : localesConfig.defaultLocale
  const source = Uri.joinPath(starlightUris.content, sourceLocaleDirectory, fileIdWithoutLocale)
  
  const locales = getLocalesInConfig(localesConfig)
  let translationLocaleDirectory = ''
  if (localeEntry && firstPath) {
    translationLocaleDirectory = firstPath;
  } else {
    const localePickItem = await pickTranslationGeneral(locales)
    translationLocaleDirectory = localePickItem?.localeDirectory ?? ''
  }
  const translation = Uri.joinPath(starlightUris.content, translationLocaleDirectory, fileIdWithoutLocale)

  const fileSet = {
    isContent,
    source,
    translation,
  }

  return fileSet
}

export interface FileSet {
  isContent: boolean,
  source: Uri,
  translation: Uri,
}
