# GameVault — Requirements and System Design

## 1. Analysis of Requirements and Design

### 1.1. Definition of the System Purpose

#### 1.1.1. System Name

**GameVault** is a web application for managing a personal video game library.

#### 1.1.2. System Purpose

The primary purpose of GameVault is to provide a convenient tool for **storing, viewing, and managing information about a user's personal collection of video games**.

The application replaces a manually maintained game list with a structured digital library where the user can quickly find games, filter the collection, sort it, and view library statistics.

#### 1.1.3. Main Functionality

The user must be able to:

1. Add games to the personal library.
2. View the game library.
3. View detailed information about a game.
4. Edit game information.
5. Delete games from the library.
6. Search for games by title.
7. Filter games by selected parameters.
8. Sort games by selected criteria.
9. View statistics about the personal library.

#### 1.1.4. First Version Format

The first version of GameVault (**v1.0**) is a **personal local web application**.

In v1.0:

- SQLite is used for data storage.
- Library data is stored locally.
- No user registration is required.
- No authentication system is implemented.
- The application contains one personal game collection.
- Frontend and backend communicate through a REST API.

#### 1.1.5. Scope of This Substage

At this stage, no implementation is performed. The purpose is to define what GameVault is and what problem it solves.

**Result of 1.1:**

> GameVault is a personal local web application for storing and managing a video game library with support for adding, viewing, editing, deleting, searching, filtering, sorting games, and viewing collection statistics.

---

### 1.2. Functional Requirements

The functionality of GameVault is divided into eight main modules.

#### 1.2.1. FR-01 — Game Management

The system must provide full CRUD functionality for games.

The user must be able to:

- Create a new game.
- View a game.
- Update game information.
- Delete a game.

| Operation | Description |
|---|---|
| Create | Add a new game |
| Read | View game information |
| Update | Edit game information |
| Delete | Remove a game |

All operations must be performed through the backend API and interact with the SQLite database.

#### 1.2.2. FR-02 — Game Information

Each game must contain:

| Field | Purpose |
|---|---|
| `id` | Unique game identifier |
| `title` | Game title |
| `description` | Game description |
| `genre` | Game genre |
| `platform` | Game platform |
| `status` | Current library status |
| `rating` | User rating from 1 to 10 |
| `release_year` | Game release year |
| `cover_url` | Game cover URL |
| `created_at` | Record creation date |
| `updated_at` | Last update date |

**Required fields:**

- `title`
- `genre`
- `platform`
- `status`
- `release_year`

**Optional fields:**

- `description`
- `rating`
- `cover_url`

The fields `id`, `created_at`, and `updated_at` are generated automatically by the system.

#### 1.2.3. FR-03 — Game Status

The first version supports four statuses:

```text
Backlog
Playing
Completed
Dropped
```

**Backlog** — the game has been added to the library but has not been started.

**Playing** — the user is currently playing the game.

**Completed** — the user has completed the game.

**Dropped** — the user stopped playing the game.

The system must reject unsupported status values.

#### 1.2.4. FR-04 — Rating

The user can rate a game from **1 to 10**.

A rating may also be absent if the user has not rated the game yet.

```text
rating = NULL
```

means that the game has not been rated.

Valid values:

```text
1
2
3
4
5
6
7
8
9
10
```

Values below 1, above 10, or otherwise invalid must be rejected.

#### 1.2.5. FR-05 — Search

The system must provide search by game title.

Example:

```text
Search: cyber
```

Results:

```text
Cyberpunk 2077
Cyberpunk 2077: Phantom Liberty
```

Search must be case-insensitive.

For example:

```text
cyber
Cyber
CYBER
```

must produce equivalent results.

#### 1.2.6. FR-06 — Filtering

The system must support filtering by:

- Genre
- Platform
- Status
- Rating

Multiple filters can be applied simultaneously.

Example:

```text
Genre: RPG
Platform: PC
Status: Completed
Rating: >= 8
```

The system must return only games matching all selected criteria.

#### 1.2.7. FR-07 — Sorting

The user must be able to sort games by:

- Title
- Rating
- Release year
- Date added

Both ascending and descending order must be supported.

Examples:

