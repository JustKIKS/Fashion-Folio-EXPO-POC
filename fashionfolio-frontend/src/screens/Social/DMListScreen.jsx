import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { View, Text, StyleSheet, TouchableOpacity, Image, FlatList } from 'react-native';
import { ArrowLeft, Search, MessageCircle } from 'lucide-react-native';

const fakeConversations = [
    {
        id: "fake-1",
        participant_emails: ["sophie.martin@example.com"],
        participant_name: "Sophie Martin",
        participant_avatar: "https://i.pravatar.cc/150?img=1",
        last_message: "J'adore ton dernier look ! 😍",
        last_message_date: new Date(Date.now() - 300000).toISOString(),
        unread_count: 2
    },
    {
        id: "fake-2",
        participant_emails: ["thomas.dubois@example.com"],
        participant_name: "Thomas Dubois",
        participant_avatar: "https://i.pravatar.cc/150?img=12",
        last_message: "Tu as acheté où ce manteau ?",
        last_message_date: new Date(Date.now() - 3600000).toISOString(),
        unread_count: 0
    },
    {
        id: "fake-3",
        participant_emails: ["emma.laurent@example.com"],
        participant_name: "Emma Laurent",
        participant_avatar: "https://i.pravatar.cc/150?img=5",
        last_message: "Merci pour les conseils ! 🙏",
        last_message_date: new Date(Date.now() - 7200000).toISOString(),
        unread_count: 1
    },
    {
        id: "fake-4",
        participant_emails: ["lucas.bernard@example.com"],
        participant_name: "Lucas Bernard",
        participant_avatar: "https://i.pravatar.cc/150?img=14",
        last_message: "Super tenue pour l'événement 👌",
        last_message_date: new Date(Date.now() - 86400000).toISOString(),
        unread_count: 0
    }
];

export default function DMListScreen() {
    const navigation = useNavigation();
    const [conversations] = useState(fakeConversations);

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

        </View>
    );
}