/* ══════════════════════════════════════════════════════════
   ADMIN.JS - Complete admin dashboard with CRUD operations
   ══════════════════════════════════════════════════════════ */

import { supabase } from '../supabase/supabase-config.js';

let currentEditingCourse = null;
let currentEditingUpdate = null;

document.addEventListener('DOMContentLoaded', async function() {
    // Check authentication
    await checkAuthentication();
    
    // Setup tabs
    setupTabs();
    
    // Setup modals
    setupModals();
    
    // Load initial data
    loadCourses();
    loadUpdates();
    loadApplications();
    
    // Setup logout
    setupLogout();
    
    // Display admin email
    displayAdminEmail();
});

// Check if user is authenticated
async function checkAuthentication() {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
        window.location.href = 'login.html';
        return;
    }
}

// Display admin email
async function displayAdminEmail() {
    const { data: { user } } = await supabase.auth.getUser();
    const emailSpan = document.getElementById('adminEmail');
    if (user && emailSpan) {
        emailSpan.textContent = user.email;
    }
}

// Setup logout
function setupLogout() {
    const logoutBtn = document.getElementById('logoutBtn');
    logoutBtn.addEventListener('click', async () => {
        const { error } = await supabase.auth.signOut();
        if (!error) {
            window.location.href = 'login.html';
        }
    });
}

// Setup tabs
function setupTabs() {
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all
            tabBtns.forEach(b => b.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));
            
            // Add active to clicked
            btn.classList.add('active');
            const tabName = btn.getAttribute('data-tab');
            document.getElementById(`${tabName}Tab`).classList.add('active');
        });
    });
}

// Setup modals
function setupModals() {
    // Course modal
    const courseModal = document.getElementById('courseModal');
    const addCourseBtn = document.getElementById('addCourseBtn');
    const cancelCourseBtn = document.getElementById('cancelCourseBtn');
    const courseForm = document.getElementById('courseForm');
    const closeModals = document.querySelectorAll('.close-modal');
    
    addCourseBtn.addEventListener('click', () => {
        openCourseModal();
    });
    
    cancelCourseBtn.addEventListener('click', () => {
        courseModal.classList.remove('show');
        courseForm.reset();
        currentEditingCourse = null;
    });
    
    courseForm.addEventListener('submit', handleCourseSave);
    
    // Update modal
    const updateModal = document.getElementById('updateModal');
    const addUpdateBtn = document.getElementById('addUpdateBtn');
    const cancelUpdateBtn = document.getElementById('cancelUpdateBtn');
    const updateForm = document.getElementById('updateForm');
    
    addUpdateBtn.addEventListener('click', () => {
        openUpdateModal();
    });
    
    cancelUpdateBtn.addEventListener('click', () => {
        updateModal.classList.remove('show');
        updateForm.reset();
        currentEditingUpdate = null;
    });
    
    updateForm.addEventListener('submit', handleUpdateSave);
    
    // Close on X button
    closeModals.forEach(btn => {
        btn.addEventListener('click', () => {
            courseModal.classList.remove('show');
            updateModal.classList.remove('show');
        });
    });
    
    // Close on outside click
    [courseModal, updateModal].forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('show');
            }
        });
    });
    
    // Excel export
    const exportBtn = document.getElementById('exportExcelBtn');
    exportBtn.addEventListener('click', exportToExcel);
}

/* ══════════════════════════════════════════════════════════
   COURSES MANAGEMENT
   ══════════════════════════════════════════════════════════ */

// Load all courses
async function loadCourses() {
    const tbody = document.getElementById('coursesTableBody');
    
    try {
        const { data: courses, error } = await supabase
            .from('courses')
            .select('*')
            .order('created_at', { ascending: false });
        
        if (error) throw error;
        
        if (courses && courses.length > 0) {
            tbody.innerHTML = courses.map(course => `
                <tr>
                    <td><img src="${course.image_url}" alt="${course.title}"></td>
                    <td>${course.title}</td>
                    <td>${course.duration}</td>
                    <td>LKR ${Number(course.amount).toLocaleString()}</td>
                    <td>
                        <button class="btn btn-primary btn-sm" onclick="editCourse('${course.id}')">Edit</button>
                        <button class="btn btn-secondary btn-sm" onclick="deleteCourse('${course.id}', '${course.title}')">Delete</button>
                    </td>
                </tr>
            `).join('');
        } else {
            tbody.innerHTML = '<tr><td colspan="5" class="loading">No courses yet. Click "Add New Course" to create one.</td></tr>';
        }
    } catch (error) {
        console.error('Error loading courses:', error);
        tbody.innerHTML = '<tr><td colspan="5" class="loading">Error loading courses.</td></tr>';
    }
}

