# 🔍 QUICK REFERENCE GUIDE

## 📲 WhatsApp Integration Logic

### How it Works
The payment portal uses WhatsApp Web API to send pre-filled messages with payment proof.

### Code Location
File: `js/payment.js`

### Message Format
```javascript
const message = `Hello NAAS CAMPUS,

Full Name: ${fullName}
WhatsApp: ${whatsappNumber}
Course: ${selectedCourse}

I have attached my payment proof.`;
```

### WhatsApp URL Structure
```javascript
const waNumber = '94751501603'; // Remove + and spaces
const encodedMessage = encodeURIComponent(message);
const whatsappURL = `https://wa.me/${waNumber}?text=${encodedMessage}`;
window.open(whatsappURL, '_blank');
```

### Customization
To change WhatsApp number, edit in:
1. `js/payment.js` - Line with `const waNumber`
2. All HTML files with contact info

---

## 📊 Excel Export Logic

### How it Works
Uses SheetJS library to convert JavaScript data to Excel format.

### Code Location
File: `js/admin.js` - Function: `exportToExcel()`

### Process Flow
1. Fetch all applications from Supabase
2. Transform data to flat JSON objects
3. Create Excel worksheet from JSON
4. Add worksheet to workbook
5. Download file with timestamp

### Code Snippet
```javascript
// Fetch data
const { data: applications } = await supabase
    .from('applications')
    .select('*');

// Transform to Excel format
const excelData = applications.map(app => ({
    'Full Name': app.full_name,
    'NIC': app.nic,
    'Age': app.age,
    'Gender': app.gender,
    'Email': app.email,
    'WhatsApp': app.whatsapp,
    'Course': app.course,
    'Additional Info': app.additional_info || 'N/A',
    'Applied Date': new Date(app.applied_date).toLocaleDateString(),
    'Status': app.status
}));

// Create workbook
const wb = XLSX.utils.book_new();
const ws = XLSX.utils.json_to_sheet(excelData);
XLSX.utils.book_append_sheet(wb, ws, 'Applications');

// Download
const filename = `NAAS_Applications_${new Date().toISOString().split('T')[0]}.xlsx`;
XLSX.writeFile(wb, filename);
```

### Required CDN
Add to `admin.html` BEFORE `</body>`:
```html
<script src="https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js"></script>
```

---

## 🖼️ Image Upload Logic

### How it Works
Uploads images directly to Supabase Storage buckets.

### Code Location
File: `js/admin.js` - Function: `uploadImage(file, bucket)`

### Storage Buckets
1. `course-images` - For course images
2. `update-images` - For campus updates

### Upload Process
```javascript
async function uploadImage(file, bucket) {
    // Create unique filename
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
    
    // Upload to Supabase
    const { data, error } = await supabase.storage
        .from(bucket)
        .upload(fileName, file, {
            cacheControl: '3600',
            upsert: false
        });
    
    // Get public URL
    const { data: { publicUrl } } = supabase.storage
        .from(bucket)
        .getPublicUrl(fileName);
    
    return publicUrl;
}
```

### File Naming
Format: `TIMESTAMP_RANDOMSTRING.extension`
Example: `1704723456789_abc123.webp`

---

## 📋 Copy to Clipboard Logic

### How it Works
Uses native Clipboard API for copying text.

### Code Location
File: `js/payment.js` - Function: `setupCopyButtons()`

### Implementation
```javascript
const copyButtons = document.querySelectorAll('.btn-copy');

copyButtons.forEach(button => {
    button.addEventListener('click', function() {
        const targetId = this.getAttribute('data-copy');
        const textElement = document.getElementById(targetId);
        const textToCopy = textElement.textContent;
        
        // Use Clipboard API
        navigator.clipboard.writeText(textToCopy).then(() => {
            showToast('Copied Successfully: ' + textToCopy);
            
            // Visual feedback
            this.textContent = '✓ Copied';
            this.style.background = '#10B981';
            this.style.color = 'white';
            
            setTimeout(() => {
                this.textContent = 'Copy';
                this.style.background = '';
                this.style.color = '';
            }, 2000);
        });
    });
});
```

### HTML Structure
```html
<div class="detail-value">
    <span class="copyable-text" id="accountName">NAAS CAMPUS</span>
    <button class="btn-copy" data-copy="accountName">Copy</button>
</div>
```

---

## 🔄 Auto-Scroll Updates Logic

### How it Works
CSS animation for infinite vertical scroll.

### Code Location
- CSS: `css/style.css`
- JS: `js/main.js` - Function: `loadLatestUpdates()`

### CSS Animation
```css
.updates-scroll {
    animation: scroll 20s linear infinite;
}

@keyframes scroll {
    0% { transform: translateY(0); }
    100% { transform: translateY(-100%); }
}

