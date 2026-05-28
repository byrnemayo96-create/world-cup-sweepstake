import { PRESET_USERS } from "@/lib/data";
import Link from "next/link";

export default function Home() {
  return (
    <main className="container">
      <h1>Football World Cup 2026 Sweepstake</h1>
      <p className="muted">Select your name to sign in and start drawing teams.</p>

      <section className="cardGrid">
        {PRESET_USERS.map((user) => (
          <Link key={user.id} href={`/board?userId=${user.id}`} className="buttonLink">
            Sign in as {user.name}
          </Link>
        ))}
      </section>
    </main>
  );
}