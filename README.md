<div align="center">

<h1>RSQL</h1>
<p>RSQL compiler and parser for Node.js and Browsers</p>
<p>⚠️ WARNING: This package is still in development - please don't use it on production! ⚠️</p>

[![lerna](https://img.shields.io/badge/maintained%20with-lerna-cc00ff.svg)](https://lerna.js.org/)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg)](https://github.com/prettier/prettier)
[![commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)
[![tested with jest](https://img.shields.io/badge/tested_with-jest-99424f.svg)](https://github.com/facebook/jest)
[![auto release](https://img.shields.io/badge/release-auto.svg?colorA=888888&colorB=9B065A&label=auto)](https://github.com/intuit/auto)

</div>

## Packages 📦

This repository is a monorepo. That means it contains several packages scoped in the `@rsql/` namespace.

| Package                                                 | Version                                                                                                   | Description                        |
| ------------------------------------------------------- | --------------------------------------------------------------------------------------------------------- | ---------------------------------- |
| [`@rsql/builder`](./packages/builder/README.md)         | [![npm](https://img.shields.io/npm/v/@rsql/builder)](https://www.npmjs.com/package/@rsql/builder)         | API for building RSQL queries      |
| [`@rsql/parser`](./packages/parser/README.md)           | [![npm](https://img.shields.io/npm/v/@rsql/parser)](https://www.npmjs.com/package/@rsql/parser)           | RSQL parser `string => AST`        |
| [`@rsql/emitter`](./packages/emitter/README.md)         | [![npm](https://img.shields.io/npm/v/@rsql/emitter)](https://www.npmjs.com/package/@rsql/emitter)         | RSQL emitter `AST => string`       |
| [`@rsql/ast`](./packages/ast/README.md)                 | [![npm](https://img.shields.io/npm/v/@rsql/ast)](https://www.npmjs.com/package/@rsql/ast)                 | RSQL AST definitions (internal)    |
| [`@rsql/definitions`](./packages/definitions/README.md) | [![npm](https://img.shields.io/npm/v/@rsql/definitions)](https://www.npmjs.com/package/@rsql/definitions) | RSQL shared definitions (internal) |

## Installation 🚀

```
# with npm
npm install --save @rsql/builder

# with yarn
yarn add @rsql/builder
```

## Usage

## License

MIT
