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

interface EmitOptions {
  /**
   * The preferred quote character to use when `emit` encounters a comparison value that needs to be escaped by wrapping
   * in quotes. Either `"` (the ASCII double quote character) or `'` (the ASCII single quote character). Defaults to `"`
   * (the ASCII double quote character).
   */
  preferredQuote?: Quote;
  /**
   * If `true`, `emit` will override the `preferredQuote` setting on a comparison value-by-comparison value basis if
   * doing so would shorten the emitted RSQL. If `false`, `emit` will use the `preferredQuote` as the quote character
   * for all comparison values encountered. Defaults to `true`.
   */
  optimizeQuotes?: boolean;
}

const DEFAULT_EMIT_OPTIONS: Required<EmitOptions> = {
  preferredQuote: '"',
  optimizeQuotes: true,
};

const NEEDS_ESCAPING: { [Q in Quote]: RegExp } = {
  '"': /"|\\/g,
  "'": /'|\\/g,
};

function escapeQuotes(value: string, quote: Quote) {
  return value.replace(NEEDS_ESCAPING[quote], "\\$&");
}

function countQuote(value: string, quote: Quote) {
  let count = 0;
  for (let i = 0; i < value.length; ++i) {
    if (value[i] === quote) {
      count++;
    }
  }
  return count;
}

function selectQuote(
  value: string,
  {
    preferredQuote = DEFAULT_EMIT_OPTIONS.preferredQuote,
    optimizeQuotes = DEFAULT_EMIT_OPTIONS.optimizeQuotes,
  }: EmitOptions
) {
  if (optimizeQuotes) {
    const otherQuote: Quote = preferredQuote === '"' ? "'" : '"';
    return countQuote(value, otherQuote) < countQuote(value, preferredQuote) ? otherQuote : preferredQuote;
  } else {
    return preferredQuote;
  }
}

function escapeValue(value: string, options: EmitOptions) {
  if (value === "" || ReservedChars.some((reservedChar) => value.includes(reservedChar))) {
    const quote = selectQuote(value, options);
    return `${quote}${escapeQuotes(value, quote)}${quote}`;
  }

  return value;
}

function emitSelector(node: SelectorNode) {
  return node.selector;
}

function emitValue(node: ValueNode, options: EmitOptions) {
  return Array.isArray(node.value)
    ? `(${node.value.map((value) => escapeValue(value, options)).join(",")})`
    : escapeValue(node.value, options);
}

function emitComparison(node: ComparisonNode, options: EmitOptions) {
  return `${emitSelector(node.left)}${node.operator}${emitValue(node.right, options)}`;
}

function emitLogic(node: LogicNode, options: EmitOptions) {
  let left = emitWithoutOptionsValidation(node.left, options);
  let right = emitWithoutOptionsValidation(node.right, options);

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

function emitWithoutOptionsValidation(expression: ExpressionNode, options: EmitOptions): string {
  if (isComparisonNode(expression)) {
    return emitComparison(expression, options);
  } else if (isLogicNode(expression)) {
    return emitLogic(expression, options);
  }

  throw new TypeError(`The "expression" has to be a valid "ExpressionNode", ${String(expression)} passed.`);
}

function emit(expression: ExpressionNode, options: EmitOptions = {}) {
  if (options.preferredQuote !== undefined && options.preferredQuote !== '"' && options.preferredQuote !== "'") {
    throw new TypeError(
      `Invalid "preferredQuote" option: ${options.preferredQuote}. Must be either " (the ASCII double quote character) or ' (the ASCII single quote character).`
    );
  }
  return emitWithoutOptionsValidation(expression, options);
}

export { emit, EmitOptions, Quote };
