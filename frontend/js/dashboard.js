/* =========================================================================
   DASHBOARD / GLOBAL UTILITIES
   ========================================================================= */

// Extract User Data
const token = localStorage.getItem('token');
const role = localStorage.getItem('role');
const userName = localStorage.getItem('userName');
const userId = localStorage.getItem('userId');
const userAvatar = userName ? userName.substring(0, 2).toUpperCase() : 'U';

// ── PROTECT ROUTES & INIT ─────────────────────────────────────────────
function requireAuth(expectedRole = null) {
    if (!token) {
        window.location.href = 'login.html';
        return false;
    }
    if (expectedRole && role !== expectedRole) {
        window.location.href = 'login.html'; // Or unauth page
        return false;
    }
    
    // Populate UI elements
    const nameEls = document.querySelectorAll('.user-name-display');
    nameEls.forEach(el => el.textContent = userName);
    
    const avatarEls = document.querySelectorAll('.user-avatar-display');
    avatarEls.forEach(el => el.textContent = userAvatar);
    
    return true;
}

// ── API HELPER ────────────────────────────────────────────────────────
async function apiFetch(endpoint, options = {}) {
    const headers = { 
        'Content-Type': 'application/json',
        ...options.headers 
    };
    if (token) headers['Authorization'] = `Bearer ${token}`;
    
    const res = await fetch(endpoint, { ...options, headers });
    const data = await res.json();
    return { status: res.status, data };
}

// ── BIND SIDEBAR NAVIGATION ───────────────────────────────────────────
function bindSidebar() {
    const items = document.querySelectorAll('.sidebar-item');
    items.forEach(item => {
        item.addEventListener('click', (e) => {
            // Remove active classes
            items.forEach(i => i.classList.remove('active'));
            // Add to clicked
            e.currentTarget.classList.add('active');
            
            // Switch content sections
            const targetSectionId = e.currentTarget.getAttribute('data-target');
            if (targetSectionId) {
                document.querySelectorAll('.dashboard-content').forEach(sec => sec.classList.remove('active'));
                const t = document.getElementById(targetSectionId);
                if(t) t.classList.add('active');
            }
        });
    });
}

// ── BADGE/TAG FORMATTERS ──────────────────────────────────────────────
function getUrgencyBadge(urgency) {
    if(urgency === 'Critical') return '<span class="badge badge-critical">Critical</span>';
    if(urgency === 'Urgent') return '<span class="badge badge-warning">Urgent</span>';
    return '<span class="badge badge-success">Normal</span>';
}

function getStatusBadge(status) {
    if(status === 'Pending') return '<span class="badge badge-warning">Pending</span>';
    if(status === 'Matched') return '<span class="badge badge-primary">Matched</span>';
    if(status === 'Fulfilled') return '<span class="badge badge-success">Fulfilled</span>';
    if(status === 'Rejected') return '<span class="badge badge-danger">Rejected</span>';
    return `<span class="badge">${status}</span>`;
}

// ── LOGOUT ────────────────────────────────────────────────────────────
function logout() {
    localStorage.clear();
    window.location.href = 'login.html';
}

// Init Lucide
document.addEventListener('DOMContentLoaded', () => {
    if(window.lucide) lucide.createIcons();
});
