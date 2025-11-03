# Who's My Neta - Project TODO

## Phase 1: MVP (Core Features)

### Database & Schema
- [x] Create leaders table with bio, manifesto, photo, affiliation, region
- [x] Create votes table for upvote/downvote tracking
- [x] Create comments/discussions table for leader discussions
- [x] Create agendas table for tracking leader agendas
- [x] Create agenda votes table for agenda voting
- [x] Seed database with leader roster data from Excel
- [ ] Create indexes for performance optimization

### Backend API Endpoints
- [x] GET /api/leaders - Fetch all leaders with vote counts
- [x] GET /api/leaders/:id - Get leader details with comments
- [x] GET /api/leaders/:id/votes - Get vote summary for a leader
- [x] POST /api/votes - Submit upvote/downvote for leader
- [x] GET /api/agendas - Fetch all agendas
- [x] POST /api/agenda-votes - Submit upvote/downvote for agenda
- [x] GET /api/comments/:leaderId - Fetch comments for a leader
- [x] POST /api/comments - Add comment to leader profile
- [x] GET /api/leaderboard - Top leaders by approval rating
- [x] GET /api/search - Search leaders by name, region, affiliation

### Frontend - Core Pages
- [x] Home page with hero section and featured leaders
- [x] Leader list page with filtering and search
- [x] Leader detail page with bio, manifesto, voting, and comments
- [x] Leaderboard page showing top-rated leaders
- [ ] Agendas page with voting and discussions
- [ ] Admin verification panel for unverified leaders

### Frontend - UI Components
- [x] Bilingual language toggle (English/Nepali)
- [x] Navigation bar with logo, search, language toggle
- [x] Leader card component with vote buttons
- [x] Vote counter and approval rating display
- [x] Comment/discussion section component
- [x] Search and filter UI
- [x] Loading states and error handling

### Authentication & Authorization
- [x] Set up OAuth (Google/Facebook) with NextAuth
- [x] Implement guest voting with device fingerprinting
- [x] Admin role management for verification
- [x] User session management

### Design & Styling
- [x] Define color scheme (civic/neutral: light grey, white, blue accent)
- [x] Set up Tailwind CSS with custom theme
- [x] Implement responsive mobile-first design
- [x] Create reusable UI components with shadcn/ui
- [x] Add icons from lucide-react

## Phase 2: Pre-Election Features (Post-MVP)
- [ ] Polling and agenda surveys
- [ ] Constituency mapping with interactive map
- [ ] Historical voting data integration
- [ ] Candidate onboarding workflow
- [ ] Volunteer dashboard for data submission
- [ ] Admin panel with analytics

## Phase 3: Election Intelligence (Post-March 2026)
- [ ] Live election results feed
- [ ] Approval trends dashboard
- [ ] Comparative analysis tool
- [ ] Public API access

## Deployment & Documentation
- [ ] Deploy frontend to Vercel
- [ ] Deploy backend to production
- [ ] Set up database (PostgreSQL)
- [ ] Configure environment variables
- [ ] Create GitHub repository with documentation
- [ ] Write userGuide.md for end users
- [ ] Create README.md for developers
