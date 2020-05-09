import {
  AND,
  ComparisonOperator,
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
  createComparisonNode,
  createLogicNode,
  ComparisonNode,
  ExpressionNode,
} from "@rsql/ast";

function comparison(
  selector: string,
  operator: ComparisonOperator,
  value: string | number | (string | number)[]
): ComparisonNode {
  return createComparisonNode(
    createSelectorNode(selector),
    operator,
    createValueNode(Array.isArray(value) ? value.map((singleValue) => String(singleValue)) : String(value))
  );
}

function eq(selector: string, value: string | number): ComparisonNode {
  return comparison(selector, EQ, value);
}

function neq(selector: string, value: string | number): ComparisonNode {
  return comparison(selector, NEQ, value);
}

function le(selector: string, value: string | number): ComparisonNode {
  return comparison(selector, LE, value);
}

function lt(selector: string, value: string | number): ComparisonNode {
  return comparison(selector, LT, value);
}

function ge(selector: string, value: string | number): ComparisonNode {
  return comparison(selector, GE, value);
}

function gt(selector: string, value: string | number): ComparisonNode {
  return comparison(selector, GT, value);
}

function in_(selector: string, values: (string | number)[]): ComparisonNode {
  return comparison(selector, IN, values);
}

function out(selector: string, values: (string | number)[]): ComparisonNode {
  return comparison(selector, OUT, values);
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
  comparison,
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
