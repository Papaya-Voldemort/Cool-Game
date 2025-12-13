/**
 * Game Constants
 */

const CONSTANTS = {
    // Display
    SCREEN_WIDTH: 1280,
    SCREEN_HEIGHT: 720,
    FPS: 60,
    
    // Physics
    GRAVITY: 0.8,
    MAX_FALL_SPEED: 20,
    JUMP_SPEED: -15,
    PLAYER_SPEED: 5,
    DASH_SPEED: 12,
    FRICTION: 0.85,
    
    // Combat
    PLAYER_MAX_HP: 100,
    PLAYER_DAMAGE: 10,
    ATTACK_COOLDOWN: 300,
    COMBO_WINDOW: 500,
    DODGE_COOLDOWN: 800,
    INVULNERABILITY_TIME: 500,
    
    // Enemy Stats
    ENEMY_BASIC_HP: 30,
    ENEMY_STRONG_HP: 50,
    BOSS_HP: 200,
    
    // Colors (placeholder graphics)
    COLORS: {
        BLACK: '#000000',
        WHITE: '#FFFFFF',
        RED: '#FF0000',
        GREEN: '#00FF00',
        BLUE: '#0000FF',
        YELLOW: '#FFFF00',
        PURPLE: '#800080',
        ORANGE: '#FFA500',
        GRAY: '#808080',
        DARK_GRAY: '#404040',
        LIGHT_GRAY: '#C0C0C0',
        PLAYER: '#00BFFF',
        ENEMY: '#FF4500',
        BOSS: '#8B008B',
        PLATFORM: '#8B4513',
        INTERACTIVE: '#FFD700'
    },
    
    // Game States
    STATES: {
        MENU: 'menu',
        PLAYING: 'playing',
        PAUSED: 'paused',
        DIALOGUE: 'dialogue',
        CHOICE: 'choice',
        GAME_OVER: 'game_over',
        ENDING: 'ending'
    },
    
    // Entity Types
    ENTITY_TYPES: {
        PLAYER: 'player',
        ENEMY: 'enemy',
        BOSS: 'boss',
        PLATFORM: 'platform',
        INTERACTIVE: 'interactive',
        NPC: 'npc'
    },
    
    // Direction
    DIRECTION: {
        LEFT: 'left',
        RIGHT: 'right',
        UP: 'up',
        DOWN: 'down'
    }
};
