# VEDA-SAKTHI – Minister's Command View

A production-quality interactive district explorer dashboard for Tamil Nadu Government Schools. Built to view and inspect all 38 districts of Tamil Nadu on an interactive map.

## Tech Stack

* **Frontend:** Next.js (App Router), React, TypeScript
* **Styling:** Tailwind CSS (v4), Vanilla CSS for custom animations
* **Map:** Leaflet, React Leaflet, GeoJSON (Tamil Nadu districts)
* **Backend/DB:** Supabase (PostgreSQL)
* **Deployment:** Vercel

## Features

* **Interactive Map:** Dynamic Leaflet map rendering all 38 Tamil Nadu districts. Clicking a district highlights it and unlocks its profile panel.
* **Premium UI:** Glassmorphism, smooth animations, sidebar details, and a modern "government dashboard" aesthetic.
* **Fallback Mode:** Automatically falls back to local JSON data if the Supabase connection is offline.
* **Loading States:** Skeleton loading screens and map spinners.
* **Error Handling:** Robust error states if data fails to fetch.

## Getting Started

### Prerequisites

1. Node.js (v18 or higher)
2. A Supabase project

### Installation

1. **Clone the repository and install dependencies:**
   ```bash
   npm install
   ```

2. **Configure Environment Variables:**
   Rename `.env.example` to `.env.local` (or create a new `.env.local` file) and add your Supabase credentials:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   ```

### Supabase Setup

The dashboard requires a `district` table.

1. Go to your Supabase project's SQL Editor.
2. Run the migration script located at `supabase/migrations/20260630000000_create_district_table.sql`. This will create the `district` table, set up Row Level Security (RLS) policies, and insert the 38 districts of Tamil Nadu.

### Running the App

Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) (or whichever port is assigned) in your browser.

## Updating the GeoJSON

The district boundaries are loaded from `public/geojson/tamil-nadu-districts.json`. 
If you need more accurate boundaries from an official survey, you can replace this file. Ensure that the `district` property in the GeoJSON features closely matches the `district_name` in your database.
If there are discrepancies, you can update the alias mapping in `src/lib/utils.ts` (`GEOJSON_NAME_ALIASES`).
