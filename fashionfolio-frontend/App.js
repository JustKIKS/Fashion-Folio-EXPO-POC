import { View, Text, StyleSheet } from "react-native";

export default function App() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>FashionFolio 👗</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1C0256",
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    color: "#C084FC",
    fontSize: 24,
    fontWeight: "bold",
  },
});
