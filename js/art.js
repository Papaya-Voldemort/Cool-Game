/**
 * Procedural Art Generation System
 * Generates visual elements programmatically for characters, enemies, and environments
 */

class ArtGenerator {
    constructor() {
        // Cache for generated sprites
        this.cache = new Map();
    }
    
    /**
     * Draw a player character with procedurally generated details
     */
    drawPlayer(ctx, x, y, width, height, direction, isAttacking, isDodging, invulnerable) {
        ctx.save();
        
        // Flash effect when invulnerable
        if (invulnerable && Math.floor(Date.now() / 100) % 2 === 0) {
            ctx.globalAlpha = 0.5;
        }
        
        // Body (gradient)
        const bodyGradient = ctx.createLinearGradient(x, y, x, y + height);
        bodyGradient.addColorStop(0, '#00BFFF');
        bodyGradient.addColorStop(0.5, '#0099CC');
        bodyGradient.addColorStop(1, '#006688');
        ctx.fillStyle = bodyGradient;
        ctx.fillRect(x + 5, y + 15, width - 10, height - 15);
        
        // Head (circular)
        ctx.fillStyle = '#FFD0A0';
        ctx.beginPath();
        ctx.arc(x + width / 2, y + 10, 10, 0, Math.PI * 2);
        ctx.fill();
        
        // Eyes
        ctx.fillStyle = '#000000';
        const eyeOffset = direction === 'right' ? 3 : -3;
        ctx.fillRect(x + width / 2 + eyeOffset - 2, y + 8, 2, 2);
        ctx.fillRect(x + width / 2 + eyeOffset + 2, y + 8, 2, 2);
        
        // Arms
        ctx.strokeStyle = '#0099CC';
        ctx.lineWidth = 4;
        ctx.lineCap = 'round';
        
        if (isAttacking) {
            // Attack pose
            const armAngle = direction === 'right' ? -0.5 : 0.5;
            ctx.beginPath();
            ctx.moveTo(x + width / 2, y + 25);
            ctx.lineTo(x + width / 2 + Math.cos(armAngle) * 20, y + 25 + Math.sin(armAngle) * 15);
            ctx.stroke();
        } else {
            // Normal pose
            ctx.beginPath();
            ctx.moveTo(x + 8, y + 25);
            ctx.lineTo(x + 5, y + 35);
            ctx.stroke();
            
            ctx.beginPath();
            ctx.moveTo(x + width - 8, y + 25);
            ctx.lineTo(x + width - 5, y + 35);
            ctx.stroke();
        }
        
        // Legs
        ctx.beginPath();
        ctx.moveTo(x + 10, y + height - 5);
        ctx.lineTo(x + 10, y + height + 5);
        ctx.stroke();
        
        ctx.beginPath();
        ctx.moveTo(x + width - 10, y + height - 5);
        ctx.lineTo(x + width - 10, y + height + 5);
        ctx.stroke();
        
        // Dodge effect
        if (isDodging) {
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
            ctx.lineWidth = 2;
            ctx.strokeRect(x - 5, y - 5, width + 10, height + 10);
        }
        
        ctx.restore();
    }
    
