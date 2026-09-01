# 4.1. Backend Architecture Design

## 4.1.1. Purpose

The purpose of this stage is to define the architecture of the GameVault backend, responsibilities of individual components, and the data flow between the REST API and SQLite database.

The backend will use a layered architecture to separate HTTP handling, business logic, data access, and database operations.

---

## 4.1.2. Architecture Approach

The GameVault backend will use a layered architecture.

The main request flow is:

```text
Client
   ↓
REST API
   ↓
Routes
   ↓
Controllers
   ↓
Services
   ↓
Repositories
   ↓
SQLite
```

Each layer has a clearly defined responsibility.

---

## 4.1.3. Routes

Routes define the HTTP endpoints of the application.

Main file:

```text
src/routes/gameRoutes.js
```

Routes are responsible for:

* defining HTTP methods;
* defining URL paths;
* passing requests to the appropriate controller.

The main endpoints are:

```text
GET    /api/games
GET    /api/games/:id
POST   /api/games
PUT    /api/games/:id
DELETE /api/games/:id
```

Routes must not contain SQL queries or business logic.

---

## 4.1.4. Controllers

Controllers handle HTTP requests and responses.

Main file:

```text
src/controllers/gameController.js
```

Controllers are responsible for:

* receiving data from `req`;
* calling the appropriate service;
* creating HTTP responses;
* returning appropriate HTTP status codes.

The basic flow is:

```text
Request
   ↓
Controller
   ↓
Service
   ↓
Response
```

Controllers must not directly access SQLite.

---

## 4.1.5. Service Layer

The service layer contains the business logic of the application.

Main file:

```text
src/services/gameService.js
```

The service layer is responsible for:

* applying business rules;
* validating business-related data;
* preparing data;
* calling the repository layer;
* processing game-related operations.

The general flow is:

```text
gameController
      ↓
gameService
      ↓
gameRepository
```

This separation prevents business logic from being duplicated across different API endpoints.

---

## 4.1.6. Repository Layer

The repository layer is responsible for communication with SQLite.

Main file:

```text
src/repositories/gameRepository.js
```

The repository will contain SQL queries required for:

```text
CREATE
READ
UPDATE
DELETE
```

The planned repository methods are:

```text
gameRepository.getAll()
gameRepository.getById(id)
gameRepository.create(game)
gameRepository.update(id, game)
gameRepository.delete(id)
```

The repository must not contain HTTP-specific logic.

It must not work directly with:

```js
req
res
```

The repository is responsible only for data access.

---

## 4.1.7. Database Layer

The database layer was created during Stage 3.

Current structure:

```text
src/database/
├── connection.js
├── database.js
├── init.js
└── schema.sql
```

The database layer is responsible for:

* creating the SQLite connection;
* initializing the database;
* executing the database schema;
* providing the database connection to the repository layer.

---

## 4.1.8. Application Layer

The `app.js` file is responsible for configuring the Express application.

It will:

* create the Express application;
* configure middleware;
* configure static files;
* register API routes.

The planned structure is:

```js
const express = require('express');

const gameRoutes = require('./routes/gameRoutes');

const app = express();

app.use(express.json());

app.use(express.static('public'));

app.use('/api/games', gameRoutes);

module.exports = app;
```

---

## 4.1.9. Server Layer

The `server.js` file is responsible only for starting the HTTP server.

```text
src/server.js
```

Its responsibility is:

```text
Load application
   ↓
Select PORT
   ↓
Start HTTP server
```

Business logic and SQL queries must not be placed inside `server.js`.

---

## 4.1.10. Planned Backend Structure

After implementing the backend architecture, the project structure should be approximately:

```text
src/
├── app.js
├── server.js
│
├── controllers/
│   └── gameController.js
│
├── routes/
│   └── gameRoutes.js
│
├── services/
│   └── gameService.js
│
├── repositories/
│   └── gameRepository.js
│
└── database/
    ├── connection.js
    ├── database.js
    ├── init.js
    └── schema.sql
```

---

## 4.1.11. Data Flow

For example, when the client sends:

```text
GET /api/games/1
```

the request should follow this flow:

```text
Client
  │
  │ GET /api/games/1
  ↓
gameRoutes
  ↓
gameController
  ↓
gameService
  ↓
gameRepository
  ↓
SQLite
  │
  ↓
gameRepository
  ↓
gameService
  ↓
gameController
  ↓
HTTP Response
  ↓
Client
```

---

## 4.1.12. HTTP Responsibilities

The backend will use the following HTTP status codes:

| Status Code                 | Usage                         |
| --------------------------- | ----------------------------- |
| `200 OK`                    | Successful GET or PUT request |
| `201 Created`               | Successfully created game     |
| `204 No Content`            | Successfully deleted game     |
| `400 Bad Request`           | Invalid request data          |
| `404 Not Found`             | Game does not exist           |
| `500 Internal Server Error` | Unexpected server error       |

---

## 4.1.13. Architectural Rules

The following rules must be followed during backend implementation:

* Routes must not contain business logic.
* Controllers must not execute SQL queries.
* Services must not directly handle HTTP requests or responses.
* Repositories must not depend on HTTP.
* SQL queries must be located in the repository layer.
* A new SQLite connection must not be created for every API request.
* Validation must be implemented at the appropriate backend layer.
* API responses must use JSON.
* Errors must be handled consistently.
* Each layer must have a clearly defined responsibility.

---

## 4.1.14. Result

The GameVault backend architecture is defined as:

```text
┌──────────────┐
│    Client    │
└──────┬───────┘
       ↓
┌──────────────┐
│    Routes    │
└──────┬───────┘
       ↓
┌──────────────┐
│ Controllers  │
└──────┬───────┘
       ↓
┌──────────────┐
│   Services   │
└──────┬───────┘
       ↓
┌──────────────┐
│ Repositories │
└──────┬───────┘
       ↓
┌──────────────┐
│    SQLite    │
└──────────────┘
```

The substage is considered complete when:

* the backend layers are defined;
* responsibilities of each layer are documented;
* the request flow is defined;
* the planned directory structure is established;
* the separation between HTTP, business logic, and database access is clear.
