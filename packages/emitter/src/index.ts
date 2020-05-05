import {
  ComparisionNode,
  isComparisionNode,
  isLogicNode,
  isOrNode,
  isSelectorNode,
  isValueNode,
  LogicNode,
  Node,
  SelectorNode,
  ValueNode,
} from "@rsql/ast";
import {
  AND_VERBOSE,
  InvalidArgumentError,
  isAndOperatorSymbol,
  OR_VERBOSE,
  QuoteSymbol,
  ReservedChars,
} from "@rsql/definitions";

function escapeQuotes(value: string, quote: string) {
  let escapedValue = value;
  let previousPosition = 0;
  let currentPosition = value.indexOf(quote);

  while (currentPosition !== -1) {
    // scan back for escape characters
    let escaped = false;
    for (
      let scanPosition = currentPosition - 1;
      escapedValue[scanPosition] === "\\" && scanPosition > previousPosition;
      scanPosition--
    ) {
      escaped = !escaped;
    }

    // if it's not escaped - add backslash
    if (!escaped) {
      escapedValue = escapedValue.slice(0, currentPosition - 1) + "\\" + escapedValue.slice(currentPosition);
    }

    // move position forward
    previousPosition = currentPosition;
    currentPosition = value.indexOf(quote, previousPosition + 1);
  }

  return escapedValue;
}

function escapeValue(value: string, quote: QuoteSymbol = '"') {
  if (ReservedChars.some((reservedChar) => value.includes(reservedChar))) {
    return `${quote}${escapeQuotes(value, quote)}${quote}`;
  }

  return value;
}

function emitSelector(node: SelectorNode) {
  return node.selector;
}

function emitValue(node: ValueNode, quote: QuoteSymbol = '"') {
  return Array.isArray(node.value)
    ? `(${node.value.map((value) => escapeValue(value, quote)).join(",")})`
    : escapeValue(node.value, quote);
}

function emitComparision(node: ComparisionNode) {
  return `${emitSelector(node.left)}${node.operator}${emitValue(node.right)}`;
}

function emitLogic(node: LogicNode) {
  let left = emit(node.left);
  let right = emit(node.right);

  // handle operator precedence - as it's only the case for AND operator, we don't need a generic logic for that
  if (isAndOperatorSymbol(node.operator)) {
    if (isOrNode(node.left)) {
      left = `(${left})`;
    }
    if (isOrNode(node.right)) {
      right = `(${right})`;
    }
  }

  const operator = node.operator === AND_VERBOSE || node.operator === OR_VERBOSE ? ` ${node.operator} ` : node.operator;

  return `${left}${operator}${right}`;
}

function emit(ast: Node): string {
  if (isSelectorNode(ast)) {
    return emitSelector(ast);
  } else if (isValueNode(ast)) {
    return emitValue(ast);
  } else if (isComparisionNode(ast)) {
    return emitComparision(ast);
  } else if (isLogicNode(ast)) {
    return emitLogic(ast);
  }

  throw new InvalidArgumentError(
    `The argument passed to the "emit" function should be a RSQL AST, but "${
      ast === null ? "null" : typeof ast
    }" passed.`
  );
}

export { emit };
