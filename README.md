# Movie Discovery App

A React + Vite app for discovering movies using the TMDB API, with search, a debounced search bar, and an Appwrite-powered "Trending Movies" section that tracks what people search for most.

## Features

- Browse popular movies (default view)
- Search movies by title with debounced input (no request spam)
- Responsive movie grid (auto-fills columns based on screen width)
- Trending section: shows the top 5 most-searched movies, ranked, backed by an Appwrite database
- Loading spinner and error states

## Tech Stack

- React + Vite
- TMDB API (movie data)
- Appwrite (TablesDB) — tracks search counts for the trending section
- Plain CSS (custom grid/layout, no Tailwind dependency required for core layout)
- `react-use` — for the `useDebounce` hook

## Project Structure

```
src/
├── App.jsx                     # Main app logic, search + fetch + trending state
├── appwrite.js                 # Appwrite client + updateSearchCount / getTrendingMovies
├── index.css                   # Global styles, layout, grid, trending row styles
├── main.jsx                    # React entry point
└── components/
    ├── Search.jsx               # Search input bar
    ├── Spinner.jsx               # Loading spinner
    ├── MovieCard.jsx             # Individual movie card (poster, rating, year, language)
    └── TrendingMovies.jsx        # Top 5 trending movies row
```

## Setup

### 1. Install dependencies

```bash
npm install
npm install appwrite react-use
```

### 2. Environment variables

Create a `.env.local` file in the project root:

```dotenv
VITE_TMDB_API_KEY=your_tmdb_api_read_access_token
VITE_APPWRITE_PROJECT_ID=your_appwrite_project_id
VITE_APPWRITE_PROJECT_NAME=your_project_name
VITE_APPWRITE_ENDPOINT=https://<region>.cloud.appwrite.io/v1
VITE_APPWRITE_DATABASE_ID=your_database_id
VITE_APPWRITE_TABLE_ID=metrics
```

No quotes, no spaces around `=` — Vite reads these as plain strings.

### 3. TMDB API key

Get a Read Access Token from [themoviedb.org](https://www.themoviedb.org/settings/api) (Settings → API → API Read Access Token). This goes in `VITE_TMDB_API_KEY`.

### 4. Appwrite setup

1. Create a project at [cloud.appwrite.io](https://cloud.appwrite.io).
2. Create a **Database**, then inside it create a **Table** named `metrics` (or any name — just match it in `VITE_APPWRITE_TABLE_ID`).
3. Add these columns to the table:

   | Column       | Type    |
   |--------------|---------|
   | `searchTerm` | String  |
   | `count`      | Integer |
   | `movie_id`   | Integer |
   | `poster_url` | String  |

4. **Permissions matter** — since requests come from the browser (unauthenticated), the table needs these permissions set to `Any`:
   - Read
   - Create
   - Update

   Without this, writes will fail silently (caught by try/catch, logged to console).

### 5. Run the app

```bash
npm run dev
```

## How Trending Works

Every time someone searches for a movie and gets at least one result:
1. `updateSearchCount(query, movie)` checks if that search term already has a row in the `metrics` table.
2. If it exists, the `count` is incremented.
3. If not, a new row is created with `count: 1`.

On page load, `getTrendingMovies()` queries the table ordered by `count` descending, limited to 5, and displays them as the top 5 trending row above "All Movies."

## Troubleshooting

- **Trending section never appears**: Check the `metrics` table directly in the Appwrite Console to confirm rows exist. If empty, either no search has been made yet, or a permissions/401 error is being swallowed — check the browser console and Network tab.
- **Grid shows a single column**: Make sure `.wrapper` has an explicit `width: 100%; max-width: ...` in your CSS — a flex parent with `align-items: center` will otherwise shrink-wrap its children instead of giving the grid room to lay out multiple columns.
- **Star icon looks huge or malformed**: Confirm `.movie-card .rating img` has an explicit `width`/`height` in CSS — otherwise the icon renders at its native image size.
