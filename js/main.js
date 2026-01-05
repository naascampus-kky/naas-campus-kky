/* ══════════════════════════════════════════════════════════
   MAIN.JS - General functionality and home page
   ══════════════════════════════════════════════════════════ */

import { supabase } from '../supabase/supabase-config.js';

// Toast notification function
window.showToast = function(message) {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.classList.add('show');
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
};

// Mobile menu toggle
document.addEventListener('DOMContentLoaded', function() {
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    const nav = document.querySelector('.nav');
    
    if (mobileMenuToggle) {
        mobileMenuToggle.addEventListener('click', function() {
            nav.classList.toggle('active');
        });
        
        // Close mobile menu when clicking nav links
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                nav.classList.remove('active');
            });
        });
    }
    
    // Load home page content if on index.html
    if (window.location.pathname.endsWith('index.html') || window.location.pathname.endsWith('/')) {
        loadPopularCourses();
        loadLatestUpdates();
    }
});

// Load popular courses (first 3)
async function loadPopularCourses() {
    const grid = document.getElementById('popularCoursesGrid');
    if (!grid) return;
    
    try {
        const { data: courses, error } = await supabase
            .from('courses')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(3);
        
        if (error) throw error;
        
        if (courses && courses.length > 0) {
            grid.innerHTML = courses.map(course => `
                <div class="card course-card">
                    <img src="${course.image_url}" alt="${course.title}" class="course-image">
                    <h3>${course.title}</h3>
                    <p>${course.description.substring(0, 100)}${course.description.length > 100 ? '...' : ''}</p>
                    <div class="course-info">
                        <span class="course-duration">📅 ${course.duration}</span>
                        <span class="course-amount">LKR ${Number(course.amount).toLocaleString()}</span>
                    </div>
                    <div class="course-buttons">
                        <a href="application.html" class="btn btn-primary">Apply Now</a>
                        <a href="courses.html" class="btn btn-secondary">View All</a>
                    </div>
                </div>
            `).join('');
        } else {
            grid.innerHTML = '<p class="loading">No courses available yet.</p>';
        }
    } catch (error) {
        console.error('Error loading courses:', error);
        grid.innerHTML = '<p class="loading">Error loading courses.</p>';
    }
}

// Load latest updates for auto-scroll
async function loadLatestUpdates() {
    const scrollContainer = document.getElementById('updatesScroll');
    if (!scrollContainer) return;
    
    try {
        const { data: updates, error } = await supabase
            .from('updates')
            .select('*')
            .order('date', { ascending: false })
            .limit(10);
        
        if (error) throw error;
        
        if (updates && updates.length > 0) {
            // Duplicate updates for seamless scroll
            const updatesHTML = updates.map(update => `
                <div class="update-item">
                    <img src="${update.image_url}" alt="${update.title}" class="update-image">
                    <div class="update-content">
                        <h3 class="update-title">${update.title}</h3>
                        <p class="update-description">${update.description}</p>
                        <span class="update-date">${new Date(update.date).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                        })}</span>
                    </div>
                </div>
            `).join('');
            
            // Add updates twice for continuous scroll
            scrollContainer.innerHTML = updatesHTML + updatesHTML;
        } else {
            scrollContainer.innerHTML = '<p class="loading">No updates available yet.</p>';
        }
    } catch (error) {
        console.error('Error loading updates:', error);
        scrollContainer.innerHTML = '<p class="loading">Error loading updates.</p>';
    }
}

// Check authentication status
async function checkAuth() {
    const { data: { session } } = await supabase.auth.getSession();
    return session;
}

// Update login button based on auth status
async function updateAuthUI() {
    const loginBtn = document.querySelector('.btn-login');
    if (!loginBtn) return;
    
    const session = await checkAuth();
    if (session) {
        loginBtn.textContent = 'Dashboard';
        loginBtn.href = 'admin.html';
    }
}

// Initialize auth UI update
updateAuthUI();

// Export functions for use in other modules
export { checkAuth, updateAuthUI };
