/**
 * Gerenciador de Autenticação Administrativa
 * 
 * Classe responsável por gerenciar a autenticação de administradores
 * usando Firebase Authentication.
 */
export class AdminAuthManager {
    /**
     * Construtor do AdminAuthManager
     * @param {Object} firebase - Instância do Firebase
     */
    constructor(firebase) {
        this.firebase = firebase;
        this.auth = firebase.auth();
        this.database = firebase.database();
        
        // Configurar timeout automático após 30 minutos de inatividade
        this.setupAutoLogout();
        
        // Armazenar informações do administrador logado
        this.currentAdmin = null;
    }
    
    /**
     * Autentica um administrador usando email e senha
     * @param {string} email - Email do administrador
     * @param {string} password - Senha do administrador
     * @returns {Promise<User>} - Promise que resolve com o usuário autenticado
     */
    async authenticateAdmin(email, password) {
        try {
            const userCredential = await this.auth.signInWithEmailAndPassword(email, password);
            const user = userCredential.user;
            
            // Verificar privilégios administrativos
            const isAdmin = await this.checkAdminPrivileges(user);
            if (!isAdmin) {
                await this.logout();
                throw new Error('USER_NOT_ADMIN');
            }
            
            // Carregar dados do administrador
            await this.loadAdminData(user.uid);
            
            // Registrar login no log de auditoria
            await this.logAdminAction(user.uid, 'login', {
                email: user.email,
                timestamp: new Date().toISOString()
            });
            
            return user;
        } catch (error) {
            console.error('Erro na autenticação:', error);
            if (error.code === 'auth/wrong-password' || error.code === 'auth/user-not-found') {
                throw new Error('Credenciais inválidas.');
            } else if (error.message === 'USER_NOT_ADMIN') {
                throw new Error('Acesso negado. Você não tem privilégios administrativos.');
            }
            throw error;
        }
    }
    
    /**
     * Carrega os dados do administrador logado
     * @param {string} adminId - ID do administrador
     */
    async loadAdminData(adminId) {
        try {
            const adminRef = this.database.ref(`admins/${adminId}`);
            const snapshot = await adminRef.once('value');
            this.currentAdmin = snapshot.val();
            
            // Atualizar último login
            if (this.currentAdmin) {
                await adminRef.update({
                    lastLogin: new Date().toISOString()
                });
            }
        } catch (error) {
            console.error('Erro ao carregar dados do administrador:', error);
        }
    }
    
    /**
     * Verifica se o usuário tem privilégios administrativos
     * @param {User} user - Usuário do Firebase
     * @returns {Promise<boolean>} - Promise que resolve com true se for admin
     */
    async checkAdminPrivileges(user) {
        try {
            // Verificar se o usuário está na lista de administradores
            const adminsRef = this.database.ref('admins');
            const snapshot = await adminsRef.once('value');
            const admins = snapshot.val();
            
            if (admins && admins[user.uid]) {
                return true;
            }
            
            // Verificar custom claims (se implementado)
            await user.getIdToken(true); // Forçar refresh do token
            const idTokenResult = await user.getIdTokenResult();
            
            return idTokenResult.claims.admin === true;
        } catch (error) {
            console.error('Erro ao verificar privilégios:', error);
            return false;
        }
    }
    
    /**
     * Verifica se o administrador tem uma permissão específica
     * @param {string} permission - Nome da permissão
     * @returns {boolean} - True se o administrador tiver a permissão
     */
    hasPermission(permission) {
        if (!this.currentAdmin || !this.currentAdmin.permissions) {
            return false;
        }
        
        // Administradores superadmin têm todas as permissões
        if (this.currentAdmin.role === 'superadmin') {
            return true;
        }
        
        return this.currentAdmin.permissions.includes(permission);
    }
    
