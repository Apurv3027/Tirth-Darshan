import React, { useState } from 'react';
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    StyleSheet,
    Platform,
    Share,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { TIRTHANKARS } from '../data/tirthankars';
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

    const t = TIRTHANKARS.find(x => x.id === params.id);
    if (!t) {
        return (
            <View style={s.errorContainer}>
                <Text style={s.errorText}>Tirthankar not found</Text>
            </View>
        );
    }

    const handleShare = async () => {
        await Share.share({
            message: `🙏 ${t.name} (${t.nameGujarati})\n\nSymbol: ${t.symbol}\nBirth: ${t.birthPlace}\nNirvana: ${t.nirvanaPlace}\n\n${t.significance}\n\nJai Jinendra 🕉️`,
        });
    };

    const goToTirth = (tirthName: string) => {
        // Navigate to TirthDetail — pass name as search query for v1
        nav.navigate('TirthDetail', { id: tirthName.toLowerCase().replace(/\s+/g, '_') });
    };

    return (
        <ScreenWrapper backgroundColor="#0A0A18">
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
                <View style={s.tabs}>
                    {TABS.map(tab => (
                        <TouchableOpacity
                            key={tab}
                            style={[s.tab, activeTab === tab && s.tabActive]}
                            onPress={() => setActiveTab(tab)}
                        >
                            <Text style={[s.tabText, activeTab === tab && s.tabTextActive]}>
                                {tab}
                            </Text>
                        </TouchableOpacity>
                    ))}
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
        backgroundColor: '#0A0A18',
    },
    scroll: {
        flex: 1,
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#0A0A18',
    },
    errorText: {
        color: '#6B7280',
        fontSize: 16,
    },

    // Top bar
    topBar: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingTop: Platform.OS === 'ios' ? 56 : 16,
        paddingBottom: 12,
        paddingHorizontal: 16,
        backgroundColor: '#0A0A18',
        borderBottomWidth: 1,
        borderBottomColor: '#13132A',
    },
    backBtn: {
        width: 36,
        height: 36,
        borderRadius: 10,
        backgroundColor: '#13132A',
        justifyContent: 'center',
        alignItems: 'center',
    },
    backArrow: {
        color: '#E8D5B7',
        fontSize: 18,
        fontWeight: '600',
    },
    topBarTitle: {
        flex: 1,
        color: '#E8D5B7',
        fontSize: 15,
        fontWeight: '700',
        textAlign: 'center',
        marginHorizontal: 12,
    },
    shareBtn: {
        width: 36,
        height: 36,
        borderRadius: 10,
        backgroundColor: '#13132A',
        justifyContent: 'center',
        alignItems: 'center',
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
        backgroundColor: '#0D0D20',
    },
    prevNextRow: {
        flexDirection: 'row',
        width: '100%',
        marginBottom: 16,
    },
    prevNextBtn: {
        backgroundColor: '#13132A',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#1E1E3F',
    },
    prevNextText: {
        color: '#6B8CFF',
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
        color: '#6B7280',
        letterSpacing: 2,
        textTransform: 'uppercase',
        marginBottom: 6,
    },
    heroName: {
        fontSize: 26,
        fontWeight: '800',
        color: '#E8D5B7',
        textAlign: 'center',
        letterSpacing: 0.3,
    },
    heroGuj: {
        fontSize: 17,
        color: '#8B7355',
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
        backgroundColor: '#13132A',
        borderWidth: 1,
        borderColor: '#1E1E3F',
    },
    pillSymbolText: {
        fontSize: 12,
        color: '#8B9ABB',
        fontWeight: '600',
    },

    // Yaksha row
    yakshaRow: {
        flexDirection: 'row',
        backgroundColor: '#13132A',
        borderRadius: 14,
        paddingVertical: 12,
        paddingHorizontal: 16,
        width: '100%',
        borderWidth: 1,
        borderColor: '#1E1E3F',
    },
    yakshaBox: {
        flex: 1,
        alignItems: 'center',
    },
    yakshaDivider: {
        width: 1,
        backgroundColor: '#1E1E3F',
        marginHorizontal: 12,
    },
    yakshaRole: {
        fontSize: 10,
        color: '#4A5568',
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
    tabs: {
        flexDirection: 'row',
        backgroundColor: '#0A0A18',
        paddingHorizontal: 16,
        paddingTop: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#13132A',
    },
    tab: {
        flex: 1,
        paddingVertical: 10,
        alignItems: 'center',
        borderBottomWidth: 2,
        borderBottomColor: 'transparent',
    },
    tabActive: {
        borderBottomColor: '#C8960C',
    },
    tabText: {
        fontSize: 12,
        color: '#4A5568',
        fontWeight: '600',
    },
    tabTextActive: {
        color: '#C8960C',
    },

    // Tab content
    tabContent: {
        padding: 16,
        gap: 12,
    },

    // Section card
    sectionCard: {
        backgroundColor: '#13132A',
        borderRadius: 16,
        padding: 16,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#1E1E3F',
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
        color: '#8B9ABB',
        letterSpacing: 1,
        textTransform: 'uppercase',
    },

    // Info rows
    infoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        paddingVertical: 9,
        borderBottomWidth: 1,
        borderBottomColor: '#1A1A32',
    },
    infoLabel: {
        fontSize: 13,
        color: '#4A5568',
        flex: 1,
    },
    infoValue: {
        fontSize: 13,
        color: '#C8B98A',
        flex: 1.4,
        textAlign: 'right',
        fontWeight: '500',
    },
    infoValueAccent: {
        color: '#C8960C',
        fontWeight: '700',
    },

    // Significance
    significanceText: {
        fontSize: 14,
        color: '#A89878',
        lineHeight: 22,
    },

    // Special note (Mallinath)
    specialNote: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#2980B920',
        borderRadius: 12,
        padding: 14,
        borderWidth: 1,
        borderColor: '#2980B940',
        gap: 10,
    },
    specialNoteIcon: {
        fontSize: 20,
    },
    specialNoteText: {
        fontSize: 13,
        color: '#7DB6E8',
        fontWeight: '600',
        flex: 1,
        lineHeight: 20,
    },

    // Kalyanak
    kalyanakIntro: {
        fontSize: 12,
        color: '#4A5568',
        marginBottom: 12,
        fontStyle: 'italic',
    },
    kalyanakRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
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
        color: '#6B7280',
        letterSpacing: 0.5,
        textTransform: 'uppercase',
    },
    kalyanakPlace: {
        fontSize: 13,
        color: '#C8B98A',
        fontWeight: '600',
        marginTop: 2,
    },

    // Teachings
    teachingRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: 14,
        gap: 12,
    },
    teachingBullet: {
        width: 22,
        height: 22,
        borderRadius: 11,
        backgroundColor: '#C8960C20',
        borderWidth: 1,
        borderColor: '#C8960C50',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 1,
    },
    teachingBulletText: {
        fontSize: 10,
        color: '#C8960C',
        fontWeight: '800',
    },
    teachingText: {
        fontSize: 14,
        color: '#C8B98A',
        lineHeight: 22,
        flex: 1,
    },

    // Tirth chips
    tirthIntro: {
        fontSize: 12,
        color: '#4A5568',
        marginBottom: 12,
        fontStyle: 'italic',
    },
    tirthChip: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#0D0D20',
        borderRadius: 12,
        paddingVertical: 13,
        paddingHorizontal: 14,
        marginBottom: 8,
        borderWidth: 1,
        borderColor: '#1E1E3F',
    },
    tirthChipText: {
        fontSize: 14,
        color: '#8B9ABB',
        fontWeight: '600',
        flex: 1,
    },
    tirthChipArrow: {
        color: '#C8960C',
        fontSize: 16,
        fontWeight: '700',
    },

    // Nirvana highlight
    nirvanaHighlight: {
        backgroundColor: '#C8960C12',
        borderRadius: 12,
        padding: 14,
        borderWidth: 1,
        borderColor: '#C8960C30',
    },
    nirvanaHighlightPlace: {
        fontSize: 16,
        fontWeight: '800',
        color: '#C8960C',
        marginBottom: 6,
    },
    nirvanaHighlightDesc: {
        fontSize: 13,
        color: '#8B7355',
        lineHeight: 20,
    },

    // Footer
    footer: {
        textAlign: 'center',
        color: '#2A2A4A',
        fontSize: 14,
        paddingVertical: 28,
        letterSpacing: 2,
    },
});