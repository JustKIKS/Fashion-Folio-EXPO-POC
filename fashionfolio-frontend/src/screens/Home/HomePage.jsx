import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  StyleSheet,
  StatusBar,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import {
  Sparkles,
  Bell,
  Moon,
  RefreshCw,
  Shirt,
  TrendingUp,
  Calendar,
  ChevronRight,
} from "lucide-react-native";

// ─── Constantes de design ─────────────────────────────────────────────────────

const PRIMARY = "#7C3AED";
const PURPLE_100 = "#EDE9FE";
const PURPLE_50 = "#F5F3FF";
const CARD_BG = "#F3F4F6";
const TEXT_PRIMARY = "#111827";
const TEXT_SECONDARY = "#6B7280";
const TEXT_DARK = "#4b5563";
const BORDER = "#E5E7EB";

const OUTFIT_CARD_COLORS = [
  "#e8ddd0",
  "#d9cebe",
  "#cabdb1",
  "#c4b5a5",
  "#bfb0a0",
];

// ─── Helper ───────────────────────────────────────────────────────────────────

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return "Bonjour,";
  if (h < 18) return "Bon après-midi,";
  return "Bonsoir,";
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────

function Skeleton({ style }) {
  return <View style={[styles.skeleton, style]} />;
}

function LoadingState() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.loadingInner}>
        <Skeleton style={{ height: 56, borderRadius: 16 }} />
        <Skeleton style={{ height: 80, borderRadius: 16 }} />
        <Skeleton style={{ height: 264, borderRadius: 16 }} />
        <Skeleton style={{ height: 88, borderRadius: 16 }} />
        <Skeleton style={{ height: 104, borderRadius: 16 }} />
      </View>
    </SafeAreaView>
  );
}

// ─── Composant principal ──────────────────────────────────────────────────────

