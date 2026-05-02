# Face Recognition Attendance System

A production-ready Next.js attendance app using browser-side `face-api.js`, Supabase PostgreSQL, and Supabase Storage. No Python is required.

## Setup

1. Install dependencies:

```bash
npm install
```

2. Create `.env.local` from `.env.example`:

```bash
cp .env.example .env.local
```

3. Fill in:

```env
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET=student-images
NEXT_PUBLIC_FACE_API_MODEL_URL=https://cdn.jsdelivr.net/gh/justadudewhohacks/face-api.js@master/weights
```

4. In Supabase, create the storage bucket `student-images` as public.

5. Run this SQL in Supabase SQL Editor:

```sql
create table if not exists public.students (
  roll_no text primary key,
  name text not null,
  image_url text not null,
  face_descriptor jsonb not null,
  created_at timestamptz default now()
);

create table if not exists public.attendance (
  id uuid primary key default gen_random_uuid(),
  roll_no text not null references public.students(roll_no) on delete cascade,
  date date not null,
  time text not null,
  created_at timestamptz default now(),
  unique (roll_no, date)
);

alter table public.students enable row level security;
alter table public.attendance enable row level security;

create policy "Allow public read students"
on public.students for select
to anon
using (true);

create policy "Allow public insert students"
on public.students for insert
to anon
with check (true);

create policy "Allow public update students"
on public.students for update
to anon
using (true)
with check (true);

create policy "Allow public read attendance"
on public.attendance for select
to anon
using (true);

create policy "Allow public insert attendance"
on public.attendance for insert
to anon
with check (true);
```

6. Storage policies for public bucket upload:

```sql
create policy "Public upload student images"
on storage.objects for insert
to anon
with check (bucket_id = 'student-images');

create policy "Public read student images"
on storage.objects for select
to anon
using (bucket_id = 'student-images');
```

7. Start development:

```bash
npm run dev
```

Open `http://localhost:3000`.

## Notes

- Face recognition runs entirely in the browser.
- Attendance detection is throttled to about one pass every 1.5 seconds.
- Duplicate attendance is prevented both in UI logic and with a database unique constraint on `(roll_no, date)`.
- For production, restrict Supabase RLS policies to authenticated staff/admin users.

## Deploy to GitHub Pages

This app is configured for static export, so GitHub Pages can host the frontend while Supabase stays the database/storage layer.

1. Push the repository to GitHub.
2. In GitHub, open **Settings > Secrets and variables > Actions**.
3. Add repository secrets:

```env
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
```

4. Optional repository variables:

```env
NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET=student-images
NEXT_PUBLIC_FACE_API_MODEL_URL=https://cdn.jsdelivr.net/gh/justadudewhohacks/face-api.js@master/weights
```

5. Open **Settings > Pages** and set **Source** to **GitHub Actions**.
6. Push to `main` or `master`, or run the `Deploy GitHub Pages` workflow manually.

The workflow builds the static site into `out/` and publishes it with the repository name as the base path, for example `/FACE`.
