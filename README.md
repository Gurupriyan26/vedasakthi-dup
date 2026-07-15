# Vedasakthi — Tamil Nadu Education Dashboard
### Built for Hon. Minister's Review

---

## What I Built

An **interactive dashboard** that shows education data for all **38 districts of Tamil Nadu** on an interactive map.

When you click any district on the map, it shows 8 key numbers for that district — like how many schools are there, how many teachers are working, and what percentage of schools have electricity, toilets, and computer labs.

Think of it as a **command view** — one screen where you can see the health of school education across the entire state at a glance.

---

## What You Can Do On the Dashboard

- 🗺️ **Click any district** on the Tamil Nadu map to see its details
- 📊 **See 8 key metrics** for each district instantly
- 🔍 **Search** for a district by name using the top search bar
- 📋 **View summary cards** at the top showing state-wide totals

---

## The 8 Metrics Tracked

| Metric | What It Means |
|--------|--------------|
| **Total Schools** | How many schools are in the district |
| **Attendance** | What % of students attend school regularly |
| **NEET Qualified** | How many students qualified the NEET exam |
| **Hi-Tech Labs** | How many schools have computer/ICT labs |
| **Teachers Staffed** | How many teachers are deployed |
| **Grid Connect** | What % of schools have electricity |
| **WASH Audited** | What % of schools have clean water & toilets |
| **Active Blocks** | How many education blocks are active |

---

## Current Status

The dashboard is currently running in **Preview Mode** — the structure, map, and all features are fully working, but the district numbers are estimated from official UDISE+ state-level figures (Government of India, 2022-23).

> Once the real district-level figures are confirmed and provided, they will be loaded into the database — **no code change is needed**. The dashboard will immediately show the real numbers.

---

## Where the Data Comes From

| Metric | Source |
|--------|--------|
| Total Schools | UDISE+ 2022-23 — Government of India ([udiseplus.gov.in](https://udiseplus.gov.in)) |
| Hi-Tech Labs | UDISE+ 2022-23 — Infrastructure reports |
| Teachers Staffed | UDISE+ 2022-23 — Teacher data |
| Grid Connect | UDISE+ 2022-23 — Infrastructure reports |
| WASH Audited | UDISE+ 2022-23 — Infrastructure reports |
| Active Blocks | UDISE+ / State admin records |
| **Attendance** | ⚠️ **To be provided by host** — not publicly available at district level |
| **NEET Qualified** | ⚠️ **To be provided by host** — NTA only publishes state-level totals |

---

## How to Run the Project

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Add your Supabase keys** — create a `.env.local` file:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-key
   ```

3. **Set up the database** — run the SQL files in your Supabase SQL Editor:
   * **First**, create the districts table and populate it:
     ```
     supabase/migrations/20260630000000_create_district_table.sql
     ```
   * **Second**, create the metrics table and insert the seed metrics data:
     ```
     supabase/district_metrics.sql
     ```

4. **Start the app**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000)

---

## How to Update the Data (No Code Needed)

The database is designed so that updating district figures requires **no code change at all**.

Simply run an `UPDATE` statement in the Supabase SQL Editor:
```sql
UPDATE district_metrics
SET attendance = 94.50, neet_qualified = 1450
WHERE district_id = (SELECT id FROM districts WHERE district_name = 'Chennai');
```

---

## Built With

| Tool | Purpose |
|------|---------|
| Next.js | Web framework |
| TypeScript | Programming language |
| Supabase | Database (PostgreSQL) |
| Leaflet | Interactive map |
| Tailwind CSS | Styling |
| Vercel | Hosting |

---

*Dashboard built for Day 10 milestone — fully working with real data integration ready.*
