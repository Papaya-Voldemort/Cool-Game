/**
 * Boss AI with Multi-Phase Fights
 */

class Boss {
    constructor(x, y, bossType = 'warrior') {
        this.x = x;
        this.y = y;
        this.width = 60;
        this.height = 80;
        this.vx = 0;
        this.vy = 0;
        this.bossType = bossType;
        
        // Stats
        this.maxHp = CONSTANTS.BOSS_HP;
        this.hp = this.maxHp;
        this.damage = 25;
        this.speed = 2;
        this.isAlive = true;
        
        // Phase system
        this.currentPhase = 1;
        this.maxPhases = 3;
        this.phaseTransitioning = false;
        
        // AI state
        this.state = 'idle';
        this.target = null;
        this.attackPattern = 0;
        this.patternTimer = 0;
        
        // Combat
        this.isAttacking = false;
        this.attackCooldown = 0;
        this.attackTimer = 0;
        this.specialCooldown = 0;
        
        // Boss-specific abilities
        this.abilities = this.getAbilitiesForType(bossType);
        this.currentAbility = null;
        
        // Adaptive behavior
        this.playerAggressionLevel = 0;
        this.playerDefenseLevel = 0;
        this.adaptationTimer = 0;
    }
    
    getAbilitiesForType(type) {
        const abilities = {
            warrior: ['charge', 'spin_attack', 'ground_slam'],
            mage: ['fireball', 'teleport', 'summon_minions'],
            shadow: ['dash_strike', 'clone', 'poison_field']
        };
        return abilities[type] || abilities.warrior;
    }
    
    update(dt, player, world) {
        if (!this.isAlive) return;
        
        // Update timers
        if (this.attackCooldown > 0) this.attackCooldown -= dt * 1000;
        if (this.specialCooldown > 0) this.specialCooldown -= dt * 1000;
        if (this.attackTimer > 0) {
            this.attackTimer -= dt * 1000;
            if (this.attackTimer <= 0) {
                this.isAttacking = false;
            }
        }
        
        this.patternTimer += dt;
        this.adaptationTimer += dt;
        
        // Check for phase transition
        const hpPercentage = this.hp / this.maxHp;
        const targetPhase = Math.ceil((1 - hpPercentage) * this.maxPhases) + 1;
        
        if (targetPhase > this.currentPhase && !this.phaseTransitioning) {
            this.transitionPhase();
        }
        
        // Adaptive AI - learn from player
        if (this.adaptationTimer > 3) {
            this.analyzePlayer(player);
            this.adaptationTimer = 0;
        }
        
        // Set target
        this.target = player;
        
        // Execute AI based on phase
        this.executePhaseAI(dt, player, world);
        
        // Apply physics
        this.applyPhysics(dt, world);
    }
    
    executePhaseAI(dt, player, world) {
        const distanceToPlayer = Utils.distance(this.x, this.y, player.x, player.y);
        
        switch (this.currentPhase) {
            case 1:
                // Phase 1: Basic attacks and patterns
                this.phase1AI(dt, player, distanceToPlayer);
                break;
            case 2:
                // Phase 2: Faster, more aggressive
                this.phase2AI(dt, player, distanceToPlayer);
                break;
            case 3:
                // Phase 3: Desperate, uses all abilities
                this.phase3AI(dt, player, distanceToPlayer);
                break;
        }
    }
    
    phase1AI(dt, player, distance) {
        // Telegraphed attacks, predictable patterns
        if (distance < 100 && this.attackCooldown <= 0) {
            this.basicAttack();
        } else if (distance > 150) {
            this.moveTowardsPlayer(player, 0.7);
        } else {
            // Circle player
            this.circlePlayer(player);
        }
        
        // Use special ability occasionally
        if (this.specialCooldown <= 0 && this.patternTimer > 5) {
            this.useSpecialAbility(0);
            this.patternTimer = 0;
        }
    }
    
    phase2AI(dt, player, distance) {
        // More aggressive, combos attacks
        this.speed = 3;
        
        if (distance < 120 && this.attackCooldown <= 0) {
            // Combo attacks
            this.comboAttack();
        } else if (distance < 200) {
            // Aggressive pursuit
            this.moveTowardsPlayer(player, 1.0);
        }
        
        // Use special abilities more frequently
        if (this.specialCooldown <= 0 && this.patternTimer > 3) {
            const abilityIndex = Utils.randomInt(0, 1);
            this.useSpecialAbility(abilityIndex);
            this.patternTimer = 0;
        }
    }
    
