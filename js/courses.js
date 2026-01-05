/* ══════════════════════════════════════════════════════════
   COURSES.JS - Display courses and handle details modal
   ══════════════════════════════════════════════════════════ */

import { supabase } from '../supabase/supabase-config.js';

document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu
    setupMobileMenu();
    
    // Load all courses
    loadCourses();
    
    // Setup modal
    setupModal();
});

// Mobile menu setup
function setupMobileMenu() {
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    const nav = document.querySelector('.nav');
    
    if (mobileMenuToggle) {
        mobileMenuToggle.addEventListener('click', () => {
            nav.classList.toggle('active');
        });
    }
}

// Load all courses
async function loadCourses() {
    const grid = document.getElementById('coursesGrid');
    if (!grid) return;
    
    try {
        const { data: courses, error } = await supabase
            .from('courses')
            .select('*')
            .order('created_at', { ascending: false });
        
        if (error) throw error;
        
        if (courses && courses.length > 0) {
            grid.innerHTML = courses.map(course => `
                <div class="card course-card">
                    <img src="${course.image_url}" alt="${course.title}" class="course-image">
                    <h3>${course.title}</h3>
                    <p>${course.description}</p>
                    <div class="course-info">
                        <span class="course-duration">📅 ${course.duration}</span>
                        <span class="course-amount">LKR ${Number(course.amount).toLocaleString()}</span>
                    </div>
                    <div class="course-buttons">
                        <a href="application.html" class="btn btn-primary">Apply Now</a>
                        <button class="btn btn-secondary" onclick="showCourseDetails('${course.id}')">More Details</button>
                    </div>
                </div>
            `).join('');
        } else {
            grid.innerHTML = '<p class="loading">No courses available at the moment. Please check back later.</p>';
        }
    } catch (error) {
        console.error('Error loading courses:', error);
        grid.innerHTML = '<p class="loading">Error loading courses. Please try again later.</p>';
    }
}

// Show course details in modal
window.showCourseDetails = async function(courseId) {
    const modal = document.getElementById('courseModal');
    const detailsContainer = document.getElementById('courseDetails');
    
    try {
        const { data: course, error } = await supabase
            .from('courses')
            .select('*')
            .eq('id', courseId)
            .single();
        
        if (error) throw error;
        
        detailsContainer.innerHTML = `
            <img src="${course.image_url}" alt="${course.title}" class="course-image">
            <h2>${course.title}</h2>
            <div class="course-info">
                <span class="course-duration">📅 Duration: ${course.duration}</span>
                <span class="course-amount">💰 Fee: LKR ${Number(course.amount).toLocaleString()}</span>
            </div>
            <div class="syllabus-section">
                <h3>Course Details</h3>
                <p>${course.description}</p>
            </div>
            <div class="syllabus-section">
                <h3>Complete Syllabus & Information</h3>
                <p>${course.syllabus}</p>
            </div>
            <div style="margin-top: 25px; display: flex; gap: 15px;">
                <a href="application.html" class="btn btn-primary" style="flex: 1;">Apply for This Course</a>
                <a href="admission.html" class="btn btn-secondary" style="flex: 1;">Payment Portal</a>
            </div>
        `;
        
        modal.classList.add('show');
    } catch (error) {
        console.error('Error loading course details:', error);
        showToast('Error loading course details');
    }
};

// Setup modal close functionality
function setupModal() {
    const modal = document.getElementById('courseModal');
    const closeBtn = modal.querySelector('.close-modal');
    
    closeBtn.addEventListener('click', () => {
        modal.classList.remove('show');
    });
    
    // Close modal when clicking outside
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('show');
        }
    });
}

// Toast notification
function showToast(message) {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.classList.add('show');
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}
