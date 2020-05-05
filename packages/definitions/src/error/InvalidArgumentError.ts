class InvalidArgumentError extends Error {
  static getTypeOf(variable: unknown): string {
    if (variable === null) {
      return "null";
    } else {
      return typeof variable;
    }
  }

  static createForInvalidType(argumentName: string, functionName: string, expectedType: string, passedType: string) {
    return new InvalidArgumentError(
      `The "${argumentName}" passed to the "${functionName}" has to be a ${expectedType}, but "${passedType}" passed`
    );
  }

  constructor(message: string) {
    super(message);

    Object.setPrototypeOf(this, InvalidArgumentError.prototype);
  }
}

export { InvalidArgumentError };
