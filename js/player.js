/**
 * Player Character
 */

class Player {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = 30;
        this.height = 50;
        this.vx = 0;
        this.vy = 0;
        this.onGround = false;
        this.direction = CONSTANTS.DIRECTION.RIGHT;
        
        // Stats
        this.hp = CONSTANTS.PLAYER_MAX_HP;
        this.maxHp = CONSTANTS.PLAYER_MAX_HP;
        
        // Combat
        this.isAttacking = false;
        this.attackCooldown = 0;
        this.comboCount = 0;
        this.lastAttackTime = 0;
        this.isDodging = false;
        this.dodgeCooldown = 0;
        this.invulnerable = false;
        this.invulnerabilityTimer = 0;
        
        // Movement abilities
        this.canDoubleJump = true;
        this.hasDoubleJumped = false;
        this.isClimbing = false;
        this.climbingWall = null;
    }
    
    update(dt, input, world) {
        // Update timers
        if (this.attackCooldown > 0) this.attackCooldown -= dt * 1000;
        if (this.dodgeCooldown > 0) this.dodgeCooldown -= dt * 1000;
        if (this.invulnerabilityTimer > 0) {
            this.invulnerabilityTimer -= dt * 1000;
            if (this.invulnerabilityTimer <= 0) {
                this.invulnerable = false;
            }
        }
        
        // Handle input
        this.handleInput(input, dt);
        
        // Apply physics
        this.applyPhysics(dt);
        
        // Check collisions with world
        this.handleCollisions(world);
        
        // Update combo timer
        if (Date.now() - this.lastAttackTime > CONSTANTS.COMBO_WINDOW) {
            this.comboCount = 0;
        }
        
        // Clamp HP
        this.hp = Utils.clamp(this.hp, 0, this.maxHp);
    }
    
    handleInput(input, dt) {
        // Dodge/Dash
        if (input.isActionPressed('dodge') && this.dodgeCooldown <= 0 && !this.isDodging) {
            this.startDodge();
        }
        
        if (this.isDodging) {
            // Continue dodge movement
            return;
        }
        
        // Horizontal movement
        const axis = input.getAxis('left', 'right');
        if (axis !== 0) {
            this.vx = axis * CONSTANTS.PLAYER_SPEED;
            this.direction = axis > 0 ? CONSTANTS.DIRECTION.RIGHT : CONSTANTS.DIRECTION.LEFT;
        } else {
            this.vx *= CONSTANTS.FRICTION;
        }
        
        // Climbing
        if (this.climbingWall && input.isActionDown('up')) {
            this.vy = -CONSTANTS.PLAYER_SPEED;
            this.isClimbing = true;
        } else if (this.climbingWall && input.isActionDown('down')) {
            this.vy = CONSTANTS.PLAYER_SPEED;
            this.isClimbing = true;
        } else {
            this.isClimbing = false;
        }
        
        // Jumping
        if (input.isActionPressed('jump')) {
            if (this.onGround) {
                this.vy = CONSTANTS.JUMP_SPEED;
                this.onGround = false;
                this.hasDoubleJumped = false;
            } else if (this.canDoubleJump && !this.hasDoubleJumped) {
                this.vy = CONSTANTS.JUMP_SPEED;
                this.hasDoubleJumped = true;
            } else if (this.climbingWall) {
                // Wall jump
                this.vy = CONSTANTS.JUMP_SPEED;
                this.vx = (this.climbingWall === 'left' ? 1 : -1) * CONSTANTS.PLAYER_SPEED * 1.5;
                this.climbingWall = null;
            }
        }
        
        // Attacking
        if (input.isActionPressed('attack') && this.attackCooldown <= 0) {
            this.attack('basic');
        }
        
        if (input.isActionPressed('special') && this.attackCooldown <= 0) {
            this.attack('special');
        }
    }
    
    applyPhysics(dt) {
        if (!this.isClimbing) {
            // Apply gravity
            this.vy += CONSTANTS.GRAVITY;
            this.vy = Math.min(this.vy, CONSTANTS.MAX_FALL_SPEED);
        }
        
        // Update position
        this.x += this.vx;
        this.y += this.vy;
    }
    
    handleCollisions(world) {
        const platforms = world.getPlatforms();
        this.onGround = false;
        this.climbingWall = null;
        
        for (const platform of platforms) {
            if (this.checkCollision(platform)) {
                // Determine collision side
                const overlapX = Math.min(
                    this.x + this.width - platform.x,
                    platform.x + platform.width - this.x
                );
                const overlapY = Math.min(
                    this.y + this.height - platform.y,
                    platform.y + platform.height - this.y
                );
                
                if (overlapX < overlapY) {
                    // Horizontal collision
                    if (this.x < platform.x) {
                        this.x = platform.x - this.width;
                        if (platform.climbable) {
                            this.climbingWall = 'right';
                        }
                    } else {
                        this.x = platform.x + platform.width;
                        if (platform.climbable) {
                            this.climbingWall = 'left';
                        }
                    }
                    this.vx = 0;
                } else {
                    // Vertical collision
                    if (this.y < platform.y) {
                        this.y = platform.y - this.height;
                        this.vy = 0;
                        this.onGround = true;
                        this.hasDoubleJumped = false;
                    } else {
                        this.y = platform.y + platform.height;
                        this.vy = 0;
                    }
                }
            }
        }
        
        // Clamp to world bounds
        this.x = Utils.clamp(this.x, 0, world.width - this.width);
        this.y = Utils.clamp(this.y, 0, world.height - this.height);
        
        if (this.y >= world.height - this.height) {
            this.onGround = true;
        }
    }
    
    checkCollision(rect) {
        return this.x < rect.x + rect.width &&
               this.x + this.width > rect.x &&
               this.y < rect.y + rect.height &&
               this.y + this.height > rect.y;
    }
    
    startDodge() {
        this.isDodging = true;
        this.invulnerable = true;
        this.dodgeCooldown = CONSTANTS.DODGE_COOLDOWN;
        
        // Dash in facing direction
        const dashMultiplier = this.direction === CONSTANTS.DIRECTION.RIGHT ? 1 : -1;
        this.vx = CONSTANTS.DASH_SPEED * dashMultiplier;
        
        // End dodge after short time
        setTimeout(() => {
            this.isDodging = false;
            this.invulnerable = false;
        }, 200);
    }
    
    attack(type) {
        this.isAttacking = true;
        this.attackCooldown = CONSTANTS.ATTACK_COOLDOWN;
        
        // Track combo
        if (Date.now() - this.lastAttackTime <= CONSTANTS.COMBO_WINDOW) {
            this.comboCount++;
        } else {
            this.comboCount = 1;
        }
        this.lastAttackTime = Date.now();
        
        // Create attack hitbox
        const attackRange = 40;
        const attackWidth = 30;
        const attackX = this.direction === CONSTANTS.DIRECTION.RIGHT 
            ? this.x + this.width 
            : this.x - attackRange;
        
        const attack = {
            x: attackX,
            y: this.y,
            width: attackRange,
            height: this.height,
            damage: type === 'special' ? CONSTANTS.PLAYER_DAMAGE * 2 : CONSTANTS.PLAYER_DAMAGE,
            type: type,
            combo: this.comboCount
        };
        
        // Animation
        setTimeout(() => {
            this.isAttacking = false;
        }, 150);
        
        return attack;
    }
    
    takeDamage(amount) {
        if (this.invulnerable) return false;
        
        this.hp -= amount;
        this.invulnerable = true;
        this.invulnerabilityTimer = CONSTANTS.INVULNERABILITY_TIME;
        
        return true;
    }
    
    heal(amount) {
        this.hp = Math.min(this.hp + amount, this.maxHp);
    }
    
    getAttackHitbox() {
        if (!this.isAttacking) return null;
        
        const attackRange = 40;
        const attackX = this.direction === CONSTANTS.DIRECTION.RIGHT 
            ? this.x + this.width 
            : this.x - attackRange;
        
        return {
            x: attackX,
            y: this.y,
            width: attackRange,
            height: this.height,
            damage: CONSTANTS.PLAYER_DAMAGE * (this.comboCount > 1 ? 1.5 : 1)
        };
    }
    
    render(ctx, cameraX, cameraY) {
        const screenX = this.x - cameraX;
        const screenY = this.y - cameraY;
        
        // Draw player (placeholder rectangle)
        ctx.save();
        
        // Flash if invulnerable
        if (this.invulnerable && Math.floor(Date.now() / 100) % 2 === 0) {
            ctx.globalAlpha = 0.5;
        }
        
        ctx.fillStyle = CONSTANTS.COLORS.PLAYER;
        ctx.fillRect(screenX, screenY, this.width, this.height);
        
        // Draw direction indicator
        ctx.fillStyle = CONSTANTS.COLORS.WHITE;
        const eyeX = this.direction === CONSTANTS.DIRECTION.RIGHT 
            ? screenX + this.width - 10 
            : screenX + 5;
        ctx.fillRect(eyeX, screenY + 10, 5, 5);
        
        // Draw attack animation
        if (this.isAttacking) {
            ctx.fillStyle = CONSTANTS.COLORS.YELLOW;
            const attackX = this.direction === CONSTANTS.DIRECTION.RIGHT 
                ? screenX + this.width 
                : screenX - 40;
            ctx.fillRect(attackX, screenY, 40, this.height);
        }
        
        ctx.restore();
    }
}
