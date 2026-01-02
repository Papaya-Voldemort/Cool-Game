/**
 * Extended World System - Adds many more areas and locations
 * This extends the base World class with tons of new content
 */

// Add new area loading methods to World prototype
World.prototype.loadExtendedArea = function(areaName) {
    // Clear previous area
    this.platforms = [];
    this.enemies = [];
    this.bosses = [];
    this.npcs = [];
    this.interactables = [];
    
    // Expanded area loading
    switch (areaName) {
        case 'forest':
        case 'darkwood_forest':
            this.loadForestArea();
            break;
        case 'village':
        case 'haven_village':
            this.loadVillageArea();
            break;
        case 'dungeon':
        case 'ancient_dungeon':
            this.loadDungeonArea();
            break;
        case 'boss_room':
            this.loadBossRoom();
            break;
        case 'mountain':
        case 'frozen_peaks':
            this.loadMountainArea();
            break;
        case 'castle':
        case 'royal_castle':
            this.loadCastleArea();
            break;
        case 'swamp':
        case 'cursed_swamp':
            this.loadSwampArea();
            break;
        case 'desert':
        case 'scorching_desert':
            this.loadDesertArea();
            break;
        case 'underground':
        case 'crystal_caves':
            this.loadUndergroundArea();
            break;
        case 'sky_temple':
            this.loadSkyTempleArea();
            break;
        case 'void_realm':
            this.loadVoidRealmArea();
            break;
        case 'harbor':
        case 'port_city':
            this.loadHarborArea();
            break;
        case 'ruins':
        case 'ancient_ruins':
            this.loadRuinsArea();
            break;
        case 'volcano':
        case 'fire_mountain':
            this.loadVolcanoArea();
            break;
        case 'floating_islands':
            this.loadFloatingIslandsArea();
            break;
        default:
            this.loadForestArea();
    }
    
    this.currentArea = areaName;
};

// Mountain Area
World.prototype.loadMountainArea = function() {
    this.currentArea = 'Frozen Peaks';
    this.width = 4000;
    this.height = 1200;
    
    // Steep mountain terrain
    this.platforms.push(
        { x: 0, y: 900, width: 500, height: 300, climbable: false },
        { x: 450, y: 800, width: 200, height: 20, climbable: false },
        { x: 600, y: 700, width: 180, height: 20, climbable: false },
        { x: 730, y: 600, width: 150, height: 20, climbable: false },
        { x: 850, y: 500, width: 200, height: 20, climbable: false },
        { x: 1000, y: 400, width: 180, height: 20, climbable: false },
        { x: 1150, y: 300, width: 200, height: 20, climbable: false },
        { x: 1300, y: 200, width: 250, height: 20, climbable: false },
        { x: 1500, y: 250, width: 200, height: 20, climbable: false },
        { x: 1700, y: 350, width: 180, height: 20, climbable: false },
        { x: 1850, y: 450, width: 200, height: 20, climbable: false }
    );
    
    // Ice walls (climbable with difficulty)
    this.platforms.push(
        { x: 580, y: 700, width: 20, height: 100, climbable: true },
        { x: 1120, y: 300, width: 20, height: 100, climbable: true }
    );
    
    // Mountain enemies
    this.enemies.push(
        new Enemy(500, 750, 'basic'),
        new Enemy(800, 450, 'strong'),
        new Enemy(1200, 250, 'strong'),
        new Enemy(1600, 300, 'basic'),
        new Enemy(1900, 400, 'strong')
    );
    
    // NPCs
    this.npcs.push(
        { x: 900, y: 460, width: 30, height: 40, name: 'Mountain Hermit', hasDialogue: true },
        { x: 1400, y: 160, width: 30, height: 40, name: 'Lost Climber', hasDialogue: true }
    );
    
    // Interactables
    this.interactables.push(
        { x: 1320, y: 170, width: 35, height: 35, type: 'chest', contains: 'rare_item' },
        { x: 2100, y: 870, width: 40, height: 40, type: 'portal', destination: 'sky_temple' }
    );
};

