
/**
 * UI Manager - Ghostbusters AR
 * Gerencia a interface do usuário, incluindo telas, botões, inventário e elementos visuais
 */

export class UIManager {
    constructor() {
        this.loginScreen = null;
        this.locationScreen = null;
        this.gameUi = null;
        this.inventoryModal = null;
        this.qrScannerScreen = null;
        this.notificationModal = null;
        
        // Elementos de inventário
        this.inventoryIconContainer = null;
        this.inventoryBadge = null;
        this.ghostList = null;
        
        // Elementos de progresso
        this.protonPackProgressBar = null;
        this.protonPackProgressFill = null;
        
        // Botões
        this.enterButton = null;
        this.googleLoginButton = null;
        this.closeInventoryButton = null;
        this.depositButton = null;
        this.closeScannerButton = null;
        this.protonPackIcon = null;
        
        // Elementos de notificação
        this.notificationMessage = null;
        this.notificationCloseButton = null;
        
        // Elementos do mapa
        this.minimapElement = null;
        this.distanceInfo = null;
        
        // Elementos de autenticação
        this.emailLoginScreen = null;
        this.emailInput = null;
        this.passwordInput = null;
        this.authErrorMessage = null;
        this.emailLoginShowButton = null;
        this.anonymousLoginButton = null;
        this.emailLoginButton = null;
        this.emailSignupButton = null;
        this.backToMainLoginButton = null;
        
        // Elementos do menu AR
        this.gameLogo = null;
        this.arMenu = null;
    }

    // Inicializa elementos da interface
    initializeUIElements() {
        this.loginScreen = document.getElementById('login-screen');
        this.locationScreen = document.getElementById('location-screen');
        this.enterButton = document.getElementById('enter-button');
        this.googleLoginButton = document.getElementById('google-login-button');
        this.gameUi = document.getElementById('game-ui');
        this.minimapElement = document.getElementById('minimap');
        this.distanceInfo = document.getElementById('distance-info');
        this.inventoryIconContainer = document.getElementById('inventory-icon-container');
        this.inventoryModal = document.getElementById('inventory-modal');
        this.closeInventoryButton = document.getElementById('close-inventory-button');
        this.inventoryBadge = document.getElementById('inventory-badge');
        this.ghostList = document.getElementById('ghost-list');
        this.qrScannerScreen = document.getElementById('qr-scanner-screen');
        this.depositButton = document.getElementById('deposit-button');
        this.closeScannerButton = document.getElementById('close-scanner-button');
        this.reticle = document.getElementById('reticle');
        this.protonPackIcon = document.getElementById('proton-pack-icon');
        this.protonPackProgressBar = document.getElementById('proton-pack-progress-bar');
        this.protonPackProgressFill = document.getElementById('proton-pack-progress-fill');
        this.notificationModal = document.getElementById('notification-modal');
        this.notificationMessage = document.getElementById('notification-message');
        this.notificationCloseButton = document.getElementById('notification-close-button');

        // Auth Screens
        this.emailLoginScreen = document.getElementById('email-login-screen');
        this.emailInput = document.getElementById('email-input');
        this.passwordInput = document.getElementById('password-input');
        this.authErrorMessage = document.getElementById('auth-error-message');

        // Auth Buttons
        this.emailLoginShowButton = document.getElementById('email-login-show-button');
        this.anonymousLoginButton = document.getElementById('anonymous-login-button');
        this.emailLoginButton = document.getElementById('email-login-button');
        this.emailSignupButton = document.getElementById('email-signup-button');
        this.backToMainLoginButton = document.getElementById('back-to-main-login');
        
        // Elementos do menu AR
        this.gameLogo = document.getElementById('game-logo');
    }

