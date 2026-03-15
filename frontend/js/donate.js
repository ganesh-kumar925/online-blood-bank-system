/* ==========================================================
 * Wizard form for Donor registration process.
 * Contains Confetti trigger logic upon completion.
 * ========================================================== */

let currentStep = 1;

document.addEventListener('DOMContentLoaded', () => {
    updateWizardUI();

    document.getElementById('btnNext').addEventListener('click', () => {
        if(validateStep(currentStep)) {
            currentStep++;
            updateWizardUI();
        }
    });

    document.getElementById('btnPrev').addEventListener('click', () => {
        currentStep--;
        updateWizardUI();
    });

    document.getElementById('donorForm').addEventListener('submit', submitDonorRegistration);
});

function updateWizardUI() {
    // Buttons state
    document.getElementById('btnPrev').style.display = currentStep > 1 ? 'block' : 'none';
    document.getElementById('btnNext').style.display = currentStep < 3 ? 'block' : 'none';
    document.getElementById('btnSubmit').style.display = currentStep === 3 ? 'block' : 'none';

    // Steps display
    for(let i=1; i<=3; i++) {
        document.getElementById(`step${i}`).style.display = currentStep === i ? 'block' : 'none';
        
        // Progress indicators
        const indicator = document.getElementById(`ind${i}`);
        if(indicator) {
            if(i < currentStep) {
                indicator.className = 'step-indicator completed';
            } else if (i === currentStep) {
                indicator.className = 'step-indicator active';
            } else {
                indicator.className = 'step-indicator';
            }
        }
    }

    // Step 3 Review summary generation
    if(currentStep === 3) {
        generateReviewSummary();
    }
}

function validateStep(step) {
    let isValid = true;
    if(step === 1) {
        if(!document.getElementById('d_name').value) isValid = false;
        if(!document.getElementById('d_email').value) isValid = false;
        if(!document.getElementById('d_city').value) isValid = false;
    }
    if(step === 2) {
        if(!document.getElementById('d_blood').value) isValid = false;
    }

    if(!isValid) {
        showToast('Please fill all required fields in this step.', 'error');
    }
    return isValid;
}

function generateReviewSummary() {
    const summary = document.getElementById('reviewSummary');
    summary.innerHTML = `
        <div style="margin-bottom:12px;"><strong>Name:</strong> ${document.getElementById('d_name').value}</div>
        <div style="margin-bottom:12px;"><strong>City:</strong> ${document.getElementById('d_city').value}</div>
        <div style="margin-bottom:12px;"><strong>Blood Type:</strong> <span class="badge badge-primary">${document.getElementById('d_blood').value}</span></div>
        <div style="margin-bottom:12px;"><strong>Available to Donate:</strong> ${document.getElementById('d_avail').checked ? 'Yes' : 'No'}</div>
    `;
}

async function submitDonorRegistration(e) {
    e.preventDefault();

    const payload = {
        name: document.getElementById('d_name').value,
        email: document.getElementById('d_email').value,
        phone: document.getElementById('d_phone').value,
        age: document.getElementById('d_age').value,
        gender: document.getElementById('d_gender').value,
        city: document.getElementById('d_city').value,
        blood_type: document.getElementById('d_blood').value,
        is_available: document.getElementById('d_avail').checked ? 1 : 0,
        medical_history: document.getElementById('d_history').value
    };

    const btn = document.getElementById('btnSubmit');
    const originalText = btn.innerHTML;
    btn.innerHTML = '<div class="spinner"></div>';
    btn.disabled = true;

    try {
        const { success, data } = await window.apiFetch('/api/donors/register', {
            method: 'POST',
            body: JSON.stringify(payload)
        });

        if (success) {
            // Trigger Confetti !
            triggerConfetti();
            
            // Show Success Screen
            document.getElementById('wizardContainer').style.display = 'none';
            document.getElementById('successScreen').style.display = 'flex';
        } else {
            showToast('Registration failed: ' + (data?.message || 'Server error'), 'error');
            btn.innerHTML = originalText;
            btn.disabled = false;
        }
    } catch (err) {
        showToast('System Error', 'error');
        btn.innerHTML = originalText;
        btn.disabled = false;
    }
}

function triggerConfetti() {
    if(typeof window.confetti !== 'undefined') {
        const duration = 3000;
        const end = Date.now() + duration;

        (function frame() {
            window.confetti({
                particleCount: 5,
                angle: 60,
                spread: 55,
                origin: { x: 0 },
                colors: ['#C0152A', '#E8192C', '#ffffff']
            });
            window.confetti({
                particleCount: 5,
                angle: 120,
                spread: 55,
                origin: { x: 1 },
                colors: ['#C0152A', '#E8192C', '#ffffff']
            });

            if (Date.now() < end) {
                requestAnimationFrame(frame);
            }
        }());
    }
}
