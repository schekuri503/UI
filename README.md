# IPL Predictor

Production-style, mobile-first React + TypeScript + Vite app for a private friends IPL prediction league.

## Included
- Google Sign-In login flow abstraction (`authService`) ready to swap with Firebase Auth SDK.
- Match dashboard and prediction page with lock-time enforcement.
- Vote totals shown without revealing who picked what.
- Leaderboard with top-3 party badges.
- Admin tools: create/edit/delete matches, import schedule JSON, set result winner, leaderboard recompute.
- My Stats page with league/playoff skip tracking.
- Strict typed models + Firestore converter stubs.
- Dark IPL-inspired UI and responsive cards.

## Stack Notes
This environment blocks new package installation. The app is built so it runs now, while all Firebase integration points are clearly isolated in:
- `src/firebase/config.ts`
- `src/firebase/converters.ts`
- `src/services/authService.ts`
- `src/services/dataService.ts`

To switch to live Firebase:
1. Install SDK: `npm i firebase`.
2. Replace mock auth service with `signInWithPopup(GoogleAuthProvider)`.
3. Replace localStorage data calls with Firestore collections (`matches`, `predictions`, `leaderboards`).
4. Keep lock validation in both UI and write methods.

## Run
```bash
npm install
npm run dev
```

## Build
```bash
npm run build
```

## Firebase Hosting Deployment
```bash
npm run build
firebase login
firebase init hosting
firebase deploy --only hosting
```

## Firestore Rules
Sample rules are included in `firestore.rules`.

## JSON Import Format (Admin)
Array of `Match` objects:
```json
[
  {
    "id": "m100",
    "season": 2026,
    "startsAtUtc": "2026-04-03T14:00:00.000Z",
    "lockTimeUtc": "2026-04-03T13:50:00.000Z",
    "venue": "M. Chinnaswamy Stadium",
    "homeTeam": "RCB",
    "awayTeam": "GT",
    "stage": "LEAGUE",
    "resultWinner": null,
    "createdAtUtc": "2026-03-27T00:00:00.000Z",
    "updatedAtUtc": "2026-03-27T00:00:00.000Z"
  }
]
```
