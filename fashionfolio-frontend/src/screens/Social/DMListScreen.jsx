import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { View, Text, StyleSheet, TouchableOpacity, Image, FlatList } from 'react-native';
import { ArrowLeft, Search, MessageCircle } from 'lucide-react-native';
import { FAKE_CONVERSATIONS } from '../../services/mock';

export default function DMListScreen() {
    const navigation = useNavigation();
    const [conversations, setConversations] = useState(FAKE_CONVERSATIONS);

    const getTimeAgo = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffInMs = now - date;
        const diffInMins = Math.floor(diffInMs / 60000);
        const diffInHours = Math.floor(diffInMs / 3600000);
        const diffInDays = Math.floor(diffInMs / 86400000);

        if (diffInMins < 60) return `${diffInMins} min`;
        if (diffInHours < 24) return `${diffInHours}h`;
        return `${diffInDays}j`;
    };

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <ArrowLeft color="#1C0256" size={24} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Messages</Text>
                <TouchableOpacity>
                    <Search color="#1C0256" size={24} />
                </TouchableOpacity>
            </View>

        {/* Liste des conversations */}
        {conversations.length === 0 ? (
            <View style={styles.emptyContainer}>
                <MessageCircle color="#909090" size={48} />
                <Text style={styles.emptyTitle}>Aucun message</Text>
                <Text style={styles.emptySubtitle}>Vos conversations apparaîtront ici</Text>
            </View>
        ) : (
            <FlatList
                data={conversations}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.listContainer}
                renderItem={({ item }) => (
            <TouchableOpacity
                style={styles.convCard}
                onPress={() => {
                setConversations(prev =>
                    prev.map(conv =>
                    conv.id === item.id ? { ...conv, unread_count: 0 } : conv
                    )
                );
                navigation.navigate('DMConversation', { conversation: item });
                }}
            >
                {/* Avatar */}
                <View style={styles.avatarContainer}>
                    <Image source={{ uri: item.participant_avatar }} style={styles.avatar} />
                    {item.unread_count > 0 && (
                        <View style={styles.badge}>
                            <Text style={styles.badgeText}>{item.unread_count}</Text>
                        </View>
                    )}
                </View>

            {/* Contenu */}
            <View style={styles.convContent}>
                <View style={styles.convHeader}>
                    <Text style={styles.convName}>{item.participant_name}</Text>
                    <Text style={styles.convTime}>{getTimeAgo(item.last_message_date)}</Text>
                </View>
                    <Text
                        style={[styles.convMessage, item.unread_count > 0 && styles.convMessageUnread]}
                        numberOfLines={1}
                    >
                    {item.last_message}
                    </Text>
                </View>
            </TouchableOpacity>
            )}
            />
        )}
    </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: 60,
        paddingBottom: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#1C0256',
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        gap: 12,
    },
    emptyTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#1C0256',
    },
    emptySubtitle: {
        fontSize: 14,
        color: '#909090',
        textAlign: 'center',
    },
    listContainer: {
        padding: 16,
    },
    convCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 12,
        borderWidth: 1,
        borderColor: '#f0f0f0',
        marginBottom: 8,
    },
    avatarContainer: {
        position: 'relative',
        marginRight: 12,
    },
    avatar: {
        width: 56,
        height: 56,
        borderRadius: 28,
    },
    badge: {
        position: 'absolute',
        top: -2,
        right: -2,
        width: 22,
        height: 22,
        borderRadius: 11,
        backgroundColor: '#FF3B30',
        justifyContent: 'center',
        alignItems: 'center',
    },
    badgeText: {
        color: '#fff',
        fontSize: 11,
        fontWeight: 'bold',
    },
    convContent: {
        flex: 1,
    },
    convHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 4,
    },
    convName: {
        fontSize: 15,
        fontWeight: '600',
        color: '#1C0256',
    },
    convTime: {
        fontSize: 12,
        color: '#909090',
    },
    convMessage: {
        fontSize: 13,
        color: '#909090',
    },
    convMessageUnread: {
        fontWeight: '600',
        color: '#1C0256',
    },
});