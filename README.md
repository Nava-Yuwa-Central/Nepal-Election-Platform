# Who's My Neta - Civic Engagement Platform

A modern, bilingual civic engagement platform for rating Nepal's Gen Z leaders and agendas ahead of the March 2026 election.

## Features

- **Leader Profiles**: Browse detailed profiles of Gen Z leaders with biographies, manifestos, and policy agendas
- **Voting System**: Upvote or downvote leaders and agendas with real-time approval ratings
- **Discussion Threads**: Engage in public discussions on leader profiles and agendas
- **Leaderboard**: View top-rated leaders ranked by net approval score
- **Search & Filter**: Find leaders by name, region, or affiliation
- **Bilingual Support**: Full English and Nepali language support
- **Responsive Design**: Mobile-first design that works on all devices
- **Anonymous Voting**: Vote without creating an account (device fingerprinting)
- **Real-time Updates**: Live vote counts and approval ratings

## Tech Stack

### Frontend
- **React 19** with TypeScript
- **Tailwind CSS 4** for styling
- **shadcn/ui** for component library
- **Lucide React** for icons
- **Wouter** for routing
- **tRPC** for type-safe API calls

### Backend
- **Node.js** with Express
- **tRPC** for RPC API
- **Drizzle ORM** for database access
- **MySQL** for data persistence
- **Manus OAuth** for authentication

### Infrastructure
- **Vite** for frontend build
- **esbuild** for backend bundling
- **Docker** ready for containerization

## Project Structure

```
whosmyneta/
├── client/                    # Frontend React application
│   ├── src/
│   │   ├── pages/            # Page components
│   │   ├── components/       # Reusable UI components
│   │   ├── contexts/         # React contexts (Language, Theme)
│   │   ├── lib/              # Utilities and tRPC client
│   │   ├── App.tsx           # Main app component with routing
│   │   └── main.tsx          # Entry point
│   └── public/               # Static assets
├── server/                    # Backend Node.js application
│   ├── routers.ts            # tRPC procedure definitions
│   ├── db.ts                 # Database query helpers
│   └── _core/                # Core infrastructure
├── drizzle/                   # Database schema and migrations
│   └── schema.ts             # Table definitions
├── shared/                    # Shared types and constants
├── storage/                   # S3 storage helpers
├── seed-db.mjs               # Database seeding script
├── userGuide.md              # End-user documentation
└── README.md                 # This file
```

## Getting Started

### Prerequisites

- Node.js 22.13.0 or higher (with npm)
- pnpm package manager (install globally via `npm install -g pnpm`)
- Docker and Docker Compose
- PostgreSQL database (Docker container recommended for local development)
- Python 3.x (for initial database setup script)
- Environment variables configured (see below)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/whosmyneta.git
cd whosmyneta/
```

2. Start the PostgreSQL database using Docker Compose:
```bash
cd db/
docker-compose up -d
cd ..
```

3. Install project dependencies:
```bash
pnpm install
```

4. Set up environment variables:
   - Create a `.env.local` file in the project root:
     ```bash
     touch .env.local
     ```
   - Edit `.env.local` with your configuration. For local development with Docker, it should include:
     ```
     DATABASE_URL="postgresql://db_user:db_pwd@123@localhost:5433/nepal_election"
     NEXTAUTH_SECRET=<random_secret>
     NEXTAUTH_URL=http://localhost:3000
     CLOUDINARY_URL=<cloudinary_api_key>
     ```
     (Replace `<random_secret>` and `<cloudinary_api_key>` with actual values)

5. Create the database using the Python setup script:
```bash
python db/setup_database.py
```

6. Push database schema and run migrations:
```bash
pnpm db:push
```

7. Seed initial data:
```bash
node seed-db.mjs
```

8. Start development server:
```bash
pnpm dev
```

The application will be available at `http://localhost:3000`

## Development

### Building for Production

```bash
pnpm build
```

### Running Tests

```bash
pnpm test
```

### Database Migrations

After modifying `drizzle/schema.ts`:
```bash
pnpm db:push
```

### Code Quality

```bash
pnpm lint
pnpm type-check
```

## API Endpoints

All API endpoints are tRPC procedures. Key procedures:

### Leaders
- `leaders.list` - Get all leaders with vote counts
- `leaders.getById` - Get leader details with comments and agendas
- `leaders.leaderboard` - Get top leaders by approval rating
- `leaders.search` - Search leaders by name, region, or affiliation

### Votes
- `votes.submitLeaderVote` - Submit upvote/downvote for leader
- `votes.getLeaderVotes` - Get vote summary for leader
- `votes.submitAgendaVote` - Submit vote for agenda
- `votes.getAgendaVotes` - Get vote summary for agenda

### Comments
- `comments.addLeaderComment` - Add comment to leader profile
- `comments.getLeaderComments` - Get comments for leader
- `comments.addAgendaComment` - Add comment to agenda
- `comments.getAgendaComments` - Get comments for agenda

### Agendas
- `agendas.list` - Get all agendas
- `agendas.getById` - Get agenda details
- `agendas.getByLeader` - Get agendas for specific leader

## Database Schema

### Leaders Table
- `id` - Primary key
- `name` - Leader name
- `bio` - Biography
- `manifesto` - Policy statement
- `photoUrl` - Profile photo URL
- `affiliation` - Political affiliation or organization
- `region` - Geographic region
- `verified` - Verification status
- `createdAt`, `updatedAt` - Timestamps

### Votes Table
- `id` - Primary key
- `leaderId` - Foreign key to leaders
- `userId` - User identifier (device fingerprint or user ID)
- `voteType` - Vote value (+1 or -1)
- `createdAt` - Timestamp

