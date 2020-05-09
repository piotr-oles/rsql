import { ReservedChars } from "./ReservedChars";
import { isComparisionOperator, ComparisionOperator } from "./ComparisionOperator";
import { isLogicOperator, LogicOperator } from "./LogicOperator";

const NodeType = {
  SELECTOR: "SELECTOR",
  VALUE: "VALUE",
  COMPARISION: "COMPARISION",
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

type ComparisionNode = BinaryNode<typeof NodeType.COMPARISION, SelectorNode, ComparisionOperator, ValueNode>;
type LogicNode = BinaryNode<typeof NodeType.LOGIC, ExpressionNode, LogicOperator, ExpressionNode>;
type ExpressionNode = ComparisionNode | LogicNode;

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

function createComparisionNode(
  selector: SelectorNode,
  operator: ComparisionOperator,
  value: ValueNode,
  skipChecks = false
): ComparisionNode {
  if (!skipChecks) {
    if (!isSelectorNode(selector)) {
      throw new TypeError(`The "selector" has to be a "SelectorNode", "${String(selector)}" passed.`);
    }
    if (typeof operator !== "string") {
      throw new TypeError(`The "operator" has to be a "SelectorNode", "${String(operator)}" passed.`);
    }
    if (!isComparisionOperator(operator)) {
      throw new TypeError(`The "operator" has to be a valid "ComparisionOperator", ${String(operator)} passed.`);
    }
    if (!isValueNode(value)) {
      throw new TypeError(`The "value" has to be a "ValueNode", "${String(value)}" passed.`);
    }
  }

  return createNamedNode(
    {
      type: NodeType.COMPARISION,
      left: selector,
      operator: operator,
      right: value,
    },
    () => `ComparisionNode(${selector},${operator},${value})`
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

function isComparisionNode(candidate: unknown, operator?: ComparisionOperator): candidate is ComparisionNode {
  return (
    isNode(candidate) &&
    candidate.type === NodeType.COMPARISION &&
    (operator === undefined || isComparisionOperator((candidate as ComparisionNode).operator, operator))
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
  return isComparisionNode(candidate) || isLogicNode(candidate);
}

function getSelector(comparision: ComparisionNode): string {
  if (!isComparisionNode(comparision)) {
    throw new TypeError(`The "comparision" has to be a valid "ComparisionNode", ${String(comparision)} passed.`);
  }

  return comparision.left.selector;
}

function getValue(comparision: ComparisionNode): string | string[] {
  if (!isComparisionNode(comparision)) {
    throw new TypeError(`The "comparision" has to be a valid "ComparisionNode", ${String(comparision)} passed.`);
  }

  return comparision.right.value;
}

function getSingleValue(comparision: ComparisionNode): string {
  const value = getValue(comparision);
  if (Array.isArray(value)) {
    throw new Error(
      'The "comparision" passed to the "getSingleValue" function has to contain string value, but contains an array.'
    );
  }

  return value;
}

function getMultiValue(comparision: ComparisionNode): string[] {
  const value = getValue(comparision);
  if (typeof value === "string") {
    throw new Error(
      'The "comparision" passed to the "getMultiValue" function has to contain array value, but contains a single string.'
    );
  }

  return value;
}

export {
  createSelectorNode,
  createValueNode,
  createComparisionNode,
  createLogicNode,
  isNode,
  isSelectorNode,
  isValueNode,
  isComparisionNode,
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
  ComparisionNode,
  LogicNode,
  ExpressionNode,
};
