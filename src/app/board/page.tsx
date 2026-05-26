import { Suspense } from "react";
import BoardClientPage from "./board-client";

export default function BoardPage() {
  return (
    <Suspense fallback={<main className="container">Loading sweepstake board...</main>}>
      <BoardClientPage />
    </Suspense>
  );
}
