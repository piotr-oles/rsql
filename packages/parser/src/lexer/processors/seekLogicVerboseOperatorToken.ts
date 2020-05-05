import { VerboseLogicOperatorSymbols } from "@rsql/definitions";
import { SeekProcessor } from "../LexerProcessor";
import { createOperatorToken, OperatorToken } from "../Token";
import { createScanNonReservedSymbol } from "./scanNonReservedSymbol";

const scanLogicVerboseOperatorSymbol = createScanNonReservedSymbol(VerboseLogicOperatorSymbols);

const seekLogicVerboseOperatorToken: SeekProcessor<OperatorToken> = (context) => {
  const symbol = scanLogicVerboseOperatorSymbol(context);

  if (symbol) {
    const token = createOperatorToken(symbol, context.position);
    context.position += symbol.length;

    return token;
  }

  return null;
};

export default seekLogicVerboseOperatorToken;
