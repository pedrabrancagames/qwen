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
const emailInput = document.getElementById('admin-email');
const passwordInput = document.getElementById('admin-password');
const emailError = document.getElementById('email-error');
const passwordError = document.getElementById('password-error');

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
        <div class="grid">
            <div class="card">
                <h3>Visão Geral</h3>
                <p>Bem-vindo ao Painel Administrativo do Ghost Squad.</p>
                <p>Aqui você pode gerenciar usuários, visualizar estatísticas e configurar o jogo.</p>
            </div>
            <div class="card">
                <h3>Ações Rápidas</h3>
                <ul>
                    <li><a href="#" id="manage-users-link">Gerenciar Usuários</a></li>
                    <li><a href="#" id="view-stats-link">Visualizar Estatísticas</a></li>
                    <li><a href="#" id="manage-config-link">Configurações do Jogo</a></li>
                </ul>
            </div>
        </div>
    `;
    
    // Adicionar evento de logout
    document.getElementById('logout-btn').addEventListener('click', () => {
        adminAuth.logout();
    });
    
    // Adicionar eventos para links do dashboard
    document.getElementById('manage-users-link')?.addEventListener('click', (e) => {
        e.preventDefault();
        alert('Funcionalidade de gerenciamento de usuários em desenvolvimento.');
    });
    
    document.getElementById('view-stats-link')?.addEventListener('click', (e) => {
        e.preventDefault();
        alert('Funcionalidade de visualização de estatísticas em desenvolvimento.');
    });
    
    document.getElementById('manage-config-link')?.addEventListener('click', (e) => {
        e.preventDefault();
        alert('Funcionalidade de configurações do jogo em desenvolvimento.');
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

console.log('Painel Administrativo inicializado');