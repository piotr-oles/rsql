import { ScanProcessor } from "../LexerProcessor";

function createScanSymbol<TSymbol extends string>(symbols: ReadonlyArray<TSymbol>): ScanProcessor<TSymbol> {
  return function scanSymbol(context) {
    return symbols.find((symbol) => context.buffer.substr(context.position, symbol.length) === symbol) || null;
  };
}

export { createScanSymbol };
