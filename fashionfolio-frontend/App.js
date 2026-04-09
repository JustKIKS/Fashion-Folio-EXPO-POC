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
        </Stack.Navigator>
      </NavigationContainer>
    </MarketplaceProvider>
  );
}
