// @ts-nocheck
import { Animated, StyleSheet, View, useWindowDimensions } from 'react-native';
import React, { useRef, useState, useCallback } from 'react';
import { VIDEO_DATA } from './data';
import FeedRow from './FeedRow';

const ReelComponent = () => {
    const { height } = useWindowDimensions();
    const scrollY = useRef(new Animated.Value(0)).current;
    const [scrollInfo, setScrollInfo] = useState({ isViewable: true, index: 0 });
    const refFlatList = useRef(null);

    const viewabilityConfig = useRef({ viewAreaCoveragePercentThreshold: 80 });

    const onViewableItemsChanged = useCallback(({ changed }) => {
        if (changed.length > 0) {
            setScrollInfo({
                isViewable: changed[0].isViewable,
                index: changed[0].index,
            });
        }
    }, []);

    const getItemLayout = useCallback(
        (_, index) => ({
            length: height,
            offset: height * index,
            index,
        }),
        [height],
    );

    const keyExtractor = useCallback(item => `${item.id}`, []);

    const onScroll = useCallback(
        Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], {
            useNativeDriver: true,
        }),
        [],
    );

    const renderItem = useCallback(
        ({ item, index }) => {
            const { index: scrollIndex } = scrollInfo;
            const isNext = Math.abs(index - scrollIndex) <= 1;

            return (
                <FeedRow
                    data={item}
                    index={index}
                    isNext={isNext}
                    visible={scrollInfo}
                    isVisible={scrollIndex === index}
                />
            );
        },
        [scrollInfo],
    );
    return (
        <View style={styles.flexContainer}>
            <StatusBar barStyle={'light-content'} backgroundColor={'black'} />
            <Animated.FlatList
                pagingEnabled
                showsVerticalScrollIndicator={false}
                ref={refFlatList}
                automaticallyAdjustContentInsets
                onViewableItemsChanged={onViewableItemsChanged}
                viewabilityConfig={viewabilityConfig.current}
                onScroll={onScroll}
                data={VIDEO_DATA}
                renderItem={renderItem}
                getItemLayout={getItemLayout}
                decelerationRate="fast"
                keyExtractor={keyExtractor}
                onEndReachedThreshold={0.2}
                removeClippedSubviews
                bounces={false}
            />
        </View>
    );
};

export default ReelComponent;

const styles = StyleSheet.create({
    flexContainer: { flex: 1, backgroundColor: 'black' },
});