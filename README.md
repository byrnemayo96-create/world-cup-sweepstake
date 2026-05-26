# World Cup 2026 Sweepstake MVP

A lightweight Next.js + TypeScript scaffold for running a 2026 World Cup sweepstake.

## MVP features included

- 6 preset users (name-select sign-in, no full auth)
- 48 seeded teams with placeholder badge paths
- Draw logic (1 team per click, max 8 teams per user)
- Global draw cap of 48 assigned teams (0 left unassigned)
- No duplicate assignments
- Scoring by tournament stage:
  - Group stage exit: 0
  - Round of 32: 1
  - Round of 16: 2
  - Quarter-final: 4
  - 4th place: 6
  - 3rd place: 7
  - Runner-up: 8
  - Winner: 10
- Board view with:
  - signed-in user
  - draw button
  - draws remaining
  - current user teams
  - all users and assigned teams
  - unassigned teams
  - leaderboard totals
- Admin page for updating each team stage/result
- Status colors:
  - Blue: not eliminated
  - Red: eliminated
  - Green: winner

## Run locally

```bash
npm install
npm run dev
```

Then open `http://localhost:3000`.

## Project structure

- `/src/app/page.tsx` – sign-in page (select one of 6 users)
- `/src/app/board/page.tsx` – main sweepstake board
- `/src/app/admin/page.tsx` – admin stage/result updater
- `/src/lib/data.ts` – preset users, 48 teams, stage options
- `/src/lib/sweepstake.ts` – draw rules, scoring, leaderboard logic
- `/src/lib/useSweepstakeState.tsx` – local persisted state (easy to swap for DB/API later)

## Replacing placeholder team data and badges

1. Update team names/badge paths in `/src/lib/data.ts` (`PRESET_TEAMS`).
2. Add badge files under `/public/assets/teams/`.
3. Keep each team `id` stable once data is in use.

## Quality checks

```bash
npm run lint
npm run build
```

There is currently no test framework configured in this MVP scaffold.