// Castle Area
World.prototype.loadCastleArea = function() {
    this.currentArea = 'Royal Castle';
    this.width = 5000;
    this.height = 1000;
    
    // Castle structure
    this.platforms.push(
        { x: 0, y: 700, width: 5000, height: 300, climbable: false }, // Ground
        { x: 200, y: 600, width: 300, height: 100, climbable: false }, // Entrance
        { x: 600, y: 500, width: 200, height: 20, climbable: false }, // First floor
        { x: 900, y: 400, width: 250, height: 20, climbable: false }, // Second floor
        { x: 1200, y: 300, width: 200, height: 20, climbable: false }, // Third floor
        { x: 1500, y: 200, width: 300, height: 20, climbable: false }, // Tower
        { x: 2000, y: 500, width: 400, height: 200, climbable: false }, // Throne room
        { x: 2500, y: 450, width: 200, height: 20, climbable: false }, // Battlements
        { x: 2800, y: 350, width: 200, height: 20, climbable: false }
    );
    
    // Guards (enemies)
    this.enemies.push(
        new Enemy(300, 660, 'strong'),
        new Enemy(700, 450, 'strong'),
        new Enemy(1000, 350, 'strong'),
        new Enemy(2100, 450, 'strong'),
        new Enemy(2600, 400, 'strong')
    );
    
    // Castle NPCs
    this.npcs.push(
        { x: 350, y: 660, width: 30, height: 40, name: 'Royal Guard Captain', hasDialogue: true },
        { x: 2150, y: 460, width: 30, height: 40, name: 'King', hasDialogue: true },
        { x: 2200, y: 460, width: 30, height: 40, name: 'Queen', hasDialogue: true },
        { x: 1100, y: 350, width: 30, height: 40, name: 'Court Wizard', hasDialogue: true },
        { x: 650, y: 450, width: 30, height: 40, name: 'Princess', hasDialogue: true }
    );
    
    // Treasures and portals
    this.interactables.push(
        { x: 1550, y: 170, width: 40, height: 40, type: 'chest', contains: 'legendary_weapon' },
        { x: 2250, y: 430, width: 40, height: 40, type: 'throne', special: true },
        { x: 3000, y: 660, width: 40, height: 40, type: 'portal', destination: 'dungeon' }
    );
};

// Swamp Area
World.prototype.loadSwampArea = function() {
    this.currentArea = 'Cursed Swamp';
    this.width = 3500;
    this.height = 1000;
    
    // Swamp platforms (unstable)
    this.platforms.push(
        { x: 0, y: 800, width: 200, height: 200, climbable: false },
        { x: 250, y: 850, width: 150, height: 20, climbable: false, unstable: true },
        { x: 450, y: 830, width: 120, height: 20, climbable: false, unstable: true },
        { x: 620, y: 850, width: 130, height: 20, climbable: false },
        { x: 800, y: 820, width: 140, height: 20, climbable: false, unstable: true },
        { x: 1000, y: 850, width: 160, height: 20, climbable: false },
        { x: 1200, y: 830, width: 120, height: 20, climbable: false, unstable: true },
        { x: 1400, y: 850, width: 180, height: 20, climbable: false },
        { x: 1650, y: 840, width: 130, height: 20, climbable: false, unstable: true }
    );
    
    // Swamp enemies (poisonous)
    this.enemies.push(
        new Enemy(300, 800, 'basic'),
        new Enemy(700, 770, 'strong'),
        new Enemy(1100, 800, 'strong'),
        new Enemy(1500, 800, 'basic'),
        new Enemy(1700, 790, 'strong')
    );
    
    // Swamp NPCs
    this.npcs.push(
        { x: 100, y: 760, width: 30, height: 40, name: 'Swamp Witch', hasDialogue: true },
        { x: 850, y: 770, width: 30, height: 40, name: 'Cursed Wanderer', hasDialogue: true }
    );
    
    // Mysterious swamp objects
    this.interactables.push(
        { x: 450, y: 790, width: 35, height: 35, type: 'cursed_altar', special: true },
        { x: 1250, y: 780, width: 40, height: 40, type: 'chest', contains: 'poison_resistance' },
        { x: 2000, y: 810, width: 45, height: 45, type: 'portal', destination: 'ruins' }
    );
};

