// Importando módulos
import { AdminAuthManager } from './modules/admin-auth.js';
import { initDashboard } from './components/dashboard.js';

// Inicializando o Firebase
const firebaseConfig = window.firebaseConfig;
firebase.initializeApp(firebaseConfig);

// Referências aos elementos do DOM
const loginSection = document.getElementById('login-section');
const dashboardSection = document.getElementById('dashboard-section');
const loginForm = document.getElementById('admin-login-form');
const loginError = document.getElementById('login-error');
const emailInput = document.getElementById('admin-email');
const passwordInput = document.getElementById('admin-password');
const emailError = document.getElementById('email-error');
const passwordError = document.getElementById('password-error');

// Instanciando o gerenciador de autenticação
const adminAuth = new AdminAuthManager(firebase);
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
    loginSection.style.display = 'block';
    dashboardSection.style.display = 'none';
    loginError.style.display = 'none';
    clearFormErrors();
}

// Função para mostrar o dashboard
function showDashboard() {
    loginSection.style.display = 'none';
    dashboardSection.style.display = 'block';
    
    // Carregar conteúdo do dashboard
    loadDashboard();
}

// Função para carregar o conteúdo do dashboard
function loadDashboard() {
    const dashboardContent = document.getElementById('dashboard-content');
    dashboardContent.innerHTML = `
        <div class="main-content">
            <div id="navigation-container"></div>
            <div id="page-content-container">
                <div class="page-content" id="main-page-content">
                    <h2>Bem-vindo ao Painel Administrativo</h2>
                    <p>Selecione uma opção no menu acima para começar.</p>
                </div>
            </div>
        </div>
    `;
    
    // Inicializar navegação
    initNavigation();
    
    // Adicionar evento de logout
    document.getElementById('logout-btn').addEventListener('click', () => {
        adminAuth.logout();
    });
}

// Função para inicializar a navegação
function initNavigation() {
    const navContainer = document.getElementById('navigation-container');
    if (!navContainer) return;
    
    // Importar componente de navegação
    import('./components/navigation.js').then(({ initNavigation }) => {
        initNavigation(navContainer, handleNavigation);
        
        // Ativar item de dashboard por padrão
        import('./components/navigation.js').then(({ activateNavItem }) => {
            activateNavItem(navContainer, 'dashboard');
        });
    }).catch(error => {
        console.error('Erro ao carregar componente de navegação:', error);
    });
}

// Função para lidar com a navegação
function handleNavigation(pageId) {
    const pageContent = document.getElementById('main-page-content');
    if (!pageContent) return;
    
    switch (pageId) {
        case 'dashboard':
            loadDashboardPage(pageContent);
            break;
        case 'users':
            loadUsersPage(pageContent);
            break;
        case 'stats':
            loadStatsPage(pageContent);
            break;
        case 'config':
            loadConfigPage(pageContent);
            break;
        case 'logs':
            loadLogsPage(pageContent);
            break;
        default:
            pageContent.innerHTML = `
                <h2>Página não encontrada</h2>
                <p>A página solicitada não foi encontrada.</p>
            `;
    }
}

// Função para carregar a página do dashboard
function loadDashboardPage(container) {
    container.innerHTML = `
        <h2>Dashboard</h2>
        <div id="dashboard-container">
            <!-- O dashboard será carregado aqui -->
        </div>
    `;
    
    // Inicializar o dashboard
    const dashboardContainer = document.getElementById('dashboard-container');
    if (dashboardContainer) {
        dashboardManager = initDashboard(dashboardContainer, firebase.database());
    }
}

// Função para carregar a página de usuários
function loadUsersPage(container) {
    container.innerHTML = `
        <h2>Gerenciamento de Usuários</h2>
        <p>Funcionalidade de gerenciamento de usuários em desenvolvimento.</p>
        <div class="grid">
            <div class="card">
                <h3>Total de Usuários</h3>
                <p>-</p>
            </div>
            <div class="card">
                <h3>Usuários Ativos (24h)</h3>
                <p>-</p>
            </div>
        </div>
    `;
}

// Função para carregar a página de estatísticas
function loadStatsPage(container) {
    container.innerHTML = `
        <h2>Estatísticas</h2>
        <p>Funcionalidade de visualização de estatísticas em desenvolvimento.</p>
        <div class="grid">
            <div class="card">
                <h3>Capturas por Hora</h3>
                <p>Gráfico em desenvolvimento</p>
            </div>
            <div class="card">
                <h3>Localizações Populares</h3>
                <p>Gráfico em desenvolvimento</p>
            </div>
        </div>
    `;
}

// Função para carregar a página de configurações
function loadConfigPage(container) {
    container.innerHTML = `
        <h2>Configurações do Jogo</h2>
        <p>Funcionalidade de configurações do jogo em desenvolvimento.</p>
        <div class="grid">
            <div class="card">
                <h3>Configurações Gerais</h3>
                <p>Formulário em desenvolvimento</p>
            </div>
            <div class="card">
                <h3>Configurações de Localização</h3>
                <p>Formulário em desenvolvimento</p>
            </div>
        </div>
    `;
}

// Função para carregar a página de logs
function loadLogsPage(container) {
    container.innerHTML = `
        <h2>Logs do Sistema</h2>
        <p>Funcionalidade de visualização de logs em desenvolvimento.</p>
        <div class="grid">
            <div class="card">
                <h3>Últimos Logs</h3>
                <p>Tabela em desenvolvimento</p>
            </div>
            <div class="card">
                <h3>Busca de Logs</h3>
                <p>Filtro em desenvolvimento</p>
            </div>
        </div>
    `;
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

console.log('Painel Administrativo inicializado');