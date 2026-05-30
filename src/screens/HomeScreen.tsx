import React, { useState, useEffect, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    Image,
    ActivityIndicator,
    Dimensions,
    Platform,
    StatusBar,
    AppState,
    AppStateStatus,
} from 'react-native';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import ScreenWrapper from '../components/ScreenWrapper';
import { PanchangCard } from '../components/PanchangCard';
import { dbService } from '../services/dbService';
import { Tirth } from '../data/tirths';
import { Tirthankar } from '../data/tirthankars';
import { RootStackParams } from '../navigation';
import Video from 'react-native-video';
import { Chant } from '../data/chants';
import { WisdomQuote } from '../data/wisdom';

const { width } = Dimensions.get('window');

const getTirthankarName = (tirthankarId: number) => {
    const map: Record<number, string> = {
        1: 'Lord Aadinath',
        12: 'Lord Vasupujya',
        16: 'Lord Shantinath',
        20: 'Lord Munisuvrat',
        22: 'Lord Neminath',
        23: 'Lord Parshvanath',
        24: 'Lord Mahavir Swami'
    };
    return map[tirthankarId] || 'Tirthankar';
};

type NavigationProp = NativeStackNavigationProp<RootStackParams>;
export const HomeScreen = () => {
    const nav = useNavigation<any>();
    const isFocused = useIsFocused();

    // States
    const [tirths, setTirths] = useState<Tirth[]>([]);
    const [tirthankars, setTirthankars] = useState<Tirthankar[]>([]);
    const [reelsCount, setReelsCount] = useState<number>(0);
    const [chants, setChants] = useState<Chant[]>([]);
    const [wisdom, setWisdom] = useState<WisdomQuote[]>([]);
    const [loading, setLoading] = useState(true);

    // Spotlight Interactive States
    const [activeTeachingIndex, setActiveTeachingIndex] = useState<number>(0);
    const [showKalyanaks, setShowKalyanaks] = useState<boolean>(false);

    // Audio Player States
    const [isPlaying, setIsPlaying] = useState(false);
    const [audioProgress, setAudioProgress] = useState(0.0);
    const [showTranslation, setShowTranslation] = useState(false);
    const [activeChantIndex, setActiveChantIndex] = useState<number>(0);
    const [audioDuration, setAudioDuration] = useState<number>(0);
    const [currentSeconds, setCurrentSeconds] = useState<number>(0);
    const [savedPositions, setSavedPositions] = useState<Record<number, number>>({});
    const videoRef = useRef<any>(null);

    // Wisdom Interactive States
    const [activeWisdomIndex, setActiveWisdomIndex] = useState<number>(0);

    // Pause audio when screen loses focus (user changes tab or navigates away)
    useEffect(() => {
        if (!isFocused) {
            setIsPlaying(false);
        }
    }, [isFocused]);

    // Pause audio when app is backgrounded or inactive
    useEffect(() => {
        const subscription = AppState.addEventListener('change', (nextAppState: AppStateStatus) => {
            if (nextAppState === 'background' || nextAppState === 'inactive') {
                setIsPlaying(false);
            }
        });
        return () => {
            subscription.remove();
        };
    }, []);

    useEffect(() => {
        let isMounted = true;

        const loadAllData = async () => {
            try {
                const [tirthsData, tirthankarsData, reelsData, chantsData, wisdomData] = await Promise.all([
                    dbService.getTirths(),
                    dbService.getTirthankars(),
                    dbService.getReels(),
                    dbService.getChants(),
                    dbService.getWisdom(),
                ]);

                if (isMounted) {
                    setTirths(tirthsData);
                    setTirthankars(tirthankarsData);
                    setReelsCount(reelsData.length);
                    setChants(chantsData);
                    setWisdom(wisdomData);
                    setLoading(false);
                }
            } catch (err) {
                console.error('[HomeScreen] Error loading dashboard data:', err);
                if (isMounted) {
                    setLoading(false);
                }
            }
        };

        loadAllData();
        return () => {
            isMounted = false;
        };
    }, []);

    // Set daily rotating quote from wisdom dataset
    useEffect(() => {
        if (wisdom.length > 0) {
            const todayDate = new Date();
            const startOfYear = new Date(todayDate.getFullYear(), 0, 0);
            const diff = todayDate.getTime() - startOfYear.getTime();
            const oneDay = 1000 * 60 * 60 * 24;
            const dayOfYear = Math.floor(diff / oneDay);
            setActiveWisdomIndex(dayOfYear % wisdom.length);
        }
    }, [wisdom]);

    // Helper: Astronomical Lunar Month & Tithi Calculator (to synchronize with Panchang Card)
    const getLunarTithiAndMonth = (date: Date) => {
        const SYNODIC_MS = 29.530588853 * 24 * 60 * 60 * 1000;
        const baseNewMoon = new Date('2024-01-11T11:57:00Z');
        const diffMs = date.getTime() - baseNewMoon.getTime();

        let cyclePos = (diffMs % SYNODIC_MS) / SYNODIC_MS;
        if (cyclePos < 0) cyclePos += 1;

        const angle = cyclePos * 360;
        const tithiIndex = Math.floor(angle / 12);
        const isShukla = tithiIndex < 15;

        const paksha = isShukla ? 'Sud' : 'Vad';

        const tithiKeys = [
            'Prathama', 'Dwitiya', 'Tritiya', 'Chaturthi',
            'Panchami', 'Shashthi', 'Saptami', 'Ashtami',
            'Navami', 'Dashami', 'Ekadashi', 'Dwadashi',
            'Trayodashi', 'Chaturdashi', 'Purnima'
        ];

        const krishnaTithiKeys = [
            'Prathama', 'Dwitiya', 'Tritiya', 'Chaturthi',
            'Panchami', 'Shashthi', 'Saptami', 'Ashtami',
            'Navami', 'Dashami', 'Ekadashi', 'Dwadashi',
            'Trayodashi', 'Chaturdashi', 'Amavasya'
        ];

        const tithiKey = isShukla
            ? tithiKeys[tithiIndex]
            : krishnaTithiKeys[tithiIndex - 15];

        const monthNames = [
            'Posh', 'Maha', 'Fagun', 'Chaitra',
            'Vaishakha', 'Jyeshtha', 'Ashadha', 'Shravana',
            'Bhadrapada', 'Ashvina', 'Kartik', 'Magsar'
        ];

        const gregMonth = date.getMonth();
        const gregDay = date.getDate();

        let monthIdx = gregDay < 15 ? gregMonth : (gregMonth + 1) % 12;
        const monthName = monthNames[monthIdx];

        return { month: monthName, paksha, tithi: tithiKey };
    };

    // Authentic 24 Tirthankars' Kalyanak Tithis Map
    const KALYANAKS = [
        { tirthankarId: 1, month: 'Chaitra', paksha: 'Vad', tithi: 'Navami', type: 'Janma' },
        { tirthankarId: 1, month: 'Maha', paksha: 'Vad', tithi: 'Chaturdashi', type: 'Nirvana' },
        { tirthankarId: 2, month: 'Maha', paksha: 'Sud', tithi: 'Dashami', type: 'Janma' },
        { tirthankarId: 2, month: 'Chaitra', paksha: 'Sud', tithi: 'Panchami', type: 'Nirvana' },
        { tirthankarId: 3, month: 'Magsar', paksha: 'Sud', tithi: 'Purnima', type: 'Janma' },
        { tirthankarId: 3, month: 'Chaitra', paksha: 'Vad', tithi: 'Shashthi', type: 'Nirvana' },
        { tirthankarId: 4, month: 'Magsar', paksha: 'Sud', tithi: 'Dwitiya', type: 'Janma' },
        { tirthankarId: 4, month: 'Vaishakha', paksha: 'Sud', tithi: 'Shashthi', type: 'Nirvana' },
        { tirthankarId: 5, month: 'Vaishakha', paksha: 'Sud', tithi: 'Dwitiya', type: 'Janma' },
        { tirthankarId: 5, month: 'Chaitra', paksha: 'Vad', tithi: 'Ekadashi', type: 'Nirvana' },
        { tirthankarId: 6, month: 'Magsar', paksha: 'Vad', tithi: 'Dwadashi', type: 'Janma' },
        { tirthankarId: 6, month: 'Magsar', paksha: 'Vad', tithi: 'Ekadashi', type: 'Nirvana' },
        { tirthankarId: 7, month: 'Jyeshtha', paksha: 'Sud', tithi: 'Dwadashi', type: 'Janma' },
        { tirthankarId: 7, month: 'Fagun', paksha: 'Vad', tithi: 'Saptami', type: 'Nirvana' },
        { tirthankarId: 8, month: 'Posh', paksha: 'Vad', tithi: 'Dwadashi', type: 'Janma' },
        { tirthankarId: 8, month: 'Bhadrapada', paksha: 'Vad', tithi: 'Saptami', type: 'Nirvana' },
        { tirthankarId: 9, month: 'Magsar', paksha: 'Vad', tithi: 'Dwadashi', type: 'Janma' },
        { tirthankarId: 9, month: 'Magsar', paksha: 'Vad', tithi: 'Navami', type: 'Nirvana' },
        { tirthankarId: 10, month: 'Maha', paksha: 'Vad', tithi: 'Dwadashi', type: 'Janma' },
        { tirthankarId: 10, month: 'Vaishakha', paksha: 'Vad', tithi: 'Dwadashi', type: 'Nirvana' },
        { tirthankarId: 11, month: 'Fagun', paksha: 'Vad', tithi: 'Ekadashi', type: 'Janma' },
        { tirthankarId: 11, month: 'Shravana', paksha: 'Vad', tithi: 'Tritiya', type: 'Nirvana' },
        { tirthankarId: 12, month: 'Fagun', paksha: 'Vad', tithi: 'Chaturdashi', type: 'Janma' },
        { tirthankarId: 12, month: 'Ashadha', paksha: 'Vad', tithi: 'Chaturdashi', type: 'Nirvana' },
        { tirthankarId: 13, month: 'Maha', paksha: 'Sud', tithi: 'Ekadashi', type: 'Janma' },
        { tirthankarId: 13, month: 'Ashadha', paksha: 'Vad', tithi: 'Saptami', type: 'Nirvana' },
        { tirthankarId: 14, month: 'Vaishakha', paksha: 'Vad', tithi: 'Ekadashi', type: 'Janma' },
        { tirthankarId: 14, month: 'Chaitra', paksha: 'Vad', tithi: 'Chaturdashi', type: 'Nirvana' },
        { tirthankarId: 15, month: 'Maha', paksha: 'Sud', tithi: 'Tritiya', type: 'Janma' },
        { tirthankarId: 15, month: 'Jyeshtha', paksha: 'Vad', tithi: 'Ekadashi', type: 'Nirvana' },
        { tirthankarId: 16, month: 'Jyeshtha', paksha: 'Vad', tithi: 'Chaturdashi', type: 'Janma' },
        { tirthankarId: 16, month: 'Jyeshtha', paksha: 'Vad', tithi: 'Chaturdashi', type: 'Nirvana' },
        { tirthankarId: 17, month: 'Vaishakha', paksha: 'Vad', tithi: 'Chaturdashi', type: 'Janma' },
        { tirthankarId: 17, month: 'Vaishakha', paksha: 'Vad', tithi: 'Chaturdashi', type: 'Nirvana' },
        { tirthankarId: 18, month: 'Magsar', paksha: 'Vad', tithi: 'Dashami', type: 'Janma' },
        { tirthankarId: 18, month: 'Magsar', paksha: 'Vad', tithi: 'Dashami', type: 'Nirvana' },
        { tirthankarId: 19, month: 'Magsar', paksha: 'Sud', tithi: 'Ekadashi', type: 'Janma' },
        { tirthankarId: 19, month: 'Fagun', paksha: 'Vad', tithi: 'Dwitiya', type: 'Nirvana' },
        { tirthankarId: 20, month: 'Jyeshtha', paksha: 'Vad', tithi: 'Dashami', type: 'Janma' },
        { tirthankarId: 20, month: 'Jyeshtha', paksha: 'Vad', tithi: 'Navami', type: 'Nirvana' },
        { tirthankarId: 21, month: 'Shravana', paksha: 'Vad', tithi: 'Ashtami', type: 'Janma' },
        { tirthankarId: 21, month: 'Ashadha', paksha: 'Vad', tithi: 'Dashami', type: 'Nirvana' },
        { tirthankarId: 22, month: 'Shravana', paksha: 'Sud', tithi: 'Panchami', type: 'Janma' },
        { tirthankarId: 22, month: 'Ashadha', paksha: 'Sud', tithi: 'Saptami', type: 'Nirvana' },
        { tirthankarId: 23, month: 'Posh', paksha: 'Vad', tithi: 'Dashami', type: 'Janma' },
        { tirthankarId: 23, month: 'Shravana', paksha: 'Sud', tithi: 'Saptami', type: 'Nirvana' },
        { tirthankarId: 24, month: 'Chaitra', paksha: 'Sud', tithi: 'Trayodashi', type: 'Janma' },
        { tirthankarId: 24, month: 'Kartik', paksha: 'Vad', tithi: 'Amavasya', type: 'Nirvana' }
    ];

    const handleSelectChant = (index: number) => {
        setIsPlaying(false);
        setAudioProgress(0.0);
        setCurrentSeconds(0);
        setAudioDuration(0);
        setActiveChantIndex(index);
    };

    if (loading) {
        return (
            <View style={[styles.loadingContainer, { backgroundColor: '#FDFBF6' }]}>
                <StatusBar barStyle="dark-content" backgroundColor="#FDFBF6" />
                <ActivityIndicator size="large" color="#C8960C" />
                <Text style={styles.loadingText}>Opening Divine Gateway...</Text>
                <Text style={styles.loadingSubtext}>TirthDarshan Dashboard Loading</Text>
            </View>
        );
    }

    // Dynamic Spotlight Calculations
    const today = new Date();
    const lund = getLunarTithiAndMonth(today);
    
    // Look for matching Kalyanak today
    const activeKalyanak = KALYANAKS.find(k => 
        k.month.toLowerCase() === lund.month.toLowerCase() &&
        k.paksha.toLowerCase() === lund.paksha.toLowerCase() &&
        k.tithi.toLowerCase() === lund.tithi.toLowerCase()
    );

    let tirthankarOfTheDay = tirthankars[0];
    let kalyanakCelebrationText = '';

    if (activeKalyanak && tirthankars.length > 0) {
        const found = tirthankars.find(t => t.id === activeKalyanak.tirthankarId);
        if (found) {
            tirthankarOfTheDay = found;
            kalyanakCelebrationText = `🎉 Auspicious ${activeKalyanak.type} Kalyanak Today!`;
        }
    } else if (tirthankars.length > 0) {
        // Fallback: stable daily cycle based on day of year
        const startOfYear = new Date(today.getFullYear(), 0, 0);
        const diff = today.getTime() - startOfYear.getTime();
        const oneDay = 1000 * 60 * 60 * 24;
        const dayOfYear = Math.floor(diff / oneDay);
        
        const todayIndex = dayOfYear % tirthankars.length;
        tirthankarOfTheDay = tirthankars[todayIndex];
    }

    const popularTirths = tirths.slice(0, 5); // Take first 5 prominent ones

    return (
        <ScreenWrapper scroll backgroundColor="#FDFBF6">
            <StatusBar barStyle="dark-content" backgroundColor="#FDFBF6" />
            <View style={styles.container}>

                {/* ── HEADER SECTION ── */}
                <View style={styles.header}>
                    <View style={styles.headerTop}>
                        <View>
                            <Text style={styles.greeting}>🙏 Jai Jinendra</Text>
                            <Text style={styles.title}>TirthDarshan</Text>
                        </View>
                        <TouchableOpacity
                            style={styles.profileBadge}
                            activeOpacity={0.8}
                            onPress={() => nav.navigate('TirthankarList')}
                        >
                            <Text style={styles.profileEmoji}>🕉️</Text>
                        </TouchableOpacity>
                    </View>
                    <Text style={styles.subtitle}>
                        Explore Jain Tirths, Tirthankars & Spiritual Wisdom
                    </Text>
                </View>

                {/* ── DAILY JAIN PANCHANG CARD ── */}
                <PanchangCard />

                {/* ── QUICK ACTIONS GRID ── */}
                <Text style={styles.sectionTitle}>Explore Categories</Text>
                <View style={styles.grid}>
                    <TouchableOpacity
                        style={styles.card}
                        activeOpacity={0.8}
                        onPress={() => nav.navigate('TirthankarList')}
                    >
                        <View style={[styles.categoryBadge, { backgroundColor: '#FFF5D8', borderColor: '#FDF1D5' }]}>
                            <Text style={[styles.categoryBadgeText, { color: '#8B5E00' }]}>
                                {tirthankars.length || '24'}
                            </Text>
                        </View>
                        <View style={[styles.cardIconBox, { backgroundColor: '#FFF5D8' }]}>
                            <Text style={styles.cardEmoji}>🕉️</Text>
                        </View>
                        <Text style={styles.cardTitle}>24 Tirthankars</Text>
                        <Text style={styles.cardDesc}>Sacred profiles & teachings</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.card}
                        activeOpacity={0.8}
                        onPress={() => nav.navigate('TirthankarList')}
                    >
                        <View style={[styles.categoryBadge, { backgroundColor: '#E3F2FD', borderColor: '#BBDEFB' }]}>
                            <Text style={[styles.categoryBadgeText, { color: '#1565C0' }]}>
                                {tirths.length || '5'}
                            </Text>
                        </View>
                        <View style={[styles.cardIconBox, { backgroundColor: '#E3F2FD' }]}>
                            <Text style={styles.cardEmoji}>🏛️</Text>
                        </View>
                        <Text style={styles.cardTitle}>Holy Tirths</Text>
                        <Text style={styles.cardDesc}>Visit divine locations</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.card}
                        activeOpacity={0.8}
                        onPress={() => nav.navigate('Reels')}
                    >
                        <View style={[styles.categoryBadge, { backgroundColor: '#FFEAEF', borderColor: '#FFCDD2' }]}>
                            <Text style={[styles.categoryBadgeText, { color: '#C2185B' }]}>
                                {reelsCount || '3'}
                            </Text>
                        </View>
                        <View style={[styles.cardIconBox, { backgroundColor: '#FFEAEF' }]}>
                            <Text style={styles.cardEmoji}>▶️</Text>
                        </View>
                        <Text style={styles.cardTitle}>Sacred Reels</Text>
                        <Text style={styles.cardDesc}>Short spiritual videos</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.card}
                        activeOpacity={0.8}
                        onPress={() => {
                            // Find the first tirth with VR darshan
                            const vrTirth = tirths.find(t => t.hasVRDarshan);
                            if (vrTirth) {
                                nav.navigate('TirthDetail', { id: vrTirth.id });
                            }
                        }}
                    >
                        <View style={[styles.categoryBadge, { backgroundColor: '#EDE7F6', borderColor: '#D1C4E9' }]}>
                            <Text style={[styles.categoryBadgeText, { color: '#5E35B1' }]}>
                                {tirths.filter(t => t.hasVRDarshan).length || '0'}
                            </Text>
                        </View>
                        <View style={[styles.cardIconBox, { backgroundColor: '#EDE7F6' }]}>
                            <Text style={styles.cardEmoji}>🕶️</Text>
                        </View>
                        <Text style={styles.cardTitle}>VR Darshan</Text>
                        <Text style={styles.cardDesc}>360° virtual temple tours</Text>
                    </TouchableOpacity>
                </View>

                {/* ── FEATURED TIRTHS (HORIZONTAL SCROLL) ── */}
                <View style={styles.sectionHeaderRow}>
                    <Text style={styles.sectionTitle}>Featured Holy Tirths</Text>
                    <TouchableOpacity onPress={() => nav.navigate('TirthankarList')}>
                        <Text style={styles.seeAllText}>See All →</Text>
                    </TouchableOpacity>
                </View>

                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.tirthScrollContent}
                >
                    {popularTirths.map((tirth) => (
                        <TouchableOpacity
                            key={tirth.id}
                            style={styles.tirthHorizontalCard}
                            activeOpacity={0.9}
                            onPress={() => nav.navigate('TirthDetail', { id: tirth.id })}
                        >
                            <Image
                                source={{ uri: tirth.gallery[0] || 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b' }}
                                style={styles.tirthHorizontalImage as any}
                                resizeMode="cover"
                            />

                            {/* Inner Gradient Shade */}
                            <View style={styles.tirthHorizontalOverlay} />

                            {/* Top Left: VR Darshan Badge */}
                            <View style={styles.tirthHorizontalBadgeContainer}>
                                {tirth.hasVRDarshan && (
                                    <View style={styles.vrBadge}>
                                        <Text style={styles.vrBadgeText}>🕶️ VR Darshan</Text>
                                    </View>
                                )}
                            </View>

                            {/* Top Right: Best Season Badge */}
                            <View style={styles.tirthHorizontalRightBadgeContainer}>
                                <View style={styles.seasonBadge}>
                                    <Text style={styles.seasonBadgeText}>🍂 {tirth.bestTimeToVisit.split(' to ')[0] || tirth.bestTimeToVisit}</Text>
                                </View>
                            </View>

                            {/* Premium Translucent Bottom Info Panel */}
                            <View style={styles.tirthHorizontalInfo}>
                                <Text style={styles.tirthHorizontalTitle} numberOfLines={1}>
                                    {tirth.name}
                                </Text>
                                <Text style={styles.tirthHorizontalSub} numberOfLines={1}>
                                    📍 {tirth.location}, {tirth.state}
                                </Text>
                                <View style={styles.tirthHorizontalDivider} />
                                <Text style={styles.tirthHorizontalTirthankar} numberOfLines={1}>
                                    ✨ {getTirthankarName(tirth.tirthankarId)}
                                </Text>
                            </View>
                        </TouchableOpacity>
                    ))}
                </ScrollView>

                {/* ── TIRTHANKAR OF THE DAY SPOTLIGHT ── */}
                {tirthankarOfTheDay && (() => {
                    const associatedTirths = tirths.filter(t => t.tirthankarId === tirthankarOfTheDay.id);
                    const tirthColor = tirthankarOfTheDay.colorHex || '#C8960C';
                    
                    // Combine database Tirths with static famous ones to always have a rich chip selection
                    const chipsList = [
                        ...associatedTirths.map(t => ({ id: t.id, name: t.name, isReal: true })),
                        ...tirthankarOfTheDay.famousTirths
                            .filter(ft => !associatedTirths.some(at => at.name.includes(ft.split(' (')[0])))
                            .map((ft, idx) => ({ id: `famous-${idx}`, name: ft, isReal: false }))
                    ];

                    return (
                        <>
                            <Text style={styles.sectionTitle}>Tirthankar of the Day</Text>
                            <TouchableOpacity
                                style={[styles.spotlightCard, { borderColor: tirthColor + '30', shadowColor: tirthColor }]}
                                activeOpacity={0.955}
                                onPress={() => nav.navigate('TirthankarProfile', { id: tirthankarOfTheDay.id })}
                            >
                                <View style={styles.spotlightHeader}>
                                    <View style={[styles.spotlightEmojiContainer, { backgroundColor: tirthColor + '18', borderColor: tirthColor + '40' }]}>
                                        <Text style={styles.spotlightEmoji}>{tirthankarOfTheDay.symbolEmoji}</Text>
                                    </View>
                                    <View style={styles.spotlightMeta}>
                                        {kalyanakCelebrationText ? (
                                            <View style={[styles.spotlightBadge, { backgroundColor: '#FFECEC', borderColor: '#FFC1C1', borderWidth: 1 }]}>
                                                <Text style={[styles.spotlightBadgeText, { color: '#E53E3E' }]}>
                                                    {kalyanakCelebrationText}
                                                </Text>
                                            </View>
                                        ) : (
                                            <View style={[styles.spotlightBadge, { backgroundColor: tirthColor + '18' }]}>
                                                <Text style={[styles.spotlightBadgeText, { color: tirthColor }]}>✨ Daily Spotlight</Text>
                                            </View>
                                        )}
                                        <Text style={styles.spotlightName}>{tirthankarOfTheDay.name}</Text>
                                        <Text style={[styles.spotlightGuj, { color: tirthColor }]}>{tirthankarOfTheDay.nameGujarati}</Text>
                                    </View>
                                </View>

                                <View style={styles.divider} />

                                <View style={styles.spotlightRow}>
                                    <View style={styles.spotlightSpec}>
                                        <Text style={styles.spotlightSpecLabel}>Symbol</Text>
                                        <Text style={styles.spotlightSpecVal} numberOfLines={1}>
                                            {tirthankarOfTheDay.symbolEmoji} {tirthankarOfTheDay.symbol.split(' (')[0]}
                                        </Text>
                                    </View>
                                    <View style={styles.spotlightSpec}>
                                        <Text style={styles.spotlightSpecLabel}>Birth Place</Text>
                                        <Text style={styles.spotlightSpecVal} numberOfLines={1}>{tirthankarOfTheDay.birthPlace.split(',')[0]}</Text>
                                    </View>
                                    <View style={styles.spotlightSpec}>
                                        <Text style={styles.spotlightSpecLabel}>Live Temples</Text>
                                        <Text style={styles.spotlightSpecVal} numberOfLines={1}>
                                            🏛️ {associatedTirths.length} Holy Tirths
                                        </Text>
                                    </View>
                                </View>

                                {/* Dynamic, interactive teachings box */}
                                <View style={[styles.spotlightTeachingBox, { borderColor: tirthColor + '20' }]}>
                                    <Text style={styles.spotlightTeachingQuote}>
                                        " {tirthankarOfTheDay.teachings[activeTeachingIndex] || tirthankarOfTheDay.teachings[0]} "
                                    </Text>
                                    {tirthankarOfTheDay.teachings.length > 1 && (
                                        <TouchableOpacity
                                            style={[styles.teachingCycleBtn, { borderColor: tirthColor + '30', backgroundColor: tirthColor + '08' }]}
                                            activeOpacity={0.7}
                                            onPress={(e) => {
                                                e.stopPropagation();
                                                setActiveTeachingIndex((prev) =>
                                                    (prev + 1) % (tirthankarOfTheDay.teachings.length || 1)
                                                );
                                            }}
                                        >
                                            <Text style={[styles.teachingCycleText, { color: tirthColor }]}>
                                                ↻ Next Teaching ({activeTeachingIndex + 1}/{tirthankarOfTheDay.teachings.length})
                                            </Text>
                                        </TouchableOpacity>
                                    )}
                                </View>

                                {/* Horizontally Scrollable Sacred Chips List */}
                                {chipsList.length > 0 && (
                                    <View style={styles.tirthChipsSection}>
                                        <Text style={[styles.spotlightSpecLabel, { marginBottom: 6 }]}>🏛️ Sacred Holy Tirths & Temples</Text>
                                        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tirthChipsScroll}>
                                            {chipsList.map((item) => (
                                                <TouchableOpacity
                                                    key={item.id}
                                                    style={[styles.tirthChipButton, { borderColor: tirthColor + '30', backgroundColor: '#FFFFFF' }]}
                                                    activeOpacity={0.7}
                                                    disabled={!item.isReal}
                                                    onPress={(e) => {
                                                        e.stopPropagation();
                                                        if (item.isReal) {
                                                            nav.navigate('TirthDetail', { id: item.id });
                                                        }
                                                    }}
                                                >
                                                    <Text style={[styles.tirthChipText, { color: tirthColor }]}>
                                                        📍 {item.name}
                                                    </Text>
                                                </TouchableOpacity>
                                            ))}
                                        </ScrollView>
                                    </View>
                                )}

                                {/* Expandable Kalyanak Schedule Panel */}
                                <TouchableOpacity
                                    style={[styles.kalyanakToggle, { backgroundColor: tirthColor + '10', borderColor: tirthColor + '20' }]}
                                    activeOpacity={0.7}
                                    onPress={(e) => {
                                        e.stopPropagation();
                                        setShowKalyanaks(!showKalyanaks);
                                    }}
                                >
                                    <Text style={[styles.kalyanakToggleText, { color: tirthColor }]}>
                                        {showKalyanaks ? 'Hide Panch Kalyanak Locations ▴' : 'Show Panch Kalyanak Locations ▾'}
                                    </Text>
                                </TouchableOpacity>

                                {showKalyanaks && (
                                    <View style={styles.kalyanakTimelineContainer}>
                                        <View style={[styles.kalyanakTimelineLine, { backgroundColor: tirthColor + '30' }]} />
                                        
                                        <View style={styles.kalyanakTimelineNode}>
                                            <View style={[styles.kalyanakTimelineDot, { backgroundColor: tirthColor }]} />
                                            <View style={styles.kalyanakTimelineInfo}>
                                                <Text style={styles.kalyanakTimelineLabel}>🌟 Garbha (Conception)</Text>
                                                <Text style={styles.kalyanakTimelineValue}>{tirthankarOfTheDay.panchKalyanak.garbha || 'Ayodhya'}</Text>
                                            </View>
                                        </View>

                                        <View style={styles.kalyanakTimelineNode}>
                                            <View style={[styles.kalyanakTimelineDot, { backgroundColor: tirthColor }]} />
                                            <View style={styles.kalyanakTimelineInfo}>
                                                <Text style={styles.kalyanakTimelineLabel}>👶 Janma (Birth)</Text>
                                                <Text style={styles.kalyanakTimelineValue}>{tirthankarOfTheDay.panchKalyanak.janma}</Text>
                                            </View>
                                        </View>

                                        <View style={styles.kalyanakTimelineNode}>
                                            <View style={[styles.kalyanakTimelineDot, { backgroundColor: tirthColor }]} />
                                            <View style={styles.kalyanakTimelineInfo}>
                                                <Text style={styles.kalyanakTimelineLabel}>🧘 Diksha (Renunciation)</Text>
                                                <Text style={styles.kalyanakTimelineValue}>{tirthankarOfTheDay.panchKalyanak.diksha}</Text>
                                            </View>
                                        </View>

                                        <View style={styles.kalyanakTimelineNode}>
                                            <View style={[styles.kalyanakTimelineDot, { backgroundColor: tirthColor }]} />
                                            <View style={styles.kalyanakTimelineInfo}>
                                                <Text style={styles.kalyanakTimelineLabel}>💡 Kevalgyan (Omniscience)</Text>
                                                <Text style={styles.kalyanakTimelineValue}>{tirthankarOfTheDay.panchKalyanak.kevalgyan}</Text>
                                            </View>
                                        </View>

                                        <View style={styles.kalyanakTimelineNode}>
                                            <View style={[styles.kalyanakTimelineDot, { backgroundColor: tirthColor }]} />
                                            <View style={styles.kalyanakTimelineInfo}>
                                                <Text style={styles.kalyanakTimelineLabel}>🕉️ Nirvana (Liberation)</Text>
                                                <Text style={styles.kalyanakTimelineValue}>{tirthankarOfTheDay.panchKalyanak.nirvana.split(' (')[0]}</Text>
                                            </View>
                                        </View>
                                    </View>
                                )}

                                <View style={styles.divider} />

                                <View style={styles.spotlightFooter}>
                                    <Text style={styles.spotlightFooterText}>Tap to learn full sacred profile</Text>
                                    <Text style={[styles.spotlightArrow, { color: tirthColor }]}>→</Text>
                                </View>
                            </TouchableOpacity>
                        </>
                    );
                })()}

                {/* ── SACRED AUDIO PLAYER WIDGET ── */}
                <Text style={styles.sectionTitle}>Spiritual Chants & Shloka</Text>
                {chants.length > 0 && (() => {
                    const activeChant = chants[activeChantIndex] || chants[0];
                    const chantColor = activeChant.accentColor || '#C8960C';
                    return (
                        <View style={[styles.audioCard, { backgroundColor: chantColor }]}>
                            {/* Horizontal scroll tabs for chants selector */}
                            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chantsTabContainer}>
                                {chants.map((item, idx) => {
                                    const isActive = idx === activeChantIndex;
                                    return (
                                        <TouchableOpacity
                                            key={item.id}
                                            style={[
                                                styles.chantTabButton,
                                                isActive && { backgroundColor: '#FFFFFF', borderColor: '#FFFFFF' }
                                            ]}
                                            activeOpacity={0.8}
                                            onPress={() => handleSelectChant(idx)}
                                        >
                                            <Text style={[
                                                styles.chantTabText,
                                                { color: isActive ? chantColor : 'rgba(255, 255, 255, 0.75)' },
                                                isActive && { fontWeight: '800' }
                                            ]}>
                                                {item.title.split(' ').slice(1).join(' ') || item.title.split(' ')[0]}
                                            </Text>
                                        </TouchableOpacity>
                                    );
                                })}
                            </ScrollView>

                            <View style={styles.audioHeader}>
                                <View style={styles.audioTitleContainer}>
                                    <Text style={styles.audioLabel}>🎼 SACRED {activeChant.category.toUpperCase()}</Text>
                                    <Text style={styles.audioTitle}>{activeChant.title}</Text>
                                    <Text style={{ color: 'rgba(255, 255, 255, 0.75)', fontSize: 11, marginTop: 2, fontWeight: '600' }}>
                                        {activeChant.subtitle}
                                    </Text>
                                </View>
                                <TouchableOpacity
                                    style={styles.playButton}
                                    activeOpacity={0.8}
                                    onPress={() => setIsPlaying(!isPlaying)}
                                >
                                    <Text style={[styles.playButtonText, { color: chantColor, fontWeight: '800' }]}>
                                        {isPlaying ? '⏸' : '▶️'}
                                    </Text>
                                </TouchableOpacity>
                            </View>

                            {/* Dynamic react-native-video audio engine with position-based resume */}
                            <Video
                                ref={videoRef}
                                source={{ uri: activeChant.audioUrl }}
                                paused={!isPlaying}
                                playInBackground={false}
                                playWhenInactive={false}
                                ignoreSilentSwitch="ignore"
                                onLoad={(data) => {
                                    setAudioDuration(data.duration);
                                    const lastPos = savedPositions[activeChant.id] || 0;
                                    if (lastPos > 0 && lastPos < data.duration) {
                                        videoRef.current?.seek(lastPos);
                                        setCurrentSeconds(lastPos);
                                        setAudioProgress(lastPos / data.duration);
                                    } else {
                                        setCurrentSeconds(0);
                                        setAudioProgress(0);
                                    }
                                }}
                                onProgress={(data) => {
                                    if (data.playableDuration > 0 || data.seekableDuration > 0) {
                                        const total = data.seekableDuration || data.playableDuration || activeChant.durationSec || 30;
                                        const progress = data.currentTime / total;
                                        setAudioProgress(progress);
                                        setCurrentSeconds(data.currentTime);
                                        
                                        if (progress < 0.98) {
                                            setSavedPositions(prev => ({
                                                ...prev,
                                                [activeChant.id]: data.currentTime
                                            }));
                                        }
                                    }
                                }}
                                onEnd={() => {
                                    setSavedPositions(prev => ({ ...prev, [activeChant.id]: 0 }));
                                    setIsPlaying(false);
                                    setAudioProgress(0.0);
                                    setCurrentSeconds(0);
                                }}
                                onError={(err) => {
                                    console.error('[AudioPlayer] Audio streaming error:', err);
                                    setIsPlaying(false);
                                }}
                                style={{ width: 0, height: 0, position: 'absolute' }}
                            />

                            {/* Progress Bar */}
                            <View style={styles.progressContainer}>
                                <View style={styles.progressBarBg}>
                                    <View style={[styles.progressBarFill, { width: `${audioProgress * 100}%`, backgroundColor: '#FFFFFF' }]} />
                                </View>
                                <View style={styles.timeRow}>
                                    <Text style={[styles.timeText, { color: 'rgba(255, 255, 255, 0.85)' }]}>
                                        {currentSeconds > 0
                                            ? `${Math.floor(currentSeconds / 60)}:${Math.floor(currentSeconds % 60).toString().padStart(2, '0')}`
                                            : '0:00'}
                                    </Text>
                                    <Text style={[styles.timeText, { color: 'rgba(255, 255, 255, 0.85)' }]}>
                                        {audioDuration > 0
                                            ? `${Math.floor(audioDuration / 60)}:${Math.floor(audioDuration % 60).toString().padStart(2, '0')}`
                                            : `${Math.floor(activeChant.durationSec / 60)}:${Math.floor(activeChant.durationSec % 60).toString().padStart(2, '0')}`}
                                    </Text>
                                </View>
                            </View>

                            {/* Sanskrit Chants */}
                            <View style={styles.lyricsContainer}>
                                <Text style={styles.sanskritText}>
                                    {activeChant.lyrics}
                                </Text>
                            </View>

                            {/* Significance Box */}
                            <Text style={{ color: 'rgba(255, 255, 255, 0.9)', fontSize: 11, fontStyle: 'italic', paddingHorizontal: 4, lineHeight: 16, marginBottom: 12, textAlign: 'center', fontWeight: '500' }}>
                                {activeChant.significance}
                            </Text>

                            {/* Dynamic Expansion Toggle */}
                            <TouchableOpacity
                                style={styles.expandToggle}
                                activeOpacity={0.7}
                                onPress={() => setShowTranslation(!showTranslation)}
                            >
                                <Text style={[styles.expandToggleText, { color: '#FFFFFF', fontWeight: '700' }]}>
                                    {showTranslation ? 'Hide Deep Translation ▴' : 'Show Word-by-Word Meaning ▾'}
                                </Text>
                            </TouchableOpacity>

                            {showTranslation && (
                                <View style={styles.translationContainer}>
                                    {activeChant.translation.map((verse, index) => (
                                        <Text key={index} style={styles.translationVerse}>
                                            • {verse}
                                        </Text>
                                    ))}
                                </View>
                            )}
                        </View>
                    );
                })()}

                {/* ── DAILY THOUGHT & WISDOM CARD ── */}
                <Text style={styles.sectionTitle}>Daily Wisdom</Text>
                {wisdom.length > 0 && (() => {
                    const activeQuote = wisdom[activeWisdomIndex] || wisdom[0];
                    const qColor = activeQuote.themeColor || '#C8960C';
                    return (
                        <TouchableOpacity
                            style={[
                                styles.quoteCard,
                                { 
                                    borderColor: qColor + '25',
                                    backgroundColor: '#FFFFFF',
                                    shadowColor: qColor,
                                    shadowOffset: { width: 0, height: 4 },
                                    shadowOpacity: 0.12,
                                    shadowRadius: 10,
                                    elevation: 3,
                                }
                            ]}
                            activeOpacity={0.96}
                            onPress={() => {
                                // Tap to browse/cycle next quotes dynamically
                                setActiveWisdomIndex((prev) => (prev + 1) % wisdom.length);
                            }}
                        >
                            {/* Decorative Quotation Mark */}
                            <Text style={[styles.quoteMark, { color: qColor + '10', fontSize: 72, top: -15, left: 10 }]}>“</Text>

                            {/* Top row: Scripture Source Pill */}
                            {activeQuote.source && (
                                <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginBottom: 8 }}>
                                    <View style={{ 
                                        backgroundColor: qColor + '0d', 
                                        borderColor: qColor + '25', 
                                        borderWidth: 1, 
                                        borderRadius: 12, 
                                        paddingHorizontal: 10, 
                                        paddingVertical: 3 
                                    }}>
                                        <Text style={{ fontSize: 9, color: qColor, fontWeight: '800', letterSpacing: 0.5, textTransform: 'uppercase' }}>
                                            📜 {activeQuote.source}
                                        </Text>
                                    </View>
                                </View>
                            )}

                            {/* Quote Text */}
                            <Text style={[
                                styles.quoteText, 
                                { 
                                    color: '#3D2F15', 
                                    lineHeight: 22, 
                                    fontSize: 13.5, 
                                    paddingRight: 6,
                                    marginTop: activeQuote.source ? 0 : 8
                                }
                            ]}>
                                "{activeQuote.text}"
                            </Text>

                            {/* Subtle Divider */}
                            <View style={{ height: 1, backgroundColor: qColor + '15', marginVertical: 14 }} />

                            {/* Footer Row */}
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: qColor, marginRight: 8 }} />
                                    <Text style={{ fontSize: 12, fontWeight: '800', color: '#4B381A' }}>
                                        {activeQuote.author}
                                    </Text>
                                </View>

                                <View style={{ 
                                    backgroundColor: '#FFFDF9', 
                                    borderColor: qColor + '30', 
                                    borderWidth: 1, 
                                    borderRadius: 10, 
                                    paddingHorizontal: 8, 
                                    paddingVertical: 4,
                                    flexDirection: 'row',
                                    alignItems: 'center'
                                }}>
                                    <Text style={{ fontSize: 9, fontWeight: '800', color: qColor }}>
                                        ↻ Cycle Verse ({activeWisdomIndex + 1}/{wisdom.length})
                                    </Text>
                                </View>
                            </View>
                        </TouchableOpacity>
                    );
                })()}

                {/* ── FOOTER ── */}
                <View style={styles.footerContainer}>
                    <Text style={styles.footerLine}>🕉️ TirthDarshan</Text>
                    <Text style={styles.footerSub}>Samyak Gyan • Samyak Darshan • Samyak Charitra</Text>
                </View>

            </View>
        </ScreenWrapper>
    );
};

