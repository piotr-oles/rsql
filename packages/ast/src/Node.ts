import { ReservedChars } from "./ReservedChars";
import { isComparisonOperator, ComparisonOperator } from "./ComparisonOperator";
import { isLogicOperator, LogicOperator } from "./LogicOperator";

const NodeType = {
  SELECTOR: "SELECTOR",
  VALUE: "VALUE",
  COMPARISON: "COMPARISON",
  LOGIC: "LOGIC",
} as const;

interface Node<TType = string> {
  readonly type: TType;
}

interface SelectorNode extends Node<typeof NodeType.SELECTOR> {
  readonly selector: string;
}

interface ValueNode extends Node<typeof NodeType.VALUE> {
  readonly value: string | string[];
}

interface BinaryNode<
  TType extends string = string,
  TLeft extends Node = Node,
  TOperator extends string = string,
  TRight extends Node = Node
> extends Node<TType> {
  readonly left: TLeft;
  readonly operator: TOperator;
  readonly right: TRight;
}

type ComparisonNode = BinaryNode<typeof NodeType.COMPARISON, SelectorNode, ComparisonOperator, ValueNode>;
type LogicNode = BinaryNode<typeof NodeType.LOGIC, ExpressionNode, LogicOperator, ExpressionNode>;
type ExpressionNode = ComparisonNode | LogicNode;

function createNamedNode<TNode extends Node>(node: TNode, toString: () => string): TNode {
  Object.defineProperty(node, "toString", {
    value: toString,
    enumerable: false,
    configurable: false,
    writable: false,
  });

  return node;
}

function createSelectorNode(selector: string, skipChecks = false): SelectorNode {
  if (!skipChecks) {
    if (typeof selector !== "string") {
      throw new TypeError(`The "selector" has to be a "string", "${String(selector)}" passed.`);
    }

    if (!selector || selector.length === 0) {
      throw new Error('The "selector" cannot be an empty string.');
    }

    const reservedChar = ReservedChars.find((reservedChar) => selector.indexOf(reservedChar) !== -1);
    if (reservedChar) {
      const position = selector.indexOf(reservedChar) + 1;
      throw new Error(
        `The "selector" contains reserved character '${reservedChar}' at position ${position} in "${selector}".`
      );
    }
  }

  return createNamedNode(
    {
      type: NodeType.SELECTOR,
      selector,
    },
    () => `SelectorNode("${selector}")`
  );
}

function createValueNode(value: string | string[], skipChecks = false): ValueNode {
  if (!skipChecks) {
    if (typeof value !== "string" && !Array.isArray(value)) {
      throw new TypeError(`The "value" has to be a "string | string[]", "${String(value)}" passed.`);
    }

    if (Array.isArray(value) && value.length === 0) {
      throw new Error('The "value" cannot be an empty array.');
    }
  }

  return createNamedNode(
    {
      type: NodeType.VALUE,
      value,
    },
    () => `ValueNode(${JSON.stringify(value)})`
  );
}

function createComparisonNode(
  selector: SelectorNode,
  operator: ComparisonOperator,
  value: ValueNode,
  skipChecks = false
): ComparisonNode {
  if (!skipChecks) {
    if (!isSelectorNode(selector)) {
      throw new TypeError(`The "selector" has to be a "SelectorNode", "${String(selector)}" passed.`);
    }
    if (typeof operator !== "string") {
      throw new TypeError(`The "operator" has to be a "SelectorNode", "${String(operator)}" passed.`);
    }
    if (!isComparisonOperator(operator)) {
      throw new TypeError(`The "operator" has to be a valid "ComparisonOperator", ${String(operator)} passed.`);
    }
    if (!isValueNode(value)) {
      throw new TypeError(`The "value" has to be a "ValueNode", "${String(value)}" passed.`);
    }
  }

  return createNamedNode(
    {
      type: NodeType.COMPARISON,
      left: selector,
      operator: operator,
      right: value,
    },
    () => `ComparisonNode(${selector},${operator},${value})`
  );
}

function createLogicNode(
  left: ExpressionNode,
  operator: LogicOperator,
  right: ExpressionNode,
  skipChecks = false
): LogicNode {
  if (!skipChecks) {
    if (!isExpressionNode(left)) {
      throw new TypeError(`The "left" has to be a "ExpressionNode", "${String(left)}" passed.`);
    }
    if (typeof operator !== "string") {
      throw new TypeError(`The "operator" has to be a "string", "${String(operator)}" passed.`);
    }
    if (!isLogicOperator(operator)) {
      throw new TypeError(`The "operator" has to be a valid "LogicOperator", ${String(operator)} passed.`);
    }
    if (!isExpressionNode(right)) {
      throw new TypeError(`The "right" has to be a "ExpressionNode", "${String(right)}" passed.`);
    }
  }

  return createNamedNode(
    {
      type: NodeType.LOGIC,
      left,
      operator: operator,
      right,
    },
    () => `LogicNode(${left},${operator},${right})`
  );
}

function isNode(candidate: unknown): candidate is Node {
  return candidate !== undefined && candidate !== null && Object.prototype.hasOwnProperty.call(candidate, "type");
}

function isSelectorNode(candidate: unknown): candidate is SelectorNode {
  return isNode(candidate) && candidate.type === NodeType.SELECTOR;
}

function isValueNode(candidate: unknown): candidate is ValueNode {
  return isNode(candidate) && candidate.type === NodeType.VALUE;
}

function isComparisonNode(candidate: unknown, operator?: ComparisonOperator): candidate is ComparisonNode {
  return (
    isNode(candidate) &&
    candidate.type === NodeType.COMPARISON &&
    (operator === undefined || isComparisonOperator((candidate as ComparisonNode).operator, operator))
  );
}

function isLogicNode(candidate: unknown, operator?: LogicOperator): candidate is LogicNode {
  return (
    isNode(candidate) &&
    candidate.type === NodeType.LOGIC &&
    (operator === undefined || isLogicOperator((candidate as LogicNode).operator, operator))
  );
}

function isExpressionNode(candidate: unknown): candidate is ExpressionNode {
  return isComparisonNode(candidate) || isLogicNode(candidate);
}

function getSelector(comparison: ComparisonNode): string {
  if (!isComparisonNode(comparison)) {
    throw new TypeError(`The "comparison" has to be a valid "ComparisonNode", ${String(comparison)} passed.`);
  }

  return comparison.left.selector;
}

function getValue(comparison: ComparisonNode): string | string[] {
  if (!isComparisonNode(comparison)) {
    throw new TypeError(`The "comparison" has to be a valid "ComparisonNode", ${String(comparison)} passed.`);
  }

  return comparison.right.value;
}

function getSingleValue(comparison: ComparisonNode): string {
  const value = getValue(comparison);
  if (Array.isArray(value)) {
    throw new Error(
      'The "comparison" passed to the "getSingleValue" function has to contain string value, but contains an array.'
    );
  }

  return value;
}

function getMultiValue(comparison: ComparisonNode): string[] {
  const value = getValue(comparison);
  if (typeof value === "string") {
    throw new Error(
      'The "comparison" passed to the "getMultiValue" function has to contain array value, but contains a single string.'
    );
  }

  return value;
}

export {
  createSelectorNode,
  createValueNode,
  createComparisonNode,
  createLogicNode,
  isNode,
  isSelectorNode,
  isValueNode,
  isComparisonNode,
  isLogicNode,
  isExpressionNode,
  getSelector,
  getValue,
  getSingleValue,
  getMultiValue,
  Node,
  SelectorNode,
  ValueNode,
  BinaryNode,
  ComparisonNode,
  LogicNode,
  ExpressionNode,
};
