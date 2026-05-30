export interface WisdomQuote {
  id: number;
  text: string;
  author: string;
  source?: string;
  explanation?: string;
  themeColor: string;
}

export const WISDOM_DATA: WisdomQuote[] = [
  {
    id: 1,
    text: "Ahimsa Parmo Dharma. Non-violence is the highest spiritual path. Pure consciousness manifests when we cease to cause harm to any living being in thought, word, and deed.",
    author: "Lord Mahavir Swami",
    source: "Uttaradhyayana Sutra",
    themeColor: "#C8960C"
  },
  {
    id: 2,
    text: "Parasparopagraho Jivanama. All life is bound together by mutual support and interdependence. We do not exist in isolation; our spiritual duty is to assist and uplift each other.",
    author: "Acharya Umaswati",
    source: "Tattvartha Sutra 5.21",
    themeColor: "#10B981"
  },
  {
    id: 3,
    text: "Live and let live. Do not injure, abuse, oppress, enslave, insult, torment, hurt, or kill any creature or living being. Treat all beings with the same empathy as your own self.",
    author: "Lord Mahavir Swami",
    source: "Acharanga Sutra",
    themeColor: "#3B82F6"
  },
  {
    id: 4,
    text: "Just as you do not wish to experience pain or suffering, so do all other living souls. Therefore, let your interactions with every organism be guided by deep reverence.",
    author: "Lord Mahavir Swami",
    source: "Sutrakritanga Sutra",
    themeColor: "#EF4444"
  },
  {
    id: 5,
    text: "The soul is the maker and destroyer of its own happiness and misery. A soul bound by attachment and aversion creates its own prison; a detached soul attains absolute liberation.",
    author: "Acharya Kundkund",
    source: "Samaysara",
    themeColor: "#8B5DFF"
  },
  {
    id: 6,
    text: "Anger destroys love, pride destroys humility, deceit destroys friendship, and greed destroys everything. Conquer anger with forgiveness, pride with modesty, deceit with honesty, and greed with contentment.",
    author: "Lord Mahavir Swami",
    source: "Dashavaikalika Sutra",
    themeColor: "#E0A96D"
  }
];
