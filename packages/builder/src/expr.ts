import { CanonicalComparisionOperatorSymbol, InvalidArgumentError } from "@rsql/definitions";
import {
  createSelectorNode,
  createValueNode,
  createComparisionExpressionNode,
  createLogicExpressionNode,
  ComparisionExpressionNode,
  ExpressionNode,
} from "@rsql/ast";

function comparision(
  selector: string,
  operator: CanonicalComparisionOperatorSymbol,
  value: string | string[]
): ComparisionExpressionNode {
  return createComparisionExpressionNode(createSelectorNode(selector), operator, createValueNode(value));
}

function eq(selector: string, value: string): ComparisionExpressionNode {
  return comparision(selector, "==", value);
}

function neq(selector: string, value: string): ComparisionExpressionNode {
  return comparision(selector, "!=", value);
}

function le(selector: string, value: string): ComparisionExpressionNode {
  return comparision(selector, "<=", value);
}

function lt(selector: string, value: string): ComparisionExpressionNode {
  return comparision(selector, "<", value);
}

function ge(selector: string, value: string): ComparisionExpressionNode {
  return comparision(selector, ">=", value);
}

function gt(selector: string, value: string): ComparisionExpressionNode {
  return comparision(selector, ">", value);
}

function in_(selector: string, values: string[]): ComparisionExpressionNode {
  if (values.length === 0) {
    throw new InvalidArgumentError('The second argument of the "in" expression cannot be an empty array.');
  }

  return comparision(selector, "=in=", values);
}

function out(selector: string, values: string[]): ComparisionExpressionNode {
  if (values.length === 0) {
    throw new InvalidArgumentError('The second argument of the "out" expression cannot be an empty array.');
  }

  return comparision(selector, "=out=", values);
}

function and(leftExpression: ExpressionNode, ...expressions: ExpressionNode[]): ExpressionNode;
function and(...expressions: ExpressionNode[]): ExpressionNode | undefined;
function and(...expressions: ExpressionNode[]): ExpressionNode | undefined {
  const [leftExpression, ...rightExpressions] = expressions;

  if (!leftExpression) {
    return undefined;
  }

  return rightExpressions.reduce(
    (leftExpression, rightExpression) => createLogicExpressionNode(leftExpression, ";", rightExpression),
    leftExpression
  );
}

function or(leftExpression: ExpressionNode, ...expressions: ExpressionNode[]): ExpressionNode;
function or(...expressions: ExpressionNode[]): ExpressionNode | undefined;
function or(...expressions: ExpressionNode[]): ExpressionNode | undefined {
  const [leftExpression, ...rightExpressions] = expressions;

  if (!leftExpression) {
    return undefined;
  }

  return rightExpressions.reduce(
    (leftExpression, rightExpression) => createLogicExpressionNode(leftExpression, ",", rightExpression),
    leftExpression
  );
}

const expr = {
  comparision,
  eq,
  neq,
  le,
  lt,
  ge,
  gt,
  in: in_,
  out,
  and,
  or,
};

export { expr };
