import {
  CanonicalComparisionOperatorSymbol,
  CanonicalLogicOperatorSymbol,
  ReservedChars,
  InvalidArgumentError,
  InvalidCharacterError,
  mapToCanonicalComparisionOperatorSymbol,
  ComparisionOperatorSymbol,
} from "@rsql/definitions";

const NodeType = {
  SELECTOR: "SELECTOR",
  VALUE: "VALUE",
  COMPARISION_EXPRESSION: "COMPARISION_EXPRESSION",
  LOGIC_EXPRESSION: "LOGIC_EXPRESSION",
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

interface BinaryExpressionNode<
  TType extends string = string,
  TLeft extends Node = Node,
  TOperator extends string = string,
  TRight extends Node = Node
> extends Node<TType> {
  readonly left: TLeft;
  readonly operator: TOperator;
  readonly right: TRight;
}

type ComparisionExpressionNode = BinaryExpressionNode<
  typeof NodeType.COMPARISION_EXPRESSION,
  SelectorNode,
  CanonicalComparisionOperatorSymbol,
  ValueNode
>;

type LogicExpressionNode = BinaryExpressionNode<
  typeof NodeType.LOGIC_EXPRESSION,
  ExpressionNode,
  CanonicalLogicOperatorSymbol,
  ExpressionNode
>;

type ExpressionNode = ComparisionExpressionNode | LogicExpressionNode;

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
    if (!selector || selector.length === 0) {
      throw new InvalidArgumentError(
        'The first argument of the "createSelectorNode" function cannot be an empty string.'
      );
    }

    const reservedChar = ReservedChars.find((reservedChar) => selector.indexOf(reservedChar) !== -1);
    if (reservedChar) {
      throw InvalidCharacterError.createForUnexpectedCharacter(selector.indexOf(reservedChar), selector);
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
    if (Array.isArray(value) && value.length === 0) {
      throw new InvalidArgumentError('The first argument of the "createValueNode" function cannot be an empty array.');
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

function createComparisionExpressionNode(
  selector: SelectorNode,
  operator: ComparisionOperatorSymbol,
  value: ValueNode
): ComparisionExpressionNode {
  const canonicalOperator = mapToCanonicalComparisionOperatorSymbol(operator);

  return createNamedNode(
    {
      type: NodeType.COMPARISION_EXPRESSION,
      left: selector,
      operator: canonicalOperator,
      right: value,
    },
    () => `ComparisionExpressionNode(${selector},${canonicalOperator},${value})`
  );
}

function createLogicExpressionNode(
  left: ExpressionNode,
  operator: CanonicalLogicOperatorSymbol,
  right: ExpressionNode
): LogicExpressionNode {
  return createNamedNode(
    {
      type: NodeType.LOGIC_EXPRESSION,
      left,
      operator,
      right,
    },
    () => `LogicExpressionNode(${left},${operator},${right})`
  );
}

function isNode(candidate: object): candidate is Node {
  return Object.prototype.hasOwnProperty.call(candidate, "type");
}

function isSelectorNode(candidate: object): candidate is SelectorNode {
  return isNode(candidate) && candidate.type === NodeType.SELECTOR;
}

function isValueNode(candidate: object): candidate is ValueNode {
  return isNode(candidate) && candidate.type === NodeType.VALUE;
}

function isComparisionExpressionNode(candidate: object): candidate is ComparisionExpressionNode {
  return isNode(candidate) && candidate.type === NodeType.COMPARISION_EXPRESSION;
}

function isLogicExpressionNode(candidate: object): candidate is LogicExpressionNode {
  return isNode(candidate) && candidate.type === NodeType.LOGIC_EXPRESSION;
}

function isExpressionNode(candidate: object): candidate is ExpressionNode {
  return isComparisionExpressionNode(candidate) || isLogicExpressionNode(candidate);
}

export {
  Node,
  createSelectorNode,
  createValueNode,
  createComparisionExpressionNode,
  createLogicExpressionNode,
  isNode,
  isSelectorNode,
  isValueNode,
  isComparisionExpressionNode,
  isLogicExpressionNode,
  isExpressionNode,
  SelectorNode,
  ValueNode,
  BinaryExpressionNode,
  ComparisionExpressionNode,
  LogicExpressionNode,
  ExpressionNode,
};
