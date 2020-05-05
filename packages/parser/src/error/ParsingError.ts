class ParsingError extends Error {
  constructor(message: string, readonly source: string) {
    super(message);

    Object.setPrototypeOf(this, ParsingError.prototype);
  }
}

export default ParsingError;
