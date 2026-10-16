# Campus Marketplace

## Project Description
**Campus Marketplace** is a cross-platform mobile and web application built with Expo React Native and TypeScript. This project is developed as a group assignment extending the original [`webtegy/campus-marketplace`](https://github.com/webtegy/campus-marketplace) project.

### Problem Addressed
College and university students frequently buy and sell textbooks, electronics, dorm gear, and other study supplies every semester. Using general online marketplaces often involves friction, lack of campus relevance, and safety concerns. Campus Marketplace addresses this problem by giving students a simple, secure, and community-centered platform to buy and sell items directly within their campus community.

---

## Group Members
- **Isfak**: M.I. Mohamed Isfak (2023/CSC/044)
- **Jarith**: M.S.A.M. Jarith (2023/CSC/050)
- **Rikas**: MNM. Rikas (2023/CSC/046)
- **Faisan**: PMF. Mohamed (2023/CSC/085)
- **Milfar**: R.M. Milfar (2023/CSC/063)

---

## Features Implemented by Our Group
1. **Price Filter and Sort on Explore Page**: Allows users to filter listings by price range (Under $50, $50 - $100, $100+) and sort items by price (Low to High, High to Low).
2. **Mark as Sold for Sellers**: Adds an optional `status` field (`active` | `sold`) to listings, allowing sellers to mark their own listings as sold from the listing details modal.
3. **Sell Form Validation with Category and Condition Pickers**: Form validation and dedicated selectors for category and condition when creating a new listing.
4. **My Listings Dashboard**: Seller dashboard showing listing metrics (total, active, and sold counts), with the ability to edit listings and delete them with in-app confirmation.
5. **SOLD Badge on Listing Cards**: The SOLD badge currently appears on the listing cards in the My Listings page, and Explore page support is being added.

---

## Existing Features
- **Search**: Keyword search across listing titles.
- **Category Filter**: Browse items by category.
- **Save Listings**: Save and unsave listings (kept for the current session).
- **Google Sign-In**: User authentication with Google via Firebase Auth.

---

## Technologies Used
- **Expo React Native**: Cross-platform frontend framework
- **TypeScript**: Type-safe development
- **Firebase Auth**: User authentication (Google Sign-In)
- **Cloud Firestore**: Real-time cloud database and security rules

---

## How to Run

### Prerequisites
- **Node.js**: version `22.13` or newer
- **npm**

### Step-by-Step Setup
1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Configure environment variables**:
   Create a `.env` file in the root directory (based on `.env.example`) and configure the six Firebase variables matching `src/firebase.ts`:
   ```env
   EXPO_PUBLIC_FIREBASE_API_KEY=
   EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=
   EXPO_PUBLIC_FIREBASE_PROJECT_ID=
   EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=
   EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
   EXPO_PUBLIC_FIREBASE_APP_ID=
   ```

   > **Note**: If the `.env` file is left empty, the app runs in demo mode with sample listings, and Firebase features (sign in, publishing, edit, delete, Mark as Sold) need the Firebase values.

3. **Firebase Setup**:
   - Create a Firebase project in the [Firebase Console](https://console.firebase.google.com/) and register a Web app to get your config keys.
   - **Enable Google Sign-in**: Go to **Authentication** > **Sign-in method** and enable Google.
   - **Create Firestore**: Set up Cloud Firestore database.
   - **Publish Firestore Rules**: Publish the security rules defined in `firestore.rules` via the Firebase CLI (`firebase deploy --only firestore:rules`) or paste them into the Firestore Rules tab in the console.

4. **Run the app**:
   ```bash
   npm run web
   ```

---

## Member Contributions

| Group Member | Contribution Description |
| :--- | :--- |
| **Isfak** | Created the Firebase project, implemented Mark as Sold (status field, seller-only button, Firestore update), wrote the README, managed the GitHub repository and merged pull requests. |
| **Jarith** | Implemented price filter and price sorting on the Explore page. |
| **Rikas** | Implemented Sell form validation with category and condition pickers. |
| **Faisan** | Implemented the My Listings dashboard (total, active and sold counts, edit listing, delete with in-app confirmation). |
| **Milfar** | Implemented the SOLD badge on listing cards and details, category-specific images for new listings, and the README member details. |
