// @ts-nocheck
import { Platform, SafeAreaView, StyleSheet, Text } from 'react-native';
import React from 'react';
import { CameraIcon } from '../../assets';

const FeedHeader = ({ index }) => {
    return (
        <SafeAreaView style={styles.container}>
            {index === 0 && <Text style={styles.title}>Reels</Text>}
            <CameraIcon />
        </SafeAreaView>
    );
};

export default FeedHeader;

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        position: 'absolute',
        top: Platform.OS === 'ios' ? 65 : 10,
        marginHorizontal: 20,
    },
    alignRight: {
        alignSelf: 'flex-end',
        right: 5,
    },
    title: {
        color: '#fff',
        flex: 1,
        fontSize: 24,
        fontWeight: '700',
    },
});