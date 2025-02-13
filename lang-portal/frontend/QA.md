# Quality Assurance Documentation

## Testing Strategy
We use Cypress for end-to-end testing, focusing on core implemented features:
- Real browser testing
- Easy to maintain tests
- Visual test runner
- Automatic waiting and retries

## Test Coverage
Current test suite covers:
- Core navigation (Dashboard, Spanish History)
- Theme switching
- Basic content verification

## Running Tests
```bash
# Run tests in headless mode
npm test

# Open Cypress UI for development
npm run test:open
```

## Test Structure
All tests are in `cypress/e2e/core-features.cy.ts`

## Development Notes
- Only testing fully implemented features
- Activities section tests pending implementation
- Study session tests to be added when complete 