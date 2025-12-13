# 2D Action-Adventure Game

A fully playable 2D single-player action-adventure game with branching narratives, combat, and exploration built with HTML5, CSS, and JavaScript.

## Features

- **Rich Storytelling**: Branching narrative with hundreds of possible endings
- **Dynamic Combat**: Combo system, counters, and tactical positioning
- **Fluid Movement**: Jump, dodge, climb, and interact with the environment
- **Adaptive AI**: Bosses and enemies that respond to player behavior
- **Multiple Endings**: Player choices affect relationships, environments, and story outcomes

## Installation

No installation required! Just open `index.html` in a modern web browser.

## How to Play

Simply open `index.html` in your web browser:
- Double-click the file, or
- Run a local server:
  ```bash
  python -m http.server 8000
  # or
  npx http-server
  ```
  Then visit `http://localhost:8000`

### Controls

- **Arrow Keys / WASD**: Move player
- **SPACE**: Jump
- **SHIFT**: Dodge/Dash
- **Z / J**: Basic Attack
- **X / K**: Special Attack
- **C / L**: Interact / Use Item
- **E**: Talk to NPCs / Make choices
- **ESC**: Pause menu
- **1-4**: Quick inventory slots

### Gameplay

Navigate through the world, make choices that affect the story, fight enemies and bosses, and discover one of hundreds of possible endings based on your decisions.

## Game Structure

- `index.html` - Main HTML page
- `css/` - Stylesheets for UI and layout
- `js/` - JavaScript game logic
  - `game.js` - Main game engine
  - `player.js` - Player character implementation
  - `combat.js` - Combat system and mechanics
  - `enemies.js` - Enemy and boss AI
  - `narrative.js` - Branching narrative system
  - `world.js` - Game world, levels, and environments
- `assets/` - Placeholder sprites and resources

## Placeholder Assets

The game uses simple colored rectangles and basic shapes as placeholders. Replace these with custom sprites by:

1. Place sprite images in `assets/sprites/`
2. Update the asset paths in respective character/enemy classes
3. Ensure sprites follow the naming convention: `[entity]_[animation].png`

## Branching System

The game tracks player decisions through:
- Dialogue choices
- Combat approach (aggressive, defensive, stealthy)
- Environmental interactions
- Quest completion methods
- Character relationships

These choices are weighted and combined to determine which of the hundreds of endings the player receives.

## Development

To extend the game:
- Add new enemies in `js/enemies.js`
- Add new bosses in `js/bosses.js`
- Add story branches in `js/narrative.js`
- Add new areas in `js/world.js`

## Browser Compatibility

Tested on:
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+
