# Stage 3. SQLite Database Design

## 3.1. Defining the `games` Table Structure

The main entity of GameVault v1.0 is `Game`.

For the first version, a single `games` table is sufficient.

```text
games
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

| Field | Purpose |
|---|---|
| `id` | Unique game identifier |
| `title` | Game title |
| `description` | Game description |
| `genre` | Game genre |
| `platform` | Game platform |
| `status` | Current game status in the library |
| `rating` | Personal rating from 1 to 10 |
| `release_year` | Game release year |
| `cover_url` | Game cover URL |
| `created_at` | Date and time when the game was added |
| `updated_at` | Date and time of the last update |

Example:

```text
Cyberpunk 2077
RPG
PC
Completed
9
2020
```

The v1.0 database does not include separate tables for users, genres, platforms, developers, publishers, reviews, achievements, or wishlists.

---

## 3.2. Defining Data Types

| Field | Type | Reason |
|---|---|---|
| `id` | `INTEGER` | Numeric identifier |
| `title` | `TEXT` | Game title |
| `description` | `TEXT` | Text description |
| `genre` | `TEXT` | Genre name |
| `platform` | `TEXT` | Platform name |
| `status` | `TEXT` | Game status |
| `rating` | `INTEGER` | Integer rating from 1 to 10 |
| `release_year` | `INTEGER` | Release year |
| `cover_url` | `TEXT` | Cover URL |
| `created_at` | `TEXT` | Creation timestamp |
| `updated_at` | `TEXT` | Last update timestamp |

SQLite does not require a dedicated `YEAR` or `DATETIME` type for this project. Therefore, the release year is stored as `INTEGER`, while timestamps are stored as `TEXT`.

---

## 3.3. Defining the PRIMARY KEY

The `id` field is used as the primary key:

```sql
id INTEGER PRIMARY KEY
```

The `id` must be:

- unique;
- stable during the lifetime of the record;
- the main identifier of a game;
- used to address a specific game through the REST API.

Examples:

```text
GET /api/games/1
PUT /api/games/1
DELETE /api/games/1
```

SQLite manages `INTEGER PRIMARY KEY` values automatically, so the backend does not need to generate IDs manually.

---

## 3.4. Defining Required and Optional Fields

### Required fields

Every game record must contain:

```text
title
genre
platform
status
release_year
created_at
updated_at
```

These fields use `NOT NULL`.

```sql
title TEXT NOT NULL,
genre TEXT NOT NULL,
platform TEXT NOT NULL,
status TEXT NOT NULL,
release_year INTEGER NOT NULL,
created_at TEXT NOT NULL,
updated_at TEXT NOT NULL
```

### Optional fields

The following fields may be omitted:

```text
description
rating
cover_url
```

The `rating` field can be `NULL` when the user has not rated the game yet.

---

## 3.5. Defining Allowed `status` Values

GameVault v1.0 uses four statuses:

```text
Backlog
Playing
Completed
Dropped
```

### `Backlog`

The game has been added to the library, but the user has not started it yet.

### `Playing`

The user is currently playing the game.

### `Completed`

The user has completed the game.

### `Dropped`

The user started the game but decided not to continue playing it.

Main workflow:

```text
Backlog
   ↓
Playing
   ↓
Completed
```

Alternative workflow:

```text
Backlog
   ↓
Playing
   ↓
Dropped
```

Database constraint:

```sql
status TEXT NOT NULL
    CHECK (status IN ('Backlog', 'Playing', 'Completed', 'Dropped'))
```

The backend must also validate the status and return `400 Bad Request` for an invalid value.

---

## 3.6. Defining Rules for `rating`

The `rating` field represents the user's personal rating of a game.

```sql
rating INTEGER
```

Allowed values:

```text
1–10
```

The rating is optional:

```text
rating = NULL
```

`0` is not used to represent an unrated game.

Database constraint:

```sql
rating INTEGER
    CHECK (rating IS NULL OR rating BETWEEN 1 AND 10)
```

Validation:

```text
rating
   │
   ├── NULL       → valid
   ├── 1–10       → valid
   └── everything else → invalid
```

The backend must validate the rating and return `400 Bad Request` for invalid values.

The frontend should use:

```html
<input
    type="number"
    name="rating"
    min="1"
    max="10"
