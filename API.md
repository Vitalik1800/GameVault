# GameVault REST API

## Overview

GameVault provides a REST API for managing a personal video game
library.

Base URL:

``` text
http://localhost:3000/api
```

The API uses JSON for request and response data.

## Endpoints

  Method   Endpoint                Description
  -------- ----------------------- ------------------------
  GET      `/games`                Get games
  GET      `/games/:id`            Get a game by ID
  POST     `/games`                Create a game
  PUT      `/games/:id`            Update a game
  DELETE   `/games/:id`            Delete a game
  GET      `/games/stats`          Get library statistics
  GET      `/games/wishlist`       Get wishlist games
  PUT      `/games/:id/wishlist`   Update wishlist status

## Get Games

``` http
GET /api/games
```

Returns games from the library.

### Search

``` http
GET /api/games?q=witcher
```

### Filter by Status

``` http
GET /api/games?status=Completed
```

Supported statuses:

``` text
Backlog
Playing
Completed
Dropped
```

### Filter by Genre

``` http
GET /api/games?genre=RPG
```

### Filter by Platform

``` http
GET /api/games?platform=PC
```

### Filter by Minimum Rating

``` http
GET /api/games?rating=9
```

The `rating` parameter represents the minimum rating.

### Sorting

``` http
GET /api/games?sort=rating&order=desc
GET /api/games?sort=title&order=asc
```

Supported sort fields include:

``` text
title
rating
```

Supported order values:

``` text
asc
desc
```

## Get Game by ID

``` http
GET /api/games/:id
```

Example:

``` http
GET /api/games/1
```

Returns a single game.

If the game does not exist, the API returns `404 Not Found`.

## Create Game

``` http
POST /api/games
```

Example request:

``` json
{
  "title": "Cyberpunk 2077",
  "description": "Open-world action RPG",
  "genre": "RPG",
  "platform": "PC",
  "status": "Playing",
  "rating": 9,
  "release_year": 2020,
  "cover_url": "https://example.com/cyberpunk.jpg"
}
```

Required fields:

``` text
title
genre
platform
status
release_year
```

Optional fields:

``` text
description
rating
cover_url
```

Successful creation returns `201 Created`.

## Update Game

``` http
PUT /api/games/:id
```

Example:

``` http
PUT /api/games/1
```

Example request:

``` json
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

Successful update returns `200 OK`.

If the game does not exist, the API returns `404 Not Found`.

## Delete Game

``` http
DELETE /api/games/:id
```

Example:

``` http
DELETE /api/games/1
```

Successful deletion returns `204 No Content`.

If the game does not exist, the API returns `404 Not Found`.

## Statistics

### Get Library Statistics

``` http
GET /api/games/stats
```

Example response:

``` json
{
  "totalGames": 4,
  "averageRating": 9.33,
  "byStatus": {
    "Backlog": 1,
    "Playing": 1,
    "Completed": 2
  },
  "byGenre": {
    "Action-Adventure": 1,
    "RPG": 2,
    "Sandbox": 1
  },
  "byPlatform": {
    "PC": 4
  }
}
```

## Wishlist

### Get Wishlist

``` http
GET /api/games/wishlist
```

Returns all games currently in the wishlist.

### Update Wishlist Status

``` http
PUT /api/games/:id/wishlist
```

Add a game to the wishlist:

``` json
{
  "isWishlist": true
}
```

Remove a game from the wishlist:

``` json
{
  "isWishlist": false
}
```

Successful update returns `200 OK`.

## Validation

The API validates incoming game data.

Validation includes:

-   Required title
-   Required genre
-   Required platform
-   Valid status
-   Rating range
-   Release year range
-   Cover URL format

Rating must be between `0` and `10`.

Release year must be between `1950` and the current year.

When provided, `cover_url` must be a valid URL.

## HTTP Status Codes

  Status                        Meaning
  ----------------------------- --------------------------------
  `200 OK`                      Request completed successfully
  `201 Created`                 Game successfully created
  `204 No Content`              Game successfully deleted
  `400 Bad Request`             Invalid request data
  `404 Not Found`               Requested game does not exist
  `500 Internal Server Error`   Unexpected server error

## Error Responses

Errors are returned as JSON.

Example validation error:

``` json
{
  "error": {
    "message": "Validation failed",
    "details": [
      "Title is required"
    ]
  }
}
```

## Data Model

The `games` table contains:

  Field            Description
  ---------------- --------------------------
  `id`             Unique game identifier
  `title`          Game title
  `description`    Game description
  `genre`          Game genre
  `platform`       Game platform
  `status`         Current game status
  `rating`         Rating from 0 to 10
  `release_year`   Game release year
  `cover_url`      Optional cover image URL
  `is_wishlist`    Wishlist flag
  `created_at`     Creation timestamp
  `updated_at`     Last update timestamp

## Architecture

API request flow:

``` text
Client
   ↓
Routes
   ↓
Middleware
   ↓
Controllers
   ↓
Validation
   ↓
Services
   ↓
Repositories
   ↓
SQLite
```

The API is implemented using Express.js.

SQLite access is handled through `better-sqlite3`.

## Version

``` text
GameVault REST API v1.0
```
