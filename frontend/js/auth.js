/* =========================================================================
   AUTHENTICATION LOGIC
   ========================================================================= */

// Role Selector Logic
document.addEventListener('DOMContentLoaded', () => {
    const roleTabs = document.querySelectorAll('.role-tab');
    if (roleTabs.length > 0) {
        roleTabs.forEach(tab => {
            tab.addEventListener('click', (e) => {
                roleTabs.forEach(t => t.classList.remove('active'));
                const target = e.currentTarget;
                target.classList.add('active');
                
                const role = target.getAttribute('data-role');
                const donorSection = document.getElementById('donorFields');
                const hospitalSection = document.getElementById('hospitalFields');
                const roleInput = document.getElementById('regRole');
                
                if (roleInput) roleInput.value = role;

                if (role === 'donor') {
                    if (donorSection) donorSection.style.display = 'block';
                    if (hospitalSection) hospitalSection.style.display = 'none';
                } else if (role === 'hospital') {
                    if (donorSection) donorSection.style.display = 'none';
                    if (hospitalSection) hospitalSection.style.display = 'block';
                }
            });
        });
    }

    // Toggle switch logic in register.
    const availCb = document.getElementById('isAvailable');
    if (availCb) {
        availCb.addEventListener('change', () => {
            const lbl = document.getElementById('availLabel');
            if (lbl) {
                lbl.textContent = availCb.checked ? 'Available to Donate' : 'Currently Unavailable';
                lbl.style.color = availCb.checked ? 'var(--success)' : 'var(--text-muted)';
            }
        });
    }
});

// Form Submissions
async function handleLogin(e) {
    e.preventDefault();
    const btn = document.getElementById('loginBtn');
    const errText = document.getElementById('loginError');
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    if (!email || !password) {
        errText.textContent = 'Please fill all fields.';
        errText.classList.add('show');
        return;
    }
    
    errText.classList.remove('show');
    btn.innerHTML = '<div class="spinner"></div>';
    btn.disabled = true;

    try {
        const res = await fetch('/api/auth/login', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ email, password })
        });
        const data = await res.json();
        
        if (data.success) {
            localStorage.setItem('token', data.token);
            localStorage.setItem('role', data.role);
            localStorage.setItem('userName', data.name);
            localStorage.setItem('userId', data.userId);
            
            showToast('Login successful!');
            setTimeout(() => {
                if (data.role === 'admin') window.location.href = 'admin-dashboard.html';
                else if (data.role === 'hospital') window.location.href = 'hospital-dashboard.html';
                else window.location.href = 'donor-dashboard.html';
            }, 1000);
        } else {
            errText.textContent = data.message || 'Invalid credentials.';
            errText.classList.add('show');
            btn.innerHTML = 'Login to Dashboard';
            btn.disabled = false;
        }
    } catch(err) {
        errText.textContent = 'Server connection error.';
        errText.classList.add('show');
        btn.innerHTML = 'Login to Dashboard';
        btn.disabled = false;
    }
}

async function handleRegister(e) {
    e.preventDefault();
    const btn = document.getElementById('regBtn');
    const errText = document.getElementById('regError');
    errText.classList.remove('show');
    
    const payload = {
        name: document.getElementById('regName').value,
        email: document.getElementById('regEmail').value,
        password: document.getElementById('regPassword').value,
        role: document.getElementById('regRole') ? document.getElementById('regRole').value : 'donor',
        city: document.getElementById('regCity').value,
        phone: document.getElementById('regPhone').value
    };

    // Role specific fields
    if (payload.role === 'donor') {
        payload.blood_type = document.getElementById('bloodType').value;
        payload.age = document.getElementById('age').value;
        payload.gender = document.getElementById('gender').value;
        payload.is_available = document.getElementById('isAvailable').checked;
        if (!payload.blood_type) {
             errText.textContent = 'Blood type is required.';
             errText.classList.add('show');
             return;
        }
    } else {
        payload.hospital_name = document.getElementById('hospitalName').value;
        payload.license_number = document.getElementById('licenseNumber').value;
    }

    btn.innerHTML = '<div class="spinner"></div>';
    btn.disabled = true;

    try {
        const res = await fetch('/api/auth/register', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(payload)
        });
        const data = await res.json();
        
        if (data.success) {
            localStorage.setItem('token', data.token);
            localStorage.setItem('role', data.role);
            localStorage.setItem('userName', data.name);
            localStorage.setItem('userId', data.userId);
            
            showToast('Registration successful!');
            setTimeout(() => {
                if (data.role === 'hospital') window.location.href = 'hospital-dashboard.html';
                else window.location.href = 'donor-dashboard.html';
            }, 1000);
        } else {
            errText.textContent = data.message;
            errText.classList.add('show');
            btn.innerHTML = 'Create Account';
            btn.disabled = false;
        }
    } catch(err) {
        errText.textContent = 'Server connection error.';
        errText.classList.add('show');
        btn.innerHTML = 'Create Account';
        btn.disabled = false;
    }
}
