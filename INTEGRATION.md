# Asset Integration Guide

This guide explains how to replace placeholder graphics with custom sprites and assets.

## Current Placeholder System

The game currently uses colored rectangles and basic shapes for all visual elements:
- **Player**: Cyan rectangle (30x50px)
- **Enemies**: Red/Purple rectangles (30x40px)
- **Bosses**: Purple rectangles (60x80px)
- **Platforms**: Brown rectangles
- **NPCs**: Green rectangles (30x40px)
- **Interactables**: Gold rectangles with glow

## Adding Custom Sprites

### 1. Prepare Your Assets

Create sprite sheets or individual images in PNG format with transparency:

```
assets/sprites/
├── player/
│   ├── idle.png
│   ├── walk.png
│   ├── jump.png
│   ├── attack.png
│   └── dodge.png
├── enemies/
│   ├── basic_idle.png
│   ├── basic_walk.png
│   ├── strong_idle.png
│   └── strong_walk.png
├── bosses/
│   ├── warrior_idle.png
│   ├── warrior_phase2.png
│   ├── mage_idle.png
│   └── shadow_idle.png
├── environment/
│   ├── platform.png
│   ├── wall.png
│   └── background.png
└── ui/
    ├── hp_bar.png
    └── dialogue_box.png
```

### 2. Modify Player.js

Replace the placeholder rendering code in the `render()` method:

```javascript
// Current placeholder code (in js/player.js, line ~280):
ctx.fillStyle = CONSTANTS.COLORS.PLAYER;
ctx.fillRect(screenX, screenY, this.width, this.height);

// Replace with:
if (!this.sprite) {
    this.sprite = new Image();
    this.sprite.src = 'assets/sprites/player/idle.png';
}
ctx.drawImage(this.sprite, screenX, screenY, this.width, this.height);
```

### 3. Add Animation System

For animated sprites, add a simple frame system:

```javascript
class Player {
    constructor(x, y) {
        // ... existing code ...
        
        // Add animation properties
        this.sprites = {
            idle: this.loadSprite('assets/sprites/player/idle.png'),
            walk: this.loadSprite('assets/sprites/player/walk.png'),
            jump: this.loadSprite('assets/sprites/player/jump.png'),
            attack: this.loadSprite('assets/sprites/player/attack.png')
        };
        this.currentAnimation = 'idle';
        this.animationFrame = 0;
        this.animationTimer = 0;
    }
    
    loadSprite(path) {
        const img = new Image();
        img.src = path;
        return img;
    }
    
    updateAnimation(dt) {
        this.animationTimer += dt;
        if (this.animationTimer > 0.1) { // 10 FPS for animation
            this.animationFrame++;
            this.animationTimer = 0;
        }
        
        // Select animation based on state
        if (this.isAttacking) this.currentAnimation = 'attack';
        else if (!this.onGround) this.currentAnimation = 'jump';
        else if (Math.abs(this.vx) > 0.5) this.currentAnimation = 'walk';
        else this.currentAnimation = 'idle';
    }
    
    render(ctx, cameraX, cameraY) {
        const screenX = this.x - cameraX;
        const screenY = this.y - cameraY;
        
        const sprite = this.sprites[this.currentAnimation];
        if (sprite && sprite.complete) {
            ctx.drawImage(sprite, screenX, screenY, this.width, this.height);
        } else {
            // Fallback to placeholder
            ctx.fillStyle = CONSTANTS.COLORS.PLAYER;
            ctx.fillRect(screenX, screenY, this.width, this.height);
        }
    }
}
```

### 4. Modify Enemy.js

Similar process for enemies:

```javascript
// In Enemy constructor:
this.sprite = new Image();
this.sprite.src = `assets/sprites/enemies/${type}_idle.png`;

// In render method:
if (this.sprite.complete) {
    ctx.drawImage(this.sprite, screenX, screenY, this.width, this.height);
} else {
    // Fallback to current placeholder
    ctx.fillStyle = color;
    ctx.fillRect(screenX, screenY, this.width, this.height);
}
```

