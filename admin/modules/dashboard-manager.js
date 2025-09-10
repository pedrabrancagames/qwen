/**
 * Gerenciador do Dashboard
 * 
 * Classe responsável por gerenciar o dashboard principal do painel administrativo
 * com métricas em tempo real e informações gerais do jogo.
 */
export class DashboardManager {
    /**
     * Construtor do DashboardManager
     * @param {Object} database - Instância do Firebase Database
     */
    constructor(database) {
        this.database = database;
        this.dashboardElement = null;
    }
    
    /**
     * Inicializa o dashboard
     * @param {HTMLElement} element - Elemento DOM onde o dashboard será renderizado
     */
    init(element) {
        this.dashboardElement = element;
        this.render();
        this.loadDashboardData();
    }
    
    /**
     * Renderiza a estrutura básica do dashboard
     */
    render() {
        if (!this.dashboardElement) return;
        
        this.dashboardElement.innerHTML = `
            <div class="dashboard-header">
                <h2>Dashboard</h2>
                <div class="refresh-controls">
                    <button id="refresh-dashboard" class="btn-secondary">
                        <span class="refresh-icon">↻</span> Atualizar
                    </button>
                    <span id="last-update" class="last-update">Carregando...</span>
                </div>
            </div>
            
            <div class="dashboard-metrics">
                <div class="metric-card">
                    <div class="metric-header">
                        <h3>Usuários Totais</h3>
                        <div class="metric-icon users-icon">👥</div>
                    </div>
                    <div class="metric-value" id="total-users">-</div>
                    <div class="metric-trend" id="users-trend">-</div>
                </div>
                
                <div class="metric-card">
                    <div class="metric-header">
                        <h3>Usuários Ativos (24h)</h3>
                        <div class="metric-icon active-users-icon">⚡</div>
                    </div>
                    <div class="metric-value" id="active-users">-</div>
                    <div class="metric-trend" id="active-users-trend">-</div>
                </div>
                
                <div class="metric-card">
                    <div class="metric-header">
                        <h3>Fantasmas Capturados (24h)</h3>
                        <div class="metric-icon ghosts-icon">👻</div>
                    </div>
                    <div class="metric-value" id="ghosts-captured">-</div>
                    <div class="metric-trend" id="ghosts-trend">-</div>
                </div>
                
                <div class="metric-card">
                    <div class="metric-header">
                        <h3>ECTO-1s Desbloqueados</h3>
                        <div class="metric-icon ecto1-icon">🚗</div>
                    </div>
                    <div class="metric-value" id="ecto1-unlocked">-</div>
                    <div class="metric-trend" id="ecto1-trend">-</div>
                </div>
            </div>
            
            <div class="dashboard-charts">
                <div class="chart-container">
                    <h3>Atividade dos Últimos 30 Dias</h3>
                    <canvas id="activity-chart-canvas" class="chart-canvas"></canvas>
                </div>
                
                <div class="chart-container">
                    <h3>Distribuição de Capturas por Localização</h3>
                    <canvas id="location-chart-canvas" class="chart-canvas"></canvas>
                </div>
            </div>
            
            <div class="dashboard-recent-activity">
                <h3>Atividade Recente</h3>
                <div id="recent-activity-list">
                    <p>Carregando atividade...</p>
                </div>
            </div>
        `;
        
        // Adicionar evento de refresh
        const refreshButton = this.dashboardElement.querySelector('#refresh-dashboard');
        if (refreshButton) {
            refreshButton.addEventListener('click', () => {
                this.loadDashboardData();
            });
        }
    }
    
    /**
     * Carrega os dados do dashboard
     */
    async loadDashboardData() {
        try {
            // Atualizar data/hora da última atualização
            const lastUpdateElement = this.dashboardElement.querySelector('#last-update');
            if (lastUpdateElement) {
                lastUpdateElement.textContent = `Atualizado às ${new Date().toLocaleTimeString('pt-BR')}`;
            }
            
            // Carregar métricas principais
            await this.loadMetrics();
            
            // Carregar gráficos
            await this.loadCharts();
            
            // Carregar atividade recente
            await this.loadRecentActivity();
            
        } catch (error) {
            console.error('Erro ao carregar dados do dashboard:', error);
            this.showError('Erro ao carregar dados do dashboard');
        }
    }
    
    /**
     * Carrega as métricas principais
     */
    async loadMetrics() {
        try {
            // Total de usuários
            const usersRef = this.database.ref('users');
            const usersSnapshot = await usersRef.once('value');
            const users = usersSnapshot.val();
            
            const totalUsers = users ? Object.keys(users).length : 0;
            const activeUsers = this.calculateActiveUsers(users);
            const ghostsCaptured = this.calculateGhostsCaptured(users);
            const ecto1Unlocked = this.calculateEcto1Unlocked(users);
            
            // Atualizar valores no DOM
            this.updateMetric('total-users', totalUsers.toLocaleString('pt-BR'));
            this.updateMetric('active-users', activeUsers.toLocaleString('pt-BR'));
            this.updateMetric('ghosts-captured', ghostsCaptured.toLocaleString('pt-BR'));
            this.updateMetric('ecto1-unlocked', ecto1Unlocked.toLocaleString('pt-BR'));
            
            // Calcular tendências (simplificado para este exemplo)
            this.updateTrend('users-trend', '+5%', 'positive');
            this.updateTrend('active-users-trend', '+2%', 'positive');
            this.updateTrend('ghosts-trend', '+8%', 'positive');
            this.updateTrend('ecto1-trend', '+1%', 'positive');
            
        } catch (error) {
            console.error('Erro ao carregar métricas:', error);
        }
    }
    
