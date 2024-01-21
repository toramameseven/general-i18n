/* 
original code is licensed under the MIT License, Copyright © HiDeoo.
See [LICENSE](https://github.com/HiDeoo/starlight-i18n/blob/main/LICENSE) for more information. 
*/

import { dirname } from 'node:path'

import { FileType, Uri, workspace, type WorkspaceFolder } from 'vscode'


// https://docs.astro.build/en/guides/configuring-astro/#supported-config-file-types
const configFileNames = new Set(['astro.config.mjs', 'astro.config.ts', 'astro.config.cjs', 'astro.config.js'])

export async function getStarlightUris(
  workspaceFolder: WorkspaceFolder,
  configDirectories: string[],
): Promise<StarlightUris | undefined> {
  const config = await getAstroConfigUri(workspaceFolder, configDirectories)

  if (!config) {
    return
  }

  return {
    config,
    content: Uri.joinPath(Uri.file(dirname(config.fsPath)), 'src', 'content', 'docs'),
    workspace: workspaceFolder.uri,
  }
}

async function getAstroConfigUri(workspaceFolder: WorkspaceFolder, configDirectories: string[]) {
  for (const configDirectory of configDirectories) {
    const uri = Uri.joinPath(workspaceFolder.uri, configDirectory)

    try {
      const entries = await workspace.fs.readDirectory(uri)

      for (const [name, type] of entries) {
        if (type === FileType.File && configFileNames.has(name)) {
          return Uri.joinPath(uri, name)
        }
      }
    } catch {
      // We can safely ignore errors related to missing directories.
    }
  }

  return undefined
}

export interface StarlightUris {
  config: Uri
  content: Uri
  workspace: Uri
}

