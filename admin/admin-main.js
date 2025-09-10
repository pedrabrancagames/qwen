// Importando módulos
import { AdminAuthManager } from './modules/admin-auth.js';
import { UserManager } from './modules/user-manager.js';
import { StatsManager } from './modules/stats-manager.js';
import { ConfigManager } from './modules/config-manager.js';
import { AuditManager } from './modules/audit-manager.js';
import { initDashboard } from './components/dashboard.js';
import { initUserList } from './components/user-list.js';
import { initUserDetail } from './components/user-detail.js';
import { initReports } from './components/reports.js';
import { initSettings } from './components/settings.js';
import { initLocations } from './components/locations.js';
import { initLogs } from './components/logs.js';
import { initSystemLogs } from './components/system-logs.js';
import { notificationSystem } from './components/notification-system.js';

// Inicializando o Firebase
const firebaseConfig = window.firebaseConfig;
firebase.initializeApp(firebaseConfig);

// Referências aos elementos do DOM
const loginSection = document.getElementById('login-section');
const dashboardSection = document.getElementById('dashboard-section');
const usersSection = document.getElementById('users-section');
const userDetailSection = document.getElementById('user-detail-section');
const reportsSection = document.getElementById('reports-section');
const settingsSection = document.getElementById('settings-section');
const locationsSection = document.getElementById('locations-section');
const logsSection = document.getElementById('logs-section');
const systemLogsSection = document.getElementById('system-logs-section');
const mainNav = document.getElementById('main-nav');
const loginForm = document.getElementById('admin-login-form');
const loginError = document.getElementById('login-error');
const emailInput = document.getElementById('admin-email');
const passwordInput = document.getElementById('admin-password');
const emailError = document.getElementById('email-error');
const passwordError = document.getElementById('password-error');

// Instanciando os gerenciadores
const adminAuth = new AdminAuthManager(firebase);
const userManager = new UserManager(firebase.database());
const statsManager = new StatsManager(firebase.database());
const configManager = new ConfigManager(firebase.database());
const auditManager = new AuditManager(firebase.database());

let dashboardManager = null;

// Verificando se o usuário já está autenticado
adminAuth.onAuthStateChanged((user) => {
    if (user) {
        // Verificar privilégios administrativos
        adminAuth.checkAdminPrivileges(user).then(isAdmin => {
            if (isAdmin) {
                showDashboard();
            } else {
                // Usuário autenticado, mas não é admin
                adminAuth.logout();
                showLogin();
                showError('Acesso negado. Você não tem privilégios administrativos.');
            }
        }).catch(error => {
            console.error('Erro ao verificar privilégios:', error);
            adminAuth.logout();
            showLogin();
            showError('Erro ao verificar privilégios. Por favor, faça login novamente.');
        });
    } else {
        showLogin();
    }
});

// Função para mostrar a seção de login
function showLogin() {
    // Esconder todas as seções
    hideAllSections();
    
    // Mostrar seção de login
    loginSection.style.display = 'block';
    mainNav.style.display = 'none';
    
    // Limpar erros
    loginError.style.display = 'none';
    clearFormErrors();
}

// Função para mostrar o dashboard
function showDashboard() {
    // Esconder todas as seções
    hideAllSections();
    
    // Mostrar dashboard e navegação
    dashboardSection.style.display = 'block';
    mainNav.style.display = 'block';
    
    // Carregar conteúdo do dashboard
    loadDashboard();
}

// Função para mostrar a seção de usuários
function showUsers() {
    // Esconder todas as seções
    hideAllSections();
    
    // Mostrar seção de usuários e navegação
    usersSection.style.display = 'block';
    mainNav.style.display = 'block';
    
    // Carregar conteúdo de usuários
    loadUsers();
}

// Função para mostrar a seção de detalhes do usuário
function showUserDetail(userId) {
    // Esconder todas as seções
    hideAllSections();
    
    // Mostrar seção de detalhes do usuário e navegação
    userDetailSection.style.display = 'block';
    mainNav.style.display = 'block';
    
    // Carregar conteúdo de detalhes do usuário
    loadUserDetail(userId);
}

// Função para mostrar a seção de relatórios
function showReports() {
    // Esconder todas as seções
    hideAllSections();
    
    // Mostrar seção de relatórios e navegação
    reportsSection.style.display = 'block';
    mainNav.style.display = 'block';
    
    // Carregar conteúdo de relatórios
    loadReports();
}

// Função para mostrar a seção de configurações
function showSettings() {
    // Esconder todas as seções
    hideAllSections();
    
    // Mostrar seção de configurações e navegação
    settingsSection.style.display = 'block';
    mainNav.style.display = 'block';
    
    // Carregar conteúdo de configurações
    loadSettings();
}