// Desert Area
World.prototype.loadDesertArea = function() {
    this.currentArea = 'Scorching Desert';
    this.width = 6000;
    this.height = 900;
    
    // Sand dunes (rolling terrain)
    this.platforms.push(
        { x: 0, y: 750, width: 1000, height: 150, climbable: false },
        { x: 900, y: 700, width: 400, height: 20, climbable: false },
        { x: 1250, y: 730, width: 500, height: 20, climbable: false },
        { x: 1700, y: 750, width: 600, height: 20, climbable: false },
        { x: 2250, y: 720, width: 400, height: 20, climbable: false },
        { x: 2600, y: 750, width: 800, height: 20, climbable: false },
        { x: 3350, y: 730, width: 500, height: 20, climbable: false },
        { x: 3800, y: 750, width: 700, height: 20, climbable: false }
    );
    
    // Desert enemies
    this.enemies.push(
        new Enemy(500, 700, 'basic'),
        new Enemy(1100, 650, 'basic'),
        new Enemy(1800, 700, 'strong'),
        new Enemy(2400, 670, 'strong'),
        new Enemy(3100, 700, 'strong'),
        new Enemy(3600, 680, 'basic'),
        new Enemy(4200, 700, 'strong')
    );
    
    // Desert NPCs
    this.npcs.push(
        { x: 1500, y: 680, width: 30, height: 40, name: 'Desert Nomad', hasDialogue: true },
        { x: 2800, y: 700, width: 30, height: 40, name: 'Caravan Master', hasDialogue: true },
        { x: 4000, y: 700, width: 30, height: 40, name: 'Oasis Keeper', hasDialogue: true }
    );
    
    // Oases and ruins
    this.interactables.push(
        { x: 1400, y: 680, width: 60, height: 20, type: 'oasis', special: true },
        { x: 2900, y: 700, width: 50, height: 50, type: 'ancient_pyramid', special: true },
        { x: 4100, y: 700, width: 45, height: 45, type: 'portal', destination: 'underground' }
    );
};

// Underground/Cave Area
World.prototype.loadUndergroundArea = function() {
    this.currentArea = 'Crystal Caves';
    this.width = 4000;
    this.height = 1200;
    
    // Cave platforms
    this.platforms.push(
        { x: 0, y: 1000, width: 600, height: 200, climbable: false },
        { x: 500, y: 900, width: 200, height: 20, climbable: false },
        { x: 650, y: 800, width: 150, height: 20, climbable: false },
        { x: 750, y: 700, width: 180, height: 20, climbable: false },
        { x: 900, y: 600, width: 200, height: 20, climbable: false },
        { x: 1050, y: 700, width: 180, height: 20, climbable: false },
        { x: 1200, y: 800, width: 200, height: 20, climbable: false },
        { x: 1350, y: 900, width: 250, height: 20, climbable: false },
        { x: 1550, y: 800, width: 180, height: 20, climbable: false },
        { x: 1700, y: 700, width: 200, height: 20, climbable: false }
    );
    
    // Stalactites (climbable)
    this.platforms.push(
        { x: 630, y: 800, width: 20, height: 100, climbable: true },
        { x: 1080, y: 600, width: 20, height: 100, climbable: true }
    );
    
    // Cave enemies
    this.enemies.push(
        new Enemy(600, 850, 'basic'),
        new Enemy(850, 650, 'strong'),
        new Enemy(1100, 750, 'strong'),
        new Enemy(1400, 850, 'basic'),
        new Enemy(1650, 750, 'strong')
    );
    
    // Cave NPCs
    this.npcs.push(
        { x: 100, y: 960, width: 30, height: 40, name: 'Cave Dweller', hasDialogue: true },
        { x: 1000, y: 560, width: 30, height: 40, name: 'Crystal Miner', hasDialogue: true }
    );
    
    // Crystal formations and treasures
    this.interactables.push(
        { x: 750, y: 660, width: 40, height: 60, type: 'crystal_formation', special: true },
        { x: 1250, y: 760, width: 35, height: 35, type: 'chest', contains: 'crystal_sword' },
        { x: 2000, y: 960, width: 40, height: 40, type: 'portal', destination: 'void_realm' }
    );
};

