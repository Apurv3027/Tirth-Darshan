import React from 'react';
import { View, ScrollView, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type Props = {
    children: React.ReactNode;
    scroll?: boolean;
    backgroundColor?: string;
};

export default function ScreenWrapper({
    children,
    scroll = false,
    backgroundColor = '#0A0A18',
}: Props) {
    return (
        <SafeAreaView
            style={{ flex: 1, backgroundColor }}
            edges={['top', 'left', 'right']}
        >
            <StatusBar barStyle="light-content" backgroundColor={backgroundColor} />

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