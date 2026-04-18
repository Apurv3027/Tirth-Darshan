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
        <ScreenWrapper scroll backgroundColor="#0A0A18">
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
        color: '#E8D5B7',
        letterSpacing: 0.5,
    },

    subtitle: {
        fontSize: 14,
        color: '#7B7B94',
        marginTop: 8,
        lineHeight: 22,
    },

    quoteCard: {
        backgroundColor: '#13132A',
        borderRadius: 18,
        padding: 18,
        borderWidth: 1,
        borderColor: '#1E1E3F',
        marginBottom: 24,
    },

    quoteText: {
        fontSize: 18,
        color: '#E8D5B7',
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
        color: '#8B9ABB',
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
        backgroundColor: '#13132A',
        borderRadius: 18,
        padding: 16,
        marginBottom: 14,
        borderWidth: 1,
        borderColor: '#1E1E3F',
    },

    cardEmoji: {
        fontSize: 26,
        marginBottom: 12,
    },

    cardTitle: {
        fontSize: 15,
        color: '#E8D5B7',
        fontWeight: '700',
        marginBottom: 6,
    },

    cardDesc: {
        fontSize: 12,
        color: '#7B7B94',
        lineHeight: 18,
    },

    thoughtCard: {
        backgroundColor: '#C8960C12',
        borderWidth: 1,
        borderColor: '#C8960C30',
        borderRadius: 16,
        padding: 18,
    },

    thoughtText: {
        fontSize: 14,
        color: '#D9C8A4',
        lineHeight: 24,
    },

    footer: {
        textAlign: 'center',
        color: '#32324F',
        marginTop: 30,
        fontSize: 13,
        letterSpacing: 1,
    },
});