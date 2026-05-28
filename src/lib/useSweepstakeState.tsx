"use client";

import { createInitialState } from "@/lib/data";
import { SweepstakeState } from "@/lib/types";
import { createContext, useContext, useEffect, useMemo, useState, type Dispatch, type ReactNode, type SetStateAction } from "react";

type SweepstakeContextValue = {
  state: SweepstakeState;
  setState: Dispatch<SetStateAction<SweepstakeState>>;
  reset: () => void;
};

const SweepstakeContext = createContext<SweepstakeContextValue | null>(null);
const STORAGE_KEY = "world-cup-sweepstake-state";

export function SweepstakeProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<SweepstakeState>(createInitialState);
  const [hasLoaded, setHasLoaded] = useState(false);

  useEffect(() => {
    try {
      const savedState = window.localStorage.getItem(STORAGE_KEY);

      if (savedState) {
        setState(JSON.parse(savedState) as SweepstakeState);
      }
    } catch (error) {
      console.error("Failed to load saved sweepstake state", error);
    } finally {
      setHasLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (!hasLoaded) return;

    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (error) {
      console.error("Failed to save sweepstake state", error);
    }
  }, [state, hasLoaded]);

  const reset = () => {
    const nextState = createInitialState();
    setState(nextState);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(nextState));
  };

  const value = useMemo(
    () => ({
      state,
      setState,
      reset,
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
