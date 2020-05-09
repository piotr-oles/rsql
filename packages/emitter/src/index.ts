import {
  AND,
  AND_VERBOSE,
  isLogicOperator,
  OR,
  OR_VERBOSE,
  ReservedChars,
  ComparisionNode,
  ExpressionNode,
  isComparisionNode,
  isLogicNode,
  LogicNode,
  SelectorNode,
  ValueNode,
} from "@rsql/ast";

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

function escapeValue(value: string, quote: '"' | "'" = '"') {
  if (ReservedChars.some((reservedChar) => value.includes(reservedChar))) {
    return `${quote}${escapeQuotes(value, quote)}${quote}`;
  }

  return value;
}

function emitSelector(node: SelectorNode) {
  return node.selector;
}

function emitValue(node: ValueNode, quote: '"' | "'" = '"') {
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
  if (isLogicOperator(node.operator, AND)) {
    if (isLogicNode(node.left, OR)) {
      left = `(${left})`;
    }
    if (isLogicNode(node.right, OR)) {
      right = `(${right})`;
    }
  }

  // for verbose operator add space before and after operator
  const operator = node.operator === AND_VERBOSE || node.operator === OR_VERBOSE ? ` ${node.operator} ` : node.operator;

  return `${left}${operator}${right}`;
}

function emit(expression: ExpressionNode): string {
  if (isComparisionNode(expression)) {
    return emitComparision(expression);
  } else if (isLogicNode(expression)) {
    return emitLogic(expression);
  }

  throw new TypeError(`The "expression" has to be a valid "ExpressionNode", ${String(expression)} passed.`);
}

export { emit };
