import React from 'react';
import {
    View, Text, StyleSheet, ScrollView, TouchableOpacity
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ArrowLeft, TrendingUp, Heart, Shirt, Calendar, Users } from 'lucide-react-native';
import { MOCK_USER } from '../../services/mock';

export default function StatsScreen() {
    const navigation = useNavigation();

    const stats = [
        { icon: Shirt, label: 'Pièces dans le dressing', value: MOCK_USER.stats.pieces, color: '#4A26D0' },
        { icon: Calendar, label: 'Tenues créées', value: MOCK_USER.stats.outfits, color: '#C084FC' },
        { icon: TrendingUp, label: 'Fois portées', value: MOCK_USER.stats.worn, color: '#4A26D0' },
        { icon: Heart, label: 'Likes reçus', value: MOCK_USER.stats.likes, color: '#FF3B30' },
        { icon: Users, label: 'Abonnés', value: MOCK_USER.stats.followers, color: '#4A26D0' },
        { icon: Users, label: 'Abonnements', value: MOCK_USER.stats.following, color: '#C084FC' },
    ];

    return (
        <ScrollView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <ArrowLeft color="#1C0256" size={24} />
                </TouchableOpacity>
                    <Text style={styles.headerTitle}>Mes statistiques</Text>
                    <View style={{ width: 24 }} />
            </View>

            {/* Stats globales */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Vue globale</Text>
                    <View style={styles.statsGrid}>
                        {stats.map((stat, idx) => {
                        const Icon = stat.icon;
                        return (
                            <View key={idx} style={styles.statCard}>
                                <Icon color={stat.color} size={24} />
                                <Text style={[styles.statNumber, { color: stat.color }]}>{stat.value}</Text>
                                <Text style={styles.statLabel}>{stat.label}</Text>
                            </View>
                        );
                        })}
                    </View>
            </View>

            {/* Style préféré */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Styles préférés</Text>
                    <View style={styles.tagsContainer}>
                        {['Streetwear', 'Casual', 'Élégant', 'Minimaliste'].map((style, idx) => (
                            <View key={idx} style={styles.tag}>
                                <Text style={styles.tagText}>{style}</Text>
                            </View>
                        ))}
                    </View>
            </View>

            {/* Couleurs préférées */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Couleurs dominantes</Text>
                <View style={styles.colorsContainer}>
                    {[
                        { color: '#1C0256', label: 'Violet foncé' },
                        { color: '#000000', label: 'Noir' },
                        { color: '#FFFFFF', label: 'Blanc' },
                        { color: '#909090', label: 'Gris' },
                    ].map((item, idx) => (
                    <View key={idx} style={styles.colorItem}>
                        <View style={[styles.colorCircle, { backgroundColor: item.color, borderWidth: item.color === '#FFFFFF' ? 1 : 0, borderColor: '#f0f0f0' }]} />
                        <Text style={styles.colorLabel}>{item.label}</Text>
                    </View>
                    ))}
                </View>
        </View>
    </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f5f5f5' },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: 60,
        paddingBottom: 16,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#1C0256' },
    section: {
        marginHorizontal: 16,
        marginTop: 16,
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 16,
    },
    sectionTitle: { fontSize: 16, fontWeight: 'bold', color: '#1C0256', marginBottom: 16 },
    statsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
    },
    statCard: {
        width: '47%',
        backgroundColor: '#F3F0FF',
        borderRadius: 12,
        padding: 16,
        alignItems: 'center',
        gap: 8,
    },
    statNumber: { fontSize: 28, fontWeight: 'bold' },
    statLabel: { fontSize: 12, color: '#909090', textAlign: 'center' },
    tagsContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
    tag: {
        backgroundColor: '#EDE9FE',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
    },
    tagText: { color: '#4A26D0', fontWeight: '600', fontSize: 13 },
    colorsContainer: { flexDirection: 'row', gap: 16, flexWrap: 'wrap' },
    colorItem: { alignItems: 'center', gap: 8 },
    colorCircle: { width: 48, height: 48, borderRadius: 24 },
    colorLabel: { fontSize: 11, color: '#909090' },
});