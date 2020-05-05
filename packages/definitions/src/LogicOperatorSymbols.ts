const AND = ";" as const;
const OR = "," as const;
const AND_VERBOSE = "and" as const;
const OR_VERBOSE = "or" as const;

const CanonicalLogicOperatorSymbols = [AND, OR];
type CanonicalLogicOperatorSymbol = typeof CanonicalLogicOperatorSymbols[number];

const VerboseLogicOperatorSymbols = [AND_VERBOSE, OR_VERBOSE];
type VerboseLogicOperatorSymbol = typeof VerboseLogicOperatorSymbols[number];

const LogicOperatorSymbols = [AND, OR, AND_VERBOSE, OR_VERBOSE];
type LogicOperatorSymbol = typeof LogicOperatorSymbols[number];

const LogicOperatorSymbolsSet = new Set(LogicOperatorSymbols);
function isLogicOperatorSymbol(candidate: string): candidate is LogicOperatorSymbol {
  return LogicOperatorSymbolsSet.has(candidate as LogicOperatorSymbol);
}

function isAndOperatorSymbol(candidate: string): candidate is LogicOperatorSymbol {
  return candidate === AND || candidate === AND_VERBOSE;
}

function isOrOperatorSymbol(candidate: string): candidate is LogicOperatorSymbol {
  return candidate === OR || candidate === OR_VERBOSE;
}

const CANONICAL_LOGIC_OPERATOR_SYMBOL_MAP = {
  [AND_VERBOSE]: AND,
  [OR_VERBOSE]: OR,
} as { [key: string]: CanonicalLogicOperatorSymbol };
function mapToCanonicalLogicOperatorSymbol(symbol: LogicOperatorSymbol): CanonicalLogicOperatorSymbol {
  return CANONICAL_LOGIC_OPERATOR_SYMBOL_MAP[symbol] || symbol;
}

export {
  AND,
  OR,
  AND_VERBOSE,
  OR_VERBOSE,
  CanonicalLogicOperatorSymbols,
  VerboseLogicOperatorSymbols,
  LogicOperatorSymbols,
  isLogicOperatorSymbol,
  isAndOperatorSymbol,
  isOrOperatorSymbol,
  mapToCanonicalLogicOperatorSymbol,
  CanonicalLogicOperatorSymbol,
  VerboseLogicOperatorSymbol,
  LogicOperatorSymbol,
};
