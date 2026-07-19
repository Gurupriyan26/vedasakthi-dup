# Vedasakthi — Tamil Nadu Education Dashboard
### Built for Hon. Minister's Review

---

## Recent Updates & Changes Implemented

Here is a summary of the database updates and UI modifications recently completed:

1. **Integrated Genuine Sourced Data**:
   * Replaced mock/placeholder metrics with **genuine government records** for Tamil Nadu's weekend NEET/JEE coaching centers ("Vetri Palligal").
   * Loaded and mapped **364 confirmed schools** into the database.
2. **Honest Labelling System**:
   * Updated dashboard text state-wide, Leaflet map tooltips, and Recharts charts so that estimated enrolment metrics are clearly labeled as:
     * `"NEET Coaching Enrolment (est.)"`
     * `"JEE Coaching Enrolment (est.)"`
     * `"Total Coaching Enrolment (est.)"`
   * Kept plain labelling for the real school counts as `"NEET/JEE Coaching Schools"`.
3. **Robust Database Mapping**:
   * Resolved district name variations (e.g., matching `"VILLUPURAM"` to `"Viluppuram"`, `"THE NILGIRIS"` to `"Nilgiris"`, `"SIVAGANGAI"` to `"Sivaganga"`, and `"CHENNAI (EXT. GCC)"` to `"Chennai"`) using official LGD codes and district IDs to ensure clean data loading without silent failures.
4. **Milestone 2 Interactive Drill-down**:
   * Built a responsive drill-down interface: selecting any district on the map loads and lists the exact coaching schools in that district, categorized dynamically by **Block Name**.
5. **Mobile Optimization & Responsiveness**:
   * Converted the persistent sidebar metrics list into a sliding **mobile drawer overlay** with full backdrop support.
   * Redesigned the District Profile detail panel into a sliding **Bottom Sheet** on mobile and tablets, complete with premium swipe-handle visuals.
   * Created a collapsible **Mobile Search Overlay** inside the header that slides open full-width for comfortable inputs and returns with a cancel action.
6. **Local Network Exposure**:
   * Updated Next.js development server configuration to bind to `--hostname 0.0.0.0`, allowing instant access from mobile devices on the same local Wi-Fi network.
7. **Official Government Typography**:
   * Swapped generic fonts for **Noto Sans** and **Noto Sans Tamil** to match Government web standard style guidelines for a clean, legible, and official aesthetic.
8. **Light Mode High-Contrast Refinements**:
   * Redesigned card backgrounds (`#f8fafc`), borders (`#e2e8f0`), and accordions in light mode to provide rich, professional contrast and structure.

---

## What I Built

An **interactive dashboard** that shows education data for all **38 districts of Tamil Nadu** on an interactive map.

When you click any district on the map, it shows key numbers for that district — like how many schools are there, student attendance, NEET/JEE coaching centers, and infrastructure status (electricity, toilets, computer labs).

Additionally, clicking a district triggers a **detailed drill-down panel (Milestone 2)** showing the exact list of government weekend-coaching schools ("Vetri Palligal") active within that district, organized by Block > School.

---

## What You Can Do On the Dashboard

* 🗺️ **Click any district** on the Tamil Nadu map to render the metric heatmaps.
* 📊 **View 11 key metrics** for each district instantly across Sidebar and Right Profile Panel.
* 🔍 **Search** for a district using the top search bar (auto-selects when a search matches exactly 1 district).
* 📋 **Interact with distribution charts** (Recharts) floating over the map to view state averages and compare district performance.
* 🏫 **Drill down to school level** to view the genuine list of registered NEET/JEE weekend coaching centers for the selected district.

---

## Sourced Metrics vs. Estimates (Honest Labelling)

To ensure maximum transparency for senior decision-makers, metrics on the dashboard are classified and labeled according to whether they are genuine sourced data or estimated figures.

### 1. Sourced Coaching Metrics ("Vetri Palligal")
We have loaded **genuine Government records** for Tamil Nadu's weekend NEET/JEE coaching centers:
* **NEET/JEE Coaching Schools**: Plainly labeled as the real, confirmed count of coaching schools (364 total state-wide).
* **NEET Coaching Enrolment (est.)**: Labeled clearly as an estimate, computed at 80 students per coaching school.
* **JEE Coaching Enrolment (est.)**: Labeled clearly as an estimate, computed at 80 students per coaching school.
* **Total Coaching Enrolment (est.)**: Labeled clearly as an estimate, computed at 160 students per coaching school.

### 2. General Infrastructure & Academic Metrics
* **Total Schools**, **Active Labs**, **Teachers Staffed**, **Grid Connect**, **Sanitation**, **Active Blocks**: Sourced from official UDISE+ state-level figures (2022-23) mapped to districts.
* **Attendance**: ⚠️ *Marked clearly as placeholder data* as reliable district-level public data is not yet available.
* **NEET Qualified**: Deprecated / placeholders for compatibility.

---

## Database Schema and Setup

The database uses Supabase PostgreSQL. Coaching metrics and school mapping are set up across the following tables:

### 1. Tables Setup
* **`districts`**: Base table containing Tamil Nadu's 38 districts with their official names and LGD codes.
* **`district_metrics`**: General administrative metrics record per district.
* **`vetri_district_metrics`**: Summary coaching metrics per district.
* **`vetri_schools`**: Drill-down mapping table containing all 364 coaching schools linked to their corresponding district and block.

### 2. Migration Execution Order
Apply the migrations in the `supabase/migrations/` directory in this sequence:
1. `20260630000000_create_district_table.sql` - Sets up the districts table.
2. `20260716000000_create_vetri_schools_table.sql` - Creates the schools mapping and seeds the 364 real schools.
3. `20260716000001_create_vetri_district_metrics_table.sql` - Creates and seeds the coaching metrics.

> [!NOTE]
> During SQL insertion and mapping, district name differences between the CSV lists and the reference tables (e.g. `VILLUPURAM` in the CSV maps to ID 37 `Viluppuram` in the DB, `THE NILGIRIS` maps to ID 18 `Nilgiris`, `SIVAGANGAI` to ID 24 `Sivaganga`, and `CHENNAI (EXT. GCC)` to ID 3 `Chennai`) have been fully normalized and matched on district LGD codes/IDs.

---

## How to Run the Project

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Add Supabase keys** — create a `.env.local` file:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000)

---

## Technical Stack

* **Core**: Next.js (TypeScript) & React (React 19)
* **Database**: Supabase (PostgreSQL)
* **Styling**: Tailwind CSS & Vanilla CSS (curated high-contrast dark theme elements)
* **Visuals**: Recharts (distribution overview charts) & React Leaflet (interactive maps)

---

*Vedasakthi Dashboard — Previewing Real Coaching Data Integration & School-level Drill-down.*
