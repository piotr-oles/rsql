import { ComparisionOperators } from "@rsql/ast";
import { createOperatorToken, OperatorToken } from "../Token";
import { SeekProcessor } from "../LexerProcessor";
import { createScanSymbol } from "./scanSymbol";

const scanAnyComparisionOperator = createScanSymbol(ComparisionOperators);

const seekComparisionOperatorToken: SeekProcessor<OperatorToken> = (context) => {
  const operator = scanAnyComparisionOperator(context);

  if (operator) {
    const token = createOperatorToken(operator, context.position);
    context.position += operator.length;

    return token;
  }

  return null;
};

export default seekComparisionOperatorToken;