// Sky Temple Area
World.prototype.loadSkyTempleArea = function() {
    this.currentArea = 'Sky Temple';
    this.width = 3000;
    this.height = 1500;
    
    // Floating platforms
    this.platforms.push(
        { x: 100, y: 1200, width: 200, height: 20, climbable: false },
        { x: 350, y: 1100, width: 180, height: 20, climbable: false },
        { x: 580, y: 1000, width: 200, height: 20, climbable: false },
        { x: 830, y: 900, width: 180, height: 20, climbable: false },
        { x: 1060, y: 800, width: 200, height: 20, climbable: false },
        { x: 1310, y: 700, width: 180, height: 20, climbable: false },
        { x: 1540, y: 600, width: 250, height: 20, climbable: false },
        { x: 1840, y: 500, width: 200, height: 20, climbable: false },
        { x: 2090, y: 400, width: 300, height: 100, climbable: false } // Temple top
    );
    
    // Sky enemies
    this.enemies.push(
        new Enemy(400, 1050, 'basic'),
        new Enemy(680, 950, 'strong'),
        new Enemy(950, 850, 'strong'),
        new Enemy(1200, 750, 'strong'),
        new Enemy(1650, 550, 'strong')
    );
    
    // Temple guardians (NPCs)
    this.npcs.push(
        { x: 150, y: 1160, width: 30, height: 40, name: 'Temple Guardian', hasDialogue: true },
        { x: 2200, y: 360, width: 30, height: 40, name: 'Sky Priest', hasDialogue: true }
    );
    
    // Sacred items
    this.interactables.push(
        { x: 1600, y: 560, width: 40, height: 40, type: 'sacred_altar', special: true },
        { x: 2250, y: 360, width: 45, height: 45, type: 'chest', contains: 'wings_of_flight' }
    );
};

// Void Realm Area
World.prototype.loadVoidRealmArea = function() {
    this.currentArea = 'Void Realm';
    this.width = 5000;
    this.height = 1500;
    
    // Abstract void platforms
    this.platforms.push(
        { x: 200, y: 1100, width: 250, height: 20, climbable: false, unstable: true },
        { x: 500, y: 1000, width: 200, height: 20, climbable: false, unstable: true },
        { x: 750, y: 900, width: 220, height: 20, climbable: false },
        { x: 1020, y: 800, width: 200, height: 20, climbable: false, unstable: true },
        { x: 1270, y: 700, width: 230, height: 20, climbable: false },
        { x: 1550, y: 600, width: 200, height: 20, climbable: false, unstable: true },
        { x: 1800, y: 500, width: 250, height: 20, climbable: false }
    );
    
    // Void entities
    this.enemies.push(
        new Enemy(550, 950, 'strong'),
        new Enemy(850, 850, 'strong'),
        new Enemy(1150, 750, 'strong'),
        new Enemy(1400, 650, 'strong'),
        new Enemy(1650, 550, 'strong')
    );
    
    // Void NPCs
    this.npcs.push(
        { x: 250, y: 1060, width: 30, height: 40, name: 'Lost Soul', hasDialogue: true },
        { x: 1900, y: 460, width: 30, height: 40, name: 'Void Walker', hasDialogue: true }
    );
    
    // Void artifacts
    this.interactables.push(
        { x: 800, y: 860, width: 40, height: 40, type: 'void_crystal', special: true },
        { x: 1850, y: 460, width: 45, height: 45, type: 'reality_tear', special: true }
    );
};

