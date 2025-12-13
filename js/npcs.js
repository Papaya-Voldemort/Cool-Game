/**
 * NPC Dialogue System
 * Comprehensive dialogues for all NPCs with dynamic responses
 */

const NPC_DIALOGUES = {
    // Forest NPCs
    'Mysterious Stranger': {
        initial: {
            speaker: 'Mysterious Stranger',
            text: 'The forest whispers your name, traveler. Dark omens cloud your path ahead, but also great opportunity.',
            choices: [
                { id: 'ask_omens', text: 'What omens do you speak of?', morality: 5 },
                { id: 'ask_opportunity', text: 'Tell me of this opportunity.', morality: 0 },
                { id: 'threaten_stranger', text: 'Stop speaking in riddles!', morality: -10 },
                { id: 'walk_away', text: 'I have no time for mystics.', morality: -5 }
            ]
        },
        followup: {
            ask_omens: {
                text: 'Darkness gathers in the east. An ancient evil stirs. You must prepare yourself, or all will be lost.',
                relationship: { mentor: 5 }
            },
            ask_opportunity: {
                text: 'Power beyond imagination awaits those brave enough to seize it. But power corrupts... will you risk it?',
                relationship: { villain: 5 }
            }
        }
    },
    
    'Village Elder': {
        initial: {
            speaker: 'Village Elder',
            text: 'Ah, a hero arrives! Our village faces many troubles. Will you aid us in our time of need?',
            choices: [
                { id: 'offer_help', text: 'Of course! What troubles you?', morality: 15, relationships: { warrior: 8 } },
                { id: 'ask_reward', text: 'What\'s in it for me?', morality: -5 },
                { id: 'refuse_elder', text: 'I have my own problems.', morality: -15 },
                { id: 'learn_more', text: 'Tell me more about your village first.', morality: 5 }
            ]
        },
        quest: {
            offer_help: {
                text: 'Bless you! Bandits raid our merchants, and strange creatures lurk in the forest. Choose which you\'ll address first.',
                choices: [
                    { id: 'fight_bandits', text: 'I\'ll handle the bandits.', morality: 10, flags: { banditQuest: true } },
                    { id: 'investigate_creatures', text: 'These creatures sound more dangerous.', morality: 12, flags: { creatureQuest: true } },
                    { id: 'do_both', text: 'I\'ll handle both threats.', morality: 20, flags: { banditQuest: true, creatureQuest: true } }
                ]
            }
        }
    },
    
    'Merchant': {
        initial: {
            speaker: 'Traveling Merchant',
            text: 'Hello there! I have rare wares from distant lands. Care to browse? Or perhaps you have something to sell?',
            choices: [
                { id: 'browse_wares', text: 'Show me what you have.', morality: 0 },
                { id: 'sell_items', text: 'I have items to sell.', morality: 0 },
                { id: 'rob_merchant', text: 'Hand over your gold!', morality: -30, relationships: { thief: 10 } },
                { id: 'ask_news', text: 'What news from your travels?', morality: 3 }
            ]
        },
        trade: {
            browse_wares: {
                text: 'I have healing potions, enchanted weapons, and ancient maps. Which interests you?'
            },
            ask_news: {
                text: 'Strange times, friend. The king grows paranoid, bandits grow bolder, and some say the old gods are returning...'
            }
        }
    },
    
    'Warrior': {
        initial: {
            speaker: 'Seasoned Warrior',
            text: 'I sense strength in you. Have you proven yourself in battle, or are you just another would-be hero?',
            choices: [
                { id: 'boast_strength', text: 'I\'ve defeated many foes!', morality: 0, relationships: { warrior: 5 } },
                { id: 'humble_response', text: 'I still have much to learn.', morality: 8, relationships: { mentor: 5 } },
                { id: 'challenge_warrior', text: 'Let\'s test that theory. Fight me!', morality: -5, relationships: { warrior: 10 } },
                { id: 'ask_training', text: 'Would you train me?', morality: 10, relationships: { warrior: 8 } }
            ]
        },
        training: {
            ask_training: {
                text: 'You show wisdom in asking. Very well, I\'ll teach you the ancient techniques of combat. But first, prove your dedication.',
                flags: { warriorTrainingOffered: true }
            }
        }
    },
    
    // Castle NPCs
    'King': {
        initial: {
            speaker: 'King Aldric',
            text: 'You stand before the throne. State your business, adventurer. We have little patience for time-wasters.',
            choices: [
                { id: 'pledge_loyalty', text: 'I pledge my sword to your service, Your Majesty.', morality: 10, relationships: { warrior: 10 } },
                { id: 'demand_audience', text: 'I demand proper treatment! I\'m a hero!', morality: -15 },
                { id: 'ask_quest', text: 'Do you have quests worthy of my skills?', morality: 5 },
                { id: 'question_rule', text: 'I question your right to rule.', morality: -25, relationships: { villain: 15 } }
            ]
        },
        quest: {
            pledge_loyalty: {
                text: 'Well spoken! We need heroes like you. A terrible threat looms. Will you undertake a royal mission?',
                choices: [
                    { id: 'accept_royal_quest', text: 'I accept this honor.', morality: 15, flags: { royalQuest: true } },
                    { id: 'negotiate_payment', text: 'First, let\'s discuss payment.', morality: -5 }
                ]
            }
        }
    },
    
    'Queen': {
        initial: {
            speaker: 'Queen Elara',
            text: 'You have the look of one who carries great burdens. I sense both light and shadow within you.',
            choices: [
                { id: 'seek_wisdom', text: 'Your Majesty, I seek wisdom.', morality: 10, relationships: { mentor: 8 } },
                { id: 'flirt_queen', text: '*Inappropriate flirtation*', morality: -20 },
                { id: 'ask_help', text: 'Can you help me with my quest?', morality: 5 },
                { id: 'suspicious', text: 'Why do you study me so intently?', morality: 0 }
            ]
        },
        wisdom: {
            seek_wisdom: {
                text: 'The path of wisdom is long and difficult. But I sense you have the heart for it. Seek the Oracle in the mountains.',
                flags: { oracleQuestGiven: true }
            }
        }
    },
    
    'Princess': {
        initial: {
            speaker: 'Princess Aria',
            text: 'Finally, someone interesting! These castle walls grow so boring. Are you here to rescue me? *laughs* I jest, I need no rescuing.',
            choices: [
                { id: 'befriend_princess', text: 'Perhaps we could be friends?', morality: 10 },
                { id: 'offer_adventure', text: 'Want to escape for an adventure?', morality: 5, flags: { princessAdventure: true } },
                { id: 'formal_response', text: 'Your Highness, I serve the crown.', morality: 8 },
                { id: 'insult_princess', text: 'Spoiled royalty, typical.', morality: -20 }
            ]
        }
    },
    
    'Royal Guard Captain': {
        initial: {
            speaker: 'Captain Marcus',
            text: 'Halt! State your business. This is a restricted area. Unless you have the king\'s permission, turn back now.',
            choices: [
                { id: 'show_respect', text: 'I have business with the king, Captain.', morality: 8 },
                { id: 'bribe_captain', text: '*Offer gold* Perhaps we can come to an arrangement?', morality: -15, relationships: { thief: 5 } },
                { id: 'force_way', text: 'I\'ll force my way through if needed.', morality: -20 },
                { id: 'leave_peacefully', text: 'My apologies, I\'ll leave.', morality: 5 }
            ]
        }
    },
    
    'Court Wizard': {
        initial: {
            speaker: 'Archmage Theron',
            text: 'Ah, a visitor to my tower. I sense magical potential in you. Or perhaps you seek knowledge of the arcane arts?',
            choices: [
                { id: 'learn_magic', text: 'I wish to learn magic.', morality: 5, relationships: { mage: 10 } },
                { id: 'ask_spell', text: 'Can you teach me a powerful spell?', morality: -5, relationships: { mage: 5 } },
                { id: 'request_enchantment', text: 'I need an item enchanted.', morality: 0 },
                { id: 'distrust_magic', text: 'Magic is dangerous and unnatural.', morality: -10 }
            ]
        },
        training: {
            learn_magic: {
                text: 'Excellent! Magic requires discipline and wisdom. Study these tomes, and return when you\'re ready for the trials.',
                flags: { magicStudyBegun: true }
            }
        }
    },
    
    // Desert NPCs
    'Desert Nomad': {
        initial: {
            speaker: 'Rashid the Nomad',
            text: 'Greetings, outlander. The desert is unforgiving to those who don\'t respect it. You seek passage to the oasis?',
            choices: [
                { id: 'request_guide', text: 'I need a guide through the desert.', morality: 5 },
                { id: 'buy_supplies', text: 'I need supplies for the journey.', morality: 0 },
                { id: 'ask_legends', text: 'Tell me legends of the desert.', morality: 8 },
                { id: 'rob_nomad', text: 'Hand over your water!', morality: -30 }
            ]
        },
        lore: {
            ask_legends: {
                text: 'They say ancient djinn still guard buried treasures. And in the heart of the desert lies a temple older than civilization itself.',
                flags: { desertLegendsHeard: true }
            }
        }
    },
    
    // Harbor NPCs
    'Ship Captain': {
        initial: {
            speaker: 'Captain Blackwell',
            text: 'Need passage across the sea? I can take you anywhere... for the right price. Or are you looking for crew work?',
            choices: [
                { id: 'book_passage', text: 'I need to sail to distant lands.', morality: 0 },
                { id: 'join_crew', text: 'I\'ll work for passage.', morality: 5 },
                { id: 'negotiate_price', text: 'Your price is too steep.', morality: -3 },
                { id: 'threaten_captain', text: 'You\'ll take me for free, or else.', morality: -25 }
            ]
        },
        voyage: {
            book_passage: {
                text: 'Where to? The Frozen North? The Spice Islands? The Cursed Isles? Each destination has its dangers...'
            }
        }
    },
    
    'Innkeeper': {
        initial: {
            speaker: 'Innkeeper Martha',
            text: 'Welcome to the Rusty Anchor! Best inn in port. Looking for a room, a meal, or perhaps some information?',
            choices: [
                { id: 'rent_room', text: 'I need a room for the night.', morality: 0 },
                { id: 'buy_meal', text: 'What\'s for dinner?', morality: 0 },
                { id: 'gather_rumors', text: 'I\'m looking for information.', morality: 3 },
                { id: 'cause_trouble', text: 'This place looks like a dump.', morality: -15 }
            ]
        },
        rumors: {
            gather_rumors: {
                text: 'Well now, I hear all sorts here. Pirates growing bold, a ghost ship in the fog, and strange disappearances near the lighthouse...',
                flags: { harborrumorsHeard: true }
            }
        }
    },
    
    'Guild Master': {
        initial: {
            speaker: 'Guild Master Venn',
            text: 'Ah, an adventurer! The guild always needs capable hands. Interested in taking on some contracts? High risk, high reward.',
            choices: [
                { id: 'accept_contract', text: 'Show me what you have.', morality: 5 },
                { id: 'join_guild', text: 'I want to join the guild officially.', morality: 8, flags: { guildMembershipOffered: true } },
                { id: 'challenge_master', text: 'I could run this guild better.', morality: -10 },
                { id: 'refuse_guild', text: 'I work alone.', morality: 0 }
            ]
        }
    },
    
    // Mountain NPCs
    'Mountain Hermit': {
        initial: {
            speaker: 'Old Hermit',
            text: 'Not many climb this high. You seek enlightenment? Or are you fleeing something? The mountain knows all secrets.',
            choices: [
                { id: 'seek_enlightenment', text: 'I seek peace and understanding.', morality: 15, relationships: { mentor: 12 } },
                { id: 'fleeing_past', text: 'Perhaps I am running from my past.', morality: 5 },
                { id: 'treasure_seeking', text: 'I heard there\'s treasure in these peaks.', morality: -8 },
                { id: 'ask_prophecy', text: 'Can you see my future?', morality: 3 }
            ]
        },
        wisdom: {
            seek_enlightenment: {
                text: 'The path to enlightenment requires sacrifice. Meditate here for three days, and truth will reveal itself.',
                flags: { meditationOffered: true }
            }
        }
    },
    
    // Swamp NPCs
    'Swamp Witch': {
        initial: {
            speaker: 'Grizzela the Witch',
            text: '*Cackles* What brings a living soul to my domain? Seeking potions? Curses? Or perhaps you wish to bargain for power?',
            choices: [
                { id: 'buy_potion', text: 'I need a powerful potion.', morality: -5 },
                { id: 'remove_curse', text: 'Can you remove curses?', morality: 5 },
                { id: 'learn_dark_magic', text: 'Teach me dark magic.', morality: -20, relationships: { villain: 15 } },
                { id: 'attack_witch', text: 'Witches must be destroyed!', morality: -15 }
            ]
        },
        bargain: {
            buy_potion: {
                text: 'Potions come with prices, dearie. What will you offer? Your memories? Your voice? A year of your life?',
                choices: [
                    { id: 'pay_memories', text: 'Take some memories.', morality: -10, flags: { lostMemories: true } },
                    { id: 'pay_voice', text: 'Take my voice.', morality: -15, flags: { lostVoice: true } },
                    { id: 'pay_lifespan', text: 'A year of my life.', morality: -12, flags: { reducedLifespan: true } },
                    { id: 'refuse_bargain', text: 'Never mind, I refuse.', morality: 5 }
                ]
            }
        }
    },
    
    // Underground NPCs
    'Crystal Miner': {
        initial: {
            speaker: 'Dwarf Miner',
            text: 'Ho there! Looking for crystals? These caves are dangerous but rich with gems. I could use help with an infestation.',
            choices: [
                { id: 'help_miner', text: 'What kind of infestation?', morality: 10 },
                { id: 'buy_crystals', text: 'I just want to buy crystals.', morality: 0 },
                { id: 'steal_claim', text: 'This cave is mine now.', morality: -25 },
                { id: 'partner_miner', text: 'Let\'s be partners.', morality: 12 }
            ]
        }
    },
    
    // Ruins NPCs
    'Archaeologist': {
        initial: {
            speaker: 'Professor Elwick',
            text: 'Fascinating! These ruins predate known civilization. Are you here to loot or to help me uncover history?',
            choices: [
                { id: 'help_excavate', text: 'I\'ll help you excavate properly.', morality: 15 },
                { id: 'admitted_looting', text: 'I\'m just here for treasure.', morality: -10 },
                { id: 'protect_professor', text: 'You need protection here.', morality: 10 },
                { id: 'steal_findings', text: 'Your findings belong in a museum. That I rob.', morality: -20 }
            ]
        }
    },
    
    'Ancient Spirit': {
        initial: {
            speaker: 'Spirit of Ages',
            text: 'Mortal... you tread upon sacred ground. What compels you to disturb the resting place of the ancient ones?',
            choices: [
                { id: 'show_respect', text: 'I mean no disrespect, honored spirit.', morality: 15 },
                { id: 'seek_knowledge', text: 'I seek the wisdom of the ancients.', morality: 10, relationships: { mage: 10 } },
                { id: 'demand_treasure', text: 'I want the treasures here.', morality: -20 },
                { id: 'attack_spirit', text: 'Spirits should remain silent!', morality: -25 }
            ]
        },
        revelation: {
            seek_knowledge: {
                text: 'Very well. I shall share one truth: the artifact you seek was sundered into three pieces. Only together can they prevent catastrophe.',
                flags: { ancientTruthRevealed: true }
            }
        }
    }
};

// Helper function to get NPC dialogue
function getNPCDialogue(npcName) {
    return NPC_DIALOGUES[npcName] || {
        initial: {
            speaker: npcName,
            text: 'Greetings, traveler.',
            choices: [
                { id: 'greet', text: 'Hello.', morality: 0 },
                { id: 'leave', text: 'Goodbye.', morality: 0 }
            ]
        }
    };
}
