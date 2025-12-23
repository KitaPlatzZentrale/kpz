# Development Guide

This guide will help you set up your development environment and start contributing to Kitaplatz-Zentrale.

## Prerequisites

- **Node.js**: v18.16.0 (backend requirement)
- **npm**: 8.19.3 or higher
- **MongoDB**: Local installation or MongoDB Atlas account
- **Git**: For version control
- **AWS CLI**: (Optional) For AWS-related development

## Initial Setup

### 1. Clone the Repository

```bash
git clone https://github.com/KitaPlatzZentrale/kpz.git
cd kpz
```

### 2. Environment Variables

Each service requires a `.env` file. Contact the repository maintainers for the required values.

#### Backend `.env`
```bash
cd backend
touch .env
```

Required variables:
- MongoDB connection string
- AWS credentials (if not using IAM roles)
- Datadog API key

#### Frontend `.env`
```bash
cd frontend
touch .env
```

Required variables:
- `VITE_BACKEND_URL` - Backend API endpoint
- `VITE_PUBLIC_HERE_API_KEY` - HERE Maps API key

#### Lambda Services `.env`

Each Lambda service (email, notification, scraper, location-service) needs its own `.env` file.

### 3. MongoDB Setup

You have two options:

**Option A: MongoDB Atlas (Recommended)**
1. Create free account at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Create a cluster
3. Get connection string
4. Add to backend `.env`

**Option B: Local MongoDB**
```bash
# macOS (Homebrew)
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community

# Verify installation
mongosh
```

## Running the Application

### Backend Development

```bash
cd backend
npm install

# Terminal 1: Compile TypeScript (watch mode)
npx tsc --watch

# Terminal 2: Run the server
npm run local
```

The backend will run on `http://localhost:3000`.

#### Running Tests
```bash
npm test
```

### Frontend Development

```bash
cd frontend
npm install  # or: yarn install

# Start development server
npm run dev  # or: yarn dev
```

The frontend will run on `http://localhost:5173` (Vite default).

### Email Service Development

```bash
cd email
yarn install

# Preview email templates
yarn dev

# Build Lambda functions
yarn build
```

The email dev server runs on `http://localhost:3000` and shows all email templates.

### Notification Service Development

```bash
cd notification
yarn install
yarn build
```

### Scraper Development

```bash
cd scraper
npm install
npm run build
```

### Location Service Development

```bash
cd location-service
npm install
# Build commands TBD - check package.json
```

## Development Workflow

### 1. Create a Feature Branch

```bash
git checkout -b feature/your-feature-name
```

### 2. Make Your Changes

Follow the existing code structure:

**Backend**: Add endpoints following the entity pattern
- `entities/{entity}/handler/` - Route handlers
- `entities/{entity}/service.ts` - Business logic
- `entities/{entity}/model.ts` - Mongoose models
- `entities/{entity}/types.ts` - TypeScript interfaces

**Frontend**: Follow React component structure
- `components/` - Reusable components
- `pages/` - Page-level components
- `styles/` - Global styles

### 3. Test Your Changes

```bash
# Backend
cd backend
npm test

# Frontend - manual testing in browser
cd frontend
npm run dev
```

### 4. Commit Your Changes

```bash
git add .
git commit -m "feat: your descriptive commit message"
```

Follow conventional commit format:
- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation changes
- `refactor:` - Code refactoring
- `test:` - Adding tests
- `chore:` - Maintenance tasks

### 5. Push and Create PR

```bash
git push origin feature/your-feature-name
```

Then create a Pull Request on GitHub.

## Common Development Tasks

### Add a New API Endpoint

1. Create handler in `backend/src/entities/{entity}/handler/{name}.ts`
2. Add route in `backend/src/routes.ts`
3. Add business logic in `service.ts`
4. Update types in `types.ts`
5. Test the endpoint

### Add a New Frontend Page

1. Create page component in `frontend/src/pages/{name}.tsx`
2. Add route in `frontend/src/router.tsx`
3. Add navigation link if needed
4. Test in browser

### Modify Email Templates

1. Edit template in `email/src/templates/{name}.tsx`
2. Test with `yarn dev`
3. Build with `yarn build`
4. Deploy Lambda function

## Docker Development

### Backend with Docker

```bash
cd backend

# Local development
npm run docker-local

# Rebuild
npm run docker-local-new-build

# Stop containers
npm run docker-down
```

### Frontend with Docker

```bash
cd frontend
docker-compose up -d
```

## Debugging

### Backend Debugging

1. Add breakpoints in your IDE
2. Or use `console.log()` and check terminal output
3. Check logs in `backend/logs/`

### Frontend Debugging

1. Use React Developer Tools browser extension
2. Check browser console
3. Use `console.log()` for debugging

### Lambda Debugging

For local Lambda testing, you can use SAM CLI or test locally:

```bash
# Example for email service
cd email
node -e "require('./dist/confirmConsent').handler({/* test event */}, {})"
```

## Troubleshooting

### Backend won't start
- Check MongoDB is running
- Verify `.env` file exists and has correct values
- Run `npm install` to ensure dependencies are installed
- Check port 3000 is not in use

### Frontend build fails
- Clear `node_modules` and reinstall: `rm -rf node_modules && npm install`
- Check Node version: `node -v` (should be 18.x)
- Clear Vite cache: `rm -rf node_modules/.vite`

### TypeScript errors
- Run `npx tsc --watch` to see compilation errors
- Check `tsconfig.json` is present
- Ensure all type definitions are installed

## Code Style

### Backend
- Use TypeScript
- Follow existing patterns (handler/service/model)
- Add types for all functions and variables
- Use meaningful variable names
- Add comments for complex logic

### Frontend
- Use TypeScript
- Use functional components with hooks
- Follow MUI Joy theming
- Keep components small and focused
- Extract reusable logic to custom hooks

## Security Best Practices

- Never commit `.env` files
- Never commit API keys or secrets
- Use environment variables for sensitive data
- Follow security patterns in `backend/src/index.ts`
- Validate all user input
- Sanitize data before database operations

## Additional Resources

- [Node.js Documentation](https://nodejs.org/docs/)
- [React Documentation](https://react.dev/)
- [Express Documentation](https://expressjs.com/)
- [MongoDB Documentation](https://docs.mongodb.com/)
- [AWS Lambda Documentation](https://docs.aws.amazon.com/lambda/)
- [Terraform Documentation](https://www.terraform.io/docs) (for infrastructure)

## Getting Help

- Check existing documentation
- Search [GitHub Issues](https://github.com/KitaPlatzZentrale/kpz/issues)
- Ask team members
- Create a new issue if needed

---

Happy coding! 🚀
