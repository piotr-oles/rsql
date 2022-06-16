import builder from "@rsql/builder";
import { parse } from "@rsql/parser";
import { emit } from "@rsql/emitter";

describe("emit", () => {
  it.each(["==", "!=", "<=", ">=", "<", ">", "=in=", "=out=", "=le=", "=ge=", "=lt=", "=gt="])(
    "emits comparison expression for operator %p",
    (operator) => {
      const rsql = `selector${operator}value`;
      const ast = parse(rsql);
      const emittedRsql = emit(ast);
      const expectedRsql = `selector${operator}value`;

      expect(emittedRsql).toEqual(expectedRsql);
    }
  );

  it.each(["allons-y", "l00k.dot.path", "look/XML/path", "n:look/n:xml", "path.to::Ref", "$doll_r.way"])(
    'emits selector "%p"',
    (selector) => {
      const rsql = `${selector}==value`;
      const ast = parse(rsql);
      const emittedRsql = emit(ast);

      expect(emittedRsql).toEqual(rsql);
    }
  );

  it.each(["«Allons-y»", "h@llo", "*star*", "čes*ký", "42", "0.15", "3:15"])('emits unquoted value "%p"', (value) => {
    const rsql = `selector==${value}`;
    const ast = parse(rsql);
    const emittedRsql = emit(ast);

    expect(emittedRsql).toEqual(rsql);
  });

  it.each([
    ["hi there!", '"hi there!"'],
    ['hi "there\\!', '"hi \\"there\\\\!"'],
    ["Pěkný den!", '"Pěkný den!"'],
    ["Flynn's *", '"Flynn\'s *"'],
    ["o)'O'(o", "\"o)'O'(o\""],
    ["6*7=42", '"6*7=42"'],
  ])('emits quoted value with any chars "%p"', (value, escapedValue) => {
    const ast = builder.comparison("selector", "==", value);
    const emittedRsql = emit(ast);
    const expectedRsql = `selector==${escapedValue}`;

    expect(emittedRsql).toEqual(expectedRsql);

    const parsedAst = parse(emittedRsql);
    expect(parsedAst).toEqual(ast);
  });

  test('Empty string will be emitted as ""', () => {
    const rsql = `selector==""`;
    const ast = parse(rsql);
    const emittedRsql = emit(ast);
    const expectedRsql = `selector==""`;

    expect(emittedRsql).toEqual(expectedRsql);
  });

  it.each([
    ["(s0==a0,s1==a1);s2==a2", "(s0==a0,s1==a1);s2==a2"],
    ["(s0==a0 or s1==a1) and s2==a2", "(s0==a0 or s1==a1) and s2==a2"],
    ["(s0==a0,s1=out=(a10,a11));s2==a2,s3==a3", "(s0==a0,s1=out=(a10,a11));s2==a2,s3==a3"],
    ["((s0==a0,s1==a1);s2==a2,s3==a3);s4==a4", "((s0==a0,s1==a1);s2==a2,s3==a3);s4==a4"],
    ["(s0==a0)", "s0==a0"],
    ["((s0==a0));s1==a1", "s0==a0;s1==a1"],
  ])('emits query with parenthesis "%p"', (rsql, expectedRsql) => {
    const ast = parse(rsql);
    const emittedRsql = emit(ast);

    expect(emittedRsql).toEqual(expectedRsql);
  });

  it.each(["and", "or"])("emits query with verbose logic operators", (operator) => {
    const rsql = `selector==value ${operator} selector>value`;
    const ast = parse(rsql);
    const emittedRsql = emit(ast);

    expect(emittedRsql).toEqual(rsql);
  });
});
