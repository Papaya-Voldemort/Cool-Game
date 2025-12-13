/**
 * Dynamic Event System
 * Generates contextual events based on player state, location, and story progression
 */

class EventSystem {
    constructor(narrativeManager) {
        this.narrativeManager = narrativeManager;
        this.activeEvents = [];
        this.completedEvents = new Set();
        this.eventTriggers = [];
        this.worldEvents = [];
        this.randomEncounterChance = 0.1;
        this.lastEventTime = 0;
        this.eventCooldown = 30000; // 30 seconds between events
        
        this.initializeEvents();
    }
    
    initializeEvents() {
        // Define hundreds of possible events
        this.eventDatabase = {
            // Random encounters
            randomEncounters: [
                {
                    id: 'merchant_ambush',
                    trigger: () => true,
                    weight: 5,
                    event: {
                        dialogue: { speaker: 'Frightened Merchant', text: 'Help! Bandits are chasing me! Please, can you protect me?' },
                        choices: [
                            { id: 'protect_merchant', text: 'Stand behind me, I\'ll handle this.', morality: 15, relationships: { warrior: 8 } },
                            { id: 'demand_payment_protect', text: 'Protection costs gold, friend.', morality: -5 },
                            { id: 'rob_merchant', text: 'The bandits have the right idea...', morality: -25, relationships: { thief: 10 } },
                            { id: 'hide_merchant', text: 'Quick, hide here while I distract them.', morality: 10, relationships: { thief: 5 } }
                        ]
                    }
                },
                {
                    id: 'mysterious_traveler',
                    trigger: () => true,
                    weight: 8,
                    event: {
                        dialogue: { speaker: 'Hooded Traveler', text: 'We meet again, though you may not remember. Your past holds secrets even you don\'t know...' },
                        choices: [
                            { id: 'ask_past', text: 'Tell me about my past!', morality: 0, flags: { seekingTruth: true } },
                            { id: 'threaten_traveler', text: 'Speak plainly or leave.', morality: -8 },
                            { id: 'ignore_cryptic', text: 'Riddles bore me. Goodbye.', morality: -3 },
                            { id: 'befriend_traveler', text: 'Perhaps we could travel together?', morality: 5, relationships: { mentor: 8 } }
                        ]
                    }
                },
                {
                    id: 'wounded_beast',
                    trigger: () => true,
                    weight: 6,
                    event: {
                        dialogue: { speaker: 'Narrator', text: 'A wounded magical beast lies before you, its eyes pleading. It seems intelligent...' },
                        choices: [
                            { id: 'heal_beast', text: 'I\'ll tend to your wounds.', morality: 18, relationships: { mage: 10 }, flags: { beastAlly: true } },
                            { id: 'mercy_kill_beast', text: 'I\'ll end your suffering.', morality: 5 },
                            { id: 'take_beast_parts', text: 'These parts could be valuable...', morality: -20 },
                            { id: 'leave_beast', text: 'Nature will take its course.', morality: -10 }
                        ]
                    }
                },
                {
                    id: 'cursed_treasure',
                    trigger: () => true,
                    weight: 7,
                    event: {
                        dialogue: { speaker: 'Narrator', text: 'You discover a chest radiating dark energy. Treasure... and danger.' },
                        choices: [
                            { id: 'open_cursed', text: 'Fortune favors the bold. Open it!', morality: -5, flags: { openedCursed: true } },
                            { id: 'purify_treasure', text: 'Let me try to purify it first.', morality: 12, relationships: { mage: 8 } },
                            { id: 'leave_treasure', text: 'Not worth the risk.', morality: 8 },
                            { id: 'mark_location', text: 'I\'ll mark this and return prepared.', morality: 3 }
                        ]
                    }
                },
                {
                    id: 'time_rift',
                    trigger: () => true,
                    weight: 3,
                    event: {
                        dialogue: { speaker: 'Narrator', text: 'Reality warps before you - a rift in time. Through it, you see another version of yourself...' },
                        choices: [
                            { id: 'enter_rift', text: 'Step through the rift.', morality: 0, flags: { enteredTimeRift: true } },
                            { id: 'seal_rift', text: 'Seal this abomination!', morality: 10 },
                            { id: 'study_rift', text: 'Observe and document it.', morality: 5, relationships: { mage: 12 } },
                            { id: 'flee_rift', text: 'Back away slowly...', morality: -5 }
                        ]
                    }
                },
                {
                    id: 'starving_village',
                    trigger: () => true,
                    weight: 8,
                    event: {
                        dialogue: { speaker: 'Village Chief', text: 'Our crops failed. We\'re starving. Can you spare supplies or help us?' },
                        choices: [
                            { id: 'give_supplies', text: 'Take what I have.', morality: 20, relationships: { warrior: 5 } },
                            { id: 'hunt_food', text: 'I\'ll hunt food for you.', morality: 15, relationships: { warrior: 8 } },
                            { id: 'sell_supplies', text: 'I could sell you some...', morality: -15 },
                            { id: 'ignore_village', text: 'Not my problem.', morality: -25 }
                        ]
                    }
                },
                {
                    id: 'rival_adventurer',
                    trigger: () => true,
                    weight: 9,
                    event: {
                        dialogue: { speaker: 'Rival Adventurer', text: 'So you\'re the famous hero? Let\'s see if you live up to the hype. Duel me!' },
                        choices: [
                            { id: 'accept_duel', text: 'You\'re on!', morality: 3, relationships: { warrior: 10 } },
                            { id: 'refuse_duel', text: 'I don\'t need to prove anything.', morality: 5 },
                            { id: 'trick_rival', text: '*Look behind them* What\'s that?!', morality: -12, relationships: { thief: 8 } },
                            { id: 'befriend_rival', text: 'Why fight? Let\'s team up.', morality: 10 }
                        ]
                    }
                },
                {
                    id: 'prophetic_dream',
                    trigger: () => true,
                    weight: 4,
                    event: {
                        dialogue: { speaker: 'Dream Voice', text: 'In your dreams, visions of possible futures flash. One shows triumph, another tragedy...' },
                        choices: [
                            { id: 'follow_triumph', text: 'I will make the triumph real.', morality: 10, flags: { followingLight: true } },
                            { id: 'prevent_tragedy', text: 'I must prevent the tragedy.', morality: 12 },
                            { id: 'embrace_tragedy', text: 'Sometimes tragedy is necessary.', morality: -15 },
                            { id: 'ignore_dreams', text: 'Dreams are just dreams.', morality: 0 }
                        ]
                    }
                },
                {
                    id: 'ancient_guardian_test',
                    trigger: () => true,
                    weight: 5,
                    event: {
                        dialogue: { speaker: 'Stone Guardian', text: 'Mortal, you tread on sacred ground. Answer my riddle or face my wrath: What walks on four legs at dawn, two at noon, and three at dusk?' },
                        choices: [
                            { id: 'answer_man', text: 'A human - crawling, walking, with a cane.', morality: 8, relationships: { mage: 10 } },
                            { id: 'answer_wrong', text: 'A three-legged dog in the morning?', morality: 0 },
                            { id: 'fight_guardian', text: 'I don\'t do riddles. Fight me!', morality: -5, relationships: { warrior: 8 } },
                            { id: 'leave_guardian', text: 'I\'ll respect your sacred ground.', morality: 12 }
                        ]
                    }
                },
                {
                    id: 'fairy_circle',
                    trigger: () => true,
                    weight: 6,
                    event: {
                        dialogue: { speaker: 'Fairy Queen', text: 'You\'ve entered our circle, mortal. Dance with us and earn a wish, or refuse and be cursed!' },
                        choices: [
                            { id: 'dance_fairies', text: 'I\'ll dance with you!', morality: 8, flags: { fairyBlessed: true } },
                            { id: 'refuse_dance', text: 'I refuse your games.', morality: 5, flags: { fairyCursed: true } },
                            { id: 'trick_fairies', text: 'I accept! *crosses fingers*', morality: -10, relationships: { thief: 12 } },
                            { id: 'bargain_fairies', text: 'Let\'s negotiate different terms.', morality: 3 }
                        ]
                    }
                }
            ],
            
            // Location-specific events
            forestEvents: [
                {
                    id: 'treant_awakening',
                    trigger: (flags) => !flags.treantAwakened,
                    event: {
                        dialogue: { speaker: 'Ancient Treant', text: 'Groooan... Who awakens me from slumber? The forest cries out in pain...' },
                        choices: [
                            { id: 'help_forest', text: 'Tell me how to heal the forest.', morality: 15, relationships: { mage: 10 }, flags: { treantAwakened: true } },
                            { id: 'harvest_treant', text: 'Your wood would be valuable...', morality: -25 },
                            { id: 'ask_wisdom', text: 'Share your ancient wisdom with me.', morality: 10, relationships: { mentor: 12 } },
                            { id: 'leave_treant', text: 'Rest easy, ancient one.', morality: 8 }
                        ]
                    }
                },
                {
                    id: 'wolf_pack_alpha',
                    trigger: () => true,
                    event: {
                        dialogue: { speaker: 'Alpha Wolf', text: '*The pack surrounds you, but the alpha studies you carefully*' },
                        choices: [
                            { id: 'assert_dominance', text: 'Show dominance without violence.', morality: 8, relationships: { warrior: 10 }, flags: { wolfAlly: true } },
                            { id: 'feed_wolves', text: 'Offer them food.', morality: 12 },
                            { id: 'fight_wolves', text: 'Attack before they do!', morality: -10 },
                            { id: 'back_away', text: 'Slowly retreat.', morality: 5 }
                        ]
                    }
                },
                {
                    id: 'forest_shrine',
                    trigger: (flags) => !flags.foundForestShrine,
                    event: {
                        dialogue: { speaker: 'Narrator', text: 'An ancient shrine dedicated to nature spirits. An offering could grant blessings... or awaken something.' },
                        choices: [
                            { id: 'make_offering', text: 'Leave an offering.', morality: 12, flags: { foundForestShrine: true, shrineBlessing: true } },
                            { id: 'take_offering', text: 'Take the old offerings.', morality: -18, flags: { foundForestShrine: true, shrineCurse: true } },
                            { id: 'pray_shrine', text: 'Simply pray here.', morality: 10, flags: { foundForestShrine: true } },
                            { id: 'destroy_shrine', text: 'Destroy this pagan shrine.', morality: -15, flags: { foundForestShrine: true } }
                        ]
                    }
                }
            ],
            
            // Combat-triggered events
            combatEvents: [
                {
                    id: 'enemy_surrender',
                    trigger: (context) => context.enemyHpLow,
                    event: {
                        dialogue: { speaker: 'Enemy', text: 'Please... I yield! Spare me and I\'ll tell you everything!' },
                        choices: [
                            { id: 'spare_enemy', text: 'Speak, and you may live.', morality: 15, flags: { sparedEnemy: true } },
                            { id: 'finish_enemy', text: 'No mercy for your kind.', morality: -12 },
                            { id: 'interrogate_harsh', text: 'Talk first, then I\'ll decide.', morality: -5 },
                            { id: 'recruit_enemy', text: 'Join me instead.', morality: 8, flags: { recruitedEnemy: true } }
                        ]
                    }
                }
            ],
            
            // Relationship-triggered events
            relationshipEvents: [
                {
                    id: 'warrior_mentor_offer',
                    trigger: (relationships) => relationships.warrior > 30,
                    once: true,
                    event: {
                        dialogue: { speaker: 'Legendary Warrior', text: 'Your combat prowess is impressive. I could train you in advanced techniques...' },
                        choices: [
                            { id: 'accept_training', text: 'I would be honored!', morality: 10, relationships: { warrior: 15 }, flags: { warriorTraining: true } },
                            { id: 'refuse_training_pride', text: 'I\'ve learned all I need.', morality: -5 },
                            { id: 'challenge_warrior', text: 'Or we could test each other!', morality: 5, relationships: { warrior: 10 } }
                        ]
                    }
                },
                {
                    id: 'mage_secrets',
                    trigger: (relationships) => relationships.mage > 30,
                    once: true,
                    event: {
                        dialogue: { speaker: 'Archmage', text: 'You\'ve proven your dedication to the mystical arts. Let me show you the Forbidden Scrolls...' },
                        choices: [
                            { id: 'learn_forbidden', text: 'Show me these secrets.', morality: -10, relationships: { mage: 20 }, flags: { learnedForbidden: true } },
                            { id: 'refuse_forbidden', text: 'Some knowledge is forbidden for good reason.', morality: 15 },
                            { id: 'study_safely', text: 'Can we study them safely?', morality: 5, relationships: { mage: 10 } }
                        ]
                    }
                },
                {
                    id: 'thief_guild_invite',
                    trigger: (relationships) => relationships.thief > 30,
                    once: true,
                    event: {
                        dialogue: { speaker: 'Guild Master', text: 'You\'ve got skills. The Guild could use someone like you. Interested in our... special operations?' },
                        choices: [
                            { id: 'join_guild', text: 'I\'m in.', morality: -15, relationships: { thief: 25 }, flags: { guildMember: true } },
                            { id: 'refuse_guild', text: 'I work alone.', morality: 5 },
                            { id: 'infiltrate_guild', text: 'I accept... *secretly planning to expose them*', morality: 10 }
                        ]
                    }
                }
            ],
            
            // Story progression events
            progressionEvents: [
                {
                    id: 'ancient_prophecy_revealed',
                    trigger: (flags) => flags.foundSecret && !flags.prophecyRevealed,
                    event: {
                        dialogue: { speaker: 'Oracle', text: 'The secret you found... it\'s part of an ancient prophecy. You are the Chosen One - or the Destroyer.' },
                        choices: [
                            { id: 'accept_prophecy', text: 'I accept my destiny.', morality: 10, flags: { prophecyRevealed: true, acceptedDestiny: true } },
                            { id: 'reject_prophecy', text: 'I make my own fate!', morality: 5, flags: { prophecyRevealed: true, rejectedDestiny: true } },
                            { id: 'question_oracle', text: 'How do I know you\'re telling the truth?', morality: 3, flags: { prophecyRevealed: true } }
                        ]
                    }
                },
                {
                    id: 'betrayal_revelation',
                    trigger: (flags, relationships) => relationships.mentor > 40 && flags.foundSecret,
                    once: true,
                    event: {
                        dialogue: { speaker: 'Mentor', text: 'There\'s something I must tell you... I\'ve been deceiving you. Everything you know is a lie.' },
                        choices: [
                            { id: 'forgive_mentor', text: 'Explain yourself. I\'m listening.', morality: 15, relationships: { mentor: 10 } },
                            { id: 'attack_mentor', text: 'You betrayed me!', morality: -10, relationships: { mentor: -50 }, flags: { mentorEnemy: true } },
                            { id: 'leave_mentor', text: 'I can\'t deal with this now.', morality: 0, relationships: { mentor: -20 } }
                        ]
                    }
                }
            ]
        };
    }
    