```text
Rating ↓

10
9
8
7
...
```

```text
Title ↑

Assassin's Creed
Cyberpunk 2077
Minecraft
The Witcher 3
```

#### 1.2.8. FR-08 — Statistics

The Dashboard must display:

```text
Total Games
Completed
Playing
Backlog
Dropped
Average Rating
```

`Average Rating` must be calculated only from games that have a rating.

---

### 1.3. Non-Functional Requirements

Non-functional requirements define the technical characteristics, architecture, reliability, validation, error handling, and responsiveness requirements of GameVault.

#### 1.3.1. NFR-01 — Technologies

**Frontend:**

- HTML5
- CSS3
- Vanilla JavaScript

**Backend:**

- Node.js
- Express.js

**Database:**

- SQLite

**Testing:**

- Jest
- Supertest

No frontend framework is required for v1.0.

#### 1.3.2. NFR-02 — Architecture

GameVault must use a client-server architecture.

```text
┌──────────────────────┐
│      Frontend        │
│   HTML / CSS / JS    │
└──────────┬───────────┘
           │
           │ HTTP / JSON
           ▼
┌──────────────────────┐
│       REST API       │
│       Express.js     │
└──────────┬───────────┘
           ▼
┌──────────────────────┐
│    Service Layer     │
│   Business Logic     │
└──────────┬───────────┘
           ▼
┌──────────────────────┐
│       SQLite         │
│      games.db        │
└──────────────────────┘
```

The main layers are:

**Frontend Layer**

Responsible for:

- Rendering the interface.
- User interaction.
- Sending HTTP requests.
- Displaying API results.

**API Layer**

Responsible for:

- Request routing.
- Request parameter handling.
- HTTP responses.
- Communication between frontend and service layer.

**Service Layer**

Responsible for:

- Business logic.
- Game operations.
- Business-rule validation.
- Communication with the database layer.

**Database Layer**

Responsible for:

- SQLite connection.
- SQL queries.
- Data persistence.

#### 1.3.3. NFR-03 — Validation

The system must validate data before storing it in the database.

**Title**

- Required.
- Must not be empty.
- Must not contain only whitespace.

**Rating**

- Optional.
- If provided, must be between 1 and 10.

**Release year**

- Required.
- Must be numeric.
- Must represent a valid year.

**Status**

Must be one of:

```text
Backlog
Playing
Completed
Dropped
```

**Genre**

Must correspond to one of the supported genres.

**Platform**

Must correspond to one of the supported platforms.

Backend validation is mandatory even if equivalent validation exists on the frontend.

> Frontend validation improves user experience. Backend validation protects data integrity.

#### 1.3.4. NFR-04 — Error Handling

The API must use appropriate HTTP status codes.

| Code | Name | Usage |
|---:|---|---|
| 200 | OK | Successful retrieval or update |
| 201 | Created | Successful game creation |
| 204 | No Content | Successful deletion |
| 400 | Bad Request | Invalid input data |
| 404 | Not Found | Game does not exist |
| 500 | Internal Server Error | Unexpected server error |

Errors should be returned as JSON.

Example:

```json
{
  "error": "Game not found"
}
```

Validation errors may contain additional details:

```json
{
  "error": "Validation failed",
  "details": {
    "title": "Title is required",
    "rating": "Rating must be between 1 and 10"
  }
}
```

The frontend must handle API errors and display meaningful messages to the user.

#### 1.3.5. NFR-05 — Responsiveness

The interface must work correctly on:

- Desktop
- Tablet
- Mobile

The responsive interface must:

- Adapt the number of game cards per row.
- Adapt spacing and layout.
- Keep controls usable on small screens.
- Prevent unintended horizontal page scrolling.
- Adapt modals to smaller screens.

CSS Media Queries should be used to implement responsive behavior.

#### 1.3.6. NFR-06 — Performance

The local v1.0 application must provide fast loading and responsive interaction.

The implementation should:

- Minimize unnecessary HTTP requests.
- Avoid full page reloads after CRUD operations.
- Use asynchronous data loading.
- Avoid blocking the UI during requests.
- Keep the SQLite layer simple and efficient.

No strict production SLA is required for the personal local MVP.

#### 1.3.7. NFR-07 — Testability

