import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

// Imports des navigateurs et écrans
import TabNavigator from "./src/navigation/TabNavigator";
import AddClothingScreen from "./src/screens/Dressing/AddClothingScreen";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {/* 1. Le bloc principal avec le menu du bas */}
        <Stack.Screen name="MainTabs" component={TabNavigator} />

        {/* 2. L'écran d'ajout (accessible depuis n'importe quel onglet) */}
        <Stack.Screen
          name="AddClothing"
          component={AddClothingScreen}
          options={{
            presentation: "modal", // Animation fluide de bas en haut sur iOS
            headerShown: false,
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
