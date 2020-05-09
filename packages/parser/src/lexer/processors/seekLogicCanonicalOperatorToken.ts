import { LogicOperator } from "@rsql/ast";
import { createOperatorToken, OperatorToken } from "../Token";
import { SeekProcessor } from "../LexerProcessor";

const seekLogicCanonicalOperatorToken: SeekProcessor<OperatorToken> = (context) => {
  // we assume that symbol is a valid LogicOperator
  const operator = context.buffer.charAt(context.position) as LogicOperator;

  const token = createOperatorToken(operator, context.position);
  context.position += 1;

  return token;
};

export default seekLogicCanonicalOperatorToken;
