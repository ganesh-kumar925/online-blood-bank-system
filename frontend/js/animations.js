/* =========================================================================
   ANIMATIONS & UI UTILS
   ========================================================================= */

// ── TOAST NOTIFICATIONS ────────────────────────────────────────────────
let toastContainer = null;

function initToastContainer() {
    if (!toastContainer) {
        toastContainer = document.createElement('div');
        toastContainer.className = 'toast-container';
        document.body.appendChild(toastContainer);
    }
}

function showToast(message, type = 'success') {
    initToastContainer();
    
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    // Lucide Icon based on type
    const icon = type === 'success' 
        ? `<i data-lucide="check-circle" style="color:var(--success)"></i>`
        : `<i data-lucide="alert-circle" style="color:var(--danger)"></i>`;

    toast.innerHTML = `
        ${icon}
        <div style="font-weight:500;font-size:0.95rem;">${message}</div>
    `;
    
    toastContainer.appendChild(toast);
    if(window.lucide) lucide.createIcons();

    // Remove after 4s
    setTimeout(() => {
        toast.style.animation = 'slideOutRight 0.3s cubic-bezier(0.4, 0, 0.2, 1) forwards';
        setTimeout(() => toast.remove(), 300);
    }, 4000);
}

// Ensure AOS is initialized if available
document.addEventListener('DOMContentLoaded', () => {
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 800,
            once: true,
            offset: 50,
            easing: 'ease-out-cubic'
        });
    }
});

window.showToast = showToast;