The architecture must support automated backend testing.

The following should be independently testable:

```text
Service Layer
      ↓
Unit Tests
```

and:

```text
REST API
      ↓
Integration Tests
```

Testing stack:

```text
Jest
+
Supertest
```

This requirement directly supports the dedicated testing stages 12 and 13.

#### 1.3.8. NFR-08 — Data Integrity

The system must maintain consistent game data.

SQLite should use:

- A primary key for `id`.
- `NOT NULL` constraints for required fields.
- Appropriate data types.
- Automatic timestamps.
- Suitable constraints for restricted values.

Backend must not store data that failed validation.

---

### 1.4. User Scenarios

The primary actor is the **GameVault user**.

Because v1.0 is a personal local application without authentication, no additional user roles are required.

#### 1.4.1. UC-01 — View Library

**Goal:** View all games stored in the library.

**Main flow:**

```text
User
    ↓
Opens GameVault
    ↓
Frontend sends GET /api/games
    ↓
Backend retrieves games from SQLite
    ↓
API returns game list
    ↓
Frontend displays game cards
```

**Result:** The user sees the current game library.

**Alternative flow:**

If the library is empty:

```text
GET /api/games
       ↓
[]
       ↓
Empty State
       ↓
"No games in your library"
```

#### 1.4.2. UC-02 — Add Game

**Goal:** Add a new game to the library.

**Main flow:**

```text
User
    ↓
Clicks "Add Game"
    ↓
System opens the form
    ↓
User enters game data
    ↓
Frontend validation
    ↓
POST /api/games
    ↓
Backend validation
    ↓
SQLite stores the game
    ↓
API returns created game
    ↓
Frontend updates library
```

**Alternative flow:**

```text
Form submission
      ↓
Validation failed
      ↓
400 Bad Request
      ↓
Display validation error
```

The invalid game must not be stored.

#### 1.4.3. UC-03 — Edit Game

**Goal:** Update information about an existing game.

**Main flow:**

```text
User
    ↓
Opens game
    ↓
Clicks "Edit"
    ↓
System opens populated form
    ↓
User changes data
    ↓
PUT /api/games/:id
    ↓
Backend validation
    ↓
SQLite updates record
    ↓
API returns updated game
    ↓
Frontend updates UI
```

If the game does not exist:

```text
PUT /api/games/:id
       ↓
404 Not Found
       ↓
Display error message
```

#### 1.4.4. UC-04 — Delete Game

**Goal:** Remove a game from the library.

**Main flow:**

```text
User
    ↓
Opens game
    ↓
Clicks "Delete"
    ↓
System displays confirmation
    ↓
User confirms
    ↓
DELETE /api/games/:id
    ↓
SQLite deletes record
    ↓
API returns 204 No Content
    ↓
Frontend removes game card
```

If the user selects Cancel, the game remains unchanged.

#### 1.4.5. UC-05 — Search

**Goal:** Find a game by title.

**Main flow:**

```text
User
    ↓
Enters title or part of title
    ↓
Search
    ↓
System performs search
    ↓
Matching games are displayed
```

Example:

```text
Search: cyber

        ↓

Cyberpunk 2077
Cyberpunk 2077: Phantom Liberty
```

If no games match:

```text
Search
 ↓
No results
 ↓
"No games found"
```

#### 1.4.6. UC-06 — Filter Games

**Goal:** Restrict the displayed games according to selected criteria.

**Main flow:**

```text
User
    ↓
Selects filters
    ↓
Genre / Platform / Status / Rating
    ↓
System applies criteria
    ↓
Matching games are displayed
```

Multiple filters may be combined.

Example:

```text
Genre: RPG
Platform: PC
Status: Completed
Rating: >= 8
```

If there are no matching games:

```text
Filters
   ↓
No matching games
   ↓
"No games match your filters"
```

#### 1.4.7. UC-07 — View Statistics

**Goal:** View an overview of the library.

**Main flow:**

```text
User
    ↓
Opens Dashboard
    ↓
Frontend requests statistics
    ↓
GET /api/games/stats
    ↓
Backend retrieves data from SQLite
    ↓
Statistics are calculated
    ↓
API returns statistics
    ↓
Dashboard displays metrics
```