// Harbor Area
World.prototype.loadHarborArea = function() {
    this.currentArea = 'Port City';
    this.width = 4500;
    this.height = 900;
    
    // Docks and buildings
    this.platforms.push(
        { x: 0, y: 700, width: 4500, height: 200, climbable: false }, // Ground
        { x: 200, y: 600, width: 300, height: 100, climbable: false }, // Warehouse
        { x: 600, y: 580, width: 250, height: 120, climbable: false }, // Inn
        { x: 950, y: 600, width: 200, height: 100, climbable: false }, // Shop
        { x: 1250, y: 580, width: 280, height: 120, climbable: false }, // Guild Hall
        { x: 1650, y: 650, width: 400, height: 50, climbable: false }, // Dock
        { x: 2150, y: 650, width: 400, height: 50, climbable: false }, // Dock 2
        { x: 2650, y: 600, width: 300, height: 100, climbable: false } // Lighthouse base
    );
    
    // Harbor guards
    this.enemies.push(
        new Enemy(400, 660, 'basic'),
        new Enemy(1100, 660, 'basic'),
        new Enemy(2800, 660, 'strong')
    );
    
    // Harbor NPCs (many)
    this.npcs.push(
        { x: 250, y: 560, width: 30, height: 40, name: 'Dock Worker', hasDialogue: true },
        { x: 650, y: 540, width: 30, height: 40, name: 'Innkeeper', hasDialogue: true },
        { x: 1000, y: 560, width: 30, height: 40, name: 'Merchant', hasDialogue: true },
        { x: 1350, y: 540, width: 30, height: 40, name: 'Guild Master', hasDialogue: true },
        { x: 1800, y: 610, width: 30, height: 40, name: 'Ship Captain', hasDialogue: true },
        { x: 2300, y: 610, width: 30, height: 40, name: 'Sailor', hasDialogue: true },
        { x: 2750, y: 560, width: 30, height: 40, name: 'Lighthouse Keeper', hasDialogue: true }
    );
    
    // Ships and items
    this.interactables.push(
        { x: 1750, y: 610, width: 80, height: 40, type: 'ship', special: true },
        { x: 2250, y: 610, width: 80, height: 40, type: 'ship', special: true },
        { x: 1400, y: 540, width: 40, height: 40, type: 'quest_board', special: true }
    );
};

// Ruins Area
World.prototype.loadRuinsArea = function() {
    this.currentArea = 'Ancient Ruins';
    this.width = 4000;
    this.height = 1000;
    
    // Crumbling structures
    this.platforms.push(
        { x: 0, y: 800, width: 400, height: 200, climbable: false },
        { x: 350, y: 700, width: 180, height: 20, climbable: false },
        { x: 500, y: 600, width: 200, height: 20, climbable: false },
        { x: 650, y: 500, width: 180, height: 20, climbable: false },
        { x: 800, y: 600, width: 200, height: 20, climbable: false },
        { x: 950, y: 700, width: 180, height: 20, climbable: false },
        { x: 1100, y: 800, width: 300, height: 200, climbable: false },
        { x: 1350, y: 700, width: 200, height: 20, climbable: false },
        { x: 1500, y: 600, width: 180, height: 20, climbable: false }
    );
    
    // Ancient guardians
    this.enemies.push(
        new Enemy(450, 650, 'strong'),
        new Enemy(700, 550, 'strong'),
        new Enemy(1000, 750, 'strong'),
        new Enemy(1400, 650, 'strong')
    );
    
    // Archaeologists and spirits
    this.npcs.push(
        { x: 100, y: 760, width: 30, height: 40, name: 'Archaeologist', hasDialogue: true },
        { x: 750, y: 550, width: 30, height: 40, name: 'Ancient Spirit', hasDialogue: true },
        { x: 1200, y: 760, width: 30, height: 40, name: 'Tomb Raider', hasDialogue: true }
    );
    
    // Ancient artifacts
    this.interactables.push(
        { x: 550, y: 560, width: 40, height: 40, type: 'ancient_tablet', special: true },
        { x: 1450, y: 560, width: 40, height: 40, type: 'chest', contains: 'ancient_relic' }
    );
};

