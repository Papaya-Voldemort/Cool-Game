/**
 * Comprehensive Input Handler
 * Handles keyboard, mouse, and gamepad input with robust tracking
 */

class InputHandler {
    constructor() {
        // Key tracking with proper state management
        this.keys = {};
        this.prevKeys = {};
        this.keyPressedThisFrame = {};
        this.keyReleasedThisFrame = {};
        
        // Mouse tracking
        this.mouse = {
            x: 0,
            y: 0,
            worldX: 0,
            worldY: 0,
            left: false,
            right: false,
            middle: false,
            prevLeft: false,
            prevRight: false,
            prevMiddle: false,
            wheel: 0
        };
        
        // Touch tracking for mobile
        this.touches = [];
        
        // Input buffering for responsive controls
        this.inputBuffer = [];
        this.bufferTime = 150; // ms to buffer inputs
        
        // Action mapping with multiple input sources
        this.actions = {
            up: { keys: ['ArrowUp', 'KeyW'], gamepad: 12, axis: { index: 1, threshold: -0.5 } },
            down: { keys: ['ArrowDown', 'KeyS'], gamepad: 13, axis: { index: 1, threshold: 0.5 } },
            left: { keys: ['ArrowLeft', 'KeyA'], gamepad: 14, axis: { index: 0, threshold: -0.5 } },
            right: { keys: ['ArrowRight', 'KeyD'], gamepad: 15, axis: { index: 0, threshold: 0.5 } },
            jump: { keys: ['Space', 'KeyW', 'ArrowUp'], gamepad: 0 },
            dodge: { keys: ['ShiftLeft', 'ShiftRight', 'ControlLeft', 'ControlRight'], gamepad: 1 },
            attack: { keys: ['KeyZ', 'KeyJ', 'Enter'], gamepad: 2, mouse: 'left' },
            special: { keys: ['KeyX', 'KeyK', 'Slash'], gamepad: 3, mouse: 'right' },
            interact: { keys: ['KeyE', 'KeyF', 'Space'], gamepad: 0 },
            pause: { keys: ['Escape', 'KeyP'], gamepad: 9 },
            item1: { keys: ['Digit1', 'Numpad1'], gamepad: 4 },
            item2: { keys: ['Digit2', 'Numpad2'], gamepad: 5 },
            item3: { keys: ['Digit3', 'Numpad3'], gamepad: 6 },
            item4: { keys: ['Digit4', 'Numpad4'], gamepad: 7 },
            map: { keys: ['KeyM', 'Tab'] },
            inventory: { keys: ['KeyI', 'KeyB'] },
            menu: { keys: ['Escape', 'Backspace'] }
        };
        
        // Gamepad support
        this.gamepads = [];
        this.gamepadDeadzone = 0.15;
        
        // Input lock (for cutscenes, dialogues, etc.)
        this.locked = false;
        
        // Combo detection
        this.comboHistory = [];
        this.comboTimeWindow = 500; // ms
        
        // Setup listeners
        this.setupEventListeners();
        
        // Focus tracking
        this.hasFocus = true;
        this.setupFocusTracking();
    }
    
