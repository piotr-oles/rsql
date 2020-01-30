import { ExpressionNode } from "@rsql/ast";
import { emit } from "@rsql/emitter";
import { parse } from "@rsql/parser";
import { expr } from "./expr";

interface Query {
  toString(): string;
  toAST(): ExpressionNode | undefined;
}

type QueryLike = Query | ExpressionNode | string;

interface ComparisionExpressionBuilder {
  eq(selector: string, value: string): this;
  neq(selector: string, value: string): this;
  le(selector: string, value: string): this;
  lt(selector: string, value: string): this;
  ge(selector: string, value: string): this;
  gt(selector: string, value: string): this;
  in(selector: string, values: string[]): this;
  out(selector: string, values: string[]): this;
}

interface LogicExpressionPushBuilder<TPushBuilder> {
  and(): TPushBuilder;
  and(query: QueryLike): this;

  or(): TPushBuilder;
  or(query: QueryLike): this;
}

interface LogicExpressionPopBuilder<TPopBuilder> {
  end(): TPopBuilder;
}

interface LevelAwareExpressionBuilder<TPushBuilder, TPopBuilder>
  extends LogicExpressionPushBuilder<TPushBuilder>,
    LogicExpressionPopBuilder<TPopBuilder>,
    ComparisionExpressionBuilder {}
interface LevelUnawareExpressionBuilder
  extends LogicExpressionPushBuilder<LevelUnawareExpressionBuilder>,
    LogicExpressionPopBuilder<LevelUnawareExpressionBuilder>,
    ComparisionExpressionBuilder,
    Query {}

interface ExpressionBuilderLevel0Empty extends LogicExpressionPushBuilder<ExpressionBuilderLevel1>, Query {}
interface ExpressionBuilderLevel0Logic
  extends LogicExpressionPushBuilder<ExpressionBuilderLevel1>,
    ComparisionExpressionBuilder,
    Query {}
type ExpressionBuilderLevel1 = LevelAwareExpressionBuilder<ExpressionBuilderLevel2, ExpressionBuilderLevel0Empty>;
type ExpressionBuilderLevel2 = LevelAwareExpressionBuilder<ExpressionBuilderLevel3, ExpressionBuilderLevel1>;
type ExpressionBuilderLevel3 = LevelAwareExpressionBuilder<ExpressionBuilderLevel4, ExpressionBuilderLevel2>;
type ExpressionBuilderLevel4 = LevelAwareExpressionBuilder<ExpressionBuilderLevel5, ExpressionBuilderLevel3>;
type ExpressionBuilderLevel5 = LevelAwareExpressionBuilder<ExpressionBuilderLevel6, ExpressionBuilderLevel4>;
type ExpressionBuilderLevel6 = LevelAwareExpressionBuilder<LevelUnawareExpressionBuilder, ExpressionBuilderLevel5>;

function isQuery(candidate: unknown): candidate is Query {
  return !!(
    typeof candidate === "object" &&
    candidate &&
    Object.prototype.hasOwnProperty.call(candidate, "toString") &&
    Object.prototype.hasOwnProperty.call(candidate, "toAST")
  );
}

function castQueryLikeToExpressionNode(query?: QueryLike): ExpressionNode | undefined {
  if (query) {
    if (typeof query === "string") {
      return parse(query);
    } else if (isQuery(query)) {
      return query.toAST();
    } else {
      return query;
    }
  }
}

function createNestedQuery<TPushBuilder, TPopBuilder>(
  pop: (expressions: ExpressionNode[]) => TPopBuilder,
  expressions: ExpressionNode[] = []
): LevelAwareExpressionBuilder<TPushBuilder, TPopBuilder> {
  return {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    and: (query?: QueryLike): any => {
      const rightExpression = castQueryLikeToExpressionNode(query);

      if (rightExpression) {
        const andExpression = expr.and(...expressions, rightExpression);

        return createNestedQuery(pop, andExpression ? [andExpression] : []);
      } else {
        return createNestedQuery((andExpressions) => {
          const expression = expr.and(...andExpressions);

          return expression
            ? createNestedQuery(pop, [...expressions, expression])
            : createNestedQuery(pop, expressions);
        });
      }
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    or: (query?: QueryLike): any => {
      const rightExpression = castQueryLikeToExpressionNode(query);

      if (rightExpression) {
        const orExpression = expr.or(...expressions, rightExpression);

        return createNestedQuery(pop, orExpression ? [orExpression] : []);
      } else {
        return createNestedQuery((orExpressions) => {
          const expression = expr.or(...orExpressions);

          return expression
            ? createNestedQuery(pop, [...expressions, expression])
            : createNestedQuery(pop, expressions);
        });
      }
    },
    end: () => pop(expressions),
    eq: (selector: string, value: string) => createNestedQuery(pop, [...expressions, expr.eq(selector, value)]),
    neq: (selector: string, value: string) => createNestedQuery(pop, [...expressions, expr.neq(selector, value)]),
    le: (selector: string, value: string) => createNestedQuery(pop, [...expressions, expr.le(selector, value)]),
    lt: (selector: string, value: string) => createNestedQuery(pop, [...expressions, expr.lt(selector, value)]),
    ge: (selector: string, value: string) => createNestedQuery(pop, [...expressions, expr.ge(selector, value)]),
    gt: (selector: string, value: string) => createNestedQuery(pop, [...expressions, expr.gt(selector, value)]),
    in: (selector: string, values: string[]) => createNestedQuery(pop, [...expressions, expr.in(selector, values)]),
    out: (selector: string, values: string[]) => createNestedQuery(pop, [...expressions, expr.out(selector, values)]),
  };
}

function createQuery(initialQuery?: QueryLike): ExpressionBuilderLevel0Empty {
  const leftExpression = castQueryLikeToExpressionNode(initialQuery);

  return {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    and: (query?: QueryLike): any => {
      const rightExpression = castQueryLikeToExpressionNode(query);

      if (rightExpression) {
        return createQuery(leftExpression ? expr.and(leftExpression, rightExpression) : rightExpression);
      } else {
        return createNestedQuery((expressions) =>
          createQuery(leftExpression ? expr.and(leftExpression, ...expressions) : expr.and(...expressions))
        );
      }
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    or: (query?: QueryLike): any => {
      const rightExpression = castQueryLikeToExpressionNode(query);

      if (rightExpression) {
        return createQuery(leftExpression ? expr.or(leftExpression, rightExpression) : rightExpression);
      } else {
        return createNestedQuery((expressions) =>
          createQuery(leftExpression ? expr.or(leftExpression, ...expressions) : expr.or(...expressions))
        );
      }
    },
    toString: () => (leftExpression ? emit(leftExpression) : ""),
    toAST: () => leftExpression,
  };
}

export { createQuery };
