/**
 * Combat System
 */

class CombatSystem {
    constructor() {
        this.activeAttacks = [];
        this.hitEffects = [];
    }
    
    update(dt, player, enemies) {
        // Check player attacks against enemies
        if (player.isAttacking) {
            const attackHitbox = player.getAttackHitbox();
            if (attackHitbox) {
                for (const enemy of enemies) {
                    if (enemy.isAlive && this.checkCollision(attackHitbox, enemy)) {
                        this.handleHit(player, enemy, attackHitbox);
                    }
                }
            }
        }
        
        // Check enemy attacks against player
        for (const enemy of enemies) {
            if (enemy.isAttacking) {
                const attackHitbox = enemy.getAttackHitbox();
                if (attackHitbox && this.checkCollision(attackHitbox, player)) {
                    if (player.takeDamage(attackHitbox.damage)) {
                        this.createHitEffect(player.x + player.width / 2, player.y + player.height / 2);
                    }
                }
            }
        }
        
        // Update hit effects
        this.hitEffects = this.hitEffects.filter(effect => {
            effect.lifetime -= dt;
            return effect.lifetime > 0;
        });
    }
    
    checkCollision(rect1, rect2) {
        return rect1.x < rect2.x + rect2.width &&
               rect1.x + rect1.width > rect2.x &&
               rect1.y < rect2.y + rect2.height &&
               rect1.y + rect1.height > rect2.y;
    }
    
    handleHit(attacker, target, attack) {
        if (target.takeDamage) {
            target.takeDamage(attack.damage);
            this.createHitEffect(target.x + target.width / 2, target.y + target.height / 2);
            
            // Apply knockback
            if (target.applyKnockback) {
                const knockbackDir = target.x > attacker.x ? 1 : -1;
                target.applyKnockback(knockbackDir, attack.damage / 5);
            }
        }
    }
    
    createHitEffect(x, y) {
        this.hitEffects.push({
            x: x,
            y: y,
            lifetime: 0.3,
            maxLifetime: 0.3
        });
    }
    
    render(ctx, cameraX, cameraY) {
        // Render hit effects
        for (const effect of this.hitEffects) {
            const alpha = effect.lifetime / effect.maxLifetime;
            const size = 20 * (1 - alpha);
            
            ctx.save();
            ctx.globalAlpha = alpha;
            ctx.fillStyle = CONSTANTS.COLORS.ORANGE;
            ctx.beginPath();
            ctx.arc(effect.x - cameraX, effect.y - cameraY, size, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        }
    }
}
