import { InvalidArgumentError } from "@rsql/definitions";

describe("InvalidArgumentError", () => {
  it("creates new Error instance", () => {
    const error = new InvalidArgumentError("Invalid argument provided.");

    expect(error).toBeInstanceOf(Error);
    expect(error.message).toEqual("Invalid argument provided.");
  });
});
