import React, { useState, useEffect } from 'react';
import {
    ScrollView,
    View,
    Text,
    Image,
    StyleSheet,
    TouchableOpacity,
    Dimensions,
    FlatList,
    Platform,
    GestureResponderEvent,
    ActivityIndicator,
} from 'react-native';
import Video from 'react-native-video';
import {
    useNavigation,
    useRoute,
    RouteProp,
} from '@react-navigation/native';
import { Tirth } from '../data/tirths';
import { dbService } from '../services/dbService';
import ScreenWrapper from '../components/ScreenWrapper';

const { width } = Dimensions.get('window');

/* ---------------- TYPES ---------------- */

type RootStackParamList = {
    TirthDetail: {
        id: string;
    };
};

type TirthDetailRouteProp = RouteProp<RootStackParamList, 'TirthDetail'>;

type TabKey = 'info' | 'reach' | 'gallery' | 'vr';

type TabProps = {
    label: string;
    active: boolean;
    icon: string;
    onPress: (event: GestureResponderEvent) => void;
};

type InfoCardProps = {
    title: string;
    value: string;
};

/* ---------------- COMPONENTS ---------------- */

const Tab = ({ label, active, onPress, icon }: TabProps) => (
    <TouchableOpacity
        style={[s.tab, active && s.tabActive]}
        onPress={onPress}
        activeOpacity={0.8}
    >
        <Text style={s.tabIcon}>{icon}</Text>
        <Text style={[s.tabText, active && s.tabTextActive]}>
            {label}
        </Text>
    </TouchableOpacity>
);

const InfoCard = ({ title, value }: InfoCardProps) => (
    <View style={s.infoCard}>
        <Text style={s.infoTitle}>{title}</Text>
        <Text style={s.infoValue}>{value}</Text>
    </View>
);

/* ---------------- SCREEN ---------------- */

