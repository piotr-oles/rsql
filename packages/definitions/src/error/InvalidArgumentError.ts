class InvalidArgumentError extends Error {
  constructor(message: string) {
    super(message);

    Object.setPrototypeOf(this, InvalidArgumentError.prototype);
  }
}

export { InvalidArgumentError };
