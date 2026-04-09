import React, { useEffect, useState, useContext } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  StyleSheet,
  SafeAreaView,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import {
  ArrowLeft,
  Heart,
  MessageCircle,
  Tag,
  Ruler,
  Shirt,
} from "lucide-react-native";

import { MarketplaceContext } from "../../context/MarketplaceContext";

export default function ListingDetailsScreen() {
  const navigation = useNavigation();
  const route = useRoute();

  const { listings } = useContext(MarketplaceContext);

  const [loading, setLoading] = useState(true);
  const [listing, setListing] = useState(null);
  const [item, setItem] = useState(null);

  const isOwner = false;

  useEffect(() => {
    loadListingDetails();
  }, []);

  const loadListingDetails = () => {
    const listingId = route.params?.id;

    if (!listingId) {
      navigation.goBack();
      return;
    }

    setTimeout(() => {
      const foundListing = listings.find((l) => l.id === listingId);

      if (foundListing) {
        setListing(foundListing);

        setItem({
          brand: foundListing.item?.brand || "Inconnue",
          type: foundListing.item?.category || "Vêtement",
        });
      } else {
        setListing(null);
      }

      setLoading(false);
    }, 500);
  };

  const handleContact = () => {
    Alert.alert("Info", "Fonctionnalité de messagerie à venir");
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.centerAll]}>
        <ActivityIndicator size="large" color="#4A26D0" />
      </View>
    );
  }

  if (!listing) {
    return (
      <View style={[styles.container, styles.centerAll]}>
        <Text style={styles.errorText}>Annonce introuvable</Text>
        <TouchableOpacity
          style={styles.primaryButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.buttonText}>Retour au Marketplace</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const images = listing.images;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <ArrowLeft color="#1C0256" size={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Détails de l'article</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        <View style={styles.imageContainer}>
          {images && images[0] ? (
            <Image source={{ uri: images[0] }} style={styles.mainImage} />
          ) : (
            <View style={styles.noImagePlaceholder}>
              <Shirt color="#909090" size={50} />
            </View>
          )}
        </View>

        <View style={styles.contentSection}>
          <View style={styles.titlePriceRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.title}>{listing.title}</Text>
              <View style={styles.priceContainer}>
                <Text style={styles.price}>{listing.price}€</Text>
                {listing.original_price && (
                  <Text style={styles.originalPrice}>
                    {listing.original_price}€
                  </Text>
                )}
              </View>
            </View>
            <TouchableOpacity style={styles.heartButton}>
              <Heart color="#1C0256" size={24} />
            </TouchableOpacity>
          </View>

          <View style={styles.badgeContainer}>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{listing.condition}</Text>
            </View>
          </View>
        </View>

        <View style={styles.contentSection}>
          <Text style={styles.sectionTitle}>Caractéristiques</Text>

          {listing.size && (
            <FeatureRow
              icon={<Ruler size={20} color="#4A26D0" />}
              label="Taille"
              value={listing.size}
            />
          )}
          {item?.brand && (
            <FeatureRow
              icon={<Tag size={20} color="#4A26D0" />}
              label="Marque"
              value={item.brand}
            />
          )}
          {item?.type && (
            <FeatureRow
              icon={<Shirt size={20} color="#4A26D0" />}
              label="Type"
              value={item.type}
            />
          )}
        </View>

        {listing.description && (
          <View style={styles.contentSection}>
            <Text style={styles.sectionTitle}>Description</Text>
            <Text style={styles.descriptionText}>{listing.description}</Text>
          </View>
        )}

        <View style={styles.actionContainer}>
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={handleContact}
          >
            <MessageCircle
              color="white"
              size={20}
              style={{ marginRight: 10 }}
            />
            <Text style={styles.buttonText}>Contacter le vendeur</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const FeatureRow = ({ icon, label, value }) => (
  <View style={styles.featureRow}>
    <View style={styles.featureIconContainer}>{icon}</View>
    <View style={styles.featureTextContainer}>
      <Text style={styles.featureLabel}>{label}</Text>
      <Text style={styles.featureValue}>{value}</Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F9FAFB" },
  centerAll: { justifyContent: "center", alignItems: "center", padding: 20 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#F3F4F6",
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: { fontSize: 18, fontWeight: "600", color: "#1C0256" },
  imageContainer: { width: "100%", aspectRatio: 1, backgroundColor: "#FFFFFF" },
  mainImage: { width: "100%", height: "100%", resizeMode: "cover" },
  noImagePlaceholder: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F3F4F6",
  },
  contentSection: { backgroundColor: "#FFFFFF", padding: 20, marginTop: 10 },
  titlePriceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 15,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#1C0256",
    marginBottom: 5,
  },
  priceContainer: { flexDirection: "row", alignItems: "center", gap: 10 },
  price: { fontSize: 24, fontWeight: "bold", color: "#4A26D0" },
  originalPrice: {
    fontSize: 16,
    color: "#909090",
    textDecorationLine: "line-through",
  },
  heartButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#F3F4F6",
    justifyContent: "center",
    alignItems: "center",
  },
  badgeContainer: { flexDirection: "row", gap: 10 },
  badge: {
    backgroundColor: "#DCFCE7",
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  badgeText: { color: "#166534", fontWeight: "600", fontSize: 13 },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1C0256",
    marginBottom: 15,
  },
  featureRow: { flexDirection: "row", alignItems: "center", marginBottom: 15 },
  featureIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "#EDE9FE",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  featureTextContainer: { flex: 1 },
  featureLabel: { fontSize: 12, color: "#909090", marginBottom: 2 },
  featureValue: { fontSize: 15, fontWeight: "600", color: "#1C0256" },
  descriptionText: { fontSize: 15, color: "#1C0256", lineHeight: 24 },
  errorText: {
    fontSize: 18,
    color: "#1C0256",
    fontWeight: "bold",
    marginBottom: 20,
  },
  actionContainer: { padding: 20, marginTop: 10 },
  primaryButton: {
    flexDirection: "row",
    backgroundColor: "#4A26D0",
    paddingVertical: 18,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: { color: "#FFFFFF", fontSize: 16, fontWeight: "bold" },
});
