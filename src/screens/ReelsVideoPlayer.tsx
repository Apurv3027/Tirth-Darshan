import React, { useRef, useState, useCallback, useEffect, memo } from 'react';
import {
    View,
    FlatList,
    Dimensions,
    StyleSheet,
    TouchableWithoutFeedback,
    Text,
    StatusBar,
    Animated,
    Easing,
    Image,
    TouchableOpacity,
    ActivityIndicator,
    Modal,
    TextInput,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Pressable,
    PanResponder,
} from 'react-native';

import Video, { VideoRef } from 'react-native-video';
import { ReelsNativeVideo } from '../components/ReelsNativeVideo';

// ─── Asset Icons ──────────────────────────────────────────────────────────────
const ICONS = {
    heartFilled: require('../assets/icons/heart.png'),
    heartOutline: require('../assets/icons/heart_outlined.png'),
    comment: require('../assets/icons/comment.png'),
    share: require('../assets/icons/share.png'),
};

/** Heart: filled red when liked, outline when not */
const HeartIcon = memo(({ filled = false, size = 30 }: { filled?: boolean; size?: number }) => (
    <Image
        source={filled ? ICONS.heartFilled : ICONS.heartOutline}
        style={{ width: size, height: size, tintColor: filled ? '#FF3040' : '#fff' }}
        resizeMode="contain"
    />
));

/** Comment bubble */
const CommentIcon = memo(({ size = 28 }: { size?: number }) => (
    <Image
        source={ICONS.comment}
        style={{ width: size, height: size, tintColor: '#fff' }}
        resizeMode="contain"
    />
));

/** Share / Send */
const ShareIcon = memo(({ size = 26 }: { size?: number }) => (
    <Image
        source={ICONS.share}
        style={{ width: size, height: size, tintColor: '#fff' }}
        resizeMode="contain"
    />
));

/** Three dots ⋯ (no asset — kept as text) */
const MoreIcon = memo(({ size = 22 }: { size?: number }) => (
    <Text style={{ fontSize: size, color: '#fff', letterSpacing: 2, includeFontPadding: false }}>
        ⋯
    </Text>
));


const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// ─── viewabilityConfig MUST be outside component (static reference) ──────────
const VIEWABILITY_CONFIG = {
    itemVisiblePercentThreshold: 60,
    minimumViewTime: 300,
};

// ─── Local video assets (bundled with app — always works on real devices) ─────
// When connecting to Firebase, replace `source` with `{ uri: firebaseVideoURL }`
const LOCAL_VIDEOS = {
    reel1: require('../assets/videos/reel1.mp4'),
    reel2: require('../assets/videos/reel2.mp4'),
    reel3: require('../assets/videos/reel3.mp4'),
};

// ─── Reel Data ───────────────────────────────────────────────────────────────
// Production: Fetch this from Firebase Firestore and use `uri` field for remote videos
export interface ReelData {
    id: string;
    // For local: use `localSource` key. For Firebase: use `uri` key.
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

const REELS_DATA: ReelData[] = [
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

// ─── Helper: Get video source (supports both local and Firebase) ─────────────
const getVideoSource = (item: ReelData) => {
    if (item.uri) {
        return { uri: item.uri };
    }
    return item.localSource;
};

// ─── Heart Animation ─────────────────────────────────────────────────────────
const HeartBurst = memo(({ visible }: { visible: boolean }) => {
    const scale = useRef(new Animated.Value(0)).current;
    const opacity = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        if (visible) {
            scale.setValue(0);
            opacity.setValue(1);
            Animated.sequence([
                Animated.spring(scale, {
                    toValue: 1.4,
                    useNativeDriver: true,
                    speed: 20,
                }),
                Animated.timing(scale, {
                    toValue: 1.1,
                    duration: 100,
                    useNativeDriver: true,
                }),
                Animated.delay(400),
                Animated.timing(opacity, {
                    toValue: 0,
                    duration: 300,
                    useNativeDriver: true,
                }),
            ]).start();
        }
    }, [visible, scale, opacity]);

    if (!visible) {
        return null;
    }
    return (
        <Animated.Text
            style={[styles.heartBurst, { transform: [{ scale }], opacity }]}>
            ❤️
        </Animated.Text>
    );
});

