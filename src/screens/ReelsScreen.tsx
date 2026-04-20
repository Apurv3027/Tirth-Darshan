import React, { useRef, useState, useCallback, memo } from 'react';
import {
    View,
    FlatList,
    Dimensions,
    StyleSheet,
    TouchableOpacity,
    Text,
    StatusBar,
    ViewToken,
    Image,
} from 'react-native';
import Video from 'react-native-video';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width, height } = Dimensions.get('window');

// ── Tab bar height constant (keep in sync with AppNavigator) ──
const TAB_BAR_HEIGHT = 62;

type Reel = {
    id: string;
    title: string;
    videoUrl: string;
    profile: string;
    username: string;
    likes: number;
    comments: number;
    shares: number;
    music: string;
    verified?: boolean;
};

const REELS_DATA: Reel[] = [
    {
        id: '1',
        title: 'Peaceful Jain Temple Darshan 🙏',
        videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
        profile: 'https://i.pravatar.cc/150?img=12',
        username: 'JainWorld',
        likes: 12450,
        comments: 842,
        shares: 540,
        music: 'Bhakti Dhun',
        verified: true,
    },
    {
        id: '2',
        title: 'Palitana Tirth Aerial View ✨',
        videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
        profile: 'https://i.pravatar.cc/150?img=32',
        username: 'SpiritualIndia',
        likes: 8650,
        comments: 420,
        shares: 231,
        music: 'Temple Bells',
    },
    {
        id: '3',
        title: 'Morning Meditation Vibes 🌅',
        videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
        profile: 'https://i.pravatar.cc/150?img=22',
        username: 'SoulReels',
        likes: 22100,
        comments: 1120,
        shares: 654,
        music: 'Meditation Loop',
        verified: true,
    },
];

const formatCount = (num: number) => {
    if (num >= 1_000_000) return (num / 1_000_000).toFixed(1) + 'M';
    if (num >= 1_000) return (num / 1_000).toFixed(1) + 'K';
    return num.toString();
};

// ─────────────────────────────────────────────
// ReelItem
// ─────────────────────────────────────────────
type ReelItemProps = {
    item: Reel;
    active: boolean;
    /** Safe-area top inset so the header clears the status-bar notch */
    topInset: number;
    /** Combined bottom inset = tab bar height + device safe-area bottom */
    bottomInset: number;
};

const ReelItem = memo(({ item, active, topInset, bottomInset }: ReelItemProps) => {
    const [liked, setLiked] = useState(false);
    const [paused, setPaused] = useState(false);

    return (
        <View style={styles.page}>
            {/* ── Video ── */}
            <Video
                source={{ uri: item.videoUrl }}
                style={StyleSheet.absoluteFill}
                resizeMode="cover"
                repeat
                paused={false}
                muted={false}
                onLoad={() => console.log('VIDEO LOADED')}
                onBuffer={e => console.log('BUFFER', e)}
                onError={e => console.log('VIDEO ERROR', e)}
            />

            {/* ── Dark overlay ── */}
            <View style={styles.overlay} />

            {/* ── Tap to pause ── */}
            <TouchableOpacity
                activeOpacity={1}
                style={StyleSheet.absoluteFill}
                onPress={() => setPaused(p => !p)}
            />

            {/* ── "Reels" header — clears status bar + notch ── */}
            <View style={[styles.header, { top: topInset + 8 }]}>
                <Text style={styles.headerText}>Reels</Text>
            </View>

            {/* ── Right action buttons — above the tab bar ── */}
            <View style={[styles.rightActions, { bottom: bottomInset + 20 }]}>
                {/* Avatar */}
                <TouchableOpacity style={styles.iconWrap}>
                    <Image source={{ uri: item.profile }} style={styles.avatar} />
                </TouchableOpacity>

                {/* Like */}
                <TouchableOpacity
                    style={styles.iconWrap}
                    onPress={() => setLiked(l => !l)}>
                    <Text style={[styles.icon, liked && { color: '#ff2d55' }]}>♥</Text>
                    <Text style={styles.count}>
                        {formatCount(item.likes + (liked ? 1 : 0))}
                    </Text>
                </TouchableOpacity>

                {/* Comment */}
                <TouchableOpacity style={styles.iconWrap}>
                    <Text style={styles.icon}>💬</Text>
                    <Text style={styles.count}>{formatCount(item.comments)}</Text>
                </TouchableOpacity>

                {/* Share */}
                <TouchableOpacity style={styles.iconWrap}>
                    <Text style={styles.icon}>↗</Text>
                    <Text style={styles.count}>{formatCount(item.shares)}</Text>
                </TouchableOpacity>

                {/* More */}
                <TouchableOpacity style={styles.iconWrap}>
                    <Text style={styles.icon}>⋯</Text>
                </TouchableOpacity>
            </View>

            {/* ── Bottom content — above the tab bar ── */}
            <View style={[styles.bottomSection, { bottom: bottomInset + 16 }]}>
                <View style={styles.userRow}>
                    <Text style={styles.username}>@{item.username}</Text>

                    {item.verified && (
                        <Text style={styles.verified}> ✔</Text>
                    )}

                    <TouchableOpacity style={styles.followBtn}>
                        <Text style={styles.followText}>Follow</Text>
                    </TouchableOpacity>
                </View>

                <Text style={styles.caption}>{item.title}</Text>

                <Text style={styles.music}>🎵 {item.music}</Text>

                {paused && <Text style={styles.pauseText}>⏸ Paused</Text>}
            </View>
        </View>
    );
});

