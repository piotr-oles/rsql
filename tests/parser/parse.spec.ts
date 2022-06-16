import { isComparisonNode, isLogicNode, isSelectorNode, isValueNode } from "@rsql/ast";
import { parse } from "@rsql/parser";

function assert(condition: unknown): asserts condition {
  expect(condition).toBeTruthy();
}

describe("parse", () => {
  it.each([
    ["", `Unexpected end in "". Cannot parse empty string.`],
    ["   ", `Unexpected end in "   ". Cannot parse empty string.`],
    ["\n\n", `Unexpected end in "\n\n". Cannot parse empty string.`],
    ["\t  \n\r", `Unexpected end in "\t  \n\r". Cannot parse empty string.`],
  ])("throws error for empty rsql '%p'", (rsql, expectedError) => {
    expect(() => parse(rsql)).toThrowError(expectedError);
  });

  it.each([
    [undefined, 'The argument passed to the "parse" function has to be a string, "undefined" passed.'],
    [null, 'The argument passed to the "parse" function has to be a string, "null" passed.'],
    [10, 'The argument passed to the "parse" function has to be a string, "10" passed.'],
    [{}, 'The argument passed to the "parse" function has to be a string, "[object Object]" passed.'],
    [[], 'The argument passed to the "parse" function has to be a string, "" passed.'],
  ])("throws error for invalid rsql '%p'", (rsql, expectedError) => {
    expect(() => parse((rsql as unknown) as string)).toThrowError(expectedError);
  });

  it.each(["==", "!=", "<=", ">=", "<", ">", "=in=", "=out=", "=le=", "=ge=", "=lt=", "=gt="])(
    "parses comparison expression for operator %p",
    (operator) => {
      const rsql = `selector${operator}value`;
      const comparison = parse(rsql);

      assert(isComparisonNode(comparison));
      assert(isSelectorNode(comparison.left));
      assert(isValueNode(comparison.right));

      expect(comparison.operator).toEqual(operator);
      expect(comparison.left.selector).toEqual("selector");
      expect(comparison.right.value).toEqual("value");
    }
  );

  it('throws exception for comparison operator typo "="', () => {
    expect(() => parse("selector=value")).toThrowError("Unexpected character '=' at position 9 in \"selector=value\"");
  });

  it.each(["allons-y", "l00k.dot.path", "look/XML/path", "n:look/n:xml", "path.to::Ref", "$doll_r.way"])(
    'parses selector "%p"',
    (selector) => {
      const rsql = `${selector}==value`;
      const comparison = parse(rsql);

      assert(isComparisonNode(comparison));
      assert(isSelectorNode(comparison.left));
      assert(isValueNode(comparison.right));

      expect(comparison.operator).toEqual("==");
      expect(comparison.left.selector).toEqual(selector);
      expect(comparison.right.value).toEqual("value");
    }
  );

  it.each([
    ['ill"', `Unclosed quote '"' at position 4 in "ill"==value".`],
    ["ill'", `Unclosed quote ''' at position 4 in "ill'==value".`],
    ["ill(", `Unexpected character '(' at position 4 in "ill(==value".`],
    ["ill)", `Unexpected character ')' at position 4 in "ill)==value".`],
    ["ill;", `Unexpected character ';' at position 4 in "ill;==value".`],
    ["ill,", `Unexpected character ',' at position 4 in "ill,==value".`],
    ["ill=", `Unexpected character '=' at position 6 in "ill===value".`],
    ["ill<", `Unexpected character '=' at position 6 in "ill<==value".`],
    ["ill>", `Unexpected character '=' at position 6 in "ill>==value".`],
    ["ill!", `Unexpected character '=' at position 6 in "ill!==value".`],
    ["ill~", `Unexpected character '~' at position 4 in "ill~==value".`],
    ['ill"ness', `Unclosed quote '"' at position 4 in "ill"ness==value".`],
    ["ill'ness", `Unclosed quote ''' at position 4 in "ill'ness==value".`],
    ["ill(ness", `Unexpected character '(' at position 4 in "ill(ness==value".`],
    ["ill)ness", `Unexpected character ')' at position 4 in "ill)ness==value".`],
    ["ill;ness", `Unexpected character ';' at position 4 in "ill;ness==value".`],
    ["ill,ness", `Unexpected character ',' at position 4 in "ill,ness==value".`],
    ["ill=ness", `Unexpected character '=' at position 10 in "ill=ness==value".`],
    ["ill<ness", `Unexpected string '==' at position 9 in "ill<ness==value".`],
    ["ill>ness", `Unexpected string '==' at position 9 in "ill>ness==value".`],
    ["ill!ness", `Unexpected character '!' at position 4 in "ill!ness==value".`],
    ["ill~ness", `Unexpected character '~' at position 4 in "ill~ness==value".`],
  ])('throws error for selector with reserved char "%p"', (selector, error) => {
    expect(() => parse(`${selector}==value`)).toThrowError(error);
  });

  it("throws exception for empty selector", () => {
    expect(() => parse("==value")).toThrowError(`Unexpected string '==' at position 1 in "==value".`);
  });

  it.each(["«Allons-y»", "h@llo", "*star*", "čes*ký", "42", "0.15", "3:15"])('parses unquoted value "%p"', (value) => {
    const rsql = `selector==${value}`;
    const comparison = parse(rsql);

    assert(isComparisonNode(comparison));
    assert(isSelectorNode(comparison.left));
    assert(isValueNode(comparison.right));

    expect(comparison.operator).toEqual("==");
    expect(comparison.left.selector).toEqual("selector");
    expect(comparison.right.value).toEqual(value);
  });

  it.each([
    ['ill"', `Unclosed quote '"' at position 14 in "selector==ill"".`],
    ["ill'", `Unclosed quote ''' at position 14 in "selector==ill'".`],
    ["ill(", `Unexpected character '(' at position 14 in "selector==ill(".`],
    ["ill)", `Unexpected character ')' at position 14 in "selector==ill)".`],
    ["ill;", `Unexpected end in "selector==ill;".`],
    ["ill,", `Unexpected end in "selector==ill,".`],
    ["ill=", `Unexpected character '=' at position 14 in "selector==ill=".`],
    ["ill<", `Unexpected character '<' at position 14 in "selector==ill<".`],
    ["ill>", `Unexpected character '>' at position 14 in "selector==ill>".`],
    ["ill!", `Unexpected character '!' at position 14 in "selector==ill!".`],
    ["ill~", `Unexpected character '~' at position 14 in "selector==ill~".`],
    ['ill"ness', `Unclosed quote '"' at position 14 in "selector==ill"ness".`],
    ["ill'ness", `Unclosed quote ''' at position 14 in "selector==ill'ness".`],
    ["ill(ness", `Unexpected character '(' at position 14 in "selector==ill(ness".`],
    ["ill)ness", `Unexpected character ')' at position 14 in "selector==ill)ness".`],
    ["ill;ness", `Unexpected end in "selector==ill;ness".`],
    ["ill,ness", `Unexpected end in "selector==ill,ness".`],
    ["ill=ness", `Unexpected character '=' at position 14 in "selector==ill=ness".`],
    ["ill<ness", `Unexpected character '<' at position 14 in "selector==ill<ness".`],
    ["ill>ness", `Unexpected character '>' at position 14 in "selector==ill>ness".`],
    ["ill!ness", `Unexpected character '!' at position 14 in "selector==ill!ness".`],
    ["ill~ness", `Unexpected character '~' at position 14 in "selector==ill~ness".`],
  ])('throws error for unquoted value with reserved char "%p"', (value, error) => {
    expect(() => parse(`selector==${value}`)).toThrowError(error);
  });

  it("throws an error for empty selector", () => {
    expect(() => parse("==value")).toThrowError(`Unexpected string '==' at position 1 in "==value".`);
  });

  it.each(['"hi there!"', "'Pěkný den!'", '"Flynn\'s *"', "\"o)'O'(o\"", '"6*7=42"', '""'])(
    'parses quoted value with any chars "%p"',
    (value) => {
      const rsql = `selector==${value}`;
      const comparison = parse(rsql);

      assert(isComparisonNode(comparison));
      assert(isSelectorNode(comparison.left));
      assert(isValueNode(comparison.right));

      expect(comparison.operator).toEqual("==");
      expect(comparison.left.selector).toEqual("selector");
      expect(comparison.right.value).toEqual(value.slice(1, -1));
    }
  );

  it.each([
    ["'10\\' 15\"'", "10' 15\""],
    ["'10\\' 15\\\"'", "10' 15\""],
    ["'10\\'\\\n15\\\"'", "10'\n15\""],
    ["'w\\\\ \\'Flyn\\n\\''", "w\\ 'Flynn'"],
    ["'\\\\(^_^)/'", "\\(^_^)/"],
    ["'\\\\'", "\\"],
    ["'\\\u2081\\''", "\u2081'"],
    ['"10\' 15\\""', "10' 15\""],
    ['"10\\\' 15\\""', "10' 15\""],
    ['"10\\\'\\\n15\\""', "10'\n15\""],
    ['"w\\\\ \\"Flyn\\n\\""', 'w\\ "Flynn"'],
    ['"\\\\(^_^)/"', "\\(^_^)/"],
    ['"\\\\"', "\\"],
    ['"\\\u2081\\\'"', "\u2081'"],
  ])('parses escaped quoted value "%p"', (value, unescapedValue) => {
    const rsql = `selector==${value}`;
    const comparison = parse(rsql);

    assert(isComparisonNode(comparison));
    assert(isSelectorNode(comparison.left));
    assert(isValueNode(comparison.right));

    expect(comparison.operator).toEqual("==");
    expect(comparison.left.selector).toEqual("selector");
    expect(comparison.right.value).toEqual(unescapedValue);
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
    [
      ['"So I said, \\"We need more commas!\\""', '",,,,,,,"'],
      ['So I said, "We need more commas!"', ",,,,,,,"],
    ],
  ])('parses values group "%p"', (values, expectedValues) => {
    const rsql = `selector=in=(${values.join(",")})`;
    const comparison = parse(rsql);

    assert(isComparisonNode(comparison));
    assert(isSelectorNode(comparison.left));
    assert(isValueNode(comparison.right));

    expect(comparison.operator).toEqual("=in=");
    expect(comparison.left.selector).toEqual("selector");
    expect(comparison.right.value).toEqual(expectedValues);
  });

  it("throws an error for empty value", () => {
    expect(() => parse("selector=in=()")).toThrowError(`Unexpected character ')' at position 14 in "selector=in=()".`);
  });

  it.each([
    [",", ","],
    [";", ";"],
    [" and ", "and"],
    [" or ", "or"],
  ])('parses logic operator "%p"', (fragment, operator) => {
    const rsql = `selector1==value1${fragment}selector2!=value2`;
    const logic = parse(rsql);

    assert(isLogicNode(logic));
    assert(isComparisonNode(logic.left));
    expect(logic.operator).toEqual(operator);
    assert(isComparisonNode(logic.right));

    // left comparison
    assert(isSelectorNode(logic.left.left));
    expect(logic.left.left.selector).toEqual("selector1");
    expect(logic.left.operator).toEqual("==");
    assert(isValueNode(logic.left.right));
    expect(logic.left.right.value).toEqual("value1");

    // right comparison
    assert(isSelectorNode(logic.right.left));
    expect(logic.right.left.selector).toEqual("selector2");
    expect(logic.right.operator).toEqual("!=");
    assert(isValueNode(logic.right.right));
    expect(logic.right.right.value).toEqual("value2");
  });

  it("doesn't misinterpret selector as logic operator", () => {
    const rsql = `and==2 and or>3`;
    const logic = parse(rsql);

    assert(isLogicNode(logic));
    assert(isComparisonNode(logic.left));
    expect(logic.operator).toEqual("and");
    assert(isComparisonNode(logic.right));

    // left comparison
    assert(isSelectorNode(logic.left.left));
    expect(logic.left.left.selector).toEqual("and");
    expect(logic.left.operator).toEqual("==");
    assert(isValueNode(logic.left.right));
    expect(logic.left.right.value).toEqual("2");

    // right comparison
    assert(isSelectorNode(logic.right.left));
    expect(logic.right.left.selector).toEqual("or");
    expect(logic.right.operator).toEqual(">");
    assert(isValueNode(logic.right.right));
    expect(logic.right.right.value).toEqual("3");
  });

  it("reports proper error for verbose operators", () => {
    expect(() => parse("selector==value and and selector==value")).toThrowError(
      "Unexpected string 'and' at position 21 in \"selector==value and and selector==value\"."
    );
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
    ["s0==a0)", "Unexpected character ')' at position 7 in \"s0==a0)\"."],
    [
      "s0==a;(s1=in=(b,c),s2!=d",
      'Unexpected end in "s0==a;(s1=in=(b,c),s2!=d". Did you forget to close parenthesis at position 5?',
    ],
  ])('throws an error for unclosed parenthesis "%p"', (rsql, error) => {
    expect(() => parse(rsql)).toThrowError(error);
  });

  it("parses custom operator", () => {
    const ast = parse("genres=all=('thriller','sci-fi')");

    assert(isComparisonNode(ast));
    expect(ast.left.selector).toEqual("genres");
    expect(ast.operator).toEqual("=all=");
    expect(ast.right.value).toEqual(["thriller", "sci-fi"]);
  });
});
