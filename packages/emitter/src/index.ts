import {
  ComparisionExpressionNode,
  isComparisionExpressionNode,
  isLogicExpressionNode,
  isSelectorNode,
  isValueNode,
  LogicExpressionNode,
  Node,
  SelectorNode,
  ValueNode,
} from "@rsql/ast";
import { InvalidArgumentError, QuoteSymbol, ReservedChars } from "@rsql/definitions";

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

function emitComparisionExpression(node: ComparisionExpressionNode) {
  return `${emitSelector(node.left)}${node.operator}${emitValue(node.right)}`;
}

function emitLogicExpression(node: LogicExpressionNode) {
  let left = emit(node.left);
  let right = emit(node.right);

  // handle operator precedence - as it's only the case for AND operator, we don't need a generic logic for that
  if (node.operator === ";") {
    if (isLogicExpressionNode(node.left) && node.left.operator === ",") {
      left = `(${left})`;
    }
    if (isLogicExpressionNode(node.right) && node.right.operator === ",") {
      right = `(${right})`;
    }
  }

  return `${left}${node.operator}${right}`;
}

function emit(node: Node): string {
  if (isSelectorNode(node)) {
    return emitSelector(node);
  } else if (isValueNode(node)) {
    return emitValue(node);
  } else if (isComparisionExpressionNode(node)) {
    return emitComparisionExpression(node);
  } else if (isLogicExpressionNode(node)) {
    return emitLogicExpression(node);
  }

  throw new InvalidArgumentError(`Unsupported node "${node}".`);
}

export { emit };