export const TirthDetailScreen = () => {
    const nav = useNavigation();
    const { params } = useRoute<TirthDetailRouteProp>();
    const [tirth, setTirth] = useState<Tirth | null>(null);
    const [loading, setLoading] = useState(true);
    const [tab, setTab] = useState<TabKey>('info');
    const [vrActive, setVrActive] = useState(false);

    useEffect(() => {
        let isMounted = true;
        setLoading(true);
        dbService.getTirthById(params.id).then(res => {
            if (isMounted) {
                setTirth(res);
                setLoading(false);
            }
        });
        return () => {
            isMounted = false;
        };
    }, [params.id]);

    if (loading) {
        return (
            <ScreenWrapper backgroundColor="#FDFBF6">
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <ActivityIndicator size="large" color="#C8960C" />
                    <Text style={{ fontSize: 15, color: '#8B5E00', fontWeight: '700', marginTop: 14 }}>
                        Entering holy sanctuary...
                    </Text>
                </View>
            </ScreenWrapper>
        );
    }

    if (!tirth) {
        return (
            <ScreenWrapper backgroundColor="#FDFBF6">
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <Text style={{ color: '#7A7A7A', fontSize: 16 }}>Tirth not found</Text>
                </View>
            </ScreenWrapper>
        );
    }

    const TABS: { key: TabKey; label: string; icon: string }[] = [
        { key: 'info', label: 'Info', icon: '📜' },
        { key: 'reach', label: 'Reach', icon: '🚗' },
        { key: 'gallery', label: 'Photos', icon: '🖼️' },
        { key: 'vr', label: 'VR', icon: '🕶️' },
    ];

    return (
        <ScreenWrapper backgroundColor="#FDFBF6">
            {/* Header */}
            <View style={s.topBar}>
                <TouchableOpacity style={s.iconBtn} onPress={() => nav.goBack()}>
                    <Text style={s.iconText}>←</Text>
                </TouchableOpacity>

                <Text style={s.topTitle} numberOfLines={1}>
                    {tirth.name}
                </Text>

                <View style={s.iconBtnPlaceholder} />
            </View>

            <ScrollView
                style={s.container}
                stickyHeaderIndices={[2]}
                showsVerticalScrollIndicator={false}
            >
                {/* Hero Slider */}
                <FlatList
                    data={tirth.gallery}
                    horizontal
                    pagingEnabled
                    keyExtractor={(_, i) => String(i)}
                    showsHorizontalScrollIndicator={false}
                    renderItem={({ item }) => (
                        <Image
                            source={{ uri: item }}
                            style={s.heroImage}
                            resizeMode="cover"
                        />
                    )}
                />

                {/* Hero Content */}
                <View style={s.heroContent}>
                    <View style={s.badge}>
                        <Text style={s.badgeText}>🛕 Sacred Jain Tirth</Text>
                    </View>

                    <Text style={s.name}>{tirth.name}</Text>

                    <Text style={s.location}>
                        📍 {tirth.location}, {tirth.state}
                    </Text>

                    <View style={s.quickRow}>
                        <InfoCard title="Nearest City" value={tirth.nearestCity} />
                        <InfoCard title="Best Season" value={tirth.bestTimeToVisit} />
                    </View>
                </View>

                {/* Tabs */}
                <View style={s.tabsWrap}>
                    <View style={s.tabs}>
                        {TABS.map(item => (
                            <Tab
                                key={item.key}
                                label={item.label}
                                icon={item.icon}
                                active={tab === item.key}
                                onPress={() => setTab(item.key)}
                            />
                        ))}
                    </View>
                </View>

                {/* Content */}
                <View style={s.content}>
                    {tab === 'info' && (
                        <>
                            <View style={s.card}>
                                <Text style={s.sectionTitle}>📜 History</Text>
                                <Text style={s.body}>{tirth.history}</Text>
                            </View>

                            <View style={s.card}>
                                <Text style={s.sectionTitle}>✨ Spiritual Mahima</Text>
                                <Text style={s.body}>{tirth.mahima}</Text>
                            </View>
                        </>
                    )}

                    {tab === 'reach' &&
                        (['road', 'rail', 'air'] as const).map(mode => (
                            <View key={mode} style={s.transportCard}>
                                <Text style={s.transportEmoji}>
                                    {mode === 'road'
                                        ? '🚌'
                                        : mode === 'rail'
                                            ? '🚆'
                                            : '✈️'}
                                </Text>

                                <View style={{ flex: 1 }}>
                                    <Text style={s.transportTitle}>
                                        {mode.toUpperCase()}
                                    </Text>

                                    <Text style={s.body}>
                                        {tirth.howToReach[mode]}
                                    </Text>
                                </View>
                            </View>
                        ))}

                    {tab === 'gallery' && (
                        <View style={s.galleryGrid}>
                            {tirth.gallery.map((img, i) => (
                                <Image
                                    key={i}
                                    source={{ uri: img }}
                                    style={s.thumb}
                                />
                            ))}
                        </View>
                    )}

                    {tab === 'vr' && (
                        <View style={s.card}>
                            {tirth.hasVRDarshan ? (
                                <>
                                    <Text style={s.sectionTitle}>🕶️ 360° VR Darshan</Text>

                                    <Text style={s.body}>
                                        Experience immersive temple darshan.
                                    </Text>

                                    <TouchableOpacity
                                        style={s.vrBtn}
                                        onPress={() => setVrActive(true)}
                                    >
                                        <Text style={s.vrBtnText}>
                                            Enter VR Darshan
                                        </Text>
                                    </TouchableOpacity>

                                    {vrActive && (
                                        <Video
                                            source={{ uri: tirth.vrDarshanUrl! }}
                                            style={s.vrPlayer}
                                            controls
                                            resizeMode="cover"
                                        />
                                    )}
                                </>
                            ) : (
                                <>
                                    <Text style={s.sectionTitle}>🕶️ VR Darshan</Text>
                                    <Text style={s.body}>
                                        Coming soon for this Tirth.
                                    </Text>
                                </>
                            )}
                        </View>
                    )}
                </View>

                <Text style={s.footer}>🕉️ Jai Jinendra</Text>
            </ScrollView>
        </ScreenWrapper>
    );
};

/* ---------------- STYLES ---------------- */

