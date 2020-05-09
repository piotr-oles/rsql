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

const CanonicalComparisionOperators = [EQ, NEQ, LE, GE, LT, GT, IN, OUT];
type CanonicalComparisionOperator = typeof CanonicalComparisionOperators[number];

const VerboseComparisionOperators = [LE_VERBOSE, GE_VERBOSE, LT_VERBOSE, GT_VERBOSE];
type VerboseComparisionOperator = typeof VerboseComparisionOperators[number];

const ComparisionOperators = [EQ, NEQ, LE, GE, LT, GT, IN, OUT, LE_VERBOSE, GE_VERBOSE, LT_VERBOSE, GT_VERBOSE];
type ComparisionOperator = typeof ComparisionOperators[number];

function mapToCanonicalComparisionOperator(operator: ComparisionOperator): CanonicalComparisionOperator {
  switch (operator) {
    case LE_VERBOSE:
      return LE;
    case LT_VERBOSE:
      return LT;
    case GE_VERBOSE:
      return GE;
    case GT_VERBOSE:
      return GT;
    default:
      return operator;
  }
}

function isComparisionOperator(candidate: string, operator?: ComparisionOperator): candidate is ComparisionOperator {
  switch (candidate) {
    case EQ:
    case NEQ:
    case LE:
    case GE:
    case LT:
    case GT:
    case IN:
    case OUT:
    case LE_VERBOSE:
    case GE_VERBOSE:
    case LT_VERBOSE:
    case GT_VERBOSE:
      return (
        operator === undefined ||
        mapToCanonicalComparisionOperator(candidate) === mapToCanonicalComparisionOperator(operator)
      );
    default:
      return false;
  }
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
  ComparisionOperators,
  CanonicalComparisionOperators,
  VerboseComparisionOperators,
  isComparisionOperator,
  ComparisionOperator,
  CanonicalComparisionOperator,
  VerboseComparisionOperator,
};