Metrics:

```text
Total Games
Completed
Playing
Backlog
Dropped
Average Rating
```

For an empty library:

```text
Total Games: 0
Completed: 0
Playing: 0
Backlog: 0
Dropped: 0
Average Rating: —
```

---

### 1.5. Page Structure

The v1.0 interface should remain compact and avoid unnecessary pages.

```text
GameVault
│
├── /              → Dashboard / Library
│
├── /game/:id      → Game Details
│
└── Modal
    ├── Add Game
    └── Edit Game
```

Separate pages for search, filtering, sorting, statistics, or adding games are not required.

#### 1.5.1. `/` — Dashboard / Library

The main page combines the Dashboard and game library.

```text
┌──────────────────────────────────────────────────┐
│ GameVault                              [+ Add]   │
├──────────────────────────────────────────────────┤
│                                                  │
│  Total     Playing     Completed    Backlog      │
│   42          5           18           15        │
│                                                  │
│  Average Rating: 8.2                             │
│                                                  │
├──────────────────────────────────────────────────┤
│                                                  │
│  Search games...                                 │
│                                                  │
│  Genre ▼   Platform ▼   Status ▼   Rating ▼     │
│                                                  │
│  Sort by: Rating ▼                               │
│                                                  │
├──────────────────────────────────────────────────┤
│                                                  │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐       │
│  │   Cover  │  │   Cover  │  │   Cover  │       │
│  │          │  │          │  │          │       │
│  │ Cyberpunk│  │ Minecraft│  │ Witcher  │       │
│  │ RPG      │  │ Sandbox  │  │ RPG      │       │
│  │ ⭐ 9/10  │  │ ⭐ 8/10  │  │ ⭐ 10/10 │       │
│  └──────────┘  └──────────┘  └──────────┘       │
│                                                  │
└──────────────────────────────────────────────────┘
```

#### 1.5.2. Header

The header should contain:

- GameVault branding/name.
- Add Game button.

Example:

```text
GameVault                         [+ Add Game]
```

#### 1.5.3. Dashboard

The Dashboard displays:

```text
Total Games
Playing
Completed
Backlog
Dropped
Average Rating
```

Each metric can be represented as a separate statistic card.

#### 1.5.4. Search, Filters and Sorting

The library controls include:

**Search**

```text
Search games...
```

**Filters**

```text
Genre
Platform
Status
Rating
```

**Sorting**

```text
Title
Rating
Release Year
Date Added
```

#### 1.5.5. Game Card

Each game should be displayed as a card containing at minimum:

```text
┌─────────────────────┐
│       COVER         │
├─────────────────────┤
│ Cyberpunk 2077      │
│ RPG                 │
│ PC                  │
│ ⭐ 9/10             │
│ Completed           │
└─────────────────────┘
```

Clicking a card opens:

```text
/game/:id
```

#### 1.5.6. `/game/:id` — Game Details

The details page displays:

- Cover
- Title
- Description
- Genre
- Platform
- Status
- Rating
- Release Year
- Created At
- Updated At
- Edit button
- Delete button

Example:

```text
┌─────────────────────────────────────────────────┐
│ ← Back to Library                               │
├─────────────────────────────────────────────────┤
│                                                 │
│  ┌──────────────┐                               │
│  │              │    Cyberpunk 2077             │
│  │    COVER     │                               │
│  │              │    Genre: RPG                 │
│  │              │    Platform: PC               │
│  └──────────────┘    Status: Completed          │
│                      Rating: 9/10               │
│                      Release Year: 2020         │
│                                                 │
├─────────────────────────────────────────────────┤
│ Description                                     │
│                                                 │
│ Open-world action RPG...                        │
│                                                 │
├─────────────────────────────────────────────────┤
│                         [Edit] [Delete]          │
└─────────────────────────────────────────────────┘
```

#### 1.5.7. Add Game Modal

Adding a game uses a modal rather than a separate page.

The form contains:

- Title
- Description
- Genre
- Platform
- Status
- Rating
- Release Year
- Cover URL

Flow:

```text
Form
 ↓
Validation
 ↓
POST /api/games
 ↓
SQLite
 ↓
Close Modal
 ↓
Update Library
```

