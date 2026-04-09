import React, { useState } from 'react';
import {
    View, Text, StyleSheet, ScrollView,
    TouchableOpacity, Switch, Alert
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import {
    ArrowLeft, Mail, Calendar, User, Lock, Shield,
    Bell, Users, ShoppingBag, Eye, UserX, Sun,
    Globe, HelpCircle, Bug, MessageSquare, Trash2, ChevronRight
} from 'lucide-react-native';
import { MOCK_USER } from '../../services/mock';

export default function SettingsScreen() {
    const navigation = useNavigation();
    const [notifPush, setNotifPush] = useState(true);
    const [notifSocial, setNotifSocial] = useState(true);
    const [notifMarket, setNotifMarket] = useState(true);
    const [profilPublic, setProfilPublic] = useState(true);
    const [statsVisibles, setStatsVisibles] = useState(true);
    const [modeSombre, setModeSombre] = useState(false);

    const Section = ({ title, icon: Icon, children }) => (
    <View style={styles.section}>
        <View style={styles.sectionHeader}>
            <Icon color="#4A26D0" size={18} />
            <Text style={styles.sectionTitle}>{title}</Text>
        </View>
        <View style={styles.sectionContent}>
            {children}
        </View>
    </View>
    );

    const RowItem = ({ icon: Icon, label, value, onPress }) => (
    <TouchableOpacity style={styles.row} onPress={onPress}>
        <View style={styles.rowLeft}>
            <Icon color="#909090" size={18} />
            <Text style={styles.rowLabel}>{label}</Text>
        </View>
        <View style={styles.rowRight}>
            {value && <Text style={styles.rowValue}>{value}</Text>}
            <ChevronRight color="#909090" size={18} />
        </View>
    </TouchableOpacity>
    );

    const ToggleItem = ({ icon: Icon, label, value, onValueChange }) => (
    <View style={styles.row}>
        <View style={styles.rowLeft}>
            <Icon color="#909090" size={18} />
            <Text style={styles.rowLabel}>{label}</Text>
        </View>
        <Switch
            value={value}
            onValueChange={onValueChange}
            trackColor={{ false: '#f0f0f0', true: '#4A26D0' }}
            thumbColor="#fff"
        />
    </View>
    );

    return (
    <ScrollView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
                <ArrowLeft color="#1C0256" size={24} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Paramètres</Text>
        <View style={{ width: 24 }} />
        </View>

        {/* Compte */}
        <Section title="Compte" icon={User}>
            <RowItem icon={Mail} label="Email" value="lelia@example.com" />
            <RowItem icon={Calendar} label="Date d'inscription" value="02/02/2026" />
            <RowItem icon={User} label="Type de compte" value="Particulier" />
        </Section>

        {/* Sécurité */}
        <Section title="Sécurité" icon={Shield}>
            <RowItem icon={Lock} label="Modifier le mot de passe" onPress={() => Alert.alert('Bientôt disponible')} />
            <RowItem icon={Shield} label="Authentification à deux facteurs" onPress={() => Alert.alert('Bientôt disponible')} />
        </Section>

        {/* Notifications */}
        <Section title="Notifications" icon={Bell}>
            <ToggleItem icon={Bell} label="Notifications push" value={notifPush} onValueChange={setNotifPush} />
            <ToggleItem icon={Users} label="Notifications social" value={notifSocial} onValueChange={setNotifSocial} />
            <ToggleItem icon={ShoppingBag} label="Notifications marketplace" value={notifMarket} onValueChange={setNotifMarket} />
        </Section>

        {/* Confidentialité */}
        <Section title="Confidentialité" icon={Eye}>
            <ToggleItem icon={Eye} label="Profil public" value={profilPublic} onValueChange={setProfilPublic} />
            <ToggleItem icon={Eye} label="Statistiques visibles" value={statsVisibles} onValueChange={setStatsVisibles} />
            <RowItem icon={UserX} label="Utilisateurs bloqués" onPress={() => Alert.alert('Bientôt disponible')} />
        </Section>

        {/* Affichage */}
        <Section title="Affichage" icon={Sun}>
            <ToggleItem icon={Sun} label="Mode sombre" value={modeSombre} onValueChange={setModeSombre} />
            <RowItem icon={Globe} label="Langue" value="Français" onPress={() => Alert.alert('Bientôt disponible')} />
        </Section>

        {/* Aide & Support */}
        <Section title="Aide & Support" icon={HelpCircle}>
            <RowItem icon={HelpCircle} label="Centre d'aide" onPress={() => Alert.alert('Bientôt disponible')} />
            <RowItem icon={Bug} label="Signaler un bug" onPress={() => Alert.alert('Bientôt disponible')} />
            <RowItem icon={MessageSquare} label="Contacter l'assistance" onPress={() => Alert.alert('Bientôt disponible')} />
        </Section>

        {/* Zone dangereuse */}
        <View style={styles.dangerSection}>
            <View style={styles.sectionContent}>
                <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={() => Alert.alert(
                        'Supprimer le compte',
                        'Cette action est irréversible. Êtes-vous sûr ?',
                        [
                        { text: 'Annuler', style: 'cancel' },
                        { text: 'Supprimer', style: 'destructive' }
                        ] 
                    )}
                >
                    <Trash2 color="#FF3B30" size={18} />
                    <Text style={styles.deleteText}>Supprimer mon compte</Text>
                </TouchableOpacity>
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
        overflow: 'hidden',
    },
    dangerSection: {
        marginHorizontal: 16,
        marginTop: 16,
        marginBottom: 32,
        backgroundColor: '#fff',
        borderRadius: 16,
        overflow: 'hidden',
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    sectionTitle: { fontSize: 15, fontWeight: 'bold', color: '#1C0256' },
    sectionContent: {},
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 14,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    rowLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
    rowRight: { flexDirection: 'row', alignItems: 'center', gap: 8 },
    rowLabel: { fontSize: 14, color: '#1C0256' },
    rowValue: { fontSize: 13, color: '#909090' },
    deleteButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        paddingVertical: 16,
    },
    deleteText: { color: '#FF3B30', fontWeight: '600', fontSize: 14 },
});