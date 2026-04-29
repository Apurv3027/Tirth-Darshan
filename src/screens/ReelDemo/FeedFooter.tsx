// @ts-nocheck
import { Image, Platform, StyleSheet, Text, View } from "react-native";

const FeedFooter = ({ data }) => {
    const { thumbnailUrl, title, description, isLive, friends } = data;
    const followerCount = Math.floor(Math.random() * 20) + 1;

    return (
        <View style={styles.container}>
            <View style={styles.profileContainer}>
                <Image source={{ uri: thumbnailUrl }} style={styles.thumbnail} resizeMode="cover" />
                <View style={styles.userInfo}>
                    <View style={styles.userNameContainer}>
                        <Text style={styles.nameStyle}>{title}</Text>
                        {isLive && <TickIcon />}
                    </View>
                    <View style={styles.audioContainer}>
                        <MusicIcon width={10} height={10} />
                        <Text style={styles.audioText}>Original audio</Text>
                    </View>
                </View>
                <View style={styles.followButton}>
                    <Text style={styles.followText}>Follow</Text>
                </View>
            </View>

            <Text numberOfLines={2} style={styles.desc}>
                {description}
            </Text>

            <View style={styles.friendsContainer}>
                {friends.map((item, index) => (
                    <Image key={index} source={{ uri: item.imageUrl }} style={styles.friendImage} />
                ))}
                <Text style={styles.followInfo}>{`Followed by Akash and ${followerCount} others`}</Text>
            </View>
        </View>
    );
};

export default FeedFooter;


const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        bottom: Platform.OS === 'ios' ? 120 : 90,
        marginLeft: 20,
    },
    profileContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    thumbnail: {
        width: 30,
        height: 30,
        borderRadius: 20,
        overflow: 'hidden',
    },
    userInfo: {
        marginLeft: 10,
    },
    userNameContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    nameStyle: {
        color: '#fff',
        fontSize: 12,
        fontWeight: '700',
        marginRight: 4,
    },
    audioContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 2,
    },
    audioText: {
        color: '#fff',
        marginLeft: 6,
    },
    followButton: {
        marginLeft: 24,
        borderWidth: 1,
        borderColor: '#fff',
        borderRadius: 8,
        paddingHorizontal: 8,
        paddingVertical: 2,
    },
    followText: {
        color: '#fff',
    },
    desc: {
        color: '#fff',
        width: 300,
    },
    friendsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 10,
    },
    friendImage: {
        width: 15,
        height: 15,
        borderRadius: 150,
        marginRight: -5,
    },
    followInfo: {
        color: '#fff',
        marginLeft: 13,
        fontSize: 12,
    },
});