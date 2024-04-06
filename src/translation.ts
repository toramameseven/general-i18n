import * as fs from 'node:fs';
import path from "node:path";

import {
  type Disposable,
  type QuickPick,
  type QuickPickItem,
  type QuickPickItemKind,
  ViewColumn,
  window,
  workspace,
} from 'vscode'

import type { FileSet } from './extension'


export async function pickTranslationGeneral(locales: Locales
): Promise<LocaleQuickPickItem | undefined> {
  const disposables: Disposable[] = []

  const picker: TranslationPicker = window.createQuickPick()
  picker.title = 'Starlight i18n'
  picker.enabled = false
  picker.busy = true
  picker.ignoreFocusOut = true
  picker.placeholder = 'Collecting page translations status…'
  picker.step = 1
  picker.totalSteps = 1

  try {
    // eslint-disable-next-line no-async-promise-executor
    return await new Promise((resolve, reject) => {
      function closePicker() {
        resolve(undefined)
      }

      disposables.push(
        picker.onDidAccept(() => {
          const item = picker.selectedItems[0]

          if (isLocaleQuickPickItem(item)) {
            resolve(item)
          } else {
            closePicker()
          }
        }),
      )

      picker.show()

      try {
        //const statuses = await getStatuses()
        const statuses = locales;

        picker.items = Object.entries(statuses).map(([localeDirectory, locale]) => ({
          description: locale.lang ?? localeDirectory,
          label: locale.label,
          locale,
          localeDirectory,
          statuses,
        }))
      } catch (error) {
        reject(error)
        return
      }

      picker.busy = false
      picker.enabled = true
      picker.placeholder = 'Select a locale to translate'
    })
  } finally {
    picker.dispose()

    for (const disposable of disposables) {
      disposable.dispose()
    }
  }
}



export function prepareTranslationX(translation: FileSet) {
  return prepareTranslationSet(translation)
}


async function prepareTranslationSet(fileSet: FileSet) {
  if (!fileSet.isContent){
    return
  }

  if (!fs.existsSync(fileSet.source.fsPath)) {
    await workspace.fs.writeFile(fileSet.source, new TextEncoder().encode(`---\n\n---\n`))
  }

  if (!fs.existsSync(fileSet.translation.fsPath)) {
    await workspace.fs.writeFile(fileSet.translation, new TextEncoder().encode(`---\n\n---\n`))
  }

  await window.showTextDocument(fileSet.source, { viewColumn: ViewColumn.One })
  await window.showTextDocument(fileSet.translation, { preview: false, viewColumn: ViewColumn.Two })
}



function isLocaleQuickPickItem(item: unknown): item is LocaleQuickPickItem {
  return typeof item === 'object' && item !== null && 'locale' in item && !('status' in item)
}


interface LocaleQuickPickItem extends QuickPickItem {
  locale: Locale
  localeDirectory: string
}

interface SeparatorQuickPickItem extends QuickPickItem {
  kind: QuickPickItemKind.Separator
}

type TranslationPickerItem = LocaleQuickPickItem | SeparatorQuickPickItem
type TranslationPicker = QuickPick<TranslationPickerItem>



export function mdPathInfo(fsPath: string, targetLang: string) {
    const contentFolder = "content";
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
    const tail = beforeAfterTopFolder[1]?.slice(lang?.length) ?? "";
    // return {head, contentFolder, lang, tail};
    return path.join(head, contentFolder, targetLang, tail)
}

type Locales = Record<
  string,
  Locale
>


interface Locale {
  label: string
  lang?: string
}
