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
- Well tested (well, in progress) 🧐

## Example

The following example is taken from a real application.
It's a complex one, but presents different features in a one place.

```typescript
import builder from "@rsql/builder";
import {
  AND,
  OR,
  GE,
  GT,
  LE,
  LT,
  isLogicNode,
  isComparisionNode,
  getSelector,
  getValue,
  ExpressionNode,
} from "@rsql/ast";
import { emit } from "@rsql/emitter";
import { parse } from "@rsql/parser";

/**
 * We are building date filter which works in 4 different modes
 */
type DateSingleFilter = {
  mode: "from" | "to";
  value: Date;
};
type DateRangeFilter = {
  mode: "between" | "exclude";
  value: [Date, Date];
};
type DateFilter = DateSingleFilter | DateRangeFilter;

/**
 * This function encodes DateFilter as a RSQL expression
 */
function encodeDateFilter(key: string, filter: DateFilter): ExpressionNode | undefined {
  switch (filter.mode) {
    case "from":
      return filter.value ? builder.ge(key, filter.value.valueOf()) : undefined;

    case "to":
      return filter.value ? builder.le(key, filter.value.valueOf()) : undefined;

    case "between":
      return Array.isArray(filter.value)
        ? builder.and(builder.ge(key, filter.value[0].valueOf()), builder.le(key, filter.value[1].valueOf()))
        : undefined;

    case "exclude":
      return Array.isArray(filter.value)
        ? builder.or(builder.lt(key, filter.value[0].valueOf()), builder.gt(key, filter.value[1].valueOf()))
        : undefined;
  }
}

/**
 * This functions decodes RSQL expression to DateFilter
 */
function decodeDateFilter(key: string, expression: ExpressionNode): DateFilter | undefined {
  if (isComparisionNode(expression) && getSelector(expression) === key) {
    // this is a potential case for "from" and "to" mode
    const value = getValue(expression);
    const timestamp = Array.isArray(value) ? NaN : Number(value);

    if (Number.isFinite(timestamp)) {
      if (isComparisionNode(expression, GE) || isComparisionNode(expression, GT)) {
        return {
          mode: "from",
          value: new Date(timestamp),
        };
      } else if (isComparisionNode(expression, LE) || isComparisionNode(expression, LT)) {
        return {
          mode: "to",
          value: new Date(timestamp),
        };
      }
    }
  } else if (
    isLogicNode(expression) &&
    isComparisionNode(expression.left) &&
    isComparisionNode(expression.right) &&
    getSelector(expression.left) === key &&
    getSelector(expression.right) === key
  ) {
    // this is a potential case for "between" and "exclude" mode
    const range: Date[] = [];

    [expression.left, expression.right].forEach((comparision) => {
      const value = getValue(comparision);
      const timestamp = Array.isArray(value) ? NaN : Number(value);

      if (Number.isFinite(timestamp)) {
        const date = new Date(timestamp);

        if (isComparisionNode(comparision, GE) || isComparisionNode(comparision, GT)) {
          range[0] = date;
        } else if (isComparisionNode(comparision, LE) || isComparisionNode(comparision, LT)) {
          range[1] = date;
        }
      }
    });

    if (range.length === 2) {
      if (range[0] <= range[1] && isLogicNode(expression, AND)) {
        return {
          mode: "between",
          value: [range[0], range[1]],
        };
      } else if (range[0] > range[1] && isLogicNode(expression, OR)) {
        return {
          mode: "exclude",
          value: [range[1], range[0]],
        };
      }
    }
  }
}

// test decoding
{
  const expression = parse("updatedAt<1588880606434,updatedAt>1588880746326");
  const filter = decodeDateFilter("updatedAt", expression);
  console.log(filter);
  // { mode: "exclude", value: ["2020-05-07T19:43:26.434Z", "2020-05-07T19:45:46.326Z"] }
}

// test encoding
{
  const filter: DateSingleFilter = {
    mode: "from",
    value: new Date("2020-05-07T19:47:08.507"),
  };
  const expression = encodeDateFilter("updatedAt", filter);
  const rsql = expression ? emit(expression) : undefined;
  console.log(rsql);
  // updatedAt>=1588873628507
}
```

## License

MIT
