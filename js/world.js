/**
 * World System - Manages levels, platforms, and NPCs
 */

class World {
    constructor(narrativeManager) {
        this.width = 3000;
        this.height = 1000;
        this.narrativeManager = narrativeManager;
        
        this.currentArea = 'Starting Area';
        this.platforms = [];
        this.enemies = [];
        this.bosses = [];
        this.npcs = [];
        this.interactables = [];
        
        // Initialize first area
        this.loadArea('forest');
    }
    
    loadArea(areaName) {
        // Clear previous area
        this.platforms = [];
        this.enemies = [];
        this.bosses = [];
        this.npcs = [];
        this.interactables = [];
        
        // Load area-specific content
        switch (areaName) {
            case 'forest':
                this.loadForestArea();
                break;
            case 'village':
                this.loadVillageArea();
                break;
            case 'dungeon':
                this.loadDungeonArea();
                break;
            case 'boss_room':
                this.loadBossRoom();
                break;
            default:
                this.loadForestArea();
        }
        
        this.currentArea = areaName;
    }
    
    loadForestArea() {
        this.currentArea = 'Darkwood Forest';
        
        // Ground
        this.platforms.push(
            { x: 0, y: 600, width: 3000, height: 400, climbable: false }
        );
        
        // Platforms
        this.platforms.push(
            { x: 200, y: 500, width: 150, height: 20, climbable: false },
            { x: 400, y: 400, width: 150, height: 20, climbable: false },
            { x: 600, y: 300, width: 150, height: 20, climbable: false },
            { x: 900, y: 450, width: 200, height: 20, climbable: false },
            { x: 1200, y: 350, width: 150, height: 20, climbable: false }
        );
        
        // Climbable walls
        this.platforms.push(
            { x: 800, y: 400, width: 30, height: 200, climbable: true }
        );
        
        // Enemies
        this.enemies.push(
            new Enemy(300, 550, 'basic'),
            new Enemy(700, 250, 'basic'),
            new Enemy(1000, 400, 'strong'),
            new Enemy(1400, 550, 'basic')
        );
        
        // NPCs and interactables
        this.npcs.push({
            x: 500,
            y: 560,
            width: 30,
            height: 40,
            name: 'Mysterious Stranger',
            hasDialogue: true
        });
        
        this.interactables.push({
            x: 1500,
            y: 570,
            width: 30,
            height: 30,
            type: 'portal',
            destination: 'village'
        });
    }
    
    loadVillageArea() {
        this.currentArea = 'Haven Village';
        
        // Ground
        this.platforms.push(
            { x: 0, y: 650, width: 3000, height: 350, climbable: false }
        );
        
        // Buildings (platforms)
        this.platforms.push(
            { x: 100, y: 550, width: 200, height: 100, climbable: false },
            { x: 400, y: 550, width: 200, height: 100, climbable: false },
            { x: 700, y: 550, width: 200, height: 100, climbable: false }
        );
        
        // Fewer enemies in village
        this.enemies.push(
            new Enemy(1200, 600, 'basic')
        );
        
        // More NPCs
        this.npcs.push(
            { x: 150, y: 610, width: 30, height: 40, name: 'Village Elder', hasDialogue: true },
            { x: 450, y: 610, width: 30, height: 40, name: 'Merchant', hasDialogue: true },
            { x: 750, y: 610, width: 30, height: 40, name: 'Warrior', hasDialogue: true }
        );
        
        // Portal to dungeon
        this.interactables.push({
            x: 1800,
            y: 620,
            width: 30,
            height: 30,
            type: 'portal',
            destination: 'dungeon'
        });
    }
    
    loadDungeonArea() {
        this.currentArea = 'Ancient Dungeon';
        
        // Ground
        this.platforms.push(
            { x: 0, y: 700, width: 3000, height: 300, climbable: false }
        );
        
        // Complex platforming
        this.platforms.push(
            { x: 100, y: 600, width: 100, height: 20, climbable: false },
            { x: 250, y: 500, width: 100, height: 20, climbable: false },
            { x: 400, y: 400, width: 100, height: 20, climbable: false },
            { x: 550, y: 500, width: 100, height: 20, climbable: false },
            { x: 700, y: 600, width: 150, height: 20, climbable: false },
            { x: 900, y: 500, width: 100, height: 20, climbable: false },
            { x: 1050, y: 400, width: 100, height: 20, climbable: false }
        );
        
        // Climbable walls
        this.platforms.push(
            { x: 200, y: 500, width: 20, height: 200, climbable: true },
            { x: 850, y: 500, width: 20, height: 200, climbable: true }
        );
        
        // Many enemies
        this.enemies.push(
            new Enemy(200, 550, 'strong'),
            new Enemy(450, 350, 'basic'),
            new Enemy(750, 550, 'strong'),
            new Enemy(1000, 450, 'strong'),
            new Enemy(1300, 650, 'basic')
        );
        
        // Portal to boss
        this.interactables.push({
            x: 2000,
            y: 670,
            width: 40,
            height: 30,
            type: 'portal',
            destination: 'boss_room'
        });
    }
    
    loadBossRoom() {
        this.currentArea = 'Boss Arena';
        
        // Large arena
        this.platforms.push(
            { x: 0, y: 650, width: 2000, height: 350, climbable: false }
        );
        
        // Some platforms for tactical positioning
        this.platforms.push(
            { x: 300, y: 550, width: 150, height: 20, climbable: false },
            { x: 700, y: 450, width: 150, height: 20, climbable: false },
            { x: 1100, y: 550, width: 150, height: 20, climbable: false }
        );
        
        // Boss
        const bossTypes = ['warrior', 'mage', 'shadow'];
        const randomBossType = Utils.randomChoice(bossTypes);
        this.bosses.push(
            new Boss(1000, 550, randomBossType)
        );
    }
    
