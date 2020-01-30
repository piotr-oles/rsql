import { mapToCanonicalLogicOperatorSymbol, VerboseLogicOperatorSymbol } from "@rsql/definitions";
import { SeekProcessor } from "../LexerProcessor";
import { createOperatorToken, OperatorToken } from "../Token";
import { createScanSymbol } from "./scanSymbol";

// we need to add space after symbol to be sure that it doesn't match unquoted token with "and" or "or" prefix
const scanLogicVerboseOperatorSymbol = createScanSymbol(["and ", "or "]);

const seekLogicVerboseOperatorToken: SeekProcessor<OperatorToken> = (context) => {
  const symbol = scanLogicVerboseOperatorSymbol(context);

  if (symbol) {
    const token = createOperatorToken(
      // trim symbol from additional space and map to canonical
      mapToCanonicalLogicOperatorSymbol(symbol.trim() as VerboseLogicOperatorSymbol),
      context.position
    );
    // we can move position by untrimmed symbol as we don't care about space
    context.position += symbol.length;

    return token;
  }

  return null;
};

export default seekLogicVerboseOperatorToken;
