/* 
original code is licensed under the MIT License, Copyright © HiDeoo.
See [LICENSE](https://github.com/HiDeoo/starlight-i18n/blob/main/LICENSE) for more information. 
*/

import { window, type WorkspaceFolder } from 'vscode'


const logger = window.createOutputChannel('general i18n')


export function isWorkspaceWithSingleFolder(
  workspaceFolders: readonly WorkspaceFolder[] | undefined,
): workspaceFolders is readonly [WorkspaceFolder] {
  return workspaceFolders !== undefined && workspaceFolders.length === 1
}

export function outputLog(message: string){
    logger.appendLine(message);
}

