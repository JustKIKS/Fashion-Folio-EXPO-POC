import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Mail, Lock, Eye, EyeOff, AlertCircle } from "lucide-react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

// 🚨 CORRECTION 1 : On remet la bonne adresse IP à la place de localhost
const API_URL = process.env.EXPO_PUBLIC_API_URL || "http://10.1.219.54:8000";

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);

  const handleLogin = async () => {
    setError("");
    setIsLoading(true);
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();

      if (!response.ok) {
        setError("Email ou mot de passe incorrect");
        return;
      }

      // 🚨 CORRECTION 2 : On utilise bien "userToken" pour que la Home Page le trouve !
      await AsyncStorage.setItem("userToken", data.access_token);

      // Récupérer les infos de l'utilisateur
      const userResponse = await fetch(`${API_URL}/auth/me`, {
        headers: { Authorization: `Bearer ${data.access_token}` }
      });
      const userData = await userResponse.json();
      await AsyncStorage.setItem("userData", JSON.stringify(userData));

      navigation.reset({ index: 0, routes: [{ name: "MainTabs" }] });
    } catch {
      setError("Une erreur est survenue. Vérifiez votre connexion.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Hero */}
          <View style={styles.hero}>
            <Image
              source={require("../../../assets/icon_blanc.png")}
              style={styles.logoImage}
              resizeMode="contain"
            />
            <Image
              source={require("../../../assets/fashionfoliotext.png")}
              style={styles.logoText}
              resizeMode="contain"
            />
            <Text style={styles.heroSubtitle}>
              Votre garde-robe intelligente
            </Text>
          </View>

          {/* Card */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Bon retour !</Text>
            <Text style={styles.cardSubtitle}>
              Connectez-vous à votre compte
            </Text>

            {/* Email */}
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Adresse email</Text>
              <View
                style={[
                  styles.inputRow,
                  emailFocused && styles.inputRowFocused,
                ]}
              >
                <Mail size={16} color="#9CA3AF" />
                <TextInput
                  style={styles.textInput}
                  value={email}
                  onChangeText={setEmail}
                  placeholder="votre@email.com"
                  placeholderTextColor="#9CA3AF"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  onFocus={() => setEmailFocused(true)}
                  onBlur={() => setEmailFocused(false)}
                />
              </View>
            </View>

            {/* Password */}
            <View style={[styles.fieldGroup, { marginTop: 16 }]}>
              <Text style={styles.label}>Mot de passe</Text>
              <View
                style={[
                  styles.inputRow,
                  passwordFocused && styles.inputRowFocused,
                ]}
              >
                <Lock size={16} color="#9CA3AF" />
                <TextInput
                  style={styles.textInput}
                  value={password}
                  onChangeText={setPassword}
                  placeholder="••••••••"
                  placeholderTextColor="#9CA3AF"
                  secureTextEntry={!showPassword}
                  onFocus={() => setPasswordFocused(true)}
                  onBlur={() => setPasswordFocused(false)}
                />
                <TouchableOpacity onPress={() => setShowPassword((v) => !v)}>
                  {showPassword ? (
                    <EyeOff size={16} color="#9CA3AF" />
                  ) : (
                    <Eye size={16} color="#9CA3AF" />
                  )}
                </TouchableOpacity>
              </View>
            </View>

            {/* Forgot password */}
            <TouchableOpacity style={styles.forgotRow}>
              <Text style={styles.forgotText}>Mot de passe oublié ?</Text>
            </TouchableOpacity>

            {/* Error */}
            {!!error && (
              <View style={styles.errorBlock}>
                <AlertCircle size={14} color="#EF4444" />
                <Text style={styles.errorText}>{error}</Text>
              </View>
            )}

            {/* Submit */}
            <TouchableOpacity
              style={[styles.submitBtn, isLoading && styles.submitBtnDisabled]}
              onPress={handleLogin}
              disabled={isLoading}
              activeOpacity={0.85}
            >
              {isLoading ? (
                <>
                  <ActivityIndicator color="#FFFFFF" size="small" />
                  <Text style={[styles.submitText, styles.submitTextLoading]}>
                    Connexion...
                  </Text>
                </>
              ) : (
                <Text style={styles.submitText}>Se connecter</Text>
              )}
            </TouchableOpacity>

            {/* Divider */}
            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>ou</Text>
              <View style={styles.dividerLine} />
            </View>

            {/* Switch */}
            <TouchableOpacity
              style={styles.switchRow}
              onPress={() => navigation.navigate("Register")}
            >
              <Text style={styles.switchText}>
                Pas encore de compte ?{" "}
                <Text style={styles.switchLink}>Créer un compte</Text>
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fdfdfd",
  },
  flex: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  hero: {
    alignItems: "center",
    paddingTop: 48,
    paddingBottom: 36,
  },
  logoImage: {
    width: 90,
    height: 90,
    borderRadius: 22,
  },
  logoText: {
    width: 220,
    height: 48,
    marginTop: 12,
  },
  heroSubtitle: {
    fontSize: 14,
    color: "rgba(167, 166, 166, 0.75)",
    marginTop: 6,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 28,
    padding: 28,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 24,
    elevation: 10,
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#111111",
  },
  cardSubtitle: {
    fontSize: 13,
    color: "#9CA3AF",
    marginTop: 4,
  },
  fieldGroup: {
    marginTop: 24,
  },
  label: {
    fontSize: 11,
    fontWeight: "600",
    color: "#9CA3AF",
    textTransform: "uppercase",
    letterSpacing: 0.8,
    marginBottom: 8,
  },
  inputRow: {
    height: 52,
    backgroundColor: "#F5F3FF",
    borderRadius: 16,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    borderWidth: 1.5,
    borderColor: "transparent",
  },
  inputRowFocused: {
    borderColor: "#7C3AED",
    backgroundColor: "#FFFFFF",
  },
  textInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 14,
    color: "#111111",
  },
  forgotRow: {
    marginTop: 12,
    alignItems: "flex-end",
  },
  forgotText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#7C3AED",
  },
  errorBlock: {
    marginTop: 12,
    backgroundColor: "#FEF2F2",
    borderRadius: 12,
    padding: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  errorText: {
    fontSize: 12,
    color: "#EF4444",
    flex: 1,
  },
  submitBtn: {
    marginTop: 24,
    height: 54,
    borderRadius: 16,
    backgroundColor: "#7C3AED",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 8,
    shadowColor: "#7C3AED",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 6,
  },
  submitBtnDisabled: {
    opacity: 0.8,
  },
  submitText: {
    fontSize: 15,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  submitTextLoading: {
    opacity: 0.8,
  },
  divider: {
    marginTop: 24,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: "#E5E7EB",
  },
  dividerText: {
    fontSize: 12,
    color: "#9CA3AF",
  },
  switchRow: {
    marginTop: 20,
    marginBottom: 8,
    alignItems: "center",
  },
  switchText: {
    fontSize: 13,
    color: "#9CA3AF",
    textAlign: "center",
  },
  switchLink: {
    fontWeight: "700",
    color: "#7C3AED",
  },
});