#### 1.5.8. Edit Game Modal

The Edit Game modal uses the same form as Add Game.

Difference:

```text
Add Game
   ↓
Empty form

Edit Game
   ↓
Form populated with current data
```

Flow:

```text
Form
 ↓
Validation
 ↓
PUT /api/games/:id
 ↓
SQLite
 ↓
Update UI
```

#### 1.5.9. Navigation

```text
                  ┌─────────────┐
                  │ Dashboard   │
                  │     /       │
                  └──────┬──────┘
                         │
                   Click Game Card
                         │
                         ▼
                  ┌─────────────┐
                  │ Game Details│
                  │  /game/:id  │
                  └──────┬──────┘
                         │
                  ┌──────┴──────┐
                  ▼             ▼
                Edit          Delete
                  │
                  ▼
                Modal
```

Back navigation:

```text
/game/:id
    ↓
← Back to Library
    ↓
/
```

#### 1.5.10. Responsive Layout

**Desktop**

```text
Dashboard
     ↓
Filters
     ↓
3–4 Game Cards per row
```

**Tablet**

```text
Dashboard
     ↓
Filters
     ↓
2–3 Game Cards per row
```

**Mobile**

```text
Dashboard
     ↓
Filters
     ↓
1 Game Card per row
```

---

### 1.6. Data Model

#### 1.6.1. Main Entity

The main entity of GameVault v1.0 is **Game**.

```text
Game
├── id
├── title
├── description
├── genre
├── platform
├── status
├── rating
├── release_year
├── cover_url
├── created_at
└── updated_at
```

#### 1.6.2. `games` Table

The v1.0 database contains one main table:

```text
games
```

| Field | SQLite Type | NULL | Purpose |
|---|---|---:|---|
| `id` | INTEGER | No | Unique identifier |
| `title` | TEXT | No | Game title |
| `description` | TEXT | Yes | Game description |
| `genre` | TEXT | No | Game genre |
| `platform` | TEXT | No | Game platform |
| `status` | TEXT | No | Game status |
| `rating` | INTEGER | Yes | Rating from 1 to 10 |
| `release_year` | INTEGER | No | Release year |
| `cover_url` | TEXT | Yes | Cover image URL |
| `created_at` | TEXT | No | Creation timestamp |
| `updated_at` | TEXT | No | Last update timestamp |

#### 1.6.3. `id`

```text
id INTEGER PRIMARY KEY AUTOINCREMENT
```

The `id` uniquely identifies each game.

The user does not enter this value manually.

#### 1.6.4. `title`

```text
title TEXT NOT NULL
```

The game title is required and must not be empty or contain only whitespace.

#### 1.6.5. `description`

```text
description TEXT
```

Optional game description.

#### 1.6.6. `genre`

```text
genre TEXT NOT NULL
```

The game genre.

Initial supported examples:

```text
Action
Adventure
RPG
Strategy
Simulation
Racing
Sports
Horror
Platformer
Fighting
```

The final supported list will be fixed during database/API implementation.

#### 1.6.7. `platform`

```text
platform TEXT NOT NULL
```

Initial supported platforms:

```text
PC
PlayStation 5
PlayStation 4
Xbox Series X/S
Xbox One
Nintendo Switch
```

#### 1.6.8. `status`

```text
status TEXT NOT NULL
```

Allowed values:

```text
Backlog
Playing
Completed
Dropped
```

#### 1.6.9. `rating`

```text
rating INTEGER
```

Optional rating.

Allowed values:

```text
NULL
1
2
3
4
5
6
7
8
9
10
```

#### 1.6.10. `release_year`

```text
release_year INTEGER NOT NULL
```

Stores the game's release year and must pass backend validation.

#### 1.6.11. `cover_url`

```text
cover_url TEXT
```

Optional URL to the game's cover image.

If no URL is provided, the frontend should display a placeholder.

#### 1.6.12. `created_at`

```text
created_at TEXT NOT NULL
```

Automatically stores the creation timestamp.

#### 1.6.13. `updated_at`

```text
updated_at TEXT NOT NULL
```

Stores the last update timestamp.

When a game is created:

