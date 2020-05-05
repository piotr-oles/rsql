import {
  ReservedChars,
  InvalidArgumentError,
  ComparisionOperatorSymbol,
  LogicOperatorSymbol,
  isAndOperatorSymbol,
  isOrOperatorSymbol,
  isEqOperatorSymbol,
  isNeqOperatorSymbol,
  isLeOperatorSymbol,
  isGeOperatorSymbol,
  isLtOperatorSymbol,
  isGtOperatorSymbol,
  isInOperatorSymbol,
  isOutOperatorSymbol,
} from "@rsql/definitions";

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

type ComparisionNode = BinaryNode<typeof NodeType.COMPARISION, SelectorNode, ComparisionOperatorSymbol, ValueNode>;
type LogicNode = BinaryNode<typeof NodeType.LOGIC, ExpressionNode, LogicOperatorSymbol, ExpressionNode>;
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
      throw InvalidArgumentError.createForInvalidType(
        "selector",
        "createSelectorNode",
        "string",
        InvalidArgumentError.getTypeOf(selector)
      );
    }

    if (!selector || selector.length === 0) {
      throw new InvalidArgumentError(
        'The "selector" passed to the "createSelectorNode" function cannot be an empty string.'
      );
    }

    const reservedChar = ReservedChars.find((reservedChar) => selector.indexOf(reservedChar) !== -1);
    if (reservedChar) {
      throw new InvalidArgumentError(
        `The "selector" passed to the "createSelectorNode" function contains reserved character '${reservedChar}' at position ${
          selector.indexOf(reservedChar) + 1
        } in "${selector}"`
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
      throw InvalidArgumentError.createForInvalidType(
        "value",
        "createValueNode",
        "string | string[]",
        InvalidArgumentError.getTypeOf(value)
      );
    }

    if (Array.isArray(value) && value.length === 0) {
      throw new InvalidArgumentError('The "value" passed to the "createValueNode" function cannot be an empty array.');
    }
  }

  return createNamedNode(
    {
      type: NodeType.VALUE,
      value,
    },
    () => `ValueNode(${(!Array.isArray(value) ? [value] : value).map((value) => '"' + value + '"').join(",")})`
  );
}