    update(dt, player, world, narrativeManager) {
        // Check for triggered events
        const now = Date.now();
        
        // Random encounters
        if (now - this.lastEventTime > this.eventCooldown) {
            if (Math.random() < this.randomEncounterChance) {
                this.triggerRandomEncounter(world.currentArea, narrativeManager);
                this.lastEventTime = now;
            }
        }
        
        // Check location-specific triggers
        this.checkLocationEvents(world, narrativeManager);
        
        // Check relationship triggers
        this.checkRelationshipEvents(narrativeManager);
        
        // Check progression triggers
        this.checkProgressionEvents(narrativeManager);
    }
    
    triggerRandomEncounter(area, narrativeManager) {
        const encounters = this.eventDatabase.randomEncounters;
        const validEncounters = encounters.filter(e => 
            e.trigger() && !this.completedEvents.has(e.id)
        );
        
        if (validEncounters.length === 0) return;
        
        // Weighted random selection
        const totalWeight = validEncounters.reduce((sum, e) => sum + (e.weight || 1), 0);
        let random = Math.random() * totalWeight;
        
        for (const encounter of validEncounters) {
            random -= (encounter.weight || 1);
            if (random <= 0) {
                this.triggerEvent(encounter, narrativeManager);
                break;
            }
        }
    }
    
