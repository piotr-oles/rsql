import { ComparisionOperatorSymbols, mapToCanonicalComparisionOperatorSymbol } from "@rsql/definitions";
import { createOperatorToken, OperatorToken } from "../Token";
import { SeekProcessor } from "../LexerProcessor";
import { createScanSymbol } from "./scanSymbol";

const scanAnyComparisionOperatorSymbol = createScanSymbol(ComparisionOperatorSymbols);

const seekComparisionOperatorToken: SeekProcessor<OperatorToken> = (context) => {
  const symbol = scanAnyComparisionOperatorSymbol(context);

  if (symbol) {
    const token = createOperatorToken(mapToCanonicalComparisionOperatorSymbol(symbol), context.position);
    context.position += symbol.length;

    return token;
  }

  return null;
};

export default seekComparisionOperatorToken;
