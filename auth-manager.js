import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth, GoogleAuthProvider, signInWithPopup, onAuthStateChanged, signInAnonymously, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getDatabase, ref, set, get, update } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

export class AuthManager {
    constructor(gameManager) {
        this.gameManager = gameManager;
        this.auth = null;
        this.database = null;
        this.provider = null;
    }

    initializeApp(firebaseConfig) {
        // Initialize Firebase app
        const app = initializeApp(firebaseConfig);
        
        // Get auth and database instances correctly
        this.auth = getAuth(app);
        this.database = getDatabase(app);
        
        // Set up auth state listener
        onAuthStateChanged(this.auth, (user) => this.onAuthStateChanged(user));
        
        // Atribuir o database ao gameManager principal
        this.gameManager.database = this.database;
        
        return { auth: this.auth, database: this.database };
    }

    signInWithGoogle() {
        // Create provider instance
        this.provider = new GoogleAuthProvider();
        return signInWithPopup(this.auth, this.provider)
            .catch((error) => this.handleAuthError(error));
    }

    signInAsGuest() {
        return signInAnonymously(this.auth)
            .catch((error) => this.handleAuthError(error));
    }

    signInWithEmail(email, password) {
        if (!email || !password) {
            throw new Error('Por favor, preencha todos os campos.');
        }
        return signInWithEmailAndPassword(this.auth, email, password)
            .catch((error) => this.handleAuthError(error));
    }

    signUpWithEmail(email, password) {
        if (!email || !password) {
            throw new Error('Por favor, preencha todos os campos.');
        }
        return createUserWithEmailAndPassword(this.auth, email, password)
            .catch((error) => this.handleAuthError(error));
    }

    handleAuthError(error) {
        console.error("Authentication Error:", error.code, error.message);
        let errorMessage = 'Ocorreu um erro. Tente novamente.';
        
        switch (error.code) {
            case 'auth/user-not-found':
            case 'auth/wrong-password':
                errorMessage = 'Email ou senha inválidos.';
                break;
            case 'auth/invalid-email':
                errorMessage = 'O formato do email é inválido.';
                break;
            case 'auth/email-already-in-use':
                errorMessage = 'Este email já está em uso.';
                break;
            case 'auth/weak-password':
                errorMessage = 'A senha deve ter pelo menos 6 caracteres.';
                break;
        }
        
        // Para erros de login, apenas logamos e não lançamos exceção
        // para que o fluxo da aplicação continue
        console.error("Authentication error handled:", errorMessage);
        return { error: true, message: errorMessage };
    }

    saveUserToDatabase(user) {
        const userRef = ref(this.database, 'users/' + user.uid);
        return get(userRef).then((snapshot) => {
            if (snapshot.exists()) {
                this.gameManager.userStats = snapshot.val();
                // Atualizar o inventário do gameState com os dados do banco
                this.gameManager.gameState.inventory = this.gameManager.userStats.inventory || [];
            } else {
                let displayName = 'Caça-Fantasma';
                if (user.isAnonymous) {
                    displayName = 'Visitante';
                } else if (user.displayName) {
                    displayName = user.displayName;
                } else if (user.email) {
                    displayName = user.email.split('@')[0];
                }

                const newUserStats = { 
                    displayName: displayName, 
                    email: user.email, 
                    points: 0, 
                    captures: 0, 
                    level: 1, 
                    inventory: [], 
                    ecto1Unlocked: false 
                };
                return set(userRef, newUserStats).then(() => {
                    this.gameManager.userStats = newUserStats;
                    // Atualizar o inventário do gameState com os dados do banco
                    this.gameManager.gameState.inventory = [];
                });
            }
        });
    }

    onAuthStateChanged(user) {
        if (user) {
            this.gameManager.currentUser = user;
            this.saveUserToDatabase(user).then(() => {
                this.gameManager.updateInventoryUI();
                
                // Verificar se os elementos existem antes de manipulá-los
                if (this.gameManager.uiManager && this.gameManager.uiManager.loginScreen) {
                    this.gameManager.uiManager.loginScreen.classList.add('hidden');
                }
                if (this.gameManager.uiManager && this.gameManager.uiManager.emailLoginScreen) {
                    this.gameManager.uiManager.emailLoginScreen.classList.add('hidden');
                }
                if (this.gameManager.uiManager && this.gameManager.uiManager.locationScreen) {
                    this.gameManager.uiManager.locationScreen.classList.remove('hidden');
                }
            }).catch((error) => {
                console.error("Error saving user to database:", error);
            });
        } else {
            this.gameManager.currentUser = null;
            
            // Verificar se os elementos existem antes de manipulá-los
            if (this.gameManager.uiManager && this.gameManager.uiManager.loginScreen) {
                this.gameManager.uiManager.loginScreen.classList.remove('hidden');
            }
            if (this.gameManager.uiManager && this.gameManager.uiManager.locationScreen) {
                this.gameManager.uiManager.locationScreen.classList.add('hidden');
            }
            if (this.gameManager.uiManager && this.gameManager.uiManager.gameUi) {
                this.gameManager.uiManager.gameUi.classList.add('hidden');
            }
            // Esconder o menu AR se estiver visível
            if (this.gameManager.uiManager && this.gameManager.uiManager.arMenu) {
                this.gameManager.uiManager.arMenu.classList.add('hidden');
            }
        }
    }
}