export default function HomePage() {
  const navigation = useNavigation();
  const [user, setUser] = useState(null);
  const [clothingItems, setClothingItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      // 1. Appel au backend pour récupérer l'utilisateur connecté
      // 🚨 Remplace "/users/me" par la vraie route de ton backend si elle est différente (ex: /auth/me)
      const userResponse = await fetch("http://10.1.219.54:8000/users/me", {
        method: "GET",
        headers: {
          Authorization:
            "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxIiwiZXhwIjoxNzc1NTczOTkzfQ.i6pdBckA-IkqcSPnPiv5wKafjGalJxk1MKDzkjV8fNU",
          "Content-Type": "application/json",
        },
      });

      if (userResponse.ok) {
        const currentUser = await userResponse.json();
        setUser(currentUser);
      }

      // 2. Appel au backend pour récupérer son dressing (pour mettre à jour le compteur d'articles)
      const wardrobeResponse = await fetch(
        "http://10.1.219.54:8000/wardrobe/",
        {
          method: "GET",
          headers: {
            Authorization:
              "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxIiwiZXhwIjoxNzc1NTczOTkzfQ.i6pdBckA-IkqcSPnPiv5wKafjGalJxk1MKDzkjV8fNU",
            "Content-Type": "application/json",
          },
        },
      );

      if (wardrobeResponse.ok) {
        const items = await wardrobeResponse.json();
        setClothingItems(items);
      }
    } catch (e) {
      console.error("Error loading home:", e);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingState />;

  const firstName =
    user?.username ||
    user?.full_name?.split(" ")[0] ||
    user?.email?.split("@")[0] ||
    "Mode Addict";

  const outfitCards =
    clothingItems.length > 0
      ? clothingItems.slice(0, 5)
      : [1, 2, 3, 4].map((i) => ({
          id: i,
          name: `Look ${i}`,
          image_url: undefined,
        }));

  const totalWorn = clothingItems.reduce(
    (s, it) => s + (it.times_worn ?? 0),
    0,
  );
  const stylesCount = user?.style_preferences?.length ?? 2;

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "left", "right"]}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="transparent"
        translucent
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* ── 1. Header ──────────────────────────────────────────────── */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <View style={styles.headerIcon}>
              <Text style={styles.headerEmoji}>👗</Text>
            </View>
            <View>
              <Text style={styles.greeting}>{getGreeting()}</Text>
              <Text style={styles.username}>{firstName}</Text>
            </View>
          </View>
          <View style={styles.headerRight}>
            
            <TouchableOpacity
              style={styles.iconBtn}
              onPress={() => navigation.navigate("Social")}
            >
              <Bell size={18} color={TEXT_SECONDARY} />
              <View style={styles.badge}>
                <Text style={styles.badgeText}>3</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* ── 2. AI Stylist CTA ────────────────────────────────────── */}
        <TouchableOpacity
          style={styles.ctaCard}
          onPress={() => navigation.navigate("IA Chat")}
          activeOpacity={0.85}
        >
          <View style={styles.ctaIconCircle}>
            <Sparkles size={20} color="#fff" />
          </View>
          <View style={styles.ctaText}>
            <Text style={styles.ctaTitle}>Styliste Fashion Folio</Text>
            <Text style={styles.ctaSubtitle}>
              Décrivez votre envie, recevez votre tenue parfaite
            </Text>
          </View>
          <ChevronRight size={20} color="rgba(255,255,255,0.7)" />
        </TouchableOpacity>

        {/* ── 3. Look du jour ──────────────────────────────────────── */}
        <View>
          <View style={styles.sectionRow}>
            <Text style={styles.sectionTitle}>Votre look du jour</Text>
            <TouchableOpacity
              style={styles.pill}
              onPress={() => navigation.navigate("IA Chat")}
            >
              <RefreshCw size={12} color={PRIMARY} style={{ marginRight: 4 }} />
              <Text style={styles.pillText}>Régénérer</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.sectionSub}>
            Sélectionné pour vous par FashionFolio
          </Text>

          {/* Carrousel horizontal */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.outfitScroll}
            style={styles.outfitScrollWrapper}
          >
            {outfitCards.map((item, idx) => (
              <TouchableOpacity
                key={item.id}
                style={[
                  styles.outfitCard,
                  {
                    backgroundColor:
                      OUTFIT_CARD_COLORS[idx % OUTFIT_CARD_COLORS.length],
                  },
                ]}
                onPress={() =>
                  clothingItems.length > 0
                    ? navigation.navigate("Dressing")
                    : undefined
                }
                activeOpacity={0.9}
              >
                {item.image_url ? (
                  <Image
                    source={{ uri: item.image_url }}
                    style={StyleSheet.absoluteFill}
                    resizeMode="cover"
                  />
                ) : null}
                <View style={styles.outfitLabel}>
                  <Text style={styles.outfitLabelText}>Look #{idx + 1}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Boutons d'action */}
          <View style={styles.lookButtons}>
            <TouchableOpacity style={styles.btnOutline}>
              <Text style={styles.btnOutlineText}>Historique</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.btnFilled}
              onPress={() => navigation.navigate("Dressing")}
            >
              <Text style={styles.btnFilledText}>Je le porte</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* ── 4. Stats strip ───────────────────────────────────────── */}
        <View style={styles.statsCard}>
          <View style={styles.statItem}>
            <Shirt size={18} color={PRIMARY} />
            <Text style={styles.statValue}>{clothingItems.length || 5}</Text>
            <Text style={styles.statLabel}>Articles</Text>
          </View>
          <View style={[styles.statItem, styles.statItemBordered]}>
            <Calendar size={18} color={PRIMARY} />
            <Text style={styles.statValue}>{totalWorn || 42}</Text>
            <Text style={styles.statLabel}>Portés</Text>
          </View>
          <View style={styles.statItem}>
            <TrendingUp size={18} color={PRIMARY} />
            <Text style={styles.statValue}>{stylesCount}</Text>
            <Text style={styles.statLabel}>Styles</Text>
          </View>
        </View>

        {/* ── 5. Actions rapides ───────────────────────────────────── */}
        <View>
          <Text style={[styles.sectionTitle, { marginBottom: 12 }]}>
            Actions rapides
          </Text>
          <View style={styles.actionsGrid}>
            <TouchableOpacity
              style={styles.actionCard}
              onPress={() => navigation.navigate("AddClothing")}
              activeOpacity={0.85}
            >
              <View style={styles.actionIconCircle}>
                <Shirt size={18} color={PRIMARY} />
              </View>
              <Text style={styles.actionTitle}>Ajouter</Text>
              <Text style={styles.actionSub}>Enrichissez votre dressing</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionCard} activeOpacity={0.85}>
              <View style={styles.actionIconCircle}>
                <TrendingUp size={18} color={PRIMARY} />
              </View>
              <Text style={styles.actionTitle}>Statistiques</Text>
              <Text style={styles.actionSub}>Votre garde-robe</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
  },

  // ── Loading ──
  loadingInner: {
    paddingHorizontal: 16,
    paddingTop: 16,
    gap: 16,
  },
  skeleton: {
    backgroundColor: CARD_BG,
  },

  // ── Scroll ──
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 16,
    gap: 24,
  },

  // ── Header ──
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  headerIcon: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: PRIMARY,
    justifyContent: "center",
    alignItems: "center",
  },
  headerEmoji: {
    fontSize: 22,
  },
  greeting: {
    fontSize: 12,
    color: TEXT_SECONDARY,
    marginBottom: 2,
  },
  username: {
    fontSize: 22,
    fontWeight: "700",
    color: TEXT_PRIMARY,
  },
  headerRight: {
    flexDirection: "row",
    gap: 8,
  },
  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: CARD_BG,
    justifyContent: "center",
    alignItems: "center",
  },
  badge: {
    position: "absolute",
    top: 0,
    right: 0,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: "#ef4444",
    alignItems: "center",
    justifyContent: "center",
  },
  badgeText: {
    color: "#fff",
    fontSize: 9,
    fontWeight: "700",
    lineHeight: 11,
  },

  // ── CTA Card ──
  ctaCard: {
    backgroundColor: PRIMARY,
    borderRadius: 20,
    padding: 18,
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    minHeight: 80,
  },
  ctaIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  ctaText: {
    flex: 1,
  },
  ctaTitle: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 15,
  },
  ctaSubtitle: {
    color: "rgba(255,255,255,0.8)",
    fontSize: 11,
    marginTop: 2,
    lineHeight: 16,
  },

  // ── Section ──
  sectionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: TEXT_PRIMARY,
  },
  sectionSub: {
    fontSize: 12,
    color: TEXT_SECONDARY,
    marginBottom: 14,
  },
  pill: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: PURPLE_50,
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderWidth: 1,
    borderColor: "#ddd6fe",
  },
  pillText: {
    color: PRIMARY,
    fontSize: 11,
    fontWeight: "600",
  },

  // ── Outfit carousel ──
  outfitScrollWrapper: {
    marginHorizontal: -16,
  },
  outfitScroll: {
    paddingHorizontal: 16,
    gap: 12,
    paddingBottom: 4,
  },
  outfitCard: {
    width: 160,
    height: 200,
    borderRadius: 20,
    overflow: "hidden",
    justifyContent: "flex-end",
    alignItems: "center",
    paddingBottom: 10,
  },
  outfitLabel: {
    backgroundColor: "rgba(255,255,255,0.8)",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  outfitLabelText: {
    fontSize: 11,
    fontWeight: "600",
    color: TEXT_PRIMARY,
  },

  // ── Look buttons ──
  lookButtons: {
    flexDirection: "row",
    gap: 10,
    marginTop: 14,
  },
  btnOutline: {
    flex: 1,
    height: 48,
    borderWidth: 1.5,
    borderColor: BORDER,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  btnOutlineText: {
    color: TEXT_DARK,
    fontWeight: "600",
    fontSize: 14,
  },
  btnFilled: {
    flex: 1,
    height: 48,
    borderRadius: 12,
    backgroundColor: PRIMARY,
    alignItems: "center",
    justifyContent: "center",
  },
  btnFilledText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 14,
  },

  // ── Stats strip ──
  statsCard: {
    backgroundColor: CARD_BG,
    borderRadius: 20,
    paddingVertical: 16,
    paddingHorizontal: 8,
    flexDirection: "row",
  },
  statItem: {
    flex: 1,
    alignItems: "center",
    gap: 4,
  },
  statItemBordered: {
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: BORDER,
  },
  statValue: {
    fontSize: 22,
    fontWeight: "700",
    color: PRIMARY,
    lineHeight: 26,
  },
  statLabel: {
    fontSize: 11,
    color: TEXT_SECONDARY,
  },

  // ── Quick actions ──
  actionsGrid: {
    flexDirection: "row",
    gap: 12,
  },
  actionCard: {
    flex: 1,
    backgroundColor: CARD_BG,
    borderRadius: 20,
    padding: 16,
    minHeight: 104,
  },
  actionIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: PURPLE_100,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  actionTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: TEXT_PRIMARY,
    marginBottom: 4,
  },
  actionSub: {
    fontSize: 11,
    color: TEXT_SECONDARY,
  },
});