// ─────────────────────────────────────────────
// ReelsScreen
// ─────────────────────────────────────────────
export const ReelsScreen = () => {
    const insets = useSafeAreaInsets();

    // The reel page height fills the entire screen; content is offset with insets
    const topInset = insets.top;
    // Leave room for the tab bar + the device's own bottom safe-area padding
    const bottomInset = TAB_BAR_HEIGHT + insets.bottom;

    const [activeIndex, setActiveIndex] = useState(0);

    const onViewRef = useRef(
        ({ viewableItems }: { viewableItems: ViewToken[] }) => {
            if (viewableItems.length > 0) {
                setActiveIndex(viewableItems[0].index ?? 0);
            }
        },
    );

    const viewabilityConfig = { itemVisiblePercentThreshold: 80 };

    const renderItem = useCallback(
        ({ item, index }: { item: Reel; index: number }) => (
            <ReelItem
                item={item}
                active={activeIndex === index}
                topInset={topInset}
                bottomInset={bottomInset}
            />
        ),
        [activeIndex, topInset, bottomInset],
    );

    return (
        <View style={styles.container}>
            <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />

            <FlatList
                data={REELS_DATA}
                keyExtractor={item => item.id}
                renderItem={renderItem}
                pagingEnabled
                snapToInterval={height}
                decelerationRate="fast"
                showsVerticalScrollIndicator={false}
                onViewableItemsChanged={onViewRef.current}
                viewabilityConfig={viewabilityConfig}
                windowSize={4}
                initialNumToRender={2}
                maxToRenderPerBatch={2}
                removeClippedSubviews
            />
        </View>
    );
};

// ─────────────────────────────────────────────
// Styles
// ─────────────────────────────────────────────
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
    },

    page: {
        width,
        height, // full screen — video bleeds edge-to-edge behind tab bar
        backgroundColor: '#000',
    },

    overlay: {
        ...StyleSheet.absoluteFill,
        backgroundColor: 'rgba(0,0,0,0.25)',
    },

    // header position is dynamic (topInset + 8)
    header: {
        position: 'absolute',
        zIndex: 99,
        width: '100%',
        alignItems: 'center',
    },

    headerText: {
        color: '#fff',
        fontSize: 22,
        fontWeight: '800',
    },

    // rightActions bottom is dynamic
    rightActions: {
        position: 'absolute',
        right: 12,
        alignItems: 'center',
    },

    iconWrap: {
        marginBottom: 20,
        alignItems: 'center',
    },

    avatar: {
        width: 48,
        height: 48,
        borderRadius: 24,
        borderWidth: 2,
        borderColor: '#fff',
    },

    icon: {
        color: '#fff',
        fontSize: 30,
    },

    count: {
        color: '#fff',
        marginTop: 4,
        fontSize: 12,
        fontWeight: '700',
    },

    // bottomSection bottom is dynamic
    bottomSection: {
        position: 'absolute',
        left: 14,
        right: 80,
    },

    userRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
        flexWrap: 'wrap',
    },

    username: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '800',
    },

    verified: {
        color: '#4da6ff',
        fontSize: 15,
        fontWeight: '700',
    },

    followBtn: {
        marginLeft: 10,
        borderWidth: 1,
        borderColor: '#fff',
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 8,
    },

    followText: {
        color: '#fff',
        fontWeight: '700',
        fontSize: 12,
    },

    caption: {
        color: '#fff',
        fontSize: 15,
        lineHeight: 22,
        marginBottom: 8,
    },

    music: {
        color: '#ddd',
        fontSize: 13,
    },

    pauseText: {
        color: '#fff',
        marginTop: 10,
        fontWeight: '700',
    },
});