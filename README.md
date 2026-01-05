# 🎓 NAAS CAMPUS - Campus Management System

A complete, production-ready campus management website built with Vanilla JavaScript, Supabase Backend, and GitHub Pages hosting.

## 🌟 Features

### Frontend Features
- ✅ **Responsive Design** - Mobile, Tablet, Desktop optimized
- ✅ **Royal Purple Theme** - Premium, professional look
- ✅ **10 Complete Pages** - All linked and functional
- ✅ **Auto-Scrolling Updates** - Smooth vertical scroll animation
- ✅ **Course Catalog** - Dynamic course display with modals
- ✅ **Payment Portal** - Copyable bank details + WhatsApp integration
- ✅ **Online Application** - No login required

### Backend Features (Supabase)
- ✅ **PostgreSQL Database** - Courses, Updates, Applications
- ✅ **Authentication** - Secure student/admin login
- ✅ **Storage** - Image upload for courses and updates
- ✅ **Real-time** - Auto-update content across pages
- ✅ **Row Level Security** - Secure data access

### Admin Panel Features
- ✅ **Course Management** - Add, Edit, Delete courses
- ✅ **Updates Management** - Manage campus announcements
- ✅ **Application Management** - View, Approve, Reject applications
- ✅ **Image Upload** - Direct to Supabase Storage
- ✅ **Excel Export** - Download applications as .xlsx
- ✅ **Secure Access** - Authentication required

## 📁 Project Structure

```
naas-campus/
├── index.html              # Home page
├── about.html              # About campus
├── courses.html            # Courses listing
├── admission.html          # Payment portal
├── updates.html            # Latest updates
├── contact.html            # Contact information
├── login.html              # Student/Admin login
├── signup.html             # Create account
├── application.html        # Online application (no login)
├── admin.html              # Admin dashboard
│
├── css/
│   └── style.css           # Complete styling (Royal Purple theme)
│
├── js/
│   ├── main.js             # Home page & general functions
│   ├── auth.js             # Login & Signup
│   ├── courses.js          # Courses display & modal
│   ├── updates.js          # Updates display
│   ├── payment.js          # Payment + WhatsApp
│   ├── application.js      # Application form
│   └── admin.js            # Admin panel (CRUD + Excel)
│
├── supabase/
│   └── supabase-config.js  # Supabase connection
│
├── assets/
│   └── logo.webp           # Campus logo (replace with yours)
│
├── SETUP_GUIDE.md          # Complete setup instructions
└── README.md               # This file
```

## 🚀 Quick Start

### Prerequisites
- GitHub account
- Supabase account (free)
- Your campus logo (square, .webp/.png)

### Setup Steps

1. **Clone or Download** this repository
2. **Follow SETUP_GUIDE.md** for complete instructions
3. **Key steps:**
   - Create Supabase project
   - Run SQL to create tables
   - Create storage buckets
   - Update `supabase-config.js` with your credentials
   - Deploy to GitHub Pages

**Detailed instructions:** See [SETUP_GUIDE.md](SETUP_GUIDE.md)

## 🛠️ Technologies Used

### Frontend
- HTML5
- CSS3 (No frameworks)
- Vanilla JavaScript (ES6 Modules)
- No inline CSS/JS (Clean code)

### Backend
- **Supabase** (PostgreSQL, Auth, Storage)
- CDN: @supabase/supabase-js@2

### Libraries
- **SheetJS** (Excel export)
- No other dependencies

### Hosting
- GitHub Pages (Free)

## 🎨 Design System

### Colors
- **Primary:** Royal Purple (#6B46C1)
- **Secondary:** White (#FFFFFF)
- **Accent:** Light Purple (#E9D8FD)
- **Text:** Dark Gray (#2D3748)

### UI Elements
- Cards with purple shadows
- Smooth hover animations
- Responsive grid layouts
- Professional typography

## 📱 Features in Detail

### 1. Payment Portal
- Copyable bank account details (Clipboard API)
- Real-time "Copied" feedback
- WhatsApp integration with pre-filled message
- Dynamic course selection

### 2. Online Application
- No login required
- All fields validated
- Stores in Supabase database
- Auto-status: "Pending"

### 3. Admin Dashboard
- **Courses Tab:** Full CRUD operations
- **Updates Tab:** Manage announcements
- **Applications Tab:** Approve/Reject applications
- Image upload to Supabase Storage
- Excel export (SheetJS)

### 4. WhatsApp Integration
Pre-filled message format:
```
Hello NAAS CAMPUS,

Full Name: [User Input]
WhatsApp: [User Input]
Course: [Selected Course]

I have attached my payment proof.
```

### 5. Latest Updates
- Vertical auto-scroll animation
- 1:1 square images
- Pause on hover
- Seamless infinite loop

## 🔒 Security

- Row Level Security (RLS) enabled
- Public can only:
  - View courses and updates
  - Submit applications
- Authenticated users (admin) can:
  - Manage all content
  - View applications
  - Export data

## 📊 Database Schema

### courses
```sql
id, title, description, duration, amount, image_url, syllabus, created_at
```

### updates
```sql
id, title, description, image_url, date, created_at
```

### applications
```sql
id, full_name, nic, age, gender, email, whatsapp, course, 
additional_info, applied_date, status, created_at
```

## 🎯 Contact Information

**NAAS Campus Details** (Update as needed):
- **Phone:** +94 75 150 1603
- **Email:** naaskky@gmail.com
- **Bank:** Commercial Bank
- **Account:** 1000902776
- **Branch:** Kattankudy

## 📝 Customization

### Change Colors
Edit CSS variables in `css/style.css`:
```css
:root {
    --primary-color: #6B46C1;  /* Change this */
    --primary-dark: #553399;   /* And this */
    --primary-light: #8B6DD1;  /* And this */
}
```

### Change Contact Info
Update in ALL relevant HTML files:
- admission.html
- contact.html
- Footer sections

### Add Your Logo
Replace `assets/logo.webp` with your logo (500x500px recommended)

## 🐛 Troubleshooting

See [SETUP_GUIDE.md](SETUP_GUIDE.md#troubleshooting) for common issues and solutions.

## 📄 License

This project is created for NAAS Campus. Customize freely for your institution.

## 🤝 Support

For technical issues:
1. Check SETUP_GUIDE.md
2. Review browser console for errors
3. Verify Supabase configuration
4. Check GitHub Pages deployment status

## 🎉 Credits

Built with ❤️ for NAAS Campus

**Technologies:**
- Supabase (Backend as a Service)
- GitHub Pages (Free Hosting)
- SheetJS (Excel Export)

---

**Ready to launch your campus online!** 🚀

For complete setup instructions, see [SETUP_GUIDE.md](SETUP_GUIDE.md)
