/**
 * Main Game Class
 */

class Game {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        
        // Core systems
        this.input = new InputHandler();
        this.narrativeManager = new NarrativeManager();
        this.combatSystem = new CombatSystem();
        this.eventSystem = null; // Initialized when game starts
        this.particleSystem = new ParticleSystem();
        this.screenShake = new ScreenShake();
        
        // Game objects
        this.player = null;
        this.world = null;
        
        // Camera
        this.cameraX = 0;
        this.cameraY = 0;
        
        // Scaling
        this.scale = 1;
        this.setupCanvasScaling();
        
        // Game state
        this.state = CONSTANTS.STATES.MENU;
        this.lastTime = 0;
        
        // Performance tracking
        this.fps = 0;
        this.frameCount = 0;
        this.fpsTimer = 0;
        
        // UI elements
        this.setupUI();
        
        // Start game loop
        this.running = true;
        requestAnimationFrame((time) => this.gameLoop(time));
    }
    
    setupCanvasScaling() {
        const resizeCanvas = () => {
            const container = document.getElementById('game-container');
            const containerWidth = container.clientWidth;
            const containerHeight = container.clientHeight;
            
            // Calculate scale to fit container while maintaining aspect ratio
            const scaleX = containerWidth / CONSTANTS.SCREEN_WIDTH;
            const scaleY = containerHeight / CONSTANTS.SCREEN_HEIGHT;
            this.scale = Math.min(scaleX, scaleY);
            
            // Set canvas size
            this.canvas.width = CONSTANTS.SCREEN_WIDTH;
            this.canvas.height = CONSTANTS.SCREEN_HEIGHT;
            
            // Apply scaling via CSS for smooth rendering
            this.canvas.style.width = (CONSTANTS.SCREEN_WIDTH * this.scale) + 'px';
            this.canvas.style.height = (CONSTANTS.SCREEN_HEIGHT * this.scale) + 'px';
        };
        
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);
    }
    
    setupUI() {
        // Menu button
        const startButton = document.getElementById('start-button');
        startButton.addEventListener('click', () => this.startGame());
        
        // Hide all screens except menu
        this.showScreen('menu-screen');
    }
    
    startGame() {
        // Initialize game objects
        this.player = new Player(100, 500);
        this.world = new World(this.narrativeManager);
        this.eventSystem = new EventSystem(this.narrativeManager);
        
        // Start narrative
        this.narrativeManager.startGame();
        
        // Change state
        this.changeState(CONSTANTS.STATES.DIALOGUE);
        
        // Show HUD
        document.getElementById('hud').classList.remove('hidden');
    }
    
    gameLoop(currentTime) {
        if (!this.running) return;
        
        // Calculate delta time
        const dt = (currentTime - this.lastTime) / 1000;
        this.lastTime = currentTime;
        
        // Update
        this.update(dt);
        
        // Render
        this.render();
        
        // Post-update (for input tracking)
        this.input.postUpdate();
        
        // Continue loop
        requestAnimationFrame((time) => this.gameLoop(time));
    }
    
    update(dt) {
        // Clamp dt to prevent huge jumps
        dt = Math.min(dt, 0.1);
        
        // Update input
        this.input.update();
        
        // Handle state-specific updates
        switch (this.state) {
            case CONSTANTS.STATES.MENU:
                this.updateMenu();
                break;
            case CONSTANTS.STATES.PLAYING:
                this.updatePlaying(dt);
                break;
            case CONSTANTS.STATES.PAUSED:
                this.updatePaused();
                break;
            case CONSTANTS.STATES.DIALOGUE:
                this.updateDialogue();
                break;
            case CONSTANTS.STATES.CHOICE:
                this.updateChoice();
                break;
            case CONSTANTS.STATES.GAME_OVER:
                this.updateGameOver();
                break;
            case CONSTANTS.STATES.ENDING:
                this.updateEnding();
                break;
        }
    }
    
    updateMenu() {
        // Menu is handled by UI buttons
    }
    
    updatePlaying(dt) {
        // Check for pause
        if (this.input.isActionPressed('pause')) {
            this.changeState(CONSTANTS.STATES.PAUSED);
            return;
        }
        
        // Update player
        this.player.update(dt, this.input, this.world);
        
        // Update world
        this.world.update(dt, this.player, this.narrativeManager);
        
        // Update event system
        if (this.eventSystem) {
            this.eventSystem.update(dt, this.player, this.world, this.narrativeManager);
        }
        
        // Update combat
        this.combatSystem.update(dt, this.player, this.world.getActiveEnemies());
        
        // Update particle system
        this.particleSystem.update(dt);
        
        // Update screen shake
        this.screenShake.update(dt);
        
        // Create effects based on player actions
        if (this.player.isAttacking) {
            const attackX = this.player.direction === 'right' 
                ? this.player.x + this.player.width 
                : this.player.x - 40;
            this.particleSystem.createTrail(attackX + 20, this.player.y + 25, '#FFAA00', 3);
        }
        
        if (this.player.isDodging) {
            this.particleSystem.createDodgeEffect(this.player.x, this.player.y, this.player.width, this.player.height);
        }
        
        // Environmental particles based on area
        if (this.world.currentArea.includes('Forest')) {
            this.particleSystem.createEnvironmentalEffect(this.cameraX, 0, 'leaves');
        } else if (this.world.currentArea.includes('Mountain') || this.world.currentArea.includes('Frozen')) {
            this.particleSystem.createEnvironmentalEffect(this.cameraX, 0, 'snow');
        }
        
        // Update camera
        this.updateCamera();
        
        // Update HUD
        this.updateHUD();
        
        // Check for dialogue triggers
        if (this.input.isActionPressed('interact')) {
            if (this.world.checkDialogueTrigger(this.player)) {
                this.changeState(CONSTANTS.STATES.DIALOGUE);
            }
        }
        
        // Check for pending choice
        if (this.narrativeManager.hasPendingChoice()) {
            this.changeState(CONSTANTS.STATES.CHOICE);
        }
        
        // Check for game over
        if (this.player.hp <= 0) {
            this.particleSystem.createExplosion(this.player.x + this.player.width / 2, this.player.y + this.player.height / 2, '#FF0000', 30);
            this.screenShake.shake(10, 0.5);
            this.changeState(CONSTANTS.STATES.GAME_OVER);
        }
        
        // Check for ending
        if (this.narrativeManager.shouldTriggerEnding()) {
            this.changeState(CONSTANTS.STATES.ENDING);
        }
        
        // Track combat style for narrative
        if (this.player.isAttacking) {
            if (this.player.comboCount > 2) {
                this.narrativeManager.trackCombatStyle('aggressive');
                this.particleSystem.createHitEffect(this.player.x + this.player.width / 2, this.player.y, true);
                this.screenShake.shake(3, 0.1);
            } else {
                this.narrativeManager.trackCombatStyle('tactical');
            }
        }
        if (this.player.isDodging) {
            this.narrativeManager.trackCombatStyle('defensive');
        }
        
        // FPS tracking
        this.frameCount++;
        this.fpsTimer += dt;
        if (this.fpsTimer >= 1.0) {
            this.fps = this.frameCount;
            this.frameCount = 0;
            this.fpsTimer = 0;
        }
    }
    
    updatePaused() {
        if (this.input.isActionPressed('pause')) {
            this.changeState(CONSTANTS.STATES.PLAYING);
        }
    }
    
    updateDialogue() {
        if (this.input.isActionPressed('interact')) {
            if (this.narrativeManager.advanceDialogue()) {
                // Dialogue finished
                this.changeState(CONSTANTS.STATES.PLAYING);
            } else {
                // Update dialogue display
                this.displayDialogue();
            }
        }
    }
    
    updateChoice() {
        if (this.input.isActionPressed('up')) {
            this.narrativeManager.selectPreviousChoice();
            this.displayChoices();
        } else if (this.input.isActionPressed('down')) {
            this.narrativeManager.selectNextChoice();
            this.displayChoices();
        } else if (this.input.isActionPressed('interact')) {
            this.narrativeManager.makeChoice();
            this.changeState(CONSTANTS.STATES.PLAYING);
        }
    }
    
    updateGameOver() {
        if (this.input.isActionPressed('interact')) {
            this.restartGame();
        }
    }
    
    updateEnding() {
        // Show ending screen, can restart from here
        if (this.input.isActionPressed('interact')) {
            this.restartGame();
        }
    }
    
    updateCamera() {
        // Center camera on player
        this.cameraX = this.player.x - CONSTANTS.SCREEN_WIDTH / 2;
        this.cameraY = this.player.y - CONSTANTS.SCREEN_HEIGHT / 2;
        
        // Clamp camera to world bounds
        this.cameraX = Utils.clamp(this.cameraX, 0, this.world.width - CONSTANTS.SCREEN_WIDTH);
        this.cameraY = Utils.clamp(this.cameraY, 0, this.world.height - CONSTANTS.SCREEN_HEIGHT);
    }
    
    updateHUD() {
        // Update HP bar
        const hpFill = document.getElementById('health-fill');
        const hpText = document.getElementById('health-text');
        const hpPercentage = (this.player.hp / this.player.maxHp) * 100;
        hpFill.style.width = hpPercentage + '%';
        hpText.textContent = `${Math.ceil(this.player.hp)}/${this.player.maxHp}`;
        
        // Update area
        document.getElementById('current-area').textContent = this.world.currentArea;
        
        // Update decision count
        document.getElementById('decision-count').textContent = this.narrativeManager.getDecisionCount();
        
        // Update FPS
        document.getElementById('fps-value').textContent = this.fps;
        
        // Update morality
        const moralityValue = this.narrativeManager.morality;
        document.getElementById('morality-value').textContent = moralityValue > 0 ? `+${moralityValue}` : moralityValue;
    }
    
    render() {
        // Clear canvas
        this.ctx.fillStyle = CONSTANTS.COLORS.BLACK;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Apply screen shake
        const shakeOffset = this.screenShake.getOffset();
        this.ctx.save();
        this.ctx.translate(shakeOffset.x, shakeOffset.y);
        
        // Render based on state
        if (this.state !== CONSTANTS.STATES.MENU && this.player && this.world) {
            // Render world
            this.world.render(this.ctx, this.cameraX, this.cameraY);
            
            // Render player
            this.player.render(this.ctx, this.cameraX, this.cameraY);
            
            // Render combat effects
            this.combatSystem.render(this.ctx, this.cameraX, this.cameraY);
            
            // Render particles
            this.particleSystem.render(this.ctx, this.cameraX, this.cameraY);
        }
        
        this.ctx.restore();
    }
    
    changeState(newState) {
        this.state = newState;
        
        // Update UI visibility
        this.showScreen(null);
        
        switch (newState) {
            case CONSTANTS.STATES.MENU:
                this.showScreen('menu-screen');
                document.getElementById('hud').classList.add('hidden');
                break;
            case CONSTANTS.STATES.PLAYING:
                document.getElementById('hud').classList.remove('hidden');
                document.getElementById('dialogue-box').classList.add('hidden');
                document.getElementById('choice-menu').classList.add('hidden');
                break;
            case CONSTANTS.STATES.PAUSED:
                this.showScreen('pause-screen');
                break;
            case CONSTANTS.STATES.DIALOGUE:
                document.getElementById('dialogue-box').classList.remove('hidden');
                this.displayDialogue();
                break;
            case CONSTANTS.STATES.CHOICE:
                document.getElementById('choice-menu').classList.remove('hidden');
                this.displayChoices();
                break;
            case CONSTANTS.STATES.GAME_OVER:
                this.showScreen('game-over-screen');
                break;
            case CONSTANTS.STATES.ENDING:
                this.showScreen('ending-screen');
                this.displayEnding();
                break;
        }
    }
    
    showScreen(screenId) {
        // Hide all screens
        const screens = ['menu-screen', 'pause-screen', 'game-over-screen', 'ending-screen'];
        screens.forEach(id => {
            const element = document.getElementById(id);
            if (element) element.classList.add('hidden');
        });
        
        // Show specified screen
        if (screenId) {
            const screen = document.getElementById(screenId);
            if (screen) screen.classList.remove('hidden');
        }
    }
    
    displayDialogue() {
        const dialogue = this.narrativeManager.getCurrentDialogue();
        if (!dialogue) return;
        
        document.getElementById('speaker-name').textContent = dialogue.speaker || '???';
        document.getElementById('dialogue-text').textContent = dialogue.text || '';
    }
    
    displayChoices() {
        const choices = this.narrativeManager.getCurrentChoices();
        if (!choices) return;
        
        const container = document.getElementById('choice-options');
        container.innerHTML = '';
        
        const selectedIndex = this.narrativeManager.getSelectedChoiceIndex();
        
        choices.forEach((choice, index) => {
            const div = document.createElement('div');
            div.className = 'choice-option';
            if (index === selectedIndex) {
                div.classList.add('selected');
            }
            div.textContent = choice.text;
            container.appendChild(div);
        });
    }
    
    displayEnding() {
        const ending = this.narrativeManager.calculateEnding();
        
        document.getElementById('ending-title').textContent = ending.title;
        document.getElementById('ending-description').textContent = ending.description;
        
        const stats = document.getElementById('ending-stats');
        stats.innerHTML = `
            <p><strong>Decisions Made:</strong> ${ending.decisions}</p>
            <p><strong>Ending ID:</strong> ${ending.ending_id}</p>
            <p><strong>Path Type:</strong> ${ending.path_type}</p>
            <p><strong>Morality:</strong> ${ending.morality > 0 ? '+' : ''}${ending.morality}</p>
        `;
    }
    
    restartGame() {
        // Reset game
        this.player = null;
        this.world = null;
        this.narrativeManager = new NarrativeManager();
        this.combatSystem = new CombatSystem();
        this.changeState(CONSTANTS.STATES.MENU);
    }
}

// Start the game when page loads
window.addEventListener('load', () => {
    new Game();
});
