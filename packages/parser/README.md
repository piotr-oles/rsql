<div align="center">

<h1>@rsql/parser</h1>
<p>RSQL parser for Node.js and Browsers</p>
<p>⚠️ WARNING: This package is still in development - API may break compatibility without upgrading major version! ⚠️</p>

[![npm](https://img.shields.io/npm/v/@rsql/parser)](https://www.npmjs.com/package/@rsql/parser)
[![lerna](https://img.shields.io/badge/maintained%20with-lerna-cc00ff.svg)](https://lerna.js.org/)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg)](https://github.com/prettier/prettier)
[![commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)
[![tested with jest](https://img.shields.io/badge/tested_with-jest-99424f.svg)](https://github.com/facebook/jest)
[![auto release](https://img.shields.io/badge/release-auto.svg?colorA=888888&colorB=9B065A&label=auto)](https://github.com/intuit/auto)

</div>

## Installation

```sh
# with npm
npm install --save @rsql/parser

# with yarn
yarn add @rsql/parser
```

## API

#### `parse(rsql: string): ExpressionNode`

Parses RSQL string and returns Abstract Syntax Tree. It can throw the following errors:

- `InvalidArgumentError` - in the case of invalid argument type passed to the `parse` function
- `ParsingError` - in the case of any problems encountered during parsing

#### `new ParsingError(message: string, source: string)`

A runtime error that should be thrown in the case of encountering any problem with the parsing
(invalid character, invalid token, etc.)

## Example

```javascript
import { parse, ParsingError } from "@rsql/parser";
import { isEqNode, getSingleValue } from "@rsql/ast";

function getUserNameFromRsql(rsql) {
  let ast;

  try {
    ast = parse(rsql);
  } catch (error) {
    if (error instanceof ParsingError) {
      return undefined;
    } else {
      throw error;
    }
  }

  if (isEqNode(ast) && getSelector(ast) === "user.name") {
    return getSingleValue(ast);
  } else {
    return undefined;
  }
}
```

## License

MIT
