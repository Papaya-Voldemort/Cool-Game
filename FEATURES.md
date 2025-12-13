# Game Features Documentation

## Complete Feature List

### 1. Player Movement System
- **Basic Movement**: WASD/Arrow keys for horizontal movement
- **Jumping**: Space bar with double-jump capability
- **Dodging**: Shift key for quick dash with invulnerability frames
- **Climbing**: Interact with climbable walls using up/down movement
- **Wall Jumping**: Jump off walls for advanced platforming
- **Physics**: Realistic gravity, friction, and momentum

### 2. Combat System
- **Basic Attack**: Z/J key for standard attacks
- **Special Attack**: X/K key for powerful strikes (2x damage)
- **Combo System**: Chain attacks within time window for increased damage
- **Hit Detection**: Precise collision-based combat
- **Knockback**: Enemies react to hits with knockback physics
- **Invulnerability Frames**: Post-hit immunity period
- **Visual Feedback**: Attack animations and hit effects

### 3. Enemy AI System
- **Multiple Enemy Types**: 
  - Basic enemies (30 HP, fast)
  - Strong enemies (50 HP, powerful)
- **AI States**:
  - Patrol: Autonomous movement when player not detected
  - Chase: Pursuit when player in range
  - Attack: Engage when in attack range
- **Adaptive Behavior**:
  - Aggressive: Direct assault
  - Tactical: Flanking and distance management
  - Defensive: Cautious approach
- **Detection Range**: 200 units
- **Attack Patterns**: Varied based on player behavior

### 4. Boss Fight System
- **Multi-Phase Combat**: 3 distinct phases per boss
- **Boss Types**:
  - Warrior: Charge, spin attack, ground slam
  - Mage: Fireball, teleport, summon minions
  - Shadow: Dash strike, clone, poison field
- **Adaptive AI**: Learns from player actions
  - Tracks player aggression
  - Adjusts strategy based on player defense
- **Telegraphed Attacks**: Visual cues for incoming attacks
- **Phase Transitions**: Special effects and temporary invulnerability
- **Unique Abilities**: Each boss has 3 special moves
- **High HP**: 200 HP with visual HP bar and phase indicators

### 5. Branching Narrative System
- **Decision Tracking**: Records every player choice
- **Morality System**: Range from -100 (evil) to +100 (good)
- **Relationship System**: Track standing with 5 characters:
  - Warrior
  - Mage
  - Thief
  - Mentor
  - Villain
- **Flags System**: 8+ boolean story flags
- **Dynamic Events**: Context-sensitive story encounters
- **Multiple Story Arcs**: Different content per area

### 6. Endings System
- **Hundreds of Endings**: Combinatorial system generates unique endings
- **Ending ID Formula**: 
  - Morality tier (3 options)
  - Boss completion pattern (8 combinations)
  - Key story flags (16 combinations)
  - Combat style (3 options)
  - Dominant relationship (5 options)
  - = 3 × 8 × 16 × 3 × 5 = **5,760 possible unique endings**
- **Personalized Descriptions**: Dynamic text based on choices
- **Statistics Display**: Shows decisions, morality, ending ID

### 7. World & Level Design
- **Multiple Areas**:
  - Darkwood Forest: Starting area with basic enemies
  - Haven Village: Safe zone with NPCs
  - Ancient Dungeon: Complex platforming and strong enemies
  - Boss Arena: Open combat space with boss encounters
- **Interactive Elements**:
  - NPCs with dialogue
  - Portals for area transitions
  - Climbable walls
  - Platforms for verticality
- **Environmental Diversity**: Different themes, colors, and layouts
- **Dynamic Background**: Area-specific colors

### 8. Dialogue & Choice System
- **Dialogue Box**: Clean UI for NPC conversations
- **Choice Menu**: Multiple-choice decisions
- **Keyboard Navigation**: Arrow keys + Enter to select
- **Speaker Names**: Clear attribution
- **Text Wrapping**: Automatic line breaks
- **Consequences Display**: Immediate feedback on choices

### 9. UI/UX Features
- **Main Menu**: Title screen with controls
- **HUD Elements**:
  - HP bar with visual fill
  - Current area display
  - Decision counter
- **Pause Menu**: ESC to pause/resume
- **Game Over Screen**: Death handling with restart
- **Ending Screen**: Comprehensive ending display
- **Responsive Design**: Scales to different screen sizes
- **Visual Clarity**: High contrast, readable fonts

### 10. Technical Features
- **HTML5 Canvas**: 2D rendering
- **60 FPS Target**: Smooth gameplay
- **Delta Time**: Frame-independent physics
- **State Management**: Clean state machine
- **Modular Architecture**: Separated concerns
- **No External Dependencies**: Pure vanilla JavaScript
- **Browser Compatible**: Works in modern browsers

## Gameplay Flow

1. **Start** → Main Menu
2. **Start Game** → Opening Dialogue
3. **Exploration** → Movement, platforming, discovering areas
4. **Combat** → Fight enemies and bosses
5. **Choices** → Make decisions that affect story
6. **Progression** → Unlock new areas, defeat bosses
7. **Ending** → Reach conclusion based on choices
8. **Statistics** → View personalized ending and stats

## Story Branches Examples

### Forest Events
- Help stranger with bandits (moral +10)
- Protect or claim magical artifact (varies)
- Demand payment vs altruism

### Village Events
- Retrieve plague cure (moral +20, save village flag)
- Negotiate rewards vs help freely
- Interact with multiple NPCs

### Dungeon Events
- Free captured thief (relationship +20)
- Interrogate for secrets (moral -5)
- Leave imprisoned (moral -10)

### Boss Room Events
- Refuse boss alliance (moral +15)
- Consider offer (moral -5)
- Accept betrayal (moral -30, betrayal flag)

## Combat Mechanics Details

### Player Stats
- Max HP: 100
- Base Damage: 10
- Special Damage: 20
- Speed: 5 units/frame
- Dash Speed: 12 units/frame
- Jump Power: -15 velocity

### Timing Windows
- Attack Cooldown: 300ms
- Combo Window: 500ms
- Dodge Cooldown: 800ms
- Invulnerability: 500ms

### Enemy Behaviors
- Detection Range: 200 units
- Attack Range: 50 units
- Patrol Distance: 100 units
- Adaptation Interval: 5 seconds

### Boss Mechanics
- Phase 1: 100-67% HP (basic patterns)
- Phase 2: 66-34% HP (aggressive, faster)
- Phase 3: 33-0% HP (desperate, all abilities)
- Special Ability Cooldown: 5 seconds

## Replayability Features

1. **Multiple Endings**: 5,760 unique combinations
2. **Different Combat Styles**: Affects ending and AI behavior
3. **Varied Boss Encounters**: Random boss types
4. **Story Variations**: Different dialogue per area
5. **Moral Alignment**: Good/Evil/Neutral paths
6. **Relationship Focus**: Ally with different characters
7. **Speedrun Potential**: Skip optional content
8. **Exploration Rewards**: Hidden secrets and lore

## Future Enhancement Possibilities

- Custom sprite assets
- Sound effects and music
- Save/load system
- Achievements
- Additional areas
- More boss types
- Skill upgrades
- Equipment system
- Multiplayer elements