.updates-scroll:hover {
    animation-play-state: paused;
}
```

### JavaScript (Duplicate for Seamless Loop)
```javascript
// Add updates twice for continuous scroll
scrollContainer.innerHTML = updatesHTML + updatesHTML;
```

### Customization
- **Speed**: Change `20s` in CSS
- **Direction**: Change `translateY` values
- **Pause**: Hover functionality included

---

## 🔐 Authentication Flow

### Login Process
1. User enters email and password
2. Supabase validates credentials
3. If valid, creates session
4. Redirect to admin.html
5. Admin page checks session

### Code
```javascript
// Login
const { data, error } = await supabase.auth.signInWithPassword({
    email: email,
    password: password
});

// Check auth
const { data: { session } } = await supabase.auth.getSession();
if (!session) {
    window.location.href = 'login.html';
}

// Logout
await supabase.auth.signOut();
```

---

## 📊 Database Queries

### Fetch All Courses
```javascript
const { data: courses, error } = await supabase
    .from('courses')
    .select('*')
    .order('created_at', { ascending: false });
```

### Insert Application
```javascript
const { data, error } = await supabase
    .from('applications')
    .insert([{
        full_name: 'John Doe',
        email: 'john@example.com',
        // ... other fields
        status: 'Pending'
    }]);
```

### Update Application Status
```javascript
const { error } = await supabase
    .from('applications')
    .update({ status: 'Approved' })
    .eq('id', applicationId);
```

### Delete Course
```javascript
const { error } = await supabase
    .from('courses')
    .delete()
    .eq('id', courseId);
```

---

## 🎨 Styling Best Practices

### CSS Variables (Easy Customization)
```css
:root {
    --primary-color: #6B46C1;      /* Royal Purple */
    --primary-dark: #553399;       /* Darker Purple */
    --primary-light: #8B6DD1;      /* Lighter Purple */
    --secondary-color: #FFFFFF;    /* White */
    --accent-color: #E9D8FD;       /* Light Purple */
}
```

### Card Shadow Effect
```css
.card {
    box-shadow: 0 4px 20px rgba(107, 70, 193, 0.15);
}

.card:hover {
    box-shadow: 0 8px 30px rgba(107, 70, 193, 0.25);
    transform: translateY(-5px);
}
```

---

## 📱 Responsive Breakpoints

```css
/* Desktop: Default styles */

/* Tablet: 1024px and below */
@media (max-width: 1024px) {
    /* Tablet styles */
}

/* Mobile: 768px and below */
@media (max-width: 768px) {
    /* Mobile styles */
}

/* Small Mobile: 480px and below */
@media (max-width: 480px) {
    /* Small mobile styles */
}
```

---

## 🚨 Error Handling Pattern

### Standard Pattern Used Throughout
```javascript
try {
    const { data, error } = await supabase
        .from('table')
        .operation();
    
    if (error) throw error;
    
    // Success handling
    showToast('Success message');
    
} catch (error) {
    console.error('Operation error:', error);
    showToast('Error: ' + error.message);
}
```

---

## 🔔 Toast Notification

### Global Function
```javascript
function showToast(message) {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.classList.add('show');
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}
```

### CSS
```css
.toast {
    position: fixed;
    bottom: 30px;
    right: 30px;
    background: var(--primary-color);
    color: white;
    padding: 15px 25px;
    border-radius: 12px;
    opacity: 0;
    transform: translateY(100px);
    transition: all 0.3s ease;
}

.toast.show {
    opacity: 1;
    transform: translateY(0);
}
```

---

## 📞 Contact Information Update

### Files to Update
When changing contact details, update:

1. **admission.html** - Payment portal
2. **contact.html** - Contact page
3. **All HTML footers** - Footer section
4. **js/payment.js** - WhatsApp number

### Find & Replace
Search for: `+94 75 150 1603`
Replace with: Your number

Search for: `naaskky@gmail.com`
Replace with: Your email

---

## 🎯 Key File Locations

| Feature | File | Function/Section |
|---------|------|------------------|
| WhatsApp Message | js/payment.js | setupWhatsAppForm() |
| Excel Export | js/admin.js | exportToExcel() |
| Image Upload | js/admin.js | uploadImage() |
| Copy to Clipboard | js/payment.js | setupCopyButtons() |
| Auto Scroll | js/main.js | loadLatestUpdates() |
| Course Modal | js/courses.js | showCourseDetails() |
| Authentication | js/auth.js | setupLogin() / setupSignup() |
| Application Form | js/application.js | setupApplicationForm() |

---

## 💡 Tips & Tricks

### 1. Speed Up Development
- Use browser DevTools
- Check Console for errors
- Use Network tab for API calls

### 2. Testing Locally
- Use Live Server extension (VS Code)
- Or Python: `python -m http.server 8000`

### 3. Debugging Supabase
- Check Supabase logs in dashboard
- Verify RLS policies
- Test queries in SQL Editor

### 4. Performance
- Optimize images (use WebP)
- Limit queries to necessary data
- Use CDN for libraries

### 5. Security
- Never commit API keys to GitHub
- Use environment variables in production
- Keep anon key public-facing only

---

**Quick reference for developers working on NAAS Campus! 📚**