    /**
     * Draw an enemy with procedurally generated details
     */
    drawEnemy(ctx, x, y, width, height, type, hp, maxHp) {
        ctx.save();
        
        // Color based on enemy type
        let mainColor, secondColor;
        if (type === 'strong') {
            mainColor = '#CC0000';
            secondColor = '#990000';
        } else {
            mainColor = '#FF4500';
            secondColor = '#CC3300';
        }
        
        // Body with gradient
        const bodyGradient = ctx.createLinearGradient(x, y, x, y + height);
        bodyGradient.addColorStop(0, mainColor);
        bodyGradient.addColorStop(0.6, secondColor);
        bodyGradient.addColorStop(1, '#660000');
        ctx.fillStyle = bodyGradient;
        ctx.fillRect(x + 5, y + 10, width - 10, height - 10);
        
        // Head
        ctx.fillStyle = mainColor;
        ctx.beginPath();
        ctx.arc(x + width / 2, y + 8, 8, 0, Math.PI * 2);
        ctx.fill();
        
        // Evil eyes (glowing red)
        ctx.fillStyle = '#FF0000';
        ctx.shadowColor = '#FF0000';
        ctx.shadowBlur = 5;
        ctx.fillRect(x + width / 2 - 5, y + 6, 3, 3);
        ctx.fillRect(x + width / 2 + 2, y + 6, 3, 3);
        ctx.shadowBlur = 0;
        
        // Horns for strong enemies
        if (type === 'strong') {
            ctx.strokeStyle = '#660000';
            ctx.lineWidth = 3;
            ctx.lineCap = 'round';
            
            ctx.beginPath();
            ctx.moveTo(x + width / 2 - 6, y + 2);
            ctx.lineTo(x + width / 2 - 10, y - 5);
            ctx.stroke();
            
            ctx.beginPath();
            ctx.moveTo(x + width / 2 + 6, y + 2);
            ctx.lineTo(x + width / 2 + 10, y - 5);
            ctx.stroke();
        }
        
        // Claws
        ctx.strokeStyle = secondColor;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(x + 5, y + 25);
        ctx.lineTo(x, y + 30);
        ctx.stroke();
        
        ctx.beginPath();
        ctx.moveTo(x + width - 5, y + 25);
        ctx.lineTo(x + width, y + 30);
        ctx.stroke();
        
        // HP bar above enemy
        const barWidth = width;
        const barHeight = 4;
        const hpPercent = hp / maxHp;
        
        ctx.fillStyle = '#333';
        ctx.fillRect(x, y - 8, barWidth, barHeight);
        
        ctx.fillStyle = hpPercent > 0.5 ? '#00FF00' : hpPercent > 0.25 ? '#FFFF00' : '#FF0000';
        ctx.fillRect(x, y - 8, barWidth * hpPercent, barHeight);
        
        ctx.restore();
    }
    
    /**
     * Draw a boss with elaborate procedural details
     */
    drawBoss(ctx, x, y, width, height, bossId, hp, maxHp) {
        ctx.save();
        
        // Larger, more imposing appearance
        const scale = 1.5;
        
        // Dark aura effect
        ctx.shadowColor = '#8B008B';
        ctx.shadowBlur = 20;
        
        // Body
        const bodyGradient = ctx.createRadialGradient(
            x + width / 2, y + height / 2, 10,
            x + width / 2, y + height / 2, width / 2
        );
        bodyGradient.addColorStop(0, '#8B008B');
        bodyGradient.addColorStop(0.6, '#4B0082');
        bodyGradient.addColorStop(1, '#2B0042');
        ctx.fillStyle = bodyGradient;
        ctx.fillRect(x, y + 15, width, height - 15);
        
        ctx.shadowBlur = 0;
        
        // Head/Crown
        ctx.fillStyle = '#8B008B';
        ctx.beginPath();
        ctx.arc(x + width / 2, y + 12, 15, 0, Math.PI * 2);
        ctx.fill();
        
        // Crown spikes
        ctx.fillStyle = '#FFD700';
        for (let i = 0; i < 5; i++) {
            const angle = (Math.PI * 2 * i) / 5 - Math.PI / 2;
            const spikeX = x + width / 2 + Math.cos(angle) * 12;
            const spikeY = y + 12 + Math.sin(angle) * 12;
            ctx.beginPath();
            ctx.moveTo(x + width / 2, y + 12);
            ctx.lineTo(spikeX, spikeY);
            ctx.lineTo(spikeX + Math.cos(angle) * 5, spikeY + Math.sin(angle) * 5);
            ctx.fill();
        }
        
        // Glowing eyes
        ctx.fillStyle = '#FF00FF';
        ctx.shadowColor = '#FF00FF';
        ctx.shadowBlur = 10;
        ctx.fillRect(x + width / 2 - 8, y + 10, 4, 4);
        ctx.fillRect(x + width / 2 + 4, y + 10, 4, 4);
        ctx.shadowBlur = 0;
        
        // Larger HP bar
        const barWidth = width + 20;
        const barHeight = 8;
        const hpPercent = hp / maxHp;
        
        ctx.fillStyle = '#000';
        ctx.fillRect(x - 10, y - 15, barWidth, barHeight);
        
        const barGradient = ctx.createLinearGradient(x - 10, y - 15, x - 10 + barWidth * hpPercent, y - 15);
        barGradient.addColorStop(0, '#FF0000');
        barGradient.addColorStop(0.5, '#FF00FF');
        barGradient.addColorStop(1, '#8B008B');
        ctx.fillStyle = barGradient;
        ctx.fillRect(x - 10, y - 15, barWidth * hpPercent, barHeight);
        
        // Border for HP bar
        ctx.strokeStyle = '#FFD700';
        ctx.lineWidth = 2;
        ctx.strokeRect(x - 10, y - 15, barWidth, barHeight);
        
        ctx.restore();
    }
    
