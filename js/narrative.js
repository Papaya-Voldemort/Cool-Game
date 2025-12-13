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
            destroyedArtifact: false,
            protectedArtifact: false,
            knowsFuture: false,
            chosenHero: false,
            chosenDestroyer: false,
            freedBeast: false,
            joinedCult: false,
            embracedDarkness: false,
            rejectedDarkness: false,
            corruptedByVoid: false,
            soldSoul: false,
            changedTimeline: false
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
                    dialogue: { speaker: 'Desperate Father', text: 'Traveler! Bandits have taken my daughter into the depths of the forest. Will you help me rescue her?' },
                    choices: [
                        { id: 'help_father', text: 'I will help you rescue her.', morality: 10, relationships: { warrior: 5 } },
                        { id: 'demand_payment', text: 'What\'s in it for me?', morality: -5 },
                        { id: 'refuse_help', text: 'That\'s not my problem.', morality: -15 }
                    ]
                },
                {
                    dialogue: { speaker: 'Ancient Merchant', text: 'I possess a powerful artifact that keeps the forest\'s darkness at bay. Dark forces seek to steal it. Will you protect it or claim it for yourself?' },
                    choices: [
                        { id: 'protect_artifact', text: 'I will keep it safe from evil.', morality: 15, flags: { protectedArtifact: true } },
                        { id: 'claim_artifact', text: 'I\'ll take it for myself. Power is needed to win.', morality: -10 },
                        { id: 'destroy_artifact', text: 'Such power should not exist. I will destroy it.', morality: 5, flags: { destroyedArtifact: true } }
                    ]
                },
                {
                    dialogue: { speaker: 'Wounded Hunter', text: 'A massive beast has been terrorizing the forest. I tried to hunt it but failed. Will you succeed where I couldn\'t?' },
                    choices: [
                        { id: 'hunt_beast', text: 'I\'ll track and defeat the beast.', morality: 8, relationships: { warrior: 8 } },
                        { id: 'capture_beast', text: 'Perhaps the beast can be tamed instead.', morality: 12, relationships: { mage: 5 } },
                        { id: 'leave_beast', text: 'Maybe the beast has a right to this forest.', morality: 5 }
                    ]
                },
                {
                    dialogue: { speaker: 'Spirit of the Woods', text: 'The balance of nature is disrupted. The ancient trees weep. Will you help restore harmony?' },
                    choices: [
                        { id: 'restore_nature', text: 'I will find the source of corruption.', morality: 15, relationships: { mage: 10 } },
                        { id: 'exploit_nature', text: 'I could use this disruption to my advantage.', morality: -20 },
                        { id: 'ignore_nature', text: 'Nature will sort itself out.', morality: -8 }
                    ]
                },
                {
                    dialogue: { speaker: 'Lost Child', text: 'I\'m lost and scared. Strange creatures follow me. Can you help me find my way home?' },
                    choices: [
                        { id: 'guide_child', text: 'Take my hand, I\'ll protect you.', morality: 18, relationships: { warrior: 5 } },
                        { id: 'scare_creatures', text: 'I\'ll scare off the creatures first.', morality: 10 },
                        { id: 'use_child_bait', text: 'The child could lure the creatures into a trap...', morality: -25 }
                    ]
                },
                {
                    dialogue: { speaker: 'Hermit Sage', text: 'I have observed your journey. You carry a great burden. Three paths lie before you - which will you choose?' },
                    choices: [
                        { id: 'path_light', text: 'The path of light and righteousness.', morality: 10, relationships: { mentor: 8 } },
                        { id: 'path_shadow', text: 'The path of shadows and cunning.', morality: -8, relationships: { thief: 10 } },
                        { id: 'path_balance', text: 'The path of balance between extremes.', morality: 0, relationships: { mage: 8 } }
                    ]
                },
                {
                    dialogue: { speaker: 'Bandit Leader', text: 'You\'re skilled. Join us and we\'ll share the spoils of the rich merchants. Or stand against us and face our blades.' },
                    choices: [
                        { id: 'join_bandits', text: 'The system is corrupt. I\'ll join you.', morality: -20, relationships: { thief: 15 } },
                        { id: 'fight_bandits', text: 'I stand for justice, not theft!', morality: 15, relationships: { warrior: 10 } },
                        { id: 'negotiate_bandits', text: 'Perhaps there\'s a middle ground...', morality: -5 }
                    ]
                },
                {
                    dialogue: { speaker: 'Talking Fox', text: 'Clever one, I sense you seek knowledge. I know a secret passage through the mountains, but secrets have prices.' },
                    choices: [
                        { id: 'pay_fox', text: 'Name your price for the knowledge.', morality: 0, relationships: { thief: 5 } },
                        { id: 'befriend_fox', text: 'Share with me, friend, and I\'ll owe you.', morality: 5 },
                        { id: 'threaten_fox', text: 'Tell me or face consequences.', morality: -15 }
                    ]
                },
                {
                    dialogue: { speaker: 'Cursed Knight', text: 'I was once noble... now bound by dark magic to guard this cursed place. End my suffering or break my curse.' },
                    choices: [
                        { id: 'end_suffering', text: 'I will grant you peace through combat.', morality: 8, relationships: { warrior: 8 } },
                        { id: 'break_curse', text: 'I will find a way to break your curse.', morality: 15, relationships: { mage: 12 } },
                        { id: 'exploit_curse', text: 'A cursed warrior could be useful...', morality: -18 }
                    ]
                },
                {
                    dialogue: { speaker: 'Forest Witch', text: 'Your destiny is shrouded in mist. I can reveal your future, but knowledge of fate comes with a terrible burden.' },
                    choices: [
                        { id: 'see_future', text: 'Show me my destiny, whatever it may be.', morality: 0, flags: { knowsFuture: true } },
                        { id: 'reject_future', text: 'I will forge my own path, unknown.', morality: 5 },
                        { id: 'demand_power', text: 'Give me power to change my fate.', morality: -10 }
                    ]
                }
            ],
            village: [
                {
                    dialogue: { speaker: 'Village Elder', text: 'A terrible plague threatens our village. The cure lies deep in the cursed forest. Will you brave the darkness to save us?' },
                    choices: [
                        { id: 'get_cure', text: 'I\'ll bring back the cure, I swear it.', morality: 20, flags: { savedVillage: true } },
                        { id: 'demand_reward', text: 'My services don\'t come free.', morality: -5 },
                        { id: 'leave_village', text: 'I have more important matters.', morality: -20 }
                    ]
                },
                {
                    dialogue: { speaker: 'Blacksmith', text: 'I can forge you a legendary weapon, but I need rare materials from the mountain peak. Fetch them for me?' },
                    choices: [
                        { id: 'get_materials', text: 'I\'ll retrieve the materials.', morality: 5, relationships: { warrior: 10 } },
                        { id: 'steal_weapon', text: 'Why not just take an existing weapon...', morality: -15, relationships: { thief: 8 } },
                        { id: 'refuse_quest', text: 'My current equipment is sufficient.', morality: 0 }
                    ]
                },
                {
                    dialogue: { speaker: 'Innkeeper', text: 'Strange travelers arrived last night, asking about you. They didn\'t look friendly. Should I tell you where they went?' },
                    choices: [
                        { id: 'confront_travelers', text: 'Tell me. I\'ll face them head on.', morality: 5, relationships: { warrior: 5 } },
                        { id: 'ambush_travelers', text: 'Show me. I prefer the element of surprise.', morality: -8, relationships: { thief: 8 } },
                        { id: 'avoid_travelers', text: 'Perhaps it\'s best to leave quietly.', morality: -5 }
                    ]
                },
                {
                    dialogue: { speaker: 'Young Mage', text: 'I\'m studying forbidden magic. The elders forbid it, but it could save lives. Will you help me gather components?' },
                    choices: [
                        { id: 'help_mage', text: 'Knowledge should not be forbidden. I\'ll help.', morality: -10, relationships: { mage: 15 } },
                        { id: 'report_mage', text: 'This is dangerous. I must tell the elders.', morality: 10, relationships: { mentor: 8 } },
                        { id: 'manipulate_mage', text: 'I\'ll help, but I want access to that power.', morality: -18 }
                    ]
                },
                {
                    dialogue: { speaker: 'Merchant Guild Leader', text: 'Bandits raid our caravans weekly. Lead an expedition to clear them out and I\'ll make you wealthy beyond dreams.' },
                    choices: [
                        { id: 'clear_bandits', text: 'Justice and wealth? I accept.', morality: 8, relationships: { warrior: 8 } },
                        { id: 'side_bandits', text: 'Perhaps the bandits have the right idea...', morality: -15, relationships: { thief: 12 } },
                        { id: 'negotiate_peace', text: 'Violence isn\'t the only solution.', morality: 12 }
                    ]
                },
                {
                    dialogue: { speaker: 'Orphan Girl', text: 'My brother joined a cult in the mountains. They say he\'s different now. Will you bring him back to me?' },
                    choices: [
                        { id: 'rescue_brother', text: 'I\'ll bring your brother home.', morality: 15, relationships: { warrior: 5 } },
                        { id: 'join_cult', text: 'Maybe this cult has answers I seek.', morality: -15 },
                        { id: 'abandon_mission', text: 'Cults are dangerous. He made his choice.', morality: -12 }
                    ]
                },
                {
                    dialogue: { speaker: 'Town Guard Captain', text: 'A serial killer stalks our streets at night. We need someone skilled to track them down. Are you up to the task?' },
                    choices: [
                        { id: 'hunt_killer', text: 'I\'ll find them and bring them to justice.', morality: 18, relationships: { warrior: 10 } },
                        { id: 'trap_killer', text: 'I\'ll set a trap using myself as bait.', morality: 12, relationships: { thief: 8 } },
                        { id: 'frame_someone', text: 'Perhaps pin it on an enemy instead...', morality: -25 }
                    ]
                },
                {
                    dialogue: { speaker: 'Mysterious Woman', text: 'The prophecy speaks of a hero... or a destroyer. You match the description. Which will you become?' },
                    choices: [
                        { id: 'become_hero', text: 'I will be the hero this land needs.', morality: 15, flags: { chosenHero: true } },
                        { id: 'become_destroyer', text: 'This world needs to be torn down and rebuilt.', morality: -20, flags: { chosenDestroyer: true } },
                        { id: 'reject_prophecy', text: 'I am neither. I make my own destiny.', morality: 5 }
                    ]
                },
                {
                    dialogue: { speaker: 'Traveling Bard', text: 'I collect tales of great adventures. Your story could inspire generations. Share your journey with me?' },
                    choices: [
                        { id: 'share_truth', text: 'I\'ll tell you everything, the truth unvarnished.', morality: 8 },
                        { id: 'embellish_story', text: 'Let me make it more... dramatic.', morality: -3 },
                        { id: 'demand_payment', text: 'My story is valuable. Pay me.', morality: -8 }
                    ]
                },
                {
                    dialogue: { speaker: 'Old Veteran', text: 'War is coming. I can see it in the stars. We need warriors ready to fight. Will you train under me?' },
                    choices: [
                        { id: 'train_warrior', text: 'Teach me your ways of combat.', morality: 5, relationships: { warrior: 15 } },
                        { id: 'refuse_training', text: 'I fight my own way.', morality: 0 },
                        { id: 'seek_peace', text: 'War can be prevented through diplomacy.', morality: 12 }
                    ]
                }
            ],
            dungeon: [
                {
                    dialogue: { speaker: 'Imprisoned Thief', text: 'Please, help me escape! I know secrets of the dungeon that could aid your quest. Just get me out!' },
                    choices: [
                        { id: 'free_thief', text: 'I\'ll help you escape.', morality: 0, relationships: { thief: 20 } },
                        { id: 'interrogate', text: 'Tell me the secrets first.', morality: -5 },
                        { id: 'leave_imprisoned', text: 'You deserve to be here.', morality: -10 }
                    ]
                },
                {
                    dialogue: { speaker: 'Ancient Guardian', text: 'Only the worthy may pass. Prove your worth through trial by combat, trial by wit, or trial by sacrifice.' },
                    choices: [
                        { id: 'trial_combat', text: 'I choose trial by combat!', morality: 3, relationships: { warrior: 8 } },
                        { id: 'trial_wit', text: 'Test my mind with your riddles.', morality: 5, relationships: { mage: 10 } },
                        { id: 'trial_sacrifice', text: 'I will make the sacrifice required.', morality: 10 }
                    ]
                },
                {
                    dialogue: { speaker: 'Ghost of the Fallen', text: 'I died in these halls seeking treasure. My family still waits for my return. Will you deliver my final message?' },
                    choices: [
                        { id: 'deliver_message', text: 'I will tell them of your fate.', morality: 15 },
                        { id: 'take_treasure', text: 'First, tell me where you hid the treasure.', morality: -12 },
                        { id: 'ignore_ghost', text: 'The dead should stay silent.', morality: -8 }
                    ]
                },
                {
                    dialogue: { speaker: 'Chained Beast', text: '*The creature looks at you with intelligent eyes* Help... me... please...' },
                    choices: [
                        { id: 'free_beast', text: 'No creature deserves this torture.', morality: 12, flags: { freedBeast: true } },
                        { id: 'kill_beast', text: 'I\'ll end your suffering permanently.', morality: 3 },
                        { id: 'control_beast', text: 'Perhaps I can control this beast for my own use.', morality: -15 }
                    ]
                },
                {
                    dialogue: { speaker: 'Cult Leader', text: 'The old gods are returning. Join us in preparation, or be swept away when they arrive. Choose wisely.' },
                    choices: [
                        { id: 'join_cult', text: 'I will serve the old gods.', morality: -18, flags: { joinedCult: true } },
                        { id: 'fight_cult', text: 'Your gods are dead. Stay that way.', morality: 15, relationships: { warrior: 10 } },
                        { id: 'spy_cult', text: 'I\'ll join... to learn your secrets.', morality: -8, relationships: { thief: 12 } }
                    ]
                },
                {
                    dialogue: { speaker: 'Tortured Scholar', text: 'They tried to break me for knowledge of the ancient library. I never told them... but I\'ll tell you, if you help me.' },
                    choices: [
                        { id: 'rescue_scholar', text: 'I\'ll get you to safety first.', morality: 15, relationships: { mage: 10 } },
                        { id: 'demand_info', text: 'Tell me now or I leave you here.', morality: -15 },
                        { id: 'bargain_scholar', text: 'Half the knowledge now, half after escape.', morality: -5, relationships: { thief: 5 } }
                    ]
                },
                {
                    dialogue: { speaker: 'Dark Reflection', text: '*A mirror shows your darkest self* This is what you could become. Embrace it or reject it.' },
                    choices: [
                        { id: 'embrace_darkness', text: 'Power requires sacrifice of conscience.', morality: -20, flags: { embracedDarkness: true } },
                        { id: 'reject_darkness', text: 'I refuse to become that monster.', morality: 20, flags: { rejectedDarkness: true } },
                        { id: 'acknowledge_darkness', text: 'I acknowledge this darkness, but won\'t let it control me.', morality: 5 }
                    ]
                },
                {
                    dialogue: { speaker: 'Imprisoned Knight', text: 'I was betrayed by my order. They feared my power. Help me escape and I\'ll serve you loyally.' },
                    choices: [
                        { id: 'free_knight', text: 'A powerful ally is worth the risk.', morality: -8, relationships: { warrior: 15 } },
                        { id: 'question_knight', text: 'Why should I trust someone who was imprisoned?', morality: 8 },
                        { id: 'report_knight', text: 'If your order imprisoned you, they had reason.', morality: 12 }
                    ]
                },
                {
                    dialogue: { speaker: 'Living Statue', text: 'Centuries I have stood here. I tire of this eternal vigil. Would you take my place, or find a way to free me?' },
                    choices: [
                        { id: 'free_statue', text: 'I\'ll find a way to break your curse.', morality: 15, relationships: { mage: 12 } },
                        { id: 'take_place', text: 'I will take your burden upon myself.', morality: 25 },
                        { id: 'destroy_statue', text: 'Eternal rest through destruction.', morality: -8 }
                    ]
                },
                {
                    dialogue: { speaker: 'Whispering Darkness', text: 'Join ussss... Power beyond imagining awaitssss... Just open your heart to the void...' },
                    choices: [
                        { id: 'resist_darkness', text: 'I resist your corruption!', morality: 15 },
                        { id: 'bargain_darkness', text: 'What do you offer in exchange?', morality: -12 },
                        { id: 'accept_darkness', text: 'Yes... I accept your power.', morality: -30, flags: { corruptedByVoid: true } }
                    ]
                }
            ],
            boss_room: [
                {
                    dialogue: { speaker: 'Dark Lord', text: 'You\'ve come far, hero. But your journey ends here. Join me and we can rule this world together, or die defying me!' },
                    choices: [
                        { id: 'refuse_boss', text: 'Never! I will stop you here and now!', morality: 15 },
                        { id: 'consider_offer', text: 'Tell me more about your vision...', morality: -5 },
                        { id: 'betray_for_power', text: 'I accept. Together we\'ll be unstoppable.', morality: -30, flags: { betrayedAlly: true } }
                    ]
                },
                {
                    dialogue: { speaker: 'Corrupted Mentor', text: 'My old student... I tried to teach you, but you wouldn\'t learn. Now you must face what I\'ve become.' },
                    choices: [
                        { id: 'save_mentor', text: 'I will free you from this corruption!', morality: 18, relationships: { mentor: 15 } },
                        { id: 'end_mentor', text: 'I\'ll grant you the mercy of death.', morality: 10 },
                        { id: 'join_mentor', text: 'Teach me this new power, mentor.', morality: -20 }
                    ]
                },
                {
                    dialogue: { speaker: 'Ancient Dragon', text: 'Why do you disturb my slumber, tiny one? Seek you death, glory, or wisdom?' },
                    choices: [
                        { id: 'fight_dragon', text: 'I seek to prove my strength against you!', morality: 5, relationships: { warrior: 12 } },
                        { id: 'negotiate_dragon', text: 'I seek wisdom and alliance, mighty one.', morality: 12, relationships: { mage: 15 } },
                        { id: 'steal_from_dragon', text: 'I seek your legendary treasure hoard.', morality: -15, relationships: { thief: 15 } }
                    ]
                },
                {
                    dialogue: { speaker: 'Demon Prince', text: 'Your soul burns bright. Make a deal with me: your soul for ultimate power, or face me in combat.' },
                    choices: [
                        { id: 'refuse_deal', text: 'My soul is not for sale, demon!', morality: 20 },
                        { id: 'accept_deal', text: 'I accept your bargain.', morality: -35, flags: { soldSoul: true } },
                        { id: 'trick_demon', text: 'I agree... *crosses fingers*', morality: -10, relationships: { thief: 10 } }
                    ]
                },
                {
                    dialogue: { speaker: 'Time Keeper', text: 'You should not be here, not in this timeline. Return to your proper path or face erasure from history.' },
                    choices: [
                        { id: 'return_timeline', text: 'Help me return to my timeline.', morality: 10 },
                        { id: 'change_timeline', text: 'I\'ll take my chances and change history.', morality: -15, flags: { changedTimeline: true } },
                        { id: 'fight_keeper', text: 'I will forge my own destiny!', morality: 5 }
                    ]
                }
            ],
            mountain: [
                {
                    dialogue: { speaker: 'Mountain Hermit', text: 'Few reach these heights. Fewer still with pure intentions. What drives you upward?' },
                    choices: [
                        { id: 'seek_enlightenment', text: 'I seek enlightenment and peace.', morality: 15, relationships: { mentor: 12 } },
                        { id: 'seek_power', text: 'I seek the power rumored to be here.', morality: -10 },
                        { id: 'seek_escape', text: 'I seek escape from my past.', morality: 3 }
                    ]
                },
                {
                    dialogue: { speaker: 'Ice Wraith', text: 'Turn back, mortal. These peaks are not for your kind. Only death awaits.' },
                    choices: [
                        { id: 'push_forward', text: 'I will not be deterred!', morality: 8, relationships: { warrior: 8 } },
                        { id: 'negotiate_wraith', text: 'Perhaps we can come to an agreement?', morality: 5 },
                        { id: 'turn_back', text: 'You\'re right. This is too dangerous.', morality: -5 }
                    ]
                },
                {
                    dialogue: { speaker: 'Lost Expedition Leader', text: 'Our team is trapped by an avalanche. We need help to survive the night.' },
                    choices: [
                        { id: 'rescue_team', text: 'I\'ll help dig you out.', morality: 15 },
                        { id: 'take_supplies', text: 'I\'ll take your supplies. You won\'t need them.', morality: -25 },
                        { id: 'leave_expedition', text: 'I have my own mission.', morality: -12 }
                    ]
                }
            ],
            castle: [
                {
                    dialogue: { speaker: 'Royal Advisor', text: 'The kingdom is in chaos. The prince is missing. Will you find him?' },
                    choices: [
                        { id: 'find_prince', text: 'I will find and return the prince.', morality: 15, relationships: { warrior: 10 } },
                        { id: 'seize_throne', text: 'With the prince gone, opportunity arises...', morality: -25 },
                        { id: 'ignore_politics', text: 'Royal matters don\'t concern me.', morality: -5 }
                    ]
                },
                {
                    dialogue: { speaker: 'Court Jester', text: '*Laughs mysteriously* The fool sees what others miss. A conspiracy brews. Want to know?' },
                    choices: [
                        { id: 'learn_conspiracy', text: 'Tell me everything.', morality: 5, relationships: { thief: 8 } },
                        { id: 'join_conspiracy', text: 'Perhaps I could join this conspiracy.', morality: -15 },
                        { id: 'ignore_jester', text: 'Fool\'s words are just that.', morality: 0 }
                    ]
                }
            ]
        };
        
        return events[area] || events.forest;
    }
}