    // Adiciona event listeners
    addEventListeners(gameManager) {
        // Botões de autenticação
        this.googleLoginButton.addEventListener('click', () => gameManager.authManager.signInWithGoogle());
        this.anonymousLoginButton.addEventListener('click', () => gameManager.authManager.signInAsGuest());
        this.emailLoginShowButton.addEventListener('click', () => {
            this.loginScreen.classList.add('hidden');
            this.emailLoginScreen.classList.remove('hidden');
        });
        this.backToMainLoginButton.addEventListener('click', () => {
            this.emailLoginScreen.classList.add('hidden');
            this.loginScreen.classList.remove('hidden');
        });
        this.emailLoginButton.addEventListener('click', () => gameManager.handleEmailLogin());
        this.emailSignupButton.addEventListener('click', () => gameManager.handleEmailSignup());

        // Botões de localização
        // Adicionar event listeners para os botões de localização
        const locationButtons = document.querySelectorAll('.location-button');
        locationButtons.forEach(button => {
            button.addEventListener('click', () => {
                // Remover classe 'selected' de todos os botões
                locationButtons.forEach(btn => btn.classList.remove('selected'));
                
                // Adicionar classe 'selected' ao botão clicado
                button.classList.add('selected');
                
                // Obter o nome da localização do atributo data
                const locationName = button.getAttribute('data-location-name');
                
                // Definir a localização selecionada no gameState
                gameManager.gameState.setSelectedLocation(locationName);
                
                // Habilitar o botão de entrar
                this.setEnterButtonEnabled(true);
            });
        });

        this.enterButton.addEventListener('click', async () => {
            if (!gameManager.gameState.selectedLocation) return;
            try {
                await gameManager.el.sceneEl.enterAR();
            } catch (e) { 
                this.showNotification("Erro ao iniciar AR: " + e.message); 
            }
        });

        // Botões de inventário
        this.inventoryIconContainer.addEventListener('click', () => this.inventoryModal.classList.remove('hidden'));
        this.closeInventoryButton.addEventListener('click', () => this.inventoryModal.classList.add('hidden'));
        this.depositButton.addEventListener('click', () => gameManager.startQrScanner());

        // Botões do scanner QR
        this.closeScannerButton.addEventListener('click', () => gameManager.stopQrScanner());

        // Controles do Proton Pack
        this.protonPackIcon.addEventListener('mousedown', () => gameManager.startCapture());
        this.protonPackIcon.addEventListener('mouseup', () => gameManager.cancelCapture());
        this.protonPackIcon.addEventListener('mouseleave', () => gameManager.cancelCapture());
        this.protonPackIcon.addEventListener('touchstart', () => gameManager.startCapture());
        this.protonPackIcon.addEventListener('touchend', () => gameManager.cancelCapture());
        this.protonPackIcon.addEventListener('contextmenu', (e) => { 
            e.preventDefault(); 
            e.stopPropagation(); 
        });

        // Notificações
        this.notificationCloseButton.addEventListener('click', () => this.hideNotification());

        // Evento de entrada em AR
        gameManager.el.sceneEl.addEventListener('enter-vr', () => {
            gameManager.initGame();
        });
        
        // Adicionar evento de clique ao logo para abrir o menu AR
        this.gameLogo.addEventListener('click', () => this.toggleARMenu(gameManager));
    }

    // Alterna a visibilidade do menu AR
    toggleARMenu(gameManager) {
        // Se o menu AR não existe, cria-o
        if (!this.arMenu) {
            this.createARMenu(gameManager);
        }
        
        // Alterna a visibilidade
        if (this.arMenu.classList.contains('hidden')) {
            this.arMenu.classList.remove('hidden');
        } else {
            this.arMenu.classList.add('hidden');
        }
    }

    // Cria o menu AR
    createARMenu(gameManager) {
        // Criar o elemento do menu
        this.arMenu = document.createElement('div');
        this.arMenu.id = 'ar-menu';
        this.arMenu.className = 'ui-element ar-menu hidden';
        
        // Conteúdo do menu
        this.arMenu.innerHTML = `
            <div class="ar-menu-content">
                <button id="change-location-button" class="ar-menu-button">Mudar Área de Caça</button>
                <button id="view-rankings-button" class="ar-menu-button">Ver Rankings</button>
                <button id="logout-button" class="ar-menu-button">Sair</button>
            </div>
        `;
        
        // Adicionar ao container da UI
        document.getElementById('ui-container').appendChild(this.arMenu);
        
        // Adicionar event listeners aos botões
        document.getElementById('change-location-button').addEventListener('click', () => {
            this.arMenu.classList.add('hidden');
            gameManager.stopQrScanner();
            // Sair do modo AR e mostrar tela de seleção de local
            gameManager.el.sceneEl.exitVR().then(() => {
                gameManager.uiManager.locationScreen.classList.remove('hidden');
                gameManager.uiManager.gameUi.classList.add('hidden');
            });
        });
        
        document.getElementById('view-rankings-button').addEventListener('click', () => {
            this.arMenu.classList.add('hidden');
            gameManager.rankingsManager.showRankings();
        });
        
        document.getElementById('logout-button').addEventListener('click', () => {
            this.arMenu.classList.add('hidden');
            gameManager.authManager.auth.signOut();
        });
    }

