/* ══════════════════════════════════════════════════════════
   APPLICATION.JS - Online application form (No login required)
   ══════════════════════════════════════════════════════════ */

import { supabase } from '../supabase/supabase-config.js';

document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu
    setupMobileMenu();
    
    // Load courses into dropdown
    loadCoursesDropdown();
    
    // Setup application form
    setupApplicationForm();
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

// Load courses into dropdown
async function loadCoursesDropdown() {
    const select = document.getElementById('course');
    if (!select) return;
    
    try {
        const { data: courses, error } = await supabase
            .from('courses')
            .select('title')
            .order('title');
        
        if (error) throw error;
        
        if (courses && courses.length > 0) {
            courses.forEach(course => {
                const option = document.createElement('option');
                option.value = course.title;
                option.textContent = course.title;
                select.appendChild(option);
            });
        } else {
            const option = document.createElement('option');
            option.value = 'General Inquiry';
            option.textContent = 'General Inquiry';
            select.appendChild(option);
        }
    } catch (error) {
        console.error('Error loading courses:', error);
        // Add a default option in case of error
        const option = document.createElement('option');
        option.value = 'General Inquiry';
        option.textContent = 'General Inquiry';
        select.appendChild(option);
    }
}

// Setup application form submission
function setupApplicationForm() {
    const form = document.getElementById('applicationForm');
    const successMessage = document.getElementById('successMessage');
    const errorMessage = document.getElementById('errorMessage');
    const submitBtn = document.getElementById('submitBtn');
    const btnText = submitBtn.querySelector('.btn-text');
    const btnLoader = submitBtn.querySelector('.btn-loader');
    
    if (!form) return;
    
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Get form data
        const formData = {
            full_name: document.getElementById('fullName').value,
            nic: document.getElementById('nic').value,
            age: parseInt(document.getElementById('age').value),
            gender: document.getElementById('gender').value,
            email: document.getElementById('email').value,
            whatsapp: document.getElementById('whatsapp').value,
            course: document.getElementById('course').value,
            additional_info: document.getElementById('additionalInfo').value || null,
            status: 'Pending',
            applied_date: new Date().toISOString()
        };
        
        // Validate NIC format (basic)
        const nicPattern = /^([0-9]{9}[vVxX]|[0-9]{12})$/;
        if (!nicPattern.test(formData.nic)) {
            errorMessage.textContent = 'Please enter a valid NIC number';
            errorMessage.classList.add('show');
            return;
        }
        
        // Show loading
        btnText.style.display = 'none';
        btnLoader.style.display = 'inline';
        submitBtn.disabled = true;
        errorMessage.classList.remove('show');
        successMessage.classList.remove('show');
        
        try {
            const { data, error } = await supabase
                .from('applications')
                .insert([formData]);
            
            if (error) throw error;
            
            // Success
            successMessage.innerHTML = `
                <strong>Application Submitted Successfully!</strong><br>
                Thank you ${formData.full_name} for applying to ${formData.course}.<br>
                We will contact you via WhatsApp (${formData.whatsapp}) within 24-48 hours.
            `;
            successMessage.classList.add('show');
            
            // Reset form
            form.reset();
            
            // Show toast
            showToast('Application submitted successfully!');
            
            // Scroll to success message
            successMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
            
        } catch (error) {
            console.error('Application error:', error);
            errorMessage.textContent = error.message || 'Error submitting application. Please try again.';
            errorMessage.classList.add('show');
        } finally {
            // Reset button
            btnText.style.display = 'inline';
            btnLoader.style.display = 'none';
            submitBtn.disabled = false;
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