    update(dt, player, narrativeManager) {
        // Update enemies
        for (const enemy of this.enemies) {
            if (enemy.isAlive) {
                enemy.update(dt, player, this);
            }
        }
        
        // Update bosses
        for (const boss of this.bosses) {
            if (boss.isAlive) {
                boss.update(dt, player, this);
            }
        }
        
        // Check for interactions
        this.checkInteractions(player, narrativeManager);
        
        // Check if boss defeated
        for (let i = 0; i < this.bosses.length; i++) {
            const boss = this.bosses[i];
            if (!boss.isAlive && !boss.wasDefeated) {
                // Use consistent boss numbering
                const bossNumber = i + 1;
                narrativeManager.flags[`defeatedBoss${bossNumber}`] = true;
                this.onBossDefeated(boss);
            }
        }
    }
    
    checkInteractions(player, narrativeManager) {
        // Check NPC interactions
        for (const npc of this.npcs) {
            if (this.isPlayerNear(player, npc, 50)) {
                // Show prompt or auto-trigger dialogue
            }
        }
        
        // Check interactable objects
        for (const obj of this.interactables) {
            if (this.isPlayerNear(player, obj, 30)) {
                if (obj.type === 'portal') {
                    // Could trigger area transition
                    // For now, just mark it visually
                }
            }
        }
    }
    
    isPlayerNear(player, object, range) {
        return Utils.distance(
            player.x + player.width / 2,
            player.y + player.height / 2,
            object.x + object.width / 2,
            object.y + object.height / 2
        ) < range;
    }
    
    onBossDefeated(boss) {
        // Trigger narrative event
        this.narrativeManager.showDialogue({
            speaker: 'System',
            text: `You defeated the ${boss.bossType} boss! A great evil has been vanquished.`
        });
        
        // Mark this specific boss as defeated
        boss.wasDefeated = true;
    }
    
    checkDialogueTrigger(player) {
        // Check if player is near an NPC
        for (const npc of this.npcs) {
            if (this.isPlayerNear(player, npc, 50) && npc.hasDialogue) {
                this.triggerNPCDialogue(npc);
                return true;
            }
        }
        
        // Random encounter dialogues
        if (Math.random() < 0.001) {
            const event = this.narrativeManager.generateStoryEvent(this.currentArea);
            if (event && event.dialogue) {
                this.narrativeManager.showDialogue(event.dialogue);
                if (event.choices) {
                    setTimeout(() => {
                        this.narrativeManager.presentChoice(event.choices);
                    }, 100);
                }
                return true;
            }
        }
        
        return false;
    }
    
    triggerNPCDialogue(npc) {
        const dialogues = {
            'Village Elder': 'Welcome, traveler. Our village needs your help. Will you aid us?',
            'Merchant': 'I have wares if you have coin. Or information, if you prefer.',
            'Warrior': 'The dungeon ahead is treacherous. Are you sure you\'re ready?',
            'Mysterious Stranger': 'Not all is as it seems in these woods. Choose your path wisely.'
        };
        
        this.narrativeManager.showDialogue({
            speaker: npc.name,
            text: dialogues[npc.name] || 'Hello, traveler.'
        });
        
        npc.hasDialogue = false; // Prevent repeated dialogues
    }
    
    getPlatforms() {
        return this.platforms;
    }
    
    getActiveEnemies() {
        return [...this.enemies.filter(e => e.isAlive), ...this.bosses.filter(b => b.isAlive)];
    }
    
    render(ctx, cameraX, cameraY) {
        // Background - use procedural art
        artGenerator.drawBackground(ctx, ctx.canvas.width, ctx.canvas.height, this.currentArea);
        
        // Platforms
        for (const platform of this.platforms) {
            const screenX = platform.x - cameraX;
            const screenY = platform.y - cameraY;
            
            artGenerator.drawPlatform(ctx, screenX, screenY, platform.width, platform.height, platform.climbable);
        }
        
        // NPCs
        for (const npc of this.npcs) {
            const screenX = npc.x - cameraX;
            const screenY = npc.y - cameraY;
            
            artGenerator.drawNPC(ctx, screenX, screenY, npc.width, npc.height, npc.name);
            
            // Name label
            ctx.fillStyle = CONSTANTS.COLORS.WHITE;
            ctx.font = '12px Arial';
            ctx.fillText(npc.name, screenX - 10, screenY - 5);
        }
        
        // Interactables
        for (const obj of this.interactables) {
            const screenX = obj.x - cameraX;
            const screenY = obj.y - cameraY;
            
            artGenerator.drawInteractable(ctx, screenX, screenY, obj.width, obj.height, obj.type);
        }
        
        // Enemies
        for (const enemy of this.enemies) {
            enemy.render(ctx, cameraX, cameraY);
        }
        
        // Bosses
        for (const boss of this.bosses) {
            boss.render(ctx, cameraX, cameraY);
        }
    }
    
    getBackgroundColor() {
        const colors = {
            'Darkwood Forest': '#1a3a1a',
            'Haven Village': '#4a5a6a',
            'Ancient Dungeon': '#2a2a3a',
            'Boss Arena': '#3a1a1a'
        };
        return colors[this.currentArea] || '#000000';
    }
}
