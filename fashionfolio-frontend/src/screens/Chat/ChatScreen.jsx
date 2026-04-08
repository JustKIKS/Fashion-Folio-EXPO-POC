import React, { useState, useRef } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Image,
} from "react-native";

export default function ChatScreen() {
  const [maQuestion, setMaQuestion] = useState("");
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const flatListRef = useRef();

  const estAuDebut = messages.length === 0;

  const suggestions = [
    "✨ Look pour un date",
    "💼 Entretien d'embauche",
    "🏃‍♂️ Tenue de sport",
    "🕺 Soirée en boîte",
  ];

  const nouvelleConversation = () => {
    setMessages([]);
    setMaQuestion("");
  };

  const envoyerMessage = async (texteForce = null) => {
    const messageATraiter = texteForce || maQuestion;
    if (!messageATraiter.trim()) return;

    const userMsg = { id: Date.now(), role: "user", content: messageATraiter };
    setMessages((prev) => [...prev, userMsg]);
    setMaQuestion("");
    setIsTyping(true);

    try {
      const urlDuBack = "http://10.1.219.54:8000/chat/";
      const res = await fetch(urlDuBack, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: messageATraiter, user_id: 1 }),
      });

      const data = await res.json();
      const aiMsg = {
        id: Date.now() + 1,
        role: "assistant",
        content: data.message || "Je suis prêt pour ton prochain look !",
      };
      setMessages((prev) => [...prev, aiMsg]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now(),
          role: "assistant",
          content: "Erreur de connexion ❌",
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const renderItem = ({ item }) => (
    <View style={item.role === "user" ? styles.userWrapper : styles.aiWrapper}>
      {item.role === "assistant" && (
        <View style={styles.megaAvatarContainer}>
          <Image
            source={require("../../../assets/images/fashionfoliobot.png")}
            style={styles.megaAvatarImage}
          />
        </View>
      )}
      <View
        style={[
          styles.bubble,
          item.role === "user" ? styles.userBubble : styles.aiBubble,
        ]}
      >
        <Text style={item.role === "user" ? styles.userText : styles.aiText}>
          {item.content}
        </Text>
      </View>
    </View>
  );

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.mainContainer}
    >
      {estAuDebut ? (
        <View style={styles.landingContainer}>
          {/* CERCLES DÉCORATIFS EN FOND */}
          <View style={styles.bgCircleTop} />
          <View style={styles.bgCircleBottom} />

          {/* TITRE ANCRÉ EN HAUT */}
          <View style={styles.topSection}>
            <Text style={styles.heroTitle}>FashionFolio</Text>
            <Text style={styles.heroSubtitle}>Ton dressing intelligent.</Text>
          </View>

          {/* BLOC CENTRAL (BARRE + SUGGESTIONS) ABAISSÉ */}
          <View style={styles.centerContent}>
            <View style={[styles.inputContainer, styles.landingInputShadow]}>
              <TextInput
                style={styles.input}
                placeholder="Quelle tenue pour demain ?"
                placeholderTextColor="#A0A0A0"
                value={maQuestion}
                onChangeText={setMaQuestion}
                onSubmitEditing={() => envoyerMessage()}
              />
              <TouchableOpacity
                style={styles.sendButton}
                onPress={() => envoyerMessage()}
              >
                <Text style={styles.sendIcon}>→</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.suggestionsWrapper}>
              {suggestions.map((s, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.chip}
                  onPress={() => envoyerMessage(s)}
                >
                  <Text style={styles.chipText}>{s}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
      ) : (
        <View style={{ flex: 1 }}>
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={nouvelleConversation}
            >
              <Text style={styles.backButtonText}>← Nouvelle demande</Text>
            </TouchableOpacity>
          </View>

          <FlatList
            ref={flatListRef}
            data={messages}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderItem}
            contentContainerStyle={styles.chatList}
            onContentSizeChange={() => flatListRef.current.scrollToEnd()}
          />

          <View style={styles.bottomInputArea}>
            {isTyping && (
              <Text style={styles.typingIndicator}>
                Analyse de ton style...
              </Text>
            )}
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Dis-moi tout..."
                value={maQuestion}
                onChangeText={setMaQuestion}
                onSubmitEditing={() => envoyerMessage()}
              />
              <TouchableOpacity
                style={styles.sendButton}
                onPress={() => envoyerMessage()}
              >
                <Text style={styles.sendIcon}>↑</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  mainContainer: { flex: 1, backgroundColor: "#FFFFFF" },

  // --- LANDING ---
  landingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 25,
  },
  topSection: {
    position: "absolute",
    top: 100,
    alignItems: "center",
  },
  centerContent: {
    width: "100%",
    alignItems: "center",
    marginTop: 190,
  },
  bgCircleTop: {
    position: "absolute",
    top: -100,
    right: -80,
    width: 350,
    height: 350,
    borderRadius: 175,
    backgroundColor: "#4A26D0",
    opacity: 0.04,
  },
  bgCircleBottom: {
    position: "absolute",
    bottom: -50,
    left: -100,
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: "#C084FC",
    opacity: 0.04,
  },
  heroTitle: {
    fontSize: 44,
    fontWeight: "900",
    color: "#4A26D0",
    letterSpacing: -1.5,
  },
  heroSubtitle: {
    fontSize: 16,
    color: "#666",
    marginTop: 5,
    fontWeight: "500",
  },
  suggestionsWrapper: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    marginTop: 25,
    gap: 10,
  },
  chip: {
    backgroundColor: "#F2F2F7",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#E5E5EA",
  },
  chipText: { color: "#1C0256", fontSize: 13, fontWeight: "600" },

  // --- CHAT LIST ---
  chatList: { paddingHorizontal: 20, paddingBottom: 20, paddingTop: 10 },
  aiWrapper: {
    flexDirection: "row",
    alignItems: "flex-end",
    marginBottom: 30,
    maxWidth: "85%",
  },
  userWrapper: { alignItems: "flex-end", marginBottom: 25 },
  megaAvatarContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#F2F2F7",
    marginRight: 12,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E5E5EA",
    overflow: "hidden",
  },
  megaAvatarImage: {
    width: "100%",
    height: "160%",
    resizeMode: "cover",
    transform: [{ translateX: -4 }],
  },
  bubble: { padding: 18, borderRadius: 24 },
  aiBubble: { backgroundColor: "#F2F2F7", borderBottomLeftRadius: 4 },
  userBubble: { backgroundColor: "#4A26D0", borderBottomRightRadius: 4 },
  aiText: { color: "#1C0256", fontSize: 16, lineHeight: 24 },
  userText: { color: "#FFFFFF", fontSize: 16, fontWeight: "500" },
  typingIndicator: {
    paddingLeft: 70,
    color: "#4A26D0",
    fontSize: 12,
    marginBottom: 8,
    fontWeight: "600",
  },

  // --- NAVIGATION & INPUT ---
  header: {
    height: 110,
    justifyContent: "flex-end",
    paddingLeft: 20,
    paddingBottom: 15,
  },
  backButton: {
    alignSelf: "flex-start",
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: "#F2F2F7",
    borderRadius: 15,
  },
  backButtonText: { color: "#4A26D0", fontWeight: "700", fontSize: 13 },
  bottomInputArea: {
    padding: 20,
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderTopColor: "#F2F2F7",
  },
  inputContainer: {
    flexDirection: "row",
    width: "100%",
    backgroundColor: "#F2F2F7",
    borderRadius: 30,
    paddingHorizontal: 20,
    height: 60,
    alignItems: "center",
  },
  input: { flex: 1, fontSize: 16, color: "#1C0256", fontWeight: "500" },
  sendButton: {
    backgroundColor: "#4A26D0",
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
  },
  sendIcon: { color: "#FFFFFF", fontSize: 22, fontWeight: "bold" },
  landingInputShadow: {
    shadowColor: "#4A26D0",
    shadowOffset: {
      width: 0,
    },
    shadowOpacity: 0.25,
    shadowRadius: 15,
    elevation: 10,
  },
});
