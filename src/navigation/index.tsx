import React from 'react';
import { NavigationContainer, createNavigationContainerRef } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text } from 'react-native';
import * as Sentry from '@sentry/react-native';

export const navigationIntegration = Sentry.reactNavigationIntegration({
    enableTimeToInitialDisplay: true,
});

export const navigationRef = createNavigationContainerRef();

import { HomeScreen } from '../screens/HomeScreen';
import { TirthankarListScreen } from '../screens/TirthankarListScreen';
import { TirthankarProfileScreen } from '../screens/TirthankarProfileScreen';
import { TirthDetailScreen } from '../screens/TirthDetailScreen';
import { ReelsScreen } from '../screens/ReelsScreen';
import { SplashScreen } from '../screens/SplashScreen';
import { Theme } from '../config/theme';

// ── Type definitions ──
export type RootStackParams = {
    Splash: undefined;
    MainTabs: undefined;
    TirthankarProfile: { id: number };
    TirthDetail: { id: string };
};

export type TabParams = {
    Home: undefined;
    TirthankarList: undefined;
    Reels: undefined;
};

const Stack = createNativeStackNavigator<RootStackParams>();
const Tab = createBottomTabNavigator<TabParams>();

// ── Bottom tabs ──
const TabNavigator = () => (
    <Tab.Navigator
        screenOptions={{
            headerShown: false,
            tabBarStyle: {
                backgroundColor: Theme.surface,
                borderTopColor: Theme.borderGold,
                height: 62,
                paddingBottom: 6,
                paddingTop: 6,
            },
            tabBarActiveTintColor: Theme.accent,
            tabBarInactiveTintColor: '#9CA3AF',
            tabBarLabelStyle: {
                fontSize: 12,
                fontWeight: '600',
            },
        }}
    >
        <Tab.Screen
            name="Home"
            component={HomeScreen}
            options={{
                tabBarIcon: () => <Text style={{ fontSize: 18 }}>🏠</Text>,
                tabBarLabel: 'Home',
            }}
        />

        <Tab.Screen
            name="TirthankarList"
            component={TirthankarListScreen}
            options={{
                tabBarIcon: () => <Text style={{ fontSize: 18 }}>🕉️</Text>,
                tabBarLabel: 'Tirthankars',
            }}
        />

        <Tab.Screen
            name="Reels"
            component={ReelsScreen}
            options={{
                tabBarIcon: () => <Text style={{ fontSize: 18 }}>▶️</Text>,
                tabBarLabel: 'Reels',
            }}
        />
    </Tab.Navigator>
);

// ── Root stack ──
export const AppNavigator = () => (
    <NavigationContainer
        ref={navigationRef}
        onReady={() => {
            navigationIntegration.registerNavigationContainer(navigationRef);
        }}
    >
        <Stack.Navigator
            screenOptions={{
                headerStyle: {
                    backgroundColor: Theme.surface,
                },
                headerTintColor: Theme.textPrimary,
                headerShadowVisible: false,
                contentStyle: {
                    backgroundColor: Theme.background,
                },
                headerShown: false,
            }}
        >
            <Stack.Screen
                name="Splash"
                component={SplashScreen}
            />

            <Stack.Screen
                name="MainTabs"
                component={TabNavigator}
            />

            <Stack.Screen
                name="TirthankarProfile"
                component={TirthankarProfileScreen}
                options={{
                    headerShown: false,
                }}
            />

            <Stack.Screen
                name="TirthDetail"
                component={TirthDetailScreen}
                options={{
                    headerShown: false,
                }}
            />
        </Stack.Navigator>
    </NavigationContainer>
);