"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useSweepstakeState } from "@/lib/useSweepstakeState";
import {
  drawTeamForUser,
  getDrawsRemaining,
  getLeaderboard,
  getTeamPoints,
  getTeamStatusClass,
  getUnassignedTeams,
  getUserTeams,
  getUserTotalPoints,
} from "@/lib/sweepstake";

export default function BoardPage() {
  const { state, setState } = useSweepstakeState();
  const searchParams = useSearchParams();
  const [message, setMessage] = useState<string>("");

  const userId = searchParams.get("userId") ?? "";
  const currentUser = useMemo(() => state.users.find((user) => user.id === userId), [state.users, userId]);
  const currentUserPoints = useMemo(
    () => (currentUser ? getUserTotalPoints(state, currentUser.id) : 0),
    [state, currentUser],
  );

  if (!currentUser) {
    return (
      <main className="container">
        <h1>World Cup 2026 Sweepstake</h1>
        <p className="muted">Please choose one of the preset users to continue.</p>
        <Link href="/" className="buttonLink">
          Back to sign-in
        </Link>
      </main>
    );
  }

  const currentUserTeams = getUserTeams(state, currentUser.id);
  const unassignedTeams = getUnassignedTeams(state);
  const drawsRemaining = getDrawsRemaining(state, currentUser.id);
  const leaderboard = getLeaderboard(state);

  const handleDraw = () => {
    try {
      setState((prevState) => drawTeamForUser(prevState, currentUser.id));
      setMessage("Team drawn successfully.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unable to draw a team.");
    }
  };

  return (
    <main className="container">
      <div className="titleRow">
        <h1>World Cup 2026 Sweepstake Board</h1>
        <div className="row">
          <Link href="/" className="buttonLink secondary">
            Switch user
          </Link>
          <Link href="/admin" className="buttonLink secondary">
            Admin
          </Link>
        </div>
      </div>

      <section className="card">
        <h2>Signed in as {currentUser.name}</h2>
        <p>Draws remaining: {drawsRemaining}</p>
        <p>Total points: {currentUserPoints}</p>
        <button type="button" onClick={handleDraw} className="buttonLink">
          Draw random team
        </button>
        {message && <p className="muted">{message}</p>}
      </section>

      <section className="sectionGrid">
        <div className="card">
          <h2>Your teams ({currentUserTeams.length}/9)</h2>
          <ul className="teamList">
            {currentUserTeams.map((team) => (
              <li key={team.id} className={`teamItem ${getTeamStatusClass(team)}`}>
                <span>{team.name}</span>
                <span>{getTeamPoints(team)} pts</span>
              </li>
            ))}
          </ul>
          {currentUserTeams.length === 0 && <p className="muted">No teams drawn yet.</p>}
        </div>

        <div className="card">
          <h2>Remaining teams ({unassignedTeams.length})</h2>
          <ul className="teamList compact">
            {unassignedTeams.map((team) => (
              <li key={team.id} className={`teamItem ${getTeamStatusClass(team)}`}>
                {team.name}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="card">
        <h2>Leaderboard</h2>
        <ol className="leaderboard">
          {leaderboard.map((entry) => (
            <li key={entry.id}>
              <span>{entry.name}</span>
              <strong>{entry.points} pts</strong>
            </li>
          ))}
        </ol>
      </section>

      <section className="card">
        <h2>All users and assigned teams</h2>
        <div className="sectionGrid">
          {state.users.map((user) => {
            const teams = getUserTeams(state, user.id);
            return (
              <div key={user.id} className="subCard">
                <h3>
                  {user.name} ({teams.length}/9)
                </h3>
                <ul className="teamList compact">
                  {teams.map((team) => (
                    <li key={team.id} className={`teamItem ${getTeamStatusClass(team)}`}>
                      <span>{team.name}</span>
                      <span>{getTeamPoints(team)} pts</span>
                    </li>
                  ))}
                </ul>
                {teams.length === 0 && <p className="muted">No teams assigned.</p>}
              </div>
            );
          })}
        </div>
      </section>
    </main>
  );
}
