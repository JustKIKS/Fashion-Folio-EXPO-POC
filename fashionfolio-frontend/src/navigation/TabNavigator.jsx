import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import {
  ShieldCheck,
  Shirt,
  MessageSquare,
  Users,
  User,
} from "lucide-react-native";

import HomeScreen from "../screens/Home/HomeScreen";
import DressingListScreen from "../screens/Dressing/DressingListScreen";
import ChatScreen from "../screens/Chat/ChatScreen";
import SocialScreen from "../screens/Social/FeedScreen";
import ProfileScreen from "../screens/Profile/ProfileScreen";

const Tab = createBottomTabNavigator();

export default function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: "#FF6B6B",
        tabBarInactiveTintColor: "gray",
        tabBarStyle: { height: 60, paddingBottom: 10 },
      })}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ color }) => <ShieldCheck color={color} size={24} />,
        }}
      />
      <Tab.Screen
        name="Dressing"
        component={DressingListScreen}
        options={{
          tabBarIcon: ({ color }) => <Shirt color={color} size={24} />,
        }}
      />
      <Tab.Screen
        name="IA Chat"
        component={ChatScreen}
        options={{
          tabBarIcon: ({ color }) => <MessageSquare color={color} size={24} />,
        }}
      />
      <Tab.Screen
        name="Social"
        component={SocialScreen}
        options={{
          tabBarIcon: ({ color }) => <Users color={color} size={24} />,
        }}
      />
      <Tab.Screen
        name="Profil"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ color }) => <User color={color} size={24} />,
        }}
      />
    </Tab.Navigator>
  );
}