    setupEventListeners() {
        // Keyboard events with proper propagation handling
        window.addEventListener('keydown', (e) => {
            // Only register as a press if it wasn't already down
            if (!this.keys[e.code]) {
                this.keyPressedThisFrame[e.code] = true;
                this.bufferInput(e.code, 'press');
                this.addToComboHistory(e.code);
            }
            
            this.keys[e.code] = true;
            
            // Prevent default for game keys
            if (this.isGameKey(e.code)) {
                e.preventDefault();
                e.stopPropagation();
            }
        }, { passive: false });
        
        window.addEventListener('keyup', (e) => {
            this.keys[e.code] = false;
            this.keyReleasedThisFrame[e.code] = true;
            
            if (this.isGameKey(e.code)) {
                e.preventDefault();
                e.stopPropagation();
            }
        }, { passive: false });
        
        // Mouse events
        const canvas = document.getElementById('gameCanvas');
        if (canvas) {
            canvas.addEventListener('mousemove', (e) => {
                const rect = canvas.getBoundingClientRect();
                this.mouse.x = e.clientX - rect.left;
                this.mouse.y = e.clientY - rect.top;
                
                // Convert to game coordinates
                this.mouse.x = (this.mouse.x / rect.width) * canvas.width;
                this.mouse.y = (this.mouse.y / rect.height) * canvas.height;
            });
            
            canvas.addEventListener('mousedown', (e) => {
                e.preventDefault();
                switch (e.button) {
                    case 0: this.mouse.left = true; break;
                    case 1: this.mouse.middle = true; break;
                    case 2: this.mouse.right = true; break;
                }
            });
            
            canvas.addEventListener('mouseup', (e) => {
                switch (e.button) {
                    case 0: this.mouse.left = false; break;
                    case 1: this.mouse.middle = false; break;
                    case 2: this.mouse.right = false; break;
                }
            });
            
            canvas.addEventListener('wheel', (e) => {
                e.preventDefault();
                this.mouse.wheel = Math.sign(e.deltaY);
            }, { passive: false });
            
            // Touch events for mobile
            canvas.addEventListener('touchstart', (e) => {
                e.preventDefault();
                this.updateTouches(e);
            }, { passive: false });
            
            canvas.addEventListener('touchmove', (e) => {
                e.preventDefault();
                this.updateTouches(e);
            }, { passive: false });
            
            canvas.addEventListener('touchend', (e) => {
                e.preventDefault();
                this.updateTouches(e);
            }, { passive: false });
        }
        
        // Prevent context menu
        window.addEventListener('contextmenu', (e) => {
            e.preventDefault();
        });
        
        // Gamepad connection
        window.addEventListener('gamepadconnected', (e) => {
            console.log('Gamepad connected:', e.gamepad);
        });
        
        window.addEventListener('gamepaddisconnected', (e) => {
            console.log('Gamepad disconnected:', e.gamepad);
        });
    }
    
