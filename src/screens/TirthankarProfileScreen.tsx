import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    StyleSheet,
    Platform,
    Share,
    ActivityIndicator,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Tirthankar } from '../data/tirthankars';
import { dbService } from '../services/dbService';
import { RootStackParams } from '../navigation';
import ScreenWrapper from '../components/ScreenWrapper';

type RouteT = RouteProp<RootStackParams, 'TirthankarProfile'>;
type Nav = NativeStackNavigationProp<RootStackParams>;

// ── Sub-components ─────────────────────────────────────────

const InfoRow = ({
    label,
    value,
    accent = false,
}: {
    label: string;
    value: string;
    accent?: boolean;
}) => (
    <View style={s.infoRow}>
        <Text style={s.infoLabel}>{label}</Text>
        <Text style={[s.infoValue, accent && s.infoValueAccent]} numberOfLines={2}>
            {value}
        </Text>
    </View>
);

const SectionCard = ({
    title,
    icon,
    children,
}: {
    title: string;
    icon: string;
    children: React.ReactNode;
}) => (
    <View style={s.sectionCard}>
        <View style={s.sectionHeader}>
            <Text style={s.sectionIcon}>{icon}</Text>
            <Text style={s.sectionTitle}>{title}</Text>
        </View>
        {children}
    </View>
);

const KalyanakRow = ({ label, place }: { label: string; place: string }) => (
    <View style={s.kalyanakRow}>
        <View style={s.kalyanakDot} />
        <View style={{ flex: 1 }}>
            <Text style={s.kalyanakLabel}>{label}</Text>
            <Text style={s.kalyanakPlace}>{place}</Text>
        </View>
    </View>
);

const TirthChip = ({
    name,
    onPress,
}: {
    name: string;
    onPress: () => void;
}) => (
    <TouchableOpacity style={s.tirthChip} onPress={onPress} activeOpacity={0.8}>
        <Text style={s.tirthChipText}>{name}</Text>
        <Text style={s.tirthChipArrow}>→</Text>
    </TouchableOpacity>
);

// ── Tab navigation ──────────────────────────────────────────

const TABS = ['Profile', 'Places', 'Teachings', 'Tirth'] as const;
type Tab = (typeof TABS)[number];

// ── Main screen ─────────────────────────────────────────────