// Open course modal (add or edit)
function openCourseModal(course = null) {
    const modal = document.getElementById('courseModal');
    const modalTitle = document.getElementById('courseModalTitle');
    const form = document.getElementById('courseForm');
    
    form.reset();
    document.getElementById('currentImage').style.display = 'none';
    
    if (course) {
        modalTitle.textContent = 'Edit Course';
        document.getElementById('courseId').value = course.id;
        document.getElementById('courseTitle').value = course.title;
        document.getElementById('courseDescription').value = course.description;
        document.getElementById('courseDuration').value = course.duration;
        document.getElementById('courseAmount').value = course.amount;
        document.getElementById('courseSyllabus').value = course.syllabus;
        
        // Show current image
        if (course.image_url) {
            document.getElementById('currentImage').style.display = 'block';
            document.getElementById('currentImagePreview').src = course.image_url;
        }
        
        // Make image optional for editing
        document.getElementById('courseImage').removeAttribute('required');
        currentEditingCourse = course;
    } else {
        modalTitle.textContent = 'Add New Course';
        document.getElementById('courseImage').setAttribute('required', 'required');
        currentEditingCourse = null;
    }
    
    modal.classList.add('show');
}

// Make openCourseModal global for onclick
window.editCourse = async function(courseId) {
    try {
        const { data: course, error } = await supabase
            .from('courses')
            .select('*')
            .eq('id', courseId)
            .single();
        
        if (error) throw error;
        openCourseModal(course);
    } catch (error) {
        console.error('Error loading course:', error);
        showToast('Error loading course details');
    }
};

// Handle course save (add or update)
async function handleCourseSave(e) {
    e.preventDefault();
    
    const saveBtn = document.getElementById('saveCourseBtn');
    const btnText = saveBtn.querySelector('.btn-text');
    const btnLoader = saveBtn.querySelector('.btn-loader');
    
    // Show loading
    btnText.style.display = 'none';
    btnLoader.style.display = 'inline';
    saveBtn.disabled = true;
    
    try {
        const courseId = document.getElementById('courseId').value;
        const title = document.getElementById('courseTitle').value;
        const description = document.getElementById('courseDescription').value;
        const duration = document.getElementById('courseDuration').value;
        const amount = parseFloat(document.getElementById('courseAmount').value);
        const syllabus = document.getElementById('courseSyllabus').value;
        const imageFile = document.getElementById('courseImage').files[0];
        
        let imageUrl = currentEditingCourse ? currentEditingCourse.image_url : null;
        
        // Upload image if new file selected
        if (imageFile) {
            imageUrl = await uploadImage(imageFile, 'course-images');
        }
        
        if (!imageUrl) {
            throw new Error('Image is required');
        }
        
        const courseData = {
            title,
            description,
            duration,
            amount,
            syllabus,
            image_url: imageUrl
        };
        
        if (courseId) {
            // Update existing course
            const { error } = await supabase
                .from('courses')
                .update(courseData)
                .eq('id', courseId);
            
            if (error) throw error;
            showToast('Course updated successfully!');
        } else {
            // Insert new course
            const { error } = await supabase
                .from('courses')
                .insert([courseData]);
            
            if (error) throw error;
            showToast('Course added successfully!');
        }
        
        // Close modal and refresh
        document.getElementById('courseModal').classList.remove('show');
        document.getElementById('courseForm').reset();
        loadCourses();
        
    } catch (error) {
        console.error('Error saving course:', error);
        showToast('Error: ' + error.message);
    } finally {
        // Reset button
        btnText.style.display = 'inline';
        btnLoader.style.display = 'none';
        saveBtn.disabled = false;
    }
}

// Delete course
window.deleteCourse = async function(courseId, courseTitle) {
    if (!confirm(`Are you sure you want to delete "${courseTitle}"?`)) {
        return;
    }
    
    try {
        const { error } = await supabase
            .from('courses')
            .delete()
            .eq('id', courseId);
        
        if (error) throw error;
        
        showToast('Course deleted successfully');
        loadCourses();
    } catch (error) {
        console.error('Error deleting course:', error);
        showToast('Error deleting course');
    }
};

/* ══════════════════════════════════════════════════════════
   UPDATES MANAGEMENT
   ══════════════════════════════════════════════════════════ */

