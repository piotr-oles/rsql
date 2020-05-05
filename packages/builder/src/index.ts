import {
  AND,
  ComparisionOperatorSymbol,
  EQ,
  GE,
  GT,
  IN,
  InvalidArgumentError,
  LE,
  LT,
  NEQ,
  OR,
  OUT,
} from "@rsql/definitions";
import {
  createSelectorNode,
  createValueNode,
  createComparisionNode,
  createLogicNode,
  ComparisionNode,
  ExpressionNode,
} from "@rsql/ast";
import { emit } from "@rsql/emitter";
import { parse } from "@rsql/parser";

function comparision(
  selector: string,
  operator: ComparisionOperatorSymbol,
  value: string | number | (string | number)[]
): ComparisionNode {
  return createComparisionNode(
    createSelectorNode(selector),
    operator,
    createValueNode(Array.isArray(value) ? value.map((singleValue) => String(singleValue)) : String(value))
  );
}

function eq(selector: string, value: string | number): ComparisionNode {
  return comparision(selector, EQ, value);
}

function neq(selector: string, value: string | number): ComparisionNode {
  return comparision(selector, NEQ, value);
}

function le(selector: string, value: string | number): ComparisionNode {
  return comparision(selector, LE, value);
}

function lt(selector: string, value: string | number): ComparisionNode {
  return comparision(selector, LT, value);
}

function ge(selector: string, value: string | number): ComparisionNode {
  return comparision(selector, GE, value);
}

function gt(selector: string, value: string | number): ComparisionNode {
  return comparision(selector, GT, value);
}

function in_(selector: string, values: (string | number)[]): ComparisionNode {
  if (values.length === 0) {
    throw new InvalidArgumentError('The "values" passed to the "in" expression cannot be an empty array.');
  }

  return comparision(selector, IN, values);
}

function out(selector: string, values: (string | number)[]): ComparisionNode {
  if (values.length === 0) {
    throw new InvalidArgumentError('The "values" passed to the "out" expression cannot be an empty array.');
  }

  return comparision(selector, OUT, values);
}

function and(leftExpression: ExpressionNode, ...expressions: ExpressionNode[]): ExpressionNode;
function and(...expressions: ExpressionNode[]): ExpressionNode | undefined;
function and(...expressions: ExpressionNode[]): ExpressionNode | undefined {
  const [leftExpression, ...rightExpressions] = expressions;

  if (!leftExpression) {
    return undefined;
  }

  return rightExpressions.reduce(
    (leftExpression, rightExpression) => createLogicNode(leftExpression, AND, rightExpression),
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
    (leftExpression, rightExpression) => createLogicNode(leftExpression, OR, rightExpression),
    leftExpression
  );
}

const builder = {
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
  emit,
  parse,
};

export default builder;
