// Main Application Router and State Management
// AI-Enhanced Employee Quiz & Assessment Platform

class EmployeeAssessmentApp {
    constructor() {
        this.currentPage = this.getCurrentPage();
        this.user = this.getCurrentUser();
        this.sidebarOpen = false;
        this.selectedQuizId = null;
        this.selectedAttemptId = null;
        
        this.init();
    }
    
    init() {
        this.setupNavigation();
        this.setupEventListeners();
        this.renderPage();
    }
    
    getCurrentPage() {
        const params = new URLSearchParams(window.location.search);
        return params.get('page') || 'login';
    }
    
    setCurrentPage(page, params = {}) {
        const url = new URL(window.location);
        url.searchParams.set('page', page);
        if (params.quizId) url.searchParams.set('quizId', params.quizId);
        if (params.attemptId) url.searchParams.set('attemptId', params.attemptId);
        window.history.pushState({}, '', url);
        this.currentPage = page;
        this.selectedQuizId = params.quizId || null;
        this.selectedAttemptId = params.attemptId || null;
        this.renderPage();
    }
    
    getCurrentUser() {
        const userData = localStorage.getItem('eap_current_user');
        return userData ? JSON.parse(userData) : null;
    }
    
    setCurrentUser(user) {
        if (user) {
            localStorage.setItem('eap_current_user', JSON.stringify(user));
            this.user = user;
        } else {
            localStorage.removeItem('eap_current_user');
            this.user = null;
        }
    }
    
    setupNavigation() {
        // Handle browser back/forward
        window.addEventListener('popstate', () => {
            this.currentPage = this.getCurrentPage();
            this.renderPage();
        });
    }
    
    setupEventListeners() {
        // Mobile sidebar toggle
        const sidebarToggle = document.getElementById('sidebarToggle');
        if (sidebarToggle) {
            sidebarToggle.addEventListener('click', () => this.toggleSidebar());
        }
        
        // Logout button
        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => this.logout());
        }
    }
    
    toggleSidebar() {
        this.sidebarOpen = !this.sidebarOpen;
        const sidebar = document.getElementById('sidebar');
        if (sidebar) {
            sidebar.classList.toggle('show');
        }
    }
    
    logout() {
        this.setCurrentUser(null);
        this.setCurrentPage('login');
    }
    
    isAuthenticated() {
        return !!this.user;
    }
    
    isAdmin() {
        return this.user?.role === 'admin';
    }
    
    renderPage() {
        // Hide/show navbar and sidebar based on page
        const navbar = document.getElementById('navbar');
        const sidebar = document.getElementById('sidebar');
        const mainContent = document.getElementById('mainContent');
        
        const isAuthPage = ['login', 'admin-login', 'register', 'admin-register'].includes(this.currentPage);
        
        if (navbar) navbar.style.display = isAuthPage ? 'none' : 'block';
        if (sidebar) sidebar.style.display = isAuthPage ? 'none' : 'block';
        
        // Load the appropriate page
        this.loadPage(this.currentPage);
    }
    
    async loadPage(page) {
        const mainContent = document.getElementById('mainContent');
        if (!mainContent) return;
        
        // Clear content
        mainContent.innerHTML = '<div class="text-center py-5"><div class="spinner-border"></div></div>';
        
        try {
            let html = '';
            switch (page) {
                case 'login':
                    html = await this.loadHTML('login');
                    break;
                case 'admin-login':
                    html = await this.loadHTML('admin-login');
                    break;
                case 'register':
                    html = await this.loadHTML('register');
                    break;
                case 'admin-register':
                    html = await this.loadHTML('admin-register');
                    break;
                case 'employee-dashboard':
                    html = await this.loadHTML('employee-dashboard');
                    break;
                case 'admin-dashboard':
                    html = await this.loadHTML('admin-dashboard');
                    break;
                case 'quiz':
                    html = await this.loadHTML('quiz');
                    break;
                case 'result':
                    html = await this.loadHTML('result');
                    break;
                case 'create-quiz':
                    html = await this.loadHTML('create-quiz');
                    break;
                case 'manage-quiz':
                    html = await this.loadHTML('manage-quiz');
                    break;
                case 'add-question':
                    html = await this.loadHTML('add-question');
                    break;
                case 'all-results':
                    html = await this.loadHTML('all-results');
                    break;
                case 'ml-insights':
                    html = await this.loadHTML('ml-insights');
                    break;
                default:
                    html = await this.loadHTML('login');
            }
            mainContent.innerHTML = html;
            this.initPageScripts(page);
        } catch (error) {
            mainContent.innerHTML = '<div class="alert alert-danger">Error loading page</div>';
            console.error(error);
        }
    }
    
    async loadHTML(page) {
        const response = await fetch(`pages/${page}.html`);
        return response.text();
    }
    
    initPageScripts(page) {
        // Initialize page-specific JavaScript
        switch (page) {
            case 'login':
                initLoginPage();
                break;
            case 'admin-login':
                initAdminLoginPage();
                break;
            case 'register':
                initRegisterPage();
                break;
            case 'admin-register':
                initAdminRegisterPage();
                break;
            case 'employee-dashboard':
                initEmployeeDashboard();
                break;
            case 'admin-dashboard':
                initAdminDashboard();
                break;
            case 'quiz':
                initQuizPage(this.selectedQuizId);
                break;
            case 'result':
                initResultPage(this.selectedAttemptId);
                break;
            case 'create-quiz':
                initCreateQuizPage();
                break;
            case 'manage-quiz':
                initManageQuizPage();
                break;
            case 'add-question':
                initAddQuestionPage(this.selectedQuizId);
                break;
            case 'all-results':
                initAllResultsPage();
                break;
            case 'ml-insights':
                initMLInsightsPage();
                break;
        }
    }
}

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.app = new EmployeeAssessmentApp();
});