// Load all updates
async function loadUpdates() {
    const tbody = document.getElementById('updatesTableBody');
    
    try {
        const { data: updates, error } = await supabase
            .from('updates')
            .select('*')
            .order('date', { ascending: false });
        
        if (error) throw error;
        
        if (updates && updates.length > 0) {
            tbody.innerHTML = updates.map(update => `
                <tr>
                    <td><img src="${update.image_url}" alt="${update.title}"></td>
                    <td>${update.title}</td>
                    <td>${new Date(update.date).toLocaleDateString()}</td>
                    <td>
                        <button class="btn btn-primary btn-sm" onclick="editUpdate('${update.id}')">Edit</button>
                        <button class="btn btn-secondary btn-sm" onclick="deleteUpdate('${update.id}', '${update.title}')">Delete</button>
                    </td>
                </tr>
            `).join('');
        } else {
            tbody.innerHTML = '<tr><td colspan="4" class="loading">No updates yet. Click "Add New Update" to create one.</td></tr>';
        }
    } catch (error) {
        console.error('Error loading updates:', error);
        tbody.innerHTML = '<tr><td colspan="4" class="loading">Error loading updates.</td></tr>';
    }
}

// Open update modal
function openUpdateModal(update = null) {
    const modal = document.getElementById('updateModal');
    const modalTitle = document.getElementById('updateModalTitle');
    const form = document.getElementById('updateForm');
    
    form.reset();
    document.getElementById('currentUpdateImage').style.display = 'none';
    
    if (update) {
        modalTitle.textContent = 'Edit Update';
        document.getElementById('updateId').value = update.id;
        document.getElementById('updateTitle').value = update.title;
        document.getElementById('updateDescription').value = update.description;
        
        // Show current image
        if (update.image_url) {
            document.getElementById('currentUpdateImage').style.display = 'block';
            document.getElementById('currentUpdateImagePreview').src = update.image_url;
        }
        
        document.getElementById('updateImage').removeAttribute('required');
        currentEditingUpdate = update;
    } else {
        modalTitle.textContent = 'Add New Update';
        document.getElementById('updateImage').setAttribute('required', 'required');
        currentEditingUpdate = null;
    }
    
    modal.classList.add('show');
}

// Edit update
window.editUpdate = async function(updateId) {
    try {
        const { data: update, error } = await supabase
            .from('updates')
            .select('*')
            .eq('id', updateId)
            .single();
        
        if (error) throw error;
        openUpdateModal(update);
    } catch (error) {
        console.error('Error loading update:', error);
        showToast('Error loading update details');
    }
};

// Handle update save
async function handleUpdateSave(e) {
    e.preventDefault();
    
    const saveBtn = document.getElementById('saveUpdateBtn');
    const btnText = saveBtn.querySelector('.btn-text');
    const btnLoader = saveBtn.querySelector('.btn-loader');
    
    btnText.style.display = 'none';
    btnLoader.style.display = 'inline';
    saveBtn.disabled = true;
    
    try {
        const updateId = document.getElementById('updateId').value;
        const title = document.getElementById('updateTitle').value;
        const description = document.getElementById('updateDescription').value;
        const imageFile = document.getElementById('updateImage').files[0];
        
        let imageUrl = currentEditingUpdate ? currentEditingUpdate.image_url : null;
        
        if (imageFile) {
            imageUrl = await uploadImage(imageFile, 'update-images');
        }
        
        if (!imageUrl) {
            throw new Error('Image is required');
        }
        
        const updateData = {
            title,
            description,
            image_url: imageUrl,
            date: new Date().toISOString()
        };
        
        if (updateId) {
            const { error } = await supabase
                .from('updates')
                .update(updateData)
                .eq('id', updateId);
            
            if (error) throw error;
            showToast('Update modified successfully!');
        } else {
            const { error } = await supabase
                .from('updates')
                .insert([updateData]);
            
            if (error) throw error;
            showToast('Update added successfully!');
        }
        
        document.getElementById('updateModal').classList.remove('show');
        document.getElementById('updateForm').reset();
        loadUpdates();
        
    } catch (error) {
        console.error('Error saving update:', error);
        showToast('Error: ' + error.message);
    } finally {
        btnText.style.display = 'inline';
        btnLoader.style.display = 'none';
        saveBtn.disabled = false;
    }
}

