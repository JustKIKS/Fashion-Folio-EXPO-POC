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
} from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { Search, Plus } from "lucide-react-native";

const categories = [
  { id: "all", label: "Tout" },
  { id: "haut", label: "Hauts" },
  { id: "bas", label: "Bas" },
  { id: "robe", label: "Robes" },
  { id: "chaussures", label: "Chaussures" },
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
      const response = await fetch("http://10.1.219.54:8000/wardrobe/", {
        method: "GET",
        headers: {
          Authorization:
            "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxIiwiZXhwIjoxNzc1NTczOTkzfQ.i6pdBckA-IkqcSPnPiv5wKafjGalJxk1MKDzkjV8fNU",
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      if (Array.isArray(data)) {
        setClothingItems(data);
      }
    } catch (error) {
      console.error("Erreur chargement :", error);
    } finally {
      setLoading(false);
    }
  };

  const filterItems = () => {
    let filtered = [...clothingItems];

    // Filtre par catégorie
    if (selectedCategory !== "all") {
      filtered = filtered.filter((item) => {
        const cat = (item.style || "").toLowerCase().trim();
        return cat === selectedCategory.toLowerCase();
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
        {/* LIGNE 1 : NOM • MARQUE */}
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
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Mon Dressing</Text>
          <Text style={styles.headerSubtitle}>
            {filteredItems.length} article{filteredItems.length > 1 ? "s" : ""}
          </Text>
        </View>
        <TouchableOpacity
          style={styles.plusButton}
          onPress={() => navigation.navigate("AddClothing")}
        >
          <Plus color="white" size={24} />
        </TouchableOpacity>
      </View>

      {/* Recherche */}
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

      {/* Filtres (ScrollView) */}
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
              onPress={() => setSelectedCategory(cat.id)} // ICI ON CHANGE L'ÉTAT
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

      {/* Grille */}
      {loading ? (
        <ActivityIndicator
          size="large"
          color="#4A26D0"
          style={{ marginTop: 50 }}
        />
      ) : (
        <FlatList
          data={filteredItems} // ON UTILISE BIEN LA LISTE FILTRÉE
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
  emptyContainer: {
    alignItems: "center",
    marginTop: 50,
    paddingHorizontal: 40,
  },
  emptyText: { color: "#909090", textAlign: "center" },
});
