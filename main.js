import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth, GoogleAuthProvider, signInWithPopup, onAuthStateChanged, signInAnonymously, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getDatabase, ref, set, get, update } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

// Importar os novos módulos
import { AuthManager } from './auth-manager.js';
import { GameStateManager } from './game-state.js';
import { ARManager } from './ar-manager.js';
import { UIManager } from './ui-manager.js';
import { MapManager } from './map-manager.js';
import { QRManager } from './qr-manager.js';

AFRAME.registerComponent('game-manager', {
    init: function () {
        // Inicializar módulos
        this.authManager = new AuthManager(this);
        this.gameState = new GameStateManager();
        this.arManager = new ARManager();
        this.uiManager = new UIManager();
        this.mapManager = new MapManager();
        this.qrManager = new QRManager();

        // Inicializar elementos da interface
        this.uiManager.initializeUIElements();
        this.arManager.initializeARElements();
        this.mapManager.setMinimapElement(this.uiManager.minimapElement);

        this.firebaseConfig = {
            apiKey: "AIzaSyC8DE4F6mU9oyRw8cLU5vcfxOp5RxLcgHA",
            authDomain: "ghostbusters-ar-game.firebaseapp.com",
            databaseURL: "https://ghostbusters-ar-game-default-rtdb.firebaseio.com",
            projectId: "ghostbusters-ar-game",
            storageBucket: "ghostbusters-ar-game.appspot.com",
            messagingSenderId: "4705887791",
            appId: "1:4705887791:web:a1a4e360fb9f8415be08da"
        };

        this.bindMethods();
        this.initializeApp();
        this.uiManager.addEventListeners(this);

        this.gameInitialized = false;
        this.currentUser = null;
        this.isCapturing = false;
        this.captureTimer = null;
        this.progressInterval = null;

        // Elementos de áudio
        this.protonBeamSound = document.getElementById('proton-beam-sound');
        this.ghostCaptureSound = document.getElementById('ghost-capture-sound');
        this.inventoryFullSound = document.getElementById('inventory-full-sound');
    },

    bindMethods: function () {
        this.onAuthStateChanged = this.authManager.onAuthStateChanged.bind(this.authManager);
        this.updateInventoryUI = this.updateInventoryUI.bind(this);
        this.depositGhosts = this.depositGhosts.bind(this);
        this.onScanSuccess = this.onScanSuccess.bind(this);
        this.startQrScanner = this.startQrScanner.bind(this);
        this.stopQrScanner = this.stopQrScanner.bind(this);
        this.showNotification = this.uiManager.showNotification.bind(this.uiManager);
        this.hideNotification = this.uiManager.hideNotification.bind(this.uiManager);
        this.initGame = this.initGame.bind(this);
        this.initMap = this.initMap.bind(this);
        this.showEcto1OnMap = this.showEcto1OnMap.bind(this);
        this.generateGhost = this.generateGhost.bind(this);
        this.startGps = this.startGps.bind(this);
        this.onGpsUpdate = this.onGpsUpdate.bind(this);
        this.checkProximity = this.checkProximity.bind(this);
        this.startCapture = this.startCapture.bind(this);
        this.cancelCapture = this.cancelCapture.bind(this);
        this.ghostCaptured = this.ghostCaptured.bind(this);
        this.setupHitTest = this.arManager.setupHitTest.bind(this.arManager);
        this.placeObject = this.arManager.placeObject.bind(this.arManager);
        this.tick = this.tick.bind(this);
        this.handleEmailLogin = this.handleEmailLogin.bind(this);
        this.handleEmailSignup = this.handleEmailSignup.bind(this);
    },

    initializeApp: function () {
        const app = initializeApp(this.firebaseConfig);
        this.auth = getAuth(app);
        this.database = getDatabase(app);
        this.provider = new GoogleAuthProvider();
        onAuthStateChanged(this.auth, this.onAuthStateChanged);
        this.uiManager.googleLoginButton.style.display = 'block';
    },

    updateInventoryUI: function () {
        this.uiManager.updateInventoryUI(
            this.gameState.getInventory(),
            this.gameState.INVENTORY_LIMIT
        );
    },

    depositGhosts: function () {
        // NOVO: Efeito visual de depósito
        if (window.visualEffectsSystem) {
            const qrRect = document.getElementById('qr-reader').getBoundingClientRect();
            window.visualEffectsSystem.showCelebrationEffect(
                qrRect.left + qrRect.width / 2,
                qrRect.top + qrRect.height / 2,
                'ghost_captured'
            );
        }
        
        // NOVO: Notificação estilizada
        if (window.notificationSystem) {
            window.notificationSystem.success(
                `${this.gameState.getInventory().length} fantasmas depositados com sucesso! +${this.gameState.getInventory().reduce((total, ghost) => total + ghost.points, 0)} pontos`,
                { duration: 5000 }
            );
        }
        
        this.gameState.clearInventory();
        const userRef = ref(this.database, 'users/' + this.currentUser.uid);
        update(userRef, { inventory: this.gameState.getInventory() });
        this.updateInventoryUI();
        this.generateGhost();
    },

    onScanSuccess: function (decodedText, decodedResult) {
        this.stopQrScanner();
        if (this.qrManager.isContainmentUnit(decodedText)) {
            this.depositGhosts();
        } else {
            // NOVO: Notificação de erro estilizada
            if (window.notificationSystem) {
                window.notificationSystem.error("QR Code inválido! Procure pela unidade de contenção oficial.");
            } else {
                alert("QR Code inválido!");
            }
        }
    },

    startQrScanner: async function () {
        this.uiManager.inventoryModal.classList.add('hidden');

        if (this.el.sceneEl.is('ar-mode')) {
            try {
                // exitVR() é a função correta para sair de sessões AR e VR.
                await this.el.sceneEl.exitVR();
            } catch (e) {
                console.error("Falha ao sair do modo AR.", e);
            }
        }

        // Adiciona um pequeno atraso para garantir que o navegador libere a câmera.
        setTimeout(() => {
            this.uiManager.gameUi.classList.add('hidden');
            this.uiManager.showScreen('qrScanner');
            this.qrManager.startQrScanner(
                "qr-reader",
                this.onScanSuccess,
                (err) => {
                    this.uiManager.showNotification("Erro ao iniciar scanner de QR Code. Verifique as permissões da câmera no navegador.");
                    this.stopQrScanner();
                }
            );
        }, 200); // Atraso de 200ms
    },

    stopQrScanner: function () {
        this.qrManager.stopQrScanner();
        this.uiManager.qrScannerScreen.classList.add('hidden');
        // Retorna à tela de seleção de local para permitir re-entrar no modo AR de forma limpa.
        this.uiManager.locationScreen.classList.remove('hidden');
        this.uiManager.gameUi.classList.add('hidden');
    },

    initGame: function () {
        this.gameInitialized = true;
        this.uiManager.locationScreen.classList.add('hidden');
        this.uiManager.gameUi.classList.remove('hidden');
        this.initMap();
        this.setupHitTest(this.el.sceneEl);
    },

    initMap: function () {
        const selectedLocation = this.gameState.getSelectedLocation();
        if (selectedLocation) {
            this.mapManager.initMap(
                selectedLocation,
                this.gameState.isEcto1Unlocked(),
                this.showEcto1OnMap
            );
            this.generateGhost();
            this.startGps();
        }
    },

    showEcto1OnMap: function () {
        this.mapManager.showEcto1OnMap(this.gameState.getEcto1Position());
    },

    generateGhost: function () {
        if (this.gameState.isInventoryFull()) {
            this.uiManager.updateDistanceInfo("Inventário Cheio!");
            this.mapManager.removeGhostMarker();
            return;
        }
        
        const ghostData = this.gameState.generateGhost();
        if (ghostData) {
            this.mapManager.updateGhostMarker(ghostData);
        }
    },

    startGps: function () {
        navigator.geolocation.watchPosition(this.onGpsUpdate, 
            () => { 
                this.uiManager.showNotification("Não foi possível obter sua localização."); 
            },
            { enableHighAccuracy: true }
        );
    },

    onGpsUpdate: function (position) {
        const userLat = position.coords.latitude;
        const userLon = position.coords.longitude;

        this.mapManager.updatePlayerPosition(userLat, userLon);
        this.checkProximity(userLat, userLon);
    },

    checkProximity: function (userLat, userLon) {
        const result = this.mapManager.checkProximity(
            userLat,
            userLon,
            this.gameState.getGhostData(),
            this.gameState.getEcto1Position(),
            this.gameState.isEcto1Unlocked(),
            this.gameState.INVENTORY_LIMIT,
            this.gameState.getInventory()
        );

        if (result.distanceInfo) {
            this.uiManager.updateDistanceInfo(
                result.distanceInfo,
                result.isNearObject ? 
                    (result.objectToPlace === 'ghost' ? "#ff0000" : "#00aaff") : 
                    "#92F428"
            );
        }

        // Atualizar estado do AR
        this.arManager.setObjectToPlace(result.objectToPlace);
        if (result.objectToPlace === 'ghost') {
            this.arManager.setActiveGhostEntity(
                this.gameState.getGhostData().type === 'Fantasma Forte' ? 
                this.arManager.ghostForteEntity : 
                this.arManager.ghostComumEntity
            );
        }
    },

    startCapture: function () {
        if (this.isCapturing || 
            !this.arManager.isObjectPlaced('ghost') || 
            this.gameState.isInventoryFull()) {
            return;
        }

        // Pausa as animações do fantasma
        this.arManager.pauseGhostAnimations();

        this.isCapturing = true;
        this.protonBeamSound.play();
        
        // NOVO: Efeitos visuais do feixe de prótons
        if (window.visualEffectsSystem) {
            window.visualEffectsSystem.startProtonBeamEffect();
        }
        
        // NOVO: Animação da proton pack
        if (window.animationManager) {
            this.protonFireAnimation = window.animationManager.animateProtonPackFire(this.uiManager.protonPackIcon);
        }

        this.uiManager.showProtonPackProgress();
        let startTime = Date.now();

        const ghostData = this.gameState.getGhostData();
        const duration = ghostData.captureDuration;
        
        this.progressInterval = setInterval(() => {
            const elapsedTime = Date.now() - startTime;
            const progress = Math.min(elapsedTime / duration, 1);
            this.uiManager.updateProtonPackProgress(progress);
        }, 100);

        this.captureTimer = setTimeout(() => {
            this.ghostCaptured();
        }, duration);
    },

    cancelCapture: function () {
        if (!this.isCapturing) return;
        this.isCapturing = false;
        this.protonBeamSound.pause();
        this.protonBeamSound.currentTime = 0;
        
        // NOVO: Parar efeitos visuais
        if (window.visualEffectsSystem) {
            window.visualEffectsSystem.stopProtonBeamEffect();
        }
        
        // NOVO: Parar animação da proton pack
        if (this.protonFireAnimation) {
            this.protonFireAnimation.stop();
            this.protonFireAnimation = null;
        }
        
        clearTimeout(this.captureTimer);
        clearInterval(this.progressInterval);
        this.uiManager.hideProtonPackProgress();

        // Retoma as animações do fantasma
        this.arManager.resumeGhostAnimations();
    },

    ghostCaptured: function () {
        this.cancelCapture();
        this.ghostCaptureSound.play(); // Som de captura bem-sucedida
        
        // NOVO: Efeitos visuais de celebração (centro da tela)
        if (window.visualEffectsSystem && window.visualEffectsSystem.isInitialized) {
            const centerX = window.innerWidth / 2;
            const centerY = window.innerHeight / 2;
            window.visualEffectsSystem.showCelebrationEffect(
                centerX, centerY,
                'ghost_captured'
            );
        }

        // NOVO: Efeito de sucção do fantasma para a ghost trap
        if (window.visualEffectsSystem) {
            const centerX = window.innerWidth / 2;
            const centerY = window.innerHeight / 2;
            const inventoryRect = this.uiManager.inventoryIconContainer.getBoundingClientRect();

            window.visualEffectsSystem.showSuctionEffect(
                centerX, centerY, // Centro da tela (fantasma)
                inventoryRect.left + inventoryRect.width / 2,
                inventoryRect.top + inventoryRect.height / 2
            );
        }
        
        // NOVO: Animação do fantasma sendo capturado
        if (this.arManager.activeGhostEntity && window.animationManager) {
            window.animationManager.animateGhostCapture(this.arManager.activeGhostEntity);
        }
        
        // NOVO: Notificação estilizada
        if (window.notificationSystem && window.notificationSystem.isInitialized) {
            window.notificationSystem.ghostCaptured(
                this.gameState.getGhostData().type, 
                this.gameState.getGhostData().points
            );
        }
        
        if (this.arManager.activeGhostEntity) {
            this.arManager.activeGhostEntity.setAttribute('visible', false);
        }
        
        // Resetar estado do AR
        this.arManager.resetPlacementState();

        // Adicionar fantasma ao inventário
        const ghostData = this.gameState.getGhostData();
        const added = this.gameState.addGhostToInventory({
            id: Date.now(),
            type: ghostData.type,
            points: ghostData.points
        });

        // Atualizar estatísticas do usuário
        const userStats = this.gameState.updateUserStats(ghostData.points, 1);
        
        // Atualizar interface
        this.updateInventoryUI();

        // Verificar se inventário está cheio
        if (this.gameState.isInventoryFull()) {
            this.inventoryFullSound.play(); // Som de inventário cheio
            
            // NOVO: Efeito visual de inventário cheio
            if (window.animationManager) {
                window.animationManager.animateInventoryFull(this.uiManager.inventoryIconContainer);
            }
            if (window.notificationSystem) {
                window.notificationSystem.inventoryFull();
            }
        }

        // Verificar se ECTO-1 deve ser desbloqueado
        if (userStats.ecto1Unlocked && !this.gameState.userStats.ecto1Unlocked) {
            this.gameState.userStats.ecto1Unlocked = true;
            
            this.showEcto1OnMap();
            
            // NOVO: Efeito especial do Ecto-1
            if (window.visualEffectsSystem) {
                window.visualEffectsSystem.showCelebrationEffect(
                    window.innerWidth / 2,
                    window.innerHeight / 2,
                    'ecto1_unlocked'
                );
            }
            if (window.notificationSystem) {
                window.notificationSystem.ecto1Unlocked();
            }
        }

        // Salvar estado no Firebase
        const userRef = ref(this.database, 'users/' + this.currentUser.uid);
        update(userRef, { 
            points: userStats.points, 
            captures: userStats.captures, 
            inventory: this.gameState.getInventory(), 
            ecto1Unlocked: userStats.ecto1Unlocked 
        });

        // Gerar novo fantasma
        this.generateGhost();
    },

    handleEmailLogin: function () {
        const email = this.uiManager.emailInput.value;
        const password = this.uiManager.passwordInput.value;
        
        if (!email || !password) {
            this.uiManager.updateAuthErrorMessage('Por favor, preencha todos os campos.');
            return;
        }
        
        this.authManager.signInWithEmail(email, password)
            .catch((error) => {
                this.uiManager.updateAuthErrorMessage(error.message);
            });
    },

    handleEmailSignup: function () {
        const email = this.uiManager.emailInput.value;
        const password = this.uiManager.passwordInput.value;
        
        if (!email || !password) {
            this.uiManager.updateAuthErrorMessage('Por favor, preencha todos os campos.');
            return;
        }
        
        this.authManager.signUpWithEmail(email, password)
            .catch((error) => {
                this.uiManager.updateAuthErrorMessage(error.message);
            });
    },

    tick: function (time, timeDelta) {
        if (!this.gameInitialized) return;

        const frame = this.el.sceneEl.renderer.xr.getFrame();
        if (!frame) return;

        // Delegar para o ARManager
        const objectPlaced = this.arManager.tick(this.gameInitialized, frame);
        
        // Se um objeto foi colocado, atualizar o estado
        if (objectPlaced) {
            // O estado já é atualizado no ARManager
        }
    }
});