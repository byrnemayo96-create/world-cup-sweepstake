"use client";

import { createInitialState } from "@/lib/data";
import { SweepstakeState } from "@/lib/types";
import { createContext, useContext, useMemo, useState, type Dispatch, type ReactNode, type SetStateAction } from "react";

type SweepstakeContextValue = {
  state: SweepstakeState;
  setState: Dispatch<SetStateAction<SweepstakeState>>;
  reset: () => void;
};

const SweepstakeContext = createContext<SweepstakeContextValue | null>(null);

export function SweepstakeProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<SweepstakeState>(createInitialState);

  const value = useMemo(
    () => ({
      state,
      setState,
      reset: () => setState(createInitialState()),
    }),
    [state],
  );

  return <SweepstakeContext.Provider value={value}>{children}</SweepstakeContext.Provider>;
}

export const useSweepstakeState = () => {
  const context = useContext(SweepstakeContext);

  if (!context) {
    throw new Error("useSweepstakeState must be used within SweepstakeProvider");
  }

  return context;
};
