import React, { useState } from 'react';
import {
    View, Text, StyleSheet, TouchableOpacity,
    FlatList, Image, Alert
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ArrowLeft, UserX } from 'lucide-react-native';

const MOCK_BLOCKED_USERS = [
    {
        id: "1",
        username: "user_bloque1",
        avatar: "https://i.pravatar.cc/150?img=10",
    },
    {
        id: "2",
        username: "user_bloque2",
        avatar: "https://i.pravatar.cc/150?img=11",
    },
];

export default function BlockedUsersScreen() {
    const navigation = useNavigation();
    const [blockedUsers, setBlockedUsers] = useState(MOCK_BLOCKED_USERS);

    const handleUnblock = (userId) => {
    Alert.alert(
        'Débloquer',
        'Voulez-vous débloquer cet utilisateur ?',
        [
            { text: 'Annuler', style: 'cancel' },
            {
                text: 'Débloquer',
                onPress: () => setBlockedUsers(prev => prev.filter(u => u.id !== userId))
            }
        ]
    );
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <ArrowLeft color="#1C0256" size={24} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Utilisateurs bloqués</Text>
                <View style={{ width: 24 }} />
            </View>

        {blockedUsers.length === 0 ? (
        <View style={styles.emptyContainer}>
            <UserX color="#909090" size={48} />
            <Text style={styles.emptyTitle}>Aucun utilisateur bloqué</Text>
            <Text style={styles.emptySubtitle}>Les utilisateurs que vous bloquez apparaîtront ici</Text>
        </View>
        ) : (
        <FlatList
            data={blockedUsers}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContainer}
            renderItem={({ item }) => (
                <View style={styles.userRow}>
                    <Image source={{ uri: item.avatar }} style={styles.avatar} />
                    <Text style={styles.username}>{item.username}</Text>
                    <TouchableOpacity
                        style={styles.unblockButton}
                        onPress={() => handleUnblock(item.id)}
                    >
                        <Text style={styles.unblockText}>Débloquer</Text>
                    </TouchableOpacity>
                </View>
            )}
        />
        )}
    </View>
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
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        gap: 12,
    },
    emptyTitle: { fontSize: 18, fontWeight: '600', color: '#1C0256' },
    emptySubtitle: { fontSize: 14, color: '#909090', textAlign: 'center', paddingHorizontal: 40 },
    listContainer: { padding: 16 },
    userRow: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 12,
        marginBottom: 8,
        gap: 12,
    },
    avatar: { width: 48, height: 48, borderRadius: 24 },
    username: { flex: 1, fontSize: 15, fontWeight: '600', color: '#1C0256' },
    unblockButton: {
        backgroundColor: '#f0f0f0',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
    },
    unblockText: { fontSize: 13, fontWeight: '600', color: '#1C0256' },
});