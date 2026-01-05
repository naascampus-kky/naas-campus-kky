/* ══════════════════════════════════════════════════════════
   AUTH.JS - Authentication (Login & Signup)
   ══════════════════════════════════════════════════════════ */

import { supabase } from '../supabase/supabase-config.js';

document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu
    setupMobileMenu();
    
    // Check which page we're on
    const currentPage = window.location.pathname;
    
    if (currentPage.includes('login.html')) {
        setupLogin();
    } else if (currentPage.includes('signup.html')) {
        setupSignup();
    }
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

// Setup login functionality
function setupLogin() {
    const loginForm = document.getElementById('loginForm');
    const errorMessage = document.getElementById('errorMessage');
    const loginBtn = document.getElementById('loginBtn');
    const btnText = loginBtn.querySelector('.btn-text');
    const btnLoader = loginBtn.querySelector('.btn-loader');
    
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        
        // Show loading
        btnText.style.display = 'none';
        btnLoader.style.display = 'inline';
        loginBtn.disabled = true;
        errorMessage.classList.remove('show');
        
        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email: email,
                password: password
            });
            
            if (error) throw error;
            
            // Success - redirect to admin dashboard
            showToast('Login successful!');
            setTimeout(() => {
                window.location.href = 'admin.html';
            }, 500);
            
        } catch (error) {
            console.error('Login error:', error);
            errorMessage.textContent = error.message || 'Invalid email or password';
            errorMessage.classList.add('show');
            
            // Reset button
            btnText.style.display = 'inline';
            btnLoader.style.display = 'none';
            loginBtn.disabled = false;
        }
    });
}

// Setup signup functionality
function setupSignup() {
    const signupForm = document.getElementById('signupForm');
    const errorMessage = document.getElementById('errorMessage');
    const successMessage = document.getElementById('successMessage');
    const signupBtn = document.getElementById('signupBtn');
    const btnText = signupBtn.querySelector('.btn-text');
    const btnLoader = signupBtn.querySelector('.btn-loader');
    
    signupForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const fullName = document.getElementById('fullName').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        
        // Validate passwords match
        if (password !== confirmPassword) {
            errorMessage.textContent = 'Passwords do not match';
            errorMessage.classList.add('show');
            return;
        }
        
        // Validate password length
        if (password.length < 6) {
            errorMessage.textContent = 'Password must be at least 6 characters';
            errorMessage.classList.add('show');
            return;
        }
        
        // Show loading
        btnText.style.display = 'none';
        btnLoader.style.display = 'inline';
        signupBtn.disabled = true;
        errorMessage.classList.remove('show');
        successMessage.classList.remove('show');
        
        try {
            const { data, error } = await supabase.auth.signUp({
                email: email,
                password: password,
                options: {
                    data: {
                        full_name: fullName
                    }
                }
            });
            
            if (error) throw error;
            
            // Success
            successMessage.textContent = 'Account created successfully! Please check your email to verify your account.';
            successMessage.classList.add('show');
            signupForm.reset();
            
            // Redirect to login after 3 seconds
            setTimeout(() => {
                window.location.href = 'login.html';
            }, 3000);
            
        } catch (error) {
            console.error('Signup error:', error);
            errorMessage.textContent = error.message || 'Error creating account';
            errorMessage.classList.add('show');
            
            // Reset button
            btnText.style.display = 'inline';
            btnLoader.style.display = 'none';
            signupBtn.disabled = false;
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
