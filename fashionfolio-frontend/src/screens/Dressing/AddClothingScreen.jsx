import React, { useState } from "react";
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
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";
import { Camera, ArrowLeft, Sparkles, X } from "lucide-react-native";

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
const stylesList = [
  "casual",
  "chic",
  "streetwear",
  "boheme",
  "classique",
  "sportif",
  "elegant",
  "vintage",
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

export default function AddClothingScreen() {
  const navigation = useNavigation();
  const [imageUri, setImageUri] = useState(null);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    type: "", // On utilise 'type' pour correspondre à ton backend
    category: "",
    brand: "",
    color: "",
    style: "",
    season: "",
    photo_url: null,
  });

  // Fonction pour choisir une image
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
      // Ici, tu pourrais uploader l'image vers Cloudinary ou S3
      // pour avoir une vraie photo_url. Pour l'instant on garde l'URI locale.
      setFormData({ ...formData, photo_url: result.assets[0].uri });
    }
  };

  const toggleValue = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field] === value ? "" : value,
    }));
  };

  const handleSubmit = async () => {
    if (!formData.type || !formData.category) {
      Alert.alert("Erreur", "Le nom (type) et la catégorie sont obligatoires.");
      return;
    }

    setLoading(true);
    try {
      // APPEL À TON BACKEND FASTAPI
      const response = await fetch("http://10.1.219.54:8000/clothing/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          user_id: 1, // ID temporaire
        }),
      });

      if (response.ok) {
        Alert.alert("Succès", "Vêtement ajouté !");
        navigation.navigate("Dressing"); // Retour au dressing
      } else {
        const errorData = await response.json();
        Alert.alert("Erreur", JSON.stringify(errorData.detail));
      }
    } catch (error) {
      Alert.alert("Erreur", "Impossible de contacter le serveur.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backBtn}
        >
          <ArrowLeft color="white" size={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Ajouter un article</Text>
      </View>

      <ScrollView
        style={styles.formContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Upload Box */}
        <TouchableOpacity style={styles.uploadBox} onPress={pickImage}>
          {imageUri ? (
            <Image source={{ uri: imageUri }} style={styles.previewImage} />
          ) : (
            <View style={styles.uploadPlaceholder}>
              <Camera color="#909090" size={40} />
              <Text style={styles.uploadText}>Ajouter une photo</Text>
            </View>
          )}
        </TouchableOpacity>

        {/* Form Inputs */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Nom de l'article (ex: T-shirt) *</Text>
          <TextInput
            style={styles.input}
            value={formData.type}
            onChangeText={(val) => setFormData({ ...formData, type: val })}
            placeholder="Ex: Jean Slim"
          />

          <Text style={styles.label}>Marque</Text>
          <TextInput
            style={styles.input}
            value={formData.brand}
            onChangeText={(val) => setFormData({ ...formData, brand: val })}
            placeholder="Ex: Zara, Levi's..."
          />

          {/* SÉLECTEURS CHIPS (Catégorie) */}
          <Text style={styles.label}>Catégorie *</Text>
          <View style={styles.chipGroup}>
            {categories.map((cat) => (
              <TouchableOpacity
                key={cat}
                onPress={() => toggleValue("category", cat)}
                style={[
                  styles.chip,
                  formData.category === cat && styles.chipActive,
                ]}
              >
                <Text
                  style={[
                    styles.chipText,
                    formData.category === cat && styles.chipTextActive,
                  ]}
                >
                  {cat}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* COULEURS */}
          <Text style={styles.label}>Couleur</Text>
          <View style={styles.chipGroup}>
            {colors.map((c) => (
              <TouchableOpacity
                key={c}
                onPress={() => toggleValue("color", c)}
                style={[styles.chip, formData.color === c && styles.chipActive]}
              >
                <Text
                  style={[
                    styles.chipText,
                    formData.color === c && styles.chipTextActive,
                  ]}
                >
                  {c}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* SAISONS */}
          <Text style={styles.label}>Saison</Text>
          <View style={styles.chipGroup}>
            {seasons.map((s) => (
              <TouchableOpacity
                key={s}
                onPress={() => toggleValue("season", s)}
                style={[
                  styles.chip,
                  formData.season === s && styles.chipActive,
                ]}
              >
                <Text
                  style={[
                    styles.chipText,
                    formData.season === s && styles.chipTextActive,
                  ]}
                >
                  {s}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Submit Buttons */}
        <View style={styles.footer}>
          <TouchableOpacity
            style={styles.btnCancel}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.btnCancelText}>Annuler</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.btnSubmit, loading && { opacity: 0.7 }]}
            onPress={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text style={styles.btnSubmitText}>Enregistrer</Text>
            )}
          </TouchableOpacity>
        </View>
        <View style={{ height: 50 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "white" },
  header: {
    backgroundColor: "#4A26D0",
    padding: 20,
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 40,
  },
  headerTitle: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
    marginLeft: 15,
  },
  backBtn: { width: 40, height: 40, justifyContent: "center" },
  formContainer: { flex: 1, padding: 20 },
  uploadBox: {
    width: "100%",
    height: 250,
    backgroundColor: "#F2F2F7",
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 25,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#E5E5EA",
    borderStyle: "dashed",
  },
  previewImage: { width: "100%", height: "100%", resizeMode: "cover" },
  uploadPlaceholder: { alignItems: "center" },
  uploadText: { color: "#909090", marginTop: 10, fontWeight: "600" },
  label: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#1C0256",
    marginBottom: 10,
    marginTop: 15,
  },
  input: {
    backgroundColor: "#F2F2F7",
    padding: 15,
    borderRadius: 12,
    fontSize: 16,
    color: "#1C0256",
  },
  chipGroup: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#F2F2F7",
    borderWidth: 1,
    borderColor: "#E5E5EA",
  },
  chipActive: { backgroundColor: "#4A26D0", borderColor: "#4A26D0" },
  chipText: { color: "#1C0256", fontSize: 12, fontWeight: "600" },
  chipTextActive: { color: "white" },
  footer: { flexDirection: "row", gap: 15, marginTop: 30, marginBottom: 20 },
  btnCancel: {
    flex: 1,
    padding: 16,
    borderRadius: 15,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#4A26D0",
  },
  btnCancelText: { color: "#4A26D0", fontWeight: "bold" },
  btnSubmit: {
    flex: 2,
    backgroundColor: "#4A26D0",
    padding: 16,
    borderRadius: 15,
    alignItems: "center",
  },
  btnSubmitText: { color: "white", fontWeight: "bold" },
});
