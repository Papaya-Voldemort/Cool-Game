/**
 * Enemy AI System
 */

class Enemy {
    constructor(x, y, type = 'basic') {
        this.x = x;
        this.y = y;
        this.width = 30;
        this.height = 40;
        this.vx = 0;
        this.vy = 0;
        this.type = type;
        
        // Stats based on type
        this.maxHp = type === 'strong' ? CONSTANTS.ENEMY_STRONG_HP : CONSTANTS.ENEMY_BASIC_HP;
        this.hp = this.maxHp;
        this.damage = type === 'strong' ? 15 : 10;
        this.speed = type === 'strong' ? 2 : 3;
        this.isAlive = true;
        
        // AI state
        this.state = 'patrol';
        this.target = null;
        this.patrolDirection = 1;
        this.patrolDistance = 100;
        this.startX = x;
        this.detectionRange = 200;
        this.attackRange = 50;
        
        // Combat
        this.isAttacking = false;
        this.attackCooldown = 0;
        this.attackTimer = 0;
        
        // Behavior patterns
        this.behaviorTimer = 0;
        this.currentBehavior = 'aggressive';
    }
    
    update(dt, player, world) {
        if (!this.isAlive) return;
        
        // Update timers
        if (this.attackCooldown > 0) this.attackCooldown -= dt * 1000;
        if (this.attackTimer > 0) {
            this.attackTimer -= dt * 1000;
            if (this.attackTimer <= 0) {
                this.isAttacking = false;
            }
        }
        
        this.behaviorTimer += dt;
        
        // AI decision making
        const distanceToPlayer = Utils.distance(this.x, this.y, player.x, player.y);
        
        if (distanceToPlayer < this.detectionRange) {
            this.target = player;
            
            if (distanceToPlayer < this.attackRange) {
                this.state = 'attack';
            } else {
                this.state = 'chase';
            }
        } else {
            this.target = null;
            this.state = 'patrol';
        }
        
        // Adaptive AI - change behavior based on player actions
        if (this.behaviorTimer > 5) {
            this.adaptBehavior(player);
            this.behaviorTimer = 0;
        }
        
        // Execute state
        switch (this.state) {
            case 'patrol':
                this.patrol(dt);
                break;
            case 'chase':
                this.chase(dt, player);
                break;
            case 'attack':
                this.attackPlayer(dt, player);
                break;
        }
        
        // Apply physics
        this.applyPhysics(dt, world);
    }
    
    patrol(dt) {
        // Simple patrol movement
        this.vx = this.patrolDirection * this.speed * 0.5;
        
        // Turn around at patrol boundaries
        if (Math.abs(this.x - this.startX) > this.patrolDistance) {
            this.patrolDirection *= -1;
        }
    }
    
    chase(dt, player) {
        // Move towards player
        const dx = player.x - this.x;
        const direction = dx > 0 ? 1 : -1;
        
        if (this.currentBehavior === 'aggressive') {
            // Direct chase
            this.vx = direction * this.speed;
        } else if (this.currentBehavior === 'tactical') {
            // Try to flank or maintain distance
            if (Math.abs(dx) < 100) {
                // Too close, back away
                this.vx = -direction * this.speed * 0.5;
            } else {
                this.vx = direction * this.speed * 0.7;
            }
        } else if (this.currentBehavior === 'defensive') {
            // Cautious approach
            this.vx = direction * this.speed * 0.3;
        }
    }
    
    attackPlayer(dt, player) {
        // Stop moving and attack
        this.vx *= 0.5;
        
        if (this.attackCooldown <= 0) {
            this.isAttacking = true;
            this.attackTimer = 200;
            this.attackCooldown = 1000;
        }
    }
    
    adaptBehavior(player) {
        // Adapt based on player's recent actions
        if (player.comboCount > 3) {
            // Player is aggressive, be defensive
            this.currentBehavior = 'defensive';
        } else if (player.dodgeCooldown > 0) {
            // Player just dodged, be aggressive
            this.currentBehavior = 'aggressive';
        } else {
            // Default tactical approach
            this.currentBehavior = 'tactical';
        }
    }
    
    applyPhysics(dt, world) {
        // Simple gravity
        this.vy += CONSTANTS.GRAVITY;
        this.vy = Math.min(this.vy, CONSTANTS.MAX_FALL_SPEED);
        
        // Update position
        this.x += this.vx;
        this.y += this.vy;
        
        // Ground collision
        const platforms = world.getPlatforms();
        for (const platform of platforms) {
            if (this.checkCollision(platform)) {
                if (this.vy > 0) {
                    this.y = platform.y - this.height;
                    this.vy = 0;
                }
            }
        }
        
        // World bounds
        this.x = Utils.clamp(this.x, 0, world.width - this.width);
        if (this.y > world.height) {
            this.isAlive = false;
        }
    }
    
    checkCollision(rect) {
        return this.x < rect.x + rect.width &&
               this.x + this.width > rect.x &&
               this.y < rect.y + rect.height &&
               this.y + this.height > rect.y;
    }
    
    takeDamage(amount) {
        this.hp -= amount;
        if (this.hp <= 0) {
            this.hp = 0;
            this.isAlive = false;
        }
    }
    
    applyKnockback(direction, force) {
        this.vx = direction * force;
    }
    
    getAttackHitbox() {
        if (!this.isAttacking) return null;
        
        const attackRange = 40;
        return {
            x: this.x - attackRange / 2,
            y: this.y,
            width: this.width + attackRange,
            height: this.height,
            damage: this.damage
        };
    }
    
    render(ctx, cameraX, cameraY) {
        if (!this.isAlive) return;
        
        const screenX = this.x - cameraX;
        const screenY = this.y - cameraY;
        
        // Use procedural art generator
        artGenerator.drawEnemy(ctx, screenX, screenY, this.width, this.height, this.type, this.hp, this.maxHp);
        
        // Draw attack indicator
        if (this.isAttacking) {
            ctx.fillStyle = 'rgba(255, 0, 0, 0.3)';
            ctx.fillRect(screenX - 5, screenY, this.width + 10, this.height);
        }
        
        // Draw behavior indicator (for visual feedback)
        ctx.fillStyle = CONSTANTS.COLORS.WHITE;
        ctx.font = '10px Arial';
        ctx.fillText(this.state[0].toUpperCase(), screenX + this.width / 2 - 5, screenY - 15);
    }
}
