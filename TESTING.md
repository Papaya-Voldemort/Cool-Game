# Game Testing Checklist

## Manual Testing Guide

### Setup
1. Open `index.html` in a modern web browser
2. Ensure browser console is open (F12) to check for errors
3. Verify screen resolution is at least 1280x720

## Core Systems Testing

### ✓ Menu System
- [ ] Game loads to main menu
- [ ] Title displays correctly
- [ ] Controls information is visible
- [ ] "Start Game" button is clickable
- [ ] Button hover effects work

### ✓ Player Movement
- [ ] Arrow keys move player left/right
- [ ] WASD keys move player left/right
- [ ] Space bar makes player jump
- [ ] Double jump works (jump again in air)
- [ ] Player can wall jump on climbable surfaces
- [ ] Shift key activates dodge/dash
- [ ] Dodge has cooldown period
- [ ] Player has invulnerability during dodge

### ✓ Player Combat
- [ ] Z/J keys trigger basic attack
- [ ] X/K keys trigger special attack
- [ ] Attacks have visual feedback (yellow rectangle)
- [ ] Attack cooldown works
- [ ] Combo counter increments on successive attacks
- [ ] Combo resets after timeout
- [ ] Hit detection works on enemies

### ✓ Physics & Collision
- [ ] Player falls with gravity
- [ ] Player stops on platforms
- [ ] Player can't pass through walls
- [ ] Climbing walls function correctly
- [ ] Player stays within world bounds
- [ ] Jumping feels responsive
- [ ] Momentum and friction work

### ✓ Enemy AI - Basic Enemies
- [ ] Enemies patrol when player not nearby
- [ ] Enemies detect player within range
- [ ] Enemies chase player
- [ ] Enemies attack when in range
- [ ] Enemy attacks deal damage to player
- [ ] Enemies take damage from player attacks
- [ ] Enemies die when HP reaches zero
- [ ] Enemy HP bars display correctly
- [ ] Knockback works on hit

### ✓ Enemy AI - Adaptive Behavior
- [ ] Enemies change tactics based on player behavior
- [ ] Aggressive behavior when player is comboing
- [ ] Defensive behavior when player dodges
- [ ] Tactical behavior in normal situations
- [ ] Different enemy types have different stats

### ✓ Boss Fights
- [ ] Boss spawns in boss room area
- [ ] Boss has crown indicator
- [ ] Boss HP bar displays
- [ ] Boss phase indicators show (3 dots)
- [ ] Phase 1: Basic attacks and patterns
- [ ] Phase 2: Faster, more aggressive (< 66% HP)
- [ ] Phase 3: Desperate, uses all abilities (< 33% HP)
- [ ] Phase transitions have visual effects
- [ ] Boss is invulnerable during phase transition
- [ ] Boss uses special abilities
- [ ] Boss adapts to player behavior
- [ ] Boss takes damage from player attacks
- [ ] Boss dies when HP reaches zero

### ✓ Boss Special Abilities
**Warrior Boss:**
- [ ] Charge attack
- [ ] Spin attack
- [ ] Ground slam

**Mage Boss:**
- [ ] Fireball
- [ ] Teleport
- [ ] Summon minions (animation)

**Shadow Boss:**
- [ ] Dash strike
- [ ] Clone (teleport effect)
- [ ] Poison field

### ✓ Narrative System
- [ ] Opening dialogue displays on game start
- [ ] Dialogue box appears correctly
- [ ] Speaker name shows
- [ ] Dialogue text wraps properly
- [ ] Press E to advance dialogue
- [ ] Dialogue closes and returns to gameplay

### ✓ Choice System
- [ ] Choice menu appears when triggered
- [ ] Multiple choices display
- [ ] Arrow keys navigate choices
- [ ] Selected choice highlights (green)
- [ ] Press E to confirm choice
- [ ] Decision counter increments
- [ ] Choices affect morality
- [ ] Choices affect relationships
- [ ] Choices set story flags

### ✓ World & Areas
**Forest Area:**
- [ ] Starting area loads
- [ ] Ground platform present
- [ ] Multiple platforms at different heights
- [ ] Climbable wall present
- [ ] Basic and strong enemies spawn
- [ ] NPC (Mysterious Stranger) present
- [ ] Portal to village present

**Village Area:**
- [ ] Village loads with different background color
- [ ] Building platforms present
- [ ] Multiple NPCs present (Elder, Merchant, Warrior)
- [ ] Fewer enemies than forest
- [ ] Portal to dungeon present

**Dungeon Area:**
- [ ] Dungeon has complex platforming
- [ ] Multiple climbable walls
- [ ] Many strong enemies
- [ ] Darker background color
- [ ] Portal to boss room present

**Boss Room:**
- [ ] Large arena space
- [ ] Tactical platforms
- [ ] Boss spawns
- [ ] Different boss type each time (random)

### ✓ HUD Display
- [ ] HP bar shows in top-left
- [ ] HP bar fill represents current HP
- [ ] HP text shows current/max HP
- [ ] HP updates when taking damage
- [ ] HP updates when healing
- [ ] Current area name displays
- [ ] Decision counter shows
- [ ] Counter updates on choices

