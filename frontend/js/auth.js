// Authentication JavaScript
// Handles login, registration, and session management

function initLoginPage() {
    const loginForm = document.getElementById('loginForm');
    const errorMessage = document.getElementById('errorMessage');
    const loginBtn = document.getElementById('loginBtn');
    
    if (loginForm) {
        loginForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            errorMessage.classList.add('d-none');
            
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            
            loginBtn.disabled = true;
            loginBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Signing In...';
            
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 500));
            
            const employee = findEmployeeByEmail(email);
            if (!employee) {
                errorMessage.textContent = 'No account found with this email address.';
                errorMessage.classList.remove('d-none');
                loginBtn.disabled = false;
                loginBtn.innerHTML = 'Sign In';
                return;
            }
            
            if (employee.password !== password) {
                errorMessage.textContent = 'Incorrect password. Please try again.';
                errorMessage.classList.remove('d-none');
                loginBtn.disabled = false;
                loginBtn.innerHTML = 'Sign In';
                return;
            }
            
            setCurrentUser(employee);
            window.location.href = `employee-dashboard.html`;
        });
    }
}

function initAdminLoginPage() {
    const loginForm = document.getElementById('adminLoginForm');
    const errorMessage = document.getElementById('errorMessage');
    const loginBtn = document.getElementById('loginBtn');
    
    if (loginForm) {
        loginForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            errorMessage.classList.add('d-none');
            
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            
            loginBtn.disabled = true;
            loginBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Signing In...';
            
            await new Promise(resolve => setTimeout(resolve, 500));
            
            const admin = findEmployeeByEmail(email);
            if (!admin) {
                errorMessage.textContent = 'No account found with this email address.';
                errorMessage.classList.remove('d-none');
                loginBtn.disabled = false;
                loginBtn.innerHTML = 'Admin Sign In';
                return;
            }
            
            if (admin.password !== password) {
                errorMessage.textContent = 'Incorrect password. Please try again.';
                errorMessage.classList.remove('d-none');
                loginBtn.disabled = false;
                loginBtn.innerHTML = 'Admin Sign In';
                return;
            }
            
            setCurrentUser(admin);
            window.location.href = `admin-dashboard.html`;
        });
    }
}

function initRegisterPage() {
    const registerForm = document.getElementById('registerForm');
    const errorMessage = document.getElementById('errorMessage');
    const registerBtn = document.getElementById('registerBtn');
    
    if (registerForm) {
        registerForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            errorMessage.classList.add('d-none');
            
            const employeeId = document.getElementById('employeeId').value;
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const department = document.getElementById('department').value;
            
            if (password !== document.getElementById('confirmPassword').value) {
                errorMessage.textContent = 'Passwords do not match.';
                errorMessage.classList.remove('d-none');
                return;
            }
            
            registerBtn.disabled = true;
            registerBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Creating Account...';
            
            await new Promise(resolve => setTimeout(resolve, 500));
            
            const existing = findEmployeeByEmail(email);
            if (existing) {
                errorMessage.textContent = 'An account with this email already exists.';
                errorMessage.classList.remove('d-none');
                registerBtn.disabled = false;
                registerBtn.innerHTML = 'Create Account';
                return;
            }
            
            const newEmployee = {
                id: `emp-${Date.now()}`,
                employeeId,
                name,
                email,
                password,
                department,
                role: 'employee',
                createdAt: new Date().toISOString(),
            };
            
            addEmployee(newEmployee);
            setCurrentUser(newEmployee);
            window.location.href = `employee-dashboard.html`;
        });
    }
}

function initAdminRegisterPage() {
    const registerForm = document.getElementById('adminRegisterForm');
    const errorMessage = document.getElementById('errorMessage');
    const registerBtn = document.getElementById('registerBtn');
    
    if (registerForm) {
        registerForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            errorMessage.classList.add('d-none');
            
            const employeeId = document.getElementById('employeeId').value;
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const department = document.getElementById('department').value;
            
            if (password !== document.getElementById('confirmPassword').value) {
                errorMessage.textContent = 'Passwords do not match.';
                errorMessage.classList.remove('d-none');
                return;
            }
            
            registerBtn.disabled = true;
            registerBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Registering...';
            
            await new Promise(resolve => setTimeout(resolve, 500));
            
            const existing = findEmployeeByEmail(email);
            if (existing) {
                errorMessage.textContent = 'An account with this email already exists.';
                errorMessage.classList.remove('d-none');
                registerBtn.disabled = false;
                registerBtn.innerHTML = 'Register Admin';
                return;
            }
            
            const newAdmin = {
                id: `admin-${Date.now()}`,
                employeeId,
                name,
                email,
                password,
                department,
                role: 'admin',
                createdAt: new Date().toISOString(),
            };
            
            addEmployee(newAdmin);
            setCurrentUser(newAdmin);
            window.location.href = `admin-dashboard.html`;
        });
    }
}