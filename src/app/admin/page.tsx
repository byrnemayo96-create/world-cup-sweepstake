"use client";

import Link from "next/link";
import { TEAM_STAGES } from "@/lib/data";
import { getTeamPoints, getTeamStatusClass, updateTeamStage } from "@/lib/sweepstake";
import { TeamStage } from "@/lib/types";
import { useSweepstakeState } from "@/lib/useSweepstakeState";

export default function AdminPage() {
  const { state, setState, reset } = useSweepstakeState();


  return (
    <main className="container">
      <div className="titleRow">
        <h1>Admin: Team results</h1>
        <div className="row">
          <Link href="/" className="buttonLink secondary">
            Sign-in page
          </Link>
          <button type="button" onClick={reset} className="buttonLink secondary">
            Reset data
          </button>
        </div>
      </div>

      <p className="muted">
        Blue = still active, red = eliminated, green = winner. Update a team stage to refresh points instantly.
      </p>

      <section className="card">
        <div className="adminTableHeader">
          <span>Team</span>
          <span>Assigned user</span>
          <span>Stage</span>
          <span>Points</span>
        </div>

        {state.teams.map((team) => {
          const owner = state.users.find((user) => user.id === team.assignedUserId)?.name ?? "Unassigned";

          return (
            <div key={team.id} className={`adminRow ${getTeamStatusClass(team)}`}>
              <span>{team.name}</span>
              <span>{owner}</span>
              <select
                value={team.stage}
                onChange={(event) =>
                  setState((prevState) =>
                    updateTeamStage(prevState, team.id, event.target.value as TeamStage),
                  )
                }
              >
                {TEAM_STAGES.map((stage) => (
                  <option key={stage.value} value={stage.value}>
                    {stage.label}
                  </option>
                ))}
              </select>
              <strong>{getTeamPoints(team)}</strong>
            </div>
          );
        })}
      </section>
    </main>
  );
}
