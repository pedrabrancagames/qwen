/**
 * Efeito de Partículas de Fundo para a Tela de Login - Ghost Squad
 * Cria um efeito visual sutíl de partículas flutuantes na tela de login
 */

class LoginBackgroundEffect {
    constructor() {
        this.canvas = null;
        this.ctx = null;
        this.particles = [];
        this.animationId = null;
        this.isRunning = false;
        
        // Configurações
        this.config = {
            particleCount: 50,
            particleSize: { min: 1, max: 3 },
            particleSpeed: { min: 0.2, max: 0.8 },
            particleOpacity: { min: 0.1, max: 0.5 },
            particleColor: '146, 244, 40' // Cor verde ghostbusters
        };
        
        // Aguardar carregamento da página antes de inicializar
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.init());
        } else {
            // Se já carregou, aguardar um pouco para garantir que body existe
            setTimeout(() => this.init(), 100);
        }
    }
    
    init() {
        // Verificação robusta do ambiente
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
            
            // Adicionar listener para redimensionamento
            window.addEventListener('resize', () => {
                this.setupCanvas();
                this.initParticles(); // Recriar partículas ao redimensionar
            });
            
            console.log('🎨 Efeito de Partículas de Fundo inicializado com sucesso');
        } catch (error) {
            console.error('❌ Erro ao inicializar Efeito de Partículas de Fundo:', error);
            // Tentar novamente em 500ms
            setTimeout(() => this.init(), 500);
        }
    }
    
    createCanvas() {
        console.log('🖼️ Criando canvas para partículas de fundo...');
        
        // Remove canvas existente se houver
        const existingCanvas = document.getElementById('login-background');
        if (existingCanvas) {
            console.log('🖼️ Removendo canvas existente');
            existingCanvas.remove();
        }
        
        // Cria novo canvas
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
        `;
        
        // Adicionar ao body
        document.body.appendChild(this.canvas);
        this.ctx = this.canvas.getContext('2d');
        
        console.log('🖼️ Canvas de partículas criado com sucesso');
    }
    
    setupCanvas() {
        const updateSize = () => {
            const dpr = window.devicePixelRatio || 1;
            const width = window.innerWidth;
            const height = window.innerHeight;
            
            // Definir tamanho real do canvas
            this.canvas.width = width * dpr;
            this.canvas.height = height * dpr;
            
            // Definir tamanho CSS
            this.canvas.style.width = width + 'px';
            this.canvas.style.height = height + 'px';
            
            // Ajustar escala do contexto
            this.ctx.scale(dpr, dpr);
            
            console.log(`🖼️ Canvas de partículas redimensionado: ${width}x${height} (DPR: ${dpr})`);
        };
        
        updateSize();
    }
    
    initParticles() {
        this.particles = [];
        const count = this.config.particleCount;
        
        for (let i = 0; i < count; i++) {
            this.particles.push({
                x: Math.random() * window.innerWidth,
                y: Math.random() * window.innerHeight,
                vx: (Math.random() - 0.5) * (this.config.particleSpeed.max - this.config.particleSpeed.min) + this.config.particleSpeed.min,
                vy: (Math.random() - 0.5) * (this.config.particleSpeed.max - this.config.particleSpeed.min) + this.config.particleSpeed.min,
                size: Math.random() * (this.config.particleSize.max - this.config.particleSize.min) + this.config.particleSize.min,
                opacity: Math.random() * (this.config.particleOpacity.max - this.config.particleOpacity.min) + this.config.particleOpacity.min,
                // Variação na cor para efeito mais interessante
                colorVariation: Math.random() * 50 - 25 // -25 a 25 variação
            });
        }
        
        console.log(`✨ ${count} partículas inicializadas`);
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
        
        // Verificar se o canvas ainda existe
        if (!this.canvas || !this.canvas.parentElement) {
            console.warn('⚠️ Canvas de partículas perdido, recriando...');
            this.createCanvas();
            this.setupCanvas();
            this.initParticles();
        }
        
        // Limpar canvas
        this.ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
        
        // Atualizar e renderizar partículas
        this.updateParticles();
        this.renderParticles();
        
        this.animationId = requestAnimationFrame(() => this.animate());
    }
    
    updateParticles() {
        this.particles.forEach(p => {
            // Atualizar posição
            p.x += p.vx;
            p.y += p.vy;
            
            // Efeito de flutuação suave
            p.x += Math.sin(Date.now() * 0.001 + p.y * 0.01) * 0.2;
            p.y += Math.cos(Date.now() * 0.001 + p.x * 0.01) * 0.2;
            
            // Wrap around edges com suavidade
            if (p.x > window.innerWidth + 20) p.x = -20;
            if (p.x < -20) p.x = window.innerWidth + 20;
            if (p.y > window.innerHeight + 20) p.y = -20;
            if (p.y < -20) p.y = window.innerHeight + 20;
            
            // Variação suave na opacidade
            p.opacity += (Math.random() - 0.5) * 0.01;
            p.opacity = Math.max(this.config.particleOpacity.min, Math.min(this.config.particleOpacity.max, p.opacity));
        });
    }
    
    renderParticles() {
        this.particles.forEach(p => {
            this.ctx.beginPath();
            this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            
            // Cor com variação
            const r = 146;
            const g = Math.max(0, Math.min(255, 244 + p.colorVariation));
            const b = Math.max(0, Math.min(255, 40 - p.colorVariation));
            
            this.ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${p.opacity})`;
            this.ctx.fill();
            
            // Adicionar um pequeno brilho
            this.ctx.shadowColor = `rgba(${r}, ${g}, ${b}, ${p.opacity * 0.5})`;
            this.ctx.shadowBlur = p.size * 2;
            this.ctx.fill();
            this.ctx.shadowBlur = 0;
        });
    }
    
    // Ajustar densidade de partículas
    setDensity(density) {
        this.config.particleCount = Math.max(10, Math.min(200, density));
        this.initParticles();
    }
    
    // Ajustar velocidade das partículas
    setSpeed(speed) {
        // Speed de 0.1 a 2.0
        const normalized = Math.max(0.1, Math.min(2.0, speed));
        this.config.particleSpeed.min = 0.2 * normalized;
        this.config.particleSpeed.max = 0.8 * normalized;
    }
    
    // Limpar todas as partículas
    clear() {
        this.particles = [];
        if (this.ctx) {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        }
    }
}

// Inicializar sistema globalmente quando a página estiver pronta
if (typeof window !== 'undefined') {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            window.loginBackgroundEffect = new LoginBackgroundEffect();
        });
    } else {
        window.loginBackgroundEffect = new LoginBackgroundEffect();
    }
}

console.log('🎨 Sistema de Partículas de Fundo carregado com sucesso!');