    setupFocusTracking() {
        window.addEventListener('blur', () => {
            this.hasFocus = false;
            // Clear all inputs when losing focus to prevent stuck keys
            this.clearAllInputs();
        });
        
        window.addEventListener('focus', () => {
            this.hasFocus = true;
        });
        
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.clearAllInputs();
            }
        });
    }
    
    clearAllInputs() {
        this.keys = {};
        this.prevKeys = {};
        this.keyPressedThisFrame = {};
        this.keyReleasedThisFrame = {};
        this.mouse.left = false;
        this.mouse.right = false;
        this.mouse.middle = false;
    }
    
    updateTouches(e) {
        this.touches = Array.from(e.touches).map(touch => ({
            x: touch.clientX,
            y: touch.clientY,
            id: touch.identifier
        }));
    }
    
    bufferInput(input, type) {
        this.inputBuffer.push({
            input,
            type,
            time: Date.now()
        });
    }
    
    addToComboHistory(input) {
        this.comboHistory.push({
            input,
            time: Date.now()
        });
        
        // Keep only recent history
        const cutoff = Date.now() - this.comboTimeWindow;
        this.comboHistory = this.comboHistory.filter(h => h.time > cutoff);
    }
    
    checkCombo(sequence) {
        if (this.comboHistory.length < sequence.length) return false;
        
        const recent = this.comboHistory.slice(-sequence.length);
        return sequence.every((key, i) => recent[i].input === key);
    }
    
    isGameKey(code) {
        for (const action of Object.values(this.actions)) {
            if (action.keys && action.keys.includes(code)) {
                return true;
            }
        }
        return false;
    }
    
    update() {
        // Update gamepad state
        this.updateGamepads();
        
        // Clean up old buffered inputs
        const cutoff = Date.now() - this.bufferTime;
        this.inputBuffer = this.inputBuffer.filter(input => input.time > cutoff);
        
        // Reset wheel delta
        this.mouse.wheel = 0;
    }
    
    postUpdate() {
        // Store previous frame state for edge detection
        this.prevKeys = { ...this.keys };
        this.mouse.prevLeft = this.mouse.left;
        this.mouse.prevRight = this.mouse.right;
        this.mouse.prevMiddle = this.mouse.middle;
        
        // Clear frame-specific flags
        this.keyPressedThisFrame = {};
        this.keyReleasedThisFrame = {};
    }
    
    updateGamepads() {
        this.gamepads = navigator.getGamepads ? 
            Array.from(navigator.getGamepads()).filter(gp => gp) : [];
    }
    
    isActionDown(action) {
        if (this.locked) return false;
        
        const actionData = this.actions[action];
        if (!actionData) return false;
        
        // Check keyboard
        if (actionData.keys) {
            if (actionData.keys.some(key => this.keys[key])) return true;
        }
        
        // Check mouse
        if (actionData.mouse === 'left' && this.mouse.left) return true;
        if (actionData.mouse === 'right' && this.mouse.right) return true;
        
        // Check gamepad buttons
        if (actionData.gamepad !== undefined) {
            for (const gp of this.gamepads) {
                if (gp.buttons[actionData.gamepad]?.pressed) return true;
            }
        }
        
        // Check gamepad axes
        if (actionData.axis) {
            for (const gp of this.gamepads) {
                const value = gp.axes[actionData.axis.index];
                if (Math.abs(value) > this.gamepadDeadzone) {
                    if (actionData.axis.threshold > 0 && value > actionData.axis.threshold) return true;
                    if (actionData.axis.threshold < 0 && value < actionData.axis.threshold) return true;
                }
            }
        }
        
        return false;
    }
    
    isActionPressed(action) {
        if (this.locked) return false;
        
        const actionData = this.actions[action];
        if (!actionData) return false;
        
        // Check keyboard with proper edge detection
        if (actionData.keys) {
            const pressed = actionData.keys.some(key => 
                this.keys[key] && !this.prevKeys[key]
            );
            if (pressed) return true;
            
            // Check buffer for recent presses
            const buffered = this.inputBuffer.some(input => 
                actionData.keys.includes(input.input) && input.type === 'press'
            );
            if (buffered) return true;
        }
        
        // Check mouse
        if (actionData.mouse === 'left' && this.mouse.left && !this.mouse.prevLeft) return true;
        if (actionData.mouse === 'right' && this.mouse.right && !this.mouse.prevRight) return true;
        
        // Check gamepad buttons (pressed this frame)
        if (actionData.gamepad !== undefined) {
            for (const gp of this.gamepads) {
                if (gp.buttons[actionData.gamepad]?.pressed && 
                    gp.buttons[actionData.gamepad]?.value > 0.5) {
                    return true;
                }
            }
        }
        
        return false;
    }
    
    isActionReleased(action) {
        if (this.locked) return false;
        
        const actionData = this.actions[action];
        if (!actionData) return false;
        
        // Check keyboard
        if (actionData.keys) {
            if (actionData.keys.some(key => !this.keys[key] && this.prevKeys[key])) {
                return true;
            }
        }
        
        // Check mouse
        if (actionData.mouse === 'left' && !this.mouse.left && this.mouse.prevLeft) return true;
        if (actionData.mouse === 'right' && !this.mouse.right && this.mouse.prevRight) return true;
        
        return false;
    }
    
    getAxis(negative, positive) {
        if (this.locked) return 0;
        
        let axis = 0;
        if (this.isActionDown(negative)) axis -= 1;
        if (this.isActionDown(positive)) axis += 1;
        
        // If no keyboard input, check gamepad axes
        if (axis === 0) {
            const negData = this.actions[negative];
            const posData = this.actions[positive];
            
            if (negData?.axis && posData?.axis && negData.axis.index === posData.axis.index) {
                for (const gp of this.gamepads) {
                    const value = gp.axes[negData.axis.index];
                    if (Math.abs(value) > this.gamepadDeadzone) {
                        axis = value;
                        break;
                    }
                }
            }
        }
        
        return axis;
    }
    
    getMousePosition() {
        return { x: this.mouse.x, y: this.mouse.y };
    }
    
    getWorldMousePosition(cameraX, cameraY) {
        return {
            x: this.mouse.x + cameraX,
            y: this.mouse.y + cameraY
        };
    }
    
    lockInput() {
        this.locked = true;
    }
    
    unlockInput() {
        this.locked = false;
    }
    
    vibrate(pattern) {
        // Vibrate gamepads if supported
        for (const gp of this.gamepads) {
            if (gp.vibrationActuator) {
                gp.vibrationActuator.playEffect('dual-rumble', {
                    duration: pattern,
                    strongMagnitude: 1.0,
                    weakMagnitude: 0.5
                });
            }
        }
        
        // Vibrate device if supported
        if (navigator.vibrate) {
            navigator.vibrate(pattern);
        }
    }
}
