"use client";

import { createInitialState } from "@/lib/data";
import { SweepstakeState } from "@/lib/types";
import { useCallback, useState } from "react";

let inMemoryState: SweepstakeState = createInitialState();

export const useSweepstakeState = () => {
  const [state, setLocalState] = useState<SweepstakeState>(() => inMemoryState);

  const setState: typeof setLocalState = useCallback((value) => {
    setLocalState((previous) => {
      const nextState = typeof value === "function" ? value(previous) : value;
      inMemoryState = nextState;
      return nextState;
    });
  }, []);

  const reset = useCallback(() => {
    inMemoryState = createInitialState();
    setLocalState(inMemoryState);
  }, []);

  return { state, setState, reset };
};
