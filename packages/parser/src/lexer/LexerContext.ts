interface LexerContext {
  position: number;
  readonly buffer: string;
  readonly length: number;
}

function createLexerContext(input: string): LexerContext {
  return {
    position: 0,
    buffer: input,
    length: input.length,
  };
}

export default LexerContext;
export { createLexerContext };
