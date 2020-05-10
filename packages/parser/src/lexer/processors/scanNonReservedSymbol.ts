import { ScanProcessor } from "../LexerProcessor";

function createScanNonReservedSymbol<TSymbol extends string>(symbols: ReadonlyArray<TSymbol>): ScanProcessor<TSymbol> {
  return function scanNonReservedSymbol(context) {
    return (
      symbols.find(
        (symbol) =>
          context.buffer.substr(context.position, symbol.length) === symbol &&
          context.buffer[context.position + symbol.length] === " "
      ) || null
    );
  };
}

export { createScanNonReservedSymbol };
