# NTUEats

NTUEats is an Expo + React Native application focused on food discovery and sharing.
The app includes stall and recipe browsing, reviews, likes, profiles, and admin management flows.

## Tech Stack

- Expo SDK 54 + Expo Router
- React Native + TypeScript
- Firebase (Firestore + Storage)
- Clerk authentication
- NativeWind (Tailwind-style utility classes)

## Main Features

- Stall discovery and details
- Menu and photo viewing
- Recipe browsing and upload flows
- Reviews and likes
- User profile and favourites
- Admin pages for stall and menu management

## Project Structure

```text
app/
  (auth)/            # Sign-in / sign-up routes
  (home)/            # Main user-facing routes
  (admin)/           # Admin-only routes
  components/        # Shared and feature components
utils/               # Firebase + domain service functions
interfaces/          # Shared TS interfaces/types
assets/              # Fonts, images, sample data
```

## Prerequisites

- Node.js 18+
- npm
- Expo CLI via `npx` (no global install required)

## Environment Variables

Copy `.env.example` to `.env` and fill in your values:

```bash
cp .env.example .env
```

Required variables:

```env
# App
BACKEND_API=
EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY=

# Firebase
FIREBASE_API_KEY=
FIREBASE_AUTH_DOMAIN=
FIREBASE_PROJECT_ID=
FIREBASE_STORAGE_BUCKET=
FIREBASE_MESSAGING_SENDER_ID=
FIREBASE_APP_ID=
FIREBASE_MEASUREMENT_ID=
```

## Installation

```bash
npm install
```

## Run Locally

Start development server:

```bash
npm run start
```

Platform commands:

```bash
npm run android
npm run ios
npm run web (currently unavailable)
```

If Metro behaves unexpectedly, clear cache:

```bash
npx expo start --clear
```

## Lint

```bash
npm run lint
```
