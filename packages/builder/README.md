<div align="center">

<h1>@rsql/builder</h1>
<p>High level API for RSQL for Node.js and Browsers</p>
<p>⚠️ WARNING: This package is still in development - API may break compatibility without upgrading major version! ⚠️</p>

[![npm](https://img.shields.io/npm/v/@rsql/builder)](https://www.npmjs.com/package/@rsql/builder)
[![lerna](https://img.shields.io/badge/maintained%20with-lerna-cc00ff.svg)](https://lerna.js.org/)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg)](https://github.com/prettier/prettier)
[![commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)
[![tested with jest](https://img.shields.io/badge/tested_with-jest-99424f.svg)](https://github.com/facebook/jest)
[![auto release](https://img.shields.io/badge/release-auto.svg?colorA=888888&colorB=9B065A&label=auto)](https://github.com/intuit/auto)

</div>

## Installation

```sh
# with npm
npm install --save @rsql/builder

# with yarn
yarn add @rsql/builder
```

## API

#### `builder.comparision(selector, operator, value): ComparisionNode`

Creates new `ComparisionNode` - can be used as a base for custom operator factory

#### `builder.<operator>(selector, value): ComparisionNode`

```
builder.eq(selector, value): ComparisionNode
builder.neq(selector, value): ComparisionNode
builder.le(selector, value): ComparisionNode
builder.lt(selector, value): ComparisionNode
builder.ge(selector, value): ComparisionNode
builder.gt(selector, value): ComparisionNode
```

Creates new `ComparisionNode` with the predefined operator for single value.

#### `builder.<operator>(selector, values): ComparisionNode`

```
builder.in(selector, values): ComparisionNode
builder.out(selector, values): ComparisionNode
```

Creates new `ComparisionNode` with the predefined operator for multiple values.

#### `builder.<operator>(...expressions): LogicNode`

```
builder.and(...expressions): LogicNode
builder.or(...expressions): LogicNode
```

Creates new `LogicNode` with the predefined operator for one or more expressions.

#### `builder.emit(ast): string`

Emits RSQL string from the Abstract Syntax Tree. Same as `emit` function from `@rsql/emitter` package.

#### `builder.parse(rsql): ExpressionNode`

Parses RSQL string and returns Abstract Syntax Tree. Same as `parse` function from `@rsql/parser` package.

## Example

```javascript
import builder from "@rsql/builder";

function createDateRangeQuery(selector, from, to) {
  return builder.emit(builder.and(builder.ge(selector, from.toISOString()), builder.le(selector, to.toISOString())));
}

console.log(createDateRangeQuery("createdAt", new Date("2019-07-10"), new Date("2020-04-29")));
// createdAt>=2019-07-10T00:00:00.000Z;createAt<=2020-04-29T00:00:00.000Z
```

## License

MIT
