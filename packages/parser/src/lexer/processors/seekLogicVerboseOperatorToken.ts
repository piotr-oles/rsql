import { VerboseLogicOperators } from "@rsql/ast";
import { SeekProcessor } from "../LexerProcessor";
import { createOperatorToken, OperatorToken } from "../Token";
import { createScanNonReservedSymbol } from "./scanNonReservedSymbol";

const scanLogicVerboseOperator = createScanNonReservedSymbol(VerboseLogicOperators);

const seekLogicVerboseOperatorToken: SeekProcessor<OperatorToken> = (context) => {
  const operator = scanLogicVerboseOperator(context);

  if (operator) {
    const token = createOperatorToken(operator, context.position);
    context.position += operator.length;

    return token;
  }

  return null;
};

export default seekLogicVerboseOperatorToken;
