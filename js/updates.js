/* ══════════════════════════════════════════════════════════
   UPDATES.JS - Display latest campus updates
   ══════════════════════════════════════════════════════════ */

import { supabase } from '../supabase/supabase-config.js';

document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu
    setupMobileMenu();
    
    // Load all updates
    loadUpdates();
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

// Load all updates
async function loadUpdates() {
    const grid = document.getElementById('updatesGrid');
    if (!grid) return;
    
    try {
        const { data: updates, error } = await supabase
            .from('updates')
            .select('*')
            .order('date', { ascending: false });
        
        if (error) throw error;
        
        if (updates && updates.length > 0) {
            grid.innerHTML = updates.map(update => `
                <div class="card update-item">
                    <img src="${update.image_url}" alt="${update.title}" class="update-image">
                    <div class="update-content">
                        <h3 class="update-title">${update.title}</h3>
                        <p class="update-description">${update.description}</p>
                        <span class="update-date">📅 ${formatDate(update.date)}</span>
                    </div>
                </div>
            `).join('');
        } else {
            grid.innerHTML = '<p class="loading">No updates available at the moment.</p>';
        }
    } catch (error) {
        console.error('Error loading updates:', error);
        grid.innerHTML = '<p class="loading">Error loading updates. Please try again later.</p>';
    }
}

// Format date to readable format
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}