    /**
     * Draw a platform with texture
     */
    drawPlatform(ctx, x, y, width, height, climbable) {
        ctx.save();
        
        if (climbable) {
            // Climbable wall - ladder pattern
            ctx.fillStyle = '#654321';
            ctx.fillRect(x, y, width, height);
            
            // Ladder rungs
            ctx.strokeStyle = '#8B6914';
            ctx.lineWidth = 3;
            const rungSpacing = 15;
            for (let rungY = y; rungY < y + height; rungY += rungSpacing) {
                ctx.beginPath();
                ctx.moveTo(x, rungY);
                ctx.lineTo(x + width, rungY);
                ctx.stroke();
            }
        } else {
            // Regular platform - stone/ground texture
            const gradient = ctx.createLinearGradient(x, y, x, y + height);
            gradient.addColorStop(0, '#8B7355');
            gradient.addColorStop(0.3, '#654321');
            gradient.addColorStop(1, '#3D2817');
            ctx.fillStyle = gradient;
            ctx.fillRect(x, y, width, height);
            
            // Add some texture variation
            ctx.fillStyle = 'rgba(139, 115, 85, 0.3)';
            for (let i = 0; i < width; i += 20) {
                for (let j = 0; j < height; j += 20) {
                    if (Math.random() > 0.5) {
                        ctx.fillRect(x + i + Math.random() * 10, y + j + Math.random() * 10, 5, 5);
                    }
                }
            }
            
            // Top edge highlight
            ctx.strokeStyle = '#A0826D';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(x, y);
            ctx.lineTo(x + width, y);
            ctx.stroke();
        }
        
        ctx.restore();
    }
    
    /**
     * Draw an NPC with unique characteristics
     */
    drawNPC(ctx, x, y, width, height, name) {
        ctx.save();
        
        // Determine color based on name hash
        const hash = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
        const hue = hash % 360;
        
        // Body
        ctx.fillStyle = `hsl(${hue}, 60%, 50%)`;
        ctx.fillRect(x + 5, y + 15, width - 10, height - 15);
        
        // Head
        ctx.fillStyle = `hsl(${hue}, 40%, 60%)`;
        ctx.beginPath();
        ctx.arc(x + width / 2, y + 10, 10, 0, Math.PI * 2);
        ctx.fill();
        
        // Friendly eyes
        ctx.fillStyle = '#000';
        ctx.fillRect(x + width / 2 - 4, y + 8, 2, 2);
        ctx.fillRect(x + width / 2 + 2, y + 8, 2, 2);
        
        // Smile
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(x + width / 2, y + 12, 4, 0, Math.PI);
        ctx.stroke();
        
        // Speech indicator (floating icon)
        ctx.fillStyle = '#FFD700';
        ctx.font = '20px Arial';
        ctx.fillText('!', x + width / 2 - 5, y - 5);
        
        ctx.restore();
    }
    
    /**
     * Draw an interactable object
     */
    drawInteractable(ctx, x, y, width, height, type) {
        ctx.save();
        
        switch (type) {
            case 'portal':
                // Swirling portal effect
                const time = Date.now() / 1000;
                const gradient = ctx.createRadialGradient(
                    x + width / 2, y + height / 2, 0,
                    x + width / 2, y + height / 2, width / 2
                );
                gradient.addColorStop(0, '#00FFFF');
                gradient.addColorStop(0.5, '#0080FF');
                gradient.addColorStop(1, '#0000FF');
                ctx.fillStyle = gradient;
                
                ctx.save();
                ctx.translate(x + width / 2, y + height / 2);
                ctx.rotate(time * 2);
                ctx.fillRect(-width / 2, -height / 2, width, height);
                ctx.restore();
                
                // Particles
                for (let i = 0; i < 5; i++) {
                    const angle = time * 3 + i * Math.PI * 2 / 5;
                    const px = x + width / 2 + Math.cos(angle) * 15;
                    const py = y + height / 2 + Math.sin(angle) * 15;
                    ctx.fillStyle = '#FFFFFF';
                    ctx.fillRect(px, py, 3, 3);
                }
                break;
                
            case 'chest':
                // Treasure chest
                ctx.fillStyle = '#8B4513';
                ctx.fillRect(x, y + height / 2, width, height / 2);
                ctx.fillStyle = '#654321';
                ctx.fillRect(x, y, width, height / 2);
                
                // Lock
                ctx.fillStyle = '#FFD700';
                ctx.fillRect(x + width / 2 - 3, y + height / 2 - 3, 6, 6);
                break;
                
            default:
                // Generic glowing object
                ctx.shadowColor = '#FFD700';
                ctx.shadowBlur = 10;
                ctx.fillStyle = '#FFD700';
                ctx.fillRect(x, y, width, height);
        }
        
        ctx.restore();
    }
    
