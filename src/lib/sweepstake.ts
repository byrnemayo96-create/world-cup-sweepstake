import { SweepstakeState, Team, TeamStage, User } from "@/lib/types";

export const MAX_TEAMS_PER_USER = 9;
export const TOTAL_ASSIGNED_TEAMS = 45;

export const STAGE_POINTS: Record<TeamStage, number> = {
  in_tournament: 0,
  group_stage_exit: 0,
  round_of_32: 1,
  round_of_16: 2,
  quarter_final: 4,
  fourth_place: 6,
  third_place: 7,
  runner_up: 8,
  winner: 10,
};

export const getTeamPoints = (team: Team): number => STAGE_POINTS[team.stage];

export const getUserTeams = (state: SweepstakeState, userId: string): Team[] =>
  state.teams.filter((team) => team.assignedUserId === userId);

export const getUnassignedTeams = (state: SweepstakeState): Team[] =>
  state.teams.filter((team) => team.assignedUserId === null);

export const getDrawsRemaining = (state: SweepstakeState, userId: string): number =>
  Math.max(MAX_TEAMS_PER_USER - getUserTeams(state, userId).length, 0);

export const getUserTotalPoints = (state: SweepstakeState, userId: string): number =>
  getUserTeams(state, userId).reduce((total, team) => total + getTeamPoints(team), 0);

export const getLeaderboard = (state: SweepstakeState): Array<User & { points: number }> =>
  state.users
    .map((user) => ({ ...user, points: getUserTotalPoints(state, user.id) }))
    .sort((a, b) => b.points - a.points || a.name.localeCompare(b.name));

export const drawTeamForUser = (
  state: SweepstakeState,
  userId: string,
  rng: () => number = Math.random,
): SweepstakeState => {
  const assignedCount = state.teams.filter((team) => team.assignedUserId !== null).length;
  if (assignedCount >= TOTAL_ASSIGNED_TEAMS) {
    throw new Error("All available draw slots are already assigned.");
  }

  if (getDrawsRemaining(state, userId) <= 0) {
    throw new Error("This user has already drawn the maximum of 9 teams.");
  }

  const unassignedTeams = getUnassignedTeams(state);
  if (unassignedTeams.length <= state.teams.length - TOTAL_ASSIGNED_TEAMS) {
    throw new Error("Only the final 3 unassigned teams remain.");
  }

  const randomIndex = Math.floor(rng() * unassignedTeams.length);
  const selectedTeam = unassignedTeams[randomIndex];

  return {
    ...state,
    teams: state.teams.map((team) =>
      team.id === selectedTeam.id ? { ...team, assignedUserId: userId } : team,
    ),
  };
};

export const updateTeamStage = (
  state: SweepstakeState,
  teamId: string,
  stage: TeamStage,
): SweepstakeState => ({
  ...state,
  teams: state.teams.map((team) => (team.id === teamId ? { ...team, stage } : team)),
});

export const getTeamStatusClass = (team: Team): "statusBlue" | "statusRed" | "statusGreen" => {
  if (team.stage === "winner") {
    return "statusGreen";
  }

  if (team.stage === "in_tournament") {
    return "statusBlue";
  }

  return "statusRed";
};
