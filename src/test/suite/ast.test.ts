/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
// import { expect, test } from 'vitest'
import * as assert from 'node:assert';

//import { expect } from 'chai';


import { expect } from 'vitest';

import { getStarlightLocalesConfigFromCode } from '../../libs/starlightAst'

// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-var-requires
// const expect = require('chai').expect

const commonLocales = `{
  root: { label: 'English', lang: 'en' },
  ja: { label: '日本語', lang: 'ja' },
  fr: { label: 'Français', lang: 'fr' },
  'pt-br': { label: 'Português do Brasil', lang: 'pt-BR' },
}`

const expectedCommonLocales = {
  fr: {
    label: 'Français',
    lang: 'fr',
  },
  ja: {
    label: '日本語',
    lang: 'ja',
  },
  'pt-br': {
    label: 'Português do Brasil',
    lang: 'pt-BR',
  },
}

describe('Extension Test Suite', () => {
  it('finds locales inlined in the configuration', () => {
    const config = getStarlightLocalesConfigFromCode(`import { defineConfig } from 'astro/config';
  import starlight from '@astrojs/starlight';
  
  export default defineConfig({
    integrations: [
      starlight({
        title: 'Starlight',
        locales: ${commonLocales},
      }),
    ],
  });`)
  
  //assert.equal(1,1)
    expect(config.defaultLocale).be('en')
    //expect(config.locales).equal(expectedCommonLocales)
  })
  
  
})