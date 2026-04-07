import React, { useState } from "react";

import { View, TextInput, Button, Text, StyleSheet } from "react-native";

export default function ChatScreen() {
  const [maQuestion, setMaQuestion] = useState("");
  const [reponseIA, setReponseIA] = useState("La réponse s'affichera ici...");

  const appelerMonIA = async () => {
    try {
      const urlDuBack = `${EXPO_PUBLIC_API_URL / chat}`;

      const reponse = await fetch(urlDuBack, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: maQuestion }),
      });
      const data = await response.json();
      setReponseIA(data.answer);
    } catch (error) {
      setReponseIA("Erreur de connexion au serveur !");
      console.log(error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Demande un conseil Mode bg</Text>
      <TextInput
        placeholder="Quelle tenue pour aller au tasty crousty ?"
        value={maQuestion}
        onChangeText={setMaQuestion}
      />
      <Button title="demander au LLM" onPress={appelerMonIA}></Button>
      <View>
        <Text>{reponseIA}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
});