// ─── Spinning Music Disc ─────────────────────────────────────────────────────
const MusicDisc = memo(({ isPlaying, avatar }: { isPlaying: boolean; avatar: string }) => {
    const rotation = useRef(new Animated.Value(0)).current;
    const animRef = useRef<Animated.CompositeAnimation | null>(null);

    useEffect(() => {
        if (isPlaying) {
            animRef.current = Animated.loop(
                Animated.timing(rotation, {
                    toValue: 1,
                    duration: 3000,
                    useNativeDriver: true,
                }),
            );
            animRef.current.start();
        } else {
            animRef.current?.stop();
        }
        return () => animRef.current?.stop();
    }, [isPlaying, rotation]);

    const spin = rotation.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '360deg'],
    });

    return (
        <Animated.View style={[styles.musicDisc, { transform: [{ rotate: spin }] }]}>
            <Image source={{ uri: avatar }} style={styles.musicDiscImage} />
        </Animated.View>
    );
});

// ─── Action Button ───────────────────────────────────────────────────────────
const ActionButton = memo(
    ({ iconNode, label, onPress }: { iconNode: React.ReactNode; label: string; onPress?: () => void }) => {
        const scale = useRef(new Animated.Value(1)).current;

        const handlePress = () => {
            Animated.sequence([
                Animated.spring(scale, {
                    toValue: 1.25,
                    useNativeDriver: true,
                    speed: 30,
                }),
                Animated.spring(scale, {
                    toValue: 1,
                    useNativeDriver: true,
                    speed: 30,
                }),
            ]).start();
            onPress?.();
        };

        return (
            <TouchableOpacity
                onPress={handlePress}
                style={styles.actionBtn}
                activeOpacity={0.7}>
                <Animated.View style={{ transform: [{ scale }] }}>
                    {iconNode}
                </Animated.View>
                <Text style={styles.actionLabel}>{label}</Text>
            </TouchableOpacity>
        );
    },
);

// ─── Dummy Comment Data ───────────────────────────────────────────────────────
const DUMMY_COMMENTS = [
    { id: '1', user: 'jay_jain_2024', avatar: 'https://i.pravatar.cc/100?img=10', text: 'जय जिनेंद्र 🙏 बहुत सुंदर दर्शन!', time: '2h', likes: 142 },
    { id: '2', user: 'palitana_yatra', avatar: 'https://i.pravatar.cc/100?img=11', text: 'इस तीर्थ की यात्रा करना जीवन का सबसे अच्छा अनुभव था 🕉️', time: '3h', likes: 89 },
    { id: '3', user: 'devotee_amisha', avatar: 'https://i.pravatar.cc/100?img=12', text: 'Jai Jinendra! The marble carvings are breathtaking 😍', time: '5h', likes: 213 },
    { id: '4', user: 'ranakpur_fan', avatar: 'https://i.pravatar.cc/100?img=13', text: 'कब जाना है यहाँ 🤩 Planning my trip soon!', time: '6h', likes: 55 },
    { id: '5', user: 'tirth_darshan_official', avatar: 'https://i.pravatar.cc/100?img=14', text: 'Thank you for sharing these divine moments with us 🙏✨', time: '8h', likes: 304 },
    { id: '6', user: 'jain_heritage', avatar: 'https://i.pravatar.cc/100?img=15', text: 'Incredible architecture! UNESCO should recognize this 🏛️', time: '10h', likes: 178 },
    { id: '7', user: 'moksha_path', avatar: 'https://i.pravatar.cc/100?img=16', text: 'जय शत्रुंजय महातीर्थ 🙏🏼 आदिनाथ भगवान की जय!', time: '12h', likes: 421 },
];

// ─── Comments Bottom Sheet ─────────────────────────────────────────────────────
const SHEET_HEIGHT = SCREEN_HEIGHT * 0.50;

