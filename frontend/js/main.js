/* ==========================================================
 * Main Shared Utilities & Animations
 * ========================================================== */

// Global User Object Placeholder (Auth Ready)
// When auth is enabled, this will pull from localStorage
// window.currentUser = JSON.parse(localStorage.getItem('user')) || null;

document.addEventListener('DOMContentLoaded', () => {
    // Initialize AOS Animations Database
    if(typeof AOS !== 'undefined') {
        AOS.init({
            duration: 800,
            once: true,
            offset: 50,
            easing: 'ease-out-cubic'
        });
    }

    // Initialize Lucide Icons
    if(typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
});

// Create Global Toast Container
const toastContainer = document.createElement('div');
toastContainer.id = 'toast-container';
document.body.appendChild(toastContainer);

window.showToast = function(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    let icon = 'check-circle';
    if(type === 'error') icon = 'alert-circle';
    if(type === 'info') icon = 'info';

    toast.innerHTML = `
        <i data-lucide="${icon}"></i>
        <div style="font-weight: 500;">${message}</div>
    `;
    
    document.getElementById('toast-container').appendChild(toast);
    if(typeof lucide !== 'undefined') lucide.createIcons();

    // Trigger animation
    setTimeout(() => toast.classList.add('show'), 10);

    // Remove
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 400);
    }, 4000);
};

// Global API Fetch wrapper
window.apiFetch = async function(url, options = {}) {
    try {
        const headers = {
            'Content-Type': 'application/json',
            ...options.headers
        };

        // AUTH READY: Uncomment below to inject JWT
        // const token = localStorage.getItem('token');
        // if(token) headers['Authorization'] = `Bearer ${token}`;

        const response = await fetch(`http://localhost:5000${url}`, {
            ...options,
            headers
        });

        // AUTH READY: Handle 401 Unauthorized
        // if(response.status === 401 || response.status === 403) {
        //     showToast('Authentication required', 'error');
        //     setTimeout(() => window.location.href = 'login.html', 1500);
        //     return { success: false, data: null };
        // }

        const data = await response.json();
        return { success: response.ok, data };

    } catch (error) {
        console.error('API Fetch Error:', error);
        return { success: false, data: null };
    }
};
