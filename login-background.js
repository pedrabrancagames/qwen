/**
 * Efeito de Partículas de Ectoplasma para a Tela de Login - Ghost Squad
 * Cria um efeito visual de partículas de ectoplasma flutuantes e gosmentas.
 */

class LoginBackgroundEffect {
    constructor() {
        this.canvas = null;
        this.ctx = null;
        this.particles = [];
        this.animationId = null;
        this.isRunning = false;
        
        // Configurações para um visual de ectoplasma
        this.config = {
            particleCount: 75, // Aumentado para um efeito mais denso
            particleSize: { min: 2, max: 6 },
            particleSpeed: { min: 0.3, max: 1.0 },
            particleOpacity: { min: 0.2, max: 0.7 },
            particleColor: '120, 255, 100', // Verde ectoplasma mais vibrante
            trailLength: 0.92, // Quão rápido o rastro desaparece (0 a 1)
            gravity: 0.02, // Leve puxão para baixo
        };
        
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.init());
        } else {
            setTimeout(() => this.init(), 100);
        }
    }
    
    init() {
        if (!document.body) {
            console.warn('⚠️ document.body não disponível, tentando novamente em 200ms...');
            setTimeout(() => this.init(), 200);
            return;
        }
        
        try {
            this.createCanvas();
            this.setupCanvas();
            this.initParticles();
            this.start();
            
            window.addEventListener('resize', () => {
                this.setupCanvas();
                this.initParticles();
            });
            
            console.log('🎨 Efeito de Ectoplasma de Fundo inicializado com sucesso');
        } catch (error) {
            console.error('❌ Erro ao inicializar Efeito de Ectoplasma:', error);
            setTimeout(() => this.init(), 500);
        }
    }
    
    createCanvas() {
        const existingCanvas = document.getElementById('login-background');
        if (existingCanvas) {
            existingCanvas.remove();
        }
        
        this.canvas = document.createElement('canvas');
        this.canvas.id = 'login-background';
        this.canvas.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: -1;
            pointer-events: none;
            background-color: #080808; // Fundo escuro para destacar o efeito
        `;
        
        document.body.insertBefore(this.canvas, document.body.firstChild);
        this.ctx = this.canvas.getContext('2d');
    }
    
    setupCanvas() {
        const dpr = window.devicePixelRatio || 1;
        const width = window.innerWidth;
        const height = window.innerHeight;
        
        this.canvas.width = width * dpr;
        this.canvas.height = height * dpr;
        
        this.canvas.style.width = width + 'px';
        this.canvas.style.height = height + 'px';
        
        this.ctx.scale(dpr, dpr);
    }
    
    initParticles() {
        this.particles = [];
        const count = this.config.particleCount;
        
        for (let i = 0; i < count; i++) {
            this.particles.push(this.createParticle());
        }
        
        console.log(`✨ ${count} partículas de ectoplasma inicializadas`);
    }

    createParticle(x, y) {
        const size = Math.random() * (this.config.particleSize.max - this.config.particleSize.min) + this.config.particleSize.min;
        return {
            x: x || Math.random() * window.innerWidth,
            y: y || Math.random() * window.innerHeight,
            vx: (Math.random() - 0.5) * (this.config.particleSpeed.max - this.config.particleSpeed.min) + this.config.particleSpeed.min,
            vy: (Math.random() - 0.5) * (this.config.particleSpeed.max - this.config.particleSpeed.min),
            size: size,
            opacity: Math.random() * (this.config.particleOpacity.max - this.config.particleOpacity.min) + this.config.particleOpacity.min,
            // Para a forma orgânica
            shapePoints: Array.from({ length: 5 }, () => ({
                x: (Math.random() - 0.5) * size * 1.5,
                y: (Math.random() - 0.5) * size * 1.5,
            })),
            life: 1,
            decay: Math.random() * 0.005 + 0.001, // Taxa de envelhecimento
        };
    }
    
    start() {
        if (!this.isRunning) {
            this.isRunning = true;
            this.animate();
        }
    }
    
    stop() {
        this.isRunning = false;
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
    }
    
    animate() {
        if (!this.isRunning) return;
        
        // Efeito de rastro (motion blur)
        this.ctx.fillStyle = `rgba(8, 8, 8, ${1 - this.config.trailLength})`;
        this.ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);
        
        this.updateParticles();
        this.renderParticles();
        
        this.animationId = requestAnimationFrame(() => this.animate());
    }
    
    updateParticles() {
        this.particles.forEach((p, index) => {
            p.vx += (Math.random() - 0.5) * 0.1;
            p.vy += this.config.gravity; // Aplicar gravidade
            
            p.x += p.vx;
            p.y += p.vy;

            p.life -= p.decay;
            
            // Reciclar partículas que saem da tela ou morrem
            if (p.y > window.innerHeight + 20 || p.life <= 0) {
                this.particles[index] = this.createParticle(Math.random() * window.innerWidth, -20);
            }
        });
    }
    
    renderParticles() {
        this.particles.forEach(p => {
            this.ctx.beginPath();
            
            const coreColor = `rgba(${this.config.particleColor}, ${p.opacity * p.life})`;
            const glowColor = `rgba(${this.config.particleColor}, ${p.opacity * p.life * 0.3})`;

            // Brilho externo
            this.ctx.shadowColor = glowColor;
            this.ctx.shadowBlur = p.size * 3;

            // Desenhar forma orgânica
            this.ctx.fillStyle = coreColor;
            this.ctx.moveTo(p.x + p.shapePoints[0].x, p.y + p.shapePoints[0].y);
            for (let i = 1; i < p.shapePoints.length; i++) {
                this.ctx.quadraticCurveTo(
                    p.x + p.shapePoints[i-1].x, p.y + p.shapePoints[i-1].y,
                    p.x + p.shapePoints[i].x, p.y + p.shapePoints[i].y
                );
            }
            this.ctx.closePath();
            this.ctx.fill();
        });
        // Resetar sombra para não afetar outros elementos
        this.ctx.shadowBlur = 0;
    }
    
    setDensity(density) {
        this.config.particleCount = Math.max(10, Math.min(300, density));
        this.initParticles();
    }
    
    setSpeed(speed) {
        const normalized = Math.max(0.1, Math.min(2.0, speed));
        this.config.particleSpeed.min = 0.3 * normalized;
        this.config.particleSpeed.max = 1.0 * normalized;
    }
    
    clear() {
        this.particles = [];
        if (this.ctx) {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        }
    }
}

if (typeof window !== 'undefined') {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            window.loginBackgroundEffect = new LoginBackgroundEffect();
        });
    } else {
        window.loginBackgroundEffect = new LoginBackgroundEffect();
    }
}

console.log('🎨 Sistema de Ectoplasma de Fundo carregado com sucesso!');
