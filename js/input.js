/**
 * Input Handler
 */

class InputHandler {
    constructor() {
        this.keys = {};
        this.prevKeys = {};
        this.actions = {
            up: ['ArrowUp', 'KeyW'],
            down: ['ArrowDown', 'KeyS'],
            left: ['ArrowLeft', 'KeyA'],
            right: ['ArrowRight', 'KeyD'],
            jump: ['Space'],
            dodge: ['ShiftLeft', 'ShiftRight'],
            attack: ['KeyZ', 'KeyJ'],
            special: ['KeyX', 'KeyK'],
            interact: ['KeyE'],
            pause: ['Escape'],
            item1: ['Digit1'],
            item2: ['Digit2'],
            item3: ['Digit3'],
            item4: ['Digit4']
        };
        
        this.setupEventListeners();
    }
    
    setupEventListeners() {
        window.addEventListener('keydown', (e) => {
            this.keys[e.code] = true;
            
            // Prevent default for game keys
            if (this.isGameKey(e.code)) {
                e.preventDefault();
            }
        });
        
        window.addEventListener('keyup', (e) => {
            this.keys[e.code] = false;
        });
        
        // Prevent context menu on right click
        window.addEventListener('contextmenu', (e) => {
            e.preventDefault();
        });
    }
    
    isGameKey(code) {
        for (const actionKeys of Object.values(this.actions)) {
            if (actionKeys.includes(code)) {
                return true;
            }
        }
        return false;
    }
    
    update() {
        // Store previous frame keys for detecting presses
        this.prevKeys = { ...this.keys };
    }
    
    isActionDown(action) {
        const actionKeys = this.actions[action];
        if (!actionKeys) return false;
        
        return actionKeys.some(key => this.keys[key]);
    }
    
    isActionPressed(action) {
        const actionKeys = this.actions[action];
        if (!actionKeys) return false;
        
        return actionKeys.some(key => this.keys[key] && !this.prevKeys[key]);
    }
    
    isActionReleased(action) {
        const actionKeys = this.actions[action];
        if (!actionKeys) return false;
        
        return actionKeys.some(key => !this.keys[key] && this.prevKeys[key]);
    }
    
    getAxis(negative, positive) {
        let axis = 0;
        if (this.isActionDown(negative)) axis -= 1;
        if (this.isActionDown(positive)) axis += 1;
        return axis;
    }
}
