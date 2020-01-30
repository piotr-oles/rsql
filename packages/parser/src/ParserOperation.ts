const OperationType = {
  SHIFT: 0,
  PUSH: 1,
  REDUCE: 2,
  POP: 3,
  GOTO: 4,
  ACCEPT: 5,
} as const;

interface ShiftOperation {
  type: typeof OperationType.SHIFT;
  state: number;
}
interface PushOperation {
  type: typeof OperationType.PUSH;
  state: number;
}
interface ReduceOperation {
  type: typeof OperationType.REDUCE;
  production: number;
}
interface PopOperation {
  type: typeof OperationType.POP;
  production: number;
}
interface GoToOperation {
  type: typeof OperationType.GOTO;
  state: number;
}
interface AcceptOperation {
  type: typeof OperationType.ACCEPT;
}
type NoOperation = undefined;

type TokenOperation = ShiftOperation | ReduceOperation | PushOperation | PopOperation | AcceptOperation | NoOperation;
type NodeOperation = GoToOperation | NoOperation;

function shift(state: number): ShiftOperation {
  return {
    type: OperationType.SHIFT,
    state,
  };
}
function reduce(production: number): ReduceOperation {
  return {
    type: OperationType.REDUCE,
    production,
  };
}
function push(state: number): PushOperation {
  return {
    type: OperationType.PUSH,
    state,
  };
}
function pop(production: number): PopOperation {
  return {
    type: OperationType.POP,
    production,
  };
}
function goto(state: number): GoToOperation {
  return {
    type: OperationType.GOTO,
    state,
  };
}
function accept(): AcceptOperation {
  return {
    type: OperationType.ACCEPT,
  };
}
const noop: NoOperation = undefined;

export {
  OperationType,
  ShiftOperation,
  ReduceOperation,
  PushOperation,
  PopOperation,
  AcceptOperation,
  GoToOperation,
  NoOperation,
  TokenOperation,
  NodeOperation,
  shift,
  reduce,
  push,
  pop,
  accept,
  goto,
  noop,
};
