import * as assert from 'node:assert';

// You can import and use all API from the 'vscode' module
// as well as import your extension to test it
// import * as vscode from 'vscode';
// import * as myExtension from '../extension';

import { getTranslationJs } from '../sample'
import path from 'node:path';


suite('Extension Test Suite', () => {
  // suiteTeardown(() => {
  //   void vscode.window.showInformationMessage('All tests done!');
  // });

  const myPath = path.resolve(__dirname, "../../demo/.translation.js")

  const locales = getTranslationJs(myPath);

  // eslint-disable-next-line no-console
  console.log("%o", locales)

  test('Sample test', () => {
    assert.strictEqual(-1, [1, 2, 3].indexOf(5));
    assert.strictEqual(-1, [1, 2, 3].indexOf(0));
  });
});