# GameVault Installation Guide

## Requirements

Before installing GameVault, make sure the following software is
installed:

-   Windows 10 or later
-   Node.js 22.x or compatible modern Node.js version
-   npm
-   Git (optional, for cloning the repository)

GameVault uses Node.js, Express.js, SQLite and better-sqlite3.

## 1. Get the Project

Clone the repository:

``` bash
git clone <repository-url>
cd GameVault
```

Alternatively, extract the GameVault project archive and open a terminal
in the project directory.

## 2. Install Dependencies

Run:

``` bash
npm install
```

This installs the dependencies listed in `package.json`, including:

-   Express.js
-   better-sqlite3
-   Jest
-   Supertest
-   Selenium WebDriver

## 3. Database

GameVault uses SQLite.

The application database is located at:

``` text
src/database/gamevault.db
```

The database schema is defined in:

``` text
src/database/schema.sql
```

The application initializes the database when the server starts.

No separate database server is required.

## 4. Start the Application

Start GameVault with:

``` bash
npm start
```

The server starts on:

``` text
http://localhost:3000
```

Open the address in a web browser.

## 5. Development Mode

For development, use:

``` bash
npm run dev
```

The development server uses Node.js watch mode and automatically
restarts when server-side files change.

## 6. Run Tests

Run the complete Jest test suite:

``` bash
npm test
```

The project contains unit, database, integration and end-to-end tests.

## 7. End-to-End Tests

The E2E tests use Selenium WebDriver.

Chrome and Microsoft Edge are supported.

Run the E2E tests through Jest:

``` bash
npx jest tests/e2e --runInBand
```

Selenium Manager automatically handles the required browser drivers when
supported by the installed browser and Selenium version.

## 8. Browser Compatibility

GameVault has been tested with:

-   Google Chrome
-   Microsoft Edge

The responsive interface has been tested at desktop, tablet and mobile
viewport sizes.

## 9. Production Database

The release version includes:

``` text
src/database/gamevault.db
```

The database contains the GameVault SQLite schema and library data.

Do not delete the database if you want to preserve existing games.

## 10. Troubleshooting

### Port 3000 is already in use

Stop the application currently using port 3000, then run:

``` bash
npm start
```

again.

### Dependencies are missing

Remove the installed dependencies and reinstall them:

``` bash
rmdir /s /q node_modules
npm install
```

If `rmdir` is unavailable in the current shell, delete the
`node_modules` directory manually and run:

``` bash
npm install
```

### better-sqlite3 installation problems

Run:

``` bash
npm rebuild better-sqlite3
```

Then start the application again:

``` bash
npm start
```

If the problem persists, verify that the installed Node.js version is
supported by the installed better-sqlite3 version.

### Browser E2E tests do not start

Verify that Google Chrome or Microsoft Edge is installed and up to date.

Then run:

``` bash
npx jest tests/e2e --runInBand
```

## 11. Stop the Application

Press:

``` text
Ctrl+C
```

in the terminal running the server.

## Quick Start

For an existing GameVault project, the basic installation sequence is:

``` bash
npm install
npm start
```

Then open:

``` text
http://localhost:3000
```

## Version

``` text
GameVault v1.0
```
