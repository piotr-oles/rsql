import { AnyToken, isEndToken } from "../lexer/Token";

class InvalidTokenError extends Error {
  static createForUnexpectedToken(token: AnyToken, source: string): InvalidTokenError {
    return new InvalidTokenError(
      isEndToken(token)
        ? `Unexpected end in "${source}"`
        : `Unexpected character '${token.value}' at position ${token.position + 1} in "${source}"`,
      token,
      source
    );
  }

  static createForUnclosedParenthesis(token: AnyToken, source: string, parentPosition: number): InvalidTokenError {
    return new InvalidTokenError(
      `Unexpected end in "${source}". Did you forget to close parenthesis at position ${parentPosition + 1}?`,
      token,
      source
    );
  }

  static createForEmptyInput(token: AnyToken, source: string): InvalidTokenError {
    return new InvalidTokenError(`Unexpected end in "${source}". Cannot parse empty string.`, token, source);
  }

  constructor(message: string, readonly token: AnyToken, readonly source: string) {
    super(message);

    Object.setPrototypeOf(this, InvalidTokenError.prototype);
  }
}

export default InvalidTokenError;