const s = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#FDFBF6' },

    topBar: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingTop: Platform.OS === 'ios' ? 55 : 15,
        paddingHorizontal: 16,
        paddingBottom: 12,
        backgroundColor: '#FDFBF6',
        borderBottomWidth: 1,
        borderBottomColor: '#F1E4C7',
    },

    iconBtn: {
        width: 36,
        height: 36,
        borderRadius: 12,
        backgroundColor: '#FFF',
        justifyContent: 'center',
        alignItems: 'center',
    },

    iconBtnPlaceholder: { width: 36 },

    iconText: {
        fontSize: 18,
        color: '#8B5E00',
        fontWeight: '700',
    },

    topTitle: {
        flex: 1,
        textAlign: 'center',
        fontSize: 15,
        fontWeight: '800',
        color: '#5B3A00',
        marginHorizontal: 10,
    },

    heroImage: { width, height: 260 },

    heroContent: { padding: 16 },

    badge: {
        alignSelf: 'flex-start',
        backgroundColor: '#FFF5D8',
        borderRadius: 30,
        paddingHorizontal: 12,
        paddingVertical: 6,
        marginBottom: 12,
    },

    badgeText: {
        fontSize: 12,
        color: '#C8960C',
        fontWeight: '700',
    },

    name: {
        fontSize: 26,
        fontWeight: '800',
        color: '#5B3A00',
    },

    location: {
        marginTop: 6,
        fontSize: 14,
        color: '#7A7A7A',
    },

    quickRow: {
        flexDirection: 'row',
        gap: 10,
        marginTop: 16,
    },

    infoCard: {
        flex: 1,
        backgroundColor: '#FFF',
        borderRadius: 14,
        padding: 14,
    },

    infoTitle: {
        fontSize: 11,
        color: '#8A8A8A',
        marginBottom: 6,
    },

    infoValue: {
        fontSize: 14,
        fontWeight: '700',
        color: '#5B3A00',
    },

    tabsWrap: {
        backgroundColor: '#FDFBF6',
        paddingHorizontal: 14,
        paddingBottom: 10,
    },

    tabs: {
        flexDirection: 'row',
        backgroundColor: '#FFF8E7',
        borderRadius: 18,
        padding: 6,
    },

    tab: {
        flex: 1,
        paddingVertical: 10,
        borderRadius: 14,
        alignItems: 'center',
    },

    tabActive: {
        backgroundColor: '#C8960C',
    },

    tabIcon: {
        fontSize: 14,
        marginBottom: 2,
    },

    tabText: {
        fontSize: 11,
        fontWeight: '700',
        color: '#8A8A8A',
    },

    tabTextActive: {
        color: '#FFF',
    },

    content: {
        padding: 16,
    },

    card: {
        backgroundColor: '#FFF',
        borderRadius: 16,
        padding: 16,
        marginBottom: 12,
    },

    sectionTitle: {
        fontSize: 13,
        fontWeight: '800',
        color: '#C8960C',
        marginBottom: 8,
    },

    body: {
        fontSize: 14,
        color: '#5B3A00',
        lineHeight: 22,
    },

    transportCard: {
        flexDirection: 'row',
        gap: 14,
        backgroundColor: '#FFF',
        padding: 16,
        borderRadius: 16,
        marginBottom: 12,
    },

    transportEmoji: { fontSize: 26 },

    transportTitle: {
        fontSize: 12,
        fontWeight: '800',
        color: '#C8960C',
        marginBottom: 4,
    },

    galleryGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        padding: 4,
    },

    thumb: {
        width: (width - 24) / 3,
        height: (width - 24) / 3,
        margin: 2,
        borderRadius: 10,
    },

    vrBtn: {
        marginTop: 14,
        backgroundColor: '#C8960C',
        paddingVertical: 14,
        borderRadius: 14,
        alignItems: 'center',
    },

    vrBtnText: {
        color: '#FFF',
        fontWeight: '800',
        fontSize: 15,
    },

    vrPlayer: {
        width: '100%',
        height: 220,
        marginTop: 14,
        borderRadius: 14,
    },

    footer: {
        textAlign: 'center',
        paddingVertical: 30,
        color: '#A68A54',
        letterSpacing: 2,
    },
});