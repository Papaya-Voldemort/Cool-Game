/**
 * Narrative Manager - Handles branching storylines and endings
 */

class NarrativeManager {
    constructor() {
        this.decisions = [];
        this.relationships = {
            warrior: 0,
            mage: 0,
            thief: 0,
            mentor: 0,
            villain: 0
        };
        this.flags = {
            savedVillage: false,
            defeatedBoss1: false,
            defeatedBoss2: false,
            defeatedBoss3: false,
            foundSecret: false,
            betrayedAlly: false,
            sparedEnemy: false,
            destroyedArtifact: false
        };
        this.currentDialogue = null;
        this.dialogueQueue = [];
        this.currentChoices = null;
        this.selectedChoiceIndex = 0;
        this.pendingChoice = false;
        this.morality = 0; // -100 (evil) to 100 (good)
        this.combatStyle = { aggressive: 0, defensive: 0, tactical: 0 };
    }
    
    startGame() {
        this.showDialogue({
            speaker: 'Narrator',
            text: 'Long ago, a great darkness fell upon the land. You are the last hope to restore balance. But beware - every choice has consequences...'
        });
    }
    
    showDialogue(dialogue) {
        this.currentDialogue = dialogue;
    }
    
    advanceDialogue() {
        if (this.dialogueQueue.length > 0) {
            this.currentDialogue = this.dialogueQueue.shift();
            return false;
        }
        this.currentDialogue = null;
        return true;
    }
    
    getCurrentDialogue() {
        return this.currentDialogue;
    }
    
    hasPendingChoice() {
        return this.pendingChoice;
    }
    
    presentChoice(choices, context = '') {
        this.currentChoices = choices;
        this.selectedChoiceIndex = 0;
        this.pendingChoice = true;
    }
    
    getCurrentChoices() {
        return this.currentChoices;
    }
    
    getSelectedChoiceIndex() {
        return this.selectedChoiceIndex;
    }
    
    selectNextChoice() {
        if (!this.currentChoices) return;
        this.selectedChoiceIndex = (this.selectedChoiceIndex + 1) % this.currentChoices.length;
    }
    
    selectPreviousChoice() {
        if (!this.currentChoices) return;
        this.selectedChoiceIndex = (this.selectedChoiceIndex - 1 + this.currentChoices.length) % this.currentChoices.length;
    }
    
    makeChoice() {
        if (!this.currentChoices) return;
        
        const choice = this.currentChoices[this.selectedChoiceIndex];
        
        // Record decision
        this.decisions.push({
            choice: choice.id,
            text: choice.text,
            timestamp: Date.now()
        });
        
        // Apply consequences
        if (choice.morality) {
            this.morality += choice.morality;
            this.morality = Utils.clamp(this.morality, -100, 100);
        }
        
        if (choice.relationships) {
            for (const [character, value] of Object.entries(choice.relationships)) {
                this.relationships[character] = (this.relationships[character] || 0) + value;
            }
        }
        
        if (choice.flags) {
            for (const [flag, value] of Object.entries(choice.flags)) {
                this.flags[flag] = value;
            }
        }
        
        // Execute callback if provided
        if (choice.callback) {
            choice.callback();
        }
        
        // Clear current choice
        this.currentChoices = null;
        this.selectedChoiceIndex = 0;
        this.pendingChoice = false;
    }
    
    getDecisionCount() {
        return this.decisions.length;
    }
    
    trackCombatStyle(style) {
        this.combatStyle[style] = (this.combatStyle[style] || 0) + 1;
    }
    
    shouldTriggerEnding() {
        // Check if conditions for ending are met
        const bossesDefeated = this.flags.defeatedBoss1 && this.flags.defeatedBoss2 && this.flags.defeatedBoss3;
        return bossesDefeated || this.decisions.length >= 50;
    }
    
    calculateEnding() {
        // Calculate ending based on decisions, relationships, and flags
        const endingId = this.generateEndingId();
        const ending = this.getEndingInfo(endingId);
        return ending;
    }
    
    generateEndingId() {
        // Generate unique ending ID based on player choices
        // This creates hundreds of possible combinations
        
        let id = '';
        
        // Morality component (3 tiers)
        if (this.morality > 33) id += 'G'; // Good
        else if (this.morality < -33) id += 'E'; // Evil
        else id += 'N'; // Neutral
        
        // Boss completion (8 combinations)
        id += this.flags.defeatedBoss1 ? '1' : '0';
        id += this.flags.defeatedBoss2 ? '1' : '0';
        id += this.flags.defeatedBoss3 ? '1' : '0';
        
        // Key flags (16 combinations)
        id += this.flags.savedVillage ? 'V' : '-';
        id += this.flags.foundSecret ? 'S' : '-';
        id += this.flags.betrayedAlly ? 'B' : '-';
        id += this.flags.sparedEnemy ? 'M' : '-';
        
        // Combat style (3 types)
        const styleKeys = Object.keys(this.combatStyle);
        const dominantStyle = styleKeys.length > 0 
            ? styleKeys.reduce((a, b) => this.combatStyle[a] > this.combatStyle[b] ? a : b, styleKeys[0])
            : 'tactical';
        id += dominantStyle[0].toUpperCase();
        
        // Relationship component (strongest relationship)
        const relKeys = Object.keys(this.relationships);
        const strongestRelationship = relKeys.length > 0
            ? relKeys.reduce((a, b) => this.relationships[a] > this.relationships[b] ? a : b, relKeys[0])
            : 'warrior';
        id += strongestRelationship[0].toUpperCase();
        
        return id;
    }
    