### ✓ Pause System
- [ ] ESC key pauses game
- [ ] Pause overlay appears
- [ ] Game freezes during pause
- [ ] ESC key resumes game
- [ ] Pause overlay disappears

### ✓ Game Over
- [ ] Game over triggers when HP reaches 0
- [ ] Game over screen displays
- [ ] "Press E to Restart" shows
- [ ] E key restarts game
- [ ] Game resets to menu

### ✓ Endings System
- [ ] Ending triggers after boss defeats
- [ ] Ending triggers after 50+ decisions
- [ ] Ending screen displays
- [ ] Ending title shows
- [ ] Ending description shows
- [ ] Ending statistics display:
  - [ ] Decisions made
  - [ ] Ending ID
  - [ ] Path type (Hero/Villain/Neutral)
  - [ ] Morality score
- [ ] Different endings for different playthroughs
- [ ] Ending ID changes based on choices

### ✓ Camera System
- [ ] Camera follows player
- [ ] Camera centers on player
- [ ] Camera doesn't show beyond world bounds
- [ ] Camera moves smoothly

### ✓ Visual Feedback
- [ ] Player flashes when invulnerable
- [ ] Attack animations show
- [ ] Hit effects display (orange circles)
- [ ] Boss phase transition effects
- [ ] Enemy state indicators (P/C/A letters)
- [ ] NPC name labels show
- [ ] Portal glow effects

## Branching Narrative Testing

### Test Different Playstyles
1. **Hero Path:**
   - [ ] Make all "good" choices
   - [ ] Help NPCs
   - [ ] Spare enemies
   - [ ] Result: Good ending with positive morality

2. **Villain Path:**
   - [ ] Make all "evil" choices
   - [ ] Demand payment
   - [ ] Betray allies
   - [ ] Result: Evil ending with negative morality

3. **Neutral Path:**
   - [ ] Mix good and bad choices
   - [ ] Result: Neutral ending

4. **Combat Style Tracking:**
   - [ ] Aggressive (lots of combos)
   - [ ] Defensive (lots of dodging)
   - [ ] Tactical (mixed approach)
   - [ ] Result: Ending reflects combat style

### Test Ending Variations
- [ ] Complete with all 3 bosses defeated
- [ ] Complete with 0 bosses defeated
- [ ] Complete with 1-2 bosses defeated
- [ ] Different endings for different boss patterns

## Performance Testing

- [ ] Game runs at 60 FPS
- [ ] No lag during combat
- [ ] No lag with multiple enemies
- [ ] Smooth animations
- [ ] No memory leaks (check in long sessions)
- [ ] Browser console shows no errors

## Browser Compatibility

Test in:
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)

## Integration Testing

- [ ] All JavaScript files load
- [ ] CSS file loads
- [ ] No 404 errors in console
- [ ] No JavaScript errors in console
- [ ] Canvas renders correctly
- [ ] UI elements display correctly

## Edge Cases

- [ ] Player at world boundaries
- [ ] Multiple enemies attacking simultaneously
- [ ] Rapid key presses
- [ ] Spam attack button
- [ ] Spam dodge button
- [ ] Kill boss during phase transition
- [ ] Make choice while taking damage
- [ ] Pause during dialogue
- [ ] Multiple platforms overlapping
- [ ] Player stuck between platforms

## Known Limitations (By Design)

These are placeholder features that can be enhanced:
- Graphics are colored rectangles (not sprites)
- No sound effects or music
- No save/load system
- No persistent progress
- Limited number of NPCs
- No inventory system
- No equipment/upgrades

## Success Criteria

**Core Gameplay:**
✓ Player can move, jump, and attack
✓ Enemies have functional AI
✓ Bosses have multi-phase fights
✓ Combat feels responsive

**Narrative:**
✓ Dialogue system works
✓ Choices affect story
✓ Multiple endings exist
✓ Decision tracking works

**Technical:**
✓ Game runs smoothly
✓ No critical bugs
✓ All files load correctly
✓ Controls are responsive

**Branching:**
✓ Choices have consequences
✓ Endings vary based on decisions
✓ System supports hundreds of endings
✓ Ending ID generation works

## Bug Reporting Template

If you find a bug, report it with:
```
**Bug Title:** Brief description

**Steps to Reproduce:**
1. Step one
2. Step two
3. etc.

**Expected Behavior:**
What should happen

**Actual Behavior:**
What actually happens

**Browser:** Chrome/Firefox/Safari/Edge
**Console Errors:** Any error messages
**Screenshot:** If visual bug
```

## Performance Benchmarks

Expected performance:
- FPS: 55-60 (stable)
- Input Lag: < 50ms
- Load Time: < 2 seconds
- Memory Usage: < 100MB

## Test Results Summary

Date: __________
Tester: __________

Total Tests: ___ / ___
Passed: ___
Failed: ___
Skipped: ___

Critical Issues: ___
Major Issues: ___
Minor Issues: ___

Overall Status: ☐ Pass ☐ Fail ☐ Conditional Pass

Notes:
_________________________________
_________________________________
_________________________________
