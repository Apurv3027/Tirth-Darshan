// @ts-nocheck
import { StyleSheet, View } from 'react-native';
import React from 'react';
import VideoComponent from './VideoComponent';
import FeedFooter from './FeedFooter';
import FeedSideBar from './FeedSideBar';
import FeedHeader from './FeedHeader';

const FeedRow = ({ data, index, visible, isVisible, isNext }) => {
    return (
        <View>
            <VideoComponent data={data} isNext={isNext} isVisible={isVisible} />
            <FeedHeader index={index} />
            <FeedSideBar data={data} />
            <FeedFooter data={data} />
        </View>
    );
};

export default FeedRow;