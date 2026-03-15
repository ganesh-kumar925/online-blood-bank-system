/* ==========================================================
 * Wizard form for Hospital Blood Requests.
 * Submits payload to trigger backend matching algorithm.
 * ========================================================== */

let reqStep = 1;

document.addEventListener('DOMContentLoaded', () => {
    updateReqUI();

    document.getElementById('rNext').addEventListener('click', () => {
        if(validateReqStep(reqStep)) {
            reqStep++;
            updateReqUI();
        }
    });

    document.getElementById('rPrev').addEventListener('click', () => {
        reqStep--;
        updateReqUI();
    });

    document.getElementById('requestForm').addEventListener('submit', submitRequest);
});

function updateReqUI() {
    document.getElementById('rPrev').style.display = reqStep > 1 ? 'block' : 'none';
    document.getElementById('rNext').style.display = reqStep < 4 ? 'block' : 'none';
    document.getElementById('rSubmit').style.display = reqStep === 4 ? 'block' : 'none';

    for(let i=1; i<=4; i++) {
        document.getElementById(`rStep${i}`).style.display = reqStep === i ? 'block' : 'none';
        const ind = document.getElementById(`rInd${i}`);
        if(ind) {
            ind.className = i < reqStep ? 'step-indicator completed' : (i === reqStep ? 'step-indicator active' : 'step-indicator');
        }
    }

    if(reqStep === 4) generateReqSummary();
}

function validateReqStep(step) {
    let isValid = true;
    if(step === 1) {
        if(!document.getElementById('r_hname').value) isValid = false;
        if(!document.getElementById('r_hcity').value) isValid = false;
    }
    if(step === 2) {
        if(!document.getElementById('r_blood').value) isValid = false;
        if(!document.getElementById('r_units').value) isValid = false;
    }

    if(!isValid) showToast('Please complete all required fields.', 'error');
    return isValid;
}

function generateReqSummary() {
    const s = document.getElementById('reqSummary');
    const uColor = document.getElementById('r_urgency').value === 'Critical' ? 'var(--danger)' : 'var(--text-primary)';
    
    s.innerHTML = `
        <div style="margin-bottom:12px;"><strong>Hospital:</strong> ${document.getElementById('r_hname').value} (${document.getElementById('r_hcity').value})</div>
        <div style="margin-bottom:12px;"><strong>Blood Type:</strong> <span class="badge badge-primary">${document.getElementById('r_blood').value}</span></div>
        <div style="margin-bottom:12px; color:${uColor}; font-weight:600;"><strong>Urgency:</strong> ${document.getElementById('r_urgency').value}</div>
        <div style="margin-bottom:12px;"><strong>Units:</strong> ${document.getElementById('r_units').value}</div>
    `;
}

async function submitRequest(e) {
    e.preventDefault();

    const payload = {
        hospital_name: document.getElementById('r_hname').value,
        hospital_city: document.getElementById('r_hcity').value,
        contact_person: document.getElementById('r_contact').value,
        phone: document.getElementById('r_phone').value,
        email: document.getElementById('r_email').value,
        blood_type: document.getElementById('r_blood').value,
        units_needed: document.getElementById('r_units').value,
        urgency: document.getElementById('r_urgency').value,
        patient_name: document.getElementById('r_pname').value,
        patient_age: document.getElementById('r_page').value,
        doctor_name: document.getElementById('r_doc').value,
        notes: document.getElementById('r_notes').value
    };

    const btn = document.getElementById('rSubmit');
    const og = btn.innerHTML;
    btn.innerHTML = '<div class="spinner"></div>';
    btn.disabled = true;

    try {
        const { success, data } = await window.apiFetch('/api/requests/new', {
            method: 'POST',
            body: JSON.stringify(payload)
        });

        if (success) {
            document.getElementById('reqWizard').style.display = 'none';
            document.getElementById('reqSuccess').style.display = 'block';
            document.getElementById('displayReqId').textContent = 'REQ-' + (data.requestId || Math.floor(Math.random()*10000));
        } else {
            showToast('Failed to submit request', 'error');
            btn.innerHTML = og; btn.disabled = false;
        }
    } catch(err) {
        btn.innerHTML = og; btn.disabled = false;
    }
}