const CommentsBottomSheet = memo(({ visible, onClose, commentCount }: {
    visible: boolean; onClose: () => void; commentCount: string;
}) => {
    const slideAnim = useRef(new Animated.Value(SHEET_HEIGHT)).current;
    const backdropOpacity = useRef(new Animated.Value(0)).current;
    const [commentText, setCommentText] = useState('');
    const [mounted, setMounted] = useState(false);

    const animateOpen = useCallback(() => {
        Animated.parallel([
            Animated.timing(backdropOpacity, { toValue: 1, duration: 260, easing: Easing.out(Easing.ease), useNativeDriver: true }),
            Animated.timing(slideAnim, { toValue: 0, duration: 320, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
        ]).start();
    }, [backdropOpacity, slideAnim]);

    const animateClose = useCallback((cb?: () => void) => {
        Animated.parallel([
            Animated.timing(backdropOpacity, { toValue: 0, duration: 200, easing: Easing.in(Easing.ease), useNativeDriver: true }),
            Animated.timing(slideAnim, { toValue: SHEET_HEIGHT, duration: 260, easing: Easing.in(Easing.cubic), useNativeDriver: true }),
        ]).start(() => { setMounted(false); cb?.(); });
    }, [backdropOpacity, slideAnim]);

    useEffect(() => {
        if (visible) { setMounted(true); animateOpen(); }
        else { animateClose(); }
    }, [visible, animateOpen, animateClose]);

    // ── Drag-to-close pan responder (attached to the handle zone) ──
    const panResponder = useRef(
        PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onMoveShouldSetPanResponder: (_, g) => g.dy > 5,
            onPanResponderMove: (_, g) => {
                if (g.dy > 0) slideAnim.setValue(g.dy);
            },
            onPanResponderRelease: (_, g) => {
                // Close if dragged >80px or flicked fast
                if (g.dy > 80 || g.vy > 0.8) {
                    animateClose(onClose);
                } else {
                    // Snap back
                    Animated.spring(slideAnim, { toValue: 0, useNativeDriver: true, bounciness: 6 }).start();
                }
            },
        })
    ).current;

    if (!mounted && !visible) return null;

    return (
        <Modal transparent animationType="none" visible={mounted} onRequestClose={() => animateClose(onClose)}>
            <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
                <Animated.View style={[bsStyles.backdrop, { opacity: backdropOpacity }]}>
                    <Pressable style={StyleSheet.absoluteFill} onPress={() => animateClose(onClose)} />
                </Animated.View>
                <Animated.View style={[bsStyles.sheet, { transform: [{ translateY: slideAnim }] }]}>
                    {/* Draggable handle zone */}
                    <View {...panResponder.panHandlers} style={bsStyles.dragZone}>
                        <View style={bsStyles.handle} />
                    </View>
                    <View style={bsStyles.sheetHeader}>
                        <Text style={bsStyles.sheetTitle}>Comments</Text>
                        <Text style={bsStyles.commentCount}>{commentCount}</Text>
                    </View>
                    <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
                        {DUMMY_COMMENTS.map(c => (
                            <View key={c.id} style={bsStyles.commentRow}>
                                <Image source={{ uri: c.avatar }} style={bsStyles.commentAvatar} />
                                <View style={bsStyles.commentBody}>
                                    <Text style={bsStyles.commentUser}>{c.user}</Text>
                                    <Text style={bsStyles.commentText}>{c.text}</Text>
                                    <View style={bsStyles.commentMeta}>
                                        <Text style={bsStyles.commentTime}>{c.time}</Text>
                                        <Text style={bsStyles.commentLikeText}>{c.likes} likes</Text>
                                        <TouchableOpacity><Text style={bsStyles.commentReply}>Reply</Text></TouchableOpacity>
                                    </View>
                                </View>
                                <TouchableOpacity style={bsStyles.commentHeart}>
                                    <Text style={{ fontSize: 14, color: '#888' }}>♡</Text>
                                </TouchableOpacity>
                            </View>
                        ))}
                        <View style={{ height: 24 }} />
                    </ScrollView>
                    <View style={bsStyles.inputBar}>
                        <Image source={{ uri: 'https://i.pravatar.cc/100?img=20' }} style={bsStyles.inputAvatar} />
                        <TextInput
                            style={bsStyles.input}
                            placeholder="Add a comment…"
                            placeholderTextColor="#555"
                            value={commentText}
                            onChangeText={setCommentText}
                            multiline
                        />
                        {commentText.length > 0 && (
                            <TouchableOpacity onPress={() => setCommentText('')}>
                                <Text style={bsStyles.postBtn}>Post</Text>
                            </TouchableOpacity>
                        )}
                    </View>
                </Animated.View>
            </KeyboardAvoidingView>
        </Modal>
    );
});