### 5. Modify Boss.js

For bosses with phases:

```javascript
// In Boss constructor:
this.sprites = {
    phase1: this.loadSprite(`assets/sprites/bosses/${bossType}_phase1.png`),
    phase2: this.loadSprite(`assets/sprites/bosses/${bossType}_phase2.png`),
    phase3: this.loadSprite(`assets/sprites/bosses/${bossType}_phase3.png`)
};

// In render method:
const sprite = this.sprites[`phase${this.currentPhase}`];
if (sprite && sprite.complete) {
    ctx.drawImage(sprite, screenX, screenY, this.width, this.height);
}
```

### 6. Modify World.js

For platforms and backgrounds:

```javascript
class World {
    constructor(narrativeManager) {
        // ... existing code ...
        
        this.backgroundImage = new Image();
        this.platformSprite = new Image();
    }
    
    loadArea(areaName) {
        // ... existing code ...
        
        // Load area-specific background
        this.backgroundImage.src = `assets/sprites/environment/${areaName}_bg.png`;
        this.platformSprite.src = 'assets/sprites/environment/platform.png';
    }
    
    render(ctx, cameraX, cameraY) {
        // Draw background
        if (this.backgroundImage.complete) {
            ctx.drawImage(this.backgroundImage, 0, 0, ctx.canvas.width, ctx.canvas.height);
        } else {
            ctx.fillStyle = this.getBackgroundColor();
            ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        }
        
        // Draw platforms with sprite
        for (const platform of this.platforms) {
            const screenX = platform.x - cameraX;
            const screenY = platform.y - cameraY;
            
            if (this.platformSprite.complete) {
                // Tile the sprite
                const pattern = ctx.createPattern(this.platformSprite, 'repeat');
                ctx.fillStyle = pattern;
                ctx.fillRect(screenX, screenY, platform.width, platform.height);
            } else {
                // Fallback to placeholder
                ctx.fillStyle = CONSTANTS.COLORS.PLATFORM;
                ctx.fillRect(screenX, screenY, platform.width, platform.height);
            }
        }
    }
}
```

## Sprite Sheet Integration

If using sprite sheets instead of individual images:

```javascript
class SpriteSheet {
    constructor(imagePath, frameWidth, frameHeight) {
        this.image = new Image();
        this.image.src = imagePath;
        this.frameWidth = frameWidth;
        this.frameHeight = frameHeight;
    }
    
    drawFrame(ctx, frameIndex, x, y, width, height) {
        if (!this.image.complete) return;
        
        const cols = Math.floor(this.image.width / this.frameWidth);
        const row = Math.floor(frameIndex / cols);
        const col = frameIndex % cols;
        
        ctx.drawImage(
            this.image,
            col * this.frameWidth,
            row * this.frameHeight,
            this.frameWidth,
            this.frameHeight,
            x, y, width, height
        );
    }
}

// Usage:
this.playerSheet = new SpriteSheet('assets/sprites/player_sheet.png', 32, 32);
this.playerSheet.drawFrame(ctx, this.animationFrame, screenX, screenY, this.width, this.height);
```

## Audio Integration

### Adding Sound Effects

```javascript
class AudioManager {
    constructor() {
        this.sounds = {};
    }
    
    load(name, path) {
        this.sounds[name] = new Audio(path);
    }
    
    play(name) {
        if (this.sounds[name]) {
            this.sounds[name].currentTime = 0;
            this.sounds[name].play();
        }
    }
}

// Initialize in game.js:
this.audio = new AudioManager();
this.audio.load('attack', 'assets/sounds/attack.mp3');
this.audio.load('jump', 'assets/sounds/jump.mp3');
this.audio.load('hit', 'assets/sounds/hit.mp3');

// Use in player.js:
attack(type) {
    // ... existing code ...
    if (game.audio) game.audio.play('attack');
}
```

### Adding Background Music

