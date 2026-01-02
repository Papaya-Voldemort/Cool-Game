/**
 * Particle Effects System
 * Creates visual effects for attacks, environmental elements, and special events
 */

class ParticleSystem {
    constructor() {
        this.particles = [];
        this.maxParticles = 500;
    }
    
    createExplosion(x, y, color = '#FF8800', count = 20) {
        for (let i = 0; i < count; i++) {
            const angle = (Math.PI * 2 * i) / count;
            const speed = 2 + Math.random() * 3;
            this.particles.push({
                x,
                y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                life: 1.0,
                maxLife: 0.5 + Math.random() * 0.5,
                size: 3 + Math.random() * 4,
                color,
                type: 'explosion'
            });
        }
    }
    
    createHitEffect(x, y, critical = false) {
        const count = critical ? 15 : 8;
        const color = critical ? '#FFD700' : '#FF4400';
        
        for (let i = 0; i < count; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = 1 + Math.random() * 2;
            this.particles.push({
                x,
                y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed - 1,
                life: 1.0,
                maxLife: 0.3 + Math.random() * 0.3,
                size: 2 + Math.random() * 3,
                color,
                type: 'hit'
            });
        }
    }
    
    createDodgeEffect(x, y, width, height) {
        for (let i = 0; i < 12; i++) {
            this.particles.push({
                x: x + Math.random() * width,
                y: y + Math.random() * height,
                vx: (Math.random() - 0.5) * 3,
                vy: (Math.random() - 0.5) * 3,
                life: 1.0,
                maxLife: 0.4,
                size: 2,
                color: '#FFFFFF',
                type: 'dodge'
            });
        }
    }
    
    createHealEffect(x, y) {
        for (let i = 0; i < 10; i++) {
            this.particles.push({
                x: x + (Math.random() - 0.5) * 20,
                y: y + Math.random() * 40,
                vx: (Math.random() - 0.5) * 0.5,
                vy: -1 - Math.random(),
                life: 1.0,
                maxLife: 1.0,
                size: 3,
                color: '#00FF88',
                type: 'heal'
            });
        }
    }
    
    createTrail(x, y, color = '#FFFFFF', size = 2) {
        if (Math.random() < 0.5) {
            this.particles.push({
                x: x + (Math.random() - 0.5) * 5,
                y: y + (Math.random() - 0.5) * 5,
                vx: 0,
                vy: 0,
                life: 1.0,
                maxLife: 0.3,
                size,
                color,
                type: 'trail'
            });
        }
    }
    
    createMagicEffect(x, y, type = 'fire') {
        const configs = {
            fire: { color: '#FF6600', count: 15, gravity: -0.2 },
            ice: { color: '#00CCFF', count: 12, gravity: 0.1 },
            lightning: { color: '#FFFF00', count: 8, gravity: 0 },
            dark: { color: '#8800FF', count: 10, gravity: 0 }
        };
        
        const config = configs[type] || configs.fire;
        
        for (let i = 0; i < config.count; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = 0.5 + Math.random() * 2;
            this.particles.push({
                x,
                y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                gravity: config.gravity,
                life: 1.0,
                maxLife: 0.6 + Math.random() * 0.4,
                size: 2 + Math.random() * 3,
                color: config.color,
                type: 'magic'
            });
        }
    }
    
    createAuraEffect(x, y, width, height, color = '#00FFFF') {
        // Continuous aura particles
        if (this.particles.length < this.maxParticles) {
            this.particles.push({
                x: x + Math.random() * width,
                y: y + Math.random() * height,
                vx: (Math.random() - 0.5) * 0.5,
                vy: -0.5 - Math.random() * 0.5,
                life: 1.0,
                maxLife: 0.8,
                size: 1 + Math.random() * 2,
                color,
                type: 'aura',
                alpha: 0.6
            });
        }
    }
    
