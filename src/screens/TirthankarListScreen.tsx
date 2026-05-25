import React, { useState, useMemo, useEffect } from 'react';
import {
    View,
    Text,
    FlatList,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    StatusBar,
    Platform,
    ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Tirthankar } from '../data/tirthankars';
import { dbService } from '../services/dbService';
import { RootStackParams } from '../navigation';

type Nav = NativeStackNavigationProp<RootStackParams>;

// Nirvana place short labels for badge
const nirvanaBadge = (place: string): { label: string; color: string } => {
    if (place.includes('Shatrunjaya') || place.includes('Palitana'))
        return { label: 'Palitana', color: '#8B5CF6' };
    if (place.includes('Sammeta') || place.includes('Parasnath'))
        return { label: 'Sammeta', color: '#059669' };
    if (place.includes('Ashtapad'))
        return { label: 'Ashtapad', color: '#D97706' };
    if (place.includes('Girnar'))
        return { label: 'Girnar', color: '#2563EB' };
    if (place.includes('Pawapuri'))
        return { label: 'Pawapuri', color: '#DC2626' };
    if (place.includes('Champapuri'))
        return { label: 'Champapuri', color: '#7C3AED' };
    if (place.includes('Chandragiri'))
        return { label: 'Chandragiri', color: '#0891B2' };
    return { label: 'Tirth', color: '#6B7280' };
};

const FILTER_OPTIONS = ['All', 'Palitana', 'Sammeta', 'Girnar', 'Other'];

const TirthankarCard = ({
    item,
    onPress,
}: {
    item: Tirthankar;
    onPress: () => void;
}) => {
    const badge = nirvanaBadge(item.nirvanaPlace);
    return (
        <TouchableOpacity style={s.card} onPress={onPress} activeOpacity={0.85}>
            {/* Number badge */}
            <View style={s.numBadge}>
                <Text style={s.numText}>{item.id}</Text>
            </View>

            {/* Symbol */}
            <Text style={s.emoji}>{item.symbolEmoji}</Text>

            {/* Name */}
            <Text style={s.cardName} numberOfLines={2}>
                {item.name}
            </Text>
            <Text style={s.cardGuj} numberOfLines={1}>
                {item.nameGujarati}
            </Text>

            {/* Symbol label */}
            <Text style={s.symbolLabel} numberOfLines={1}>
                {item.symbol}
            </Text>

            {/* Nirvana badge */}
            <View style={[s.nirvanaBadge, { backgroundColor: badge.color + '22', borderColor: badge.color + '55' }]}>
                <Text style={[s.nirvanaText, { color: badge.color }]}>{badge.label}</Text>
            </View>
        </TouchableOpacity>
    );
};

