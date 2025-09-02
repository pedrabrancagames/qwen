import { getAuth, GoogleAuthProvider, signInWithPopup, onAuthStateChanged, signInAnonymously, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getDatabase, ref, set, get, update } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

export class AuthManager {
    constructor(gameManager) {
        this.gameManager = gameManager;
        this.auth = null;
        this.database = null;
        this.provider = null; // Não instanciar imediatamente
    }

    initializeApp(firebaseConfig) {
        // Firebase initialization is handled in game-manager, so we just get references
        this.auth = getAuth();
        this.database = getDatabase();
        this.provider = new GoogleAuthProvider(); // Instanciar aqui, quando realmente necessário
        onAuthStateChanged(this.auth, (user) => this.onAuthStateChanged(user));
        return { auth: this.auth, database: this.database, provider: this.provider };
    }

    signInWithGoogle() {
        return signInWithPopup(this.auth, this.provider);
    }

    signInAsGuest() {
        return signInAnonymously(this.auth).catch((error) => this.handleAuthError(error));
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
        
        throw new Error(errorMessage);
    }

    saveUserToDatabase(user) {
        const userRef = ref(this.database, 'users/' + user.uid);
        return get(userRef).then((snapshot) => {
            if (snapshot.exists()) {
                this.gameManager.userStats = snapshot.val();
                this.gameManager.inventory = this.gameManager.userStats.inventory || [];
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
                    this.gameManager.inventory = [];
                });
            }
        });
    }

    onAuthStateChanged(user) {
        if (user) {
            this.gameManager.currentUser = user;
            this.saveUserToDatabase(user).then(() => {
                this.gameManager.updateInventoryUI();
                this.gameManager.loginScreen.classList.add('hidden');
                this.gameManager.emailLoginScreen.classList.add('hidden');
                this.gameManager.locationScreen.classList.remove('hidden');
            });
        } else {
            this.gameManager.currentUser = null;
            this.gameManager.loginScreen.classList.remove('hidden');
            this.gameManager.locationScreen.classList.add('hidden');
            this.gameManager.gameUi.classList.add('hidden');
        }
    }
}