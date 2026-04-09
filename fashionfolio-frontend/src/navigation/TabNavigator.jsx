import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  ShieldCheck,
  Shirt,
  MessageSquare,
  Users,
  User,
  ShoppingBag,
} from "lucide-react-native";

import HomeScreen from "../screens/Home/HomePage";
import DressingScreen from "../screens/Dressing/DressingListScreen";
import MarketplaceScreen from "../screens/MarketPlace/MarketPlaceScreen";
import SocialScreen from "../screens/Social/FeedScreen";
import ProfileScreen from "../screens/Profile/ProfileScreen";

const Tab = createBottomTabNavigator();

export default function TabNavigator() {
  const insets = useSafeAreaInsets();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: "#4A26D0",
        tabBarInactiveTintColor: "gray",
        tabBarStyle: {
          backgroundColor: "#ffffff",
          borderTopWidth: 0.5,
          borderTopColor: "#F3F4F6",
          elevation: 0,
          height: 60 + insets.bottom,
          paddingBottom: insets.bottom,
          paddingTop: 8,
        },
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
        component={DressingScreen}
        options={{
          tabBarIcon: ({ color }) => <Shirt color={color} size={24} />,
        }}
      />
      <Tab.Screen
        name="MarketPlace"
        component={MarketplaceScreen}
        options={{
          tabBarIcon: ({ color }) => <ShoppingBag color={color} size={24} />,
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
