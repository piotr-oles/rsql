# @rsql/builder

API for building RSQL for Node.js and Browsers

⚠️ WARNING: This package is still in development - API may break compatibility without upgrading major version! ⚠️

[![npm](https://img.shields.io/npm/v/@rsql/builder)](https://www.npmjs.com/package/@rsql/builder)
[![lerna](https://img.shields.io/badge/maintained%20with-lerna-cc00ff.svg)](https://lerna.js.org/)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg)](https://github.com/prettier/prettier)
[![commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)
[![tested with jest](https://img.shields.io/badge/tested_with-jest-99424f.svg)](https://github.com/facebook/jest)
[![auto release](https://img.shields.io/badge/release-auto.svg?colorA=888888&colorB=9B065A&label=auto)](https://github.com/intuit/auto)

## Installation

```sh
# with npm
npm install --save @rsql/builder

# with yarn
yarn add @rsql/builder
```

## API

#### `builder.comparision(selector, operator, value): ComparisionNode`

Creates new `ComparisionNode` - similar to the `createComparisionNode` from the [`@rsql/ast`](../ast)
but with simpler API (no need to create `SelectorNode` or `ValueNode` and accepts numbers as values)

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

#### `builder.logic(expressions, operator): LogicNode`

Creates new `LogicNode` - similar to the `createLogicNode` from the [`@rsql/ast`](../ast)
but with simpler API (accepts one or more expressions)

#### `builder.<operator>(...expressions): LogicNode`

```
builder.and(...expressions): LogicNode
builder.or(...expressions): LogicNode
```

Creates new `LogicNode` with the predefined operator for one or more expressions.

## License

MIT
