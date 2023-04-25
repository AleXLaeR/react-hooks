import { useReducer, useCallback } from 'react';

interface StateHistory<T> {
  past: NonNullable<T>[];
  future: NonNullable<T>[];
  current: T | null;
}

enum ActionType {
  UNDO = 'UNDO',
  REDO = 'REDO',
  SET = 'SET',
}

type Action<T> = {
  type: 'UNDO' | 'REDO' | 'SET';
  payload?: T | null;
};
type ActionCallback = () => void;

function stateHistoryReducer<T>(
  state: StateHistory<T>,
  { type, payload }: Action<T>,
  historyLength: number,
): StateHistory<T> {
  const { past, current, future } = state;

  switch (type) {
    case ActionType.UNDO:
      if (past.length === 0) return state;

      const previous = past[past.length - 1];
      const newPast = past.slice(0, past.length - 1);

      return {
        past: newPast,
        current: previous,
        future: current ? [current, ...future] : future,
      };
    case ActionType.REDO:
      if (future.length === 0) return state;

      const next = future[0];
      const newFuture = future.slice(1);

      return {
        past: current ? [...past, current].slice(-historyLength) : past,
        current: next,
        future: newFuture,
      };
    case ActionType.SET:
      if (current === payload) return state;

      return {
        past: current ? [...past, current].slice(-historyLength) : past,
        current: payload ?? null,
        future: [],
      };
    default:
      throw new Error(`Invalid action type: ${type}`);
  }
}

interface UseStateHistoryReturnType<T> extends StateHistory<T> {
  set: (newState: T | null) => void;
  undo: ActionCallback;
  redo: ActionCallback;
  clear: ActionCallback;
  canUndo: boolean;
  canRedo: boolean;
}

function useStateHistory<T>(historyLength: number = Infinity): UseStateHistoryReturnType<T> {
  const initialState: StateHistory<T> = { past: [], current: null, future: [] };
  const [{ past, current, future }, dispatch] = useReducer(
    (
      state: StateHistory<T>,
      action: Action<T>,
    ) => stateHistoryReducer(state, action, historyLength),
    initialState,
  );

  const canUndo = past.length > 0;
  const canRedo = future.length > 0;

  const undo = useCallback(() => dispatch({ type: ActionType.UNDO }), []);
  const redo = useCallback(() =>  dispatch({ type: ActionType.REDO }), []);

  const set = useCallback((payload: T | null) => dispatch({ type: ActionType.SET, payload }), []);
  const clear = useCallback(() => dispatch({ type: ActionType.SET, payload: null }), []);

  return {
    current,
    set,
    undo,
    redo,
    past,
    future,
    canUndo,
    canRedo,
    clear,
  };
}
