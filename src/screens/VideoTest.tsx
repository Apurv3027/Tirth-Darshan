import React, { useState } from 'react';
import { View, Text, Dimensions, StyleSheet } from 'react-native';
import Video from 'react-native-video';

const { width, height } = Dimensions.get('window');

export default function VideoTest() {
    const [status, setStatus] = useState('Mounting...');

    return (
        <View style={styles.container}>
            <Video
                source={{ uri: 'https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/720/Big_Buck_Bunny_720_10s_1MB.mp4' }}
                style={styles.video}
                resizeMode="contain"
                repeat={true}
                controls={true}
                onLoad={(data) => setStatus(`Loaded! Duration: ${data.duration}s`)}
                onError={(e) => setStatus(`Error: ${JSON.stringify(e)}`)}
                onBuffer={({ isBuffering }) => {
                    if (isBuffering) setStatus('Buffering...');
                }}
            />
            <View style={styles.statusBar}>
                <Text style={styles.statusText}>{status}</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
    },
    video: {
        width: width,
        height: height - 100,
    },
    statusBar: {
        height: 100,
        backgroundColor: '#222',
        justifyContent: 'center',
        alignItems: 'center',
    },
    statusText: {
        color: '#0f0',
        fontSize: 16,
        fontWeight: 'bold',
    },
});
