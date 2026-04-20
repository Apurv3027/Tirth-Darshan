import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
} from 'react-native';
import ScreenWrapper from '../components/ScreenWrapper';

export const HomeScreen = () => {
    return (
        <ScreenWrapper scroll backgroundColor="#FDFBF6">
            <View style={styles.container}>
                {/* Header */}
                <View style={styles.header}>
                    <Text style={styles.greeting}>🙏 Jai Jinendra</Text>
                    <Text style={styles.title}>TirthDarshan</Text>
                    <Text style={styles.subtitle}>
                        Explore Jain Tirths, Tirthankars & Spiritual Wisdom
                    </Text>
                </View>

                {/* Quote Card */}
                <View style={styles.quoteCard}>
                    <Text style={styles.quoteText}>
                        "Live and let live."
                    </Text>
                    <Text style={styles.quoteAuthor}>
                        — Lord Mahavir
                    </Text>
                </View>

                {/* Quick Actions */}
                <Text style={styles.sectionTitle}>Quick Explore</Text>

                <View style={styles.grid}>
                    <TouchableOpacity style={styles.card} activeOpacity={0.8}>
                        <Text style={styles.cardEmoji}>🕉️</Text>
                        <Text style={styles.cardTitle}>24 Tirthankars</Text>
                        <Text style={styles.cardDesc}>Learn sacred profiles</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.card} activeOpacity={0.8}>
                        <Text style={styles.cardEmoji}>🏛️</Text>
                        <Text style={styles.cardTitle}>Holy Tirths</Text>
                        <Text style={styles.cardDesc}>Visit divine places</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.card} activeOpacity={0.8}>
                        <Text style={styles.cardEmoji}>📿</Text>
                        <Text style={styles.cardTitle}>Teachings</Text>
                        <Text style={styles.cardDesc}>Daily inspiration</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.card} activeOpacity={0.8}>
                        <Text style={styles.cardEmoji}>🙏</Text>
                        <Text style={styles.cardTitle}>Darshan</Text>
                        <Text style={styles.cardDesc}>Feel spiritual peace</Text>
                    </TouchableOpacity>
                </View>

                {/* Today's Thought */}
                <Text style={styles.sectionTitle}>Today's Thought</Text>

                <View style={styles.thoughtCard}>
                    <Text style={styles.thoughtText}>
                        Non-violence is the highest religion. Compassion begins with every small action.
                    </Text>
                </View>

                {/* Footer */}
                <Text style={styles.footer}>🕉️ TirthDarshan</Text>
            </View>
        </ScreenWrapper>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 18,
        paddingBottom: 30,
    },

    header: {
        marginTop: 8,
        marginBottom: 24,
    },

    greeting: {
        fontSize: 14,
        color: '#C8960C',
        marginBottom: 8,
        fontWeight: '600',
    },

    title: {
        fontSize: 32,
        fontWeight: '800',
        color: '#8B5E00',
        letterSpacing: 0.5,
    },

    subtitle: {
        fontSize: 14,
        color: '#6B7280',
        marginTop: 8,
        lineHeight: 22,
    },

    quoteCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 18,
        padding: 18,
        borderWidth: 1,
        borderColor: '#F1E4C7',
        marginBottom: 24,
        elevation: 3,
    },

    quoteText: {
        fontSize: 18,
        color: '#5B3A00',
        fontWeight: '700',
        lineHeight: 28,
    },

    quoteAuthor: {
        marginTop: 12,
        color: '#C8960C',
        fontSize: 13,
        fontWeight: '600',
    },

    sectionTitle: {
        fontSize: 15,
        color: '#7A7A7A',
        fontWeight: '700',
        marginBottom: 14,
        letterSpacing: 0.5,
    },

    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        marginBottom: 24,
    },

    card: {
        width: '48%',
        backgroundColor: '#FFFFFF',
        borderRadius: 18,
        padding: 16,
        marginBottom: 14,
        borderWidth: 1,
        borderColor: '#F3E8D0',
        elevation: 2,
    },

    cardEmoji: {
        fontSize: 26,
        marginBottom: 12,
    },

    cardTitle: {
        fontSize: 15,
        color: '#8B5E00',
        fontWeight: '700',
        marginBottom: 6,
    },

    cardDesc: {
        fontSize: 12,
        color: '#6B7280',
        lineHeight: 18,
    },

    thoughtCard: {
        backgroundColor: '#FFF8E7',
        borderWidth: 1,
        borderColor: '#F1D68A',
        borderRadius: 16,
        padding: 18,
    },

    thoughtText: {
        fontSize: 14,
        color: '#6B4F00',
        lineHeight: 24,
    },

    footer: {
        textAlign: 'center',
        color: '#A68A54',
        marginTop: 30,
        fontSize: 13,
        letterSpacing: 1,
    },
});