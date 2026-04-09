import React, { useState, useEffect } from "react"; // 🚨 Ajout de useEffect
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import {
  Settings,
  Crown,
  Heart,
  TrendingUp,
  Edit2,
  LogOut,
  Shirt,
  Calendar,
} from "lucide-react-native";
import { MOCK_USER } from "../../services/mock";
import { Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

// 🚨 RÉCUPÉRATION DE L'URL DEPUIS LE .ENV
const API_URL = process.env.EXPO_PUBLIC_API_URL;

export default function ProfileScreen() {
  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState("tenues");
  const [user, setUser] = useState(null); // 🚨 État pour l'utilisateur réel
  const [loading, setLoading] = useState(true);

  // 🚨 CHARGEMENT DES DONNÉES AU MONTAGE
  useEffect(() => {
    loadUserProfile();
  }, []);

  const loadUserProfile = async () => {
    try {
      const token = await AsyncStorage.getItem("userToken"); // 👈 On utilise userToken

      if (!token) {
        setLoading(false);
        return;
      }

      const response = await fetch(`${API_URL}/auth/me`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
      }
    } catch (error) {
      console.error("Erreur profil:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#4A26D0" />
      </View>
    );
  }

  // Fallbacks : On utilise le backend, et si vide, on garde une valeur par défaut
  const displayName = user?.username || "Utilisateur";
  const displayEmail = user?.email || "";
  const isPremium = MOCK_USER.isPremium; // Gardé du mock pour le design

  return (
    <ScrollView style={styles.container}>
      {/* Bannière header */}
      <View
        style={[
          styles.banner,
          { backgroundColor: isPremium ? "#FFD700" : "#4A26D0" },
        ]}
      >
        <View style={styles.bannerHeader}>
          <Text style={styles.bannerTitle}>Mon profil</Text>
          <TouchableOpacity onPress={() => navigation.navigate("Settings")}>
            <Settings color="#fff" size={24} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Profile Card */}
      <View style={styles.profileCard}>
        {/* Avatar */}
        <View style={styles.avatarContainer}>
          {/* On garde l'avatar du mock car ton backend ne gère pas encore les photos de profil */}
          <Image source={{ uri: MOCK_USER.avatar }} style={styles.avatar} />
          {isPremium && (
            <Crown color="#FFD700" size={20} style={styles.crownIcon} />
          )}
        </View>

        {/* 🚨 DONNÉES LIÉES AU BACKEND */}
        <Text style={styles.name}>{displayName}</Text>
        <Text style={styles.username}>{displayEmail}</Text>
        <Text style={styles.bio}>{MOCK_USER.bio}</Text>

        {/* Abonnés / Abonnements (Mockés car absent du backend) */}
        <View style={styles.followContainer}>
          <TouchableOpacity style={styles.followItem}>
            <Text style={styles.followCount}>{MOCK_USER.stats.followers}</Text>
            <Text style={styles.followLabel}>Abonnés</Text>
          </TouchableOpacity>
          <View style={styles.followDivider} />
          <TouchableOpacity style={styles.followItem}>
            <Text style={styles.followCount}>{MOCK_USER.stats.following}</Text>
            <Text style={styles.followLabel}>Abonnements</Text>
          </TouchableOpacity>
        </View>

        {/* Bouton modifier */}
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => navigation.navigate("EditProfile")}
        >
          <Edit2 color="#fff" size={16} />
          <Text style={styles.editButtonText}>Modifier mon profil</Text>
        </TouchableOpacity>

        {/* Stats Cards */}
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{MOCK_USER.stats.pieces}</Text>
            <Text style={styles.statLabel}>Pièces</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{MOCK_USER.stats.outfits}</Text>
            <Text style={styles.statLabel}>Tenues</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{MOCK_USER.stats.worn}</Text>
            <Text style={styles.statLabel}>Portés</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{MOCK_USER.stats.likes}</Text>
            <Text style={styles.statLabel}>Likes</Text>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.actionsGrid}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => navigation.navigate("Stats")}
          >
            <TrendingUp color="#4A26D0" size={20} />
            <Text style={styles.actionLabel}>Stats</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => navigation.navigate("Dressing")}
          >
            <Shirt color="#4A26D0" size={20} />
            <Text style={styles.actionLabel}>Dressing</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionButton, styles.premiumButton]}
            onPress={() => navigation.navigate("Subscriptions")}
          >
            <Crown color="#FFD700" size={20} />
            <Text style={[styles.actionLabel, { color: "#1C0256" }]}>
              Premium
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Bannière Premium */}
      {!isPremium && (
        <View style={styles.premiumBanner}>
          <View style={styles.premiumBannerContent}>
            <Crown color="#fff" size={24} />
            <View style={styles.premiumBannerText}>
              <Text style={styles.premiumBannerTitle}>Passez Premium</Text>
              <Text style={styles.premiumBannerSubtitle}>
                Tenues illimitées, IA avancée et bien plus
              </Text>
            </View>
          </View>
          <TouchableOpacity
            style={styles.premiumBannerButton}
            onPress={() => navigation.navigate("Subscriptions")}
          >
            <Text style={styles.premiumBannerButtonText}>
              Découvrir les offres
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Tabs */}
      <View style={styles.tabsContainer}>
        <View style={styles.tabsHeader}>
          {[
            { id: "tenues", label: "Tenues", icon: Calendar },
            { id: "pieces", label: "Pièces", icon: Shirt },
            { id: "favoris", label: "Favoris", icon: Heart },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <TouchableOpacity
                key={tab.id}
                style={[styles.tab, activeTab === tab.id && styles.tabActive]}
                onPress={() => setActiveTab(tab.id)}
              >
                <Icon
                  color={activeTab === tab.id ? "#4A26D0" : "#909090"}
                  size={18}
                />
                <Text
                  style={[
                    styles.tabLabel,
                    activeTab === tab.id && styles.tabLabelActive,
                  ]}
                >
                  {tab.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={styles.tabContent}>
          {activeTab === "tenues" && (
            <Text style={styles.emptyText}>Aucune tenue pour le moment</Text>
          )}
          {activeTab === "pieces" && (
            <Text style={styles.emptyText}>
              {MOCK_USER.stats.pieces} pièces dans votre dressing
            </Text>
          )}
          {activeTab === "favoris" && (
            <Text style={styles.emptyText}>Aucun favori pour le moment</Text>
          )}
        </View>
      </View>

      {/* Déconnexion */}
      <View style={styles.logoutContainer}>
        <TouchableOpacity
          style={styles.logoutButton}
          onPress={() => {
            Alert.alert(
              "Déconnexion",
              "Êtes-vous sûr de vouloir vous déconnecter ?",
              [
                { text: "Annuler", style: "cancel" },
                {
                  text: "Se déconnecter",
                  style: "destructive",
                  onPress: async () => {
                    // 🚨 CORRECTION : On vide userToken
                    await AsyncStorage.removeItem("userToken");
                    navigation.reset({
                      index: 0,
                      routes: [{ name: "Login" }],
                    });
                  },
                },
              ],
            );
          }}
        >
          <LogOut color="#FF3B30" size={20} />
          <Text style={styles.logoutText}>Se déconnecter</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f5f5" },
  banner: {
    height: 145,
    paddingHorizontal: 20,
    paddingTop: 60,
  },
  bannerHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  bannerTitle: { fontSize: 20, fontWeight: "bold", color: "#fff" },
  profileCard: {
    backgroundColor: "#fff",
    marginHorizontal: 16,
    marginTop: -35,
    borderRadius: 24,
    padding: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  avatarContainer: { position: "relative", marginBottom: 12 },
  avatar: { width: 90, height: 90, borderRadius: 45 },
  crownIcon: { position: "absolute", bottom: 0, right: 0 },
  name: { fontSize: 22, fontWeight: "bold", color: "#1C0256", marginBottom: 4 },
  username: { fontSize: 13, color: "#909090", marginBottom: 6 },
  bio: {
    fontSize: 13,
    color: "#1C0256",
    textAlign: "center",
    marginBottom: 16,
    lineHeight: 18,
  },
  followContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  followItem: { alignItems: "center", paddingHorizontal: 24 },
  followCount: { fontSize: 20, fontWeight: "bold", color: "#1C0256" },
  followLabel: { fontSize: 12, color: "#909090" },
  followDivider: { width: 1, height: 32, backgroundColor: "#f0f0f0" },
  editButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#4A26D0",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    gap: 8,
    width: "100%",
    justifyContent: "center",
    marginBottom: 20,
  },
  editButtonText: { color: "#fff", fontWeight: "600", fontSize: 14 },
  statsGrid: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 16,
    width: "100%",
  },
  statCard: {
    flex: 1,
    backgroundColor: "#F3F0FF",
    borderRadius: 12,
    padding: 10,
    alignItems: "center",
  },
  statNumber: { fontSize: 18, fontWeight: "bold", color: "#4A26D0" },
  statLabel: { fontSize: 10, color: "#909090", marginTop: 2 },
  actionsGrid: {
    flexDirection: "row",
    gap: 8,
    width: "100%",
  },
  actionButton: {
    flex: 1,
    backgroundColor: "#F3F0FF",
    borderRadius: 12,
    padding: 10,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#4A26D0",
    gap: 4,
  },
  premiumButton: {
    borderColor: "#FFD700",
    backgroundColor: "#FFFBEB",
  },
  actionLabel: { fontSize: 10, fontWeight: "600", color: "#1C0256" },
  premiumBanner: {
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 24,
    padding: 20,
    backgroundColor: "#4A26D0",
  },
  premiumBannerContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 16,
  },
  premiumBannerText: { flex: 1 },
  premiumBannerTitle: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 18,
    marginBottom: 4,
  },
  premiumBannerSubtitle: { color: "rgba(255,255,255,0.9)", fontSize: 13 },
  premiumBannerButton: {
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: "center",
  },
  premiumBannerButtonText: {
    color: "#4A26D0",
    fontWeight: "600",
    fontSize: 14,
  },
  tabsContainer: {
    backgroundColor: "#fff",
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 16,
    overflow: "hidden",
  },
  tabsHeader: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  tab: {
    flex: 1,
    paddingVertical: 14,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    gap: 6,
    borderBottomWidth: 3,
    borderBottomColor: "transparent",
  },
  tabActive: { borderBottomColor: "#4A26D0" },
  tabLabel: { fontSize: 13, color: "#909090", fontWeight: "500" },
  tabLabelActive: { color: "#4A26D0" },
  tabContent: { padding: 20, alignItems: "center" },
  emptyText: { color: "#909090", fontSize: 14 },
  logoutContainer: {
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 32,
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 4,
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 14,
  },
  logoutText: { color: "#FF3B30", fontWeight: "600", fontSize: 14 },
});
