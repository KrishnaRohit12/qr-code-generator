document.addEventListener('DOMContentLoaded', () => {
    // Elements
    const loginModal = document.getElementById('login-modal');
    const signupModal = document.getElementById('signup-modal');
    const recoverModal = document.getElementById('recover-modal');
    const showSignup = document.getElementById('show-signup');
    const showLogin = document.getElementById('show-login');
    const backToLogin = document.getElementById('back-to-login');
    const loginBtn = document.getElementById('login-btn');
    const signupBtn = document.getElementById('signup-btn');
    const recoverBtn = document.getElementById('recover-btn');
    const logoutBtn = document.getElementById('logout');
    const themeSelect = document.getElementById('theme');
    const qrInput = document.getElementById('qr-input');
    const qrColor = document.getElementById('qr-color');
    const qrSize = document.getElementById('qr-size');
    const generateQRBtn = document.getElementById('generate-qr');
    const qrContainer = document.getElementById('qr-container');
    const downloadQRBtn = document.getElementById('download-qr');
    const shareQRBtn = document.getElementById('share-qr');
    const errorMessage = document.getElementById('error-message');
    const loginError = document.getElementById('login-error');
    const signupError = document.getElementById('signup-error');
    const contactForm = document.getElementById('contact-form');
    const contactSuccess = document.getElementById('contact-success');
    const contactError = document.getElementById('contact-error');
    const qrHistory = document.getElementById('qr-history');
    const profileName = document.getElementById('profile-name');
    const profileUsername = document.getElementById('profile-username');
    const userList = document.getElementById('user-list');
    const totalUsers = document.getElementById('total-users');
    const loginHistory = document.getElementById('login-history');
    const navButtons = document.querySelectorAll('.nav-button');
    const toggleSidebarBtn = document.getElementById('toggle-sidebar');
    const sidebar = document.getElementById('sidebar');
    const mainContent = document.getElementById('main-content');
    const passwordStrength = document.getElementById('strength-indicator');
    const signupPassword = document.getElementById('signup-password');
    const toggleDarkModeBtn = document.getElementById('toggle-dark-mode');
    const exportHistoryBtn = document.getElementById('export-history');
    const showTestimonials = document.getElementById('show-testimonials');

    let currentUser = null;
    let qrHistoryData = [];

    // Initialize
    init();

    function init() {
        // Show Login Modal initially
        loginModal.style.display = 'flex';
        loginModal.setAttribute('aria-hidden', 'false');

        // Event Listeners
        showSignup.addEventListener('click', () => {
            loginModal.style.display = 'none';
            loginModal.setAttribute('aria-hidden', 'true');
            signupModal.style.display = 'flex';
            signupModal.setAttribute('aria-hidden', 'false');
            clearErrors();
        });

        showLogin.addEventListener('click', () => {
            signupModal.style.display = 'none';
            signupModal.setAttribute('aria-hidden', 'true');
            loginModal.style.display = 'flex';
            loginModal.setAttribute('aria-hidden', 'false');
            clearErrors();
        });

        backToLogin.addEventListener('click', () => {
            recoverModal.style.display = 'none';
            recoverModal.setAttribute('aria-hidden', 'true');
            loginModal.style.display = 'flex';
            loginModal.setAttribute('aria-hidden', 'false');
            clearErrors();
        });

        showLogin.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                showLogin.click();
            }
        });

        showSignup.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                showSignup.click();
            }
        });

        backToLogin.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                backToLogin.click();
            }
        });

        signupBtn.addEventListener('click', handleSignup);
        loginBtn.addEventListener('click', handleLogin);
        recoverBtn.addEventListener('click', handlePasswordRecovery);
        logoutBtn.addEventListener('click', handleLogout);
        generateQRBtn.addEventListener('click', generateQRCode);
        downloadQRBtn.addEventListener('click', downloadQRCode);
        shareQRBtn.addEventListener('click', shareQRCode);
        themeSelect.addEventListener('change', changeTheme);
        contactForm.addEventListener('submit', handleContactForm);
        toggleSidebarBtn.addEventListener('click', toggleSidebar);
        navButtons.forEach(button => {
            button.addEventListener('click', navigateSection);
        });
        signupPassword.addEventListener('input', evaluatePasswordStrength);
        toggleDarkModeBtn.addEventListener('click', toggleDarkMode);
        exportHistoryBtn.addEventListener('click', exportHistoryAsCSV);

        // Load users to admin dashboard
        loadUsers();

        // Keyboard Accessibility for modals
        document.addEventListener('keydown', handleKeyDown);
    }

    // Clear error messages
    function clearErrors() {
        loginError.textContent = '';
        signupError.textContent = '';
        errorMessage.textContent = '';
        contactSuccess.textContent = '';
        contactError.textContent = '';
        document.getElementById('recover-success').textContent = '';
        document.getElementById('recover-error').textContent = '';
    }

    // Handle Sign-Up
    function handleSignup() {
        const name = document.getElementById('signup-name').value.trim();
        const username = document.getElementById('signup-username').value.trim();
        const password = document.getElementById('signup-password').value.trim();

        if (!name || !username || !password) {
            signupError.textContent = 'All fields are required.';
            return;
        }

        // Retrieve users from localStorage
        let users = JSON.parse(localStorage.getItem('users')) || [];

        // Check if username already exists
        const userExists = users.some(user => user.username === username);
        if (userExists) {
            signupError.textContent = 'Username already exists.';
            return;
        }

        // Add new user
        users.push({ name, username, password });
        localStorage.setItem('users', JSON.stringify(users));

        // Initialize login history for the new user
        const historyKey = `login_history_${username}`;
        localStorage.setItem(historyKey, JSON.stringify([]));

        signupError.textContent = '';
        alert('Registration successful! Please log in.');
        signupModal.style.display = 'none';
        signupModal.setAttribute('aria-hidden', 'true');
        loginModal.style.display = 'flex';
        loginModal.setAttribute('aria-hidden', 'false');
    }

    // Handle Login
    function handleLogin() {
        const username = document.getElementById('login-username').value.trim();
        const password = document.getElementById('login-password').value.trim();

        if (!username || !password) {
            loginError.textContent = 'Both fields are required.';
            return;
        }

        // Retrieve users from localStorage
        let users = JSON.parse(localStorage.getItem('users')) || [];

        // Find user
        const user = users.find(user => user.username === username && user.password === password);
        if (user) {
            currentUser = user;
            loginModal.style.display = 'none';
            loginModal.setAttribute('aria-hidden', 'true');
            initializeUserSession();
            logUserLogin(username);
        } else {
            loginError.textContent = 'Invalid username or password.';
        }
    }

    // Handle Password Recovery
    function handlePasswordRecovery() {
        const email = document.getElementById('recover-email').value.trim();

        if (!email) {
            document.getElementById('recover-error').textContent = 'Email is required.';
            return;
        }

        // Simulate email verification
        // In a real application, you'd send an email with a recovery link
        document.getElementById('recover-success').textContent = 'Password recovery instructions have been sent to your email.';
        document.getElementById('recover-error').textContent = '';
    }

    // Initialize User Session
    function initializeUserSession() {
        profileName.textContent = currentUser.name;
        profileUsername.textContent = currentUser.username;

        // Load QR history
        loadQRHistory();

        // If admin, load admin dashboard
        if (currentUser.username === 'admin') {
            loadUsers();
            loadLoginHistory();
        }

        // Show Home section
        showSection('home');
    }

    // Handle Logout
    function handleLogout() {
        if (confirm('Are you sure you want to logout?')) {
            currentUser = null;
            qrHistoryData = [];
            qrHistory.innerHTML = '<li>No QR codes generated yet</li>';
            location.reload();
        }
    }

    // Toggle Sidebar
    function toggleSidebar() {
        if (sidebar.style.left === '0px') {
            sidebar.style.left = '-250px';
            sidebar.setAttribute('aria-hidden', 'true');
        } else {
            sidebar.style.left = '0px';
            sidebar.setAttribute('aria-hidden', 'false');
        }
    }

    // Change Theme
    function changeTheme(e) {
        const theme = e.target.value;
        document.body.classList.remove('light-theme', 'dark-theme');

        if (theme === 'light') {
            document.body.classList.add('light-theme');
        } else if (theme === 'dark') {
            document.body.classList.add('dark-theme');
        }
    }

    // Toggle Dark Mode
    function toggleDarkMode() {
        document.body.classList.toggle('dark-theme');
        document.body.classList.toggle('light-theme');
    }

    // Generate QR Code
    function generateQRCode() {
        const text = qrInput.value.trim();
        const color = qrColor.value.replace('#', '');
        const size = qrSize.value;

        if (!text) {
            errorMessage.textContent = 'Please enter text to generate QR code.';
            return;
        }

        errorMessage.textContent = '';
        qrContainer.innerHTML = ''; // Clear previous QR

        // Using third-party QR generator with color customization
        const qrCode = document.createElement('img');
        qrCode.src = `https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(text)}&size=${size}x${size}&color=${color}`;
        qrCode.alt = 'Generated QR Code';
        qrContainer.appendChild(qrCode);

        // Save to QR history
        qrHistoryData.push({ text, color, size, timestamp: new Date().toLocaleString() });
        updateQRHistory();

        // If admin, update user list
        if (currentUser.username === 'admin') {
            loadUsers();
        }
    }

    // Download QR Code
    function downloadQRCode() {
        const qrImg = qrContainer.querySelector('img');
        if (qrImg) {
            const link = document.createElement('a');
            link.href = qrImg.src;
            link.download = 'qr-code.png';
            link.click();
        } else {
            errorMessage.textContent = 'No QR code to download.';
        }
    }

    // Share QR Code
    async function shareQRCode() {
        const qrImg = qrContainer.querySelector('img');
        if (qrImg && navigator.share) {
            try {
                const response = await fetch(qrImg.src);
                const blob = await response.blob();
                const filesArray = [new File([blob], 'qr-code.png', { type: blob.type })];
                await navigator.share({
                    files: filesArray,
                    title: 'QR Code',
                    text: 'Here is your QR code!'
                });
            } catch (error) {
                errorMessage.textContent = 'Error sharing QR code.';
            }
        } else {
            errorMessage.textContent = 'Sharing functionality is not supported on this device.';
        }
    }

    // Update QR History in Sidebar
    function updateQRHistory() {
        qrHistory.innerHTML = '';
        if (qrHistoryData.length === 0) {
            qrHistory.innerHTML = '<li>No QR codes generated yet</li>';
            return;
        }
        qrHistoryData.forEach(item => {
            const li = document.createElement('li');
            li.textContent = `${item.text} (${item.size}x${item.size}) - ${item.timestamp}`;
            qrHistory.appendChild(li);
        });
    }

    // Load QR History from localStorage
    function loadQRHistory() {
        if (!currentUser) return;
        const historyKey = `qr_history_${currentUser.username}`;
        qrHistoryData = JSON.parse(localStorage.getItem(historyKey)) || [];
        updateQRHistory();
    }

    // Save QR History to localStorage
    function saveQRHistory() {
        if (!currentUser) return;
        const historyKey = `qr_history_${currentUser.username}`;
        localStorage.setItem(historyKey, JSON.stringify(qrHistoryData));
    }

    // Navigate to different sections
    function navigateSection(e) {
        const section = e.target.getAttribute('data-section');
        if (section === 'admin-dashboard' && currentUser.username !== 'admin') {
            alert('Access denied. Admins only.');
            return;
        }
        showSection(section);
        toggleSidebarBtn.style.display = 'block';
        if (sidebar.style.left === '0px') {
            toggleSidebar();
        }
    }

    // Show specific section
    function showSection(sectionId) {
        const sections = document.querySelectorAll('.section');
        sections.forEach(sec => {
            if (sec.id === sectionId) {
                sec.style.display = 'block';
            } else {
                sec.style.display = 'none';
            }
        });

        // If Admin Dashboard, load users
        if (sectionId === 'admin-dashboard' && currentUser.username === 'admin') {
            loadUsers();
            loadLoginHistory();
        }
    }

    // Handle Contact Form Submission
    function handleContactForm(e) {
        e.preventDefault();
        const name = document.getElementById('contact-name').value.trim();
        const email = document.getElementById('contact-email').value.trim();
        const message = document.getElementById('contact-message').value.trim();

        if (!name || !email || !message) {
            contactError.textContent = 'All fields are required.';
            contactSuccess.textContent = '';
            return;
        }

        // Simulate form submission
        contactSuccess.textContent = 'Your message has been sent successfully!';
        contactError.textContent = '';
        contactForm.reset();
    }

    // Load Users for Admin Dashboard
    function loadUsers() {
        if (currentUser.username !== 'admin') return;

        let users = JSON.parse(localStorage.getItem('users')) || [];
        userList.innerHTML = '';
        users.forEach(user => {
            const li = document.createElement('li');
            li.textContent = `Name: ${user.name}, Username: ${user.username}`;
            userList.appendChild(li);
        });
        totalUsers.textContent = users.length;
    }

    // Log User Login for Admin
    function logUserLogin(username) {
        const historyKey = `login_history_${username}`;
        let history = JSON.parse(localStorage.getItem(historyKey)) || [];
        history.push(`Logged in at ${new Date().toLocaleString()}`);
        localStorage.setItem(historyKey, JSON.stringify(history));
    }

    // Load Login History for Admin Dashboard
    function loadLoginHistory() {
        if (currentUser.username !== 'admin') return;

        let users = JSON.parse(localStorage.getItem('users')) || [];
        loginHistory.innerHTML = '';
        users.forEach(user => {
            const historyKey = `login_history_${user.username}`;
            let history = JSON.parse(localStorage.getItem(historyKey)) || [];
            history.forEach(entry => {
                const li = document.createElement('li');
                li.textContent = `User: ${user.username} - ${entry}`;
                loginHistory.appendChild(li);
            });
        });
        if (loginHistory.innerHTML === '') {
            loginHistory.innerHTML = '<li>No login history available.</li>';
        }
    }

    // Evaluate Password Strength
    function evaluatePasswordStrength() {
        const password = signupPassword.value;
        let strength = 'Weak';
        let color = '#ff4d4d';

        if (password.length >= 8) {
            if (/[A-Z]/.test(password) && /\d/.test(password)) {
                strength = 'Strong';
                color = '#4dff88';
            } else {
                strength = 'Medium';
                color = '#ffb84d';
            }
        }

        passwordStrength.textContent = strength;
        passwordStrength.style.color = color;
    }

    // Handle Key Down for Accessibility
    function handleKeyDown(e) {
        if (e.key === 'Escape') {
            closeAllModals();
        }
    }

    // Close all modals
    function closeAllModals() {
        [loginModal, signupModal, recoverModal].forEach(modal => {
            modal.style.display = 'none';
            modal.setAttribute('aria-hidden', 'true');
        });
    }

    // Export QR History as CSV
    function exportHistoryAsCSV() {
        if (qrHistoryData.length === 0) {
            alert('No QR history to export.');
            return;
        }

        let csvContent = "data:text/csv;charset=utf-8,";
        csvContent += "Text,Color,Size,Timestamp\n";
        qrHistoryData.forEach(item => {
            const row = `${escapeCSV(item.text)},#${item.color},${item.size}x${item.size},${item.timestamp}`;
            csvContent += row + "\n";
        });

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "qr_history.csv");
        document.body.appendChild(link); // Required for FF

        link.click();
        document.body.removeChild(link);
    }

    // Helper function to escape CSV fields
    function escapeCSV(text) {
        if (text.includes(',') || text.includes('"') || text.includes('\n')) {
            return `"${text.replace(/"/g, '""')}"`;
        }
        return text;
    }

    // Export Functionality Ends

    // Save QR History when page unloads
    window.addEventListener('beforeunload', saveQRHistory);
});
