# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Development Commands

### Server Management
```powershell
npm run dev        # Start development server with --watch for auto-restart
npm start          # Start production server
```

### Code Quality
```powershell
npm run lint       # Check code with ESLint
npm run lint:fix   # Auto-fix ESLint issues
npm run format     # Format code with Prettier
npm run format:check # Check formatting without changes
```

### Database Operations
```powershell
npm run db:generate # Generate Drizzle migration files from schema
npm run db:migrate  # Run pending migrations
npm run db:studio   # Open Drizzle Studio for database GUI
```

## Architecture Overview

This is a modern Node.js REST API built with Express.js, following a layered architecture pattern with clear separation of concerns.

### Technology Stack
- **Runtime**: Node.js with ES Modules (type: "module")
- **Framework**: Express.js v5
- **Database**: PostgreSQL via Neon serverless
- **ORM**: Drizzle ORM with HTTP driver
- **Validation**: Zod schemas
- **Authentication**: JWT with bcrypt password hashing
- **Logging**: Winston with structured logging
- **Development**: ESLint + Prettier

### Project Structure
The codebase follows a domain-driven layered architecture:

```
src/
├── config/          # Configuration (database, logger)
├── controllers/     # Request handlers and response logic
├── models/          # Drizzle database schemas
├── routes/          # Express route definitions
├── services/        # Business logic layer
├── utils/           # Utility functions (JWT, cookies, formatting)
└── validations/     # Zod validation schemas
```

### Import System
The project uses Node.js import maps for clean module resolution:
- `#config/*` → `./src/config/*`
- `#controllers/*` → `./src/controllers/*`
- `#middleware/*` → `./src/middleware/*`
- `#models/*` → `./src/models/*`
- `#routes/*` → `./src/routes/*`
- `#services/*` → `./src/services/*`
- `#utils/*` → `./src/utils/*`
- `#validations/*` → `./src/validations/*`

### Request Flow
1. **Routes** (`src/routes/`) define endpoints and attach middleware
2. **Controllers** (`src/controllers/`) handle HTTP requests/responses
3. **Services** (`src/services/`) contain business logic and database operations
4. **Models** (`src/models/`) define database schemas with Drizzle ORM
5. **Validations** (`src/validations/`) validate request data with Zod

### Key Components

#### Database Layer
- Uses Drizzle ORM with Neon PostgreSQL serverless
- Schema definitions in `src/models/` using Drizzle table builders
- Migration files generated in `drizzle/` directory
- Connection configured in `src/config/database.js`

#### Authentication System
- JWT-based authentication with cookie storage
- Password hashing using bcrypt (salt rounds: 10)
- Role-based access control (user/admin roles)
- Token utilities in `src/utils/jwt.js`
- Cookie helpers in `src/utils/cookies.js`

#### Logging & Monitoring
- Winston logger with structured JSON output
- Logs stored in `logs/` directory (combined.log, error.log)
- HTTP request logging via Morgan middleware
- Health check endpoint at `/health`

### Environment Configuration
Required environment variables (see `.env`):
- `PORT` - Server port (default: 3000)
- `NODE_ENV` - Environment (development/production)
- `LOG_LEVEL` - Winston log level
- `DATABASE_URL` - PostgreSQL connection string
- `JWT_SECRET` - JWT signing secret (defaults to development key)

### Development Guidelines

#### Code Style
- ES2022+ syntax with ES modules
- 2-space indentation, single quotes, semicolons required
- Arrow functions preferred over function expressions
- Consistent error handling with try/catch in async functions
- All functions should log operations for debugging

#### Database Operations
- Always use parameterized queries via Drizzle ORM
- Include proper error handling for database operations
- Log database operations for audit trails
- Use transactions for multi-step operations

#### API Development
- Validate all inputs using Zod schemas in `src/validations/`
- Return consistent JSON response formats
- Include proper HTTP status codes
- Log all significant operations
- Use structured error responses with validation details

#### Adding New Features
1. Define Zod validation schemas in `src/validations/`
2. Create/update Drizzle models in `src/models/`
3. Implement business logic in `src/services/`
4. Create controllers in `src/controllers/`
5. Define routes in `src/routes/`
6. Update database schema and generate migrations

#### File Organization
- Group related functionality by domain (auth, users, etc.)
- Keep utility functions pure and testable
- Separate configuration from application logic
- Use descriptive file names matching their purpose