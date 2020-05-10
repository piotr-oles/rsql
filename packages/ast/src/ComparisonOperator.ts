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

type CustomComparisonOperator = string;

const CanonicalComparisonOperators = [EQ, NEQ, LE, GE, LT, GT, IN, OUT];
type CanonicalComparisonOperator = typeof CanonicalComparisonOperators[number];

const VerboseComparisonOperators = [LE_VERBOSE, GE_VERBOSE, LT_VERBOSE, GT_VERBOSE];
type VerboseComparisonOperator = typeof VerboseComparisonOperators[number];

const ComparisonOperators = [EQ, NEQ, LE, GE, LT, GT, IN, OUT, LE_VERBOSE, GE_VERBOSE, LT_VERBOSE, GT_VERBOSE];
type ComparisonOperator = typeof ComparisonOperators[number] | CustomComparisonOperator;

function mapToCanonicalComparisonOperator(
  operator: ComparisonOperator
): CanonicalComparisonOperator | CustomComparisonOperator {
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

const CUSTOM_OPERATOR_REGEXP = /^=[a-z]+=$/;
function isCustomComparisonOperator(candidate: string): candidate is CustomComparisonOperator {
  return candidate.length > 2 && CUSTOM_OPERATOR_REGEXP.test(candidate);
}

function isComparisonOperator(candidate: string, operator?: ComparisonOperator): candidate is ComparisonOperator {
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
        mapToCanonicalComparisonOperator(candidate) === mapToCanonicalComparisonOperator(operator)
      );
    default:
      if (isCustomComparisonOperator(candidate)) {
        return operator === undefined || candidate === operator;
      } else {
        return false;
      }
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
  ComparisonOperators,
  CanonicalComparisonOperators,
  VerboseComparisonOperators,
  isComparisonOperator,
  ComparisonOperator,
  CanonicalComparisonOperator,
  VerboseComparisonOperator,
};