```text
created_at = updated_at
```

When a game is edited, `updated_at` is updated.

#### 1.6.14. Relationships

No relationships between entities are required in v1.0.

```text
┌─────────────────────┐
│        games        │
├─────────────────────┤
│ id                  │
│ title               │
│ description         │
│ genre               │
│ platform            │
│ status              │
│ rating              │
│ release_year        │
│ cover_url           │
│ created_at          │
│ updated_at          │
└─────────────────────┘
```

No foreign keys are required.

#### 1.6.15. Scope Control

The following tables are intentionally excluded from v1.0:

```text
users
genres
platforms
developers
publishers
reviews
wishlist
achievements
```

The single-table model is appropriate because:

1. GameVault v1.0 is a personal library.
2. Authentication is not required.
3. There are no multiple users.
4. Genres and platforms use small predefined sets.
5. CRUD operations remain simple.
6. Testing remains easier.
7. The project can realistically be developed within seven days.

---

### 1.7. REST API Design

GameVault uses a REST API for communication between frontend and backend.

Data is transferred using JSON.

#### 1.7.1. Base API

```text
/api
```

Main resource:

```text
/api/games
```

#### 1.7.2. CRUD Endpoints

| Method | Endpoint | Purpose | Success Code |
|---|---|---|---:|
| GET | `/api/games` | Get all games | 200 |
| GET | `/api/games/:id` | Get one game | 200 |
| POST | `/api/games` | Create a game | 201 |
| PUT | `/api/games/:id` | Update a game | 200 |
| DELETE | `/api/games/:id` | Delete a game | 204 |

#### 1.7.3. GET `/api/games`

Returns the game library.

```http
GET /api/games
```

Response:

```json
[
  {
    "id": 1,
    "title": "Cyberpunk 2077",
    "description": "Open-world action RPG",
    "genre": "RPG",
    "platform": "PC",
    "status": "Completed",
    "rating": 9,
    "release_year": 2020,
    "cover_url": "https://example.com/cyberpunk.jpg",
    "created_at": "2026-09-01T10:30:00Z",
    "updated_at": "2026-09-01T10:30:00Z"
  }
]
```

An empty library returns:

```json
[]
```

#### 1.7.4. GET `/api/games/:id`

```http
GET /api/games/1
```

Returns a single game.

If the game does not exist:

```http
404 Not Found
```

```json
{
  "error": "Game not found"
}
```

#### 1.7.5. POST `/api/games`

Creates a new game.

```http
POST /api/games
Content-Type: application/json
```

Request body:

```json
{
  "title": "Cyberpunk 2077",
  "description": "Open-world action RPG",
  "genre": "RPG",
  "platform": "PC",
  "status": "Completed",
  "rating": 9,
  "release_year": 2020,
  "cover_url": "https://example.com/cyberpunk.jpg"
}
```

The client does not provide:

- `id`
- `created_at`
- `updated_at`

These are generated by the backend/database.

Successful response:

```http
201 Created
```

The response contains the created game.

#### 1.7.6. PUT `/api/games/:id`

Updates an existing game.

```http
PUT /api/games/1
Content-Type: application/json
```

Example body:

```json
{
  "title": "Cyberpunk 2077",
  "description": "Updated description",
  "genre": "RPG",
  "platform": "PC",
  "status": "Completed",
  "rating": 10,
  "release_year": 2020,
  "cover_url": "https://example.com/cyberpunk.jpg"
}
```

Successful response:

```http
200 OK
```

If the game does not exist:

```http
404 Not Found
```

#### 1.7.7. DELETE `/api/games/:id`

Deletes a game.

```http
DELETE /api/games/1
```

Successful response:

```http
204 No Content
```

If the game does not exist:

```http
404 Not Found
```

#### 1.7.8. Search Query Parameter

Search is implemented through query parameters rather than a separate endpoint.

```http
GET /api/games?search=cyber
```

The backend searches the `title` field.

Search must be case-insensitive.

#### 1.7.9. Filtering Query Parameters

Genre:

```http
GET /api/games?genre=RPG
```

Platform:

```http
GET /api/games?platform=PC
```

Status:

```http
GET /api/games?status=Completed
```

Minimum rating:

