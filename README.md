<div align="center">

<h1>RSQL</h1>
<p>RSQL compiler and parser for Node.js and Browsers</p>
<p>⚠️ WARNING: This package is still in development - API may break compatibility without upgrading major version! ⚠️</p>

[![lerna](https://img.shields.io/badge/maintained%20with-lerna-cc00ff.svg)](https://lerna.js.org/)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg)](https://github.com/prettier/prettier)
[![commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)
[![tested with jest](https://img.shields.io/badge/tested_with-jest-99424f.svg)](https://github.com/facebook/jest)
[![auto release](https://img.shields.io/badge/release-auto.svg?colorA=888888&colorB=9B065A&label=auto)](https://github.com/intuit/auto)

</div>

## Packages

This repository is a monorepo. That means it contains several packages scoped in the `@rsql/` namespace.

| Package                                                 | Version                                                                                                   | Description                              |
| ------------------------------------------------------- | --------------------------------------------------------------------------------------------------------- | ---------------------------------------- |
| [`@rsql/builder`](./packages/builder/README.md)         | [![npm](https://img.shields.io/npm/v/@rsql/builder)](https://www.npmjs.com/package/@rsql/builder)         | High level API for building RSQL         |
| [`@rsql/parser`](./packages/parser/README.md)           | [![npm](https://img.shields.io/npm/v/@rsql/parser)](https://www.npmjs.com/package/@rsql/parser)           | RSQL parser `string => AST`              |
| [`@rsql/emitter`](./packages/emitter/README.md)         | [![npm](https://img.shields.io/npm/v/@rsql/emitter)](https://www.npmjs.com/package/@rsql/emitter)         | RSQL emitter `AST => string`             |
| [`@rsql/ast`](./packages/ast/README.md)                 | [![npm](https://img.shields.io/npm/v/@rsql/ast)](https://www.npmjs.com/package/@rsql/ast)                 | RSQL AST definitions (low level API)     |
| [`@rsql/definitions`](./packages/definitions/README.md) | [![npm](https://img.shields.io/npm/v/@rsql/definitions)](https://www.npmjs.com/package/@rsql/definitions) | RSQL Symbols definitions (low level API) |

## Installation

```
# with npm
npm install --save @rsql/builder

# with yarn
yarn add @rsql/builder
```

## Features

- Fast LALR(1) implementation 🏎
- Small package size and 0 dependencies (because it was written by hand, not generated) 🚀
- Works both in Node.js and Browser environment 👌
- First class TypeScript support ✨
- Highly modular code - use what you really need 📦
- Well tested (in progress) 🧐

## Parsing

To parse a query, you can use `@rsql/builder` or `@rsql/parser` package. The builder package includes both
parser and emitter, so if your application only parses RSQL, it's better to use `@rsql/parser` directly.

```javascript
// @rsql/builder
import builder from "@rsql/builder";

const ast = builder.parse("user.email==admin@example.com");
```

```javascript
// @rsql/parser
import { parse } from "@rsql/parser";

const ast = parse("user.email==admin@example.com");
```

> You can find more information about the `parse` function in the [`@rsql/parser`](packages/parser/README.md) package.

## Processing AST

To process AST, you can use `@rsql/ast` package which contains AST nodes factories and guards.

```javascript
import { isAndNode, isComparisionNode, isGeNode, isLeNode } from "@rsql/ast";

/**
 * Maps "selector>={timestamp};selector<={timestamp}" to date range array
 *
 * @param {ExpressionNode} expression
 * @returns {[Date, Date] | undefined}
 */
function mapExpressionToDateRange(expression) {
  const range = [];

  if (
    isAndNode(expression) &&
    isComparisionNode(expression.left) &&
    isComparisionNode(expression.right) &&
    expression.left.left.selector === expression.right.left.selector
  ) {
    [expression.left, expression.right].forEach((comparision) => {
      const timestamp = Number(comparision.right.value);
      if (Number.isFinite(timestamp) && timestamp > 0) {
        const date = new Date(timestamp);

        if (isGeNode(comparision)) {
          range[0] = date;
        } else if (isLeNode(comparision)) {
          range[1] = date;
        }
      }
    });
  }

  if (range[0] instanceof Date && range[1] instanceof Date) {
    return range;
  } else {
    return undefined;
  }
}
```

> You can find more information about the AST and Symbols API in the [`@rsql/ast`](packages/ast/README.md) and [`@rsql/definition`](packages/definitions/README.md) packages.

## Building AST

To build AST, you can use `@rsql/builder` or `@rsql/ast` package.

```javascript
import builder from "@rsql/builder";

/**
 * Maps date range to expression node.
 *
 * @param {string} key
 * @param {[Date, Date] | undefined} range
 * @returns {ExpressionNode | undefined}
 */
function mapDateRangeToExpression(key, range) {
  if (Array.isArray(range)) {
    const [from, to] = range;

    return builder.and(builder.ge(key, from.valueOf().toString()), builder.le(key, to.valueOf().toString()));
  } else {
    return undefined;
  }
}
```

> You can find more information about the Builder API in the [`@rsql/builder`](packages/builder/README.md) package.

## Emitting

Similar to the parsing, you can use `@rsql/builder` or `@rsql/emitter` package.

```javascript
// @rsql/builder
import builder from "@rsql/builder";

const rsql = builder.emit(ast);
```

```javascript
// @rsql/emitter
import { emit } from "@rsql/emitter";

const rsql = emit(ast);
```

> You can find more information about the `emit` function in the [`@rsql/emitter`](packages/emitter/README.md) package.

## License

MIT
