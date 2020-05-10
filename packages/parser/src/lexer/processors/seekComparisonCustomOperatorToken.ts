import { createOperatorToken, OperatorToken } from "../Token";
import { SeekProcessor } from "../LexerProcessor";

const seekComparisonCustomOperatorToken: SeekProcessor<OperatorToken> = (context) => {
  // scan for FIQL custom operators: =[a-z]=
  // assume that context.buffer[context.position] === '='
  let endPosition = context.position + 1;

  // scan for chars from a to z
  while (
    endPosition < context.length &&
    context.buffer.charCodeAt(endPosition) >= 97 && // a
    context.buffer.charCodeAt(endPosition) <= 122 // z
  ) {
    endPosition++;
  }

  if (context.buffer[endPosition] === "=") {
    const operator = context.buffer.slice(context.position, endPosition + 1);
    const token = createOperatorToken(operator, context.position);
    context.position += operator.length;

    return token;
  }

  return null;
};

export default seekComparisonCustomOperatorToken;
