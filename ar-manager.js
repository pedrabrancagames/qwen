/**
 * AR Manager - Ghost Squad
 * Gerencia elementos de realidade aumentada, incluindo posicionamento, hit testing e renderização
 */

export class ARManager {
    constructor() {
        this.hitTestSource = null;
        this.referenceSpace = null;
        this.placedObjects = { ghost: false, ecto1: false };
        this.objectToPlace = null;
        this.reticle = null;
        this.ghostComumEntity = null;
        this.ghostForteEntity = null;
        this.ghostComumRotator = null;
        this.ghostComumBobber = null;
        this.ghostForteRotator = null;
        this.ghostForteBobber = null;
        this.activeGhostEntity = null;
        this.ecto1Entity = null;
        this.currentRotatorEntity = null;
        this.currentBobberEntity = null;
    }

    // Inicializa elementos AR
    initializeARElements() {
        this.reticle = document.getElementById('reticle');
        this.ghostComumEntity = document.getElementById('ghost-comum');
        this.ghostForteEntity = document.getElementById('ghost-forte');
        this.ghostComumRotator = document.getElementById('ghost-comum-rotator');
        this.ghostComumBobber = document.getElementById('ghost-comum-bobber');
        this.ghostForteRotator = document.getElementById('ghost-forte-rotator');
        this.ghostForteBobber = document.getElementById('ghost-forte-bobber');
        this.ecto1Entity = document.getElementById('ecto-1');
    }

    // Configura o hit test para AR
    async setupHitTest(sceneEl) {
        const session = sceneEl.renderer.xr.getSession();
        this.referenceSpace = await session.requestReferenceSpace('viewer');
        this.hitTestSource = await session.requestHitTestSource({ space: this.referenceSpace });
    }

    // Processa o tick para atualização de elementos AR
    tick(gameInitialized, frame) {
        if (!gameInitialized || !this.hitTestSource) return false;

        if (!frame) return false;

        const hitTestResults = frame.getHitTestResults(this.hitTestSource);

        if (hitTestResults.length > 0) {
            const hit = hitTestResults[0];
            const pose = hit.getPose(this.referenceSpace);
            this.reticle.setAttribute('visible', true);
            this.reticle.object3D.matrix.fromArray(pose.transform.matrix);
            this.reticle.object3D.matrix.decompose(this.reticle.object3D.position, this.reticle.object3D.quaternion, this.reticle.object3D.scale);
            
            // Posicionamento automático
            if (this.objectToPlace && !this.placedObjects[this.objectToPlace]) {
                this.placeObject();
                return true; // Objeto foi colocado
            }
        } else {
            this.reticle.setAttribute('visible', false);
        }
        return false; // Nenhum objeto foi colocado
    }

    // Coloca um objeto no ambiente AR
    placeObject() {
        if (!this.objectToPlace || this.placedObjects[this.objectToPlace] || !this.reticle.getAttribute('visible')) return;

        let entityToPlace;
        if (this.objectToPlace === 'ghost') {
            entityToPlace = this.activeGhostEntity;
        } else if (this.objectToPlace === 'ecto1') {
            entityToPlace = this.ecto1Entity;
        }

        if (entityToPlace) {
            const pos = this.reticle.object3D.position;
            entityToPlace.setAttribute('position', `${pos.x} ${pos.y} ${pos.z}`);
            entityToPlace.setAttribute('visible', 'true');
            entityToPlace.setAttribute('scale', '0.5 0.5 0.5');

            // Determina qual tipo de fantasma está sendo colocado e inicia suas animações.
            let rotatorEntity, bobberEntity;
            if (this.activeGhostEntity === this.ghostComumEntity) {
                rotatorEntity = this.ghostComumRotator;
                bobberEntity = this.ghostComumBobber;
            } else if (this.activeGhostEntity === this.ghostForteEntity) {
                rotatorEntity = this.ghostForteRotator;
                bobberEntity = this.ghostForteBobber;
            }

            if (rotatorEntity && bobberEntity) {
                // Garante que as animações sejam reiniciadas e reproduzidas.
                rotatorEntity.components.animation__rotation.pause();
                rotatorEntity.components.animation__rotation.currentTime = 0;
                rotatorEntity.components.animation__rotation.play();

                bobberEntity.components.animation__bob.pause();
                bobberEntity.components.animation__bob.currentTime = 0;
                bobberEntity.components.animation__bob.play();
            }

            this.currentRotatorEntity = rotatorEntity; // Armazena a referência
            this.currentBobberEntity = bobberEntity;   // Armazena a referência

            this.placedObjects[this.objectToPlace] = true;
            this.reticle.setAttribute('visible', 'false');
        }
    }

    // Define o objeto a ser colocado
    setObjectToPlace(objectType) {
        this.objectToPlace = objectType;
    }

    // Define a entidade do fantasma ativo
    setActiveGhostEntity(entity) {
        this.activeGhostEntity = entity;
    }

    // Pausa as animações do fantasma
    pauseGhostAnimations() {
        if (this.currentRotatorEntity && this.currentBobberEntity) {
            this.currentRotatorEntity.components.animation__rotation.pause();
            this.currentBobberEntity.components.animation__bob.pause();
        }
    }

    // Retoma as animações do fantasma
    resumeGhostAnimations() {
        if (this.currentRotatorEntity && this.currentBobberEntity) {
            this.currentRotatorEntity.components.animation__rotation.play();
            this.currentBobberEntity.components.animation__bob.play();
        }
    }

    // Verifica se um objeto foi colocado
    isObjectPlaced(objectType) {
        return this.placedObjects[objectType] || false;
    }

    // Reseta o estado de posicionamento
    resetPlacementState() {
        this.placedObjects.ghost = false;
        this.placedObjects.ecto1 = false;
        this.objectToPlace = null;
        this.activeGhostEntity = null;
        this.currentRotatorEntity = null;
        this.currentBobberEntity = null;
    }
}