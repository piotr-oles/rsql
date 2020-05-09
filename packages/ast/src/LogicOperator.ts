const AND = ";" as const;
const OR = "," as const;
const AND_VERBOSE = "and" as const;
const OR_VERBOSE = "or" as const;

const CanonicalLogicOperators = [AND, OR];
type CanonicalLogicOperator = typeof CanonicalLogicOperators[number];

const VerboseLogicOperators = [AND_VERBOSE, OR_VERBOSE];
type VerboseLogicOperator = typeof VerboseLogicOperators[number];

const LogicOperators = [AND, OR, AND_VERBOSE, OR_VERBOSE];
type LogicOperator = typeof LogicOperators[number];

function mapToCanonicalLogicOperator(operator: LogicOperator): CanonicalLogicOperator {
  switch (operator) {
    case AND_VERBOSE:
      return AND;
    case OR_VERBOSE:
      return OR;
    default:
      return operator;
  }
}

function isLogicOperator(candidate: string, operator?: LogicOperator): candidate is LogicOperator {
  switch (candidate) {
    case AND:
    case OR:
    case AND_VERBOSE:
    case OR_VERBOSE:
      return operator === undefined || mapToCanonicalLogicOperator(candidate) === mapToCanonicalLogicOperator(operator);
    default:
      return false;
  }
}

export {
  AND,
  OR,
  AND_VERBOSE,
  OR_VERBOSE,
  CanonicalLogicOperators,
  VerboseLogicOperators,
  LogicOperators,
  isLogicOperator,
  CanonicalLogicOperator,
  VerboseLogicOperator,
  LogicOperator,
};
