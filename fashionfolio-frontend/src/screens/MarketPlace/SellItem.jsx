import React, { useEffect, useState } from "react";
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
import { ArrowLeft, Upload, X } from "lucide-react-native";
import { useContext } from "react";
import { MarketplaceContext } from "../../context/MarketplaceContext";

const API_URL = process.env.EXPO_PUBLIC_API_URL;

const conditions = [
  { value: "neuf", label: "Neuf avec étiquette" },
  { value: "comme_neuf", label: "Comme neuf" },
  { value: "tres_bon_etat", label: "Très bon état" },
  { value: "bon_etat", label: "Bon état" },
  { value: "usage_visible", label: "Usage visible" },
];

const fits = [
  { value: "ajuste", label: "Ajusté" },
  { value: "regular", label: "Regular" },
  { value: "oversize", label: "Oversize" },
  { value: "droit", label: "Droit" },
  { value: "evase", label: "Évasé" },
];

const seasons = ["printemps", "ete", "automne", "hiver"];
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
const colorsList = [
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

export default function SellItemScreen() {
  const navigation = useNavigation();
  const { addListing } = useContext(MarketplaceContext);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [userItems, setUserItems] = useState([]);

  const [formData, setFormData] = useState({
    clothing_item_id: "",
    title: "",
    description: "",
    price: "",
    original_price: "",
    condition: "",
    size: "",
    brand: "",
    colors: [],
    fit: "",
    material: "",
    season: [],
    style: [],
    images: [],
  });

  useEffect(() => {
    loadUserItems();
  }, []);

  const loadUserItems = async () => {
    try {
      const response = await fetch(`${API_URL}/wardrobe/`, {
        method: "GET",
        headers: {
          Authorization:
            "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxIiwiZXhwIjoxNzc1NTczOTkzfQ.i6pdBckA-IkqcSPnPiv5wKafjGalJxk1MKDzkjV8fNU",
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      if (Array.isArray(data)) {
        setUserItems(data);
      }
    } catch (error) {
      console.error("Erreur chargement dressing :", error);
    } finally {
      setLoading(false);
    }
  };

  const handleItemSelect = (item) => {
    setFormData((prev) => ({
      ...prev,
      clothing_item_id: item.id,
      title: item.type || item.brand || "",
      description: item.notes || "",
      price: "",
      original_price: "",
      condition: "",
      size: item.size || "",
      brand: item.brand || "",
      colors: item.color ? [item.color] : [],
      fit: item.fit || "",
      material: item.material || "",
      season: item.season ? [item.season] : [],
      style: item.style ? [item.style] : [],
      images: item.photo_url ? [item.photo_url] : [],
    }));
  };

  const handleImageUpload = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    });

    if (!result.canceled) {
      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, result.assets[0].uri],
      }));
    }
  };

  const removeImage = (index) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const toggleArrayValue = (field, value) => {
    setFormData((prev) => {
      const currentArray = prev[field] || [];
      if (currentArray.includes(value)) {
        return { ...prev, [field]: currentArray.filter((v) => v !== value) };
      } else {
        return { ...prev, [field]: [...currentArray, value] };
      }
    });
  };

  const handleSubmit = () => {
    if (!formData.title || !formData.price || !formData.condition) {
      Alert.alert("Erreur", "Veuillez remplir les champs obligatoires");
      return;
    }

    setSubmitting(true);

    setTimeout(() => {
      const newListing = {
        id: Date.now().toString(),
        title: formData.title,
        description: formData.description,
        price: formData.price,
        original_price: formData.original_price,
        condition: formData.condition,
        size: formData.size,
        images:
          formData.images.length > 0
            ? formData.images
            : ["https://via.placeholder.com/300x400.png?text=Pas+de+photo"],
        item: { brand: formData.brand, category: "all" },
      };

      addListing(newListing);

      setSubmitting(false);
      Alert.alert("Succès 🎉", "L'article a été mis en vente !");
      navigation.goBack();
    }, 1000);
  };

  if (loading) {
    return (
      <View
        style={[
          styles.container,
          { justifyContent: "center", alignItems: "center" },
        ]}
      >
        <ActivityIndicator size="large" color="#4A26D0" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <ArrowLeft color="#FFFFFF" size={24} />
        </TouchableOpacity>
        <View style={styles.headerTextContainer}>
          <Text style={styles.headerTitle}>Vendre un article</Text>
          <Text style={styles.headerSubtitle}>Sans commission</Text>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Choisir un vêtement du dressing */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Sélectionner un article du dressing *
          </Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.horizontalScroll}
          >
            {userItems.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={[
                  styles.itemCard,
                  formData.clothing_item_id === item.id &&
                    styles.itemCardActive,
                ]}
                onPress={() => handleItemSelect(item)}
              >
                {item.photo_url ? (
                  <Image
                    source={{ uri: item.photo_url }}
                    style={styles.itemCardImage}
                  />
                ) : (
                  <View style={styles.itemCardPlaceholder} />
                )}
                <Text style={styles.itemCardText} numberOfLines={1}>
                  {item.type || "Vêtement"}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Photos */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Photos de l'article *</Text>
          <View style={styles.imageGrid}>
            {formData.images.map((img, idx) => (
              <View key={idx} style={styles.imageBox}>
                <Image source={{ uri: img }} style={styles.uploadedImage} />
                <TouchableOpacity
                  style={styles.deleteImageBtn}
                  onPress={() => removeImage(idx)}
                >
                  <X color="#FFFFFF" size={14} />
                </TouchableOpacity>
              </View>
            ))}
            {formData.images.length < 6 && (
              <TouchableOpacity
                style={styles.uploadBtn}
                onPress={handleImageUpload}
              >
                <Upload color="#909090" size={30} />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Infos de base */}
        <View style={styles.section}>
          <Text style={styles.label}>Titre de l'annonce *</Text>
          <TextInput
            style={styles.input}
            value={formData.title}
            onChangeText={(val) => setFormData({ ...formData, title: val })}
            placeholder="Ex: Chemise H&M beige"
          />

          <Text style={styles.label}>Description</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={formData.description}
            onChangeText={(val) =>
              setFormData({ ...formData, description: val })
            }
            placeholder="Décrivez l'article..."
            multiline
            numberOfLines={4}
          />

          <View style={styles.row}>
            <View style={styles.flex1}>
              <Text style={styles.label}>Prix de vente (€) *</Text>
              <TextInput
                style={styles.input}
                value={formData.price}
                onChangeText={(val) => setFormData({ ...formData, price: val })}
                placeholder="0"
                keyboardType="numeric"
              />
            </View>
            <View style={{ width: 15 }} />
            <View style={styles.flex1}>
              <Text style={styles.label}>Prix d'origine (€)</Text>
              <TextInput
                style={styles.input}
                value={formData.original_price}
                onChangeText={(val) =>
                  setFormData({ ...formData, original_price: val })
                }
                placeholder="0"
                keyboardType="numeric"
              />
            </View>
          </View>
        </View>

        {/* Caractéristiques */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Caractéristiques détaillées</Text>

          <Text style={styles.label}>État *</Text>
          <View style={styles.chipGroup}>
            {conditions.map((c) => (
              <TouchableOpacity
                key={c.value}
                onPress={() => setFormData({ ...formData, condition: c.value })}
                style={[
                  styles.chip,
                  formData.condition === c.value && styles.chipActive,
                ]}
              >
                <Text
                  style={[
                    styles.chipText,
                    formData.condition === c.value && styles.chipTextActive,
                  ]}
                >
                  {c.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.row}>
            <View style={styles.flex1}>
              <Text style={styles.label}>Taille</Text>
              <TextInput
                style={styles.input}
                value={formData.size}
                onChangeText={(val) => setFormData({ ...formData, size: val })}
                placeholder="Ex: M, 38"
              />
            </View>
            <View style={{ width: 15 }} />
            <View style={styles.flex1}>
              <Text style={styles.label}>Marque</Text>
              <TextInput
                style={styles.input}
                value={formData.brand}
                onChangeText={(val) => setFormData({ ...formData, brand: val })}
                placeholder="Ex: Zara"
              />
            </View>
          </View>

          <Text style={styles.label}>Coupe / Forme</Text>
          <View style={styles.chipGroup}>
            {fits.map((f) => (
              <TouchableOpacity
                key={f.value}
                onPress={() => setFormData({ ...formData, fit: f.value })}
                style={[
                  styles.chip,
                  formData.fit === f.value && styles.chipActive,
                ]}
              >
                <Text
                  style={[
                    styles.chipText,
                    formData.fit === f.value && styles.chipTextActive,
                  ]}
                >
                  {f.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.label}>Couleurs</Text>
          <View style={styles.chipGroup}>
            {colorsList.map((c) => (
              <TouchableOpacity
                key={c}
                onPress={() => toggleArrayValue("colors", c)}
                style={[
                  styles.chip,
                  formData.colors?.includes(c) && styles.chipActive,
                ]}
              >
                <Text
                  style={[
                    styles.chipText,
                    formData.colors?.includes(c) && styles.chipTextActive,
                  ]}
                >
                  {c}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Boutons Finaux */}
        <View style={styles.footer}>
          <TouchableOpacity
            style={styles.btnCancel}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.btnCancelText}>Annuler</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.btnSubmit, submitting && { opacity: 0.7 }]}
            onPress={handleSubmit}
            disabled={submitting}
          >
            {submitting ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text style={styles.btnSubmitText}>Publier l'annonce</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F9FAFB" },
  scrollContent: { padding: 20, paddingBottom: 50 },

  // Header
  header: {
    backgroundColor: "#4A26D0",
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
    paddingTop: 40,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  headerTextContainer: { flex: 1 },
  headerTitle: { color: "#FFFFFF", fontSize: 20, fontWeight: "bold" },
  headerSubtitle: { color: "rgba(255,255,255,0.8)", fontSize: 13 },

  // Sections
  section: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 15,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1C0256",
    marginBottom: 15,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1C0256",
    marginBottom: 8,
    marginTop: 10,
  },

  row: { flexDirection: "row" },
  flex1: { flex: 1 },

  // Horizontal Scroll Items
  horizontalScroll: { flexDirection: "row" },
  itemCard: { width: 80, marginRight: 15, alignItems: "center", opacity: 0.6 },
  itemCardActive: { opacity: 1 },
  itemCardImage: { width: 70, height: 70, borderRadius: 10, marginBottom: 5 },
  itemCardPlaceholder: {
    width: 70,
    height: 70,
    borderRadius: 10,
    backgroundColor: "#F2F2F7",
    marginBottom: 5,
  },
  itemCardText: { fontSize: 11, color: "#1C0256", fontWeight: "500" },

  // Images Grid
  imageGrid: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  imageBox: {
    width: "30%",
    aspectRatio: 1,
    borderRadius: 12,
    overflow: "hidden",
    position: "relative",
  },
  uploadedImage: { width: "100%", height: "100%", resizeMode: "cover" },
  deleteImageBtn: {
    position: "absolute",
    top: 5,
    right: 5,
    backgroundColor: "#DC2626",
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  uploadBtn: {
    width: "30%",
    aspectRatio: 1,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#E5E5EA",
    borderStyle: "dashed",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FAFAFA",
  },

  // Inputs
  input: {
    backgroundColor: "#F2F2F7",
    borderRadius: 12,
    padding: 15,
    fontSize: 15,
    color: "#1C0256",
  },
  textArea: { minHeight: 100, textAlignVertical: "top" },

  // Chips
  chipGroup: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 5,
  },
  chip: {
    backgroundColor: "#F2F2F7",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
  },
  chipActive: { backgroundColor: "#4A26D0" },
  chipText: { color: "#1C0256", fontSize: 13, fontWeight: "500" },
  chipTextActive: { color: "#FFFFFF" },

  // Buttons
  footer: { flexDirection: "row", gap: 15, marginTop: 10 },
  btnCancel: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#4A26D0",
    alignItems: "center",
  },
  btnCancelText: { color: "#4A26D0", fontWeight: "bold", fontSize: 15 },
  btnSubmit: {
    flex: 2,
    paddingVertical: 16,
    borderRadius: 14,
    backgroundColor: "#4A26D0",
    alignItems: "center",
  },
  btnSubmitText: { color: "#FFFFFF", fontWeight: "bold", fontSize: 15 },
});