const styles = StyleSheet.create({
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        fontSize: 16,
        color: '#8B5E00',
        fontWeight: '700',
        marginTop: 14,
    },
    loadingSubtext: {
        fontSize: 13,
        color: '#8A8A8A',
        marginTop: 4,
    },
    container: {
        padding: 16,
        paddingBottom: 40,
    },

    // Header
    header: {
        marginTop: Platform.OS === 'ios' ? 8 : 16,
        marginBottom: 20,
    },
    headerTop: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    profileBadge: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: '#FFF8E7',
        borderWidth: 1,
        borderColor: '#F1E4C7',
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 2,
    },
    profileEmoji: {
        fontSize: 20,
    },
    greeting: {
        fontSize: 13,
        color: '#C8960C',
        fontWeight: '700',
        textTransform: 'uppercase',
        letterSpacing: 1.2,
        marginBottom: 4,
    },
    title: {
        fontSize: 32,
        fontWeight: '900',
        color: '#5B3A00',
        letterSpacing: 0.5,
    },
    subtitle: {
        fontSize: 13,
        color: '#6B7280',
        marginTop: 6,
        lineHeight: 18,
    },


    // Horizontal Scroll Featured Tirths
    sectionHeaderRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    seeAllText: {
        fontSize: 12,
        color: '#C8960C',
        fontWeight: '700',
    },
    tirthScrollContent: {
        paddingRight: 16,
        paddingBottom: 8,
        marginBottom: 24,
    },
    tirthHorizontalCard: {
        width: width * 0.65,
        height: 180,
        borderRadius: 20,
        backgroundColor: '#FFF',
        marginRight: 14,
        overflow: 'hidden',
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
    },
    tirthHorizontalImage: {
        width: '100%',
        height: '100%',
    },
    tirthHorizontalOverlay: {
        ...StyleSheet.absoluteFill,
        backgroundColor: 'rgba(0, 0, 0, 0.18)', // Soft dark shade overlay for visual depth
    },
    tirthHorizontalBadgeContainer: {
        position: 'absolute',
        top: 12,
        left: 12,
    },
    vrBadge: {
        backgroundColor: 'rgba(200, 150, 12, 0.9)',
        borderRadius: 8,
        paddingHorizontal: 8,
        paddingVertical: 4,
    },
    vrBadgeText: {
        color: '#FFF',
        fontSize: 9,
        fontWeight: '800',
    },
    tirthHorizontalRightBadgeContainer: {
        position: 'absolute',
        top: 12,
        right: 12,
    },
    seasonBadge: {
        backgroundColor: 'rgba(255, 255, 255, 0.88)',
        borderRadius: 8,
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.3)',
    },
    seasonBadgeText: {
        color: '#8B5E00',
        fontSize: 9,
        fontWeight: '800',
    },
    tirthHorizontalInfo: {
        position: 'absolute',
        bottom: 12,
        left: 12,
        right: 12,
        backgroundColor: 'rgba(255, 255, 255, 0.92)', // Beautiful frosted glass panel
        borderRadius: 14,
        padding: 10,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.4)',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 3,
    },
    tirthHorizontalTitle: {
        color: '#5B3A00', // Signature gold-brown
        fontSize: 14,
        fontWeight: '800',
    },
    tirthHorizontalSub: {
        color: '#8A8A8A',
        fontSize: 10,
        marginTop: 2,
        fontWeight: '600',
    },
    tirthHorizontalDivider: {
        height: 1,
        backgroundColor: '#F3E8D0',
        marginVertical: 6,
    },
    tirthHorizontalTirthankar: {
        fontSize: 9,
        color: '#C8960C',
        fontWeight: '800',
        textTransform: 'uppercase',
        letterSpacing: 0.3,
    },

    // Spotlight Card
    spotlightCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 22,
        padding: 18,
        borderWidth: 1.5,
        borderColor: '#F1E4C7',
        marginBottom: 24,
        elevation: 4,
        shadowColor: '#8B5E00',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 10,
    },
    spotlightHeader: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    spotlightEmojiContainer: {
        width: 60,
        height: 60,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#F3E8D0',
    },
    spotlightEmoji: {
        fontSize: 32,
    },
    spotlightMeta: {
        marginLeft: 14,
        flex: 1,
    },
    spotlightBadge: {
        backgroundColor: '#FFF5D8',
        borderRadius: 8,
        paddingHorizontal: 8,
        paddingVertical: 3,
        alignSelf: 'flex-start',
        marginBottom: 4,
    },
    spotlightBadgeText: {
        fontSize: 9,
        fontWeight: '800',
        color: '#C8960C',
        letterSpacing: 0.3,
    },
    spotlightName: {
        fontSize: 19,
        fontWeight: '800',
        color: '#5B3A00',
    },
    spotlightGuj: {
        fontSize: 12,
        color: '#C8960C',
        fontWeight: '600',
        marginTop: 2,
    },
    spotlightRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 12,
        marginBottom: 12,
    },
    spotlightSpec: {
        flex: 1,
        paddingRight: 6,
    },
    spotlightSpecLabel: {
        fontSize: 10,
        color: '#9CA3AF',
        fontWeight: '600',
        marginBottom: 2,
    },
    spotlightSpecVal: {
        fontSize: 12,
        fontWeight: '700',
        color: '#5B3A00',
    },
    spotlightTeachingBox: {
        backgroundColor: '#FFFDF9',
        borderWidth: 1,
        borderColor: '#FDF1D5',
        borderRadius: 14,
        padding: 14,
        marginBottom: 14,
    },
    spotlightTeachingQuote: {
        fontSize: 13,
        color: '#6B4F00',
        lineHeight: 18,
        fontStyle: 'italic',
        fontWeight: '500',
    },
    spotlightFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: 8,
    },
    spotlightFooterText: {
        fontSize: 11,
        color: '#9CA3AF',
        fontWeight: '700',
    },
    spotlightArrow: {
        fontSize: 16,
        color: '#C8960C',
        fontWeight: '800',
    },

    // Category Grid
    sectionTitle: {
        fontSize: 16,
        color: '#7A7A7A',
        fontWeight: '800',
        marginBottom: 14,
        letterSpacing: 0.6,
        textTransform: 'uppercase',
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        marginBottom: 24,
    },
    card: {
        width: '48%',
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        padding: 14,
        marginBottom: 14,
        borderWidth: 1,
        borderColor: '#F3E8D0',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 3,
    },
    cardIconBox: {
        width: 40,
        height: 40,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 12,
    },
    cardEmoji: {
        fontSize: 20,
    },
    cardTitle: {
        fontSize: 14,
        color: '#8B5E00',
        fontWeight: '800',
        marginBottom: 4,
    },
    cardDesc: {
        fontSize: 11,
        color: '#7A7A7A',
        lineHeight: 15,
        fontWeight: '500',
    },

    // Audio Player Card
    audioCard: {
        backgroundColor: '#5B3A00',
        borderRadius: 22,
        padding: 18,
        marginBottom: 24,
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
    },
    audioHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 14,
    },
    audioTitleContainer: {
        flex: 1,
        paddingRight: 10,
    },
    audioLabel: {
        color: '#E0A96D',
        fontSize: 9,
        fontWeight: '800',
        letterSpacing: 1.2,
        marginBottom: 4,
    },
    audioTitle: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: '800',
    },
    playButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: '#FFF',
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 2,
    },
    pauseButton: {
        backgroundColor: '#E0A96D',
    },
    playButtonText: {
        fontSize: 18,
        color: '#5B3A00',
    },
    progressContainer: {
        marginBottom: 14,
    },
    progressBarBg: {
        height: 4,
        backgroundColor: 'rgba(255, 255, 255, 0.15)',
        borderRadius: 2,
        overflow: 'hidden',
    },
    progressBarFill: {
        height: '100%',
        backgroundColor: '#E0A96D',
    },
    timeRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 6,
    },
    timeText: {
        color: '#D4AF37',
        fontSize: 10,
        fontWeight: '600',
    },
    lyricsContainer: {
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        borderRadius: 14,
        padding: 14,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.08)',
    },
    sanskritText: {
        color: '#FFF8E7',
        fontSize: 15,
        lineHeight: 24,
        fontWeight: '700',
        textAlign: 'center',
    },
    expandToggle: {
        alignSelf: 'center',
        paddingVertical: 6,
        paddingHorizontal: 12,
    },
    expandToggleText: {
        color: '#E0A96D',
        fontSize: 11,
        fontWeight: '700',
    },
    translationContainer: {
        marginTop: 10,
        paddingTop: 10,
        borderTopWidth: 1,
        borderTopColor: 'rgba(255, 255, 255, 0.1)',
    },
    translationVerse: {
        color: '#FFF',
        fontSize: 11,
        lineHeight: 16,
        marginBottom: 8,
        fontWeight: '500',
    },

    // Quote Card
    quoteCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        padding: 20,
        borderWidth: 1,
        borderColor: '#F1E4C7',
        marginBottom: 24,
        overflow: 'hidden',
        elevation: 2,
    },
    quoteMark: {
        fontSize: 48,
        color: '#F1E4C7',
        position: 'absolute',
        top: -10,
        left: 12,
        fontWeight: '800',
    },
    quoteText: {
        fontSize: 14,
        color: '#5B3A00',
        fontWeight: '600',
        lineHeight: 22,
        fontStyle: 'italic',
        zIndex: 1,
    },
    quoteAuthor: {
        marginTop: 12,
        color: '#C8960C',
        fontSize: 12,
        fontWeight: '700',
        textAlign: 'right',
    },

    // Dividers
    divider: {
        height: 1,
        backgroundColor: '#F3E8D0',
        marginVertical: 12,
    },
    verticalDivider: {
        width: 1,
        height: 24,
        backgroundColor: '#F3E8D0',
    },

    // Category Badge
    categoryBadge: {
        position: 'absolute',
        top: 12,
        right: 12,
        borderRadius: 10,
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderWidth: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    categoryBadgeText: {
        fontSize: 10,
        fontWeight: '800',
    },

    // Spotlight Interactive Elements
    teachingCycleBtn: {
        marginTop: 10,
        backgroundColor: '#FFFDF9',
        borderWidth: 1,
        borderColor: '#FDF1D5',
        borderRadius: 8,
        paddingVertical: 6,
        paddingHorizontal: 12,
        alignSelf: 'flex-start',
    },
    teachingCycleText: {
        fontSize: 10,
        fontWeight: '800',
        color: '#C8960C',
    },
    kalyanakToggle: {
        alignSelf: 'center',
        paddingVertical: 8,
        paddingHorizontal: 16,
        backgroundColor: '#FFF8E7',
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#FDF1D5',
        marginBottom: 12,
    },
    kalyanakToggleText: {
        fontSize: 11,
        fontWeight: '800',
        color: '#8B5E00',
    },
    kalyanakContainer: {
        backgroundColor: '#FFFDF9',
        borderRadius: 14,
        borderWidth: 1,
        borderColor: '#FDF1D5',
        padding: 12,
        marginBottom: 12,
        gap: 6,
    },
    kalyanakRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 4,
        borderBottomWidth: 0.5,
        borderBottomColor: '#FDF1D5',
    },
    kalyanakLabel: {
        fontSize: 11,
        fontWeight: '800',
        color: '#8B5E00',
    },
    kalyanakValue: {
        fontSize: 11,
        fontWeight: '700',
        color: '#5B3A00',
        flex: 1,
        textAlign: 'right',
        marginLeft: 20,
    },

    // Footer
    footerContainer: {
        alignItems: 'center',
        marginTop: 20,
        marginBottom: 20,
    },
    footerLine: {
        color: '#A68A54',
        fontSize: 14,
        fontWeight: '700',
        letterSpacing: 1.5,
    },
    footerSub: {
        color: '#BDBDBD',
        fontSize: 9,
        fontWeight: '600',
        marginTop: 6,
        textTransform: 'uppercase',
        letterSpacing: 0.8,
    },

    // Upgraded interactive temple chips styles
    tirthChipsSection: {
        marginTop: 14,
        marginBottom: 8,
    },
    tirthChipsScroll: {
        paddingVertical: 4,
    },
    tirthChipButton: {
        borderWidth: 1,
        borderRadius: 16,
        paddingHorizontal: 12,
        paddingVertical: 6,
        marginRight: 8,
        elevation: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
    },
    tirthChipText: {
        fontSize: 10,
        fontWeight: '800',
        letterSpacing: 0.2,
    },

    // Expanded Panch Kalyanak timeline path
    kalyanakTimelineContainer: {
        backgroundColor: '#FFFDF9',
        borderRadius: 14,
        borderWidth: 1,
        borderColor: '#FDF1D5',
        padding: 16,
        marginBottom: 12,
        position: 'relative',
    },
    kalyanakTimelineLine: {
        position: 'absolute',
        left: 20,
        top: 24,
        bottom: 24,
        width: 1.5,
        backgroundColor: '#F3E8D0',
    },
    kalyanakTimelineNode: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
        position: 'relative',
    },
    kalyanakTimelineDot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        marginLeft: 6,
        marginRight: 16,
        zIndex: 2,
    },
    kalyanakTimelineInfo: {
        flex: 1,
    },
    kalyanakTimelineLabel: {
        fontSize: 11,
        fontWeight: '800',
        color: '#8B5E00',
    },
    kalyanakTimelineValue: {
        fontSize: 11,
        fontWeight: '700',
        color: '#5B3A00',
        marginTop: 2,
    },

    // Audio chants tabs styles
    chantsTabContainer: {
        flexDirection: 'row',
        marginBottom: 16,
    },
    chantTabButton: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 14,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.25)',
        backgroundColor: 'rgba(255, 255, 255, 0.08)',
        marginRight: 8,
    },
    chantTabActiveButton: {
        backgroundColor: '#FFFFFF',
        borderColor: '#FFFFFF',
    },
    chantTabText: {
        color: '#E0A96D',
        fontSize: 11,
        fontWeight: '700',
    },
});