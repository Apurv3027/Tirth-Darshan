export type Tirth = {
  id: string;
  name: string;
  tirthankarId: number; // FK
  location: string;
  nearestCity: string;
  state: string;
  history: string;
  mahima: string;
  howToReach: {
    road: string;
    rail: string;
    air: string;
  };
  bestTimeToVisit: string;
  hasVRDarshan: boolean;
  vrDarshanUrl?: string;
  gallery: string[];
};

<<<<<<< HEAD
export const TIRTHS: Tirth[] = [
  {
    id: 'shatrunjaya_palitana',
    name: 'Shatrunjaya (Palitana)',
    tirthankarId: 1,
    location: 'Palitana Hills',
    nearestCity: 'Bhavnagar',
    state: 'Gujarat',
    history: 'One of the holiest Jain pilgrimage sites with hundreds of temples atop Shatrunjaya hill.',
    mahima: 'Associated with Aadinath Bhagwan and countless saints who attained spiritual progress here.',
    howToReach: {
      road: 'Regular buses/taxis from Bhavnagar and Ahmadabad.',
      rail: 'Nearest station: Palitana / Bhavnagar.',
      air: 'Nearest airport: Bhavnagar.'
    },
    bestTimeToVisit: 'October to March',
    hasVRDarshan: true,
    vrDarshanUrl: 'https://example.com/vr/shatrunjaya',
    gallery: [
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b',
      'https://images.unsplash.com/photo-1573843981267-be1999ff37cd'
    ]
  },
  {
    id: 'girnar_junagadh',
    name: 'Girnar',
    tirthankarId: 22,
    location: 'Girnar Hills',
    nearestCity: 'Junagadh',
    state: 'Gujarat',
    history: 'Ancient mountain pilgrimage famous for thousands of steps and sacred Jain temples.',
    mahima: 'Neminath Bhagwan attained Moksha here. One of the greatest Jain siddha kshetras.',
    howToReach: {
      road: 'Good road connectivity from Rajkot and Ahmadabad.',
      rail: 'Nearest station: Junagadh Junction.',
      air: 'Nearest airport: Rajkot / Keshod.'
    },
    bestTimeToVisit: 'November to February',
    hasVRDarshan: true,
    vrDarshanUrl: 'https://example.com/vr/girnar',
    gallery: [
      'https://images.unsplash.com/photo-1593693397690-362cb9666fc2',
      'https://images.unsplash.com/photo-1564507592333-c60657eea523'
    ]
  },
  {
    id: 'sammed_shikhar',
    name: 'Sammeta Shikhar (Parasnath)',
    tirthankarId: 23,
    location: 'Parasnath Hills',
    nearestCity: 'Giridih',
    state: 'Jharkhand',
    history: 'Most sacred Jain siddha kshetra where 20 Tirthankars attained Moksha.',
    mahima: 'Pilgrimage of immense spiritual merit. Parshvanath Bhagwan especially associated here.',
    howToReach: {
      road: 'Taxis/buses from Giridih and Madhuban.',
      rail: 'Nearest station: Parasnath Railway Station.',
      air: 'Nearest airport: Ranchi.'
    },
    bestTimeToVisit: 'October to February',
    hasVRDarshan: true,
    vrDarshanUrl: 'https://example.com/vr/sammed',
    gallery: [
      'https://images.unsplash.com/photo-1627308595229-7830a5c91f9f',
      'https://images.unsplash.com/photo-1585136917235-bc9b59d1d7f3'
    ]
  },
  {
    id: 'pawapuri_bihar',
    name: 'Pawapuri',
    tirthankarId: 24,
    location: 'Nalanda District',
    nearestCity: 'Bihar Sharif',
    state: 'Bihar',
    history: 'Sacred Jal Mandir built where Mahavir Swami attained Nirvana.',
    mahima: 'One of the most revered Jain pilgrimage places connected with Mahavir Swami.',
    howToReach: {
      road: 'Accessible from Patna, Rajgir, Nalanda by road.',
      rail: 'Nearest station: Bihar Sharif / Playagir.',
      air: 'Nearest airport: Patna.'
    },
    bestTimeToVisit: 'October to March',
    hasVRDarshan: false,
    gallery: [
      'https://images.unsplash.com/photo-1605649487212-47bdab064df7',
      'https://images.unsplash.com/photo-1548013146-72479768bada'
    ]
  },
  {
    id: 'vaishali_bihar',
    name: 'Vaishali',
    tirthankarId: 24,
    location: 'Vaishali District',
    nearestCity: 'Hajipur',
    state: 'Bihar',
    history: 'Birthplace region of Mahavir Swami, historically rich spiritual land.',
    mahima: 'Highly revered for Mahavir Janma Kalyanak remembrance.',
    howToReach: {
      road: 'Connected from Patna and Hajipur.',
      rail: 'Nearest station: Hajipur.',
      air: 'Nearest airport: Patna.'
    },
    bestTimeToVisit: 'November to February',
    hasVRDarshan: false,
    gallery: [
      'https://images.unsplash.com/photo-1561361058-c24cec5cae4f',
      'https://images.unsplash.com/photo-1514222134-b57cbb8ce073'
    ]
  },
  {
    id: 'champapuri_bihar',
    name: 'Champapuri',
    tirthankarId: 12,
    location: 'Bhagalpur Region',
    nearestCity: 'Bhagalpur',
    state: 'Bihar',
    history: 'Birthplace and Nirvana land of Vasupujya Bhagwan.',
    mahima: 'Rare tirth where multiple Kalyanaks are associated with one Tirthankar.',
    howToReach: {
      road: 'Connected via Bhagalpur city roads.',
      rail: 'Nearest station: Bhagalpur.',
      air: 'Nearest airport: Patna / Deoghar.'
    },
    bestTimeToVisit: 'October to March',
    hasVRDarshan: false,
    gallery: [
      'https://images.unsplash.com/photo-1599661046827-dacde6976548',
      'https://images.unsplash.com/photo-1548013146-72479768bada'
    ]
  },
  {
    id: 'hastinapur_up',
    name: 'Hastinapur',
    tirthankarId: 16,
    location: 'Meerut District',
    nearestCity: 'Meerut',
    state: 'Uttar Pradesh',
    history: 'Ancient Jain center linked with Shantinath, Kunthunath, and Arnath Bhagwan.',
    mahima: 'Major pilgrimage site with temples, digambar complexes, and historical heritage.',
    howToReach: {
      road: 'Easy access from Delhi and Meerut.',
      rail: 'Nearest station: Meerut.',
      air: 'Nearest airport: Delhi.'
    },
    bestTimeToVisit: 'October to March',
    hasVRDarshan: true,
    vrDarshanUrl: 'https://example.com/vr/hastinapur',
    gallery: [
      'https://images.unsplash.com/photo-1587474260584-136574528ed5',
      'https://images.unsplash.com/photo-1577083165633-14ebcdb0f658'
    ]
  },
  {
    id: 'kesariyaji_rajasthan',
    name: 'Kesariyaji',
    tirthankarId: 1,
    location: 'Rishabhdeo',
    nearestCity: 'Udaipur',
    state: 'Rajasthan',
    history: 'Very ancient temple dedicated to Aadinath Bhagwan.',
    mahima: 'Famous among Jains and local devotees alike for miracles and faith.',
    howToReach: {
      road: 'Road route from Udaipur.',
      rail: 'Nearest station: Udaipur.',
      air: 'Nearest airport: Udaipur.'
    },
    bestTimeToVisit: 'October to February',
    hasVRDarshan: false,
    gallery: [
      'https://images.unsplash.com/photo-1599661046289-e31897846e41',
      'https://images.unsplash.com/photo-1585136917235-bc9b59d1d7f3'
    ]
  },
  {
    id: 'rajgir_bihar',
    name: 'Rajgir',
    tirthankarId: 20,
    location: 'Rajgir Hills',
    nearestCity: 'Rajgir',
    state: 'Bihar',
    history: 'Historic spiritual city connected to Jainism and many ancient traditions.',
    mahima: 'Munisuvrat Bhagwan linked here. Important Jain temples and hill shrines.',
    howToReach: {
      road: 'Accessible from Patna and Nalanda.',
      rail: 'Nearest station: Rajgir.',
      air: 'Nearest airport: Patna.'
    },
    bestTimeToVisit: 'October to March',
    hasVRDarshan: false,
    gallery: [
      'https://images.unsplash.com/photo-1609947017136-9daf32a5eb16',
      'https://images.unsplash.com/photo-1593693397690-362cb9666fc2'
    ]
  },
  {
    id: 'ashtapad_himalaya',
    name: 'Ashtapad',
    tirthankarId: 1,
    location: 'Mythic Himalayan Region',
    nearestCity: 'Kailash Region',
    state: 'Himalayan Area',
    history: 'Traditionally believed Nirvana place of Aadinath Bhagwan.',
    mahima: 'Extremely sacred and mystical site in Jain tradition.',
    howToReach: {
      road: 'No common direct route.',
      rail: 'Not applicable.',
      air: 'Nearest access through Himalayan expeditions.'
    },
    bestTimeToVisit: 'Seasonal / Restricted',
    hasVRDarshan: true,
    vrDarshanUrl: 'https://example.com/vr/ashtapad',
    gallery: [
      'https://images.unsplash.com/photo-1506744038136-46273834b3fb',
      'https://images.unsplash.com/photo-1511497584788-876760111969'
    ]
  }
];
=======
export const TIRTHS: Tirth[] = [];
>>>>>>> origin/main
