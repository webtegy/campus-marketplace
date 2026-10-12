# Campus Marketplace

A campus-focused marketplace built with **Expo React Native, TypeScript, and Firebase/Firestore**. Students can discover items, search and filter listings, save items, publish listings, contact sellers, and manage their own listings.

## Assignment Improvements

This version focuses on four meaningful improvements:

1. **Price filtering** – users can filter active listings by maximum price ($50, $100, $250, or $500).
2. **Mark as Sold** – sellers can mark their own active listings as sold. Sold listings are removed from the Explore results and show a SOLD state in the seller area.
3. **Improved listing creation** – the Sell form now includes title/price validation, category selection, condition selection, and clearer error feedback.
4. **Seller dashboard statistics** – the Profile page shows total, active, and sold listing counts.

Existing functionality such as search, category filtering, saved listings, listing details, Google authentication, Firebase persistence, and messaging navigation is retained.

## Technologies

- Expo SDK 57
- React Native
- TypeScript
- Firebase Authentication
- Cloud Firestore
- React Native Web

## How to Run

The project requires Node.js 22.13+.

```bash
npm install
npm run web
```

For Firebase authentication and Firestore functionality, copy `.env.example` to `.env` and add the Firebase Web App configuration values expected by `src/firebase.ts`. In Firebase Console, enable **Authentication → Sign-in method → Email/Password** and optionally **Google**. Then create at least one account from the app's Sign In / Sign Up screen. The application now opens with an authentication gate before the marketplace is shown.

## Main Project Structure

```text
src/
├── components/
│   ├── EmptyState.tsx
│   ├── ListingCard.tsx
│   └── PageTitle.tsx
├── pages/
│   ├── ExplorePage.tsx
│   ├── MessagesPage.tsx
│   ├── MyListingsPage.tsx
│   ├── ProfilePage.tsx
│   └── SavedPage.tsx
├── App.tsx
├── data.ts
├── firebase.ts
└── types.ts
```

## Group Contributions (5 Members)

Replace the names below with your actual group members before submission.

| Member | Branch | Files / Modules | Contribution |
|---|---|---|---|
| Member 1 (Team Lead) | `feature/firebase-auth-navigation` | `src/firebase.ts`, `src/types.ts`, `src/App.tsx`, `firestore.rules`, `README.md` | Project setup, Firebase Auth & Firestore integration, Sign In/Sign Up, custom bottom navigation icons, and final integration |
| Member 2 | `feature/explore-search-filters` | `src/pages/ExplorePage.tsx`, `src/components/ListingCard.tsx`, `src/data.ts` | Explore page, search functionality, category filtering, and maximum price filtering ($50–$500) |
| Member 3 | `feature/listing-creation-saved` | `src/pages/SavedPage.tsx`, `src/components/EmptyState.tsx`, `src/App.tsx` (`SellModal`, `ListingModal`) | Listing creation (`SellModal`) with validation & description, saved/favorite listings (`SavedPage`), and listing reporting (`ReportModal`) |
| Member 4 | `feature/seller-listings-dashboard` | `src/pages/MyListingsPage.tsx`, `src/pages/DashboardPage.tsx`, `src/pages/ProfilePage.tsx` | Seller profile (`ProfilePage`), My Listings management (`MyListingsPage`), "Mark as Sold" workflow, and seller activity dashboard (`DashboardPage`) |
| Member 5 | `feature/buyer-seller-messaging` | `src/pages/MessagesPage.tsx`, `src/components/PageTitle.tsx`, `src/App.tsx` (`contactSeller`, `sendMessage`) | Direct two-way buyer & seller messaging (`MessagesPage`), conversation threads, and real-time message persistence |

## Suggested GitHub Workflow

Each member creates their feature branch, commits their assigned files, and pushes to GitHub:

```text
feature/firebase-auth-navigation
feature/explore-search-filters
feature/listing-creation-saved
feature/seller-listings-dashboard
feature/buyer-seller-messaging
```

Example commit messages:

```text
feat(auth): configure firebase auth, firestore sync, and custom nav icons
feat(explore): add search, category filtering, and maximum price filter
feat(listings): improve listing creation validation, favorites, and reporting
feat(seller): add mark as sold flow, seller profile, and dashboard page
feat(messages): implement direct two-way buyer and seller messaging
```

## Demo Flow

A 5–8 minute demonstration can follow this order:

1. Introduce the group and Campus Marketplace problem.
2. Browse the Explore page.
3. Search for a listing and filter by category/price.
4. Open listing details and save an item.
5. Sign in and create a listing using the improved Sell form.
6. Open My Listings and mark an item as sold.
7. Show the Profile dashboard statistics.
9. Briefly explain the technologies, team contributions, and GitHub commits.

## Firebase Notes

The client Firebase configuration is intentionally public. Security should be enforced through Firebase Authentication, Firestore Rules, and App Check. Never place Admin SDK credentials in the client application.
