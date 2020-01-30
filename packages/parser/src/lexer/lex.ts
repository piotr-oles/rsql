import { AnyToken, createEndToken } from "./Token";
import { createLexerContext } from "./LexerContext";
import seekAnyToken from "./processors/seekAnyToken";

function lex(input: string): AnyToken[] {
  const context = createLexerContext(input);
  const tokens = [];

  for (let token = seekAnyToken(context); token !== null; token = seekAnyToken(context)) {
    tokens.push(token);
  }

  tokens.push(createEndToken(context.position));

  return tokens;
}

export default lex;
