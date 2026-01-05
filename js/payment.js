/* ══════════════════════════════════════════════════════════
   PAYMENT.JS - Payment portal with WhatsApp proof submission
   ══════════════════════════════════════════════════════════ */

import { supabase } from '../supabase/supabase-config.js';

document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu
    setupMobileMenu();
    
    // Load courses for dropdown
    loadCoursesDropdown();
    
    // Setup copy buttons
    setupCopyButtons();
    
    // Setup WhatsApp form
    setupWhatsAppForm();
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
    const select = document.getElementById('selectedCourse');
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
        }
    } catch (error) {
        console.error('Error loading courses:', error);
    }
}

// Setup copy buttons with Clipboard API
function setupCopyButtons() {
    const copyButtons = document.querySelectorAll('.btn-copy');
    
    copyButtons.forEach(button => {
        button.addEventListener('click', function() {
            const targetId = this.getAttribute('data-copy');
            const textElement = document.getElementById(targetId);
            const textToCopy = textElement.textContent;
            
            // Use Clipboard API
            navigator.clipboard.writeText(textToCopy).then(() => {
                // Show success toast
                showToast('Copied Successfully: ' + textToCopy);
                
                // Visual feedback on button
                const originalText = this.textContent;
                this.textContent = '✓ Copied';
                this.style.background = '#10B981';
                this.style.color = 'white';
                
                setTimeout(() => {
                    this.textContent = originalText;
                    this.style.background = '';
                    this.style.color = '';
                }, 2000);
            }).catch(err => {
                console.error('Copy failed:', err);
                showToast('Copy failed. Please try again.');
            });
        });
    });
}

// Setup WhatsApp form submission
function setupWhatsAppForm() {
    const form = document.getElementById('paymentProofForm');
    if (!form) return;
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const fullName = document.getElementById('fullName').value;
        const whatsappNumber = document.getElementById('whatsappNumber').value;
        const selectedCourse = document.getElementById('selectedCourse').value;
        
        // Validate form
        if (!fullName || !whatsappNumber || !selectedCourse) {
            showToast('Please fill in all required fields');
            return;
        }
        
        // Create WhatsApp message
        const message = `Hello NAAS CAMPUS,

Full Name: ${fullName}
WhatsApp: ${whatsappNumber}
Course: ${selectedCourse}

I have attached my payment proof.`;
        
        // Encode message for URL
        const encodedMessage = encodeURIComponent(message);
        
        // WhatsApp number (remove + and spaces)
        const waNumber = '94751501603';
        
        // Create WhatsApp link
        const whatsappURL = `https://wa.me/${waNumber}?text=${encodedMessage}`;
        
        // Open WhatsApp
        window.open(whatsappURL, '_blank');
        
        // Show success message
        showToast('Opening WhatsApp... Please attach your payment proof and send.');
        
        // Reset form after short delay
        setTimeout(() => {
            form.reset();
        }, 1000);
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
