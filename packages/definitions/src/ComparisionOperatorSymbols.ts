const EQ = "==" as const;
const NEQ = "!=" as const;
const LE = "<=" as const;
const GE = ">=" as const;
const LT = "<" as const;
const GT = ">" as const;
const IN = "=in=" as const;
const OUT = "=out=" as const;
const LE_VERBOSE = "=le=" as const;
const GE_VERBOSE = "=ge=" as const;
const LT_VERBOSE = "=lt=" as const;
const GT_VERBOSE = "=gt=" as const;

const CanonicalComparisionOperatorSymbols = [EQ, NEQ, LE, GE, LT, GT, IN, OUT];
type CanonicalComparisionOperatorSymbol = typeof CanonicalComparisionOperatorSymbols[number];

const VerboseComparisionOperatorSymbols = [LE_VERBOSE, GE_VERBOSE, LT_VERBOSE, GT_VERBOSE];
type VerboseComparisionOperatorSymbol = typeof VerboseComparisionOperatorSymbols[number];

const ComparisionOperatorSymbols = [EQ, NEQ, LE, GE, LT, GT, IN, OUT, LE_VERBOSE, GE_VERBOSE, LT_VERBOSE, GT_VERBOSE];
type ComparisionOperatorSymbol = typeof ComparisionOperatorSymbols[number];

const ComparisionOperatorSymbolsSet = new Set(ComparisionOperatorSymbols);
function isComparisionOperatorSymbol(candidate: string): candidate is ComparisionOperatorSymbol {
  return ComparisionOperatorSymbolsSet.has(candidate as ComparisionOperatorSymbol);
}

function isEqOperatorSymbol(candidate: string): candidate is ComparisionOperatorSymbol {
  return candidate === EQ;
}
function isNeqOperatorSymbol(candidate: string): candidate is ComparisionOperatorSymbol {
  return candidate === NEQ;
}
function isLeOperatorSymbol(candidate: string): candidate is ComparisionOperatorSymbol {
  return candidate === LE || candidate === LE_VERBOSE;
}
function isGeOperatorSymbol(candidate: string): candidate is ComparisionOperatorSymbol {
  return candidate === GE || candidate === GE_VERBOSE;
}
function isLtOperatorSymbol(candidate: string): candidate is ComparisionOperatorSymbol {
  return candidate === LT || candidate === LT_VERBOSE;
}
function isGtOperatorSymbol(candidate: string): candidate is ComparisionOperatorSymbol {
  return candidate === GT || candidate === GT_VERBOSE;
}
function isInOperatorSymbol(candidate: string): candidate is ComparisionOperatorSymbol {
  return candidate === IN;
}
function isOutOperatorSymbol(candidate: string): candidate is ComparisionOperatorSymbol {
  return candidate === OUT;
}

const CANONICAL_COMPARISION_OPERATOR_SYMBOL_MAP = {
  [LE_VERBOSE]: LE,
  [LT_VERBOSE]: LT,
  [GE_VERBOSE]: GE,
  [GT_VERBOSE]: GT,
} as { [key: string]: CanonicalComparisionOperatorSymbol };
function mapToCanonicalComparisionOperatorSymbol(
  symbol: ComparisionOperatorSymbol
): CanonicalComparisionOperatorSymbol {
  return CANONICAL_COMPARISION_OPERATOR_SYMBOL_MAP[symbol] || symbol;
}

export {
  EQ,
  NEQ,
  LE,
  GE,
  LT,
  GT,
  IN,
  OUT,
  LE_VERBOSE,
  GE_VERBOSE,
  LT_VERBOSE,
  GT_VERBOSE,
  CanonicalComparisionOperatorSymbols,
  VerboseComparisionOperatorSymbols,
  ComparisionOperatorSymbols,
  isComparisionOperatorSymbol,
  isEqOperatorSymbol,
  isNeqOperatorSymbol,
  isLeOperatorSymbol,
  isGeOperatorSymbol,
  isLtOperatorSymbol,
  isGtOperatorSymbol,
  isInOperatorSymbol,
  isOutOperatorSymbol,
  mapToCanonicalComparisionOperatorSymbol,
  CanonicalComparisionOperatorSymbol,
  VerboseComparisionOperatorSymbol,
  ComparisionOperatorSymbol,
};
