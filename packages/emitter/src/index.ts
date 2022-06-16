import {
  AND,
  AND_VERBOSE,
  isLogicOperator,
  OR,
  OR_VERBOSE,
  ReservedChars,
  ComparisonNode,
  ExpressionNode,
  isComparisonNode,
  isLogicNode,
  LogicNode,
  SelectorNode,
  ValueNode,
} from "@rsql/ast";

type Quote = '"' | "'";

const NEEDS_ESCAPING: { [Q in Quote]: RegExp } = {
  '"': /"|\\/g,
  "'": /'|\\/g,
};

function escapeQuotes(value: string, quote: Quote) {
  return value.replace(NEEDS_ESCAPING[quote], "\\$&");
}

function escapeValue(value: string, quote: Quote) {
  if (value === "") {
    return quote + quote;
  }

  if (ReservedChars.some((reservedChar) => value.includes(reservedChar))) {
    return `${quote}${escapeQuotes(value, quote)}${quote}`;
  }

  return value;
}

function emitSelector(node: SelectorNode) {
  return node.selector;
}

function emitValue(node: ValueNode, quote: Quote = '"') {
  return Array.isArray(node.value)
    ? `(${node.value.map((value) => escapeValue(value, quote)).join(",")})`
    : escapeValue(node.value, quote);
}

function emitComparison(node: ComparisonNode) {
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
  if (isComparisonNode(expression)) {
    return emitComparison(expression);
  } else if (isLogicNode(expression)) {
    return emitLogic(expression);
  }

  throw new TypeError(`The "expression" has to be a valid "ExpressionNode", ${String(expression)} passed.`);
}

export { emit };
