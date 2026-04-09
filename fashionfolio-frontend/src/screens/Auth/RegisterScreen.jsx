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
  Alert,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  User,
  ShieldCheck,
  AlertCircle,
  CheckCircle2,
  Check,
} from "lucide-react-native";

const API_URL = process.env.EXPO_PUBLIC_API_URL || "http://10.1.219.54:8000"; // N'oublie pas l'IP ici aussi !

function getPasswordStrength(password) {
  if (password.length === 0) return { level: 0, label: "", color: "#E5E7EB" };
  const hasNumber = /\d/.test(password);
  const hasSymbol = /[^a-zA-Z0-9]/.test(password);
  if (password.length >= 8 && hasNumber && hasSymbol)
    return { level: 4, label: "Excellent", color: "#7C3AED" };
  if (password.length >= 8) return { level: 3, label: "Bon", color: "#10B981" };
  if (password.length >= 4)
    return { level: 2, label: "Moyen", color: "#F59E0B" };
  return { level: 1, label: "Trop court", color: "#EF4444" };
}

export default function RegisterScreen({ navigation }) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  const [usernameFocused, setUsernameFocused] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [confirmFocused, setConfirmFocused] = useState(false);

  const strength = getPasswordStrength(password);
  const confirmMatch =
    confirmPassword.length > 0 && confirmPassword === password;

  const validate = () => {
    // 🚨 On nettoie les valeurs pour la validation aussi
    const cleanUsername = username.trim();
    const cleanEmail = email.trim().toLowerCase();

    const newErrors = {};
    if (!cleanUsername || cleanUsername.length < 3)
      newErrors.username = "Minimum 3 caractères";
    else if (cleanUsername.includes(" "))
      newErrors.username = "Pas d'espaces autorisés";

    if (!cleanEmail || !cleanEmail.includes("@") || !cleanEmail.includes("."))
      newErrors.email = "Adresse email invalide";

    if (!password || password.length < 8)
      newErrors.password = "Minimum 8 caractères"; // Correction coquille "8S"

    if (confirmPassword !== password)
      newErrors.confirmPassword = "Les mots de passe ne correspondent pas";

    return newErrors;
  };

  const handleRegister = async () => {
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    if (!acceptedTerms) {
      Alert.alert(
        "Conditions requises",
        "Veuillez accepter les conditions d'utilisation",
      );
      return;
    }

    // 🚨 NETTOYAGE ANTI-PIÈGE MOBILE AVANT L'ENVOI
    const cleanEmail = email.trim().toLowerCase();
    const cleanUsername = username.trim();

    setErrors({});
    setIsLoading(true);
    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // 🚨 On envoie les valeurs propres à la BDD !
        body: JSON.stringify({
          username: cleanUsername,
          email: cleanEmail,
          password,
        }),
      });
      if (response.status === 400 || response.status === 409) {
        setErrors({ email: "Cet email est déjà utilisé" });
        return;
      }
      if (!response.ok) {
        setErrors({ general: "Une erreur est survenue. Réessayez." });
        return;
      }
      navigation.navigate("Login");
    } catch {
      setErrors({
        general: "Une erreur est survenue. Vérifiez votre connexion.",
      });
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
            <Text style={styles.cardTitle}>Créer un compte</Text>
            <Text style={styles.cardSubtitle}>Rejoignez FashionFolio</Text>

            {/* Username */}
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Nom d'utilisateur</Text>
              <View
                style={[
                  styles.inputRow,
                  usernameFocused && styles.inputRowFocused,
                ]}
              >
                <User size={16} color="#9CA3AF" />
                <TextInput
                  style={styles.textInput}
                  value={username}
                  onChangeText={setUsername}
                  placeholder="@votre_pseudo"
                  placeholderTextColor="#9CA3AF"
                  autoCapitalize="none"
                  onFocus={() => setUsernameFocused(true)}
                  onBlur={() => setUsernameFocused(false)}
                />
              </View>
              {!!errors.username && (
                <Text style={styles.fieldError}>{errors.username}</Text>
              )}
            </View>

            {/* Email */}
            <View style={[styles.fieldGroup, { marginTop: 14 }]}>
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
              {!!errors.email && (
                <Text style={styles.fieldError}>{errors.email}</Text>
              )}
            </View>

            {/* Password */}
            <View style={[styles.fieldGroup, { marginTop: 14 }]}>
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
              {password.length > 0 && (
                <View style={styles.strengthContainer}>
                  <View style={styles.strengthBar}>
                    {[1, 2, 3, 4].map((i) => (
                      <View
                        key={i}
                        style={[
                          styles.strengthSegment,
                          {
                            backgroundColor:
                              i <= strength.level ? strength.color : "#E5E7EB",
                          },
                        ]}
                      />
                    ))}
                  </View>
                  <Text
                    style={[styles.strengthLabel, { color: strength.color }]}
                  >
                    {strength.label}
                  </Text>
                </View>
              )}
              {!!errors.password && (
                <Text style={styles.fieldError}>{errors.password}</Text>
              )}
            </View>

            {/* Confirm password */}
            <View style={[styles.fieldGroup, { marginTop: 14 }]}>
              <Text style={styles.label}>Confirmer le mot de passe</Text>
              <View
                style={[
                  styles.inputRow,
                  confirmFocused && styles.inputRowFocused,
                ]}
              >
                <ShieldCheck size={16} color="#9CA3AF" />
                <TextInput
                  style={styles.textInput}
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  placeholder="••••••••"
                  placeholderTextColor="#9CA3AF"
                  secureTextEntry
                  onFocus={() => setConfirmFocused(true)}
                  onBlur={() => setConfirmFocused(false)}
                />
                {confirmMatch && <CheckCircle2 size={16} color="#10B981" />}
              </View>
              {!!errors.confirmPassword && (
                <Text style={styles.fieldError}>{errors.confirmPassword}</Text>
              )}
            </View>

            {/* Terms */}
            <TouchableOpacity
              style={styles.termsRow}
              onPress={() => setAcceptedTerms((v) => !v)}
              activeOpacity={0.8}
            >
              <View
                style={[
                  styles.checkbox,
                  acceptedTerms && styles.checkboxChecked,
                ]}
              >
                {acceptedTerms && <Check size={12} color="#FFFFFF" />}
              </View>
              <Text style={styles.termsText}>
                {"J'accepte les "}
                <Text style={styles.termsLink}>conditions d'utilisation</Text>
                {" et la "}
                <Text style={styles.termsLink}>
                  politique de confidentialité
                </Text>
              </Text>
            </TouchableOpacity>

            {/* General error */}
            {!!errors.general && (
              <View style={styles.errorBlock}>
                <AlertCircle size={14} color="#EF4444" />
                <Text style={styles.errorText}>{errors.general}</Text>
              </View>
            )}

            {/* Submit */}
            <TouchableOpacity
              style={[styles.submitBtn, isLoading && styles.submitBtnDisabled]}
              onPress={handleRegister}
              disabled={isLoading}
              activeOpacity={0.85}
            >
              {isLoading ? (
                <>
                  <ActivityIndicator color="#FFFFFF" size="small" />
                  <Text style={[styles.submitText, styles.submitTextLoading]}>
                    Création...
                  </Text>
                </>
              ) : (
                <Text style={styles.submitText}>Créer mon compte</Text>
              )}
            </TouchableOpacity>

            {/* Switch */}
            <TouchableOpacity
              style={styles.switchRow}
              onPress={() => navigation.navigate("Login")}
            >
              <Text style={styles.switchText}>
                {"Déjà un compte ? "}
                <Text style={styles.switchLink}>Se connecter</Text>
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
  fieldError: {
    marginTop: 4,
    fontSize: 11,
    color: "#EF4444",
  },
  strengthContainer: {
    marginTop: 8,
  },
  strengthBar: {
    flexDirection: "row",
    gap: 4,
  },
  strengthSegment: {
    flex: 1,
    height: 3,
    borderRadius: 4,
  },
  strengthLabel: {
    marginTop: 4,
    fontSize: 11,
  },
  termsRow: {
    marginTop: 16,
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: "#E5E7EB",
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  checkboxChecked: {
    backgroundColor: "#7C3AED",
    borderColor: "#7C3AED",
  },
  termsText: {
    flex: 1,
    fontSize: 12,
    color: "#9CA3AF",
    lineHeight: 18,
  },
  termsLink: {
    color: "#7C3AED",
    fontWeight: "600",
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