```javascript
class Game {
    constructor() {
        // ... existing code ...
        
        this.music = new Audio('assets/music/theme.mp3');
        this.music.loop = true;
        this.music.volume = 0.5;
    }
    
    startGame() {
        // ... existing code ...
        this.music.play();
    }
}
```

## Particle Effects

For advanced visual effects:

```javascript
class ParticleSystem {
    constructor() {
        this.particles = [];
    }
    
    createExplosion(x, y, color, count = 10) {
        for (let i = 0; i < count; i++) {
            this.particles.push({
                x, y,
                vx: (Math.random() - 0.5) * 10,
                vy: (Math.random() - 0.5) * 10,
                life: 1.0,
                color
            });
        }
    }
    
    update(dt) {
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const p = this.particles[i];
            p.x += p.vx * dt * 60;
            p.y += p.vy * dt * 60;
            p.life -= dt;
            
            if (p.life <= 0) {
                this.particles.splice(i, 1);
            }
        }
    }
    
    render(ctx, cameraX, cameraY) {
        for (const p of this.particles) {
            ctx.globalAlpha = p.life;
            ctx.fillStyle = p.color;
            ctx.fillRect(p.x - cameraX, p.y - cameraY, 4, 4);
        }
        ctx.globalAlpha = 1.0;
    }
}
```

## Recommended Asset Specifications

### Sprites
- **Format**: PNG with transparency
- **Player**: 32x32px or 64x64px per frame
- **Enemies**: 32x32px per frame
- **Bosses**: 64x64px or 128x128px per frame
- **Tiles**: 32x32px or 64x64px
- **Color Depth**: 32-bit RGBA

### Sprite Sheets
- **Layout**: Grid-based, power-of-2 dimensions
- **Naming**: descriptive, e.g., `player_walk_sheet.png`
- **Frame Count**: 4-8 frames for walk cycles, 3-5 for attacks

### Audio
- **Music**: MP3 or OGG, 128-192 kbps
- **Sound Effects**: MP3 or OGG, 64-128 kbps
- **Length**: SFX < 2 seconds, Music loops 1-3 minutes

### Backgrounds
- **Resolution**: 1280x720px minimum
- **Format**: JPG or PNG
- **File Size**: < 500KB for performance

## Testing Your Assets

1. Place assets in appropriate folders
2. Modify the relevant JS files
3. Refresh the browser (Ctrl+F5 for hard refresh)
4. Check browser console for loading errors
5. Verify sprites render correctly
6. Test all animations and states

## Performance Tips

1. **Preload Assets**: Load all images at game start
2. **Use Sprite Sheets**: Reduces HTTP requests
3. **Optimize File Sizes**: Compress images without quality loss
4. **Cache Rendered Frames**: Store commonly used renders
5. **Lazy Load**: Load area-specific assets only when needed

## Common Issues

### Images Not Loading
- Check file paths (case-sensitive)
- Verify CORS if using external server
- Ensure files are in correct format

### Flickering Sprites
- Preload images before rendering
- Check `image.complete` before drawing

### Performance Issues
- Reduce sprite sheet size
- Use requestAnimationFrame properly
- Optimize draw calls

## Example Asset Pack Structure

```
Cool-Game/
├── assets/
│   ├── sprites/
│   │   ├── player/
│   │   │   ├── idle_sheet.png (128x32, 4 frames)
│   │   │   ├── walk_sheet.png (256x32, 8 frames)
│   │   │   └── attack_sheet.png (192x32, 6 frames)
│   │   ├── enemies/
│   │   ├── bosses/
│   │   └── environment/
│   ├── sounds/
│   │   ├── sfx/
│   │   │   ├── attack.mp3
│   │   │   ├── jump.mp3
│   │   │   └── hit.mp3
│   │   └── music/
│   │       ├── menu_theme.mp3
│   │       └── battle_theme.mp3
│   └── ui/
│       ├── buttons.png
│       └── icons.png
└── [existing files]
```

This modular approach allows you to enhance the game visually while maintaining all the core gameplay functionality.
