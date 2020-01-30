import { Node } from "@rsql/ast";
import { AnyToken } from "./lexer/Token";

interface ParserContext {
  position: number;
  readonly tokens: AnyToken[];
  readonly stack: (AnyToken | Node)[];
  readonly state: number[];
  readonly parent: ParserContext | null;
}

function getParserContextState(context: ParserContext): number {
  return context.state[context.state.length - 1];
}

function getParserContextToken(context: ParserContext): AnyToken {
  return context.tokens[context.position];
}

function getParserContextHead(context: ParserContext): AnyToken | Node {
  return context.stack[context.stack.length - 1];
}

function createParserContext(tokens: AnyToken[]): ParserContext {
  return {
    position: 0,
    tokens,
    stack: [],
    state: [0],
    parent: null,
  };
}

export default ParserContext;
export { getParserContextState, getParserContextToken, getParserContextHead, createParserContext };
