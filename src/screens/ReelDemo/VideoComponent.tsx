// @ts-nocheck
import { Platform, StyleSheet, useWindowDimensions } from 'react-native';
import React, { useMemo } from 'react';
import Video from 'react-native-video';

const VideoComponent = ({ data, isVisible }) => {
    const { height } = useWindowDimensions();

    const videoStyle = useMemo(() => styles.video(height), [height]);

    return (
        <>
            <Video
                source={{ uri: data.video }}
                autoPlay
                repeat
                resizeMode="cover"
                muted={!isVisible}
                playInBackground={false}
                paused={!isVisible}
                ignoreSilentSwitch="ignore"
                style={videoStyle}
            />
            <LinearGradient
                colors={[
                    '#000000F0',
                    '#000000D0',
                    '#000000A0',
                    '#00000070',
                    '#00000040',
                ]}
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 0.5 }}
                style={styles.controlsContainer}
            />
        </>
    );
};

export default VideoComponent;

const styles = StyleSheet.create({
    video: height => ({
        backgroundColor: 'black',
        width: '100%',
        height: Platform.OS === 'ios' ? height : height - 50,
    }),
    controlsContainer: {
        ...StyleSheet.absoluteFill,
    },
});