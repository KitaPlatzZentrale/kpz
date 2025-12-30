# Backend Testing Guide

## Overview

This project uses Jest with TypeScript for testing critical business logic. Tests are co-located with source files for easy discovery and maintenance.

## Test Structure

Tests are placed next to the files they test:

```
backend/src/entities/
└── signups/
    ├── service.ts
    ├── service.test.ts          ← Unit tests
    └── handler/
        ├── kitaFinderServiceSignup.ts
        └── kitaFinderServiceSignup.test.ts
```

## Running Tests

### Local Development

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage report
npm run test:coverage
```

### CI/CD Pipeline

Tests run automatically on:
- **Push to dev branch**: Backend tests only
- **Push to main branch**: Full test suite (backend + frontend)
- **Pull requests to main**: Full test suite

## What's Tested

### Critical Business Logic

1. **Signup Service** (`src/entities/signups/service.test.ts`)
   - ✅ Single Kita notification signup
   - ✅ Kita Finder service signup
   - ✅ Consent revocation (GDPR compliance)

2. **Location Service** (`src/entities/kitas/handler/locationService.test.ts`)
   - ✅ Geospatial search within radius
   - ✅ Pagination logic
   - ✅ Error handling for invalid coordinates

## Test Coverage Goals

- **Target**: 70%+ coverage for critical business logic
- **Measurement**: Run `npm run test:coverage` to see current coverage
- **Philosophy**: Quality over quantity - focus on critical paths

## Writing New Tests

### Co-located Test Files

Create test files next to the source files:

```typescript
// src/entities/example/service.ts
export class ExampleService {
  public static doSomething() {
    // Implementation
  }
}

// src/entities/example/service.test.ts
import { ExampleService } from './service';

describe('ExampleService', () => {
  it('should do something', () => {
    // Test implementation
  });
});
```

### Mocking Dependencies

Use Jest mocks for external dependencies:

```typescript
import { UserModel } from './model';

// Mock Mongoose model
jest.mock('./model');

describe('My Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should interact with database', async () => {
    (UserModel.findOne as jest.Mock).mockResolvedValue(mockUser);
    // Test logic
  });
});
```

## Dependencies

Test dependencies are in `devDependencies`:

```bash
npm install --save-dev @shelf/jest-mongodb mongodb-memory-server
```

**Note**: If `npm install` fails, try:
```bash
npm install --legacy-peer-deps
# or
yarn add -D @shelf/jest-mongodb mongodb-memory-server
```

## Troubleshooting

### Tests not found

Ensure your test file matches the pattern:
- `*.test.ts`
- `*.spec.ts`

### Mocks not working

Clear mocks in `beforeEach`:
```typescript
beforeEach(() => {
  jest.clearAllMocks();
});
```

### Coverage too low

Check `jest.config.js` for coverage thresholds. Current targets:
- Branches: 70%
- Functions: 70%
- Lines: 70%
- Statements: 70%

## Future Enhancements

- [ ] Integration tests with MongoDB Memory Server
- [ ] E2E tests with Supertest
- [ ] Frontend component tests (Vitest + React Testing Library)
- [ ] Pre-commit hooks with Husky

## Resources

- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [ts-jest Documentation](https://kulshekhar.github.io/ts-jest/)
- [Testing Best Practices](https://testingjavascript.com/)
