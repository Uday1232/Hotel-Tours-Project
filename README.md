# Hotel & Tours Business Management System

A complete business management system for a single hotel and tours agency business.

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | Vue 3 + TypeScript + Tailwind CSS |
| Backend | Node.js + Express + TypeScript |
| Database | PostgreSQL + Prisma ORM |
| State Management | Pinia |
| HTTP Client | Axios |
| Build Tool | Vite |

## Project Structure

```
hotel-tours/
├── frontend/                    # Vue 3 SPA (Single Page Application)
│   ├── src/
│   │   ├── assets/             # Static assets (images, CSS)
│   │   │   ├── css/            # Global styles
│   │   │   └── images/         # Image assets
│   │   ├── components/         # Reusable Vue components
│   │   │   ├── common/         # Generic components (buttons, modals, etc.)
│   │   │   ├── layout/         # Layout components (header, footer, sidebar)
│   │   │   ├── hotel/          # Hotel-specific components
│   │   │   ├── tours/          # Tour-specific components
│   │   │   ├── booking/        # Booking-related components
│   │   │   └── admin/          # Admin panel components
│   │   ├── composables/        # Vue 3 composition API hooks
│   │   ├── router/             # Vue Router configuration
│   │   ├── services/           # API service layer
│   │   ├── stores/             # Pinia state stores
│   │   ├── types/              # TypeScript type definitions
│   │   ├── utils/              # Utility functions
│   │   └── views/              # Page components
│   │       ├── public/         # Customer-facing pages
│   │       ├── admin/          # Admin dashboard pages
│   │       └── auth/           # Authentication pages
│   └── public/                 # Public static files
├── backend/                     # Express REST API
│   ├── src/
│   │   ├── domain/             # Business logic (Clean Architecture)
│   │   │   ├── entities/       # Core business objects
│   │   │   ├── value-objects/  # Reusable typed values
│   │   │   ├── repositories/   # Repository interfaces
│   │   │   └── services/       # Domain services
│   │   ├── application/        # Use cases
│   │   │   ├── use-cases/      # Business operations
│   │   │   └── dto/            # Data transfer objects
│   │   ├── infrastructure/     # External concerns
│   │   │   ├── config/         # Environment configuration
│   │   │   ├── database/       # Prisma client setup
│   │   │   └── repositories/   # Repository implementations
│   │   └── presentation/       # HTTP layer
│   │       ├── routes/         # API route definitions
│   │       ├── controllers/    # Request handlers
│   │       ├── middleware/     # Express middleware
│   │       └── validators/     # Request validation
│   └── prisma/                 # Database schema & migrations
└── tests/                       # Test files
```

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- PostgreSQL database

### Installation

1. Clone the repository
2. Install root dependencies:
   ```bash
   npm install
   ```
3. Install frontend dependencies:
   ```bash
   cd frontend
   npm install
   ```
4. Install backend dependencies:
   ```bash
   cd backend
   npm install
   ```

### Environment Setup

1. Copy backend environment file:
   ```bash
   cp backend/.env.example backend/.env
   ```
2. Copy frontend environment file:
   ```bash
   cp frontend/.env.example frontend/.env
   ```
3. Update the values in both `.env` files

### Development

Run both frontend and backend simultaneously:
```bash
npm run dev
```

Or run them separately:
```bash
npm run dev:frontend  # Frontend on http://localhost:3000
npm run dev:backend   # Backend on http://localhost:5000
```

### Code Quality

```bash
npm run lint          # Check for lint errors
npm run format        # Format code with Prettier
```

## API Endpoints

### Health Check
- `GET /health` - Server health status

(More endpoints will be added in subsequent phases)

## Database Schema

(To be implemented in Phase 2)

## License

ISC