    checkLocationEvents(world, narrativeManager) {
        const areaEvents = this.getEventsForArea(world.currentArea);
        
        for (const eventData of areaEvents) {
            if (this.completedEvents.has(eventData.id)) continue;
            
            if (eventData.trigger(narrativeManager.flags)) {
                this.triggerEvent(eventData, narrativeManager);
                break; // One event at a time
            }
        }
    }
    
    checkRelationshipEvents(narrativeManager) {
        const relEvents = this.eventDatabase.relationshipEvents;
        
        for (const eventData of relEvents) {
            if (eventData.once && this.completedEvents.has(eventData.id)) continue;
            
            if (eventData.trigger(narrativeManager.relationships)) {
                this.triggerEvent(eventData, narrativeManager);
                if (eventData.once) {
                    this.completedEvents.add(eventData.id);
                }
                break;
            }
        }
    }
    
    checkProgressionEvents(narrativeManager) {
        const progEvents = this.eventDatabase.progressionEvents;
        
        for (const eventData of progEvents) {
            if (this.completedEvents.has(eventData.id)) continue;
            
            if (eventData.trigger(narrativeManager.flags, narrativeManager.relationships)) {
                this.triggerEvent(eventData, narrativeManager);
                this.completedEvents.add(eventData.id);
                break;
            }
        }
    }
    
    getEventsForArea(area) {
        const areaKey = area.toLowerCase().replace(/\s+/g, '');
        
        const mapping = {
            'darkwoodforest': 'forestEvents',
            'forest': 'forestEvents'
        };
        
        const eventKey = mapping[areaKey];
        return eventKey ? this.eventDatabase[eventKey] || [] : [];
    }
    
    triggerEvent(eventData, narrativeManager) {
        if (eventData.event.dialogue) {
            narrativeManager.showDialogue(eventData.event.dialogue);
        }
        
        if (eventData.event.choices) {
            narrativeManager.presentChoice(eventData.event.choices);
        }
        
        this.completedEvents.add(eventData.id);
    }
    
    resetEvents() {
        this.completedEvents.clear();
        this.lastEventTime = 0;
    }
}
