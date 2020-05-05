import ParsingError from "./ParsingError";
import { AnyToken, isEndToken } from "../lexer/Token";

class InvalidTokenError extends ParsingError {
  static createForUnexpectedToken(token: AnyToken, source: string): InvalidTokenError {
    return new InvalidTokenError(
      isEndToken(token)
        ? `Unexpected end in "${source}"`
        : `Unexpected ${token.value.length > 1 ? "string" : "character"} '${token.value}' at position ${
            token.position + 1
          } in "${source}"`,
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

  constructor(message: string, readonly token: AnyToken, source: string) {
    super(message, source);

    Object.setPrototypeOf(this, InvalidTokenError.prototype);
  }
}

export default InvalidTokenError;
