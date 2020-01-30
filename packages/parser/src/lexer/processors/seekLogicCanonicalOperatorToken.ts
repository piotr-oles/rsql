import { CanonicalLogicOperatorSymbol } from "@rsql/definitions";
import { createOperatorToken, OperatorToken } from "../Token";
import { SeekProcessor } from "../LexerProcessor";

const seekLogicCanonicalOperatorToken: SeekProcessor<OperatorToken> = (context) => {
  // we assume that symbol is a valid LogicOperatorSymbol
  const operator = context.buffer.charAt(context.position) as CanonicalLogicOperatorSymbol;

  const token = createOperatorToken(operator, context.position);
  context.position += 1;

  return token;
};

export default seekLogicCanonicalOperatorToken;