export const TirthankarListScreen = () => {
    const nav = useNavigation<Nav>();
    const [query, setQuery] = useState('');
    const [activeFilter, setActiveFilter] = useState('All');
    const [tirthankars, setTirthankars] = useState<Tirthankar[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let isMounted = true;
        const loadTirthankars = async () => {
            const data = await dbService.getTirthankars();
            if (isMounted) {
                setTirthankars(data);
                setLoading(false);
            }
        };
        loadTirthankars();
        return () => {
            isMounted = false;
        };
    }, []);

    const filtered = useMemo(() => {
        return tirthankars.filter(t => {
            const matchQuery =
                query === '' ||
                t.name.toLowerCase().includes(query.toLowerCase()) ||
                t.nameGujarati.includes(query) ||
                t.symbol.toLowerCase().includes(query.toLowerCase()) ||
                t.birthPlace.toLowerCase().includes(query.toLowerCase());

            const badge = nirvanaBadge(t.nirvanaPlace);
            const matchFilter =
                activeFilter === 'All' ||
                (activeFilter === 'Other' &&
                    !['Palitana', 'Sammeta', 'Girnar'].includes(badge.label)) ||
                badge.label === activeFilter;

            return matchQuery && matchFilter;
        });
    }, [query, activeFilter, tirthankars]);

    if (loading) {
        return (
            <View style={[s.container, s.loadingContainer]}>
                <StatusBar barStyle="dark-content" backgroundColor="#FDFBF6" />
                <ActivityIndicator size="large" color="#C8960C" />
                <Text style={s.loadingText}>Connecting to divine portal...</Text>
                <Text style={s.loadingSubtext}>Loading Tirthankar data</Text>
            </View>
        );
    }

    return (
        <View style={s.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#FDFBF6" />

            {/* Header */}
            <View style={s.header}>
                <Text style={s.headerTitle}>24 Tirthankars</Text>
                <Text style={s.headerSubtitle}>Shwetambar Tradition</Text>
            </View>

            {/* Search */}
            <View style={s.searchContainer}>
                <Text style={s.searchIcon}>🔍</Text>
                <TextInput
                    style={s.searchInput}
                    placeholder="Search by name, symbol, birthplace..."
                    placeholderTextColor="#4A4A6A"
                    value={query}
                    onChangeText={setQuery}
                    returnKeyType="search"
                />
                {query.length > 0 && (
                    <TouchableOpacity onPress={() => setQuery('')}>
                        <Text style={s.clearBtn}>✕</Text>
                    </TouchableOpacity>
                )}
            </View>

            {/* Filters */}
            <View style={s.filterRow}>
                {FILTER_OPTIONS.map(f => (
                    <TouchableOpacity
                        key={f}
                        style={[s.filterBtn, activeFilter === f && s.filterBtnActive]}
                        onPress={() => setActiveFilter(f)}
                    >
                        <Text style={[s.filterText, activeFilter === f && s.filterTextActive]}>
                            {f}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>

            {/* Count */}
            <Text style={s.countText}>
                {filtered.length} of 24 Tirthankars
            </Text>

            {/* Grid */}
            <FlatList
                data={filtered}
                keyExtractor={t => String(t.id)}
                numColumns={2}
                columnWrapperStyle={s.row}
                contentContainerStyle={s.listContent}
                showsVerticalScrollIndicator={false}
                renderItem={({ item }) => (
                    <TirthankarCard
                        item={item}
                        onPress={() => nav.navigate('TirthankarProfile', { id: item.id })}
                    />
                )}
                ListEmptyComponent={
                    <View style={s.emptyContainer}>
                        <Text style={s.emptyEmoji}>🕉️</Text>
                        <Text style={s.emptyText}>No Tirthankars found</Text>
                        <Text style={s.emptySubText}>Try a different search term</Text>
                    </View>
                }
            />
        </View>
    );
};

const s = StyleSheet.create({
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FDFBF6',
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
        flex: 1,
        backgroundColor: '#FDFBF6',
    },

    header: {
        paddingTop: Platform.OS === 'ios' ? 56 : 24,
        paddingBottom: 12,
        paddingHorizontal: 20,
        backgroundColor: '#FDFBF6',
    },

    headerTitle: {
        fontSize: 28,
        fontWeight: '800',
        color: '#8B5E00',
        letterSpacing: 0.5,
    },

    headerSubtitle: {
        fontSize: 13,
        color: '#8A8A8A',
        marginTop: 2,
        letterSpacing: 1,
        textTransform: 'uppercase',
    },

    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        marginHorizontal: 16,
        marginBottom: 12,
        borderRadius: 14,
        paddingHorizontal: 14,
        borderWidth: 1,
        borderColor: '#F1E4C7',
        elevation: 2,
    },

    searchIcon: {
        fontSize: 15,
        marginRight: 8,
    },

    searchInput: {
        flex: 1,
        paddingVertical: 13,
        fontSize: 14,
        color: '#5B3A00',
    },

    clearBtn: {
        color: '#8A8A8A',
        fontSize: 14,
        padding: 4,
    },

    filterRow: {
        flexDirection: 'row',
        paddingHorizontal: 12,
        marginBottom: 8,
        gap: 6,
    },

    filterBtn: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: '#F1E4C7',
    },

    filterBtnActive: {
        backgroundColor: '#FFF3D6',
        borderColor: '#C8960C',
    },

    filterText: {
        fontSize: 12,
        color: '#7A7A7A',
        fontWeight: '600',
    },

    filterTextActive: {
        color: '#C8960C',
    },

    countText: {
        fontSize: 11,
        color: '#9C9C9C',
        paddingHorizontal: 20,
        marginBottom: 8,
        letterSpacing: 0.5,
    },

    listContent: {
        paddingHorizontal: 10,
        paddingBottom: 32,
    },

    row: {
        justifyContent: 'space-between',
        paddingHorizontal: 4,
    },

    card: {
        flex: 1,
        margin: 5,
        padding: 14,
        borderRadius: 18,
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: '#F1E4C7',
        alignItems: 'center',
        minHeight: 180,
        elevation: 2,
    },

    numBadge: {
        position: 'absolute',
        top: 10,
        left: 10,
        backgroundColor: '#FFF3D6',
        borderRadius: 8,
        paddingHorizontal: 6,
        paddingVertical: 2,
    },

    numText: {
        fontSize: 10,
        color: '#8B5E00',
        fontWeight: '700',
    },

    emoji: {
        fontSize: 40,
        marginTop: 12,
        marginBottom: 8,
    },

    cardName: {
        fontSize: 13,
        fontWeight: '700',
        color: '#5B3A00',
        textAlign: 'center',
        lineHeight: 18,
    },

    cardGuj: {
        fontSize: 11,
        color: '#9C7C38',
        marginTop: 3,
        textAlign: 'center',
    },

    symbolLabel: {
        fontSize: 10,
        color: '#7A7A7A',
        marginTop: 4,
        textAlign: 'center',
    },

    nirvanaBadge: {
        marginTop: 8,
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 6,
        borderWidth: 1,
    },

    nirvanaText: {
        fontSize: 9,
        fontWeight: '700',
        letterSpacing: 0.5,
    },

    emptyContainer: {
        alignItems: 'center',
        paddingTop: 80,
    },

    emptyEmoji: {
        fontSize: 48,
        marginBottom: 12,
    },

    emptyText: {
        fontSize: 16,
        color: '#7A7A7A',
        fontWeight: '600',
    },

    emptySubText: {
        fontSize: 13,
        color: '#A0A0A0',
        marginTop: 4,
    },
});