/* ==========================================================
 * Admin Panel & Analytics API Aggregator 
 * Populates tables and fetches inventory status.
 * ========================================================== */

document.addEventListener('DOMContentLoaded', async () => {
    // Both charts and data are triggered on load
    await loadInventory();
    await loadRequests();
    await loadDonors();
    await loadNotifications();
});

async function loadInventory() {
    const { success, data } = await window.apiFetch('/api/inventory');
    if (!success) return;

    const tbody = document.getElementById('adminInventoryBody');
    if(!tbody) return;

    let h = '';
    data.inventory.forEach(inv => {
        const isExpiring = inv.expiry_warning === 1;
        const critical = inv.units_available < 5;

        // Visual indicators
        const trClass = isExpiring ? 'class="expiry-warn"' : '';
        const expBadge = isExpiring ? 
            `<span style="color:var(--warning);font-size:0.8rem;display:flex;align-items:center;gap:4px;"><i data-lucide="alert-triangle" width="14"></i> Expiring (<7d)</span>` : 
            `<span style="color:var(--success);font-size:0.8rem">Good</span>`;

        h += `
            <tr ${trClass}>
                <td><strong>${inv.blood_bank_name}</strong><br><span class="text-muted" style="font-size:0.8rem">${inv.city}</span></td>
                <td><span class="badge ${inv.blood_type.includes('-') ? 'badge-primary' : 'badge-success'}">${inv.blood_type}</span></td>
                <td><strong style="color:${critical ? 'var(--danger)' : 'var(--text-primary)'}">${inv.units_available} Units</strong></td>
                <td>${expBadge}</td>
            </tr>
        `;
    });
    tbody.innerHTML = h;

    // Trigger Chart logic mapped in charts.js
    if (window.renderInventoryChart && data.aggregated) {
        window.renderInventoryChart(data.aggregated);
    }
    
    if(typeof lucide !== 'undefined') lucide.createIcons();
}

async function loadRequests() {
    const { success, data } = await window.apiFetch('/api/requests');
    if (!success) return;

    const tbody = document.getElementById('adminReqBody');
    if(!tbody) return;

    // Track for doughnut chart
    const statusAgg = { 'Pending': 0, 'Matched': 0, 'Fulfilled': 0, 'Rejected': 0 };

    let h = '';
    data.requests.forEach(r => {
        statusAgg[r.status] = (statusAgg[r.status] || 0) + 1;

        let uBadge = `<span class="badge badge-success">Normal</span>`;
        if(r.urgency === 'Urgent') uBadge = `<span class="badge badge-warning">Urgent</span>`;
        if(r.urgency === 'Critical') uBadge = `<span class="badge badge-critical">Critical</span>`;

        h += `
            <tr>
                <td><strong>${r.hospital_name}</strong><br><span class="text-muted" style="font-size:0.8rem">${r.hospital_city}</span></td>
                <td><span class="badge badge-primary">${r.blood_type}</span></td>
                <td>${r.units_needed}</td>
                <td>${uBadge}</td>
                <td><strong>${r.status}</strong></td>
            </tr>
        `;
    });
    tbody.innerHTML = h;

    if (window.renderRequestChart) {
        window.renderRequestChart(statusAgg);
    }
}

async function loadDonors() {
    const { success, data } = await window.apiFetch('/api/donors');
    if (!success) return;

    const tbody = document.getElementById('adminDonorsBody');
    if(!tbody) return;

    let h = '';
    data.donors.forEach(d => {
        h += `
            <tr>
                <td><strong>${d.name}</strong><br><span class="text-muted" style="font-size:0.8rem">${d.email}</span></td>
                <td>${d.city}</td>
                <td><span class="badge badge-primary">${d.blood_type}</span></td>
                <td>${d.is_available === 1 ? '<span class="badge badge-success">Active</span>' : '<span class="badge badge-warning">Unavailable</span>'}</td>
            </tr>
        `;
    });
    tbody.innerHTML = h;
}
async function loadNotifications() {
    try {
        const { success, data } = await window.apiFetch('/api/notifications');
        if (!success) return;

        const list = document.getElementById('adminNotifList');
        if(!list) return;

        let h = '';
        data.notifications.forEach(n => {
            const icon = n.message.includes('Urgent') || n.message.includes('Critical') ? 'alert-circle' : 'info';
            const color = n.message.includes('Urgent') ? 'var(--danger)' : 'var(--primary)';
            
            h += `
                <div class="card" style="margin-bottom: 8px; padding: 12px; border-left: 4px solid ${color}; background: rgba(255,255,255,0.03);">
                    <div style="display:flex; gap:12px; align-items:start;">
                        <i data-lucide="${icon}" width="16" style="color:${color}; margin-top:2px;"></i>
                        <div>
                            <p style="font-size:0.9rem; margin-bottom:4px;">${n.message}</p>
                            <span class="text-muted" style="font-size:0.75rem;">${new Date(n.created_at).toLocaleString()}</span>
                        </div>
                    </div>
                </div>
            `;
        });
        list.innerHTML = h || '<div class="text-center text-muted">No recent alerts.</div>';
        if(typeof lucide !== 'undefined') lucide.createIcons();
    } catch(e) { console.error('Notif load err', e); }
}
