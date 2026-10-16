# Campus Marketplace - Group 16

A student marketplace group project based on the
[Campus Marketplace starter by webtegy](https://github.com/webtegy/campus-marketplace).
Group 16 builds on the inherited starter; existing implementation is not claimed
as new group work. Retain the existing [license](LICENSE) and attribution.

## Group members

| Member | Name |
|---|---|
| 1 | 2023CSC097-SENARATH  U.S.O.V |
| 2 | 2023CSC096-BANDARA R.B.M.H |
| 3 | 2023CSC098-Y.N.M.AJMAL |
| 4 | 2023CSC099-R.N.M.AQEEL |
| 5 | 2023CSC093-A.J.M.SHAMIL |

## Technologies

- Expo and React Native, with React Native Web for the browser.
- React and TypeScript.
- Firebase Authentication and Cloud Firestore.
- ESLint with Expo's flat configuration.

## Starter functionality and limitations

The inherited starter provides demo listings, title search, category filtering,
listing details, saved-item toggles, profile screens, and a basic sell form.
Saved items live only in memory and reset when the app reloads.

With all six Firebase values configured, the existing code initializes Firebase,
listens for Firestore listings, writes user profiles, and publishes listings for
signed-in users. Web sign-in uses Google popup with a redirect fallback; the
native path currently uses anonymous authentication, not native Google sign-in.
These backend flows require a configured Firebase project and separate testing.
Without configuration, browsing uses seed data and sign-in cannot complete.
The listing listener also falls back to seed data on an empty result or error,
so visible demo listings do not prove a working backend connection.

Publishing currently accepts a title and price, with a fixed Textbooks category,
seed image, and default listing details. Editing, deletion, sold status, image
uploads, and comprehensive validation are planned. My Listings displays the
signed-in user's items. Messaging is an empty-state placeholder; contacting a
seller does not create a conversation or send a message. Persistent saved items,
authentication refinements, service improvements, and browsing improvements are
also planned, not completed by this setup contribution.

## Local setup

Use a current Node.js LTS release and npm. This setup was checked with Node.js
24.16.0. Git and Node.js must be on your terminal's PATH.

```powershell
git clone https://github.com/MhdAqeel/campus-marketplace-group-16-.git
cd campus-marketplace-group-16-
git switch group16-setup
npm.cmd ci
Copy-Item .env.example .env
npm.cmd run web
```

Skip the copy command if you already have a local `.env`. Blank values keep the
starter in demo mode. Expo prints the local web URL; open it in your browser.
Use `npm.cmd start` for the Expo development server. The existing Android/iOS
scripts require the corresponding native development tools; iOS builds require
macOS. On shells other than PowerShell, use `npm` instead of `npm.cmd` and your
shell's file-copy command. Stop the server with Ctrl+C.

## Firebase configuration

Copy your Firebase project's **Web app configuration** into the matching keys in
`.env`; all six must be non-empty for `src/firebase.ts` to initialize Firebase:

| Environment variable | Firebase Web configuration field |
|---|---|
| `EXPO_PUBLIC_FIREBASE_API_KEY` | `apiKey` |
| `EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN` | `authDomain` |
| `EXPO_PUBLIC_FIREBASE_PROJECT_ID` | `projectId` |
| `EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET` | `storageBucket` |
| `EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | `messagingSenderId` |
| `EXPO_PUBLIC_FIREBASE_APP_ID` | `appId` |

Enable Google sign-in in Firebase Authentication and authorize the development
host for web testing. The existing native fallback requires the Anonymous
provider. Create a Cloud Firestore database and have the responsible teammate
review and deploy the repository's `firestore.rules` and
`firestore.indexes.json` to the intended project before backend testing.
`firebase.json` references these files; running Expo does not deploy them.

Restart Expo after changing `.env`. `EXPO_PUBLIC_*` values are bundled into the
client and must never contain service-account credentials or private keys.
Keep local environment files and Firebase administrative credentials out of Git;
`.env.example` intentionally contains only blank placeholders. The ignore rules
cover common credential filenames; never add administrative credentials under
other filenames either.

## Development checks

```powershell
npm.cmd run typecheck
npm.cmd run lint
```

TypeScript runs without emitting files; lint uses `expo lint` and
`eslint.config.js`. To update the lint dependencies with Expo's compatible
installer, run:

```powershell
npx.cmd expo install eslint eslint-config-expo --dev
```

Commit `package.json` and `package-lock.json` together when dependencies change.
A successful static check does not verify Firebase, native builds, or complete
user flows. For a basic demo smoke check, launch web with blank Firebase values,
confirm listings appear, search/filter, open a listing, toggle a saved item, and
inspect the Messages placeholder. Reloading clears saved items.

## Collaboration workflow

Read the [team plan](docs/TEAM_PLAN.md) for the five integration areas and review
expectations. Keep this branch limited to setup, development checks, and
documentation. Other features belong in separately reviewed contributions.

Before editing, inspect `git status` and preserve other work. Create a focused
branch from the team's agreed integration branch, implement only the agreed
scope, run the checks and affected user flow, and describe results and known
limitations in the pull request. Request another member's review before merging.
Preserve existing authorship and record each person's actual work; integration
area assignments do not establish authorship of inherited code.
