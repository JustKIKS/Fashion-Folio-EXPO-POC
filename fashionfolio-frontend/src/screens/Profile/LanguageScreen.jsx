import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ArrowLeft, Check } from 'lucide-react-native';

const LANGUAGES = [
    { id: 'fr', label: 'Français', flag: '🇫🇷' },
    { id: 'en', label: 'English', flag: '🇬🇧' },
    { id: 'es', label: 'Español', flag: '🇪🇸' },
    { id: 'it', label: 'Italiano', flag: '🇮🇹' },
    { id: 'de', label: 'Deutsch', flag: '🇩🇪' },
];

export default function LanguageScreen() {
    const navigation = useNavigation();
    const [selectedLanguage, setSelectedLanguage] = useState('fr');

    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <ArrowLeft color="#1C0256" size={24} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Langue</Text>
                <View style={{ width: 24 }} />
            </View>

        <View style={styles.listContainer}>
            {LANGUAGES.map((lang) => (
            <TouchableOpacity
                key={lang.id}
                style={styles.languageRow}
                onPress={() => setSelectedLanguage(lang.id)}
            >
            <View style={styles.languageLeft}>
                <Text style={styles.flag}>{lang.flag}</Text>
                <Text style={styles.languageLabel}>{lang.label}</Text>
            </View>
                {selectedLanguage === lang.id && (
                <Check color="#4A26D0" size={20} />
                )}
            </TouchableOpacity>
        ))}
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
    listContainer: {
        marginHorizontal: 16,
        marginTop: 16,
        backgroundColor: '#fff',
        borderRadius: 16,
        overflow: 'hidden',
    },
    languageRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    languageLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
    flag: { fontSize: 24 },
    languageLabel: { fontSize: 15, color: '#1C0256' },
});