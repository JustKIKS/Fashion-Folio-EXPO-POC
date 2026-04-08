import React, { useState, useRef, useEffect } from 'react';
import {
    View, Text, StyleSheet, TouchableOpacity,
    TextInput, FlatList, KeyboardAvoidingView, Platform
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { ArrowLeft, Send } from 'lucide-react-native';
import { markAsRead } from '../../services/mock';

const MOCK_MESSAGES_BY_CONVERSATION = {
    "fake-1": [
        { id: "1", sender: "other", content: "Salut ! J'adore ton dernier look 😍", created_at: "2024-04-08T10:00:00.000Z" },
        { id: "2", sender: "me", content: "Merci beaucoup !", created_at: "2024-04-08T10:01:00.000Z" },
        { id: "3", sender: "other", content: "Tu as un super style ✨", created_at: "2024-04-08T10:02:00.000Z" },
    ],
    "fake-2": [
        { id: "1", sender: "other", content: "Tu as acheté où ce manteau ?", created_at: "2024-04-08T08:00:00.000Z" },
        { id: "2", sender: "me", content: "Sur Zara ! Ils ont de super pièces en ce moment 🙌", created_at: "2024-04-08T08:01:00.000Z" },
        { id: "3", sender: "other", content: "Merci je vais regarder !", created_at: "2024-04-08T08:02:00.000Z" },
    ],
    "fake-3": [
        { id: "1", sender: "me", content: "Contente que les conseils t'aient aidé !", created_at: "2024-04-08T07:00:00.000Z" },
        { id: "2", sender: "other", content: "Merci pour les conseils ! 🙏", created_at: "2024-04-08T07:01:00.000Z" },
        { id: "3", sender: "other", content: "Tu es trop gentille 🥰", created_at: "2024-04-08T07:02:00.000Z" },
    ],
    "fake-4": [
        { id: "1", sender: "other", content: "Super tenue pour l'événement 👌", created_at: "2024-04-07T20:00:00.000Z" },
        { id: "2", sender: "me", content: "Merci ! J'avais hésité longtemps 😅", created_at: "2024-04-07T20:01:00.000Z" },
        { id: "3", sender: "other", content: "Tu avais bien fait de choisir celle-là !", created_at: "2024-04-07T20:02:00.000Z" },
    ],
};

export default function DMConversationScreen() {
    const navigation = useNavigation();
    const route = useRoute();
    const conversation = route.params?.conversation;
    const [messages, setMessages] = useState(
        MOCK_MESSAGES_BY_CONVERSATION[conversation?.id] || []
    );
    const [input, setInput] = useState("");
    const flatListRef = useRef(null);

    useEffect(() => {
        if (conversation?.id) {
            markAsRead(conversation.id);
        }
    }, []);

    const handleSend = () => {
        if (!input.trim()) return;
        const newMessage = {
            id: String(messages.length + 1),
            sender: "me",
            content: input.trim(),
            created_at: new Date().toISOString()
        };
        setMessages(prev => [...prev, newMessage]);
        setInput("");
        setTimeout(() => {
            flatListRef.current?.scrollToEnd({ animated: true });
        }, 100);
    };

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <ArrowLeft color="#1C0256" size={24} />
                </TouchableOpacity>
                <View style={styles.headerUser}>
                    <View style={styles.headerAvatar}>
                        <Text style={styles.headerAvatarText}>
                            {conversation?.participant_name?.[0]?.toUpperCase() || 'U'}
                        </Text>
                    </View>
                    <Text style={styles.headerName}>
                        {conversation?.participant_name || 'Utilisateur'}
                    </Text>
                </View>
            </View>

            <FlatList
                ref={flatListRef}
                data={messages}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.messagesList}
                onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
                renderItem={({ item }) => (
                    <View style={[
                        styles.messageRow,
                        item.sender === 'me' ? styles.messageRowRight : styles.messageRowLeft
                    ]}>
                        <View style={[
                            styles.messageBubble,
                            item.sender === 'me' ? styles.bubbleMe : styles.bubbleOther
                        ]}>
                            <Text style={[
                                styles.messageText,
                                item.sender === 'me' ? styles.messageTextMe : styles.messageTextOther
                            ]}>
                                {item.content}
                            </Text>
                        </View>
                    </View>
                )}
            />

            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    value={input}
                    onChangeText={setInput}
                    placeholder="Écrivez un message..."
                    placeholderTextColor="#909090"
                    onSubmitEditing={handleSend}
                />
                <TouchableOpacity
                    style={[styles.sendButton, !input.trim() && styles.sendButtonDisabled]}
                    onPress={handleSend}
                    disabled={!input.trim()}
                >
                    <Send color="#fff" size={20} />
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff' },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: 60,
        paddingBottom: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
        gap: 12,
    },
    headerUser: { flexDirection: 'row', alignItems: 'center', gap: 10 },
    headerAvatar: {
        width: 40, height: 40, borderRadius: 20,
        backgroundColor: '#4A26D0',
        justifyContent: 'center', alignItems: 'center',
    },
    headerAvatarText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
    headerName: { fontSize: 16, fontWeight: '600', color: '#1C0256' },
    messagesList: { padding: 16, gap: 8 },
    messageRow: { marginBottom: 8 },
    messageRowRight: { alignItems: 'flex-end' },
    messageRowLeft: { alignItems: 'flex-start' },
    messageBubble: { maxWidth: '75%', borderRadius: 18, paddingHorizontal: 16, paddingVertical: 10 },
    bubbleMe: { backgroundColor: '#4A26D0' },
    bubbleOther: { backgroundColor: '#f0f0f0' },
    messageText: { fontSize: 14, lineHeight: 20 },
    messageTextMe: { color: '#fff' },
    messageTextOther: { color: '#1C0256' },
    inputContainer: {
        flexDirection: 'row', alignItems: 'center',
        paddingHorizontal: 16, paddingVertical: 12,
        borderTopWidth: 1, borderTopColor: '#f0f0f0', gap: 10,
    },
    input: {
        flex: 1, backgroundColor: '#f5f5f5', borderRadius: 24,
        paddingHorizontal: 16, paddingVertical: 10, fontSize: 14, color: '#1C0256',
    },
    sendButton: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#4A26D0', justifyContent: 'center', alignItems: 'center' },
    sendButtonDisabled: { backgroundColor: '#E5E7EB' },
});