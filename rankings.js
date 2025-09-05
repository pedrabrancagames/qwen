/**
 * Rankings Manager - Ghostbusters AR
 * Gerencia o sistema de rankings dos jogadores
 */

import { ref, get, query, orderByChild, limitToFirst } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

export class RankingsManager {
    constructor(gameManager) {
        this.gameManager = gameManager;
        this.rankingsModal = null;
        this.rankingsList = null;
        this.closeRankingsButton = null;
    }

    // Inicializa elementos da interface de rankings
    initializeRankingsElements() {
        // Criar modal de rankings
        const rankingsModal = document.createElement('div');
        rankingsModal.id = 'rankings-modal';
        rankingsModal.className = 'ui-screen ui-element hidden';
        rankingsModal.innerHTML = `
            <div id="rankings-content">
                <div id="rankings-header">
                    <h2>Ranking de Caçadores</h2>
                    <button id="close-rankings-button" class="ui-element">&times;</button>
                </div>
                <ul id="rankings-list"></ul>
            </div>
        `;
        
        // Adicionar ao container da UI
        document.getElementById('ui-container').appendChild(rankingsModal);
        
        // Referenciar elementos
        this.rankingsModal = document.getElementById('rankings-modal');
        this.rankingsList = document.getElementById('rankings-list');
        this.closeRankingsButton = document.getElementById('close-rankings-button');
        
        // Adicionar event listeners
        this.closeRankingsButton.addEventListener('click', () => this.hideRankings());
    }

    // Mostra o modal de rankings
    showRankings() {
        this.rankingsModal.classList.remove('hidden');
        this.loadRankings();
    }

    // Esconde o modal de rankings
    hideRankings() {
        this.rankingsModal.classList.add('hidden');
    }

    // Carrega e exibe os rankings
    async loadRankings() {
        try {
            // Mostrar loading
            this.rankingsList.innerHTML = '<li>Carregando rankings...</li>';
            
            // Verificar se o database está disponível
            if (!this.gameManager.database) {
                console.error("Database não está disponível");
                this.rankingsList.innerHTML = '<li>Erro: Database não disponível.</li>';
                return;
            }
            
            // Consultar os 10 melhores jogadores ordenados por pontos
            const usersRef = ref(this.gameManager.database, 'users');
            const rankingsQuery = query(usersRef, orderByChild('points'), limitToFirst(10));
            
            const snapshot = await get(rankingsQuery);
            
            if (snapshot.exists()) {
                // Converter os dados para um array
                const users = [];
                snapshot.forEach((childSnapshot) => {
                    const userData = childSnapshot.val();
                    users.push({
                        key: childSnapshot.key,
                        displayName: userData.displayName || 'Caça-Fantasma',
                        points: userData.points || 0,
                        captures: userData.captures || 0
                    });
                });
                
                // Ordenar por pontos (decrescente)
                users.sort((a, b) => b.points - a.points);
                
                // Exibir os rankings
                this.displayRankings(users);
            } else {
                this.rankingsList.innerHTML = '<li>Nenhum jogador encontrado.</li>';
            }
        } catch (error) {
            console.error("Erro ao carregar rankings:", error);
            this.rankingsList.innerHTML = '<li>Erro ao carregar rankings.</li>';
        }
    }

    // Exibe os rankings na interface
    displayRankings(users) {
        this.rankingsList.innerHTML = '';
        
        if (users.length === 0) {
            this.rankingsList.innerHTML = '<li>Nenhum jogador encontrado.</li>';
            return;
        }
        
        users.forEach((user, index) => {
            const li = document.createElement('li');
            li.className = 'ranking-item';
            
            // Destacar o usuário atual
            const isCurrentUser = this.gameManager.currentUser && user.key === this.gameManager.currentUser.uid;
            if (isCurrentUser) {
                li.classList.add('current-user');
            }
            
            li.innerHTML = `
                <span class="ranking-position">${index + 1}.</span>
                <span class="ranking-name">${user.displayName}</span>
                <span class="ranking-points">${user.points} pts</span>
                <span class="ranking-captures">(${user.captures} capturas)</span>
            `;
            
            this.rankingsList.appendChild(li);
        });
    }
}