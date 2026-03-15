/* ==========================================================
 * Blood Search & Emergency Logic
 * ========================================================== */

document.addEventListener('DOMContentLoaded', () => {
    checkEmergencyLevels();
    
    const searchBtn = document.getElementById('searchBtn');
    if(searchBtn) {
        searchBtn.addEventListener('click', performSearch);
    }

    // Set up Type Pill Selectors
    document.querySelectorAll('.type-pill').forEach(pill => {
        pill.addEventListener('click', function() {
            document.querySelectorAll('.type-pill').forEach(p => p.classList.remove('active'));
            this.classList.add('active');
        });
    });
});

async function checkEmergencyLevels() {
    const { success, data } = await window.apiFetch('/api/inventory/critical');
    if (success && data.alerts && data.alerts.length > 0) {
        injectEmergencyBanner(data.alerts);
    }
}

function injectEmergencyBanner(alerts) {
    if(document.getElementById('globalEmergencyBanner')) return;

    let text = alerts.map(a => `${a.city}: ${a.blood_type} (${a.total} units left)`).join(' · ');

    const banner = document.createElement('div');
    banner.id = 'globalEmergencyBanner';
    banner.style.cssText = `
        background: linear-gradient(90deg, #EF4444, #991B1B);
        color: white;
        padding: 12px 5%;
        text-align: center;
        font-weight: 600;
        font-size: 0.9rem;
        position: relative;
        z-index: 999;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 12px;
        box-shadow: 0 4px 12px rgba(239, 68, 68, 0.4);
    `;

    banner.innerHTML = `
        <i data-lucide="alert-triangle" style="animation: pulseDanger 1.5s infinite"></i>
        <span><strong>CRITICAL SHORTAGE:</strong> ${text}</span>
        <a href="donate.html" class="btn btn-glass" style="padding: 4px 12px; font-size: 0.8rem; margin-left:16px;">Donate Now</a>
    `;

    document.body.prepend(banner);
    if(typeof lucide !== 'undefined') lucide.createIcons();
}

async function performSearch() {
    const activePill = document.querySelector('.type-pill.active');
    const cityInput = document.getElementById('searchCity').value.trim();

    if (!activePill || !cityInput) {
        showToast('Please select a blood type and enter a city.', 'error');
        return;
    }

    const type = activePill.dataset.type;
    const btn = document.getElementById('searchBtn');
    
    // UI Loading State
    const originalText = btn.innerHTML;
    btn.innerHTML = '<div class="spinner"></div>';
    btn.disabled = true;

    const { success, data } = await window.apiFetch(`/api/blood/search?blood_type=${encodeURIComponent(type)}&city=${encodeURIComponent(cityInput)}`);
    
    btn.innerHTML = originalText;
    btn.disabled = false;

    if (success) {
        renderResults(data, type);
    } else {
        showToast('Error retrieving blood records', 'error');
    }
}

function renderResults(data, requestedType) {
    const grid = document.getElementById('resultsGrid');
    const header = document.getElementById('resultsHeader');
    grid.innerHTML = '';
    header.style.display = 'block';

    let totalBanks = data.inventory.length;
    let totalDonors = data.donors.length;

    if (totalBanks === 0 && totalDonors === 0) {
        grid.innerHTML = `<div class="card" style="grid-column: 1/-1; text-align:center; padding: 48px;"><i data-lucide="search-x" style="width:40px;height:40px;color:var(--text-muted);margin-bottom:16px;"></i><h3>No matches found</h3><p class="text-muted">Try expanding your search or modifying the requirements.</p></div>`;
        if(typeof lucide !== 'undefined') lucide.createIcons();
        return;
    }

    // 1. Render Inventory (Hospitals/Blood Banks)
    data.inventory.forEach(inv => {
        const isExactMatch = inv.blood_type === requestedType;
        const progressPct = Math.min((inv.units_available / 50) * 100, 100);
        
        grid.innerHTML += `
            <div class="card" data-aos="fade-up">
                <div class="flex-between" style="margin-bottom:16px;">
                    <div class="badge ${isExactMatch ? 'badge-primary' : 'badge-success'}">
                        ${inv.blood_type} ${isExactMatch ? '(Exact)' : '(Compatible)'}
                    </div>
                    <span class="text-muted" style="font-size:0.85rem;"><i data-lucide="building" width="14" style="vertical-align:-2px;margin-right:4px;"></i>Bank</span>
                </div>
                <h3 style="margin-bottom:4px;">${inv.blood_bank_name}</h3>
                <p class="text-muted" style="margin-bottom:24px; font-size:0.9rem;">${inv.city}</p>
                
                <div style="margin-bottom:24px;">
                    <div class="flex-between" style="font-size:0.85rem; margin-bottom:8px;">
                        <span>Availability</span>
                        <strong>${inv.units_available} Units</strong>
                    </div>
                    <div style="height:6px; background:var(--bg-dark); border-radius:3px; overflow:hidden;">
                        <div style="height:100%; width:${progressPct}%; background:var(--primary); transition: width 1s ease-out;"></div>
                    </div>
                </div>

                <button class="btn btn-outline" style="width:100%" onclick="showToast('Contact: Not available in public demo', 'info')">Contact Bank</button>
            </div>
        `;
    });

    // 2. Render Donors
    data.donors.forEach(donor => {
        const isExactMatch = donor.blood_type === requestedType;
        
        grid.innerHTML += `
            <div class="card" data-aos="fade-up">
                <div class="flex-between" style="margin-bottom:16px;">
                    <div class="badge ${isExactMatch ? 'badge-primary' : 'badge-success'}">
                        ${donor.blood_type} ${isExactMatch ? '(Exact)' : '(Compatible)'}
                    </div>
                    <span class="text-muted" style="font-size:0.85rem;"><i data-lucide="user" width="14" style="vertical-align:-2px;margin-right:4px;"></i>Donor</span>
                </div>
                <h3 style="margin-bottom:4px;">${donor.name}</h3>
                <p class="text-muted" style="margin-bottom:24px; font-size:0.9rem;">${donor.city}</p>
                
                <div style="margin-bottom:24px; display:flex; gap:12px; align-items:center;">
                    <div class="badge badge-success">Available Now</div>
                </div>

                <a href="request.html" class="btn btn-primary" style="width:100%">Request Match</a>
            </div>
        `;
    });

    if(typeof lucide !== 'undefined') lucide.createIcons();
}
