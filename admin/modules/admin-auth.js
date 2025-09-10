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
            return userCredential.user;
        } catch (error) {
            console.error('Erro na autenticação:', error);
            throw error;
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
     * Faz logout do administrador
     * @returns {Promise<void>}
     */
    async logout() {
        try {
            await this.auth.signOut();
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
            timeoutId = setTimeout(() => {
                this.logout();
                alert('Sessão encerrada por inatividade.');
            }, 30 * 60 * 1000); // 30 minutos
        };
        
        // Resetar timer em eventos de interação
        ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'].forEach(event => {
            document.addEventListener(event, resetTimer, true);
        });
        
        // Iniciar timer
        resetTimer();
    }
}