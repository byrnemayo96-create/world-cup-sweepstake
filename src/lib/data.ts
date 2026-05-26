import { SweepstakeState, TeamStage, User } from "@/lib/types";

export const PRESET_USERS: User[] = [
  { id: "user-1", name: "Alex" },
  { id: "user-2", name: "Blake" },
  { id: "user-3", name: "Casey" },
  { id: "user-4", name: "Drew" },
  { id: "user-5", name: "Ellis" },
];

export const TEAM_STAGES: { value: TeamStage; label: string }[] = [
  { value: "in_tournament", label: "Not eliminated" },
  { value: "group_stage_exit", label: "Group stage exit" },
  { value: "round_of_32", label: "Round of 32" },
  { value: "round_of_16", label: "Round of 16" },
  { value: "quarter_final", label: "Quarter-final" },
  { value: "fourth_place", label: "4th place" },
  { value: "third_place", label: "3rd place" },
  { value: "runner_up", label: "Runner-up" },
  { value: "winner", label: "Winner" },
];

export const PRESET_TEAMS = Array.from({ length: 48 }, (_, index) => {
  const number = String(index + 1).padStart(2, "0");

  return {
    id: `team-${number}`,
    name: `Team ${number}`,
    badgePath: `/assets/teams/team-${number}.png`,
    assignedUserId: null,
    stage: "in_tournament" as TeamStage,
  };
});

export const createInitialState = (): SweepstakeState => ({
  users: PRESET_USERS.map((user) => ({ ...user })),
  teams: PRESET_TEAMS.map((team) => ({ ...team })),
});
