import { ComparisonOperators } from "@rsql/ast";
import { createOperatorToken, OperatorToken } from "../Token";
import { SeekProcessor } from "../LexerProcessor";
import { createScanSymbol } from "./scanSymbol";

const scanAnyComparisonOperator = createScanSymbol(ComparisonOperators);

const seekComparisonOperatorToken: SeekProcessor<OperatorToken> = (context) => {
  const operator = scanAnyComparisonOperator(context);

  if (operator) {
    const token = createOperatorToken(operator, context.position);
    context.position += operator.length;

    return token;
  }

  return null;
};

export default seekComparisonOperatorToken;
