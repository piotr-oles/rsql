import {
  createSelectorNode,
  createValueNode,
  createComparisionNode,
  createLogicNode,
  isNode,
  isSelectorNode,
  isValueNode,
  isComparisionNode,
  isLogicNode,
  isExpressionNode,
  Node,
  SelectorNode,
  ValueNode,
  BinaryNode,
  ComparisionNode,
  LogicNode,
  ExpressionNode,
} from "@rsql/ast";

describe("Node", () => {
  it("exports node factories", () => {
    expect(createSelectorNode).toBeInstanceOf(Function);
    expect(createValueNode).toBeInstanceOf(Function);
    expect(createComparisionNode).toBeInstanceOf(Function);
    expect(createLogicNode).toBeInstanceOf(Function);
  });

  it("exports node type guards", () => {
    expect(isNode).toBeInstanceOf(Function);
    expect(isSelectorNode).toBeInstanceOf(Function);
    expect(isValueNode).toBeInstanceOf(Function);
    expect(isComparisionNode).toBeInstanceOf(Function);
    expect(isLogicNode).toBeInstanceOf(Function);
    expect(isExpressionNode).toBeInstanceOf(Function);
  });

  it("exports node types", () => {
    /* eslint-disable @typescript-eslint/no-unused-vars */
    let node: Node;
    let selectorNode: SelectorNode;
    let valueNode: ValueNode;
    let binaryExpressionNode: BinaryNode;
    let comparisionNode: ComparisionNode;
    let logicNode: LogicNode;
    let expressionNode: ExpressionNode;
    /* eslint-enable @typescript-eslint/no-unused-vars */

    expect(true).toEqual(true);
  });

  it("creates selector node for valid input", () => {
    const node = createSelectorNode("test");

    expect(node.type).toEqual("SELECTOR");
    expect(node.selector).toEqual("test");
    expect(node.toString()).toEqual('SelectorNode("test")');
  });

  it.each([
    ["", 'The "selector" cannot be an empty string.'],
    ["test ", 'The "selector" contains reserved character \' \' at position 5 in "test "'],
  ])("throws an error for invalid selector input '%p'", (selector, error) => {
    expect(() => createSelectorNode(selector)).toThrowError(error);
    expect(() => createSelectorNode(selector, true)).not.toThrowError();
  });

  it.each([
    "test",
    "test'",
    "''''''",
    '""""""',
    "test\\",
    "",
    "\\\\",
    "     ",
    "\n\n\n",
    "#%#@%!@$",
    "==",
    "=le=",
    ";",
    ",",
    "(",
    "()",
  ])("creates value node for valid single input '%p'", (value) => {
    const node = createValueNode(value);

    expect(node.type).toEqual("VALUE");
    expect(node.value).toEqual(value);
    expect(node.toString()).toEqual(`ValueNode(${JSON.stringify(value)})`);
  });

  it.each([
    [["test"]],
    [["test", "another", "with space"]],
    [['"""""', "'''''"]],
    [["\\\\\\", "==", "=le=", "(", ")"]],
  ])("creates value node for valid multiple input '%p'", (values) => {
    const node = createValueNode(values);

    expect(node.type).toEqual("VALUE");
    expect(node.value).toEqual(values);
    expect(node.toString()).toEqual(`ValueNode(${JSON.stringify(values)})`);
  });

  it.each([[[], 'The "value" cannot be an empty array.']])(
    "throws an error for invalid value input",
    (value, error) => {
      expect(() => createValueNode(value)).toThrowError(error);
      expect(() => createValueNode(value, true)).not.toThrowError();
    }
  );

  it.each(["==", "!=", ">", ">=", "<", "<=", "=in=", "=out=", "=gt=", "=ge=", "=lt=", "=le="] as const)(
    "creates comparision expression node for canonical operator '%p'",
    (operator) => {
      const selector = createSelectorNode("selector");
      const value = createValueNode("value");
      const comparision = createComparisionNode(selector, operator, value);

      expect(comparision.type).toEqual("COMPARISION");
      expect(comparision.left).toEqual(selector);
      expect(comparision.right).toEqual(value);
      expect(comparision.operator).toEqual(operator);
      expect(comparision.toString()).toEqual(
        `ComparisionNode(SelectorNode("selector"),${operator},ValueNode("value"))`
      );
    }
  );

  it.each([";", ","] as const)("creates logic expression node for operator '%p'", (operator) => {
    const left = createComparisionNode(createSelectorNode("selectorA"), "==", createValueNode("valueA"));
    const right = createComparisionNode(
      createSelectorNode("selectorB"),
      "=out=",
      createValueNode(["valueB", "valueC"])
    );
    const logic = createLogicNode(left, operator, right);

    expect(logic.type).toEqual("LOGIC");
    expect(logic.left).toEqual(left);
    expect(logic.right).toEqual(right);
    expect(logic.operator).toEqual(operator);
    expect(logic.toString()).toEqual(
      `LogicNode(ComparisionNode(SelectorNode("selectorA"),==,ValueNode("valueA")),${operator},ComparisionNode(SelectorNode("selectorB"),=out=,ValueNode(["valueB","valueC"])))`
    );
  });

  it.each([
    [{}, false],
    [{ type: "" }, true],
    [{ type: "TEST" }, true],
    // we are not strict about "type" field type - it's specified in more concrete node types
    [{ type: true }, true],
  ])("checks if '%p' candidate is a node (%p)", (candidate, is) => {
    expect(isNode(candidate)).toEqual(is);
  });

  it.each([
    [{ type: "", selector: "test" }, false],
    [{}, false],
    [{ type: "SELECTOR", selector: "selector" }, true],
    // we are very not very strict on checks - it's used in the parser so for the sake of performance we assume that we pass a "friendly" input
    [{ type: "SELECTOR", foo: "invalid" }, true],
    [{ type: "SELECTOR" }, true],
    [{ type: "SELECTOR", selector: "" }, true],
    [{ type: "SELECTOR", selector: "  " }, true],
  ])("checks if '%p' candidate is a selector node (%p)", (candidate, is) => {
    expect(isSelectorNode(candidate)).toEqual(is);
  });

  it.each([
    [{ type: "", value: "test" }, false],
    [{}, false],
    [{ type: "VALUE", value: "value" }, true],
    [{ type: "VALUE", value: ["value a", "value b"] }, true],
    // we are very not very strict on checks - it's used in the parser so for the sake of performance we assume that we pass a "friendly" input
    [{ type: "VALUE", foo: "invalid" }, true],
    [{ type: "VALUE" }, true],
    [{ type: "VALUE", value: [] }, true],
  ])("checks if '%p' candidate is a value node (%p)", (candidate, is) => {
    expect(isValueNode(candidate)).toEqual(is);
  });

  it.each([
    [
      {
        type: "",
        left: { type: "SELECTOR", selector: "selector" },
        operator: "==",
        right: { type: "VALUE", value: "value" },
      },
      false,
    ],
    [{}, false],
    [
      {
        type: "COMPARISION",
        left: { type: "SELECTOR", selector: "selector" },
        operator: "==",
        right: { type: "VALUE", value: "value" },
      },
      true,
    ],
    // we are very not very strict on checks - it's used in the parser so for the sake of performance we assume that we pass a "friendly" input
    [
      {
        type: "COMPARISION",
        foo: "invalid",
      },
      true,
    ],
    [
      {
        type: "COMPARISION",
        left: "invalid",
        operator: "invalid",
        right: "invalid",
      },
      true,
    ],
  ])("checks if '%p' candidate is a comparision expression node (%p)", (candidate, is) => {
    expect(isComparisionNode(candidate)).toEqual(is);
    expect(isExpressionNode(candidate)).toEqual(is);
  });

  it.each([
    [
      {
        type: "",
        left: {
          type: "COMPARISION",
          left: { type: "SELECTOR", selector: "selector" },
          operator: "==",
          right: { type: "VALUE", value: "valueA" },
        },
        operator: ";",
        right: {
          type: "COMPARISION",
          left: { type: "SELECTOR", selector: "selector" },
          operator: "==",
          right: { type: "VALUE", value: "valueB" },
        },
      },
      false,
    ],
    [{}, false],
    [
      {
        type: "LOGIC",
        left: {
          type: "COMPARISION",
          left: { type: "SELECTOR", selector: "selector" },
          operator: "==",
          right: { type: "VALUE", value: "valueA" },
        },
        operator: ";",
        right: {
          type: "COMPARISION",
          left: { type: "SELECTOR", selector: "selector" },
          operator: "==",
          right: { type: "VALUE", value: "valueB" },
        },
      },
      true,
    ],
    [
      {
        type: "LOGIC",
        left: {
          type: "LOGIC",
          left: {
            type: "COMPARISION",
            left: { type: "SELECTOR", selector: "selector" },
            operator: "==",
            right: { type: "VALUE", value: "valueA" },
          },
          operator: ",",
          right: {
            type: "COMPARISION",
            left: { type: "SELECTOR", selector: "selector" },
            operator: "==",
            right: { type: "VALUE", value: "valueB" },
          },
        },
        operator: ";",
        right: {
          type: "COMPARISION",
          left: { type: "SELECTOR", selector: "selector" },
          operator: "==",
          right: { type: "VALUE", value: "valueB" },
        },
      },
      true,
    ],
    [
      {
        type: "LOGIC",
        left: {
          type: "LOGIC",
          left: {
            type: "COMPARISION",
            left: { type: "SELECTOR", selector: "selector" },
            operator: "==",
            right: { type: "VALUE", value: "valueA" },
          },
          operator: ",",
          right: {
            type: "COMPARISION",
            left: { type: "SELECTOR", selector: "selector" },
            operator: "==",
            right: { type: "VALUE", value: "valueB" },
          },
        },
        operator: ",",
        right: {
          type: "LOGIC",
          left: {
            type: "COMPARISION",
            left: { type: "SELECTOR", selector: "selector" },
            operator: "==",
            right: { type: "VALUE", value: "valueA" },
          },
          operator: ",",
          right: {
            type: "COMPARISION",
            left: { type: "SELECTOR", selector: "selector" },
            operator: "==",
            right: { type: "VALUE", value: "valueB" },
          },
        },
      },
      true,
    ],
    // we are very not very strict on checks - it's used in the parser so for the sake of performance we assume that we pass a "friendly" input
    [
      {
        type: "LOGIC",
        foo: "invalid",
      },
      true,
    ],
    [
      {
        type: "LOGIC",
        left: "invalid",
        operator: "invalid",
        right: "invalid",
      },
      true,
    ],
  ])("checks if '%p' candidate is a logic expression node (%p)", (candidate, is) => {
    expect(isLogicNode(candidate)).toEqual(is);
    expect(isExpressionNode(candidate)).toEqual(is);
  });
});
