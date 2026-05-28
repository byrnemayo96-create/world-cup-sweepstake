"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { TEAM_STAGES } from "@/lib/data";
import { getTeamPoints, getTeamStatusClass, updateTeamStage } from "@/lib/sweepstake";
import { TeamStage } from "@/lib/types";
import { useSweepstakeState } from "@/lib/useSweepstakeState";

const ADMIN_PASSWORD = "wc2026";
const ADMIN_SESSION_KEY = "world-cup-admin-unlocked";

export default function AdminPage() {
  const { state, setState, reset } = useSweepstakeState();
  const [password, setPassword] = useState("");
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const unlocked = window.sessionStorage.getItem(ADMIN_SESSION_KEY);
    if (unlocked === "true") {
      setIsUnlocked(true);
    }
  }, []);

  const handleUnlock = () => {
    if (password === ADMIN_PASSWORD) {
      window.sessionStorage.setItem(ADMIN_SESSION_KEY, "true");
      setIsUnlocked(true);
      setError("");
      return;
    }

    setError("Incorrect password.");
  };

  const handleLock = () => {
    window.sessionStorage.removeItem(ADMIN_SESSION_KEY);
    setIsUnlocked(false);
    setPassword("");
  };

  if (!isUnlocked) {
    return (
      <main className="container">
        <div className="titleRow">
          <h1>Admin access</h1>
          <Link href="/" className="buttonLink secondary">
            Back to site
          </Link>
        </div>

        <section className="card" style={{ maxWidth: 420 }}>
          <h2>Enter admin password</h2>
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Password"
            className="textInput"
          />
          <button type="button" onClick={handleUnlock} className="buttonLink">
            Unlock admin
          </button>
          {error && <p className="muted">{error}</p>}
        </section>
      </main>
    );
  }

  return (
    <main className="container">
      <div className="titleRow">
        <h1>Admin: Team results</h1>
        <div className="row">
          <Link href="/" className="buttonLink secondary">
            Sign-in page
          </Link>
          <button type="button" onClick={handleLock} className="buttonLink secondary">
            Lock admin
          </button>
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
              <span className="teamLabel">
                <Image src={team.badgePath} alt={team.name} width={24} height={24} />
                <span>{team.name}</span>
              </span>
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