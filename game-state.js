pode/**
 * Game State Manager - Ghostbusters AR
 * Gerencia o estado do jogo, incluindo inventário, pontos, níveis e desbloqueios
 */

export class GameStateManager {
    constructor() {
        this.userStats = {
            points: 0,
            captures: 0,
            level: 1,
            ecto1Unlocked: false
        };
        this.inventory = [];
        this.CAPTURE_RADIUS = 15;
        this.CAPTURE_DURATION_NORMAL = 5000;
        this.CAPTURE_DURATION_STRONG = 8000;
        this.INVENTORY_LIMIT = 5;
        this.ECTO1_UNLOCK_COUNT = 5;
        this.locations = {
            "Praça Central": { lat: -27.630913, lon: -48.679793 },
            "Parque da Cidade": { lat: -27.639797, lon: -48.667749 },
            "Casa do Vô": { lat: -27.51563471648395, lon: -48.64996016391755 }
        };
        this.ECTO1_POSITION = {};
        this.ghostData = {};
        this.selectedLocation = null;
    }

    // Atualiza as estatísticas do usuário
    updateUserStats(points = 0, captures = 0) {
        this.userStats.points += points;
        this.userStats.captures += captures;

        // Verifica se o ECTO-1 deve ser desbloqueado
        if (this.userStats.captures >= this.ECTO1_UNLOCK_COUNT && !this.userStats.ecto1Unlocked) {
            this.userStats.ecto1Unlocked = true;
        }

        return this.userStats;
    }

    // Adiciona um fantasma ao inventário
    addGhostToInventory(ghost) {
        if (this.inventory.length < this.INVENTORY_LIMIT) {
            this.inventory.push(ghost);
            return true;
        }
        return false;
    }

    // Limpa o inventário
    clearInventory() {
        this.inventory = [];
    }

    // Define a localização selecionada
    setSelectedLocation(locationName) {
        if (this.locations[locationName]) {
            this.selectedLocation = this.locations[locationName];
            // Atualiza a posição do ECTO-1 com base na localização selecionada
            this.ECTO1_POSITION = {
                lat: this.selectedLocation.lat + 0.0005,
                lon: this.selectedLocation.lon - 0.0005
            };
            return true;
        }
        return false;
    }

    // Gera dados para um novo fantasma
    generateGhost() {
        if (this.inventory.length >= this.INVENTORY_LIMIT) {
            return null;
        }

        const radius = 0.0001;
        const isStrong = Math.random() < 0.25;
        
        this.ghostData = {
            lat: this.selectedLocation.lat + (Math.random() - 0.5) * radius * 2,
            lon: this.selectedLocation.lon + (Math.random() - 0.5) * radius * 2,
            type: isStrong ? 'Fantasma Forte' : 'Fantasma Comum',
            points: isStrong ? 25 : 10,
            captureDuration: isStrong ? this.CAPTURE_DURATION_STRONG : this.CAPTURE_DURATION_NORMAL
        };

        return this.ghostData;
    }

    // Verifica se o inventário está cheio
    isInventoryFull() {
        return this.inventory.length >= this.INVENTORY_LIMIT;
    }

    // Obtém o número de fantasmas no inventário
    getInventoryCount() {
        return this.inventory.length;
    }

    // Obtém as estatísticas do usuário
    getUserStats() {
        return this.userStats;
    }

    // Obtém o inventário
    getInventory() {
        return this.inventory;
    }

    // Obtém os dados do fantasma atual
    getGhostData() {
        return this.ghostData;
    }

    // Obtém a posição do ECTO-1
    getEcto1Position() {
        return this.ECTO1_POSITION;
    }

    // Verifica se o ECTO-1 está desbloqueado
    isEcto1Unlocked() {
        return this.userStats.ecto1Unlocked;
    }

    // Obtém a localização selecionada
    getSelectedLocation() {
        return this.selectedLocation;
    }

    // Obtém todas as localizações disponíveis
    getLocations() {
        return this.locations;
    }
}