function createComparisionNode(
  selector: SelectorNode,
  operator: ComparisionOperatorSymbol,
  value: ValueNode,
  skipChecks = false
): ComparisionNode {
  if (!skipChecks) {
    if (!isSelectorNode(selector)) {
      throw InvalidArgumentError.createForInvalidType(
        "selector",
        "createComparisionNode",
        "SelectorNode",
        isNode(selector) ? String(selector) : InvalidArgumentError.getTypeOf(selector)
      );
    }
    if (typeof operator !== "string") {
      throw InvalidArgumentError.createForInvalidType(
        "operator",
        "createComparisionNode",
        "string",
        InvalidArgumentError.getTypeOf(operator)
      );
    }
    if (!isValueNode(value)) {
      throw InvalidArgumentError.createForInvalidType(
        "value",
        "createComparisionNode",
        "ValueNode",
        isNode(value) ? String(value) : InvalidArgumentError.getTypeOf(value)
      );
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
  operator: LogicOperatorSymbol,
  right: ExpressionNode,
  skipChecks = false
): LogicNode {
  if (!skipChecks) {
    if (!isExpressionNode(left)) {
      throw InvalidArgumentError.createForInvalidType(
        "left",
        "createLogicNode",
        "ExpressionNode",
        isNode(left) ? String(left) : InvalidArgumentError.getTypeOf(left)
      );
    }
    if (typeof operator !== "string") {
      throw InvalidArgumentError.createForInvalidType(
        "operator",
        "createLogicNode",
        "string",
        InvalidArgumentError.getTypeOf(operator)
      );
    }
    if (!isExpressionNode(right)) {
      throw InvalidArgumentError.createForInvalidType(
        "right",
        "createLogicNode",
        "ExpressionNode",
        isNode(right) ? String(right) : InvalidArgumentError.getTypeOf(right)
      );
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

function isComparisionNode(candidate: unknown): candidate is ComparisionNode {
  return isNode(candidate) && candidate.type === NodeType.COMPARISION;
}

function isEqNode(candidate: unknown): candidate is ComparisionNode {
  return isComparisionNode(candidate) && isEqOperatorSymbol(candidate.operator);
}
function isNeqNode(candidate: unknown): candidate is ComparisionNode {
  return isComparisionNode(candidate) && isNeqOperatorSymbol(candidate.operator);
}
function isLeNode(candidate: unknown): candidate is ComparisionNode {
  return isComparisionNode(candidate) && isLeOperatorSymbol(candidate.operator);
}
function isGeNode(candidate: unknown): candidate is ComparisionNode {
  return isComparisionNode(candidate) && isGeOperatorSymbol(candidate.operator);
}
function isLtNode(candidate: unknown): candidate is ComparisionNode {
  return isComparisionNode(candidate) && isLtOperatorSymbol(candidate.operator);
}
function isGtNode(candidate: unknown): candidate is ComparisionNode {
  return isComparisionNode(candidate) && isGtOperatorSymbol(candidate.operator);
}
function isInNode(candidate: unknown): candidate is ComparisionNode {
  return isComparisionNode(candidate) && isInOperatorSymbol(candidate.operator);
}
function isOutNode(candidate: unknown): candidate is ComparisionNode {
  return isComparisionNode(candidate) && isOutOperatorSymbol(candidate.operator);
}

function isLogicNode(candidate: unknown): candidate is LogicNode {
  return isNode(candidate) && candidate.type === NodeType.LOGIC;
}

function isAndNode(candidate: unknown): candidate is LogicNode {
  return isLogicNode(candidate) && isAndOperatorSymbol(candidate.operator);
}

function isOrNode(candidate: unknown): candidate is LogicNode {
  return isLogicNode(candidate) && isOrOperatorSymbol(candidate.operator);
}

function isExpressionNode(candidate: unknown): candidate is ExpressionNode {
  return isComparisionNode(candidate) || isLogicNode(candidate);
}

function getSelector(comparision: ComparisionNode): string {
  if (!isComparisionNode(comparision)) {
    throw InvalidArgumentError.createForInvalidType(
      "comparision",
      "getSelector",
      "ComparisionNode",
      isNode(comparision) ? String(comparision) : InvalidArgumentError.getTypeOf(comparision)
    );
  }

  return comparision.left.selector;
}

function getValue(comparision: ComparisionNode): string | string[] {
  if (!isComparisionNode(comparision)) {
    throw InvalidArgumentError.createForInvalidType(
      "comparision",
      "getSelector",
      "ComparisionNode",
      isNode(comparision) ? String(comparision) : InvalidArgumentError.getTypeOf(comparision)
    );
  }

  return comparision.right.value;
}

function getSingleValue(comparision: ComparisionNode): string {
  const value = getValue(comparision);
  if (Array.isArray(value)) {
    throw new InvalidArgumentError(
      'The "comparision" passed to the "getSingleValue" function has to contain string value, but contains an array.'
    );
  }

  return value;
}

function getMultiValue(comparision: ComparisionNode): string[] {
  const value = getValue(comparision);
  if (typeof value === "string") {
    throw new InvalidArgumentError(
      'The "comparision" passed to the "getMultiValue" function has to contain array value, but contains a single string.'
    );
  }

  return value;
}

export {
  Node,
  createSelectorNode,
  createValueNode,
  createComparisionNode,
  createLogicNode,
  isNode,
  isSelectorNode,
  isValueNode,
  isComparisionNode,
  isEqNode,
  isNeqNode,
  isLeNode,
  isGeNode,
  isLtNode,
  isGtNode,
  isInNode,
  isOutNode,
  isLogicNode,
  isAndNode,
  isOrNode,
  isExpressionNode,
  getSelector,
  getValue,
  getSingleValue,
  getMultiValue,
  SelectorNode,
  ValueNode,
  BinaryNode,
  ComparisionNode,
  LogicNode,
  ExpressionNode,
};