// Delete update
window.deleteUpdate = async function(updateId, updateTitle) {
    if (!confirm(`Are you sure you want to delete "${updateTitle}"?`)) {
        return;
    }
    
    try {
        const { error } = await supabase
            .from('updates')
            .delete()
            .eq('id', updateId);
        
        if (error) throw error;
        
        showToast('Update deleted successfully');
        loadUpdates();
    } catch (error) {
        console.error('Error deleting update:', error);
        showToast('Error deleting update');
    }
};

/* ══════════════════════════════════════════════════════════
   IMAGE UPLOAD TO SUPABASE STORAGE
   ══════════════════════════════════════════════════════════ */

async function uploadImage(file, bucket) {
    try {
        // Create unique filename
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
        const filePath = fileName;
        
        // Upload to Supabase Storage
        const { data, error } = await supabase.storage
            .from(bucket)
            .upload(filePath, file, {
                cacheControl: '3600',
                upsert: false
            });
        
        if (error) throw error;
        
        // Get public URL
        const { data: { publicUrl } } = supabase.storage
            .from(bucket)
            .getPublicUrl(filePath);
        
        return publicUrl;
    } catch (error) {
        console.error('Error uploading image:', error);
        throw new Error('Failed to upload image: ' + error.message);
    }
}

/* ══════════════════════════════════════════════════════════
   APPLICATIONS MANAGEMENT
   ══════════════════════════════════════════════════════════ */

// Load all applications
async function loadApplications() {
    const tbody = document.getElementById('applicationsTableBody');
    
    try {
        const { data: applications, error } = await supabase
            .from('applications')
            .select('*')
            .order('applied_date', { ascending: false });
        
        if (error) throw error;
        
        if (applications && applications.length > 0) {
            tbody.innerHTML = applications.map(app => `
                <tr>
                    <td>${app.full_name}</td>
                    <td>${app.email}</td>
                    <td>${app.whatsapp}</td>
                    <td>${app.course}</td>
                    <td>${new Date(app.applied_date).toLocaleDateString()}</td>
                    <td><span class="status-badge status-${app.status.toLowerCase()}">${app.status}</span></td>
                    <td>
                        ${app.status === 'Pending' ? `
                            <button class="btn btn-primary btn-sm" onclick="updateApplicationStatus('${app.id}', 'Approved')">Approve</button>
                            <button class="btn btn-secondary btn-sm" onclick="updateApplicationStatus('${app.id}', 'Rejected')">Reject</button>
                        ` : `
                            <button class="btn btn-secondary btn-sm" onclick="updateApplicationStatus('${app.id}', 'Pending')">Reset</button>
                        `}
                    </td>
                </tr>
            `).join('');
        } else {
            tbody.innerHTML = '<tr><td colspan="7" class="loading">No applications yet.</td></tr>';
        }
    } catch (error) {
        console.error('Error loading applications:', error);
        tbody.innerHTML = '<tr><td colspan="7" class="loading">Error loading applications.</td></tr>';
    }
}

// Update application status
window.updateApplicationStatus = async function(appId, newStatus) {
    try {
        const { error } = await supabase
            .from('applications')
            .update({ status: newStatus })
            .eq('id', appId);
        
        if (error) throw error;
        
        showToast(`Application ${newStatus.toLowerCase()}!`);
        loadApplications();
    } catch (error) {
        console.error('Error updating application:', error);
        showToast('Error updating application status');
    }
};

/* ══════════════════════════════════════════════════════════
   EXCEL EXPORT (Using SheetJS)
   ══════════════════════════════════════════════════════════ */

async function exportToExcel() {
    try {
        const { data: applications, error } = await supabase
            .from('applications')
            .select('*')
            .order('applied_date', { ascending: false });
        
        if (error) throw error;
        
        if (!applications || applications.length === 0) {
            showToast('No applications to export');
            return;
        }
        
        // Prepare data for Excel
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
        
        // Create workbook and worksheet
        const wb = XLSX.utils.book_new();
        const ws = XLSX.utils.json_to_sheet(excelData);
        
        // Add worksheet to workbook
        XLSX.utils.book_append_sheet(wb, ws, 'Applications');
        
        // Generate filename with timestamp
        const filename = `NAAS_Applications_${new Date().toISOString().split('T')[0]}.xlsx`;
        
        // Write file
        XLSX.writeFile(wb, filename);
        
        showToast('Excel file downloaded successfully!');
    } catch (error) {
        console.error('Error exporting to Excel:', error);
        showToast('Error exporting to Excel');
    }
}

/* ══════════════════════════════════════════════════════════
   UTILITY FUNCTIONS
   ══════════════════════════════════════════════════════════ */

function showToast(message) {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.classList.add('show');
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}
