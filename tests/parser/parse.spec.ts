import { isComparisionExpressionNode, isLogicExpressionNode, isSelectorNode, isValueNode } from "@rsql/ast";
import { parse } from "@rsql/parser";

function assert(condition: unknown): asserts condition {
  expect(condition).toBeTruthy();
}

describe("parse", () => {
  it.each([
    ["==", "=="],
    ["!=", "!="],
    ["<=", "<="],
    [">=", ">="],
    ["<", "<"],
    [">", ">"],
    ["=in=", "=in="],
    ["=out=", "=out="],
    ["=le=", "<="],
    ["=ge=", ">="],
    ["=lt=", "<"],
    ["=gt=", ">"],
  ])("parses comparision expression for operator %p", (operator, canonicalOperator) => {
    const rsql = `selector${operator}value`;
    const comparision = parse(rsql);

    assert(isComparisionExpressionNode(comparision));
    assert(isSelectorNode(comparision.left));
    assert(isValueNode(comparision.right));

    expect(comparision.operator).toEqual(canonicalOperator);
    expect(comparision.left.selector).toEqual("selector");
    expect(comparision.right.value).toEqual("value");
  });

  it('throws exception for comparision operator typo "="', () => {
    expect(() => parse("selector=value")).toThrowError("Unexpected character '=' at position 9 in \"selector=value\"");
  });

  it.each(["allons-y", "l00k.dot.path", "look/XML/path", "n:look/n:xml", "path.to::Ref", "$doll_r.way"])(
    'parses selector "%p"',
    (selector) => {
      const rsql = `${selector}==value`;
      const comparision = parse(rsql);

      assert(isComparisionExpressionNode(comparision));
      assert(isSelectorNode(comparision.left));
      assert(isValueNode(comparision.right));

      expect(comparision.operator).toEqual("==");
      expect(comparision.left.selector).toEqual(selector);
      expect(comparision.right.value).toEqual("value");
    }
  );

  it.each([
    ['ill"', `Unclosed quote '"' at position 4 in "ill"==value"`],
    ["ill'", `Unclosed quote ''' at position 4 in "ill'==value"`],
    ["ill(", `Unexpected character '(' at position 4 in "ill(==value"`],
    ["ill)", `Unexpected character ')' at position 4 in "ill)==value"`],
    ["ill;", `Unexpected character ';' at position 4 in "ill;==value"`],
    ["ill,", `Unexpected character ',' at position 4 in "ill,==value"`],
    ["ill=", `Unexpected character '=' at position 6 in "ill===value"`],
    ["ill<", `Unexpected character '=' at position 6 in "ill<==value`],
    ["ill>", `Unexpected character '=' at position 6 in "ill>==value`],
    ["ill!", `Unexpected character '=' at position 6 in "ill!==value`],
    ["ill~", `Unexpected character '~' at position 4 in "ill~==value`],
    ['ill"ness', `Unclosed quote '"' at position 4 in "ill"ness==value`],
    ["ill'ness", `Unclosed quote ''' at position 4 in "ill'ness==value`],
    ["ill(ness", `Unexpected character '(' at position 4 in "ill(ness==value"`],
    ["ill)ness", `Unexpected character ')' at position 4 in "ill)ness==value"`],
    ["ill;ness", `Unexpected character ';' at position 4 in "ill;ness==value"`],
    ["ill,ness", `Unexpected character ',' at position 4 in "ill,ness==value"`],
    ["ill=ness", `Unexpected character '=' at position 4 in "ill=ness==value`],
    ["ill<ness", `Unexpected character '==' at position 9 in "ill<ness==value"`],
    ["ill>ness", `Unexpected character '==' at position 9 in "ill>ness==value"`],
    ["ill!ness", `Unexpected character '!' at position 4 in "ill!ness==value`],
    ["ill~ness", `Unexpected character '~' at position 4 in "ill~ness==value`],
  ])('throws error for selector with reserved char "%p"', (selector, error) => {
    expect(() => parse(`${selector}==value`)).toThrowError(error);
  });

  it("throws exception for empty selector", () => {
    expect(() => parse("==value")).toThrowError(`Unexpected character '==' at position 1 in "==value"`);
  });

  it.each(["«Allons-y»", "h@llo", "*star*", "čes*ký", "42", "0.15", "3:15"])('parses unquoted value "%p"', (value) => {
    const rsql = `selector==${value}`;
    const comparision = parse(rsql);

    assert(isComparisionExpressionNode(comparision));
    assert(isSelectorNode(comparision.left));
    assert(isValueNode(comparision.right));

    expect(comparision.operator).toEqual("==");
    expect(comparision.left.selector).toEqual("selector");
    expect(comparision.right.value).toEqual(value);
  });

  it.each([
    ['ill"', `Unclosed quote '"' at position 14 in "selector==ill""`],
    ["ill'", `Unclosed quote ''' at position 14 in "selector==ill'"`],
    ["ill(", `Unexpected character '(' at position 14 in "selector==ill("`],
    ["ill)", `Unexpected character ')' at position 14 in "selector==ill)"`],
    ["ill;", `Unexpected end in "selector==ill;"`],
    ["ill,", `Unexpected end in "selector==ill,"`],
    ["ill=", `Unexpected character '=' at position 14 in "selector==ill="`],
    ["ill<", `Unexpected character '<' at position 14 in "selector==ill<"`],
    ["ill>", `Unexpected character '>' at position 14 in "selector==ill>"`],
    ["ill!", `Unexpected character '!' at position 14 in "selector==ill!"`],
    ["ill~", `Unexpected character '~' at position 14 in "selector==ill~"`],
    ['ill"ness', `Unclosed quote '"' at position 14 in "selector==ill"ness"`],
    ["ill'ness", `Unclosed quote ''' at position 14 in "selector==ill'ness"`],
    ["ill(ness", `Unexpected character '(' at position 14 in "selector==ill(ness"`],
    ["ill)ness", `Unexpected character ')' at position 14 in "selector==ill)ness"`],
    ["ill;ness", `Unexpected end in "selector==ill;ness"`],
    ["ill,ness", `Unexpected end in "selector==ill,ness"`],
    ["ill=ness", `Unexpected character '=' at position 14 in "selector==ill=ness"`],
    ["ill<ness", `Unexpected character '<' at position 14 in "selector==ill<ness"`],
    ["ill>ness", `Unexpected character '>' at position 14 in "selector==ill>ness"`],
    ["ill!ness", `Unexpected character '!' at position 14 in "selector==ill!ness"`],
    ["ill~ness", `Unexpected character '~' at position 14 in "selector==ill~ness"`],
  ])('throws error for unquoted value with reserved char "%p"', (value, error) => {
    expect(() => parse(`selector==${value}`)).toThrowError(error);
  });

  it("throws an error for empty selector", () => {
    expect(() => parse("==value")).toThrowError(`Unexpected character '==' at position 1 in "==value"`);
  });

  it.each(['"hi there!"', "'Pěkný den!'", '"Flynn\'s *"', "\"o)'O'(o\"", '"6*7=42"', '""'])(
    'parses quoted value with any chars "%p"',
    (value) => {
      const rsql = `selector==${value}`;
      const comparision = parse(rsql);

      assert(isComparisionExpressionNode(comparision));
      assert(isSelectorNode(comparision.left));
      assert(isValueNode(comparision.right));

      expect(comparision.operator).toEqual("==");
      expect(comparision.left.selector).toEqual("selector");
      expect(comparision.right.value).toEqual(value.slice(1, -1));
    }
  );

  it.each([
    "'10\\' 15\"'",
    "'10\\' 15\\\"'",
    "'w\\\\ \\'Flyn\\n\\''",
    "'\\\\(^_^)/'",
    "'\\\\'",
    '"10\' 15\\""',
    '"10\\\' 15\\""',
    '"w\\\\ \\"Flyn\\n\\""',
    '"\\\\(^_^)/"',
    '"\\\\"',
  ])('parses escaped quoted value "%p"', (value) => {
    const rsql = `selector==${value}`;
    const comparision = parse(rsql);

    assert(isComparisionExpressionNode(comparision));
    assert(isSelectorNode(comparision.left));
    assert(isValueNode(comparision.right));

    expect(comparision.operator).toEqual("==");
    expect(comparision.left.selector).toEqual("selector");
    expect(comparision.right.value).toEqual(value.slice(1, -1));
  });

  it.each([
    [
      ["chunky", "bacon", '"ftw!"'],
      ["chunky", "bacon", "ftw!"],
    ],
    [
      ["'hi!'", '"how\'re you?"'],
      ["hi!", "how're you?"],
    ],
    [["meh"], ["meh"]],
    [['")o("'], [")o("]],
  ])('parses values group "%p"', (values, expectedValues) => {
    const rsql = `selector=in=(${values.join(",")})`;
    const comparision = parse(rsql);

    assert(isComparisionExpressionNode(comparision));
    assert(isSelectorNode(comparision.left));
    assert(isValueNode(comparision.right));

    expect(comparision.operator).toEqual("=in=");
    expect(comparision.left.selector).toEqual("selector");
    expect(comparision.right.value).toEqual(expectedValues);
  });

  it("throws an error for empty value", () => {
    expect(() => parse("selector=in=()")).toThrowError(`Unexpected character ')' at position 14 in "selector=in=()"`);
  });

  it.each([
    [",", ","],
    [";", ";"],
    [" and ", ";"],
    [" or ", ","],
  ])('parses logical operator "%p"', (operator, canonicalOperator) => {
    const rsql = `selector1==value1${operator}selector2!=value2`;
    const logic = parse(rsql);

    assert(isLogicExpressionNode(logic));
    assert(isComparisionExpressionNode(logic.left));
    expect(logic.operator).toEqual(canonicalOperator);
    assert(isComparisionExpressionNode(logic.right));

    // left comparision
    assert(isSelectorNode(logic.left.left));
    expect(logic.left.left.selector).toEqual("selector1");
    expect(logic.left.operator).toEqual("==");
    assert(isValueNode(logic.left.right));
    expect(logic.left.right.value).toEqual("value1");

    // right comparision
    assert(isSelectorNode(logic.right.left));
    expect(logic.right.left.selector).toEqual("selector2");
    expect(logic.right.operator).toEqual("!=");
    assert(isValueNode(logic.right.right));
    expect(logic.right.right.value).toEqual("value2");
  });

  it.each(["s0==v0;s1==v1;s2==v2", "s0==v0,s1=out=(v10,v11),s2==v2", "s0==v0,s1==v1;s2==v2,s3==v3"])(
    'parses query with operator precedence "%p"',
    (rsql) => {
      const ast = parse(rsql);

      expect(ast).toMatchSnapshot();
    }
  );

  it.each([
    "(s0==a0,s1==a1);s2==a2",
    "(s0==a0,s1=out=(a10,a11));s2==a2,s3==a3",
    "((s0==a0,s1==a1);s2==a2,s3==a3);s4==a4",
    "(s0==a0)",
    "((s0==a0));s1==a1",
  ])('parses query with parenthesis "%p"', (rsql) => {
    const ast = parse(rsql);

    expect(ast).toMatchSnapshot();
  });

  it.each([
    ["(s0==a0;s1!=a1", 'Unexpected end in "(s0==a0;s1!=a1". Did you forget to close parenthesis at position 1?'],
    ["s0==a0)", "Unexpected character ')' at position 7 in \"s0==a0)\""],
    [
      "s0==a;(s1=in=(b,c),s2!=d",
      'Unexpected end in "s0==a;(s1=in=(b,c),s2!=d". Did you forget to close parenthesis at position 5?',
    ],
  ])('throws an error for unclosed parenthesis "%p"', (rsql, error) => {
    expect(() => parse(rsql)).toThrowError(error);
  });
});
