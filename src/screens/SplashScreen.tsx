import React, { useEffect, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    StatusBar,
    Animated,
    Easing,
} from 'react-native';
import ScreenWrapper from '../components/ScreenWrapper';

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
        <ScreenWrapper backgroundColor="#0A0A18">
            <StatusBar barStyle="light-content" backgroundColor="#0A0A18" />

            <View style={styles.container}>
                {/* Logo */}
                <Animated.View
                    style={[
                        styles.logoWrapper,
                        {
                            opacity: opacityAnim,
                            transform: [{ scale: scaleAnim }],
                        },
                    ]}
                >
                    <View style={styles.innerCircle}>
                        <Text style={styles.logoEmoji}>🕉️</Text>
                    </View>
                </Animated.View>

                {/* Title */}
                <Animated.View
                    style={{
                        opacity: opacityAnim,
                        transform: [{ translateY: textAnim }],
                    }}
                >
                    <Text style={styles.title}>TirthDarshan</Text>
                    <Text style={styles.subtitle}>Jain Spiritual Journey</Text>
                </Animated.View>

                {/* Footer */}
                <Text style={styles.footer}>🙏 Jai Jinendra</Text>
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
        width: 130,
        height: 130,
        borderRadius: 65,
        borderWidth: 2,
        borderColor: '#C8960C60',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 28,
        backgroundColor: '#13132A',
    },

    innerCircle: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: '#C8960C18',
        justifyContent: 'center',
        alignItems: 'center',
    },

    logoEmoji: {
        fontSize: 54,
    },

    title: {
        fontSize: 32,
        fontWeight: '800',
        color: '#E8D5B7',
        textAlign: 'center',
        letterSpacing: 0.8,
    },

    subtitle: {
        fontSize: 14,
        color: '#8B9ABB',
        marginTop: 10,
        textAlign: 'center',
        letterSpacing: 1,
    },

    footer: {
        position: 'absolute',
        bottom: 40,
        color: '#4A5568',
        fontSize: 13,
        letterSpacing: 1,
    },
});