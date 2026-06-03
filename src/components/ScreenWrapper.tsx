import React from 'react';
import { View, ScrollView, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Theme } from '../config/theme';

type Props = {
    children: React.ReactNode;
    scroll?: boolean;
    backgroundColor?: string;
};

export default function ScreenWrapper({
    children,
    scroll = false,
    backgroundColor = Theme.background,
}: Props) {
    const isDarkBg = backgroundColor === Theme.primary || backgroundColor === '#001536' || backgroundColor === '#0A0A18';
    return (
        <SafeAreaView
            style={{ flex: 1, backgroundColor }}
            edges={['top', 'left', 'right']}
        >
            <StatusBar barStyle={isDarkBg ? "light-content" : "dark-content"} backgroundColor={backgroundColor} />

            {scroll ? (
                <ScrollView
                    style={{ flex: 1 }}
                    contentContainerStyle={{ paddingBottom: 20 }}
                    showsVerticalScrollIndicator={false}
                >
                    {children}
                </ScrollView>
            ) : (
                <View style={{ flex: 1 }}>{children}</View>
            )}
        </SafeAreaView>
    );
}