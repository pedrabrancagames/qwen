
/**
 * UI Manager - Ghost Squad
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
    initializeUIElements(gameManager) {
        console.log('Inicializando elementos da interface...');
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
        
        // Carregar áreas de caça dinamicamente após o login
        // Vamos adicionar um listener para quando o usuário fizer login
        this.loadLocationButtonsAfterLogin(gameManager);
        console.log('Elementos da interface inicializados com sucesso');
    }

    // Configura o carregamento das áreas de caça após o login
    loadLocationButtonsAfterLogin(gameManager) {
        console.log('Configurando carregamento de áreas de caça após login...');
        // Adicionar um listener para quando o usuário fizer login
        if (gameManager.authManager && gameManager.authManager.auth) {
            // Usar onAuthStateChanged para carregar as áreas de caça quando o usuário fizer login
            gameManager.authManager.auth.onAuthStateChanged((user) => {
                if (user) {
                    // Usuário logado, carregar áreas de caça
                    console.log('Usuário logado, carregando áreas de caça...');
                    this.loadLocationButtons(gameManager);
                }
            });
        } else {
            console.error('AuthManager ou auth não disponível');
        }
    }

    // Carrega os botões de localização dinamicamente do Firebase
    loadLocationButtons(gameManager) {
        console.log('Carregando botões de localização...');
        
        // Verificar se o gameState e o método getLocations existem
        if (!gameManager || !gameManager.gameState || typeof gameManager.gameState.getLocations !== 'function') {
            console.error('Erro: gameState ou método getLocations não disponível');
            return;
        }
        
        // Obter localizações do Firebase
        gameManager.gameState.getLocations().then((locations) => {
            console.log('Localizações obtidas:', locations);
            
            // Verificar se locations é um objeto válido
            if (!locations || typeof locations !== 'object') {
                console.error('Erro: locations não é um objeto válido', locations);
                return;
            }
            
            // Obter o container dos botões de localização
            const locationButtonsContainer = document.getElementById('location-buttons-container');
            
            // Verificar se o container existe
            if (!locationButtonsContainer) {
                console.error('Erro: container de botões de localização não encontrado');
                return;
            }
            
            // Limpar o container
            locationButtonsContainer.innerHTML = '';
            
            // Criar botões para cada localização
            let buttonCount = 0;
            for (const [locationName, locationData] of Object.entries(locations)) {
                const button = document.createElement('button');
                button.className = 'location-button ui-element';
                button.setAttribute('data-location-name', locationName);
                button.textContent = locationName;
                locationButtonsContainer.appendChild(button);
                buttonCount++;
            }
            
            console.log(`Carregadas ${buttonCount} áreas de caça do Firebase`);
            
            // Atualizar os event listeners dos botões de localização
            this.updateLocationButtonListeners(gameManager);
        }).catch((error) => {
            console.error('Erro ao carregar botões de localização:', error);
            // Em caso de erro, manter os botões padrão do HTML
        });
    }

    // Adiciona event listeners
    addEventListeners(gameManager) {
        console.log('Adicionando event listeners...');
        
        // Botões de autenticação
        this.googleLoginButton.addEventListener('click', () => {
            this.triggerHapticFeedback();
            this.playButtonSound();
            this.setButtonLoading(this.googleLoginButton, true);
            gameManager.authManager.signInWithGoogle()
                .finally(() => {
                    this.setButtonLoading(this.googleLoginButton, false);
                });
        });
        
        this.anonymousLoginButton.addEventListener('click', () => {
            this.triggerHapticFeedback();
            this.playButtonSound();
            this.setButtonLoading(this.anonymousLoginButton, true);
            gameManager.authManager.signInAsGuest()
                .finally(() => {
                    this.setButtonLoading(this.anonymousLoginButton, false);
                });
        });
        
        this.emailLoginShowButton.addEventListener('click', () => {
            this.triggerHapticFeedback();
            this.playButtonSound();
            this.loginScreen.classList.add('hidden');
            this.emailLoginScreen.classList.remove('hidden');
        });
        
        this.backToMainLoginButton.addEventListener('click', () => {
            this.triggerHapticFeedback();
            this.playButtonSound();
            this.emailLoginScreen.classList.add('hidden');
            this.loginScreen.classList.remove('hidden');
        });
        
        this.emailLoginButton.addEventListener('click', () => {
            this.triggerHapticFeedback();
            this.playButtonSound();
            this.setButtonLoading(this.emailLoginButton, true);
            gameManager.handleEmailLogin()
                .finally(() => {
                    this.setButtonLoading(this.emailLoginButton, false);
                });
        });
        
        this.emailSignupButton.addEventListener('click', () => {
            this.triggerHapticFeedback();
            this.playButtonSound();
            this.setButtonLoading(this.emailSignupButton, true);
            gameManager.handleEmailSignup()
                .finally(() => {
                    this.setButtonLoading(this.emailSignupButton, false);
                });
        });
        
        // Botão de entrar (iniciar caça)
        this.enterButton.addEventListener('click', () => {
            this.triggerHapticFeedback();
            this.playButtonSound();
            
            if (!gameManager.gameState.selectedLocation) {
                console.error('Nenhuma localização selecionada');
                return;
            }
            
            try {
                this.setButtonLoading(this.enterButton, true);
                gameManager.initGame();
            } catch (e) { 
                console.error("Erro ao iniciar jogo:", e);
                this.showNotification("Erro ao iniciar jogo: " + e.message); 
            } finally {
                this.setButtonLoading(this.enterButton, false);
            }
        });
        
        console.log('Event listeners adicionados com sucesso');
    }
    
    // Atualiza os event listeners dos botões de localização
    updateLocationButtonListeners(gameManager) {
        // Adicionar event listeners para os botões de localização
        const locationButtons = document.querySelectorAll('.location-button');
        console.log(`Encontrados ${locationButtons.length} botões de localização`);
        
        locationButtons.forEach(button => {
            // Remover event listeners antigos para evitar duplicação
            const clone = button.cloneNode(true);
            button.parentNode.replaceChild(clone, button);
            
            clone.addEventListener('click', () => {
                this.triggerHapticFeedback();
                this.playButtonSound();
                
                // Remover classe 'selected' de todos os botões
                document.querySelectorAll('.location-button').forEach(btn => {
                    btn.classList.remove('selected');
                });
                
                // Adicionar classe 'selected' ao botão clicado
                clone.classList.add('selected');
                
                // Obter o nome da localização do atributo data
                const locationName = clone.getAttribute('data-location-name');
                console.log(`Selecionada a localização: ${locationName}`);
                
                // Definir a localização selecionada no gameState
                gameManager.gameState.setSelectedLocation(locationName).then((success) => {
                    if (success) {
                        // Habilitar o botão de entrar
                        this.setEnterButtonEnabled(true);
                    } else {
                        console.error(`Falha ao definir localização: ${locationName}`);
                    }
                }).catch((error) => {
                    console.error('Erro ao definir localização:', error);
                });
            });
        });
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

    // Mostra/esconde telas com animações
    showScreen(screenName) {
        // Esconde todas as telas primeiro com animação
        this.hideAllScreens();
        
        // Mostra a tela solicitada com animação
        switch(screenName) {
            case 'login':
                this.loginScreen.classList.remove('hidden');
                this.loginScreen.classList.add('slide-in');
                break;
            case 'emailLogin':
                this.emailLoginScreen.classList.remove('hidden');
                this.emailLoginScreen.classList.add('slide-in');
                break;
            case 'location':
                this.locationScreen.classList.remove('hidden');
                this.locationScreen.classList.add('slide-in');
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

    // Esconde todas as telas com animação
    hideAllScreens() {
        const screens = [
            this.loginScreen,
            this.emailLoginScreen,
            this.locationScreen,
            this.gameUi,
            this.inventoryModal,
            this.qrScannerScreen
        ];
        
        screens.forEach(screen => {
            if (screen && !screen.classList.contains('hidden')) {
                screen.classList.add('fade-out');
                setTimeout(() => {
                    screen.classList.add('hidden');
                    screen.classList.remove('fade-out');
                }, 500);
            }
        });
    }

    // Adiciona efeito de loading ao botão
    setButtonLoading(button, isLoading) {
        if (isLoading) {
            button.classList.add('loading');
            button.disabled = true;
        } else {
            button.classList.remove('loading');
            button.disabled = false;
        }
    }

    // Efeitos hapticos e sonoros
    triggerHapticFeedback() {
        if (navigator.vibrate) {
            navigator.vibrate(50);
        }
    }

    playButtonSound() {
        // Se houver um áudio de clique no HTML
        // const clickSound = document.getElementById('button-click-sound');
        // if (clickSound) {
        //     clickSound.currentTime = 0;
        //     clickSound.play().catch(e => console.log("Audio play failed:", e));
        // }
        // Comentado temporariamente até adicionar o arquivo de áudio
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