import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  StyleSheet,
  ActivityIndicator,
  Alert,
  SafeAreaView,
  Switch,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";
import { ArrowLeft, Trash2, Camera, Plus, X } from "lucide-react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const API_URL = process.env.EXPO_PUBLIC_API_URL;

const categories = [
  "haut",
  "bas",
  "robe",
  "veste",
  "manteau",
  "chaussures",
  "accessoire",
  "sac",
];
const seasons = ["printemps", "ete", "automne", "hiver"];
const colors = [
  "noir",
  "blanc",
  "gris",
  "beige",
  "marron",
  "bleu",
  "rouge",
  "vert",
  "jaune",
  "rose",
  "violet",
  "orange",
];

export default function ItemDetailsScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { id } = route.params; // On récupère l'ID passé lors du clic

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [item, setItem] = useState(null);

  useEffect(() => {
    loadItem();
  }, []);

  const loadItem = async () => {
    try {
      const token = await AsyncStorage.getItem("userToken");
      const response = await fetch(`${API_URL}/wardrobe/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (response.ok) {
        setItem(data);
      } else {
        Alert.alert("Erreur", "Impossible de charger l'article");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const token = await AsyncStorage.getItem("userToken");
      const response = await fetch(`${API_URL}/wardrobe/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(item),
      });

      if (response.ok) {
        Alert.alert("Succès", "Article mis à jour !");
        navigation.goBack();
      }
    } catch (error) {
      Alert.alert("Erreur", "Impossible d'enregistrer");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    Alert.alert("Supprimer", "Voulez-vous vraiment supprimer cet article ?", [
      { text: "Annuler", style: "cancel" },
      {
        text: "Supprimer",
        style: "destructive",
        onPress: async () => {
          try {
            const token = await AsyncStorage.getItem("userToken");
            await fetch(`${API_URL}/wardrobe/${id}`, {
              method: "DELETE",
              headers: { Authorization: `Bearer ${token}` },
            });
            navigation.goBack();
          } catch (error) {
            console.error(error);
          }
        },
      },
    ]);
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    });

    if (!result.canceled) {
      setItem({ ...item, photo_url: result.assets[0].uri });
    }
  };

  if (loading || !item) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#4A26D0" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.iconBtn}
          >
            <ArrowLeft color="#1C0256" size={24} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Détails</Text>
          <TouchableOpacity onPress={handleDelete} style={styles.iconBtn}>
            <Trash2 color="#FF3B30" size={24} />
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* Image Principale */}
          <TouchableOpacity style={styles.imageBox} onPress={pickImage}>
            {item.photo_url ? (
              <Image
                source={{ uri: item.photo_url }}
                style={styles.mainImage}
              />
            ) : (
              <View style={styles.imagePlaceholder}>
                <Camera color="#909090" size={40} />
              </View>
            )}
            <View style={styles.editBadge}>
              <Plus color="white" size={16} />
            </View>
          </TouchableOpacity>

          {/* Formulaire */}
          <View style={styles.form}>
            {/* 🚨 CORRECTION ICI : Le champ texte gère maintenant le Style (casual, chic, etc.) */}
            <Text style={styles.label}>
              Style du vêtement (ex: casual, chic...)
            </Text>
            <TextInput
              style={styles.input}
              value={item.style}
              onChangeText={(val) => setItem({ ...item, style: val })}
            />

            <Text style={styles.label}>Marque</Text>
            <TextInput
              style={styles.input}
              value={item.brand}
              onChangeText={(val) => setItem({ ...item, brand: val })}
            />

            {/* 🚨 CORRECTION ICI : Les Catégories gèrent maintenant le "type" */}
            <Text style={styles.label}>Catégorie</Text>
            <View style={styles.chipGroup}>
              {categories.map((cat) => (
                <TouchableOpacity
                  key={cat}
                  onPress={() => setItem({ ...item, type: cat })}
                  style={[styles.chip, item.type === cat && styles.chipActive]}
                >
                  <Text
                    style={[
                      styles.chipText,
                      item.type === cat && styles.chipTextActive,
                    ]}
                  >
                    {cat}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.label}>Saison</Text>
            <View style={styles.chipGroup}>
              {seasons.map((s) => (
                <TouchableOpacity
                  key={s}
                  onPress={() => setItem({ ...item, season: s })}
                  style={[styles.chip, item.season === s && styles.chipActive]}
                >
                  <Text
                    style={[
                      styles.chipText,
                      item.season === s && styles.chipTextActive,
                    ]}
                  >
                    {s}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.label}>Couleur</Text>
            <View style={styles.chipGroup}>
              {colors.map((c) => (
                <TouchableOpacity
                  key={c}
                  onPress={() => setItem({ ...item, color: c })}
                  style={[styles.chip, item.color === c && styles.chipActive]}
                >
                  <Text
                    style={[
                      styles.chipText,
                      item.color === c && styles.chipTextActive,
                    ]}
                  >
                    {c}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Save Button */}
            <TouchableOpacity
              style={[styles.saveButton, saving && { opacity: 0.7 }]}
              onPress={handleSave}
              disabled={saving}
            >
              {saving ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text style={styles.saveButtonText}>
                  Enregistrer les modifications
                </Text>
              )}
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "white" },
  centered: { flex: 1, justifyContent: "center", alignItems: "center" },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#F2F2F7",
  },
  headerTitle: { fontSize: 18, fontWeight: "700", color: "#1C0256" },
  iconBtn: { padding: 8 },
  scrollContent: { padding: 20 },
  imageBox: {
    width: "100%",
    aspectRatio: 1,
    backgroundColor: "#F2F2F7",
    borderRadius: 24,
    overflow: "hidden",
    marginBottom: 25,
  },
  mainImage: { width: "100%", height: "100%", resizeMode: "cover" },
  imagePlaceholder: { flex: 1, justifyContent: "center", alignItems: "center" },
  editBadge: {
    position: "absolute",
    bottom: 15,
    right: 15,
    backgroundColor: "#4A26D0",
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: "white",
  },
  form: { gap: 15 },
  label: { fontSize: 14, fontWeight: "700", color: "#1C0256", marginBottom: 5 },
  input: {
    backgroundColor: "#F2F2F7",
    padding: 15,
    borderRadius: 12,
    fontSize: 16,
    color: "#1C0256",
  },
  chipGroup: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 10,
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#F2F2F7",
  },
  chipActive: { backgroundColor: "#4A26D0" },
  chipText: { color: "#1C0256", fontSize: 12, fontWeight: "600" },
  chipTextActive: { color: "white" },
  saveButton: {
    backgroundColor: "#4A26D0",
    padding: 18,
    borderRadius: 15,
    alignItems: "center",
    marginTop: 20,
    marginBottom: 40,
  },
  saveButtonText: { color: "white", fontWeight: "bold", fontSize: 16 },
});