export const TirthankarProfileScreen = () => {
    const { params } = useRoute<RouteT>();
    const nav = useNavigation<Nav>();
    const [activeTab, setActiveTab] = useState<Tab>('Profile');
    const [t, setT] = useState<Tirthankar | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let isMounted = true;
        setLoading(true);
        dbService.getTirthankarById(params.id).then(res => {
            if (isMounted) {
                setT(res);
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
                        Unveiling sacred profile...
                    </Text>
                </View>
            </ScreenWrapper>
        );
    }

    if (!t) {
        return (
            <ScreenWrapper backgroundColor="#FDFBF6">
                <View style={s.errorContainer}>
                    <Text style={s.errorText}>Tirthankar not found</Text>
                </View>
            </ScreenWrapper>
        );
    }

    const handleShare = async () => {
        await Share.share({
            message: `🙏 ${t.name} (${t.nameGujarati})\n\nSymbol: ${t.symbol}\nBirth: ${t.birthPlace}\nNirvana: ${t.nirvanaPlace}\n\n${t.significance}\n\nJai Jinendra 🕉️`,
        });
    };

    const goToTirth = (tirthId: string) => {
        nav.navigate('TirthDetail', { id: tirthId });
    };

    return (
        <ScreenWrapper backgroundColor="#FDFBF6">
            {/* <StatusBar barStyle="light-content" backgroundColor="#0A0A18" /> */}

            {/* ── Custom header ── */}
            <View style={s.topBar}>
                <TouchableOpacity style={s.backBtn} onPress={() => nav.goBack()}>
                    <Text style={s.backArrow}>←</Text>
                </TouchableOpacity>
                <Text style={s.topBarTitle} numberOfLines={1}>
                    {t.name}
                </Text>
                <TouchableOpacity style={s.shareBtn} onPress={handleShare}>
                    <Text style={s.shareIcon}>↗</Text>
                </TouchableOpacity>
            </View>

            <ScrollView
                style={s.scroll}
                showsVerticalScrollIndicator={false}
                stickyHeaderIndices={[1]}
            >
                {/* ── Hero ── */}
                <View style={s.hero}>
                    {/* Prev / Next nav */}
                    <View style={s.prevNextRow}>
                        {t.id > 1 && (
                            <TouchableOpacity
                                style={s.prevNextBtn}
                                onPress={() => nav.replace('TirthankarProfile', { id: t.id - 1 })}
                            >
                                <Text style={s.prevNextText}>← #{t.id - 1}</Text>
                            </TouchableOpacity>
                        )}
                        <View style={{ flex: 1 }} />
                        {t.id < 24 && (
                            <TouchableOpacity
                                style={s.prevNextBtn}
                                onPress={() => nav.replace('TirthankarProfile', { id: t.id + 1 })}
                            >
                                <Text style={s.prevNextText}>#{t.id + 1} →</Text>
                            </TouchableOpacity>
                        )}
                    </View>

                    {/* Color ring + emoji */}
                    <View style={[s.emojiRing, { borderColor: t.colorHex + '66' }]}>
                        <View style={[s.emojiInner, { backgroundColor: t.colorHex + '18' }]}>
                            <Text style={s.heroEmoji}>{t.symbolEmoji}</Text>
                        </View>
                    </View>

                    {/* Ordinal */}
                    <Text style={s.heroOrdinal}>
                        {t.id} of 24 Tirthankars
                    </Text>

                    {/* Name */}
                    <Text style={s.heroName}>{t.name}</Text>
                    <Text style={s.heroGuj}>{t.nameGujarati}</Text>

                    {/* Color + symbol pills */}
                    <View style={s.pillRow}>
                        <View style={[s.pill, { backgroundColor: t.colorHex + '25', borderColor: t.colorHex + '60' }]}>
                            <Text style={[s.pillText, { color: t.colorHex }]}>
                                ● {t.color}
                            </Text>
                        </View>
                        <View style={s.pillSymbol}>
                            <Text style={s.pillSymbolText}>{t.symbol}</Text>
                        </View>
                    </View>

                    {/* Yaksha / Yakshini */}
                    <View style={s.yakshaRow}>
                        <View style={s.yakshaBox}>
                            <Text style={s.yakshaRole}>Yaksha (Dev)</Text>
                            <Text style={s.yakshaName}>{t.yaksha}</Text>
                        </View>
                        <View style={s.yakshaDivider} />
                        <View style={s.yakshaBox}>
                            <Text style={s.yakshaRole}>Yakshini (Devi)</Text>
                            <Text style={s.yakshaName}>{t.yakshini}</Text>
                        </View>
                    </View>
                </View>

                {/* ── Sticky Tabs ── */}
                <View style={s.tabsWrapper}>
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={s.tabsScroll}
                    >
                        {TABS.map(tab => {
                            const active = activeTab === tab;

                            return (
                                <TouchableOpacity
                                    key={tab}
                                    activeOpacity={0.85}
                                    style={[s.tabPill, active && s.tabPillActive]}
                                    onPress={() => setActiveTab(tab)}
                                >
                                    <Text style={[s.tabPillText, active && s.tabPillTextActive]}>
                                        {tab}
                                    </Text>
                                </TouchableOpacity>
                            );
                        })}
                    </ScrollView>
                </View>

                {/* ── Tab Content ── */}
                <View style={s.tabContent}>

                    {/* PROFILE TAB */}
                    {activeTab === 'Profile' && (
                        <>
                            <SectionCard title="Physical Attributes" icon="📏">
                                <InfoRow label="Height" value={t.height} />
                                <InfoRow label="Lifespan (Ayu)" value={t.lifespan} accent />
                                <InfoRow label="Color" value={t.color} />
                            </SectionCard>

                            <SectionCard title="Significance" icon="✨">
                                <Text style={s.significanceText}>{t.significance}</Text>
                            </SectionCard>

                            {/* Special note for Mallinath */}
                            {t.id === 19 && (
                                <View style={s.specialNote}>
                                    <Text style={s.specialNoteIcon}>⭐</Text>
                                    <Text style={s.specialNoteText}>
                                        Only female Tirthankar in the Shwetambar tradition
                                    </Text>
                                </View>
                            )}
                        </>
                    )}

                    {/* PLACES TAB */}
                    {activeTab === 'Places' && (
                        <>
                            <SectionCard title="Sacred Life Places" icon="📍">
                                <InfoRow label="Birth Place" value={t.birthPlace} />
                                <InfoRow label="Diksha Place" value={t.dikshaPlace} />
                                <InfoRow label="Kevalgyan Place" value={t.kevalgyanPlace} />
                                <InfoRow label="Nirvana Place" value={t.nirvanaPlace} accent />
                            </SectionCard>

                            <SectionCard title="Panch Kalyanak" icon="🌟">
                                <Text style={s.kalyanakIntro}>
                                    Five sacred events in this Tirthankar's life
                                </Text>
                                <KalyanakRow label="Garbha (Conception)" place={t.panchKalyanak.garbha} />
                                <KalyanakRow label="Janma (Birth)" place={t.panchKalyanak.janma} />
                                <KalyanakRow label="Diksha (Renunciation)" place={t.panchKalyanak.diksha} />
                                <KalyanakRow label="Kevalgyan (Omniscience)" place={t.panchKalyanak.kevalgyan} />
                                <KalyanakRow label="Nirvana / Moksha" place={t.panchKalyanak.nirvana} />
                            </SectionCard>
                        </>
                    )}

                    {/* TEACHINGS TAB */}
                    {activeTab === 'Teachings' && (
                        <>
                            <SectionCard title="Key Teachings" icon="📖">
                                {t.teachings.map((teaching, i) => (
                                    <View key={i} style={s.teachingRow}>
                                        <View style={s.teachingBullet}>
                                            <Text style={s.teachingBulletText}>{i + 1}</Text>
                                        </View>
                                        <Text style={s.teachingText}>{teaching}</Text>
                                    </View>
                                ))}
                            </SectionCard>

                            <SectionCard title="Spiritual Significance" icon="🙏">
                                <Text style={s.significanceText}>{t.significance}</Text>
                            </SectionCard>
                        </>
                    )}

                    {/* TIRTH TAB */}
                    {activeTab === 'Tirth' && (
                        <>
                            <SectionCard title="Famous Associated Tirth" icon="🏛️">
                                <Text style={s.tirthIntro}>
                                    Tap any Tirth to view its full details, history, and how to reach.
                                </Text>
                                {t.famousTirths.map((tirth, i) => (
                                    <TirthChip
                                        key={i}
                                        name={tirth}
                                        onPress={() => goToTirth(tirth)}
                                    />
                                ))}
                            </SectionCard>

                            <SectionCard title="Nirvana Place" icon="🕉️">
                                <View style={s.nirvanaHighlight}>
                                    <Text style={s.nirvanaHighlightPlace}>{t.nirvanaPlace}</Text>
                                    <Text style={s.nirvanaHighlightDesc}>
                                        This is where {t.name.split(' ')[0]} attained Moksha (final liberation).
                                    </Text>
                                </View>
                            </SectionCard>
                        </>
                    )}

                </View>

                {/* Jai Jinendra footer */}
                <Text style={s.footer}>🕉️  Jai Jinendra</Text>
            </ScrollView>
        </ScreenWrapper>
    );
};

// ── Styles ──────────────────────────────────────────────────

const s = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FDFBF6',
    },

    scroll: {
        flex: 1,
    },

    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FDFBF6',
    },

    errorText: {
        color: '#7A7A7A',
        fontSize: 16,
    },

    // Top bar
    topBar: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingTop: Platform.OS === 'ios' ? 56 : 16,
        paddingBottom: 12,
        paddingHorizontal: 16,
        backgroundColor: '#FDFBF6',
        borderBottomWidth: 1,
        borderBottomColor: '#F1E4C7',
    },

    backBtn: {
        width: 36,
        height: 36,
        borderRadius: 10,
        backgroundColor: '#FFFFFF',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#F1E4C7',
    },

    backArrow: {
        color: '#8B5E00',
        fontSize: 18,
        fontWeight: '600',
    },

    topBarTitle: {
        flex: 1,
        color: '#5B3A00',
        fontSize: 15,
        fontWeight: '700',
        textAlign: 'center',
        marginHorizontal: 12,
    },

    shareBtn: {
        width: 36,
        height: 36,
        borderRadius: 10,
        backgroundColor: '#FFFFFF',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#F1E4C7',
    },

    shareIcon: {
        color: '#C8960C',
        fontSize: 16,
        fontWeight: '700',
    },

    // Hero
    hero: {
        alignItems: 'center',
        paddingTop: 28,
        paddingBottom: 20,
        paddingHorizontal: 20,
        backgroundColor: '#FFF8E7',
    },

    prevNextRow: {
        flexDirection: 'row',
        width: '100%',
        marginBottom: 16,
    },

    prevNextBtn: {
        backgroundColor: '#FFFFFF',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#F1E4C7',
    },

    prevNextText: {
        color: '#8B5E00',
        fontSize: 12,
        fontWeight: '600',
    },

    emojiRing: {
        width: 110,
        height: 110,
        borderRadius: 55,
        borderWidth: 2,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
    },

    emojiInner: {
        width: 90,
        height: 90,
        borderRadius: 45,
        justifyContent: 'center',
        alignItems: 'center',
    },

    heroEmoji: {
        fontSize: 48,
    },

    heroOrdinal: {
        fontSize: 11,
        color: '#8A8A8A',
        letterSpacing: 2,
        textTransform: 'uppercase',
        marginBottom: 6,
    },

    heroName: {
        fontSize: 26,
        fontWeight: '800',
        color: '#5B3A00',
        textAlign: 'center',
    },

    heroGuj: {
        fontSize: 17,
        color: '#9C7C38',
        marginTop: 4,
        marginBottom: 14,
        textAlign: 'center',
    },

    pillRow: {
        flexDirection: 'row',
        gap: 8,
        marginBottom: 16,
    },

    pill: {
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 8,
        borderWidth: 1,
    },

    pillText: {
        fontSize: 12,
        fontWeight: '700',
    },

    pillSymbol: {
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 8,
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: '#F1E4C7',
    },

    pillSymbolText: {
        fontSize: 12,
        color: '#7A7A7A',
        fontWeight: '600',
    },

    // Yaksha row
    yakshaRow: {
        flexDirection: 'row',
        backgroundColor: '#FFFFFF',
        borderRadius: 14,
        paddingVertical: 12,
        paddingHorizontal: 16,
        width: '100%',
        borderWidth: 1,
        borderColor: '#F1E4C7',
    },

    yakshaBox: {
        flex: 1,
        alignItems: 'center',
    },

    yakshaDivider: {
        width: 1,
        backgroundColor: '#F1E4C7',
        marginHorizontal: 12,
    },

    yakshaRole: {
        fontSize: 10,
        color: '#8A8A8A',
        letterSpacing: 0.5,
        textTransform: 'uppercase',
        marginBottom: 4,
    },

    yakshaName: {
        fontSize: 13,
        color: '#C8960C',
        fontWeight: '700',
        textAlign: 'center',
    },

    // Tabs
    tabsWrapper: {
        backgroundColor: '#FDFBF6',
        paddingTop: 10,
        paddingBottom: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#F1E4C7',
    },

    tabsScroll: {
        paddingHorizontal: 14,
    },

    tabPill: {
        paddingVertical: 10,
        paddingHorizontal: 18,
        borderRadius: 30,
        backgroundColor: '#FFFFFF',
        marginRight: 10,
        borderWidth: 1,
        borderColor: '#F1E4C7',
        shadowColor: '#000',
        shadowOpacity: 0.04,
        shadowRadius: 4,
        shadowOffset: { width: 0, height: 2 },
        elevation: 2,
    },

    tabPillActive: {
        backgroundColor: '#C8960C',
        borderColor: '#C8960C',
        transform: [{ scale: 1.03 }],
    },

    tabPillText: {
        fontSize: 13,
        fontWeight: '700',
        color: '#8A8A8A',
    },

    tabPillTextActive: {
        color: '#FFFFFF',
    },

    // Content
    tabContent: {
        padding: 16,
        gap: 12,
    },

    sectionCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 16,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#F1E4C7',
    },

    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 14,
    },

    sectionIcon: {
        fontSize: 16,
        marginRight: 8,
    },

    sectionTitle: {
        fontSize: 12,
        fontWeight: '700',
        color: '#8B5E00',
        letterSpacing: 1,
        textTransform: 'uppercase',
    },

    infoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 9,
        borderBottomWidth: 1,
        borderBottomColor: '#F7EED8',
    },

    infoLabel: {
        fontSize: 13,
        color: '#7A7A7A',
        flex: 1,
    },

    infoValue: {
        fontSize: 13,
        color: '#5B3A00',
        flex: 1.4,
        textAlign: 'right',
        fontWeight: '500',
    },

    infoValueAccent: {
        color: '#C8960C',
        fontWeight: '700',
    },

    significanceText: {
        fontSize: 14,
        color: '#5B3A00',
        lineHeight: 22,
    },

    specialNote: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#EAF4FF',
        borderRadius: 12,
        padding: 14,
        borderWidth: 1,
        borderColor: '#B6D8FF',
        gap: 10,
    },

    specialNoteIcon: {
        fontSize: 20,
    },

    specialNoteText: {
        fontSize: 13,
        color: '#2563EB',
        fontWeight: '600',
        flex: 1,
        lineHeight: 20,
    },

    kalyanakIntro: {
        fontSize: 12,
        color: '#7A7A7A',
        marginBottom: 12,
        fontStyle: 'italic',
    },

    kalyanakRow: {
        flexDirection: 'row',
        marginBottom: 12,
        gap: 10,
    },

    kalyanakDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#C8960C',
        marginTop: 5,
    },

    kalyanakLabel: {
        fontSize: 11,
        color: '#8A8A8A',
        textTransform: 'uppercase',
    },

    kalyanakPlace: {
        fontSize: 13,
        color: '#5B3A00',
        fontWeight: '600',
        marginTop: 2,
    },

    teachingRow: {
        flexDirection: 'row',
        marginBottom: 14,
        gap: 12,
    },

    teachingBullet: {
        width: 22,
        height: 22,
        borderRadius: 11,
        backgroundColor: '#FFF3D6',
        borderWidth: 1,
        borderColor: '#F1D68A',
        justifyContent: 'center',
        alignItems: 'center',
    },

    teachingBulletText: {
        fontSize: 10,
        color: '#C8960C',
        fontWeight: '800',
    },

    teachingText: {
        fontSize: 14,
        color: '#5B3A00',
        lineHeight: 22,
        flex: 1,
    },

    tirthIntro: {
        fontSize: 12,
        color: '#7A7A7A',
        marginBottom: 12,
        fontStyle: 'italic',
    },

    tirthChip: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#FFF8E7',
        borderRadius: 12,
        paddingVertical: 13,
        paddingHorizontal: 14,
        marginBottom: 8,
        borderWidth: 1,
        borderColor: '#F1E4C7',
    },

    tirthChipText: {
        fontSize: 14,
        color: '#5B3A00',
        fontWeight: '600',
        flex: 1,
    },

    tirthChipArrow: {
        color: '#C8960C',
        fontSize: 16,
        fontWeight: '700',
    },

    nirvanaHighlight: {
        backgroundColor: '#FFF8E7',
        borderRadius: 12,
        padding: 14,
        borderWidth: 1,
        borderColor: '#F1D68A',
    },

    nirvanaHighlightPlace: {
        fontSize: 16,
        fontWeight: '800',
        color: '#C8960C',
        marginBottom: 6,
    },

    nirvanaHighlightDesc: {
        fontSize: 13,
        color: '#9C7C38',
        lineHeight: 20,
    },

    footer: {
        textAlign: 'center',
        color: '#A68A54',
        fontSize: 14,
        paddingVertical: 28,
        letterSpacing: 2,
    },
});