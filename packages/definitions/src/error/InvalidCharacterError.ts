class InvalidCharacterError extends Error {
  static createForUnexpectedCharacter(position: number, source: string): InvalidCharacterError {
    const character = source[position];

    return new InvalidCharacterError(
      `Unexpected character '${character}' at position ${position + 1} in "${source}"`,
      character,
      position,
      source
    );
  }

  static createForUnclosedQuote(position: number, source: string): InvalidCharacterError {
    const character = source[position];

    return new InvalidCharacterError(
      `Unclosed quote '${character}' at position ${position + 1} in "${source}"`,
      character,
      position,
      source
    );
  }

  constructor(message: string, readonly character: string, readonly position: number, readonly source: string) {
    super(message);

    Object.setPrototypeOf(this, InvalidCharacterError.prototype);
  }
}

export { InvalidCharacterError };
