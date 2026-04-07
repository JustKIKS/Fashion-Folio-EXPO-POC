import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, TouchableOpacity, Image, StyleSheet, Dimensions } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  Shirt,
  Moon,
  Bell,
  Sparkles,
  TrendingUp,
  RefreshCw,
} from "lucide-react-native";

const SCREEN_WIDTH = Dimensions.get("window").width;
const IMAGE_SIZE = (SCREEN_WIDTH - 32 - 8) / 2; // padding 16*2 + gap 8

const PRIMARY = "#7C3AED";
const PURPLE_100 = "#EDE9FE";
const PURPLE_50 = "#F5F3FF";

const PLACEHOLDER_IMAGES = [
  "https://picsum.photos/seed/outfit1/300/300",
  "https://picsum.photos/seed/outfit2/300/300",
  "https://picsum.photos/seed/outfit3/300/300",
  "https://picsum.photos/seed/outfit4/300/300",
];

export default function HomePage() {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const timeString = now.toLocaleTimeString("fr-FR", {
    hour: "2-digit",
    minute: "2-digit",
  });

  const dateString = now.toLocaleDateString("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Scrollable content */}
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* 1. Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <View style={styles.headerIcon}>
              <Text style={styles.headerEmoji}>👗</Text>
            </View>
            <View>
              <Text style={styles.greeting}>Bon après-midi</Text>
              <Text style={styles.username}>@utilisateur</Text>
            </View>
          </View>
          <View style={styles.headerRight}>
            <TouchableOpacity style={styles.iconBtn}>
              <Moon size={18} color="#6B7280" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconBtn}>
              <Bell size={18} color="#6B7280" />
              <View style={styles.badge}>
                <Text style={styles.badgeText}>3</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* 2. Time block */}
        <View style={styles.timeBlock}>
          <Text style={styles.time}>{timeString}</Text>
          <Text style={styles.date}>{dateString}</Text>
        </View>

        {/* 3. AI Stylist CTA */}
        <TouchableOpacity style={styles.ctaCard} activeOpacity={0.85}>
          <View style={styles.ctaIconCircle}>
            <Sparkles size={20} color="#fff" />
          </View>
          <View style={styles.ctaText}>
            <Text style={styles.ctaTitle}>Styliste Fashion Folio</Text>
            <Text style={styles.ctaSubtitle}>
              Décrivez votre envie, recevez votre tenue parfaite
            </Text>
          </View>
        </TouchableOpacity>

        {/* 4. Look du jour */}
        <View style={styles.section}>
          <View style={styles.sectionRow}>
            <Text style={styles.sectionTitle}>Votre look du jour</Text>
            <TouchableOpacity style={styles.pill}>
              <RefreshCw size={12} color={PRIMARY} style={{ marginRight: 4 }} />
              <Text style={styles.pillText}>Régénérer</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.sectionSub}>Sélectionné pour vous par l'IA</Text>
          <View style={styles.imageGrid}>
            {PLACEHOLDER_IMAGES.map((uri, i) => (
              <Image
                key={i}
                source={{ uri }}
                style={styles.gridImage}
              />
            ))}
          </View>
          <View style={styles.lookButtons}>
            <TouchableOpacity style={styles.btnOutline}>
              <Text style={styles.btnOutlineText}>Historique</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.btnFilled}>
              <Text style={styles.btnFilledText}>Je le porte</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* 6. Actions rapides */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Actions rapides</Text>
          <View style={styles.actionsGrid}>
            <TouchableOpacity style={styles.actionCard}>
              <View style={styles.actionIconCircle}>
                <Shirt size={18} color={PRIMARY} />
              </View>
              <Text style={styles.actionTitle}>Ajouter un article</Text>
              <Text style={styles.actionSub}>Enrichissez votre dressing</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionCard}>
              <View style={styles.actionIconCircle}>
                <TrendingUp size={18} color={PRIMARY} />
              </View>
              <Text style={styles.actionTitle}>Mes statistiques</Text>
              <Text style={styles.actionSub}>Analysez votre garde-robe</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

    </SafeAreaView>
  );
}


const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 90,
  },

  // Header
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  headerIcon: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: PURPLE_100,
    justifyContent: "center",
    alignItems: "center",
  },
  headerEmoji: {
    fontSize: 20,
  },
  greeting: {
    fontSize: 15,
    fontWeight: "700",
    color: "#111827",
  },
  username: {
    fontSize: 12,
    color: "#6B7280",
    marginTop: 1,
  },
  headerRight: {
    flexDirection: "row",
    gap: 8,
  },
  iconBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#F3F4F6",
    justifyContent: "center",
    alignItems: "center",
  },
  badge: {
    position: "absolute",
    top: -4,
    right: -4,
    backgroundColor: "#928ab1",
    borderRadius: 8,
    minWidth: 16,
    height: 16,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 3,
  },
  badgeText: {
    color: "#fff",
    fontSize: 9,
    fontWeight: "700",
  },

  // Time block
  timeBlock: {
    marginBottom: 20,
  },
  time: {
    fontSize: 48,
    fontWeight: "800",
    color: "#111827",
    lineHeight: 54,
  },
  date: {
    fontSize: 13,
    color: "#6B7280",
    marginTop: 2,
    textTransform: "capitalize",
  },

  // CTA card
  ctaCard: {
    backgroundColor: PRIMARY,
    borderRadius: 16,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    marginBottom: 24,
  },
  ctaIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
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
    fontSize: 12,
    marginTop: 2,
  },

  // Sections
  section: {
    marginBottom: 24,
  },
  sectionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111827",
  },
  sectionSub: {
    fontSize: 12,
    color: "#6B7280",
    marginTop: 2,
    marginBottom: 12,
  },
  pill: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: PURPLE_50,
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  pillText: {
    color: PRIMARY,
    fontSize: 12,
    fontWeight: "600",
  },

  // Image grid
  imageGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    rowGap: 8,
  },
  gridImage: {
    width: IMAGE_SIZE,
    height: IMAGE_SIZE,
    borderRadius: 12,
    backgroundColor: "#F3F4F6",
  },

  // Look buttons
  lookButtons: {
    flexDirection: "row",
    gap: 10,
    marginTop: 12,
  },
  btnOutline: {
    flex: 1,
    borderWidth: 1.5,
    borderColor: PRIMARY,
    borderRadius: 10,
    paddingVertical: 11,
    alignItems: "center",
    backgroundColor: "#fff",
  },
  btnOutlineText: {
    color: PRIMARY,
    fontWeight: "600",
    fontSize: 14,
  },
  btnFilled: {
    flex: 1,
    backgroundColor: PRIMARY,
    borderRadius: 10,
    paddingVertical: 11,
    alignItems: "center",
  },
  btnFilledText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 14,
  },


  // Actions grid
  actionsGrid: {
    flexDirection: "row",
    gap: 12,
    marginTop: 12,
  },
  actionCard: {
    flex: 1,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 12,
    padding: 14,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  actionIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: PURPLE_100,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  actionTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 2,
  },
  actionSub: {
    fontSize: 11,
    color: "#6B7280",
  },

});
