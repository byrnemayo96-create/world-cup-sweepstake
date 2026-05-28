"use client";

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { createInitialState } from "@/lib/data";
import { supabase } from "@/lib/supabase";
import type { SweepstakeState, TeamStage } from "@/lib/types";

type SweepstakeContextValue = {
  state: SweepstakeState;
  setState: (updater: (prevState: SweepstakeState) => SweepstakeState) => Promise<void>;
  reset: () => Promise<void>;
  refresh: () => Promise<void>;
  isLoading: boolean;
};

const SweepstakeContext = createContext<SweepstakeContextValue | null>(null);

type SupabaseUser = {
  id: string;
  name: string;
};

type SupabaseTeam = {
  id: string;
  name: string;
  badge_path: string;
  assigned_user_id: string | null;
  stage: string;
};

const fallbackState = createInitialState();

const isValidStage = (value: string): value is TeamStage =>
  [
    "in_tournament",
    "group_stage_exit",
    "round_of_32",
    "round_of_16",
    "quarter_final",
    "fourth_place",
    "third_place",
    "runner_up",
    "winner",
  ].includes(value as TeamStage);

const mapDbStateToAppState = (
  users: SupabaseUser[],
  teams: SupabaseTeam[],
): SweepstakeState => ({
  users:
    users.length > 0
      ? users.map((user) => ({
          id: user.id,
          name: user.name,
        }))
      : fallbackState.users,
  teams:
    teams.length > 0
      ? teams.map((team) => ({
          id: team.id,
          name: team.name,
          badgePath: team.badge_path,
          assignedUserId:
            team.assigned_user_id && team.assigned_user_id.trim().length > 0
              ? team.assigned_user_id
              : null,
          stage:
            team.stage && isValidStage(team.stage)
              ? team.stage
              : "in_tournament",
        }))
      : fallbackState.teams,
});

const loadState = async (): Promise<SweepstakeState> => {
  const [{ data: users, error: usersError }, { data: teams, error: teamsError }] = await Promise.all([
    supabase.from("users").select("id, name").order("id"),
    supabase
      .from("teams")
      .select("id, name, badge_path, assigned_user_id, stage")
      .order("name"),
  ]);

  if (usersError) {
    throw usersError;
  }

  if (teamsError) {
    throw teamsError;
  }

  return mapDbStateToAppState(users ?? [], teams ?? []);
};

const persistTeams = async (teams: SweepstakeState["teams"]) => {
  for (const team of teams) {
    const assignedUserId =
      typeof team.assignedUserId === "string" && team.assignedUserId.trim() !== ""
        ? team.assignedUserId
        : null;

    const stage =
      typeof team.stage === "string" && team.stage.trim() !== ""
        ? team.stage
        : "in_tournament";

    console.log("Persisting team", {
      id: team.id,
      assignedUserId,
      stage,
    });

    const { error } = await supabase
      .from("teams")
      .update({
        assigned_user_id: assignedUserId,
        stage,
      })
      .eq("id", team.id);

    if (error) {
      console.error("Failed updating team", team.id, error);
      throw error;
    }
  }
};

export function SweepstakeProvider({ children }: { children: ReactNode }) {
  const [state, setLocalState] = useState<SweepstakeState>(fallbackState);
  const [isLoading, setIsLoading] = useState(true);

  const refresh = async () => {
    setIsLoading(true);

    try {
      const nextState = await loadState();
      setLocalState(nextState);
    } catch (error) {
      console.error("Failed to load Supabase sweepstake state", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void refresh();
  }, []);

  const setState = async (updater: (prevState: SweepstakeState) => SweepstakeState) => {
  setIsLoading(true);

  try {
    const latestState = await loadState();
    const nextState = updater(latestState);

    await persistTeams(nextState.teams);
    setLocalState(nextState);
  } catch (error) {
    console.error("Failed to persist sweepstake state", error);
    throw error;
  } finally {
    await refresh();
  }
};

  const reset = async () => {
    const resetState = createInitialState();

    try {
      await persistTeams(resetState.teams);
      setLocalState(resetState);
      await refresh();
    } catch (error) {
      console.error("Failed to reset sweepstake state", error);
      throw error;
    }
  };

  const value = useMemo(
    () => ({
      state,
      setState,
      reset,
      refresh,
      isLoading,
    }),
    [state, isLoading],
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