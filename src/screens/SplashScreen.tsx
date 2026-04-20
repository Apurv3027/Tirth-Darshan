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
        <ScreenWrapper backgroundColor="#FDFBF6">
            <StatusBar barStyle="dark-content" backgroundColor="#FDFBF6" />

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
                    <View style={styles.innerCircle}>
                        <Image
                            source={Images.splashScreenLogo}
                            style={styles.logoImage}
                            resizeMode="contain"
                        />
                    </View>
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
                    <ActivityIndicator size="small" color="#D4AF37" />
                    <Text style={styles.loadingText}>Loading...</Text>
                </View>

                {/* <Text style={styles.footer}>🙏 Jai Jinendra</Text> */}
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
        borderWidth: 2,
        borderColor: '#D4AF37',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 28,
        backgroundColor: '#FFF8E7',
        elevation: 8,
    },

    innerCircle: {
        width: 145,
        height: 145,
        borderRadius: 72,
        backgroundColor: '#FFFFFF',
        justifyContent: 'center',
        alignItems: 'center',
    },

    logoImage: {
        width: 130,
        height: 130,
    },

    title: {
        fontSize: 32,
        fontWeight: '800',
        color: '#8B5E00',
        textAlign: 'center',
    },

    subtitle: {
        fontSize: 14,
        color: '#7A7A7A',
        marginTop: 10,
        textAlign: 'center',
    },

    loaderContainer: {
        marginTop: 30,
        alignItems: 'center',
    },

    loadingText: {
        marginTop: 8,
        fontSize: 13,
        color: '#9C7C38',
    },

    footer: {
        position: 'absolute',
        bottom: 40,
        color: '#9C7C38',
        fontSize: 13,
    },
});