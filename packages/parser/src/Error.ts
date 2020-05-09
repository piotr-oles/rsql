import { AnyToken, isEndToken } from "./lexer/Token";

function createErrorForUnexpectedCharacter(position: number, source: string): SyntaxError {
  const character = source[position];

  return new SyntaxError(`Unexpected character '${character}' at position ${position + 1} in "${source}".`);
}

function createErrorForUnclosedQuote(position: number, source: string): SyntaxError {
  const character = source[position];

  return new SyntaxError(`Unclosed quote '${character}' at position ${position + 1} in "${source}".`);
}

function createErrorForUnexpectedToken(token: AnyToken, source: string): SyntaxError {
  return new SyntaxError(
    isEndToken(token)
      ? `Unexpected end in "${source}".`
      : `Unexpected ${token.value.length > 1 ? "string" : "character"} '${token.value}' at position ${
          token.position + 1
        } in "${source}".`
  );
}

function createErrorForUnclosedParenthesis(token: AnyToken, source: string, parentPosition: number): SyntaxError {
  return new SyntaxError(
    `Unexpected end in "${source}". Did you forget to close parenthesis at position ${parentPosition + 1}?`
  );
}

function createErrorForEmptyInput(token: AnyToken, source: string): SyntaxError {
  return new SyntaxError(`Unexpected end in "${source}". Cannot parse empty string.`);
}

export {
  createErrorForUnexpectedCharacter,
  createErrorForUnclosedQuote,
  createErrorForUnexpectedToken,
  createErrorForUnclosedParenthesis,
  createErrorForEmptyInput,
};