// ─── Share Bottom Sheet ───────────────────────────────────────────────────────
const SHARE_ICONS = {
    whatsapp: require('../assets/icons/whatsapp.png'),
    instagram: require('../assets/icons/instagram.png'),
    telegram: require('../assets/icons/telegram.png'),
    facebook: require('../assets/icons/facebook.png'),
    twitter: require('../assets/icons/x.png'),
    copyLink: require('../assets/icons/copy_link_white.png'),
    save: require('../assets/icons/save_to_files_white.png'),
};

const SHARE_OPTIONS = [
    { id: '1', label: 'WhatsApp', icon: SHARE_ICONS.whatsapp, },
    { id: '2', label: 'Instagram', icon: SHARE_ICONS.instagram, },
    { id: '3', label: 'Telegram', icon: SHARE_ICONS.telegram, },
    { id: '4', label: 'Facebook', icon: SHARE_ICONS.facebook, },
    { id: '5', label: 'X (Twitter)', icon: SHARE_ICONS.twitter, },
    { id: '6', label: 'Copy Link', icon: SHARE_ICONS.copyLink, },
    { id: '7', label: 'Save', icon: SHARE_ICONS.save, },
];

const ShareBottomSheet = memo(({ visible, onClose }: { visible: boolean; onClose: () => void }) => {
    const slideAnim = useRef(new Animated.Value(SCREEN_HEIGHT)).current;
    const backdropOpacity = useRef(new Animated.Value(0)).current;
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        if (visible) {
            setMounted(true);
            Animated.parallel([
                Animated.timing(backdropOpacity, { toValue: 1, duration: 240, easing: Easing.out(Easing.ease), useNativeDriver: true }),
                Animated.timing(slideAnim, { toValue: 0, duration: 300, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
            ]).start();
        } else {
            Animated.parallel([
                Animated.timing(backdropOpacity, { toValue: 0, duration: 200, easing: Easing.in(Easing.ease), useNativeDriver: true }),
                Animated.timing(slideAnim, { toValue: SCREEN_HEIGHT, duration: 250, easing: Easing.in(Easing.cubic), useNativeDriver: true }),
            ]).start(() => setMounted(false));
        }
    }, [visible, slideAnim, backdropOpacity]);

    if (!mounted && !visible) return null;

    return (
        <Modal transparent animationType="none" visible={mounted} onRequestClose={onClose}>
            <View style={{ flex: 1 }}>
                <Animated.View style={[bsStyles.backdrop, { opacity: backdropOpacity }]}>
                    <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
                </Animated.View>
                <Animated.View style={[bsStyles.shareSheet, { transform: [{ translateY: slideAnim }] }]}>
                    <View style={bsStyles.handle} />
                    <Text style={bsStyles.shareTitle}>Share to</Text>

                    {/* 4-per-row icon grid */}
                    <View style={bsStyles.shareGrid}>
                        {SHARE_OPTIONS.map(opt => (
                            <TouchableOpacity key={opt.id} style={bsStyles.shareOption} onPress={onClose} activeOpacity={0.75}>
                                <View style={[bsStyles.shareIconCircle]}>
                                    <Image source={opt.icon} style={bsStyles.shareIconImg} resizeMode="contain" />
                                </View>
                                <Text style={bsStyles.shareLabel}>{opt.label}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>

                    {/* Cancel pill */}
                    <TouchableOpacity style={bsStyles.cancelBtn} onPress={onClose} activeOpacity={0.8}>
                        <Text style={bsStyles.cancelText}>Cancel</Text>
                    </TouchableOpacity>
                </Animated.View>
            </View>
        </Modal>
    );
});

// ─── Bottom Sheet Styles ──────────────────────────────────────────────────────
const bsStyles = StyleSheet.create({
    backdrop: {
        position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.6)',
    },
    sheet: {
        position: 'absolute', bottom: 0, left: 0, right: 0,
        height: SHEET_HEIGHT,
        backgroundColor: '#111',
        borderTopLeftRadius: 24, borderTopRightRadius: 24,
        paddingBottom: Platform.OS === 'ios' ? 28 : 14,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -6 },
        shadowOpacity: 0.5,
        shadowRadius: 16,
        elevation: 24,
    },
    shareSheet: {
        position: 'absolute', bottom: 0, left: 0, right: 0,
        backgroundColor: '#111',
        borderTopLeftRadius: 24, borderTopRightRadius: 24,
        paddingBottom: Platform.OS === 'ios' ? 32 : 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -6 },
        shadowOpacity: 0.5,
        shadowRadius: 16,
        elevation: 24,
    },
    dragZone: {
        paddingVertical: 12,
        alignItems: 'center',
    },
    handle: {
        width: 40, height: 4, borderRadius: 3,
        backgroundColor: '#3a3a3a', alignSelf: 'center',
    },
    sheetHeader: {
        flexDirection: 'row', alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 18, paddingVertical: 10,
        borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: '#2a2a2a',
    },
    sheetTitle: {
        color: '#fff', fontSize: 16, fontWeight: '700',
        textAlign: 'center', paddingHorizontal: 18,
    },
    shareTitle: {
        color: '#aaa', fontSize: 13, fontWeight: '600',
        textAlign: 'center', letterSpacing: 0.5,
        marginTop: 4, marginBottom: 8,
    },
    commentCount: { color: '#666', fontSize: 13 },
    commentRow: {
        flexDirection: 'row', alignItems: 'flex-start',
        paddingHorizontal: 16, paddingVertical: 10,
    },
    commentAvatar: { width: 36, height: 36, borderRadius: 18, marginRight: 10, marginTop: 2 },
    commentBody: { flex: 1 },
    commentUser: { color: '#fff', fontWeight: '700', fontSize: 13, marginBottom: 2 },
    commentText: { color: '#d0d0d0', fontSize: 14, lineHeight: 20 },
    commentMeta: {
        flexDirection: 'row', alignItems: 'center', marginTop: 5, gap: 12,
    },
    commentTime: { color: '#666', fontSize: 12 },
    commentLikeText: { color: '#666', fontSize: 12 },
    commentReply: { color: '#888', fontSize: 12, fontWeight: '600' },
    commentHeart: { paddingLeft: 10, paddingTop: 2 },
    inputBar: {
        flexDirection: 'row', alignItems: 'center',
        paddingHorizontal: 12, paddingVertical: 10,
        borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: '#222',
    },
    inputAvatar: { width: 34, height: 34, borderRadius: 17, marginRight: 10 },
    input: {
        flex: 1, color: '#fff', fontSize: 14,
        backgroundColor: '#1e1e1e', borderRadius: 22,
        paddingHorizontal: 16, paddingVertical: 8, maxHeight: 80,
        borderWidth: 1, borderColor: '#2a2a2a',
    },
    postBtn: { color: '#3897f0', fontWeight: '700', fontSize: 14, marginLeft: 10 },
    shareGrid: {
        flexDirection: 'row', flexWrap: 'wrap',
        paddingHorizontal: 8, paddingVertical: 4,
    },
    shareOption: { width: '25%', alignItems: 'center', paddingVertical: 14 },
    shareIconCircle: {
        width: 60, height: 60, borderRadius: 30,
        alignItems: 'center', justifyContent: 'center',
        marginBottom: 8,
    },
    shareIconImg: { width: 44, height: 44 },
    shareLabel: { color: '#aaa', fontSize: 12, textAlign: 'center' },
    cancelBtn: {
        marginHorizontal: 16, marginTop: 8,
        backgroundColor: '#1c1c1e', borderRadius: 14,
        paddingVertical: 15, alignItems: 'center',
        borderWidth: StyleSheet.hairlineWidth, borderColor: '#2c2c2e',
    },
    cancelText: { color: '#fff', fontSize: 16, fontWeight: '600' },
});

