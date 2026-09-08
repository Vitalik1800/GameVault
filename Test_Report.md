# GameVault — Stage 12–13 Test Report

## 1. Overview

This report summarizes the automated testing completed for the GameVault application during Stages 12 and 13.

The testing covered the backend, database, REST API, frontend functionality, browser-based end-to-end scenarios, responsive behavior, browser compatibility, and browser/API error detection.

### Testing stack

- Node.js
- Jest
- Supertest
- Selenium WebDriver
- Google Chrome
- Microsoft Edge
- SQLite

---

# 2. Stage 12 — Automated Application Testing

Stage 12 introduced automated testing with Jest and Supertest.

A dedicated test database was configured so that automated tests do not modify the production database.

```text
Production database:
src/database/gamevault.db

Test database:
tests/database/test.db
```

## 2.1 Stage 12 Result

```text
Test Suites: 14 passed, 14 total
Tests:       44 passed, 44 total
```

**Result: 44/44 tests passed.**

## 2.2 Stage 12 Coverage

The following areas were tested:

- Database initialization
- Database connection
- Game creation
- Game retrieval
- Game retrieval by ID
- Game updating
- Game deletion
- Game search
- Genre filtering
- Platform filtering
- Status filtering
- Minimum rating filtering
- Sorting
- Input validation
- API error handling
- Empty library behavior
- Complete game lifecycle

## 2.3 REST API Coverage

```text
GET    /api/games
GET    /api/games/:id
POST   /api/games
PUT    /api/games/:id
DELETE /api/games/:id
GET    /api/games/stats
GET    /api/games/wishlist
PUT    /api/games/:id/wishlist
```

---

# 3. Stage 13 — End-to-End Testing

Stage 13 introduced browser-based end-to-end testing using Selenium WebDriver.

The tests interact with the actual GameVault user interface and verify complete user workflows.

```text
Selenium WebDriver
        ↓
Browser
        ↓
GameVault UI
        ↓
Frontend JavaScript
        ↓
REST API
        ↓
Express
        ↓
SQLite
```

---

# 4. Stage 13 Test Results

## 4.1 Library

Verified:

- GameVault application loading
- Library navigation
- Game card rendering

**3 tests passed.**

## 4.2 Add Game

Verified the complete Add Game workflow:

```text
Open Add Game
      ↓
Fill form
      ↓
Submit
      ↓
API request
      ↓
Database
      ↓
Game appears in Library
```

**1 test passed.**

## 4.3 Edit Game

Verified:

- Opening the edit form
- Updating the game title
- Updating the description
- Updating the rating
- Updating the status
- Displaying the updated data

**1 test passed.**

## 4.4 Delete Game

Verified:

- Delete button
- Browser confirmation dialog
- Confirmation handling
- Game removal from the Library

**1 test passed.**

## 4.5 Search

Search E2E scenarios covered:

- Search by game title
- Partial title search
- Search with no matching games
- Empty state after an unsuccessful search

The test implementation was adjusted to correctly handle Selenium's `findElements()` array result.

**4 tests passed.**

## 4.6 Filters and Sorting

Six scenarios were tested:

- Genre filtering
- Platform filtering
- Status filtering
- Minimum rating filtering
- Title ascending sorting
- Rating descending sorting

**6 tests passed.**

## 4.7 Wishlist

Three scenarios were tested:

- Add a game to Wishlist
- Display a game in Wishlist
- Remove a game from Wishlist

**3 tests passed.**

The tests also handled DOM re-rendering after Wishlist updates.

## 4.8 Settings

Four scenarios were tested:

- Enable dark theme
- Show and hide game covers
- Enable compact cards
- Reset settings to defaults

**4 tests passed.**

## 4.9 Validation

Five validation scenarios were tested:

- Empty required fields
- Rating below 0
- Rating above 10
- Invalid cover URL
- Invalid release year

**5 tests passed.**

## 4.10 Empty State

