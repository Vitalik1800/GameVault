# GameVault

GameVault is a personal video game library web application for managing,
organizing, searching, filtering, sorting, and tracking games.

## Technology Stack

-   Frontend: HTML, CSS, JavaScript
-   Backend: Node.js, Express.js
-   Database: SQLite with better-sqlite3
-   Testing: Jest, Supertest, Selenium WebDriver
-   Browsers tested: Google Chrome and Microsoft Edge

## Features

### Game Library

-   View all games
-   Add games
-   Edit games
-   Delete games
-   Display game covers
-   Track game status
-   Store ratings and release years

Supported statuses:

-   Backlog
-   Playing
-   Completed
-   Dropped

### Search

Games can be searched by title and related text.

Example:

``` text
GET /api/games?q=witcher
```

### Filters and Sorting

The library supports filtering by genre, platform, status, and minimum
rating.

Examples:

``` text
GET /api/games?status=Completed
GET /api/games?genre=RPG
GET /api/games?platform=PC
GET /api/games?rating=9
```

Games can also be sorted by supported fields and order:

``` text
GET /api/games?sort=rating&order=desc
GET /api/games?sort=title&order=asc
```

### Wishlist

Games can be added to and removed from a separate wishlist.

``` text
GET /api/games/wishlist
PUT /api/games/:id/wishlist
```

### Dashboard

The dashboard displays:

-   Total games
-   Completed games
-   Playing games
-   Backlog games
-   Average rating
-   Statistics by status
-   Statistics by genre
-   Statistics by platform

### Settings

Available settings:

-   Light/dark theme
-   Show/hide game covers
-   Compact game cards
-   Reset settings

Settings are stored in browser `localStorage`.

## Project Structure

``` text
GameVault/
├── public/
│   ├── favicon.svg
│   ├── index.html
│   ├── css/
│   │   ├── base.css
│   │   ├── layout.css
│   │   ├── navigation.css
│   │   ├── dashboard.css
│   │   ├── library.css
│   │   ├── modals.css
│   │   ├── settings.css
│   │   ├── wishlist.css
│   │   └── responsive.css
│   └── js/
│       ├── app.js
│       ├── api.js
│       ├── settings.js
│       ├── dashboard.js
│       ├── games.js
│       ├── wishlist.js
│       ├── filters.js
│       ├── modals.js
│       ├── add_game.js
│       ├── edit_game.js
│       ├── game_actions.js
│       └── navigation.js
├── src/
│   ├── controllers/
│   ├── database/
│   ├── middleware/
│   ├── repositories/
│   ├── routes/
│   ├── services/
│   ├── validators/
│   ├── app.js
│   └── server.js
├── tests/
│   ├── database/
│   ├── integration/
│   ├── unit/
│   └── setup.js
├── tests/e2e/
├── jest.config.js
├── package.json
└── README.md
```

## Architecture

The backend follows a layered architecture:

``` text
HTTP Request
     ↓
Route
     ↓
Middleware
     ↓
Controller
     ↓
Validation
     ↓
Service
     ↓
Repository
     ↓
SQLite
```

Errors are passed to Express error-handling middleware and returned as
JSON responses.

## REST API

  Method   Endpoint                    Description
  -------- --------------------------- ------------------------
  GET      `/api/games`                Get games
  GET      `/api/games/:id`            Get one game
  POST     `/api/games`                Create a game
  PUT      `/api/games/:id`            Update a game
  DELETE   `/api/games/:id`            Delete a game
  GET      `/api/games/stats`          Get library statistics
  GET      `/api/games/wishlist`       Get wishlist games
  PUT      `/api/games/:id/wishlist`   Update wishlist status

## Database

The main SQLite database is:

``` text
src/database/gamevault.db
```

The schema is stored in:

``` text
src/database/schema.sql
```

The `games` table contains:

-   `id`
-   `title`
-   `description`
-   `genre`
-   `platform`
-   `status`
-   `rating`
-   `release_year`
-   `cover_url`
-   `is_wishlist`
-   `created_at`
-   `updated_at`

The `is_wishlist` field uses `0` for false and `1` for true.

## Requirements

-   Node.js
-   npm

Development environment:

``` text
Node.js 22.13.1
Windows 10
```

## Installation

Open a terminal in the project directory:

``` bash
cd GameVault
npm install
```

## Running the Application

Start the application:

``` bash
npm start
```

Development mode:

``` bash
npm run dev
```

Then open:

``` text
http://localhost:3000
```

## Testing

### Jest

Run the unit and integration test suite:

``` bash
npm test
```

The completed Stage 12 test suite contains:

``` text
14 test suites
44 tests
```

### End-to-End Testing

E2E tests use Selenium WebDriver.

Covered areas:

-   Library
-   Add Game
-   Edit Game
-   Delete Game
-   Search
-   Filters and sorting
-   Wishlist
-   Settings
-   Validation
-   Empty states
-   Responsive layouts
-   Chrome
-   Microsoft Edge
-   Browser console and API errors

Selenium Manager resolves browser drivers automatically.

## E2E Test Coverage

  Area                        Scenarios
  ------------------------- -----------
  Library                             3
  Add Game                            1
  Edit Game                           1
  Delete Game                         1
  Search                              4
  Filters and Sorting                 6
  Wishlist                            3
  Settings                            4
  Validation                          5
  Empty State                         1
  Responsive                          3
  Chrome                              3
  Edge                                3
  Browser/API Errors                  4
  **Total E2E scenarios**        **42**

Combined automated test scope:

``` text
44 Jest tests
+
42 E2E scenarios
=
86 automated tests
```

## Frontend Modules

The frontend JavaScript is split into focused modules.

### `api.js`

Provides functions for REST API communication.

### `settings.js`

Manages settings, `localStorage`, themes, cover visibility, compact
cards, and the settings modal.

### `dashboard.js`

Loads and displays dashboard statistics.

### `games.js`

Creates game cards and renders the game library and empty states.

### `wishlist.js`

Loads and renders wishlist games.

### `filters.js`

Handles search, filters, and sorting.

### `modals.js`

Coordinates modal behavior.

### `add_game.js`

Handles game creation and client-side validation.

### `edit_game.js`

Handles loading and updating existing games.

### `game_actions.js`

Handles edit, delete, and wishlist actions.

### `navigation.js`

Controls navigation between application sections.

### `app.js`

Initializes and coordinates the application.

## Validation

Both client-side and server-side validation are used.

Validation covers:

-   Required title
-   Required genre
-   Required platform
-   Valid status
-   Rating range
-   Release year range
-   Cover URL format

Rating must be between `0` and `10`.

Release year must be between `1950` and the current year.

## Responsive Design

Responsive behavior was tested at:

``` text
1920 × 1080
1024 × 768
390 × 844
```

The E2E tests verify that the main content remains visible and that
horizontal page overflow does not occur.

## Browser Compatibility

GameVault has been tested with:

-   Google Chrome
-   Microsoft Edge

The browser tests verify application loading, navigation, and game-card
rendering.

## Error Handling

The project includes:

-   REST API error handling
-   Validation errors
-   Empty states
-   Browser console error checks
-   API response checks
-   Express error middleware

A custom SVG favicon is included to prevent unnecessary `/favicon.ico`
404 requests.

## Development Notes

GameVault intentionally uses standard HTML, CSS, and JavaScript without
a frontend framework.

The backend uses Express.js and SQLite, keeping the application
lightweight and suitable for local development and personal use.

## Version

``` text
GameVault 1.0
```

## License

This project is intended as a personal and educational software project.
