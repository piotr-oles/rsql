import { ParenthesisSymbol } from "@rsql/definitions";
import { createParenthesisToken, ParenthesisToken } from "../Token";
import { SeekProcessor } from "../LexerProcessor";

const seekParenthesisToken: SeekProcessor<ParenthesisToken> = (context) => {
  // we assume that parenthesis is a valid ParenthesisSymbol
  const parenthesis = context.buffer.charAt(context.position) as ParenthesisSymbol;

  const token = createParenthesisToken(parenthesis, context.position);
  context.position += 1;

  return token;
};

export default seekParenthesisToken;
