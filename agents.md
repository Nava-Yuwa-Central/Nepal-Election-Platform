# agents.md

## Project: Who’s My Neta (whosmyneta.com)

### Goal
Develop an MVP for **Who’s My Neta**, a civic engagement platform that displays leader profiles, enables public upvote/downvote ratings, and facilitates discussions. The MVP must be minimal, modular, and ready for iterative scaling into an election intelligence platform.

---

## 1. Core Objectives

1. Build a web app that lists leaders with bios, manifestos, and affiliations.
2. Implement upvote/downvote logic with real-time updates.
3. Add discussion threads per leader or agenda item.
4. Include verification and leaderboard features (simple, manual at this stage).
5. Make the app mobile-first, performant, and ready for public access.

---

## 2. Tech Stack

| Layer | Stack |
|-------|--------|
| **Frontend** | Next.js (TypeScript), TailwindCSS, ShadCN UI components |
| **Backend** | FastAPI (Python) or Node.js (Express) |
| **Database** | PostgreSQL (Supabase or AWS RDS) |
| **Caching** | Redis (optional for phase 2) |
| **Auth** | NextAuth.js (Google, Facebook) + guest sessions via device fingerprinting |
| **Hosting** | Vercel (frontend) + AWS EC2 / Render (backend) |
| **Storage** | Cloudinary or Supabase Storage for images |
| **Version Control** | GitHub repo with main/dev branches |
| **Deployment Trigger** | Automatic deploy from `main` branch push |

---

## 3. MVP Features (Phase 1)

### 3.1 Leader Profiles
- Schema: `id`, `name`, `bio`, `manifesto`, `photo_url`, `affiliation`, `region`, `created_at`, `verified`
- Endpoint: `/api/leaders`
- Display as responsive cards with name, photo, and top manifesto points.
- Detail view shows manifesto, affiliations, and public discussion thread.

### 3.2 Upvote/Downvote System
- Schema: `id`, `leader_id`, `user_id`, `vote_type` (`+1` or `-1`), `created_at`
- Restrict one vote per user per leader (based on auth ID or device fingerprint).
- Realtime vote count on profile card.

### 3.3 Discussion Threads
- Schema: `id`, `leader_id`, `user_id`, `comment_text`, `created_at`
- Public comment section under each leader’s page.
- Minimal moderation (delete/flag endpoint for admin use).

### 3.4 Verification Layer
- Admin-only boolean flag `verified = true` to mark confirmed profiles.
- Simple `/admin` dashboard to list unverified profiles and toggle status.

### 3.5 Leaderboard View
- `/leaders/trending` route
- Display top 10 leaders by net approval score (upvotes minus downvotes).

### 3.6 Search & Filter
- Basic search by name, region, or affiliation.
- Filter UI in navbar dropdown.

---

## 4. System Architecture

```plaintext
[Next.js UI]  →  [API Gateway / FastAPI or Express]
                     ↓
                [PostgreSQL]
                     ↓
               [Redis (optional)]

Frontend communicates with REST API endpoints; all data persisted in PostgreSQL.
Separate environment variables for production and development.

⸻

5. Database Schema (Minimal)

Table: leaders
- id (PK)
- name (text)
- bio (text)
- manifesto (text)
- photo_url (text)
- affiliation (text)
- region (text)
- verified (boolean, default false)
- created_at (timestamp)

Table: votes
- id (PK)
- leader_id (FK)
- user_id (text)
- vote_type (integer)  -- +1 / -1
- created_at (timestamp)

Table: comments
- id (PK)
- leader_id (FK)
- user_id (text)
- comment_text (text)
- created_at (timestamp)


⸻

6. UI Layout (Wireframe Summary)

Home Page
    •   Navbar: logo, search, login, language toggle (EN/Nepali)
    •   Hero: “Know Your Neta. Shape Nepal’s Future.”
    •   Sections:
    •   Featured Leaders
    •   Trending Leaders
    •   Discussion Highlights

Leader Page
    •   Leader card (photo, name, affiliation)
    •   Bio and manifesto
    •   Upvote/Downvote buttons
    •   Approval rating meter
    •   Comment section

Admin Page
    •   Table of leaders with verification toggle

Leaderboard Page
    •   Ranked list of leaders by net approval

⸻

7. API Endpoints

Endpoint    Method  Description
/api/leaders    GET Fetch all leaders
/api/leaders/:id    GET Get leader details
/api/leaders    POST    Create leader (admin only)
/api/leaders/:id/verify PATCH   Verify leader (admin only)
/api/votes  POST    Submit upvote/downvote
/api/comments   POST    Add comment
/api/comments/:leader_id    GET Fetch comments for leader
/api/leaderboard    GET Top leaders by approval score


⸻

8. Authentication
    •   Use NextAuth.js with OAuth (Google, Facebook)
    •   Anonymous voting allowed via local device fingerprint
    •   Admin role hardcoded in .env (temporary)

⸻

9. Design Notes
    •   Use TailwindCSS utility classes for all styling.
    •   Icons from lucide-react.
    •   Cards and modals from shadcn/ui.
    •   Keep it lightweight: no complex charting or prediction models in MVP.
    •   Ensure color scheme matches civic and neutral tone (light grey, white, blue accent).

⸻

10. Deployment Instructions
    1.  Clone repository:
git clone https://github.com/<org>/whosmyneta.git
    2.  Setup .env:

DATABASE_URL=<postgres_connection_string>
NEXTAUTH_SECRET=<random_secret>
NEXTAUTH_URL=http://localhost:3000
CLOUDINARY_URL=<cloudinary_api_key>


    3.  Run locally:

npm install
npm run dev


    4.  Deploy frontend to Vercel, backend to Render/AWS.
    5.  Connect PostgreSQL via Supabase or AWS RDS.
    6.  Ensure domain whosmyneta.com points to frontend app.

⸻

11. Next Iteration (Phase 2 Prep)

After MVP launch:
    •   Add polls and issue surveys (/polls table)
    •   Integrate constituency mapping (Leaflet + GeoJSON)
    •   Build volunteer dashboard for verified data entry
    •   Introduce bias tagging and affiliations via AI-assisted classification

⸻

12. Success Criteria for Agent
    •   Deploy functional MVP by December 2025
    •   At least 3 seeded leader profiles
    •   Working upvote/downvote + comment flow
    •   Mobile-responsive layout
    •   Admin verification panel operational

⸻

13. References
    •   PRD Document v1.0 – November 2, 2025
    •   RateMyNeta (reference)
    •   Polymarket (UI reference)
    •   FiveThirtyEight (data visualization style)

⸻


---

This version gives the AI model a **self-contained execution blueprint** — clear schemas, stack, endpoints, and minimal UI targets — so your dev agent or autonomous code system can ship a prototype with no ambiguity.
