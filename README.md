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
4. **AuthContext & React Router:** Ensures a smooth, single-page application experience with protected routes.

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

### 3. Frontend Setup
```bash
cd client
npm install
npm run dev
```
The application will be available at `http://localhost:5173`.

## Future Enhancements
- **Leaderboard:** Show the top fundraisers and most impactful referrers.
- **Donation History:** A detailed list of individual donations with timestamps.
- **Social Sharing Integration:** One-click sharing to WhatsApp, Twitter, and LinkedIn.
- **Security:** Implement JWT-based sessions and password-based login for production use.
- **Tests:** Add unit and integration tests for recursive tree traversal logic.