    /**
     * Middleware para proteger rotas administrativas
     * @param {Array} requiredPermissions - Permissões necessárias
     * @returns {Promise<boolean>} - Promise que resolve com true se o acesso for permitido
     */
    async protectRoute(requiredPermissions = []) {
        return new Promise((resolve, reject) => {
            this.auth.onAuthStateChanged(async (user) => {
                if (!user) {
                    resolve(false);
                    return;
                }
                
                try {
                    const isAdmin = await this.checkAdminPrivileges(user);
                    if (!isAdmin) {
                        resolve(false);
                        return;
                    }
                    
                    // Carregar dados do administrador se ainda não estiverem carregados
                    if (!this.currentAdmin) {
                        await this.loadAdminData(user.uid);
                    }
                    
                    // Verificar permissões específicas se necessário
                    if (requiredPermissions.length > 0) {
                        const hasAllPermissions = requiredPermissions.every(permission => 
                            this.hasPermission(permission)
                        );
                        resolve(hasAllPermissions);
                        return;
                    }
                    
                    resolve(true);
                } catch (error) {
                    console.error('Erro ao proteger rota:', error);
                    resolve(false);
                }
            });
        });
    }
    
    /**
     * Faz logout do administrador
     * @returns {Promise<void>}
     */
    async logout() {
        try {
            // Registrar logout no log de auditoria
            if (this.auth.currentUser) {
                await this.logAdminAction(this.auth.currentUser.uid, 'logout', {
                    timestamp: new Date().toISOString()
                });
            }
            
            await this.auth.signOut();
            this.currentAdmin = null;
        } catch (error) {
            console.error('Erro ao fazer logout:', error);
        }
    }
    
    /**
     * Listener para mudanças no estado de autenticação
     * @param {Function} callback - Função a ser chamada quando o estado mudar
     */
    onAuthStateChanged(callback) {
        return this.auth.onAuthStateChanged(callback);
    }
    
    /**
     * Configura logout automático após 30 minutos de inatividade
     */
    setupAutoLogout() {
        let timeoutId;
        
        // Função para resetar o timer
        const resetTimer = () => {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(async () => {
                // Registrar logout automático no log de auditoria
                if (this.auth.currentUser) {
                    await this.logAdminAction(this.auth.currentUser.uid, 'auto_logout', {
                        reason: 'inactivity',
                        timestamp: new Date().toISOString()
                    });
                }
                
                this.logout();
                alert('Sessão encerrada por inatividade.');
                
                // Redirecionar para a página de login
                if (window.location.hash !== '#login') {
                    window.location.hash = '#login';
                }
            }, 30 * 60 * 1000); // 30 minutos
        };
        
        // Resetar timer em eventos de interação
        ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'].forEach(event => {
            document.addEventListener(event, resetTimer, true);
        });
        
        // Iniciar timer
        resetTimer();
    }
    
    /**
     * Registra uma ação administrativa no log de auditoria
     * @param {string} adminId - ID do administrador
     * @param {string} action - Ação realizada
     * @param {Object} details - Detalhes da ação
     */
    async logAdminAction(adminId, action, details = {}) {
        try {
            const logEntry = {
                adminId: adminId,
                action: action,
                timestamp: new Date().toISOString(),
                details: details
            };
            
            // Adicionar informações adicionais se disponível
            if (this.currentAdmin) {
                logEntry.adminEmail = this.currentAdmin.email;
                logEntry.adminName = this.currentAdmin.name;
            }
            
            // Registrar IP do cliente se possível
            try {
                const ipResponse = await fetch('https://api.ipify.org?format=json');
                const ipData = await ipResponse.json();
                logEntry.ipAddress = ipData.ip;
            } catch (error) {
                // Se não conseguir obter o IP, continuar sem ele
                console.warn('Não foi possível obter o endereço IP do cliente:', error);
            }
            
            // Salvar log no Firebase
            const logsRef = this.database.ref('auditLogs');
            const newLogRef = logsRef.push();
            await newLogRef.set(logEntry);
        } catch (error) {
            console.error('Erro ao registrar ação administrativa:', error);
        }
    }
    
    /**
     * Obtém os dados do administrador atual
     * @returns {Object|null} - Dados do administrador ou null se não houver
     */
    getCurrentAdmin() {
        return this.currentAdmin;
    }
}