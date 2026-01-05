# 🎓 NAAS CAMPUS - Complete Setup Guide

## 📋 Table of Contents
1. [Supabase Setup](#supabase-setup)
2. [Database Configuration](#database-configuration)
3. [Storage Buckets Setup](#storage-buckets-setup)
4. [Authentication Setup](#authentication-setup)
5. [GitHub Pages Deployment](#github-pages-deployment)
6. [Final Configuration](#final-configuration)
7. [Testing](#testing)
8. [Troubleshooting](#troubleshooting)

---

## 🔥 SUPABASE SETUP

### Step 1: Create Supabase Account
1. Go to [https://supabase.com](https://supabase.com)
2. Click "Start your project"
3. Sign up with GitHub, Google, or Email
4. Verify your email if required

### Step 2: Create New Project
1. Click "New Project"
2. Fill in project details:
   - **Name**: `naas-campus` (or your choice)
   - **Database Password**: Create a strong password (save this!)
   - **Region**: Choose closest to your users
   - **Pricing Plan**: Select "Free"
3. Click "Create new project"
4. Wait 2-3 minutes for setup to complete

### Step 3: Get API Credentials
1. In your project dashboard, go to **Settings** (⚙️ icon)
2. Click **API** in the sidebar
3. Copy these values:
   - **Project URL** (looks like: `https://xxxxx.supabase.co`)
   - **anon/public key** (long string starting with `eyJ...`)
4. **SAVE THESE** - you'll need them soon!

---

## 💾 DATABASE CONFIGURATION

### Step 1: Open SQL Editor
1. In Supabase dashboard, click **SQL Editor** (</> icon)
2. Click "New Query"

### Step 2: Create Tables
Copy and paste this SQL code and click **RUN**:

```sql
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
```

### Step 3: Enable Row Level Security (RLS)
Create a new query and run:

```sql
-- Enable Row Level Security
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE updates ENABLE ROW LEVEL SECURITY;
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;
```

### Step 4: Create Security Policies
Create another query and run:

```sql
-- Public read access for courses
CREATE POLICY "Allow public read access on courses"
ON courses FOR SELECT
TO public
USING (true);

-- Public read access for updates
CREATE POLICY "Allow public read access on updates"
ON updates FOR SELECT
TO public
USING (true);

-- Authenticated users can manage courses
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

-- Authenticated users can manage updates
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

-- Public can submit applications
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
```

✅ **Database setup complete!**

---

## 🗂️ STORAGE BUCKETS SETUP

### Step 1: Create Storage Buckets
1. In Supabase dashboard, click **Storage** (📁 icon)
2. Click "Create a new bucket"
3. Create bucket:
   - **Name**: `course-images`
   - **Public bucket**: ✅ CHECK THIS
   - Click "Create bucket"
4. Repeat for second bucket:
   - **Name**: `update-images`
   - **Public bucket**: ✅ CHECK THIS
   - Click "Create bucket"

### Step 2: Set Bucket Policies
For EACH bucket (`course-images` and `update-images`):

1. Click on the bucket name
2. Click "Policies" tab
3. Click "New Policy"
4. Under "Get started quickly", click "SELECT" template
5. Choose "Allow public access"
6. Click "Review"
7. Click "Save policy"
8. Repeat for INSERT policy:
   - Click "New Policy"
   - Choose "INSERT" template
   - Select "Allow authenticated users only"
   - Click "Review" and "Save policy"

✅ **Storage buckets complete!**

---

## 🔐 AUTHENTICATION SETUP

### Step 1: Configure Email Settings
1. Go to **Authentication** (🔑 icon)
2. Click **Providers**
3. Ensure "Email" is enabled
4. Click **Email Templates**
5. Customize if needed (optional)

### Step 2: Create Admin Account
1. Click **Users** under Authentication
2. Click "Add user"
3. Choose "Create new user"
4. Enter:
   - **Email**: your admin email
   - **Password**: create strong password
   - **Auto Confirm User**: ✅ CHECK THIS
5. Click "Create user"

✅ **Authentication complete!**

---

## 🚀 GITHUB PAGES DEPLOYMENT

### Step 1: Prepare Your Files
1. Download or clone the `naas-campus` folder
2. Make sure you have all files:
   ```
   naas-campus/
   ├── index.html
   ├── about.html
   ├── courses.html
   ├── admission.html
   ├── updates.html
   ├── contact.html
   ├── login.html
   ├── signup.html
   ├── application.html
   ├── admin.html
   ├── css/style.css
   ├── js/
   ├── supabase/
   └── assets/logo.webp
   ```

### Step 2: Update Supabase Configuration
1. Open `supabase/supabase-config.js`
2. Replace with your credentials:
   ```javascript
   const SUPABASE_URL = 'YOUR_PROJECT_URL_HERE';
   const SUPABASE_ANON_KEY = 'YOUR_ANON_KEY_HERE';
   ```
3. Save the file

### Step 3: Add Supabase CDN to HTML Files
Add this script tag BEFORE the closing `</body>` tag in ALL HTML files:

```html
<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
```

**Files to update:**
- index.html
- about.html
- courses.html
- admission.html
- updates.html
- contact.html
- login.html
- signup.html
- application.html
- admin.html

### Step 4: Create GitHub Repository
1. Go to [GitHub](https://github.com)
2. Click "New repository"
3. Name it: `naas-campus` (or your choice)
4. Keep it **Public**
5. Don't initialize with README
6. Click "Create repository"

### Step 5: Upload Files to GitHub
**Option A - Using GitHub Web Interface:**
1. On your repository page, click "uploading an existing file"
2. Drag and drop ALL your files and folders
3. Scroll down and click "Commit changes"

**Option B - Using Git Command Line:**
```bash
cd naas-campus
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/naas-campus.git
git push -u origin main
```

### Step 6: Enable GitHub Pages
1. In your repository, go to **Settings**
2. Scroll down to **Pages** (in sidebar)
3. Under "Source":
   - Branch: `main`
   - Folder: `/ (root)`
4. Click "Save"
5. Wait 1-2 minutes for deployment

### Step 7: Get Your Live URL
Your site will be live at:
```
https://YOUR-USERNAME.github.io/naas-campus/
```

✅ **Deployment complete!**

---

## 🔧 FINAL CONFIGURATION

### Add Your Logo
1. Replace `assets/logo.webp` with your actual campus logo
2. Recommended size: 500x500px, square format
3. Supported formats: .webp, .png, .jpg

### Test Admin Access
1. Go to `https://YOUR-SITE-URL/login.html`
2. Login with admin credentials
3. Verify you can access admin.html
4. Test adding a course or update

### Add Sample Content
1. Login to admin panel
2. Add 2-3 sample courses with images
3. Add 2-3 campus updates
4. Test everything displays correctly

---

## 🧪 TESTING CHECKLIST

### Frontend Testing
- [ ] All pages load correctly
- [ ] Navigation works on desktop
- [ ] Navigation works on mobile
- [ ] Logo displays properly
- [ ] Buttons are clickable
- [ ] Forms are functional

### Course System
- [ ] Courses display on home page
- [ ] Courses display on courses page
- [ ] "More Details" modal works
- [ ] "Apply Now" redirects correctly

### Payment Portal
- [ ] Bank details are copyable
- [ ] Copy buttons show "Copied" feedback
- [ ] WhatsApp button opens with pre-filled message
- [ ] Course dropdown is populated

### Application System
- [ ] Application form submits successfully
- [ ] Data appears in admin panel
- [ ] Email validation works
- [ ] NIC validation works

### Admin Panel
- [ ] Login works
- [ ] Course add/edit/delete works
- [ ] Image upload works
- [ ] Updates add/edit/delete works
- [ ] Applications display
- [ ] Status change works
- [ ] Excel export works
- [ ] Logout works

---

## 🐛 TROUBLESHOOTING

### Issue: "Supabase is not defined"
**Solution:** Make sure you added the Supabase CDN script to ALL HTML files:
```html
<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
```

### Issue: "Images not uploading"
**Solution:**
1. Check storage buckets are public
2. Verify policies allow INSERT for authenticated users
3. Check file size is under 5MB

### Issue: "Can't login to admin"
**Solution:**
1. Verify user exists in Supabase Authentication
2. Check "Auto Confirm User" was enabled
3. Try password reset in Supabase dashboard

### Issue: "Applications not showing"
**Solution:**
1. Check RLS policies are correct
2. Verify you're logged in as admin
3. Check browser console for errors

### Issue: "Excel export not working"
**Solution:**
1. Verify SheetJS CDN is loaded in admin.html
2. Check browser console for errors
3. Try different browser

### Issue: "Mobile menu not working"
**Solution:**
1. Clear browser cache
2. Check JavaScript files are loading
3. Inspect browser console for errors

---

## 📞 SUPPORT

For Supabase issues:
- Docs: https://supabase.com/docs
- Discord: https://discord.supabase.com

For GitHub Pages issues:
- Docs: https://docs.github.com/pages

---

## 🎉 CONGRATULATIONS!

Your NAAS Campus website is now live and fully functional! 

### Next Steps:
1. ✅ Add your real campus logo
2. ✅ Create your courses
3. ✅ Add campus updates
4. ✅ Share the website link
5. ✅ Monitor applications
6. ✅ Customize colors if needed

### Your Website URLs:
- **Main Site**: https://YOUR-USERNAME.github.io/naas-campus/
- **Admin Panel**: https://YOUR-USERNAME.github.io/naas-campus/admin.html
- **Application**: https://YOUR-USERNAME.github.io/naas-campus/application.html
- **Payment**: https://YOUR-USERNAME.github.io/naas-campus/admission.html

---

**Built for NAAS Campus** 🎓