    getEndingInfo(endingId) {
        // Parse ending ID to create description
        const morality = endingId[0];
        const bossPattern = endingId.substring(1, 4);
        const hasSecret = endingId.includes('S');
        const savedVillage = endingId.includes('V');
        const betrayed = endingId.includes('B');
        const merciful = endingId.includes('M');
        
        let title = '';
        let description = '';
        let pathType = '';
        
        // Determine title based on morality
        if (morality === 'G') {
            title = 'The Light Bringer';
            pathType = 'Hero';
        } else if (morality === 'E') {
            title = 'The Dark Conqueror';
            pathType = 'Villain';
        } else {
            title = 'The Gray Wanderer';
            pathType = 'Neutral';
        }
        
        // Build description based on choices
        description = 'Your journey has come to an end. ';
        
        if (bossPattern === '111') {
            description += 'You defeated all the great evils that plagued the land. ';
        } else if (bossPattern === '000') {
            description += 'You walked a different path, avoiding the major conflicts. ';
        } else {
            description += 'You chose your battles carefully. ';
        }
        
        if (savedVillage) {
            description += 'The village you saved remembers your name with gratitude. ';
        }
        
        if (hasSecret) {
            description += 'The ancient secrets you discovered changed everything. ';
        }
        
        if (betrayed) {
            description += 'Your betrayal still weighs heavily on those you left behind. ';
        } else if (merciful) {
            description += 'Your mercy inspired others to seek redemption. ';
        }
        
        // Add morality-specific ending
        if (morality === 'G') {
            description += 'The land flourishes under your protection, and peace reigns once more.';
        } else if (morality === 'E') {
            description += 'You rule with an iron fist, feared by all who once dared oppose you.';
        } else {
            description += 'You fade into legend, neither hero nor villain, but something in between.';
        }
        
        return {
            title,
            description,
            ending_id: endingId,
            decisions: this.decisions.length,
            morality: this.morality,
            path_type: pathType
        };
    }
    
    // Story events and choice generators
    generateStoryEvent(area, context) {
        // Generate contextual story events based on location and game state
        const events = this.getEventsForArea(area);
        return Utils.randomChoice(events);
    }
    
    getEventsForArea(area) {
        const events = {
            forest: [
                {
                    dialogue: { speaker: 'Stranger', text: 'Traveler! Bandits have taken my daughter. Will you help?' },
                    choices: [
                        { id: 'help_stranger', text: 'I will help you.', morality: 10, relationships: { warrior: 5 } },
                        { id: 'demand_payment', text: 'What\'s in it for me?', morality: -5 },
                        { id: 'refuse_help', text: 'That\'s not my problem.', morality: -15 }
                    ]
                },
                {
                    dialogue: { speaker: 'Merchant', text: 'I have a magical artifact, but dark forces seek it. Will you protect it or claim it for yourself?' },
                    choices: [
                        { id: 'protect_artifact', text: 'I will keep it safe.', morality: 15, flags: { destroyedArtifact: false } },
                        { id: 'claim_artifact', text: 'I\'ll take it for myself.', morality: -10 },
                        { id: 'destroy_artifact', text: 'It must be destroyed.', morality: 5, flags: { destroyedArtifact: true } }
                    ]
                }
            ],
            village: [
                {
                    dialogue: { speaker: 'Elder', text: 'A plague threatens our village. The cure lies in the cursed forest. Will you retrieve it?' },
                    choices: [
                        { id: 'get_cure', text: 'I\'ll bring back the cure.', morality: 20, flags: { savedVillage: true } },
                        { id: 'demand_reward', text: 'Only if you pay me well.', morality: -5 },
                        { id: 'leave_village', text: 'I have more important matters.', morality: -20 }
                    ]
                }
            ],
            dungeon: [
                {
                    dialogue: { speaker: 'Captured Thief', text: 'Please, help me escape! I know secrets that could aid you.' },
                    choices: [
                        { id: 'free_thief', text: 'I\'ll help you escape.', relationships: { thief: 20 } },
                        { id: 'interrogate', text: 'Tell me the secrets first.', morality: -5 },
                        { id: 'leave_imprisoned', text: 'You deserve to be here.', morality: -10 }
                    ]
                }
            ],
            boss_room: [
                {
                    dialogue: { speaker: 'Boss', text: 'You\'ve come far, but your journey ends here. Join me and we can rule together!' },
                    choices: [
                        { id: 'refuse_boss', text: 'Never! I will stop you!', morality: 15 },
                        { id: 'consider_offer', text: 'Tell me more about your offer.', morality: -5 },
                        { id: 'betray_for_power', text: 'I accept your offer.', morality: -30, flags: { betrayedAlly: true } }
                    ]
                }
            ]
        };
        
        return events[area] || events.forest;
    }
}
