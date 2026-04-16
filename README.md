# SCALIO

SCALIO is a mobile app for recording and tracking technical field visits with farming families in Vila Jutaiteua, Para. The current codebase contains the first working Expo app foundation plus an offline-first MVP flow for agronomists.

## Current Status

The project currently has:

- Product definition in [`SCALIO-historias-de-usuario.md`](c:\Users\heito\ProjetoAmazonHacking\SCALIO-historias-de-usuario.md)
- Structural direction in [`SCALIO-plano-estrutural.md`](c:\Users\heito\ProjetoAmazonHacking\SCALIO-plano-estrutural.md)
- A visual prototype in [`scalio-prototipo.html`](c:\Users\heito\ProjetoAmazonHacking\scalio-prototipo.html)
- A real Expo mobile app in [`mobile`](c:\Users\heito\ProjetoAmazonHacking\mobile)

## What Is Implemented Now

The app already includes these flows:

- PIN-based agronomist login with persistent local session
- Per-user family separation
- Family list with last visit, attention state, and active problem indication
- Add new family flow with offline local save
- Family profile with summary and recent records
- Visit registration flow
- Problem registration as part of a visit
- Visit detail screen
- Full visit history per family
- Dashboard with total families, monthly records, stale visits, and active problems
- Local storage using AsyncStorage
- Basic sync simulation by converting pending records into synced records

## Tech Stack

- Expo
- React Native
- TypeScript
- React Navigation
- AsyncStorage for local persistence
- `expo-network` for connection checks

Main dependencies are defined in [`mobile/package.json`](c:\Users\heito\ProjetoAmazonHacking\mobile\package.json).

## Project Structure

```text
ProjetoAmazonHacking/
|- SCALIO-historias-de-usuario.md
|- SCALIO-plano-estrutural.md
|- scalio-prototipo.html
|- README.md
\- mobile/
   |- App.tsx
   |- app.json
   \- src/
      |- components/
      |- context/
      |- data/
      |- hooks/
      |- screens/
      |- storage/
      |- utils/
      \- types.ts
```

## Important Files

- [`mobile/App.tsx`](c:\Users\heito\ProjetoAmazonHacking\mobile\App.tsx): app entry point and navigation setup
- [`mobile/src/context/AppContext.tsx`](c:\Users\heito\ProjetoAmazonHacking\mobile\src\context\AppContext.tsx): core state management, login, families, visits, dashboard stats, and sync behavior
- [`mobile/src/storage/appStorage.ts`](c:\Users\heito\ProjetoAmazonHacking\mobile\src\storage\appStorage.ts): AsyncStorage persistence layer
- [`mobile/src/data/seed.ts`](c:\Users\heito\ProjetoAmazonHacking\mobile\src\data\seed.ts): initial seeded agronomists, families, and visits
- [`mobile/src/screens/index.ts`](c:\Users\heito\ProjetoAmazonHacking\mobile\src\screens\index.ts): exported app screens
- [`mobile/src/types.ts`](c:\Users\heito\ProjetoAmazonHacking\mobile\src\types.ts): main domain types

## Seed Access For Testing

The current app includes two seeded agronomist accounts:

- `Joana Silva` with PIN `1234`
- `Marcos Pereira` with PIN `5678`

These live in [`mobile/src/data/seed.ts`](c:\Users\heito\ProjetoAmazonHacking\mobile\src\data\seed.ts).

## How To Run

Requirements:

- Node.js installed
- npm installed
- Expo-compatible emulator, simulator, or Expo Go

Run the app:

```bash
cd mobile
npm install
npx expo start
```

Useful commands:

```bash
npm run android
npm run ios
npm run web
```

## Offline Behavior

The current implementation is offline-first for local usage:

- App state is loaded from local storage on startup
- Changes are saved back to AsyncStorage automatically
- Login works from locally seeded data
- Families and visits remain available without internet
- New visits are created with `pending` sync status
- The dashboard includes a manual sync simulation when connectivity is available

## Current Limitations

What is still simplified at this stage:

- Authentication is local PIN-only and seeded
- Recovery is not implemented inside the app
- Sync is simulated locally and not connected to a backend yet
- There is no remote database yet
- There is no automated test suite yet
- Data is stored on-device only for now

## Next Logical Steps

- Connect sync to a real backend
- Replace seeded authentication with a real user source if needed
- Add proper conflict handling for offline/online synchronization
- Add automated tests for the core data flows
- Refine the UI to match the prototype more closely where needed