    phase3AI(dt, player, distance) {
        // Desperate, unpredictable, uses all abilities
        this.speed = 3.5;
        
        // Adapt strategy based on player behavior
        if (this.playerAggressionLevel > 5) {
            // Player is aggressive, use defensive abilities
            this.defensiveStrategy(player, distance);
        } else if (this.playerDefenseLevel > 5) {
            // Player is defensive, be more aggressive
            this.aggressiveStrategy(player, distance);
        } else {
            // Mixed strategy
            this.mixedStrategy(player, distance);
        }
        
        // Use special abilities rapidly
        if (this.specialCooldown <= 0 && this.patternTimer > 2) {
            const abilityIndex = Utils.randomInt(0, this.abilities.length - 1);
            this.useSpecialAbility(abilityIndex);
            this.patternTimer = 0;
        }
    }
    
    transitionPhase() {
        this.phaseTransitioning = true;
        this.currentPhase++;
        this.state = 'phase_transition';
        
        // Become invulnerable during transition
        this.invulnerable = true;
        
        // Visual effect and pause
        setTimeout(() => {
            this.phaseTransitioning = false;
            this.invulnerable = false;
            this.state = 'idle';
        }, 2000);
    }
    
    analyzePlayer(player) {
        // Track player behavior to adapt
        if (player.comboCount > 2) {
            this.playerAggressionLevel++;
        }
        
        if (player.isDodging || player.invulnerable) {
            this.playerDefenseLevel++;
        }
        
        // Decay over time
        this.playerAggressionLevel *= 0.9;
        this.playerDefenseLevel *= 0.9;
    }
    
    defensiveStrategy(player, distance) {
        if (distance < 80) {
            // Back away
            const dx = player.x - this.x;
            this.vx = (dx > 0 ? -1 : 1) * this.speed;
        } else {
            // Counter-attack
            if (this.attackCooldown <= 0) {
                this.basicAttack();
            }
        }
    }
    
    aggressiveStrategy(player, distance) {
        // Rush player
        this.moveTowardsPlayer(player, 1.2);
        
        if (distance < 100 && this.attackCooldown <= 0) {
            this.comboAttack();
        }
    }
    
    mixedStrategy(player, distance) {
        // Alternate between approaches
        if (Math.floor(this.patternTimer) % 2 === 0) {
            this.aggressiveStrategy(player, distance);
        } else {
            this.defensiveStrategy(player, distance);
        }
    }
    
    moveTowardsPlayer(player, speedMultiplier = 1.0) {
        const dx = player.x - this.x;
        const direction = dx > 0 ? 1 : -1;
        this.vx = direction * this.speed * speedMultiplier;
    }
    
    circlePlayer(player) {
        const dx = player.x - this.x;
        const dy = player.y - this.y;
        const angle = Math.atan2(dy, dx);
        
        // Move perpendicular to player direction
        this.vx = Math.cos(angle + Math.PI / 2) * this.speed * 0.5;
    }
    
    basicAttack() {
        this.isAttacking = true;
        this.attackTimer = 300;
        this.attackCooldown = 1500;
        this.state = 'attacking';
    }
    
    comboAttack() {
        this.isAttacking = true;
        this.attackTimer = 600; // Longer attack
        this.attackCooldown = 2000;
        this.state = 'combo';
    }
    
    useSpecialAbility(abilityIndex) {
        const ability = this.abilities[abilityIndex];
        this.currentAbility = ability;
        this.specialCooldown = 5000;
        
        // Execute ability-specific logic
        switch (ability) {
            case 'charge':
                this.executeCharge();
                break;
            case 'spin_attack':
                this.executeSpinAttack();
                break;
            case 'ground_slam':
                this.executeGroundSlam();
                break;
            case 'fireball':
                this.executeFireball();
                break;
            case 'teleport':
                this.executeTeleport();
                break;
            case 'dash_strike':
                this.executeDashStrike();
                break;
        }
    }
    
    executeCharge() {
        const dx = this.target.x - this.x;
        const direction = dx > 0 ? 1 : -1;
        this.vx = direction * this.speed * 3;
        
        setTimeout(() => {
            this.vx *= 0.5;
        }, 500);
    }
    
