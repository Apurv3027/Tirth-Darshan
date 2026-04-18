import React, { useState } from 'react';
import {
    ScrollView, View, Text, Image, StyleSheet,
    TouchableOpacity, Dimensions, FlatList,
} from 'react-native';
import Video from 'react-native-video';
import { useRoute } from '@react-navigation/native';
import { TIRTHS } from '../data/tirths';

const { width } = Dimensions.get('window');

const Tab = ({ label, active, onPress }) => (
    <TouchableOpacity style={[s.tab, active && s.tabActive]} onPress={onPress}>
        <Text style={[s.tabText, active && s.tabTextActive]}>{label}</Text>
    </TouchableOpacity>
);

export const TirthDetailScreen = () => {
    const { params } = useRoute();
    const tirth = TIRTHS.find(t => t.id === params.id)!;
    const [tab, setTab] = useState<'info' | 'reach' | 'gallery' | 'vr'>('info');
    const [vrActive, setVrActive] = useState(false);

    return (
        <ScrollView style={s.container} stickyHeaderIndices={[1]}>

            {/* Gallery hero */}
            <FlatList
                data={tirth.gallery}
                horizontal
                pagingEnabled
                keyExtractor={(_, i) => String(i)}
                renderItem={({ item }) => (
                    <Image source={{ uri: item }} style={s.heroImage} resizeMode="cover" />
                )}
                showsHorizontalScrollIndicator={false}
            />

            {/* Tabs (sticky) */}
            <View style={s.tabs}>
                {(['info', 'reach', 'gallery', 'vr'] as const).map(t => (
                    <Tab key={t} label={t.toUpperCase()} active={tab === t} onPress={() => setTab(t)} />
                ))}
            </View>

            {/* Header */}
            <View style={s.header}>
                <Text style={s.name}>{tirth.name}</Text>
                <Text style={s.location}>📍 {tirth.location}</Text>
            </View>

            {/* Tab content */}
            {tab === 'info' && (
                <View style={s.section}>
                    <Text style={s.sectionTitle}>History</Text>
                    <Text style={s.body}>{tirth.history}</Text>
                    <Text style={s.sectionTitle}>Spiritual Significance (Mahima)</Text>
                    <Text style={s.body}>{tirth.mahima}</Text>
                    <Text style={s.sectionTitle}>Best Time to Visit</Text>
                    <Text style={s.body}>{tirth.bestTimeToVisit}</Text>
                </View>
            )}

            {tab === 'reach' && (
                <View style={s.section}>
                    {(['road', 'rail', 'air'] as const).map(mode => (
                        <View key={mode} style={s.reachCard}>
                            <Text style={s.reachIcon}>
                                {mode === 'road' ? '🚌' : mode === 'rail' ? '🚂' : '✈️'}
                            </Text>
                            <View style={{ flex: 1 }}>
                                <Text style={s.reachMode}>{mode.toUpperCase()}</Text>
                                <Text style={s.body}>{tirth.howToReach[mode]}</Text>
                            </View>
                        </View>
                    ))}
                </View>
            )}

            {tab === 'gallery' && (
                <View style={s.galleryGrid}>
                    {tirth.gallery.map((url, i) => (
                        <Image key={i} source={{ uri: url }} style={s.thumb} />
                    ))}
                </View>
            )}

            {tab === 'vr' && (
                <View style={s.section}>
                    {tirth.hasVRDarshan ? (
                        <>
                            <Text style={s.body}>360° VR Darshan available</Text>
                            <TouchableOpacity
                                style={s.vrBtn}
                                onPress={() => setVrActive(true)}
                            >
                                <Text style={s.vrBtnText}>Enter VR Darshan</Text>
                            </TouchableOpacity>
                            {vrActive && (
                                <Video
                                    source={{ uri: tirth.vrDarshanUrl! }}
                                    style={s.vrPlayer}
                                    resizeMode="cover"
                                    controls
                                />
                            )}
                        </>
                    ) : (
                        <Text style={s.body}>VR Darshan coming soon for this Tirth.</Text>
                    )}
                </View>
            )}
        </ScrollView>
    );
};

const s = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#0D0D1A' },
    heroImage: { width, height: 260 },
    tabs: { flexDirection: 'row', backgroundColor: '#0D0D1A', paddingHorizontal: 8, paddingTop: 8 },
    tab: { flex: 1, paddingVertical: 10, alignItems: 'center', borderBottomWidth: 2, borderColor: 'transparent' },
    tabActive: { borderColor: '#6B8CFF' },
    tabText: { fontSize: 11, color: '#666', fontWeight: '600' },
    tabTextActive: { color: '#6B8CFF' },
    header: { padding: 16 },
    name: { fontSize: 24, fontWeight: '800', color: '#E8D5B7' },
    location: { fontSize: 13, color: '#888', marginTop: 4 },
    section: { padding: 16 },
    sectionTitle: { fontSize: 12, fontWeight: '700', color: '#6B8CFF', letterSpacing: 1, marginTop: 16, marginBottom: 6 },
    body: { fontSize: 14, color: '#C0B8A8', lineHeight: 22 },
    reachCard: { flexDirection: 'row', gap: 12, padding: 12, backgroundColor: '#1A1A2E', borderRadius: 12, marginBottom: 10 },
    reachIcon: { fontSize: 24 },
    reachMode: { fontSize: 11, color: '#6B8CFF', fontWeight: '700', marginBottom: 4 },
    galleryGrid: { flexDirection: 'row', flexWrap: 'wrap', padding: 4 },
    thumb: { width: (width - 24) / 3, height: (width - 24) / 3, margin: 2, borderRadius: 8 },
    vrBtn: { backgroundColor: '#6B8CFF', padding: 16, borderRadius: 14, alignItems: 'center', marginTop: 16 },
    vrBtnText: { color: '#fff', fontWeight: '700', fontSize: 16 },
    vrPlayer: { width: '100%', height: 220, borderRadius: 12, marginTop: 12 },
});