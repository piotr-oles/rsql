<div align="center">

<h1>RSQL / FIQL</h1>
<p>RSQL emitter and parser for Node.js and Browsers</p>
<p>⚠️ WARNING: This package is still in development - API may break compatibility without upgrading major version! ⚠️</p>

[![lerna](https://img.shields.io/badge/maintained%20with-lerna-cc00ff.svg)](https://lerna.js.org/)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg)](https://github.com/prettier/prettier)
[![commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)
[![tested with jest](https://img.shields.io/badge/tested_with-jest-99424f.svg)](https://github.com/facebook/jest)
[![auto release](https://img.shields.io/badge/release-auto.svg?colorA=888888&colorB=9B065A&label=auto)](https://github.com/intuit/auto)

</div>

> RSQL is a query language for parametrized filtering of entries in RESTful APIs. It’s based on FIQL
> (Feed Item Query Language) – an URI-friendly syntax for expressing filters across the entries in an Atom Feed.
> FIQL is great for use in URI; there are no unsafe characters, so URL encoding is not required. On the other side,
> FIQL’s syntax is not very intuitive and URL encoding isn’t always that big deal, so RSQL also provides a friendlier
> syntax for logical operators and some of the comparison operators.
>
> For example, you can query your resource like this: /movies?query=name=="Kill Bill";year=gt=2003 or
> /movies?query=director.lastName==Nolan and year>=2000. See examples below.
>
> Source: https://github.com/jirutka/rsql-parser

## Packages

This repository is a monorepo which means that it contains several packages.
All packages are published on the [npm registry](https://www.npmjs.com/) under the `@rsql/` scope.

| Package                               | Version                                                                                           | Size                                                          | Description                        |
| ------------------------------------- | ------------------------------------------------------------------------------------------------- | ------------------------------------------------------------- | ---------------------------------- |
| [`@rsql/builder`](./packages/builder) | [![npm](https://img.shields.io/npm/v/@rsql/builder)](https://www.npmjs.com/package/@rsql/builder) | ![size](https://badgen.net/bundlephobia/minzip/@rsql/builder) | Simple API for building RSQL       |
| [`@rsql/parser`](./packages/parser)   | [![npm](https://img.shields.io/npm/v/@rsql/parser)](https://www.npmjs.com/package/@rsql/parser)   | ![size](https://badgen.net/bundlephobia/minzip/@rsql/parser)  | RSQL parser `string => AST`        |
| [`@rsql/emitter`](./packages/emitter) | [![npm](https://img.shields.io/npm/v/@rsql/emitter)](https://www.npmjs.com/package/@rsql/emitter) | ![size](https://badgen.net/bundlephobia/minzip/@rsql/emitter) | RSQL emitter `AST => string`       |
| [`@rsql/ast`](./packages/ast)         | [![npm](https://img.shields.io/npm/v/@rsql/ast)](https://www.npmjs.com/package/@rsql/ast)         | ![size](https://badgen.net/bundlephobia/minzip/@rsql/ast)     | RSQL AST definitions and functions |

> Each package contains more detailed documentation. To learn more, click on the links above.

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

## Grammar

Based on the following specification: https://github.com/jirutka/rsql-parser#grammar-and-semantic

## Custom operators

By default RSQL defines 8 built-in comparison operators: `==`, `!=`, `<`, `>`, `<=`, `>=`, `=in=`, and `=out=`.
You can define your custom operators - the only requirement is that they have to satisfy
following regular expression: `/=[a-z]+=/` (FIQL operator). The parser will accept any comparison that contains
a valid operator. Because of that, you don't have to register it. Instead, we suggest defining your grammar
as a module. Here is an example how you can define `=all=` and `=empty=` operator:

```typescript
// src/rsql/ast.ts
const ALL = "=all=";
const EMPTY = "=empty=";

export * from "@rsql/ast";
export { ALL, EMPTY };

// src/rsql/builder.ts
import builder from "@rsql/builder";
import { ALL, EMPTY } from "./ast";

export default {
  ...builder,
  all(selector: string, values: string[]) {
    return builder.comparison(selector, ALL, values);
  },
  empty(selector: string, empty: boolean) {
    return builder.comparison(selector, EMPTY, empty ? "yes" : "no");
  },
};
```

## Example

```typescript
// parsing
import { parse } from "@rsql/parser";
const expression = parse("year>=2003");

// exploring
import { isComparisonNode, getSelector, getValue } from "@rsql/ast";
if (isComparisonNode(expression)) {
  console.log(`Selector: ${getSelector(expression)}`);
  // > Selector: year
  console.log(`Operator: ${expression.operator}`);
  // > Operator: >=
  console.log(`Value: ${getValue(expression)}`);
  // > Value: 2003
}

// building
import builder from "@rsql/builder";
const newExpression = builder.and(expression, builder.le("year", "2020"));

// emitting
import { emit } from "@rsql/emitter";
const rsql = emit(newExpression);
console.log(`Emitted: ${rsql}`);
// > Emitted: year>=2003;year<=2020
```

## License

MIT