### Comments Table
- `id` - Primary key
- `leaderId` - Foreign key to leaders (nullable)
- `agendaId` - Foreign key to agendas (nullable)
- `userId` - User identifier
- `userName` - Display name
- `commentText` - Comment content
- `createdAt`, `updatedAt` - Timestamps

### Agendas Table
- `id` - Primary key
- `leaderId` - Foreign key to leaders
- `title` - Agenda title
- `description` - Agenda description
- `category` - Category classification
- `createdAt`, `updatedAt` - Timestamps

## Deployment

### Deploying to Production

1. Create a production build:
```bash
pnpm build
```

2. Deploy frontend to Vercel:
```bash
vercel deploy
```

3. Deploy backend to your hosting provider (AWS, Render, etc.)

4. Configure environment variables in production

5. Run database migrations in production:
```bash
pnpm db:push
```

### Environment Variables

Required environment variables:
- `DATABASE_URL` - PostgreSQL connection string
- `JWT_SECRET` - Session signing secret
- `VITE_APP_ID` - Manus OAuth app ID
- `OAUTH_SERVER_URL` - Manus OAuth server URL
- `VITE_OAUTH_PORTAL_URL` - Manus login portal URL
- `VITE_APP_TITLE` - Application title
- `VITE_APP_LOGO` - Logo image URL

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/whosmyneta.git
cd whosmyneta
```

2. Install dependencies:
```bash
pnpm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
# Edit .env.local with your configuration
```

4. Push database schema:
```bash
pnpm db:push
```

5. Seed initial data:
```bash
node seed-db.mjs
```

6. Start development server:
```bash
pnpm dev
```

The application will be available at `http://localhost:3000`

## Development

### Building for Production

```bash
pnpm build
```

### Running Tests

```bash
pnpm test
```

### Database Migrations

After modifying `drizzle/schema.ts`:
```bash
pnpm db:push
```

### Code Quality

```bash
pnpm lint
pnpm type-check
```

## API Endpoints

All API endpoints are tRPC procedures. Key procedures:

### Leaders
- `leaders.list` - Get all leaders with vote counts
- `leaders.getById` - Get leader details with comments and agendas
- `leaders.leaderboard` - Get top leaders by approval rating
- `leaders.search` - Search leaders by name, region, or affiliation

### Votes
- `votes.submitLeaderVote` - Submit upvote/downvote for leader
- `votes.getLeaderVotes` - Get vote summary for leader
- `votes.submitAgendaVote` - Submit vote for agenda
- `votes.getAgendaVotes` - Get vote summary for agenda

### Comments
- `comments.addLeaderComment` - Add comment to leader profile
- `comments.getLeaderComments` - Get comments for leader
- `comments.addAgendaComment` - Add comment to agenda
- `comments.getAgendaComments` - Get comments for agenda

### Agendas
- `agendas.list` - Get all agendas
- `agendas.getById` - Get agenda details
- `agendas.getByLeader` - Get agendas for specific leader

## Database Schema

### Leaders Table
- `id` - Primary key
- `name` - Leader name
- `bio` - Biography
- `manifesto` - Policy statement
- `photoUrl` - Profile photo URL
- `affiliation` - Political affiliation or organization
- `region` - Geographic region
- `verified` - Verification status
- `createdAt`, `updatedAt` - Timestamps

### Votes Table
- `id` - Primary key
- `leaderId` - Foreign key to leaders
- `userId` - User identifier (device fingerprint or user ID)
- `voteType` - Vote value (+1 or -1)
- `createdAt` - Timestamp

### Comments Table
- `id` - Primary key
- `leaderId` - Foreign key to leaders (nullable)
- `agendaId` - Foreign key to agendas (nullable)
- `userId` - User identifier
- `userName` - Display name
- `commentText` - Comment content
- `createdAt`, `updatedAt` - Timestamps

### Agendas Table
- `id` - Primary key
- `leaderId` - Foreign key to leaders
- `title` - Agenda title
- `description` - Agenda description
- `category` - Category classification
- `createdAt`, `updatedAt` - Timestamps

## Deployment

### Deploying to Production

1. Create a production build:
```bash
pnpm build
```

2. Deploy frontend to Vercel:
```bash
vercel deploy
```

3. Deploy backend to your hosting provider (AWS, Render, etc.)

4. Configure environment variables in production

5. Run database migrations in production:
```bash
pnpm db:push
```

### Environment Variables

Required environment variables:
- `DATABASE_URL` - MySQL connection string
- `JWT_SECRET` - Session signing secret
- `VITE_APP_ID` - Manus OAuth app ID
- `OAUTH_SERVER_URL` - Manus OAuth server URL
- `VITE_OAUTH_PORTAL_URL` - Manus login portal URL
- `VITE_APP_TITLE` - Application title
- `VITE_APP_LOGO` - Logo image URL

## Contributing

1. Create a feature branch: `git checkout -b feature/your-feature`
2. Make your changes and commit: `git commit -am 'Add feature'`
3. Push to the branch: `git push origin feature/your-feature`
4. Submit a pull request

## Roadmap

### Phase 2 (Jan-Feb 2026)
- Polling and agenda surveys
- Constituency mapping with interactive maps
- Historical voting data integration
- Candidate onboarding workflow
- Volunteer dashboard

### Phase 3 (Mar 2026+)
- Live election results feed
- Approval trends dashboard
- Comparative analysis tool
- Public API access

## License

This project is licensed under the MIT License - see LICENSE file for details.

## Support

For issues, feature requests, or questions:
- Open an issue on GitHub
- Contact the development team
- Visit whosmyneta.com for more information

## Acknowledgments

- Nepal's Gen Z Movement for inspiration
- Manus platform for infrastructure
- All contributors and volunteers

---

**Who's My Neta - Know Your Neta. Shape Nepal's Future.**
