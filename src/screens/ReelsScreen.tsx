import React, { useState, useCallback } from 'react';
import {
    View, FlatList, Dimensions, StyleSheet,
    TouchableOpacity, Text, ViewToken,
} from 'react-native';
import Video from 'react-native-video';

const { height, width } = Dimensions.get('window');

type Reel = {
    id: string;
    videoUrl: string;
    title: string;
    category: 'bhajan' | 'darshan' | 'educational' | 'event';
    deity?: string;
    tirth?: string;
    likes: number;
};

const ReelItem = ({
    reel,
    isActive,
}: {
    reel: Reel;
    isActive: boolean;
}) => {
    const [liked, setLiked] = useState(false);

    const categoryColor = {
        bhajan: '#F5A623',
        darshan: '#6B8CFF',
        educational: '#4CAF50',
        event: '#E91E63',
    }[reel.category];

    return (
        <View style={s.reelContainer}>
            <Video
                source={{ uri: reel.videoUrl }}
                style={StyleSheet.absoluteFill}
                resizeMode="cover"
                repeat
                paused={!isActive}
                muted={false}
            />

            {/* Overlay gradient — bottom info */}
            <View style={s.overlay}>

                {/* Category badge */}
                <View style={[s.badge, { backgroundColor: categoryColor + '33', borderColor: categoryColor }]}>
                    <Text style={[s.badgeText, { color: categoryColor }]}>
                        {reel.category.toUpperCase()}
                    </Text>
                </View>

                {/* Title + tags */}
                <Text style={s.title}>{reel.title}</Text>
                {reel.deity && <Text style={s.tag}>🙏 {reel.deity}</Text>}
                {reel.tirth && <Text style={s.tag}>🏛️ {reel.tirth}</Text>}
            </View>

            {/* Right action column */}
            <View style={s.actions}>
                <TouchableOpacity style={s.action} onPress={() => setLiked(v => !v)}>
                    <Text style={[s.actionIcon, liked && { color: '#E91E63' }]}>♥</Text>
                    <Text style={s.actionCount}>{reel.likes + (liked ? 1 : 0)}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={s.action}>
                    <Text style={s.actionIcon}>↗</Text>
                    <Text style={s.actionCount}>Share</Text>
                </TouchableOpacity>
                <TouchableOpacity style={s.action}>
                    <Text style={s.actionIcon}>⋯</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

export const ReelsScreen = () => {
    const [activeIndex, setActiveIndex] = useState(0);

    const onViewableItemsChanged = useCallback(
        ({ viewableItems }: { viewableItems: ViewToken[] }) => {
            if (viewableItems.length > 0) {
                setActiveIndex(viewableItems[0].index ?? 0);
            }
        },
        []
    );

    const viewabilityConfig = { itemVisiblePercentThreshold: 60 };

    return (
        <FlatList
            // data={REELS_DATA}
            data={[]}
            keyExtractor={r => r.id}
            pagingEnabled
            showsVerticalScrollIndicator={false}
            snapToInterval={height}
            decelerationRate="fast"
            onViewableItemsChanged={onViewableItemsChanged}
            viewabilityConfig={viewabilityConfig}
            renderItem={({ item, index }) => (
                <ReelItem reel={item} isActive={index === activeIndex} />
            )}
            getItemLayout={(_, index) => ({
                length: height, offset: height * index, index
            })}
            windowSize={3}
            removeClippedSubviews
        />
    );
};

const s = StyleSheet.create({
    reelContainer: { width, height, backgroundColor: '#000' },
    overlay: {
        position: 'absolute', bottom: 80, left: 16, right: 80,
    },
    badge: {
        alignSelf: 'flex-start', paddingHorizontal: 8, paddingVertical: 3,
        borderRadius: 6, borderWidth: 1, marginBottom: 8,
    },
    badgeText: { fontSize: 10, fontWeight: '700' },
    title: { fontSize: 16, fontWeight: '700', color: '#fff', marginBottom: 4 },
    tag: { fontSize: 13, color: 'rgba(255,255,255,0.7)', marginTop: 2 },
    actions: {
        position: 'absolute', right: 12, bottom: 100,
        alignItems: 'center', gap: 20,
    },
    action: { alignItems: 'center' },
    actionIcon: { fontSize: 26, color: '#fff' },
    actionCount: { fontSize: 12, color: '#fff', marginTop: 2 },
});