```http
GET /api/games?rating=8
```

For the rating parameter, `rating=8` means:

```text
rating >= 8
```

#### 1.7.10. Combining Query Parameters

Multiple filters may be combined:

```http
GET /api/games?genre=RPG&platform=PC&status=Completed
```

The logic is:

```text
Genre = RPG
AND
Platform = PC
AND
Status = Completed
```

Search can also be combined with filters:

```http
GET /api/games?search=witcher&platform=PC&status=Completed
```

#### 1.7.11. Sorting

Sorting uses:

```text
sort=<field>
order=<asc|desc>
```

Examples:

```http
GET /api/games?sort=title&order=asc
```

```http
GET /api/games?sort=rating&order=desc
```

```http
GET /api/games?sort=release_year&order=desc
```

```http
GET /api/games?sort=created_at&order=desc
```

Supported sort fields:

```text
title
rating
release_year
created_at
```

#### 1.7.12. Combined Query

Example:

```http
GET /api/games?search=cyber&genre=RPG&platform=PC&status=Completed&rating=8&sort=rating&order=desc
```

This means:

```text
Search: cyber
Genre: RPG
Platform: PC
Status: Completed
Rating: >= 8
Sort: Rating
Order: Descending
```

#### 1.7.13. GET `/api/games/stats`

Dashboard statistics are provided by:

```http
GET /api/games/stats
```

Example response:

```json
{
  "total": 42,
  "completed": 18,
  "playing": 5,
  "backlog": 15,
  "dropped": 4,
  "averageRating": 8.2
}
```

`averageRating` is calculated only from games with a rating.

If no games have ratings:

```json
{
  "total": 0,
  "completed": 0,
  "playing": 0,
  "backlog": 0,
  "dropped": 0,
  "averageRating": null
}
```

#### 1.7.14. API Map

```text
                    /api/games
                         │
          ┌──────────────┼──────────────┐
          │              │              │
         GET            POST           GET
          │              │              │
          ▼              ▼              ▼
       All Games       Create          /:id
                                         │
                                         ▼
                                      One Game
                                         │
                              ┌──────────┴──────────┐
                              ▼                     ▼
                             PUT                  DELETE
                              │                     │
                              ▼                     ▼
                           Update                Remove


GET /api/games
      │
      ├── ?search=
      ├── ?genre=
      ├── ?platform=
      ├── ?status=
      ├── ?rating=
      ├── ?sort=
      └── ?order=

GET /api/games/stats
      │
      ▼
   Dashboard
```

**Important routing rule:**

```text
GET /api/games/stats
GET /api/games/:id
```

The `/stats` route must be registered before the `/:id` route so that `stats` is not interpreted as an ID.

---

### 1.8. MVP Definition

The **MVP (Minimum Viable Product)** is the minimum complete version of GameVault that provides a functional personal game library.

The complete core flow is:

```text
Add Game
     ↓
Save to SQLite
     ↓
View Library
     ↓
Search / Filter / Sort
     ↓
View Details
     ↓
Edit
     ↓
Delete
     ↓
View Statistics
```

#### 1.8.1. Included in MVP

**Interface:**

- Dashboard
- Game Library
- Game Details
- Add Game
- Edit Game
- Delete Game
- Search
- Filters
- Sorting
- Responsive UI

**Game data:**

- Title
- Description
- Genre
- Platform
- Status
- Rating
- Release Year
- Cover URL
- Creation timestamp
- Update timestamp

**Status values:**

```text
Backlog
Playing
Completed
Dropped
```

**Rating:**

```text
1–10
```

or:

```text
NULL
```

**Backend:**

- Node.js
- Express.js
- REST API
- CRUD
- Search
- Filtering
- Sorting
- Statistics
- Validation
- Error handling

**Database:**

- SQLite
- `games` table

**Testing:**

- Jest
- Supertest
- Unit tests
- API/integration tests

#### 1.8.2. Excluded from v1.0

The following features are explicitly outside the MVP scope.

**Users:**

- Registration
- Authentication
- User profiles
- Roles and permissions

**Synchronization:**

- Cloud storage
- Cloud synchronization
- Cross-device synchronization

**External APIs:**