    executeSpinAttack() {
        this.state = 'spinning';
        this.damage *= 1.5;
        
        setTimeout(() => {
            this.state = 'idle';
            this.damage /= 1.5;
        }, 1000);
    }
    
    executeGroundSlam() {
        this.vy = 20;
        this.state = 'slam';
    }
    
    executeFireball() {
        // Placeholder for projectile
        this.state = 'casting';
        setTimeout(() => {
            this.state = 'idle';
        }, 800);
    }
    
    executeTeleport() {
        // Teleport behind or away from player
        if (this.target) {
            this.x = this.target.x + (Utils.randomInt(0, 1) ? 150 : -150);
        }
    }
    
    executeDashStrike() {
        this.executeCharge();
        this.basicAttack();
    }
    
    applyPhysics(dt, world) {
        // Gravity
        this.vy += CONSTANTS.GRAVITY;
        this.vy = Math.min(this.vy, CONSTANTS.MAX_FALL_SPEED);
        
        // Update position
        this.x += this.vx;
        this.y += this.vy;
        
        // Friction
        this.vx *= 0.9;
        
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
            this.y = world.height - this.height;
        }
    }
    
    checkCollision(rect) {
        return this.x < rect.x + rect.width &&
               this.x + this.width > rect.x &&
               this.y < rect.y + rect.height &&
               this.y + this.height > rect.y;
    }
    
    takeDamage(amount) {
        if (this.invulnerable) return;
        
        this.hp -= amount;
        if (this.hp <= 0) {
            this.hp = 0;
            this.isAlive = false;
        }
    }
    
    applyKnockback(direction, force) {
        if (!this.phaseTransitioning) {
            this.vx = direction * force * 0.5; // Bosses resist knockback
        }
    }
    
    getAttackHitbox() {
        if (!this.isAttacking) return null;
        
        const attackRange = this.state === 'spinning' ? 80 : 50;
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
        
        // Draw boss
        ctx.fillStyle = CONSTANTS.COLORS.BOSS;
        
        // Flash during phase transition
        if (this.phaseTransitioning && Math.floor(Date.now() / 100) % 2 === 0) {
            ctx.fillStyle = CONSTANTS.COLORS.YELLOW;
        }
        
        ctx.fillRect(screenX, screenY, this.width, this.height);
        
        // Draw crown/indicator
        ctx.fillStyle = CONSTANTS.COLORS.YELLOW;
        ctx.beginPath();
        ctx.moveTo(screenX + this.width / 2, screenY - 10);
        ctx.lineTo(screenX + this.width / 2 - 10, screenY);
        ctx.lineTo(screenX + this.width / 2 + 10, screenY);
        ctx.fill();
        
        // Draw HP bar (larger for boss)
        const hpBarWidth = this.width * 2;
        const hpBarHeight = 8;
        const hpRatio = this.hp / this.maxHp;
        
        ctx.fillStyle = CONSTANTS.COLORS.DARK_GRAY;
        ctx.fillRect(screenX - this.width / 2, screenY - 20, hpBarWidth, hpBarHeight);
        
        ctx.fillStyle = CONSTANTS.COLORS.RED;
        ctx.fillRect(screenX - this.width / 2, screenY - 20, hpBarWidth, hpBarHeight);
        
        ctx.fillStyle = CONSTANTS.COLORS.ORANGE;
        ctx.fillRect(screenX - this.width / 2, screenY - 20, hpBarWidth * hpRatio, hpBarHeight);
        
        // Draw phase indicators
        for (let i = 0; i < this.maxPhases; i++) {
            ctx.fillStyle = i < this.currentPhase ? CONSTANTS.COLORS.YELLOW : CONSTANTS.COLORS.DARK_GRAY;
            ctx.beginPath();
            ctx.arc(screenX - this.width / 2 + i * 15 + 10, screenY - 30, 5, 0, Math.PI * 2);
            ctx.fill();
        }
        
        // Draw attack indicator
        if (this.isAttacking || this.state === 'spinning') {
            ctx.fillStyle = CONSTANTS.COLORS.RED;
            ctx.globalAlpha = 0.3;
            const range = this.state === 'spinning' ? 80 : 50;
            ctx.fillRect(screenX - range / 2, screenY, this.width + range, this.height);
            ctx.globalAlpha = 1.0;
        }
    }
}
