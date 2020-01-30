import {
  Node,
  createComparisionExpressionNode,
  createLogicExpressionNode,
  createSelectorNode,
  createValueNode,
  ExpressionNode,
  SelectorNode,
  ValueNode,
} from "@rsql/ast";
import { CanonicalComparisionOperatorSymbol, CanonicalLogicOperatorSymbol } from "@rsql/definitions";
import {
  AnyToken,
  isOpenParenthesisToken,
  isQuotedToken,
  isUnquotedToken,
  OperatorToken,
  QuotedToken,
  UnquotedToken,
} from "./lexer/Token";

type ParserProduction = (stack: (AnyToken | Node)[]) => { consumed: number; produced: Node };

const selectorProduction: ParserProduction = (stack) => {
  const token = stack[stack.length - 1] as UnquotedToken;

  return {
    consumed: 1,
    produced: createSelectorNode(token.value, true),
  };
};

const singleValueProduction: ParserProduction = (stack) => {
  const token = stack[stack.length - 1] as UnquotedToken | QuotedToken;
  const value = isQuotedToken(token) ? token.value.slice(1, -1) : token.value;

  return {
    consumed: 1,
    produced: createValueNode(value, true),
  };
};

const multiValueProduction: ParserProduction = (stack) => {
  const closeParenthesisIndex = stack.length - 1;
  const openParenthesisIndex = stack.map((item) => isOpenParenthesisToken(item)).lastIndexOf(true);

  const valueTokens = stack
    .slice(openParenthesisIndex, closeParenthesisIndex)
    .filter((item) => isUnquotedToken(item) || isQuotedToken(item)) as (UnquotedToken | QuotedToken)[];

  return {
    consumed: closeParenthesisIndex - openParenthesisIndex + 1,
    produced: createValueNode(
      valueTokens.map((valueToken) => (isQuotedToken(valueToken) ? valueToken.value.slice(1, -1) : valueToken.value)),
      true
    ),
  };
};

const comparisionExpressionProduction: ParserProduction = (stack) => {
  const selector = stack[stack.length - 3] as SelectorNode;
  const operator = stack[stack.length - 2] as OperatorToken;
  const value = stack[stack.length - 1] as ValueNode;

  return {
    consumed: 3,
    produced: createComparisionExpressionNode(selector, operator.value as CanonicalComparisionOperatorSymbol, value),
  };
};

const logicalExpressionProduction: ParserProduction = (stack) => {
  const left = stack[stack.length - 3] as ExpressionNode;
  const operator = stack[stack.length - 2] as OperatorToken;
  const right = stack[stack.length - 1] as ExpressionNode;

  return {
    consumed: 3,
    produced: createLogicExpressionNode(left, operator.value as CanonicalLogicOperatorSymbol, right),
  };
};

const groupExpressionProduction: ParserProduction = (stack) => {
  const expression = stack[stack.length - 2] as ExpressionNode;

  return {
    consumed: 3,
    produced: expression,
  };
};

export {
  ParserProduction,
  selectorProduction,
  singleValueProduction,
  multiValueProduction,
  comparisionExpressionProduction,
  logicalExpressionProduction,
  groupExpressionProduction,
};