// ─── Single Reel Item ────────────────────────────────────────────────────────
const ReelItem = ({
    item,
    isActive,
    containerHeight,
}: {
    item: ReelData;
    isActive: boolean;
    containerHeight: number;
}) => {
    const [paused, setPaused] = useState(!isActive);
    const [showComments, setShowComments] = useState(false);
    const [showShare, setShowShare] = useState(false);
    const [liked, setLiked] = useState(false);
    const [showHeart, setShowHeart] = useState(false);
    // isLoading kept false: our custom native player handles its own loading state
    const [isLoading] = useState(false);
    const [hasError, setHasError] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');
    const lastTapRef = useRef(0);
    const videoRef = useRef<any>(null);
    const progressAnim = useRef(new Animated.Value(0)).current;
    const progressAnimRef = useRef<Animated.CompositeAnimation | null>(null);
    const videoDuration = useRef(15000);

    // Auto-play/pause when visibility changes
    useEffect(() => {
        if (isActive) {
            setPaused(false);
            setHasError(false);
        } else {
            setPaused(true);
            progressAnim.setValue(0);
            progressAnimRef.current?.stop();
            if (videoRef.current) {
                videoRef.current.seek(0);
            }
        }
    }, [isActive, progressAnim]);

    // Handle video load success (kept for future use when native video emits callbacks)
    const handleLoad = useCallback(
        (data: any) => {
            console.log('✅ Video loaded:', item.id, 'duration:', data.duration);
            setHasError(false);

            videoDuration.current = (data.duration || 15) * 1000;
            progressAnim.setValue(0);
            progressAnimRef.current?.stop();

            progressAnimRef.current = Animated.timing(progressAnim, {
                toValue: 1,
                duration: videoDuration.current,
                useNativeDriver: false,
            });

            if (isActive) {
                progressAnimRef.current.start();
            }
        },
        [item.id, isActive, progressAnim],
    );

    const handleError = useCallback(
        (error: any) => {
            console.log('❌ Video error for', item.id, ':', JSON.stringify(error));
            setHasError(true);
            setErrorMsg(
                error?.error?.errorString ||
                error?.error?.localizedDescription ||
                'Video failed to load',
            );
        },
        [item.id],
    );

    // Pause/resume progress bar
    useEffect(() => {
        if (paused) {
            progressAnimRef.current?.stop();
        } else if (!isLoading && isActive && !hasError) {
            progressAnimRef.current?.start();
        }
    }, [paused, isLoading, isActive, hasError]);

    // Single / double-tap handler
    // - Single tap  → play / pause the video
    // - Double tap  → like the reel + heart burst animation
    const singleTapTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

    const handlePress = useCallback(() => {
        const now = Date.now();
        const DOUBLE_TAP_WINDOW = 350; // ms between taps to count as double

        if (now - lastTapRef.current < DOUBLE_TAP_WINDOW) {
            // ── Double-tap detected ──────────────────────────
            // Cancel the pending single-tap action
            if (singleTapTimer.current) {
                clearTimeout(singleTapTimer.current);
                singleTapTimer.current = null;
            }
            setLiked(true);
            setShowHeart(true);
            setTimeout(() => setShowHeart(false), 1200);
        } else {
            // ── First tap: wait to see if a second tap follows ─
            singleTapTimer.current = setTimeout(() => {
                singleTapTimer.current = null;
                setPaused(p => !p);
            }, DOUBLE_TAP_WINDOW);
        }

        lastTapRef.current = now;
    }, []);

    const progressWidth = progressAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ['0%', '100%'],
    });

    const retryVideo = useCallback(() => {
        setHasError(false);
        setErrorMsg('');
        if (videoRef.current) {
            videoRef.current.seek(0);
        }
    }, []);

    const resolvedSource = item.uri ? item.uri : Image.resolveAssetSource(item.localSource)?.uri;
    const rawSource = item.uri ? { uri: item.uri } : item.localSource;

    return (
        <View style={[styles.reelContainer, { height: containerHeight }]}>
            {/* ── Video Player (at bottom of z-stack) ── */}
            {isActive && (
                <ReelsNativeVideo
                    src={resolvedSource}
                    source={rawSource}
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: SCREEN_WIDTH,
                        height: containerHeight,
                    }}
                    paused={paused}
                />
            )}

            {/* Loading spinner removed: native player handles its own loading */}

            {/* ── Error state ── */}
            {hasError && isActive && (
                <View style={styles.centerOverlay}>
                    <View style={styles.errorBox}>
                        <Text style={styles.errorEmoji}>⚠️</Text>
                        <Text style={styles.errorTitle}>Couldn't play this reel</Text>
                        <Text style={styles.errorDetail}>{errorMsg}</Text>
                        <TouchableOpacity onPress={retryVideo} style={styles.retryBtn}>
                            <Text style={styles.retryBtnText}>Try Again</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            )}

            {/* ── Pause indicator ── */}
            {paused && isActive && !isLoading && !hasError && (
                <View style={styles.centerOverlay} pointerEvents="none">
                    <View style={styles.pauseIconBox}>
                        <Text style={styles.pauseIconText}>▶</Text>
                    </View>
                </View>
            )}

            {/* ── Full-screen transparent tap overlay (above native video, below UI) ── */}
            {/* Must be here so it receives taps the native video would otherwise swallow */}
            <TouchableWithoutFeedback onPress={handlePress}>
                <View style={StyleSheet.absoluteFill} />
            </TouchableWithoutFeedback>

            {/* ── Double-tap heart ── */}
            <View style={StyleSheet.absoluteFill} pointerEvents="none">
                <HeartBurst visible={showHeart} />
            </View>

            {/* ── Header: title only, no camera icon ── */}
            <View style={styles.header} pointerEvents="none">
                <Text style={styles.headerTitle}>Reels</Text>
            </View>

            {/* ── Progress bar ── */}
            {!hasError && (
                <View style={styles.progressBar}>
                    <Animated.View
                        style={[styles.progressFill, { width: progressWidth }]}
                    />
                </View>
            )}

            {/* ── Right-side actions ── */}
            <View style={styles.actionsPanel}>
                {/* Like */}
                <ActionButton
                    iconNode={<HeartIcon filled={liked} size={30} />}
                    label={item.likes}
                    onPress={() => setLiked(l => !l)}
                />

                {/* Comment */}
                <ActionButton
                    iconNode={<CommentIcon size={28} />}
                    label={item.comments}
                    onPress={() => setShowComments(true)}
                />

                {/* Share */}
                <ActionButton
                    iconNode={<ShareIcon size={28} />}
                    label={item.shares}
                    onPress={() => setShowShare(true)}
                />

                {/* More */}
                <ActionButton
                    iconNode={<MoreIcon size={22} />}
                    label=""
                />
            </View>

            {/* ── Bottom info ── */}
            <View style={styles.bottomInfo}>
                <Text style={styles.description}>
                    {item.description}
                </Text>
                <View style={styles.musicRow}>
                    <Text style={styles.musicIcon}>♫</Text>
                    <View style={styles.musicMarquee}>
                        <Text style={styles.musicName} numberOfLines={1}>
                            {item.music}
                        </Text>
                    </View>
                </View>
            </View>

            {/* ── Comments Bottom Sheet ── */}
            <CommentsBottomSheet
                visible={showComments}
                onClose={() => setShowComments(false)}
                commentCount={item.comments}
            />

            {/* ── Share Bottom Sheet ── */}
            <ShareBottomSheet
                visible={showShare}
                onClose={() => setShowShare(false)}
            />
        </View>
    );
};

