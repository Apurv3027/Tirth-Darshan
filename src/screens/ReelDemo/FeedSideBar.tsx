// @ts-nocheck
import React, { useRef, useState, useCallback } from 'react';
import {
    View,
    Text,
    TouchableWithoutFeedback,
    StyleSheet,
    // Platform,
    // Image,
    ActivityIndicator,
} from 'react-native';
import Video, { VideoRef } from 'react-native-video';

interface ReelPlayerProps {
    videoUrl: string;
    isActive: boolean; // whether this reel is currently visible/focused
    data: {
        likes: number;
        comments: number;
        shares: number;
        thumbnailUrl: string;
    };
}

const ReelPlayer = ({ videoUrl, isActive, data }: ReelPlayerProps) => {
    const videoRef = useRef<VideoRef>(null);
    const [paused, setPaused] = useState(false);
    const [loading, setLoading] = useState(true);
    const [showPauseIcon, setShowPauseIcon] = useState(false);

    // Pause when not active (scrolled away), play when active
    const isPaused = paused || !isActive;

    const handleTap = useCallback(() => {
        setPaused(prev => {
            const next = !prev;
            // Show pause/play overlay briefly
            setShowPauseIcon(true);
            setTimeout(() => setShowPauseIcon(false), 800);
            return next;
        });
    }, []);

    return (
        <TouchableWithoutFeedback onPress={handleTap}>
            <View style={styles.container}>
                <Video
                    ref={videoRef}
                    source={{ uri: videoUrl }}
                    style={StyleSheet.absoluteFill}  // ← CRITICAL: fills the container
                    resizeMode="cover"               // ← CRITICAL: like TikTok/Reels look
                    paused={isPaused}
                    repeat={true}
                    playInBackground={false}
                    playWhenInactive={false}
                    ignoreSilentSwitch="obey"
                    onLoad={() => setLoading(false)}
                    onBuffer={({ isBuffering }) => setLoading(isBuffering)}
                    onError={(e) => console.error('Video error:', e)}
                    // ↓ CRITICAL for Android hardware decoder (fixes black screen)
                    useTextureView={false}
                    // For react-native-video v6.x
                    controls={false}
                />

                {/* Loading spinner */}
                {loading && (
                    <View style={styles.loaderOverlay}>
                        <ActivityIndicator size="large" color="#fff" />
                    </View>
                )}

                {/* Play/Pause tap indicator */}
                {showPauseIcon && (
                    <View style={styles.playPauseOverlay}>
                        <Text style={styles.playPauseIcon}>{isPaused ? '▶' : '⏸'}</Text>
                    </View>
                )}

                {/* Sidebar */}
                {/* <FeedSideBar data={data} /> */}
            </View>
        </TouchableWithoutFeedback>
    );
};

export default ReelPlayer;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000', // black bg so no flash
    },
    loaderOverlay: {
        ...StyleSheet.absoluteFill,
        justifyContent: 'center',
        alignItems: 'center',
    },
    playPauseOverlay: {
        ...StyleSheet.absoluteFill,
        justifyContent: 'center',
        alignItems: 'center',
    },
    playPauseIcon: {
        fontSize: 60,
        color: 'rgba(255,255,255,0.85)',
    },
});