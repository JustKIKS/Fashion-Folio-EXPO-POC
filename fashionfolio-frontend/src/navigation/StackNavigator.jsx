import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import TabNavigator from './TabNavigator';
import DMListScreen from '../screens/Social/DMListScreen';
import DMConversationScreen from '../screens/Social/DMConversationScreen';

const Stack = createNativeStackNavigator();

export default function StackNavigator() {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Tabs" component={TabNavigator} />
            <Stack.Screen name="DMList" component={DMListScreen} />
            <Stack.Screen name="DMConversation" component={DMConversationScreen} />
        </Stack.Navigator>
    );
}