Verified that the Library displays an empty state when a search returns no games.

The selector was scoped to:

```text
#game_library .empty_state
```

**1 test passed.**

---

# 5. Responsive Testing

Responsive behavior was tested using three viewport sizes.

| Device Type | Viewport | Result |
|---|---:|---|
| Desktop | 1920 × 1080 | PASS |
| Tablet | 1024 × 768 | PASS |
| Mobile | 390 × 844 | PASS |

The tests verified:

- Application loading
- Main content visibility
- Game library availability
- Absence of horizontal overflow

**3 tests passed.**

---

# 6. Browser Compatibility

## 6.1 Google Chrome

Chrome E2E testing verified:

- Application startup
- Dashboard rendering
- Library navigation
- Game card rendering

**3 tests passed.**

## 6.2 Microsoft Edge

Edge E2E testing verified:

- Application startup
- Dashboard rendering
- Library navigation
- Game card rendering

**3 tests passed.**

During the Edge test run, the browser reported:

```text
LoadEnclaveImageW failed, error code 577
```

The GameVault tests still completed successfully. The message was not related to a GameVault application failure.

---

# 7. Browser Console and Server/API Error Testing

The final Stage 13 test suite checked for browser console errors and verified the main API endpoints.

The following API endpoints were tested from the browser:

```text
/api/games
/api/games/stats
/api/games/wishlist
```

All returned successful HTTP responses.

**4 tests passed.**

## 7.1 Favicon Issue

The initial browser console test detected:

```text
/favicon.ico
404 Not Found
```

The issue was fixed by adding a code-generated SVG favicon:

```text
public/favicon.svg
```

and registering it in `index.html`:

```html
<link rel="icon" href="favicon.svg" type="image/svg+xml">
```

After the fix, the browser console test passed successfully.

---

# 8. Problems Found During Testing

The E2E testing process identified several issues that were corrected.

## 8.1 Selenium Alert Handling

The delete test initially produced a `NoSuchAlertError`.

The test was corrected to explicitly wait for the browser alert before accepting it.

## 8.2 Stale DOM Elements

Wishlist updates re-rendered game cards and caused stale element references.

The tests were updated to locate the required elements again after the DOM was refreshed.

## 8.3 Hidden Checkbox Interaction

Settings checkboxes were visually hidden by the custom switch UI.

Direct Selenium clicks caused `ElementNotInteractableError`.

The E2E test was adapted to trigger the checkbox through JavaScript.

## 8.4 Empty State Selector

A global `.empty_state` selector matched multiple elements.

The test was scoped to the Library container:

```text
#game_library .empty_state
```

## 8.5 Favicon 404

Chrome reported a 404 for `/favicon.ico`.

A code-generated SVG favicon was added and the console error disappeared.

---

# 9. Overall Testing Statistics

## Stage 12

```text
14 test suites
44 tests
44 passed
0 failed
```

## Stage 13

```text
14 E2E test suites
42 tests
42 passed
0 failed
```

## Combined Result

```text
Stage 12: 44 tests
Stage 13: 42 tests
-------------------
Total:     86 automated tests
Passed:    86
Failed:     0
```

**Overall automated test result: 86/86 tests passed.**

---

# 10. Final Conclusion

Stages 12 and 13 established a comprehensive automated testing foundation for GameVault.

The application was tested at multiple levels:

```text
Database
   ↓
Repository
   ↓
Service
   ↓
Controller
   ↓
REST API
   ↓
Frontend
   ↓
Browser
```

The test suite covers the application's core CRUD functionality, search, filtering, sorting, Wishlist, Settings, validation, empty states, responsive layout, browser compatibility, browser console errors, and API availability.

Testing was performed in both Google Chrome and Microsoft Edge, as well as across desktop, tablet, and mobile viewport sizes.

The final result is:

**86 automated tests passed with 0 failed tests.**

Therefore, **Stages 12–13 are completed successfully.**
