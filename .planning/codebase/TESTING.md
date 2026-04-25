# Testing

> Last mapped: 2026-04-25

## Status

**No test framework exists.** No test files, test runners, or CI configuration found anywhere in the project.

## Framework

None currently. The project is vanilla JavaScript with no bundler or module system, making it compatible with minimal setup.

**Recommended path:** `jest` + `jest-environment-jsdom` + `jest-localstorage-mock`

- Lowest friction for vanilla JS architecture
- `jest-environment-jsdom` required since the codebase targets browser APIs (localStorage, DOM)
- `jest-localstorage-mock` needed because `DataManager` and `AdminConfig` rely heavily on localStorage

## Test Structure (Proposed)

```
tests/
  unit/
    data-manager.test.js      # CRUD operations, localStorage
    admin-config.test.js      # Auth logic, PIN handling
    utils.test.js             # escapeHtml, formatDate
    backup-manager.test.js    # validateBackupData
  integration/
    (future — browser-based flows)
```

## Candidate Units

| Module | File | Testable Behavior |
|--------|------|-------------------|
| `DataManager` | `assets/js/data-manager.js` | CRUD entries, localStorage read/write, empty state fallback |
| `AdminConfig` | `assets/js/admin-config.js` | PIN auth, session persistence |
| `escapeHtml` | `assets/js/data-manager.js` | XSS character escaping |
| `formatDate` | `assets/js/data-manager.js` | Date formatting edge cases |
| `BackupManager.validateBackupData` | `assets/js/backup-manager.js` | Backup schema validation |

## Data Shapes (Reference for Fixtures)

From `DataManager` in `assets/js/data-manager.js`:

```js
// Journal entry
{
  id: string,         // timestamp-based
  date: string,       // ISO date
  content: string,    // raw text
  tags: string[],
  mood: string
}
```

## Mocking Notes

- `localStorage` must be mocked (all persistence goes through it)
- No network calls detected — no fetch/XHR mocks needed
- No ES modules — files export via global object assignment; tests must load globals manually or use `require` with `jest.resetModules()`

## Coverage Targets (Recommended v1)

- `DataManager`: 80%+ (core data layer)
- `AdminConfig`: 70%+ (auth logic)
- Utilities: 90%+ (pure functions, trivial to test)
