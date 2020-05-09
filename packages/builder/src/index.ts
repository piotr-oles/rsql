import {
  AND,
  ComparisionOperator,
  EQ,
  GE,
  GT,
  IN,
  LE,
  LogicOperator,
  LT,
  NEQ,
  OR,
  OUT,
  createSelectorNode,
  createValueNode,
  createComparisionNode,
  createLogicNode,
  ComparisionNode,
  ExpressionNode,
} from "@rsql/ast";

function comparision(
  selector: string,
  operator: ComparisionOperator,
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
  return comparision(selector, IN, values);
}

function out(selector: string, values: (string | number)[]): ComparisionNode {
  return comparision(selector, OUT, values);
}

function logic(expressions: ExpressionNode[], operator: LogicOperator): ExpressionNode {
  if (!expressions.length) {
    throw new Error(`The logic expression builder requires at least one expression but none passed.`);
  }

  return expressions
    .slice(1)
    .reduce(
      (leftExpression, rightExpression) => createLogicNode(leftExpression, operator, rightExpression),
      expressions[0]
    );
}

function and(...expressions: ExpressionNode[]): ExpressionNode {
  return logic(expressions, AND);
}

function or(...expressions: ExpressionNode[]): ExpressionNode {
  return logic(expressions, OR);
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
  logic,
  and,
  or,
};

export default builder;