// Função para mostrar a seção de localizações
function showLocations() {
    // Esconder todas as seções
    hideAllSections();
    
    // Mostrar seção de localizações e navegação
    locationsSection.style.display = 'block';
    mainNav.style.display = 'block';
    
    // Carregar conteúdo de localizações
    loadLocations();
}

// Função para mostrar a seção de logs
function showLogs() {
    // Esconder todas as seções
    hideAllSections();
    
    // Mostrar seção de logs e navegação
    logsSection.style.display = 'block';
    mainNav.style.display = 'block';
    
    // Carregar conteúdo de logs
    loadLogs();
}

// Função para mostrar a seção de logs do sistema
function showSystemLogs() {
    // Esconder todas as seções
    hideAllSections();
    
    // Mostrar seção de logs do sistema e navegação
    systemLogsSection.style.display = 'block';
    mainNav.style.display = 'block';
    
    // Carregar conteúdo de logs do sistema
    loadSystemLogs();
}

// Função para esconder todas as seções
function hideAllSections() {
    loginSection.style.display = 'none';
    dashboardSection.style.display = 'none';
    usersSection.style.display = 'none';
    userDetailSection.style.display = 'none';
    reportsSection.style.display = 'none';
    settingsSection.style.display = 'none';
    locationsSection.style.display = 'none';
    logsSection.style.display = 'none';
    systemLogsSection.style.display = 'none';
}

// Função para carregar o conteúdo do dashboard
function loadDashboard() {
    const dashboardContent = document.getElementById('dashboard-content');
    if (!dashboardContent) return;
    
    dashboardContent.innerHTML = `
        <div class="main-content">
            <div id="dashboard-container">
                <!-- O dashboard será carregado aqui -->
            </div>
        </div>
    `;
    
    // Inicializar o dashboard
    const dashboardContainer = document.getElementById('dashboard-container');
    if (dashboardContainer) {
        initDashboard(dashboardContainer, firebase.database());
    }
    
    // Adicionar evento de logout
    document.getElementById('logout-btn').addEventListener('click', () => {
        adminAuth.logout();
    });
    
    // Ativar item de navegação
    activateNavItem('dashboard');
}

// Função para carregar o conteúdo de usuários
function loadUsers() {
    const usersContent = document.getElementById('users-content');
    if (!usersContent) return;
    
    // Inicializar a lista de usuários
    initUserList(usersContent, userManager, adminAuth);
    
    // Adicionar evento de voltar ao dashboard
    document.getElementById('back-to-dashboard-users').addEventListener('click', () => {
        showDashboard();
    });
    
    // Ativar item de navegação
    activateNavItem('users');
}

// Função para carregar o conteúdo de detalhes do usuário
function loadUserDetail(userId) {
    const userDetailContent = document.getElementById('user-detail-content');
    if (!userDetailContent) return;
    
    // Inicializar os detalhes do usuário
    initUserDetail(userDetailContent, userManager, adminAuth, userId);
    
    // Ativar item de navegação
    activateNavItem('users');
}

// Função para carregar o conteúdo de relatórios
function loadReports() {
    const reportsContent = document.getElementById('reports-content');
    if (!reportsContent) return;
    
    // Inicializar os relatórios
    initReports(reportsContent, statsManager);
    
    // Adicionar evento de voltar ao dashboard
    document.getElementById('back-to-dashboard-reports').addEventListener('click', () => {
        showDashboard();
    });
    
    // Ativar item de navegação
    activateNavItem('reports');
}

// Função para carregar o conteúdo de configurações
function loadSettings() {
    const settingsContent = document.getElementById('settings-content');
    if (!settingsContent) return;
    
    // Inicializar as configurações
    initSettings(settingsContent, configManager, adminAuth);
    
    // Adicionar evento de voltar ao dashboard
    document.getElementById('back-to-dashboard-settings').addEventListener('click', () => {
        showDashboard();
    });
    
    // Ativar item de navegação
    activateNavItem('settings');
}

// Função para carregar o conteúdo de localizações
function loadLocations() {
    const locationsContent = document.getElementById('locations-content');
    if (!locationsContent) return;
    
    // Inicializar as localizações
    initLocations(locationsContent, configManager, adminAuth);
    
    // Adicionar evento de voltar ao dashboard
    document.getElementById('back-to-dashboard-locations').addEventListener('click', () => {
        showDashboard();
    });
    
    // Ativar item de navegação
    activateNavItem('locations');
}

// Função para carregar o conteúdo de logs
function loadLogs() {
    const logsContent = document.getElementById('logs-content');
    if (!logsContent) return;
    
    // Inicializar os logs
    initLogs(logsContent, auditManager);
    
    // Adicionar evento de voltar ao dashboard
    document.getElementById('back-to-dashboard-logs').addEventListener('click', () => {
        showDashboard();
    });
    
    // Ativar item de navegação
    activateNavItem('logs');
}

