import { ComparisionOperator, isLogicOperator, isComparisionOperator, LogicOperator, OR, AND } from "@rsql/ast";

const TokenType = {
  UNQUOTED: "UNQUOTED",
  QUOTED: "QUOTED",
  PARENTHESIS: "PARENTHESIS",
  OPERATOR: "OPERATOR",
  END: "END",
} as const;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
interface Token<TType extends string = string, TValue = any> {
  readonly type: TType;
  readonly value: TValue;
  readonly position: number;
}

type UnquotedToken = Token<typeof TokenType.UNQUOTED, string>;
type QuotedToken = Token<typeof TokenType.QUOTED, string>;
type ParenthesisToken = Token<typeof TokenType.PARENTHESIS, "(" | ")">;
type OperatorToken = Token<typeof TokenType.OPERATOR, ComparisionOperator | LogicOperator>;
type EndToken = Token<typeof TokenType.END, "END">;

function createNamedToken<TToken extends Token>(token: TToken, toString: () => string): TToken {
  Object.defineProperty(token, "toString", {
    value: toString,
    enumerable: false,
    configurable: false,
    writable: false,
  });

  return token;
}

function createUnquotedToken(value: string, position: number): UnquotedToken {
  return createNamedToken(
    {
      type: TokenType.UNQUOTED,
      value,
      position,
    },
    () => `UnquotedToken(${value})`
  );
}

function createQuotedToken(value: string, position: number): QuotedToken {
  return createNamedToken(
    {
      type: TokenType.QUOTED,
      value,
      position,
    },
    () => `QuotedToken(${value})`
  );
}

function createParenthesisToken(value: "(" | ")", position: number): ParenthesisToken {
  return createNamedToken(
    {
      type: TokenType.PARENTHESIS,
      value,
      position,
    },
    () => `ParenthesisToken(${value})`
  );
}

function createOperatorToken(value: ComparisionOperator | LogicOperator, position: number): OperatorToken {
  return createNamedToken(
    {
      type: TokenType.OPERATOR,
      value,
      position,
    },
    () => `OperatorToken(${value})`
  );
}

function createEndToken(position: number): EndToken {
  return createNamedToken(
    {
      type: TokenType.END,
      value: "END",
      position,
    },
    () => `EndToken`
  );
}

type AnyToken = UnquotedToken | QuotedToken | ParenthesisToken | OperatorToken | EndToken;

function isToken(candidate: object): candidate is Token {
  return (
    Object.prototype.hasOwnProperty.call(candidate, "type") &&
    Object.prototype.hasOwnProperty.call(candidate, "value") &&
    Object.prototype.hasOwnProperty.call(candidate, "position")
  );
}

function isUnquotedToken(candidate: object): candidate is UnquotedToken {
  return isToken(candidate) && candidate.type === TokenType.UNQUOTED;
}

function isQuotedToken(candidate: object): candidate is QuotedToken {
  return isToken(candidate) && candidate.type === TokenType.QUOTED;
}

function isParenthesisToken(candidate: object): candidate is ParenthesisToken {
  return isToken(candidate) && candidate.type === TokenType.PARENTHESIS;
}

function isOpenParenthesisToken(candidate: object): candidate is ParenthesisToken {
  return isParenthesisToken(candidate) && candidate.value === "(";
}

function isCloseParenthesisToken(candidate: object): candidate is ParenthesisToken {
  return isParenthesisToken(candidate) && candidate.value === ")";
}

function isOperatorToken(candidate: object): candidate is OperatorToken {
  return isToken(candidate) && candidate.type === TokenType.OPERATOR;
}

function isComparisionOperatorToken(candidate: object): candidate is OperatorToken {
  return isOperatorToken(candidate) && isComparisionOperator(candidate.value);
}

function isOrOperatorToken(candidate: object): candidate is OperatorToken {
  return isOperatorToken(candidate) && isLogicOperator(candidate.value, OR);
}

function isAndOperatorToken(candidate: object): candidate is OperatorToken {
  return isOperatorToken(candidate) && isLogicOperator(candidate.value, AND);
}

function isEndToken(candidate: object): candidate is EndToken {
  return isToken(candidate) && candidate.type === TokenType.END;
}

export default Token;
export {
  createUnquotedToken,
  createQuotedToken,
  createParenthesisToken,
  createOperatorToken,
  createEndToken,
  isToken,
  isUnquotedToken,
  isQuotedToken,
  isParenthesisToken,
  isOpenParenthesisToken,
  isCloseParenthesisToken,
  isOperatorToken,
  isComparisionOperatorToken,
  isOrOperatorToken,
  isAndOperatorToken,
  isEndToken,
  AnyToken,
  UnquotedToken,
  QuotedToken,
  ParenthesisToken,
  OperatorToken,
  EndToken,
};