// Volcano Area
World.prototype.loadVolcanoArea = function() {
    this.currentArea = 'Fire Mountain';
    this.width = 3500;
    this.height = 1200;
    
    // Volcano platforms (hot!)
    this.platforms.push(
        { x: 0, y: 1000, width: 400, height: 200, climbable: false },
        { x: 350, y: 900, width: 180, height: 20, climbable: false, hazard: 'lava' },
        { x: 500, y: 800, width: 200, height: 20, climbable: false },
        { x: 650, y: 700, width: 180, height: 20, climbable: false, hazard: 'lava' },
        { x: 800, y: 600, width: 200, height: 20, climbable: false },
        { x: 950, y: 500, width: 180, height: 20, climbable: false, hazard: 'lava' },
        { x: 1100, y: 400, width: 250, height: 20, climbable: false },
        { x: 1300, y: 300, width: 200, height: 20, climbable: false }
    );
    
    // Fire enemies
    this.enemies.push(
        new Enemy(450, 850, 'strong'),
        new Enemy(700, 750, 'strong'),
        new Enemy(950, 650, 'strong'),
        new Enemy(1200, 550, 'strong')
    );
    
    // Volcano NPCs
    this.npcs.push(
        { x: 100, y: 960, width: 30, height: 40, name: 'Fire Sage', hasDialogue: true },
        { x: 1350, y: 260, width: 30, height: 40, name: 'Volcano Spirit', hasDialogue: true }
    );
    
    // Volcanic treasures
    this.interactables.push(
        { x: 850, y: 560, width: 40, height: 40, type: 'lava_forge', special: true },
        { x: 1400, y: 260, width: 45, height: 45, type: 'chest', contains: 'flame_sword' }
    );
};

// Floating Islands Area
World.prototype.loadFloatingIslandsArea = function() {
    this.currentArea = 'Floating Islands';
    this.width = 5000;
    this.height = 1800;
    
    // Islands at various heights
    this.platforms.push(
        { x: 100, y: 1500, width: 300, height: 100, climbable: false },
        { x: 500, y: 1300, width: 280, height: 100, climbable: false },
        { x: 850, y: 1100, width: 250, height: 100, climbable: false },
        { x: 1200, y: 900, width: 300, height: 100, climbable: false },
        { x: 1600, y: 700, width: 280, height: 100, climbable: false },
        { x: 2000, y: 500, width: 250, height: 100, climbable: false },
        { x: 2350, y: 300, width: 300, height: 100, climbable: false },
        { x: 2750, y: 500, width: 280, height: 100, climbable: false },
        { x: 3100, y: 700, width: 250, height: 100, climbable: false }
    );
    
    // Sky enemies
    this.enemies.push(
        new Enemy(600, 1250, 'basic'),
        new Enemy(950, 1050, 'strong'),
        new Enemy(1350, 850, 'strong'),
        new Enemy(1750, 650, 'strong'),
        new Enemy(2150, 450, 'strong')
    );
    
    // Island NPCs
    this.npcs.push(
        { x: 200, y: 1460, width: 30, height: 40, name: 'Sky Merchant', hasDialogue: true },
        { x: 1350, y: 860, width: 30, height: 40, name: 'Wind Mage', hasDialogue: true },
        { x: 2450, y: 260, width: 30, height: 40, name: 'Cloud Guardian', hasDialogue: true }
    );
    
    // Sky treasures
    this.interactables.push(
        { x: 1400, y: 860, width: 40, height: 40, type: 'wind_shrine', special: true },
        { x: 2500, y: 260, width: 45, height: 45, type: 'chest', contains: 'sky_crystal' }
    );
};

// Extend the original loadArea to use extended version as fallback
World.prototype.originalLoadArea = World.prototype.loadArea;
World.prototype.loadArea = function(areaName) {
    // Try extended areas first
    const extendedAreas = ['mountain', 'frozen_peaks', 'castle', 'royal_castle', 'swamp', 'cursed_swamp',
                           'desert', 'scorching_desert', 'underground', 'crystal_caves', 'sky_temple',
                           'void_realm', 'harbor', 'port_city', 'ruins', 'ancient_ruins', 'volcano',
                           'fire_mountain', 'floating_islands'];
    
    if (extendedAreas.some(area => areaName.toLowerCase().includes(area.toLowerCase()))) {
        this.loadExtendedArea(areaName);
    } else {
        // Fall back to original areas
        this.originalLoadArea(areaName);
    }
};
