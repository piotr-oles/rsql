# @rsql/parser

RSQL parser for Node.js and Browsers

⚠️ WARNING: This package is still in development - API may break compatibility without upgrading major version! ⚠️

[![npm](https://img.shields.io/npm/v/@rsql/parser)](https://www.npmjs.com/package/@rsql/parser)
[![lerna](https://img.shields.io/badge/maintained%20with-lerna-cc00ff.svg)](https://lerna.js.org/)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg)](https://github.com/prettier/prettier)
[![commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)
[![tested with jest](https://img.shields.io/badge/tested_with-jest-99424f.svg)](https://github.com/facebook/jest)
[![auto release](https://img.shields.io/badge/release-auto.svg?colorA=888888&colorB=9B065A&label=auto)](https://github.com/intuit/auto)

## Installation

```sh
# with npm
npm install --save @rsql/parser

# with yarn
yarn add @rsql/parser
```

## API

#### `parse(source: string): ExpressionNode`

Parses RSQL string and returns Abstract Syntax Tree. It can throw the following errors:

- `TypeError` - in the case of invalid argument type passed to the `parse` function
- `SyntaxError` - in the case of any problems encountered during parsing

## License

MIT
