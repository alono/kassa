# Viral Fundraising Project

A full-stack web application that simulates a viral charity fundraising mechanism based on referrals.

## Tech Stack
- **Frontend:** React, TypeScript, Tailwind CSS, Vite
- **Backend:** Node.js, Express, TypeScript
- **Database:** SQLite (Local file `database.sqlite` in the server directory)
- **Icons:** Lucide React

## Key Features
- **Username-only Login:** Simplifies entry; automatically creates a new account if the username doesn't exist.
- **Referral System:** Supports one level of referral at signup; immutable once set.
- **Donations:** Users can donate any amount multiple times.
- **Impact Dashboard:** 
  - Tracks personal donations.
  - Visualizes network impact across multiple generations.
  - Generates unique referral links.

## Design Choices
1. **SQLite for Persistence:** Provides a robust, single-file database that requires zero configuration for the end-user.
2. **Recursive Summary Logic:** The backend uses a BFS approach to traverse the referral tree and calculate multi-level statistics efficiently for small-to-medium datasets.
3. **Tailwind CSS v4:** Leverages the latest styling capabilities for a premium, responsive look with minimal bundle size.
4. **Pino Logger:** Replaced Winston with Pino for high-performance, structured JSON logging. Integrated with `pino-http` for concise request visibility and `pino-pretty` for readable development output.
5. **AuthContext & React Router:** Ensures a smooth, single-page application experience with protected routes.

## Getting Started

### 1. Prerequisites
- Node.js (v18 or higher)
- npm

### 2. Backend Setup
```bash
cd server
npm install
npm run dev
```
The server will start on `http://localhost:3001`.

#### Database Seeding
To populate the database with a complex network of 80+ users and 4 referral trees:
```bash
npm run seed
```
> [!NOTE]
> This command will clear existing data before seeding.

### 3. Frontend Setup
```bash
cd client
npm install
npm run dev
```
The application will be available at `http://localhost:5173`.

#### Tailwind CSS Compilation
This project uses **Tailwind CSS v4** integrated with Vite via `@tailwindcss/vite`.
- **Development:** Tailwind styles are automatically compiled as you save files during `npm run dev`.
- **Production:** Run `npm run build` to generate a minified, production-ready CSS bundle.

## Future Enhancements
- **Leaderboard:** Show the top fundraisers and most impactful referrers.
- **Donation History:** A detailed list of individual donations with timestamps.
- **Social Sharing Integration:** One-click sharing to WhatsApp, Twitter, and LinkedIn.
- **Security:** Implement JWT-based sessions and password-based login for production use.
- **Tests:** Add unit and integration tests for recursive tree traversal logic.