// ─── Main Reels Player ───────────────────────────────────────────────────────
export default function ReelsPlayer() {
    const [activeIndex, setActiveIndex] = useState(0);
    const [containerHeight, setContainerHeight] = useState(SCREEN_HEIGHT);
    const flatListRef = useRef<FlatList>(null);

    const onViewableItemsChanged = useCallback(
        ({ viewableItems }: { viewableItems: any[] }) => {
            if (viewableItems.length > 0) {
                const newIndex = viewableItems[0].index ?? 0;
                setActiveIndex(newIndex);
            }
        },
        [],
    );

    const onLayout = useCallback((event: any) => {
        const { height } = event.nativeEvent.layout;
        if (height > 0) {
            setContainerHeight(height);
        }
    }, []);

    const renderItem = useCallback(
        ({ item, index }: { item: ReelData; index: number }) => (
            <ReelItem
                item={item}
                isActive={index === activeIndex}
                containerHeight={containerHeight}
            />
        ),
        [activeIndex, containerHeight],
    );

    const keyExtractor = useCallback((item: ReelData) => item.id, []);

    const getItemLayout = useCallback(
        (_: any, index: number) => ({
            length: containerHeight,
            offset: containerHeight * index,
            index,
        }),
        [containerHeight],
    );

    const videoRef = useRef(null);
    const [paused, setPaused] = useState(false);

    return (
        <View style={styles.root} onLayout={onLayout}>
            <StatusBar
                hidden={false}
                translucent
                backgroundColor="transparent"
                barStyle="light-content"
            />
            <FlatList
                ref={flatListRef}
                data={REELS_DATA}
                keyExtractor={keyExtractor}
                renderItem={renderItem}
                pagingEnabled
                showsVerticalScrollIndicator={false}
                snapToInterval={containerHeight}
                snapToAlignment="start"
                decelerationRate="fast"
                viewabilityConfig={VIEWABILITY_CONFIG}
                onViewableItemsChanged={onViewableItemsChanged}
                initialNumToRender={1}
                maxToRenderPerBatch={2}
                windowSize={3}
                removeClippedSubviews={false}
                getItemLayout={getItemLayout}
            />
        </View>
    );
}