>
```

`NULL` values must not be included when calculating the average library rating.

Example:

```text
Cyberpunk 2077 → 9
Minecraft → 8
Red Dead Redemption 2 → 10
Unrated Game → NULL
```

Average:

```text
(9 + 8 + 10) / 3 = 9
```

---

## 3.7. Defining Rules for `release_year`

The `release_year` field stores the year in which the game was released.

```sql
release_year INTEGER NOT NULL
```

The supported range is:

```text
1970 ≤ release_year ≤ current year
```

Examples of valid values in 2026:

```text
1970 → valid
1985 → valid
2000 → valid
2011 → valid
2020 → valid
2026 → valid
```

Invalid values:

```text
1969   → invalid
1500   → invalid
0      → invalid
-10    → invalid
9999   → invalid
2020.5 → invalid
```

SQLite provides the lower-bound constraint:

```sql
release_year INTEGER NOT NULL
    CHECK (release_year >= 1970)
```

The backend validates the upper bound dynamically:

```javascript
const currentYear = new Date().getFullYear();

if (
    !Number.isInteger(releaseYear) ||
    releaseYear < 1970 ||
    releaseYear > currentYear
) {
    // 400 Bad Request
}
```

Frontend:

```html
<input
    type="number"
    name="release_year"
    min="1970"
    step="1"
    required
>
```

The field can also be used for sorting:

```sql
ORDER BY release_year DESC
```

---

## 3.8. Defining Rules for `genre` and `platform`

Both fields are required:

```sql
genre TEXT NOT NULL,
platform TEXT NOT NULL
```

### `genre`

Examples:

```text
RPG
Action
Adventure
Strategy
Simulation
Sports
Racing
Horror
Puzzle
Platformer
```

For v1.0, genres are not stored in a separate database table.

A strict SQL whitelist is not used because video game genres can be combined or extended.

Examples:

```text
Action RPG
Survival Horror
```

The backend validates that:

- the value exists;
- the value is a string;
- the value is not empty;
- the value does not exceed 50 characters.

### `platform`

Examples:

```text
PC
PlayStation 5
PlayStation 4
Xbox Series X|S
Xbox One
Nintendo Switch
```

Platforms are also stored directly as text.

A strict SQL whitelist is not used because new platforms may appear in the future.

The backend validates that:

- the value exists;
- the value is a string;
- the value is not empty;
- the value does not exceed 50 characters.

Filtering is supported:

```text
GET /api/games?genre=RPG
GET /api/games?platform=PC
```

Combined filtering:

```text
GET /api/games?genre=RPG&platform=PC
```

For v1.0, each game has one genre and one platform.

Separate tables such as:

```text
genres
platforms
game_genres
game_platforms
```

are outside the scope of v1.0.

---

## 3.9. Designing Timestamps

GameVault uses two system fields:

```text
created_at
updated_at
```

### `created_at`

Stores the date and time when the game was added.

Example:

```text
2026-09-01 20:15:32
```

This value must not change after creation.

### `updated_at`

Stores the date and time of the last modification.

When a game is created:

```text
created_at → 2026-09-01 20:15:32
updated_at → 2026-09-01 20:15:32
```

After an update:

```text
created_at → 2026-09-01 20:15:32
updated_at → 2026-09-01 21:03:17
```

Both fields use:

```sql
created_at TEXT NOT NULL,
updated_at TEXT NOT NULL
```

Timestamp format:

```text
YYYY-MM-DD HH:MM:SS
```

Timestamps are stored in UTC.

The frontend may convert them to the user's local time for display.

### Creating a game

The client does not provide `created_at` or `updated_at`.

The backend generates both timestamps when creating a record.

```text
POST /api/games
       ↓
Backend generates timestamps
       ↓
SQLite
```

### Updating a game

When a game is updated:

```text
created_at → unchanged
updated_at → current timestamp
```

### Deleting a game

When a game is deleted, the entire record is removed.

GameVault v1.0 does not use soft deletion and does not include a `deleted_at` field.

### Sorting by date added

`created_at` is used for sorting:

```sql
SELECT *
FROM games
ORDER BY created_at DESC;
```

The newest games appear first.

For v1.0, timestamp management is centralized in the backend/service layer.