    /**
     * Calcula o número de usuários ativos nas últimas 24 horas
     * @param {Object} users - Objeto com dados dos usuários
     * @returns {number} - Número de usuários ativos
     */
    calculateActiveUsers(users) {
        if (!users) return 0;
        
        const oneDayAgo = Date.now() - (24 * 60 * 60 * 1000);
        let activeCount = 0;
        
        for (const userId in users) {
            const user = users[userId];
            if (user.lastActive && new Date(user.lastActive).getTime() > oneDayAgo) {
                activeCount++;
            }
        }
        
        return activeCount;
    }
    
    /**
     * Calcula o número total de fantasmas capturados
     * @param {Object} users - Objeto com dados dos usuários
     * @returns {number} - Número total de fantasmas capturados
     */
    calculateGhostsCaptured(users) {
        if (!users) return 0;
        
        let totalCaptures = 0;
        const oneDayAgo = Date.now() - (24 * 60 * 60 * 1000);
        
        for (const userId in users) {
            const user = users[userId];
            if (user.captures) {
                // Se tivermos timestamps das capturas, podemos filtrar por 24h
                if (user.captureHistory) {
                    const recentCaptures = user.captureHistory.filter(capture => 
                        new Date(capture.timestamp).getTime() > oneDayAgo
                    );
                    totalCaptures += recentCaptures.length;
                } else {
                    // Caso contrário, usamos o valor total de captures
                    totalCaptures += user.captures;
                }
            }
        }
        
        return totalCaptures;
    }
    
    /**
     * Calcula o número de ECTO-1s desbloqueados
     * @param {Object} users - Objeto com dados dos usuários
     * @returns {number} - Número de ECTO-1s desbloqueados
     */
    calculateEcto1Unlocked(users) {
        if (!users) return 0;
        
        let ecto1Count = 0;
        
        for (const userId in users) {
            const user = users[userId];
            if (user.ecto1Unlocked) {
                ecto1Count++;
            }
        }
        
        return ecto1Count;
    }
    
    /**
     * Atualiza o valor de uma métrica
     * @param {string} elementId - ID do elemento a ser atualizado
     * @param {string} value - Novo valor
     */
    updateMetric(elementId, value) {
        const element = this.dashboardElement.querySelector(`#${elementId}`);
        if (element) {
            element.textContent = value;
        }
    }
    
    /**
     * Atualiza a tendência de uma métrica
     * @param {string} elementId - ID do elemento a ser atualizado
     * @param {string} value - Valor da tendência
     * @param {string} type - Tipo de tendência (positive, negative, neutral)
     */
    updateTrend(elementId, value, type) {
        const element = this.dashboardElement.querySelector(`#${elementId}`);
        if (element) {
            element.textContent = value;
            element.className = `metric-trend ${type}`;
        }
    }
    
    /**
     * Carrega os dados para os gráficos
     */
    async loadCharts() {
        try {
            // Importar componente de gráficos
            const { initCharts } = await import('../components/charts.js');
            
            // Obter elementos dos gráficos
            const activityChartElement = this.dashboardElement.querySelector('#activity-chart-canvas');
            const locationChartElement = this.dashboardElement.querySelector('#location-chart-canvas');
            
            if (activityChartElement && locationChartElement) {
                // Inicializar gráficos
                initCharts(activityChartElement, locationChartElement, this.database);
            }
        } catch (error) {
            console.error('Erro ao carregar gráficos:', error);
            this.showError('Erro ao carregar gráficos');
        }
    }
    
    /**
     * Carrega a atividade recente
     */
    async loadRecentActivity() {
        try {
            const activityList = this.dashboardElement.querySelector('#recent-activity-list');
            if (!activityList) return;
            
            // Simular atividade recente
            const recentActivities = [
                {user: 'João Silva', action: 'capturou um fantasma', time: '2 minutos atrás'},
                {user: 'Maria Santos', action: 'desbloqueou o ECTO-1', time: '5 minutos atrás'},
                {user: 'Pedro Oliveira', action: 'depositou 3 fantasmas', time: '10 minutos atrás'},
                {user: 'Ana Costa', action: 'atingiu o nível 5', time: '15 minutos atrás'},
                {user: 'Carlos Lima', action: 'capturou um fantasma forte', time: '20 minutos atrás'}
            ];
            
            activityList.innerHTML = `
                <ul class="activity-list">
                    ${recentActivities.map(activity => `
                        <li class="activity-item">
                            <div class="activity-content">
                                <span class="activity-user">${activity.user}</span>
                                <span class="activity-action">${activity.action}</span>
                            </div>
                            <span class="activity-time">${activity.time}</span>
                        </li>
                    `).join('')}
                </ul>
            `;
            
        } catch (error) {
            console.error('Erro ao carregar atividade recente:', error);
        }
    }
    
    /**
     * Mostra mensagem de erro
     * @param {string} message - Mensagem de erro
     */
    showError(message) {
        if (this.dashboardElement) {
            const errorElement = document.createElement('div');
            errorElement.className = 'error-message';
            errorElement.textContent = message;
            this.dashboardElement.prepend(errorElement);
            
            // Remover mensagem após 5 segundos
            setTimeout(() => {
                errorElement.remove();
            }, 5000);
        }
    }
}