// Função para carregar o conteúdo de logs do sistema
function loadSystemLogs() {
    const systemLogsContent = document.getElementById('system-logs-content');
    if (!systemLogsContent) return;
    
    // Inicializar os logs do sistema
    initSystemLogs(systemLogsContent, auditManager);
    
    // Adicionar evento de voltar ao dashboard
    document.getElementById('back-to-dashboard-system-logs').addEventListener('click', () => {
        showDashboard();
    });
    
    // Ativar item de navegação
    activateNavItem('system-logs');
}

// Função para ativar um item de navegação
function activateNavItem(sectionId) {
    // Remover classe active de todos os itens
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.classList.remove('active');
    });
    
    // Adicionar classe active ao item correspondente
    const activeItem = document.querySelector(`.nav-item a[href="#${sectionId}"]`);
    if (activeItem) {
        activeItem.closest('.nav-item').classList.add('active');
    }
}

// Função para lidar com a navegação por hash
function handleHashNavigation() {
    const hash = window.location.hash;
    
    switch (hash) {
        case '#dashboard':
            showDashboard();
            break;
        case '#users':
            showUsers();
            break;
        case '#reports':
            showReports();
            break;
        case '#settings':
            showSettings();
            break;
        case '#locations':
            showLocations();
            break;
        case '#logs':
            showLogs();
            break;
        case '#system-logs':
            showSystemLogs();
            break;
        case '':
            showDashboard();
            break;
        default:
            // Verificar se é uma rota de detalhes de usuário
            if (hash.startsWith('#user-detail/')) {
                const userId = hash.split('/')[1];
                showUserDetail(userId);
            } else {
                showDashboard();
            }
    }
}

// Adicionar evento de mudança de hash
window.addEventListener('hashchange', handleHashNavigation);

// Função para lidar com cliques na navegação
function setupNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const href = link.getAttribute('href');
            window.location.hash = href;
        });
    });
    
    // Adicionar eventos para botões de voltar
    document.getElementById('back-to-users').addEventListener('click', () => {
        window.location.hash = '#users';
    });
}

// Função para limpar erros do formulário
function clearFormErrors() {
    emailError.style.display = 'none';
    passwordError.style.display = 'none';
    emailInput.classList.remove('invalid');
    passwordInput.classList.remove('invalid');
}

// Função para mostrar erro em campo específico
function showFieldError(field, errorElement, message) {
    field.classList.add('invalid');
    errorElement.textContent = message;
    errorElement.style.display = 'block';
}

// Função para validar o formulário
function validateForm() {
    let isValid = true;
    clearFormErrors();
    
    const email = emailInput.value.trim();
    const password = passwordInput.value;
    
    // Validar email
    if (!email) {
        showFieldError(emailInput, emailError, 'O email é obrigatório.');
        isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
        showFieldError(emailInput, emailError, 'Por favor, insira um email válido.');
        isValid = false;
    }
    
    // Validar senha
    if (!password) {
        showFieldError(passwordInput, passwordError, 'A senha é obrigatória.');
        isValid = false;
    } else if (password.length < 6) {
        showFieldError(passwordInput, passwordError, 'A senha deve ter pelo menos 6 caracteres.');
        isValid = false;
    }
    
    return isValid;
}

// Evento de envio do formulário de login
loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // Validar formulário
    if (!validateForm()) {
        return;
    }
    
    const email = emailInput.value.trim();
    const password = passwordInput.value;
    
    // Limpar mensagens de erro anteriores
    loginError.style.display = 'none';
    
    // Desabilitar botão durante o processo
    const submitButton = loginForm.querySelector('button');
    const originalText = submitButton.textContent;
    submitButton.disabled = true;
    submitButton.innerHTML = '<span class="loading"></span> Autenticando...';
    
    try {
        await adminAuth.authenticateAdmin(email, password);
        // A verificação de privilégios e redirecionamento será feita pelo listener de auth state
    } catch (error) {
        console.error('Erro de autenticação:', error);
        showError('Falha na autenticação. Verifique suas credenciais.');
    } finally {
        // Reabilitar botão
        submitButton.disabled = false;
        submitButton.textContent = originalText;
    }
});

// Função para mostrar erros
function showError(message) {
    loginError.textContent = message;
    loginError.style.display = 'block';
}

// Função para mostrar sucesso
function showSuccess(message) {
    const successElement = document.getElementById('login-success');
    successElement.textContent = message;
    successElement.style.display = 'block';
    
    // Remover mensagem após 3 segundos
    setTimeout(() => {
        successElement.style.display = 'none';
    }, 3000);
}

// Inicializar navegação quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
    setupNavigation();
    handleHashNavigation();
});

console.log('Painel Administrativo inicializado');