- Steam API
- IGDB API
- Automatic game data retrieval
- Automatic cover retrieval

**Social features:**

- Friends
- Social network
- Comments
- Likes
- Community ratings

**Game features:**

- Achievements
- Multiplayer integration
- Game-service integrations

**Intelligent features:**

- Recommendation system
- Personalized recommendations
- AI-based library analysis

#### 1.8.3. GameVault v2.0 Roadmap

Excluded features may become part of a future version:

```text
                 GameVault
                    │
          ┌─────────┴─────────┐
          ▼                   ▼
        v1.0                 v2.0
          │                   │
   Personal Library       Accounts
   SQLite                 Cloud Sync
   REST API               Steam API
   Search                 IGDB API
   Filters                Friends
   Statistics             Comments
   Tests                  Achievements
   Responsive UI          Recommendations
```

v2.0 features are not part of the seven-day implementation.

#### 1.8.4. MVP Scope Table

| Feature | v1.0 |
|---|:---:|
| Dashboard | ✅ |
| Game Library | ✅ |
| Add Game | ✅ |
| Edit Game | ✅ |
| Delete Game | ✅ |
| Game Details | ✅ |
| Search | ✅ |
| Filters | ✅ |
| Sorting | ✅ |
| Rating | ✅ |
| Status | ✅ |
| Statistics | ✅ |
| SQLite | ✅ |
| REST API | ✅ |
| Validation | ✅ |
| Error handling | ✅ |
| Unit tests | ✅ |
| API / Integration tests | ✅ |
| Responsive UI | ✅ |
| Authentication | ❌ |
| Registration | ❌ |
| User profiles | ❌ |
| Cloud sync | ❌ |
| Steam API | ❌ |
| IGDB API | ❌ |
| Social network | ❌ |
| Friends | ❌ |
| Comments | ❌ |
| Achievements | ❌ |
| Multiplayer | ❌ |
| Recommendations | ❌ |

#### 1.8.5. MVP Completion Criteria

GameVault v1.0 is considered ready for release when the user can:

```text
1. Start the application
        ↓
2. Open the library
        ↓
3. Add a game
        ↓
4. See it in the library
        ↓
5. Find it using Search
        ↓
6. Filter / sort the library
        ↓
7. Open Game Details
        ↓
8. Edit the game
        ↓
9. Delete the game
        ↓
10. View statistics
```

The following architecture must operate reliably:

```text
Frontend
   ↕
REST API
   ↕
Service Layer
   ↕
SQLite
```

Core functionality must also be covered by automated tests.

---

## 1.9. Seven-Day Project Scope

The complete project is planned for development over **7 days**.

The implementation plan consists of **14 stages**, with two stages dedicated to testing and the final stage dedicated to release.

```text
Stage 01 — Requirements and Design
Stage 02 — Project Setup
Stage 03 — Database
Stage 04 — Backend Foundation
Stage 05 — Game CRUD API
Stage 06 — Search, Filters and Sorting
Stage 07 — Statistics API
Stage 08 — Frontend Foundation
Stage 09 — Game Library UI
Stage 10 — Game Details and Forms
Stage 11 — Integration and Responsive UI
Stage 12 — Unit Testing
Stage 13 — API / Integration Testing
Stage 14 — Release
```

This schedule is intentionally scoped around the MVP. New features should not be added during the seven-day implementation unless the MVP scope is explicitly revised.

---

## 1.10. Definition of Done for Stage 1

Stage 1 — **Analysis of Requirements and Design** — is complete when the following have been defined:

- System purpose
- Functional requirements
- Non-functional requirements
- User scenarios
- Page structure
- Data model
- SQLite structure
- REST API
- Query parameters
- Validation rules
- Error handling
- MVP scope
- Explicitly excluded v2.0 features
- MVP completion criteria
- Seven-day implementation boundary

```text
1.1 System Purpose                  ✅
1.2 Functional Requirements        ✅
1.3 Non-Functional Requirements    ✅
1.4 User Scenarios                 ✅
1.5 Page Structure                 ✅
1.6 Data Model                     ✅
1.7 REST API Design                ✅
1.8 MVP Definition                 ✅
```

**Stage 1 is complete.**
