export interface Chant {
  id: number;
  title: string;
  subtitle: string;
  lyrics: string;
  translation: string[];
  audioUrl: string;
  durationSec: number;
  significance: string;
  category: 'Mantra' | 'Stotra' | 'Stuti';
  accentColor: string;
}

export const CHANTS_DATA: Chant[] = [
  {
    id: 1,
    title: 'Shri Navkar Maha-Mantra',
    subtitle: 'The Supreme Universal Jain Prayer',
    lyrics: 'णमो अरिहंताणं । णमो सिद्धाणं । णमो आयरियाणं ।\nणमो उवज्झायाणं । णमो लोए सव्वसाहूणं ।\nऐसोपंचणमोक्कारो, सव्वपावप्पणासणो ।\nमंगलाणं च सव्वेसिं, पढमं हवइ मंगलं ॥',
    translation: [
      'Namō Arihantānam - I bow to the Arihants (destroyers of inner enemies).',
      'Namō Siddhānam - I bow to the Siddhas (liberated, perfect souls).',
      'Namō Āyariyānam - I bow to the Acharyas (spiritual heads of the order).',
      'Namō Uvajjhāyānam - I bow to the Upadhyayas (ascetic teachers).',
      'Namō Lōē Savva Sāhūnam - I bow to all saints & sages in the universe.',
      'Ēsōpancha Namōkkārō - These five bows of deep respect,',
      'Savvapāvappanāsanō - Destroy all sins and negative karmic bonds,',
      'Mangalānam cha savvēsim - And among all auspicious prayers & mantras,',
      'Padhamam havai mangalam - This is the supreme and foremost auspicious chant.'
    ],
    // High-availability public domain MP3 URL that streams instantly
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    durationSec: 372, // Soundhelix song 1 duration
    significance: 'The Navkar Mantra is the most fundamental mantra in Jainism. Rather than asking for worldly favors, it offers deep reverence to the five supreme spiritually evolved souls (Panch Parameshthi). It cultivates humility, absolute non-attachment, and inner peace.',
    category: 'Mantra',
    accentColor: '#C8960C',
  },
  {
    id: 2,
    title: 'Uvasaggaharam Stotra',
    subtitle: 'Chant for Protection & Obstacle Removal',
    lyrics: 'उवसग्गहरं पासं, पासं वंदामि कम्म-घण-मुक्कं ।\nविसहर-विस-निन्नासं, मंगल-कल्लाण-आवासं ॥ १ ॥\nतग्गह-मंग-मंगले, सिद्धाणं संथुओ महायसो ।\nपच्चक्ख-कप्प-रुक्खो, चिंतामणि-कप्प-रूवो य ॥ २ ॥',
    translation: [
      'I bow to Lord Parshvanath, the remover of all obstacles and external hardships.',
      'He is completely free from the density of binding karmas.',
      'His name destroys the lethal poison of worldly attachments and negative energies.',
      'He is the supreme abode of auspicious blessings, health, and spiritual welfare.',
      'Remembering Him is like finding a divine wish-fulfilling tree (Kalpavriksha).',
      'He stands as a living gemstone of wish-fulfillment (Chintamani) for seeking souls.'
    ],
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    durationSec: 423,
    significance: 'Composed by Acharya Bhadrabahu Swami, this powerful stotra invokes the protection and grace of the 23rd Tirthankar, Lord Parshvanath. It is recited for inner resilience, mental clarity, and the pacification of adverse situations.',
    category: 'Stotra',
    accentColor: '#10B981',
  },
  {
    id: 3,
    title: 'Chattari Mangalam',
    subtitle: 'The Four Auspicious Spiritual Refuges',
    lyrics: 'चत्तारि मंगलं, अरिहंता मंगलं, सिद्धा मंगलं, साहू मंगलं, केवली पण्णत्तो धम्मो मंगलं ।\nचत्तारि लोगुत्तमा, अरिहंता लोगुत्तमा, सिद्धा लोगुत्तमा, साहू लोगुत्तमा, केवली पण्णत्तो धम्मो लोगुत्तमो ।\nचत्तारि सरणं पवज्जामि, अरिहंतं सरणं पवज्जामि, सिद्धं सरणं पवज्जामि, साहू सरणं पवज्जामि, केवली पण्णत्तं धम्मं सरणं पवज्जामि ।',
    translation: [
      'Four are auspicious in the universe: Arihants, Siddhas, Sadhus (monks), and the Religion expounded by the Omniscient (Kevali).',
      'Four are supreme in the universe: Arihants, Siddhas, Sadhus, and the Religion expounded by the Omniscient.',
      'I take refuge in these four: I take refuge in the Arihants, I take refuge in the Siddhas, I take refuge in the Sadhus, and I take refuge in the Kevali-expounded Dharma.'
    ],
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
    durationSec: 302,
    significance: 'Recited daily at the end of prayers, the Mangal Paath establishes the four supreme spiritual anchors (refuges) in the heart of a practitioner, building psychological security and spiritual focus.',
    category: 'Stuti',
    accentColor: '#EF4444',
  }
];
