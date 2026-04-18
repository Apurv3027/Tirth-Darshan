import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text } from 'react-native';

import { HomeScreen } from '../screens/HomeScreen';
import { TirthankarListScreen } from '../screens/TirthankarListScreen';
import { TirthankarProfileScreen } from '../screens/TirthankarProfileScreen';
import { TirthDetailScreen } from '../screens/TirthDetailScreen';
// import { ReelsScreen } from '../screens/ReelsScreen';
import { SplashScreen } from '../screens/SplashScreen';

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
            tabBarStyle: { backgroundColor: '#0D0D1A', borderTopColor: '#1A1A2E' },
            tabBarActiveTintColor: '#6B8CFF',
            tabBarInactiveTintColor: '#555',
        }}
    >
        <Tab.Screen
            name="Home"
            component={HomeScreen}
            options={{ tabBarIcon: () => <Text>🏠</Text>, tabBarLabel: 'Home' }}
        />
        <Tab.Screen
            name="TirthankarList"
            component={TirthankarListScreen}
            options={{ tabBarIcon: () => <Text>🕉️</Text>, tabBarLabel: 'Tirthankars' }}
        />
        {/* <Tab.Screen
            name="Reels"
            component={ReelsScreen}
            options={{ tabBarIcon: () => <Text>▶️</Text>, tabBarLabel: 'Reels' }}
        /> */}
    </Tab.Navigator>
);

// ── Root stack ──
export const AppNavigator = () => (
    <NavigationContainer>
        <Stack.Navigator
            screenOptions={{
                headerStyle: { backgroundColor: '#0D0D1A' },
                headerTintColor: '#E8D5B7',
                headerShown: false,
            }}
        >
            <Stack.Screen
                name="Splash"
                component={SplashScreen}
            />
            <Stack.Screen name="MainTabs" component={TabNavigator} />
            <Stack.Screen
                name="TirthankarProfile"
                component={TirthankarProfileScreen}
                options={{
                    headerShown: false,
                }}
            />
            <Stack.Screen name="TirthDetail" component={TirthDetailScreen}
                options={{ headerShown: true, title: '' }} />
        </Stack.Navigator>
    </NavigationContainer>
);