import React, { useEffect, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    StatusBar,
    Animated,
    Easing,
    Image,
    ActivityIndicator,
} from 'react-native';
import ScreenWrapper from '../components/ScreenWrapper';
import { Images } from '../assets/images';
import { Theme } from '../config/theme';

type Props = {
    navigation: any;
};

export const SplashScreen = ({ navigation }: Props) => {
    const scaleAnim = useRef(new Animated.Value(0.7)).current;
    const opacityAnim = useRef(new Animated.Value(0)).current;
    const textAnim = useRef(new Animated.Value(20)).current;

    useEffect(() => {
        Animated.parallel([
            Animated.timing(scaleAnim, {
                toValue: 1,
                duration: 1400,
                easing: Easing.out(Easing.exp),
                useNativeDriver: true,
            }),
            Animated.timing(opacityAnim, {
                toValue: 1,
                duration: 1400,
                useNativeDriver: true,
            }),
            Animated.timing(textAnim, {
                toValue: 0,
                duration: 1200,
                useNativeDriver: true,
            }),
        ]).start();

        const timer = setTimeout(() => {
            navigation.replace('MainTabs');
        }, 2600);

        return () => clearTimeout(timer);
    }, [navigation, opacityAnim, scaleAnim, textAnim]);

    return (
        <ScreenWrapper backgroundColor={Theme.primary}>
            <StatusBar barStyle="light-content" backgroundColor={Theme.primary} />

            <View style={styles.container}>
                <Animated.View
                    style={[
                        styles.logoWrapper,
                        {
                            opacity: opacityAnim,
                            transform: [{ scale: scaleAnim }],
                        },
                    ]}
                >
                    <Image
                        source={Images.splashScreenLogo}
                        style={styles.logoImage}
                        resizeMode="cover"
                    />
                </Animated.View>

                <Animated.View
                    style={{
                        opacity: opacityAnim,
                        transform: [{ translateY: textAnim }],
                    }}
                >
                    <Text style={styles.title}>TirthDarshan</Text>
                    <Text style={styles.subtitle}>Jain Spiritual Journey</Text>
                </Animated.View>

                {/* Loader */}
                <View style={styles.footer}>
                    <ActivityIndicator size="small" color={Theme.accent} />
                    <Text style={styles.loadingText}>Loading...</Text>
                </View>
            </View>
        </ScreenWrapper>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 24,
    },

    logoWrapper: {
        width: 180,
        height: 180,
        borderRadius: 90,
        borderWidth: 3,
        borderColor: Theme.accent,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 28,
        backgroundColor: Theme.primary,
        elevation: 8,
        overflow: 'hidden', // clips the corners of the square image
    },

    logoImage: {
        width: 174,
        height: 174,
        borderRadius: 87,
    },

    title: {
        fontSize: 32,
        fontWeight: '800',
        color: '#FFFFFF',
        textAlign: 'center',
    },

    subtitle: {
        fontSize: 14,
        color: Theme.accent,
        marginTop: 10,
        textAlign: 'center',
        fontWeight: '600',
        letterSpacing: 1.2,
    },

    loaderContainer: {
        marginTop: 30,
        alignItems: 'center',
    },

    loadingText: {
        marginTop: 8,
        fontSize: 13,
        color: Theme.accent,
        opacity: 0.8,
    },

    footer: {
        position: 'absolute',
        bottom: 40,
        alignItems: 'center',
    },
});