    createEnvironmentalEffect(x, y, type = 'rain') {
        switch (type) {
            case 'rain':
                if (Math.random() < 0.3) {
                    this.particles.push({
                        x: x + Math.random() * 1280,
                        y: 0,
                        vx: -1,
                        vy: 8 + Math.random() * 4,
                        life: 1.0,
                        maxLife: 2.0,
                        size: 1,
                        color: '#88CCFF',
                        type: 'rain'
                    });
                }
                break;
            
            case 'snow':
                if (Math.random() < 0.2) {
                    this.particles.push({
                        x: x + Math.random() * 1280,
                        y: 0,
                        vx: (Math.random() - 0.5) * 2,
                        vy: 1 + Math.random() * 2,
                        life: 1.0,
                        maxLife: 3.0,
                        size: 2 + Math.random(),
                        color: '#FFFFFF',
                        type: 'snow'
                    });
                }
                break;
            
            case 'leaves':
                if (Math.random() < 0.1) {
                    this.particles.push({
                        x: x + Math.random() * 1280,
                        y: 0,
                        vx: (Math.random() - 0.5) * 3,
                        vy: 0.5 + Math.random(),
                        life: 1.0,
                        maxLife: 4.0,
                        size: 3,
                        color: Math.random() < 0.5 ? '#88CC44' : '#CC8844',
                        type: 'leaf',
                        rotation: Math.random() * Math.PI * 2,
                        rotationSpeed: (Math.random() - 0.5) * 0.1
                    });
                }
                break;
        }
    }
    
    update(dt) {
        // Update all particles
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const p = this.particles[i];
            
            // Update position
            p.x += p.vx;
            p.y += p.vy;
            
            // Apply gravity if specified
            if (p.gravity !== undefined) {
                p.vy += p.gravity;
            }
            
            // Update rotation
            if (p.rotation !== undefined && p.rotationSpeed !== undefined) {
                p.rotation += p.rotationSpeed;
            }
            
            // Update life
            p.life -= dt / p.maxLife;
            
            // Remove dead particles
            if (p.life <= 0) {
                this.particles.splice(i, 1);
            }
        }
        
        // Limit total particles
        while (this.particles.length > this.maxParticles) {
            this.particles.shift();
        }
    }
    
    render(ctx, cameraX, cameraY) {
        for (const p of this.particles) {
            const screenX = p.x - cameraX;
            const screenY = p.y - cameraY;
            
            // Skip off-screen particles
            if (screenX < -50 || screenX > ctx.canvas.width + 50 ||
                screenY < -50 || screenY > ctx.canvas.height + 50) {
                continue;
            }
            
            ctx.save();
            
            // Set alpha based on life
            ctx.globalAlpha = (p.alpha !== undefined ? p.alpha : 1.0) * p.life;
            
            // Draw based on type
            if (p.type === 'leaf' || p.type === 'magic') {
                ctx.translate(screenX, screenY);
                if (p.rotation !== undefined) {
                    ctx.rotate(p.rotation);
                }
                ctx.fillStyle = p.color;
                ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
            } else {
                ctx.fillStyle = p.color;
                ctx.fillRect(screenX - p.size / 2, screenY - p.size / 2, p.size, p.size);
            }
            
            ctx.restore();
        }
    }
    
    clear() {
        this.particles = [];
    }
}

// Screen shake effect
class ScreenShake {
    constructor() {
        this.intensity = 0;
        this.duration = 0;
        this.x = 0;
        this.y = 0;
    }
    
    shake(intensity, duration) {
        this.intensity = Math.max(this.intensity, intensity);
        this.duration = Math.max(this.duration, duration);
    }
    
    update(dt) {
        if (this.duration > 0) {
            this.duration -= dt;
            const currentIntensity = this.intensity * (this.duration / 0.5);
            this.x = (Math.random() - 0.5) * currentIntensity * 2;
            this.y = (Math.random() - 0.5) * currentIntensity * 2;
        } else {
            this.x = 0;
            this.y = 0;
            this.intensity = 0;
        }
    }
    
    getOffset() {
        return { x: this.x, y: this.y };
    }
}
