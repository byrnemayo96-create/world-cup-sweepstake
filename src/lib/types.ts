export type TeamStage =
  | "in_tournament"
  | "group_stage_exit"
  | "round_of_32"
  | "round_of_16"
  | "quarter_final"
  | "fourth_place"
  | "third_place"
  | "runner_up"
  | "winner";

export type User = {
  id: string;
  name: string;
};

export type Team = {
  id: string;
  name: string;
  badgePath: string;
  assignedUserId: string | null;
  stage: TeamStage;
};

export type SweepstakeState = {
  users: User[];
  teams: Team[];
};
