import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function DMConversationScreen() {
    return (
        <View style={styles.container}>
            <Text>Conversation</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
});