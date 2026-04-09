import React, { useEffect, useState, useContext } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  FlatList,
  ScrollView,
  StyleSheet,
  SafeAreaView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Search, Heart, Plus, ShoppingBag } from "lucide-react-native";
import { MarketplaceContext } from "../../context/MarketplaceContext";

const categories = [
  { id: "all", label: "Tout" },
  { id: "haut", label: "Hauts" },
  { id: "bas", label: "Bas" },
  { id: "robe", label: "Robes" },
  { id: "chaussures", label: "Chaussures" },
  { id: "accessoire", label: "Accessoires" },
];

export default function MarketplaceScreen() {
  const navigation = useNavigation();
  const { listings } = useContext(MarketplaceContext);

  const [filteredListings, setFilteredListings] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  useEffect(() => {
    let filtered = [...listings];

    if (selectedCategory !== "all") {
      filtered = filtered.filter((l) => l.item?.category === selectedCategory);
    }

    if (searchQuery) {
      const search = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (l) =>
          l.title?.toLowerCase().includes(search) ||
          l.item?.brand?.toLowerCase().includes(search),
      );
    }

    setFilteredListings(filtered);
  }, [searchQuery, selectedCategory, listings]);

  const renderListingCard = ({ item: listing }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate("ListingDetails", { id: listing.id })}
    >
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: listing.images?.[0] || listing.item?.image_url }}
          style={styles.image}
        />

        {listing.condition === "neuf" && (
          <View style={styles.badgeNew}>
            <Text style={styles.badgeText}>Neuf</Text>
          </View>
        )}

        <TouchableOpacity style={styles.heartButton}>
          <Heart color="#1C0256" size={18} />
        </TouchableOpacity>
      </View>

      <View style={styles.cardContent}>
        <Text style={styles.cardTitle} numberOfLines={1}>
          {listing.title}
        </Text>

        <View style={styles.priceRow}>
          <Text style={styles.price}>{listing.price}€</Text>
          {listing.original_price && (
            <Text style={styles.originalPrice}>{listing.original_price}€</Text>
          )}
        </View>

        <Text style={styles.detailsText} numberOfLines={1}>
          {listing.size || "Taille N/A"} • {listing.condition || "État N/A"}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View>
            <Text style={styles.headerTitle}>Marketplace</Text>
            <Text style={styles.headerSubtitle}>
              {filteredListings.length} article
              {filteredListings.length > 1 ? "s" : ""} disponible
              {filteredListings.length > 1 ? "s" : ""}
            </Text>
          </View>
          <TouchableOpacity
            style={styles.plusButton}
            onPress={() => navigation.navigate("SellItem")}
          >
            <Plus color="#FFFFFF" size={24} />
          </TouchableOpacity>
        </View>

        <View style={styles.searchContainer}>
          <Search color="#909090" size={20} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Rechercher un article..."
            placeholderTextColor="#909090"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        <View style={styles.categoriesContainer}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoriesScroll}
          >
            {categories.map((cat) => (
              <TouchableOpacity
                key={cat.id}
                onPress={() => setSelectedCategory(cat.id)}
                style={[
                  styles.categoryPill,
                  selectedCategory === cat.id && styles.categoryPillActive,
                ]}
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
      </View>

      {filteredListings.length === 0 ? (
        <View style={styles.emptyContainer}>
          <View style={styles.emptyIconCircle}>
            <ShoppingBag color="#909090" size={40} />
          </View>
          <Text style={styles.emptyTitle}>Aucun article trouvé</Text>
          <Text style={styles.emptySubtitle}>
            Soyez le premier à vendre vos articles
          </Text>
          <TouchableOpacity
            style={styles.emptyButton}
            onPress={() => navigation.navigate("SellItem")}
          >
            <Text style={styles.emptyButtonText}>Vendre un article</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={filteredListings}
          renderItem={renderListingCard}
          keyExtractor={(item) => item.id.toString()}
          numColumns={2}
          contentContainerStyle={styles.gridContainer}
          columnWrapperStyle={styles.columnWrapper}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFFFFF" },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  headerTitle: { fontSize: 24, fontWeight: "600", color: "#1C0256" },
  headerSubtitle: { fontSize: 14, color: "#909090", marginTop: 2 },
  plusButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#4A26D0",
    justifyContent: "center",
    alignItems: "center",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 12,
    paddingHorizontal: 15,
    height: 50,
    marginBottom: 15,
  },
  searchIcon: { marginRight: 10 },
  searchInput: { flex: 1, fontSize: 15, color: "#1C0256" },
  categoriesContainer: { height: 40 },
  categoriesScroll: { gap: 10 },
  categoryPill: {
    paddingHorizontal: 16,
    justifyContent: "center",
    borderRadius: 20,
    backgroundColor: "#F3F4F6",
  },
  categoryPillActive: { backgroundColor: "#1C0256" },
  categoryText: { fontSize: 14, fontWeight: "500", color: "#1C0256" },
  categoryTextActive: { color: "#FFFFFF" },
  gridContainer: { padding: 20, paddingBottom: 100 },
  columnWrapper: { justifyContent: "space-between", marginBottom: 15 },
  card: {
    width: "48%",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#F3F4F6",
    overflow: "hidden",
  },
  imageContainer: {
    aspectRatio: 3 / 4,
    backgroundColor: "#F9FAFB",
    position: "relative",
  },
  image: { width: "100%", height: "100%", resizeMode: "cover" },
  badgeNew: {
    position: "absolute",
    top: 8,
    left: 8,
    backgroundColor: "#22C55E",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  badgeText: { color: "#FFFFFF", fontSize: 10, fontWeight: "bold" },
  heartButton: {
    position: "absolute",
    top: 8,
    right: 8,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(255,255,255,0.9)",
    justifyContent: "center",
    alignItems: "center",
  },
  cardContent: { padding: 12 },
  cardTitle: {
    fontSize: 14,
    fontWeight: "500",
    color: "#1C0256",
    marginBottom: 4,
  },
  priceRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 4,
  },
  price: { fontSize: 16, fontWeight: "700", color: "#4A26D0" },
  originalPrice: {
    fontSize: 12,
    color: "#909090",
    textDecorationLine: "line-through",
  },
  detailsText: { fontSize: 12, color: "#909090" },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 30,
  },
  emptyIconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#F3F4F6",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1C0256",
    marginBottom: 5,
  },
  emptySubtitle: {
    fontSize: 14,
    color: "#909090",
    textAlign: "center",
    marginBottom: 25,
  },
  emptyButton: {
    backgroundColor: "#4A26D0",
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 12,
  },
  emptyButtonText: { color: "#FFFFFF", fontSize: 14, fontWeight: "500" },
});
