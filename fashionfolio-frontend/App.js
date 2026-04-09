import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { MarketplaceProvider } from "./src/context/MarketplaceContext";
import TabNavigator from "./src/navigation/TabNavigator";
import AddClothingScreen from "./src/screens/Dressing/AddClothingScreen";
import DMListScreen from "./src/screens/Social/DMListScreen";
import DMConversationScreen from "./src/screens/Social/DMConversationScreen";
import LoginScreen from "./src/screens/Auth/LoginScreen";
import RegisterScreen from "./src/screens/Auth/RegisterScreen";
import SellItemScreen from "./src/screens/MarketPlace/SellItem.jsx";
import ListingDetailsScreen from "./src/screens/MarketPlace/ListingDetails";
import EditProfileScreen from './src/screens/Profile/EditProfileScreen';
import SettingsScreen from './src/screens/Profile/SettingsScreen';
import ChangePasswordScreen from './src/screens/Profile/ChangePasswordScreen';
import BlockedUsersScreen from './src/screens/Profile/BlockedUsersScreen';
import LanguageScreen from './src/screens/Profile/LanguageScreen';
import SubscriptionsScreen from './src/screens/Profile/SubscriptionsScreen';
import StatsScreen from './src/screens/Profile/StatsScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  const [initialRoute, setInitialRoute] = useState(null);

  useEffect(() => {
    AsyncStorage.getItem("token").then((token) => {
      setInitialRoute(token ? "MainTabs" : "Login");
    });
  }, []);

  if (!initialRoute) return null;

  return (
    <MarketplaceProvider>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName={initialRoute}
          screenOptions={{ headerShown: false }}
        >
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
          <Stack.Screen name="MainTabs" component={TabNavigator} />
          <Stack.Screen
            name="AddClothing"
            component={AddClothingScreen}
            options={{ presentation: "modal", headerShown: false }}
          />
          <Stack.Screen name="DMList" component={DMListScreen} />
          <Stack.Screen name="DMConversation" component={DMConversationScreen} />
          <Stack.Screen
            name="SellItem"
            component={SellItemScreen}
            options={{ presentation: "modal" }}
          />
          <Stack.Screen name="ListingDetails" component={ListingDetailsScreen} />
          <Stack.Screen name="EditProfile" component={EditProfileScreen} />
          <Stack.Screen name="Settings" component={SettingsScreen} />
          <Stack.Screen name="ChangePassword" component={ChangePasswordScreen} />
          <Stack.Screen name="BlockedUsers" component={BlockedUsersScreen} />
          <Stack.Screen name="Language" component={LanguageScreen} />
          <Stack.Screen name="Subscriptions" component={SubscriptionsScreen} />
          <Stack.Screen name="Stats" component={StatsScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </MarketplaceProvider>
  );
}

