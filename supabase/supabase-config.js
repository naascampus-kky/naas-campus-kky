/* ══════════════════════════════════════════════════════════
   SUPABASE CONFIGURATION
   Replace with your actual Supabase credentials
   ══════════════════════════════════════════════════════════ */

// Supabase Project Configuration
const SUPABASE_URL = 'https://jbkervhccqsmjwndpppq.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Impia2VydmhjY3FzbWp3bmRwcHBxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc1NzczMjksImV4cCI6MjA4MzE1MzMyOX0.2TNvNHJci4ss6PnuRpyZukOcxkswn7rV4BVQJZSKBHQ';

// Initialize Supabase Client
// Import from CDN in HTML: <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

/* ══════════════════════════════════════════════════════════
   HOW TO GET YOUR CREDENTIALS:
   
   1. Go to https://supabase.com
   2. Sign in or create a free account
   3. Create a new project
   4. Go to Project Settings > API
   5. Copy:
      - Project URL → SUPABASE_URL
      - anon/public key → SUPABASE_ANON_KEY
   
   ══════════════════════════════════════════════════════════ */

/* ══════════════════════════════════════════════════════════
   STORAGE BUCKETS SETUP:
   
   After creating your project, you need to create storage buckets:
   
   1. Go to Storage in Supabase Dashboard
   2. Create two public buckets:
      - 'course-images'
      - 'update-images'
   3. Make them public:
      - Click on bucket > Policies > New Policy
      - Template: Allow public access
      - Apply to SELECT operation
   
   ══════════════════════════════════════════════════════════ */

/* ══════════════════════════════════════════════════════════
   DATABASE TABLES:
   
   Run these SQL commands in SQL Editor (Supabase Dashboard):
   ══════════════════════════════════════════════════════════ */

/*
-- Create courses table
CREATE TABLE courses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    duration TEXT NOT NULL,
    amount NUMERIC NOT NULL,
    image_url TEXT NOT NULL,
    syllabus TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create updates table
CREATE TABLE updates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    image_url TEXT NOT NULL,
    date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create applications table
CREATE TABLE applications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    full_name TEXT NOT NULL,
    nic TEXT NOT NULL,
    age INTEGER NOT NULL,
    gender TEXT NOT NULL,
    email TEXT NOT NULL,
    whatsapp TEXT NOT NULL,
    course TEXT NOT NULL,
    additional_info TEXT,
    applied_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    status TEXT DEFAULT 'Pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE updates ENABLE ROW LEVEL SECURITY;
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Allow public read access on courses"
ON courses FOR SELECT
TO public
USING (true);

CREATE POLICY "Allow public read access on updates"
ON updates FOR SELECT
TO public
USING (true);

-- Create policies for authenticated users (admin) to manage
CREATE POLICY "Allow authenticated users to insert courses"
ON courses FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update courses"
ON courses FOR UPDATE
TO authenticated
USING (true);

CREATE POLICY "Allow authenticated users to delete courses"
ON courses FOR DELETE
TO authenticated
USING (true);

CREATE POLICY "Allow authenticated users to insert updates"
ON updates FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update updates"
ON updates FOR UPDATE
TO authenticated
USING (true);

CREATE POLICY "Allow authenticated users to delete updates"
ON updates FOR DELETE
TO authenticated
USING (true);

-- Allow anyone to submit applications
CREATE POLICY "Allow public to insert applications"
ON applications FOR INSERT
TO public
WITH CHECK (true);

-- Only authenticated users can read applications
CREATE POLICY "Allow authenticated users to read applications"
ON applications FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Allow authenticated users to update applications"
ON applications FOR UPDATE
TO authenticated
USING (true);

CREATE POLICY "Allow authenticated users to delete applications"
ON applications FOR DELETE
TO authenticated
USING (true);
*/

// Export Supabase client
export { supabase };
