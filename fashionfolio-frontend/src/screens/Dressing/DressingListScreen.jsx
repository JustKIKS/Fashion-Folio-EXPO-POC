import React, { useState, useCallback, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Image,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  SafeAreaView,
  Alert, // 🚨 Ajouté
} from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { Search, Plus, Sparkles } from "lucide-react-native"; // 🚨 Ajouté Sparkles
import * as ImagePicker from "expo-image-picker"; // 🚨 Ajouté
import AsyncStorage from "@react-native-async-storage/async-storage";

const API_URL = process.env.EXPO_PUBLIC_API_URL;

const categories = [
  { id: "all", label: "Tout" },
  { id: "haut", label: "Hauts" },
  { id: "bas", label: "Bas" },
  { id: "robe", label: "Robes" },
  { id: "veste", label: "Vestes" }, // 👈 Ajouté
  { id: "manteau", label: "Manteaux" }, // 👈 Ajouté
  { id: "chaussures", label: "Chaussures" },
  { id: "sac", label: "Sacs" }, // 👈 Ajouté
  { id: "accessoire", label: "Accessoires" },
];

export default function DressingScreen() {
  const navigation = useNavigation();
  const [clothingItems, setClothingItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  useFocusEffect(
    useCallback(() => {
      loadItems();
    }, []),
  );

  useEffect(() => {
    filterItems();
  }, [selectedCategory, searchQuery, clothingItems]);

  const loadItems = async () => {
    try {
      const token = await AsyncStorage.getItem("userToken");

      if (!token) {
        console.error("Aucun token trouvé");
        setLoading(false);
        return;
      }

      const response = await fetch(`${API_URL}/wardrobe/`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (Array.isArray(data)) {
        setClothingItems(data);
      } else {
        setClothingItems([]);
      }
    } catch (error) {
      console.error("Erreur chargement :", error);
    } finally {
      setLoading(false);
    }
  };

  // 🤖 FONCTION SCAN IA (GEMINI VISION)
  const uploadWithAI = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.7,
    });

    if (result.canceled) return;

    const localUri = result.assets[0].uri;
    const filename = localUri.split("/").pop();
    const match = /\.(\w+)$/.exec(filename);
    const type = match ? `image/${match[1]}` : `image`;

    setLoading(true);

    try {
      const token = await AsyncStorage.getItem("userToken");

      // FormData obligatoire pour envoyer un fichier
      const formData = new FormData();
      formData.append("file", { uri: localUri, name: filename, type });

      const response = await fetch(`${API_URL}/wardrobe/upload-photo`, {
        method: "POST",
        body: formData,
        headers: {
          Authorization: `Bearer ${token}`,
          // On ne met PAS de Content-Type ici, fetch le gère pour le FormData
        },
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert(
          "Analyse réussie ✨",
          `Gemini a détecté : ${data.attributes.type} ${data.attributes.color} (${data.attributes.style})`,
        );
        loadItems(); // Refresh la liste
      } else {
        Alert.alert(
          "Erreur IA",
          "L'analyse a échoué. Réessayez avec une photo plus claire.",
        );
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Erreur", "Connexion au serveur impossible.");
    } finally {
      setLoading(false);
    }
  };

  const filterItems = () => {
    let filtered = [...clothingItems];

    if (selectedCategory !== "all") {
      filtered = filtered.filter((item) => {
        const itemCategory = (item.type || "").toLowerCase().trim();
        return itemCategory === selectedCategory.toLowerCase();
      });
    }

    if (searchQuery) {
      const search = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(
        (item) =>
          (item.type && item.type.toLowerCase().includes(search)) ||
          (item.brand && item.brand.toLowerCase().includes(search)),
      );
    }

    setFilteredItems(filtered);
  };

  const renderClothingCard = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate("ItemDetails", { id: item.id })}
    >
      <View style={styles.imageContainer}>
        {item.photo_url ? (
          <Image source={{ uri: item.photo_url }} style={styles.image} />
        ) : (
          <View style={styles.placeholderImage}>
            <Text style={{ fontSize: 30 }}>👗</Text>
          </View>
        )}
      </View>

      <View style={styles.cardInfo}>
        <Text style={styles.itemName} numberOfLines={1}>
          {item.type}{" "}
          {item.brand && item.brand !== "Sans marque" ? `• ${item.brand}` : ""}
        </Text>

        <Text style={styles.itemBrand} numberOfLines={1}>
          {item.style
            ? item.style.charAt(0).toUpperCase() + item.style.slice(1)
            : ""}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header avec bouton IA */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Mon Dressing</Text>
          <Text style={styles.headerSubtitle}>
            {filteredItems.length} article{filteredItems.length > 1 ? "s" : ""}
          </Text>
        </View>

        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.aiButton} onPress={uploadWithAI}>
            <Sparkles color="white" size={20} />
            <Text style={styles.aiButtonText}>Scan IA</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.plusButton}
            onPress={() => navigation.navigate("AddClothing")}
          >
            <Plus color="white" size={24} />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Search color="#909090" size={18} />
          <TextInput
            style={styles.searchInput}
            placeholder="Rechercher une marque ou un vêtement..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      <View style={{ height: 50, marginBottom: 10 }}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 20 }}
        >
          {categories.map((cat) => (
            <TouchableOpacity
              key={cat.id}
              style={[
                styles.categoryChip,
                selectedCategory === cat.id && styles.categoryChipActive,
              ]}
              onPress={() => setSelectedCategory(cat.id)}
            >
              <Text
                style={[
                  styles.categoryText,
                  selectedCategory === cat.id && styles.categoryTextActive,
                ]}
              >
                {cat.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4A26D0" />
          <Text style={styles.loadingText}>Analyse Gemini en cours...</Text>
        </View>
      ) : (
        <FlatList
          data={filteredItems}
          renderItem={renderClothingCard}
          keyExtractor={(item) => item.id.toString()}
          numColumns={2}
          columnWrapperStyle={{
            justifyContent: "space-between",
            paddingHorizontal: 20,
          }}
          contentContainerStyle={{ paddingBottom: 100 }}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>Aucun vêtement trouvé.</Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFFFFF" },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  headerTitle: { fontSize: 28, fontWeight: "900", color: "#1C0256" },
  headerSubtitle: { fontSize: 14, color: "#909090" },
  plusButton: {
    backgroundColor: "#4A26D0",
    width: 45,
    height: 45,
    borderRadius: 22.5,
    justifyContent: "center",
    alignItems: "center",
  },
  aiButton: {
    flexDirection: "row",
    backgroundColor: "#1C0256",
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 20,
    alignItems: "center",
    gap: 6,
  },
  aiButtonText: { color: "white", fontWeight: "bold", fontSize: 12 },
  searchContainer: { paddingHorizontal: 20, marginBottom: 15 },
  searchBar: {
    flexDirection: "row",
    backgroundColor: "#F2F2F7",
    borderRadius: 15,
    alignItems: "center",
    paddingHorizontal: 15,
    height: 50,
  },
  searchInput: { flex: 1, color: "#1C0256", marginLeft: 10 },
  categoryChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#F2F2F7",
    marginRight: 8,
    height: 35,
    justifyContent: "center",
  },
  categoryChipActive: { backgroundColor: "#1C0256" },
  categoryText: { color: "#1C0256", fontWeight: "600" },
  categoryTextActive: { color: "#FFFFFF" },
  card: {
    width: "47%",
    backgroundColor: "#FFF",
    borderRadius: 20,
    marginBottom: 15,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#F2F2F7",
  },
  imageContainer: { aspectRatio: 3 / 4, backgroundColor: "#F8F8F8" },
  image: { width: "100%", height: "100%", resizeMode: "cover" },
  placeholderImage: { flex: 1, justifyContent: "center", alignItems: "center" },
  cardInfo: { padding: 10 },
  itemName: { fontSize: 14, fontWeight: "bold", color: "#1C0256" },
  itemBrand: { fontSize: 12, color: "#909090" },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 50,
  },
  loadingText: { marginTop: 15, color: "#4A26D0", fontWeight: "600" },
  emptyContainer: {
    alignItems: "center",
    marginTop: 50,
    paddingHorizontal: 40,
  },
  emptyText: { color: "#909090", textAlign: "center" },
});