    // Atualiza a interface do inventário
    updateInventoryUI(inventory, inventoryLimit) {
        this.inventoryBadge.innerText = `${inventory.length}/${inventoryLimit}`;
        this.ghostList.innerHTML = '';
        
        if (inventory.length === 0) {
            this.ghostList.innerHTML = '<li>Inventário vazio.</li>';
            this.depositButton.style.display = 'none';
        } else {
            inventory.forEach(ghost => {
                const li = document.createElement('li');
                li.textContent = `${ghost.type} (Pontos: ${ghost.points}) - ID: ${ghost.id}`;
                this.ghostList.appendChild(li);
            });
            this.depositButton.style.display = 'block';
        }
    }

    // Atualiza a barra de progresso do Proton Pack
    updateProtonPackProgress(progress) {
        this.protonPackProgressFill.style.height = `${progress * 100}%`;
    }

    // Mostra a barra de progresso do Proton Pack
    showProtonPackProgress() {
        this.protonPackProgressBar.style.display = 'block';
    }

    // Esconde a barra de progresso do Proton Pack
    hideProtonPackProgress() {
        this.protonPackProgressBar.style.display = 'none';
        this.protonPackProgressFill.style.height = '0%';
    }

    // Mostra uma notificação
    showNotification(message) {
        this.notificationMessage.textContent = message;
        this.notificationModal.classList.remove('hidden');
    }

    // Esconde a notificação
    hideNotification() {
        this.notificationModal.classList.add('hidden');
    }

    // Atualiza as informações de distância
    updateDistanceInfo(text, color = "#92F428") {
        this.distanceInfo.innerText = text;
        this.distanceInfo.style.color = color;
        
        // Remover a classe near-ghost do minimapa se a cor não for vermelha
        if (color !== "#ff0000") {
            this.minimapElement.classList.remove('near-ghost');
        }
    }

    // Habilita/desabilita o botão de entrar
    setEnterButtonEnabled(enabled) {
        this.enterButton.disabled = !enabled;
        this.enterButton.style.display = enabled ? 'block' : 'none';
    }

    // Mostra/esconde telas
    showScreen(screenName) {
        // Esconde todas as telas primeiro
        this.hideAllScreens();
        
        // Mostra a tela solicitada
        switch(screenName) {
            case 'login':
                this.loginScreen.classList.remove('hidden');
                break;
            case 'emailLogin':
                this.emailLoginScreen.classList.remove('hidden');
                break;
            case 'location':
                this.locationScreen.classList.remove('hidden');
                break;
            case 'game':
                this.gameUi.classList.remove('hidden');
                break;
            case 'inventory':
                this.inventoryModal.classList.remove('hidden');
                break;
            case 'qrScanner':
                this.qrScannerScreen.classList.remove('hidden');
                break;
        }
    }

    // Esconde todas as telas
    hideAllScreens() {
        this.loginScreen.classList.add('hidden');
        this.emailLoginScreen.classList.add('hidden');
        this.locationScreen.classList.add('hidden');
        this.gameUi.classList.add('hidden');
        this.inventoryModal.classList.add('hidden');
        this.qrScannerScreen.classList.add('hidden');
    }

    // Marca um botão de localização como selecionado
    selectLocationButton(button) {
        // Remove a classe 'selected' de todos os botões
        document.querySelectorAll('.location-button').forEach(btn => {
            btn.classList.remove('selected');
        });
        
        // Adiciona a classe 'selected' ao botão clicado
        button.classList.add('selected');
    }

    // Atualiza a mensagem de erro de autenticação
    updateAuthErrorMessage(message) {
        this.authErrorMessage.textContent = message;
    }

    // Limpa os campos de entrada de email e senha
    clearAuthInputs() {
        this.emailInput.value = '';
        this.passwordInput.value = '';
    }
}