    /**
     * Draw background elements
     */
    drawBackground(ctx, width, height, areaName) {
        ctx.save();
        
        // Sky gradient based on area
        let gradient;
        switch (areaName) {
            case 'Darkwood Forest':
                gradient = ctx.createLinearGradient(0, 0, 0, height);
                gradient.addColorStop(0, '#1a1a2e');
                gradient.addColorStop(0.5, '#16213e');
                gradient.addColorStop(1, '#0f3460');
                break;
            case 'Village':
                gradient = ctx.createLinearGradient(0, 0, 0, height);
                gradient.addColorStop(0, '#87CEEB');
                gradient.addColorStop(0.7, '#B0E0E6');
                gradient.addColorStop(1, '#F0E68C');
                break;
            case 'Dungeon':
                gradient = ctx.createLinearGradient(0, 0, 0, height);
                gradient.addColorStop(0, '#0a0a0a');
                gradient.addColorStop(0.5, '#1a1a1a');
                gradient.addColorStop(1, '#2a2a2a');
                break;
            default:
                gradient = ctx.createLinearGradient(0, 0, 0, height);
                gradient.addColorStop(0, '#000033');
                gradient.addColorStop(1, '#000066');
        }
        
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, width, height);
        
        // Add stars or environmental details
        if (areaName === 'Darkwood Forest' || areaName === 'Dungeon') {
            ctx.fillStyle = '#FFFFFF';
            for (let i = 0; i < 50; i++) {
                const x = (i * 137.5) % width;
                const y = (i * 73.3) % (height / 2);
                const size = (i % 3) + 1;
                ctx.fillRect(x, y, size, size);
            }
        }
        
        ctx.restore();
    }
    
    /**
     * Draw attack effects
     */
    drawAttackEffect(ctx, x, y, width, height, type, combo) {
        ctx.save();
        
        // Different effects based on attack type
        if (type === 'special') {
            // Special attack - energy burst
            const gradient = ctx.createRadialGradient(
                x + width / 2, y + height / 2, 0,
                x + width / 2, y + height / 2, width
            );
            gradient.addColorStop(0, 'rgba(255, 255, 0, 0.8)');
            gradient.addColorStop(0.5, 'rgba(255, 165, 0, 0.5)');
            gradient.addColorStop(1, 'rgba(255, 0, 0, 0.1)');
            ctx.fillStyle = gradient;
            ctx.fillRect(x, y, width, height);
            
            // Particles
            for (let i = 0; i < 8; i++) {
                const angle = (Math.PI * 2 * i) / 8;
                const px = x + width / 2 + Math.cos(angle) * width * 0.7;
                const py = y + height / 2 + Math.sin(angle) * height * 0.7;
                ctx.fillStyle = '#FFFF00';
                ctx.fillRect(px - 2, py - 2, 4, 4);
            }
        } else {
            // Basic attack - slash effect
            ctx.strokeStyle = combo > 1 ? '#FFD700' : '#FFFF00';
            ctx.lineWidth = 5;
            ctx.lineCap = 'round';
            
            // Animated slash
            const offset = (Date.now() % 200) / 200;
            ctx.globalAlpha = 1 - offset;
            
            ctx.beginPath();
            ctx.moveTo(x, y);
            ctx.lineTo(x + width, y + height);
            ctx.stroke();
            
            ctx.beginPath();
            ctx.moveTo(x, y + height);
            ctx.lineTo(x + width, y);
            ctx.stroke();
        }
        
        // Combo counter
        if (combo > 1) {
            ctx.globalAlpha = 1;
            ctx.fillStyle = '#FFD700';
            ctx.font = 'bold 20px Arial';
            ctx.fillText(`x${combo}`, x + width / 2 - 10, y - 5);
        }
        
        ctx.restore();
    }
}

// Create global art generator instance
const artGenerator = new ArtGenerator();
