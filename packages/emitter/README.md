# @rsql/emitter

RSQL emitter for Node.js and Browsers

[![npm](https://img.shields.io/npm/v/@rsql/emitter)](https://www.npmjs.com/package/@rsql/emitter)
[![lerna](https://img.shields.io/badge/maintained%20with-lerna-cc00ff.svg)](https://lerna.js.org/)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg)](https://github.com/prettier/prettier)
[![commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)
[![tested with jest](https://img.shields.io/badge/tested_with-jest-99424f.svg)](https://github.com/facebook/jest)
[![auto release](https://img.shields.io/badge/release-auto.svg?colorA=888888&colorB=9B065A&label=auto)](https://github.com/intuit/auto)

## Installation

```sh
# with npm
npm install --save @rsql/emitter

# with yarn
yarn add @rsql/emitter
```

## API

#### `emit(expression: ExpressionNode, options?: EmitOptions): string`

Emits RSQL string from the Abstract Syntax Tree. The second parameter to `emit` is an optional object with the following
fields:

- `preferredQuote` - Optional string. The preferred quote character to use when `emit` encounters a comparison value
  that needs to be escaped by wrapping in quotes. Either `"` (the ASCII double quote character) or `'` (the ASCII single
  quote character). Defaults to `"` (the ASCII double quote character).

- `optimizeQuotes` - Optional boolean. If `true`, `emit` will override the `preferredQuote` setting on a comparison
  value-by-comparison value basis if doing so would shorten the emitted RSQL. If `false`, `emit` will use the
  `preferredQuote` as the quote character for all comparison values encountered. Defaults to `true`.

`emit` can throw the following errors:

- `TypeError` - in the case of invalid argument type passed to the `emit` function

## License

MIT
