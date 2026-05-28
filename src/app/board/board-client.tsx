"use client";

import Link from "next/link";
import Image from "next/image";
import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useSweepstakeState } from "@/lib/useSweepstakeState";
import {
  MAX_TEAMS_PER_USER,
  drawTeamForUser,
  getDrawsRemaining,
  getLeaderboard,
  getTeamPoints,
  getTeamStatusClass,
  getUnassignedTeams,
  getUserTeams,
  getUserTotalPoints,
} from "@/lib/sweepstake";

export default function BoardClientPage() {
  const { state, setState, isLoading } = useSweepstakeState();
  const searchParams = useSearchParams();
  const [message, setMessage] = useState<string>("");

  const userId = searchParams.get("userId") ?? "";
  const currentUser = useMemo(() => state.users.find((user) => user.id === userId), [state.users, userId]);
  const currentUserPoints = useMemo(
    () => (currentUser ? getUserTotalPoints(state, currentUser.id) : 0),
    [state, currentUser],
  );

  if (isLoading) {
  return (
    <main className="container">
      <h1>World Cup 2026 Sweepstake</h1>
      <p className="muted">Loading sweepstake...</p>
    </main>
  );
}

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

  const handleDraw = async () => {
  try {
    console.log("Drawing for user", currentUser);
    await setState((prevState) => drawTeamForUser(prevState, currentUser.id));
    setMessage("Team drawn successfully.");
  } catch (error) {
    console.error("Draw failed", error);
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

      <section className="sectionGrid">
  <div className="card">
    <h2>Signed in as {currentUser.name}</h2>
    <p>Draws remaining: {drawsRemaining}</p>
    <p>Total points: {currentUserPoints}</p>
    {drawsRemaining > 0 ? (
      <button type="button" onClick={handleDraw} className="buttonLink">
        Draw random team
      </button>
    ) : (
      <p className="muted">All draws used for this user.</p>
    )}
    {message && <p className="muted">{message}</p>}
  </div>

  <div className="card">
    <h2>Scoring Chart</h2>
    <ul className="scoreChart">
      <li><span>Group Stage Exit</span><strong>0 pts</strong></li>
      <li><span>Round of 32 Exit</span><strong>1 pts</strong></li>
      <li><span>Round of 16 Exit</span><strong>2 pts</strong></li>
      <li><span>Quarter-Final Exit</span><strong>4 pts</strong></li>
      <li><span>4th Place Finish</span><strong>6 pts</strong></li>
      <li><span>3rd Place Finish</span><strong>7 pts</strong></li>
      <li><span>2nd Place Finish</span><strong>8 pts</strong></li>
      <li><span>1st Place Finish</span><strong>10 pts</strong></li>
    </ul>
  </div>
</section>

      <section className="sectionGrid">
        <div className="card">
          <h2>
            Your Teams ({currentUserTeams.length}/{MAX_TEAMS_PER_USER})
          </h2>
          <ul className="teamList">
            {currentUserTeams.map((team) => (
              <li key={team.id} className={`teamItem ${getTeamStatusClass(team)}`}>
  <span className="teamLabel">
    <Image src={team.badgePath} alt={team.name} width={24} height={24} />
    <span>{team.name}</span>
  </span>
  <span>{getTeamPoints(team)} pts</span>
</li>
            ))}
          </ul>
          {currentUserTeams.length === 0 && <p className="muted">No teams drawn yet.</p>}
        </div>

        <div className="card">
          <h2>Remaining Teams ({unassignedTeams.length})</h2>
          <ul className="teamList compact">
            {unassignedTeams.map((team) => (
              <li key={team.id} className={`teamItem ${getTeamStatusClass(team)}`}>
  <span className="teamLabel">
    <Image src={team.badgePath} alt={team.name} width={24} height={24} />
    <span>{team.name}</span>
  </span>
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
  <span>
    {entry.name}
    <br />
    <span className="muted smallText">{entry.teamsRemaining}/8 Teams Remaining</span>
  </span>
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
                  {user.name} ({teams.length}/{MAX_TEAMS_PER_USER})
                </h3>
                <ul className="teamList compact">
                  {teams.map((team) => (
                    <li key={team.id} className={`teamItem ${getTeamStatusClass(team)}`}>
  <span className="teamLabel">
    <Image src={team.badgePath} alt={team.name} width={24} height={24} />
    <span>{team.name}</span>
  </span>
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
