// ─── Local video assets (bundled with app) ───────────────────────────────────
const LOCAL_VIDEOS = {
    reel1: require('../assets/videos/reel1.mp4'),
    reel2: require('../assets/videos/reel2.mp4'),
    reel3: require('../assets/videos/reel3.mp4'),
};

export interface ReelData {
    id: string;
    // For local fallback: use localSource key. For Supabase/Remote: use uri key.
    localSource?: any;
    uri?: string;
    user: string;
    avatar: string;
    description: string;
    likes: string;
    comments: string;
    shares: string;
    music: string;
}

export const REELS_DATA: ReelData[] = [
    {
        id: '1',
        localSource: LOCAL_VIDEOS.reel1,
        user: 'Shri Palitana Tirth',
        avatar: 'https://i.pravatar.cc/100?img=1',
        description: 'पालीताना तीर्थ के दर्शन 🙏 श्री शत्रुंजय गिरि #jain #tirth #palitana',
        likes: '12.4K',
        comments: '856',
        shares: '2.1K',
        music: 'Navkar Mantra - Sacred Chants',
    },
    {
        id: '2',
        localSource: LOCAL_VIDEOS.reel2,
        user: 'Ranakpur Jain Temple',
        avatar: 'https://i.pravatar.cc/100?img=2',
        description: 'रणकपुर जैन मंदिर की अद्भुत शिल्पकला ✨ #ranakpur #jaintemple',
        likes: '8.9K',
        comments: '432',
        shares: '1.5K',
        music: 'Bhakti Sangeet - Devotional',
    },
    {
        id: '3',
        localSource: LOCAL_VIDEOS.reel3,
        user: 'Dilwara Temples',
        avatar: 'https://i.pravatar.cc/100?img=3',
        description: 'दिलवाड़ा मंदिर, माउंट आबू 🕉️ #dilwara #mountabu #jain',
        likes: '21.7K',
        comments: '1.2K',
        shares: '4.8K',
        music: 'Stavan - Temple Music',
    },
    {
        id: '4',
        localSource: LOCAL_VIDEOS.reel1,
        user: 'Girnar Tirth',
        avatar: 'https://i.pravatar.cc/100?img=4',
        description: 'गिरनार तीर्थ यात्रा 🏔️ नेमिनाथ भगवान #girnar #junagadh',
        likes: '34.1K',
        comments: '2.9K',
        shares: '7.2K',
        music: 'Jai Jinendra - Devotional',
    },
    {
        id: '5',
        localSource: LOCAL_VIDEOS.reel2,
        user: 'Shatrunjay Hills',
        avatar: 'https://i.pravatar.cc/100?img=5',
        description: 'सूर्योदय शत्रुंजय पर्वत से 🌅 अद्भुत दृश्य #sunrise #tirth',
        likes: '45.3K',
        comments: '3.4K',
        shares: '9.1K',
        music: 'Morning Prayers - Sacred',
    },
];
