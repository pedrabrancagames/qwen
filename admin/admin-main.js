// Importando módulos
import { AdminAuthManager } from './modules/admin-auth.js';

// Inicializando o Firebase
const firebaseConfig = window.firebaseConfig;
firebase.initializeApp(firebaseConfig);

// Referências aos elementos do DOM
const loginSection = document.getElementById('login-section');
const dashboardSection = document.getElementById('dashboard-section');
const loginForm = document.getElementById('admin-login-form');
const loginError = document.getElementById('login-error');

// Instanciando o gerenciador de autenticação
const adminAuth = new AdminAuthManager(firebase);

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
        <h3>Bem-vindo ao Painel Administrativo</h3>
        <p>Você está autenticado como administrador.</p>
        <button id="logout-btn">Sair</button>
    `;
    
    // Adicionar evento de logout
    document.getElementById('logout-btn').addEventListener('click', () => {
        adminAuth.logout();
    });
}

// Evento de envio do formulário de login
loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const email = document.getElementById('admin-email').value;
    const password = document.getElementById('admin-password').value;
    
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
    const successMessage = document.createElement('div');
    successMessage.className = 'success-message';
    successMessage.textContent = message;
    loginSection.appendChild(successMessage);
    
    // Remover mensagem após 3 segundos
    setTimeout(() => {
        successMessage.remove();
    }, 3000);
}

console.log('Painel Administrativo inicializado');