# VetCare Platform

Full-Stack Multi-Module Veterinary SaaS Platform

## Architecture

- **Frontend:** Next.js 14+ (App Router), TypeScript, Tailwind CSS, shadcn/ui
- **Backend:** NestJS 10+, TypeScript, Prisma ORM
- **Database:** PostgreSQL 16, Redis 7
- **Infrastructure:** Docker, Docker Compose, GitHub Actions, AWS

## Getting Started

### Prerequisites

- Node.js >= 20.0.0
- Docker & Docker Compose
- npm >= 10.0.0

### Quick Start

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd vetcare-platform
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp vetcare-backend/.env.example vetcare-backend/.env
   cp vetcare-frontend/.env.example vetcare-frontend/.env.local
   ```

4. **Start infrastructure (PostgreSQL + Redis)**
   ```bash
   npm run docker:up
   ```

5. **Run database migrations**
   ```bash
   npm run db:migrate
   ```

6. **Start development servers**
   ```bash
   npm run dev
   ```

### Services

| Service | URL | Description |
|---------|-----|-------------|
| Frontend | http://localhost:3000 | Next.js application |
| Backend API | http://localhost:3001 | NestJS API server |
| API Docs | http://localhost:3001/api/docs | Swagger documentation |
| Prisma Studio | http://localhost:5555 | Database GUI |

## Project Structure

```
vetcare-platform/
├── vetcare-backend/          # NestJS backend
│   ├── src/
│   │   ├── modules/          # Feature modules
│   │   │   ├── auth/         # Authentication
│   │   │   ├── users/        # User management
│   │   │   ├── customers/    # Customer portal
│   │   │   ├── appointments/ # Booking system
│   │   │   ├── vet/          # Vet management
│   │   │   ├── lab/          # Laboratory
│   │   │   ├── finance/      # Finance & billing
│   │   │   ├── hr/           # HR & payroll
│   │   │   ├── admin/        # Admin dashboard
│   │   │   └── notifications/# Notifications
│   │   ├── common/           # Shared utilities
│   │   └── config/           # Configuration
│   └── prisma/               # Database schema
├── vetcare-frontend/         # Next.js frontend
│   ├── app/                  # App Router pages
│   │   ├── (auth)/           # Login, register
│   │   ├── (customer)/       # Customer portal
│   │   ├── (vet)/            # Vet management
│   │   ├── (lab)/            # Laboratory
│   │   ├── (finance)/        # Finance
│   │   ├── (hr)/             # HR
│   │   └── (admin)/          # Admin
│   └── components/           # React components
└── docker-compose.yml        # Local development stack
```

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start both frontend and backend |
| `npm run dev:backend` | Start backend only |
| `npm run dev:frontend` | Start frontend only |
| `npm run build` | Build both projects |
| `npm run test` | Run all tests |
| `npm run docker:up` | Start Docker services |
| `npm run docker:down` | Stop Docker services |
| `npm run db:migrate` | Run database migrations |
| `npm run db:generate` | Generate Prisma client |
| `npm run db:studio` | Open Prisma Studio |

## 6 Platform Branches

1. **Customer Portal** - Pet owners: booking, pet records, payments, live chat
2. **Vet Management** - Doctors: scheduling, case notes, prescriptions, telemedicine
3. **Laboratory** - Lab techs: test orders, sample tracking, results, inventory
4. **Finance** - Accountants: invoicing, payments, expenses, insurance, reports
5. **HR & Employers** - HR managers: staff, payroll, attendance, certifications, hiring
6. **Admin / Super** - Platform admins: multi-branch control, RBAC, analytics, audit logs

## License

MIT