// ─── Styles (Instagram Reels-inspired) ───────────────────────────────────────
const styles = StyleSheet.create({
    root: {
        flex: 1,
        backgroundColor: '#000',
    },

    // ── Reel container ──
    reelContainer: {
        width: SCREEN_WIDTH,
        backgroundColor: '#000',
    },

    // ── Gradient overlays ── (removed - they were blocking video on Android)

    // ── Center overlays (loading, pause, error) ──
    centerOverlay: {
        ...StyleSheet.absoluteFill,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 10,
    },
    pauseIconBox: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: 'rgba(0,0,0,0.45)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    pauseIconText: {
        fontSize: 24,
        color: '#fff',
        marginLeft: 3,
    },

    // ── Error state ──
    errorBox: {
        paddingHorizontal: 28,
        paddingVertical: 24,
        borderRadius: 16,
        backgroundColor: 'rgba(0,0,0,0.85)',
        alignItems: 'center',
        maxWidth: SCREEN_WIDTH * 0.8,
    },
    errorEmoji: {
        fontSize: 40,
        marginBottom: 8,
    },
    errorTitle: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '700',
        marginBottom: 4,
    },
    errorDetail: {
        color: 'rgba(255,255,255,0.6)',
        fontSize: 12,
        textAlign: 'center',
        marginBottom: 16,
    },
    retryBtn: {
        paddingHorizontal: 24,
        paddingVertical: 10,
        backgroundColor: '#fff',
        borderRadius: 20,
    },
    retryBtnText: {
        color: '#000',
        fontWeight: '700',
        fontSize: 14,
    },

    // ── Heart animation ──
    heartBurst: {
        position: 'absolute',
        fontSize: 80,
        alignSelf: 'center',
        top: '42%',
    },

    // ── Instagram-style header ──
    header: {
        position: 'absolute',
        top: 50,
        left: 16,
        right: 16,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        zIndex: 20,
    },
    headerTitle: {
        color: '#fff',
        fontSize: 22,
        fontWeight: '800',
        letterSpacing: 0.3,
        textShadowColor: 'rgba(0,0,0,0.5)',
        textShadowRadius: 8,
    },
    headerCamera: {
        fontSize: 24,
        textShadowColor: 'rgba(0,0,0,0.5)',
        textShadowRadius: 8,
    },

    // ── Progress bar ──
    progressBar: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 2,
        backgroundColor: 'rgba(255,255,255,0.2)',
        zIndex: 15,
    },
    progressFill: {
        height: '100%',
        backgroundColor: '#fff',
    },

    // ── Right-side actions panel ──
    actionsPanel: {
        position: 'absolute',
        right: 14,
        bottom: 120,
        alignItems: 'center',
        gap: 22,
        zIndex: 15,
    },
    actionBtn: {
        alignItems: 'center',
        minWidth: 44,
    },
    actionLabel: {
        color: '#fff',
        fontSize: 12,
        fontWeight: '600',
        marginTop: 5,
        textShadowColor: 'rgba(0,0,0,0.7)',
        textShadowRadius: 4,
    },

    // ── Music disc ──
    musicDisc: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: '#1a1a1a',
        borderWidth: 3,
        borderColor: '#333',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 4,
        overflow: 'hidden',
    },
    musicDiscImage: {
        width: 20,
        height: 20,
        borderRadius: 10,
    },

    // ── Bottom info panel — description + hashtags only ──
    bottomInfo: {
        position: 'absolute',
        left: 14,
        right: 76,
        bottom: 28,
        zIndex: 15,
    },
    description: {
        color: 'rgba(255,255,255,0.97)',
        fontSize: 13,
        lineHeight: 20,
        marginBottom: 10,
        textShadowColor: 'rgba(0,0,0,0.6)',
        textShadowRadius: 5,
    },
    musicRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    musicIcon: {
        color: '#fff',
        fontSize: 13,
        marginRight: 6,
    },
    musicMarquee: {
        flex: 1,
        overflow: 'hidden',
    },
    musicName: {
        color: 'rgba(255,255,255,0.85)',
        fontSize: 12,
    },
});

