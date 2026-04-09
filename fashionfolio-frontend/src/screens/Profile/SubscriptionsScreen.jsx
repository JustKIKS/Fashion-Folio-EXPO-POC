import React from 'react';
import {
    View, Text, StyleSheet, ScrollView,
    TouchableOpacity, Alert
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ArrowLeft, Eye, Star, Shield, Crown, Check } from 'lucide-react-native';

const PLANS = [
    {
        id: "free",
        name: "Découverte",
        price: "Gratuit",
        color: "#909090",
        icon: Eye,
        description: "Découvrez l'univers FashionFolio",
        features: [
            "5 propositions de tenues par jour",
            "Dressing jusqu'à 20 pièces",
            "Suggestions personnalisées",
            "Accès aux fonctionnalités de base",
        ]
    },
    {
        id: "student",
        name: "Étudiant",
        price: "5,99€",
        period: "/mois",
        color: "#4A26D0",
        icon: Star,
        badge: "Étudiant",
        description: "Exprimez votre style à prix étudiant",
        features: [
            "Propositions illimitées",
            "Dressing jusqu'à 40 pièces",
            "Sans publicité",
            "3 livraisons offertes/mois",
            "Tarif préférentiel étudiant",
        ]
    },
    {
        id: "silver",
        name: "Silver",
        price: "6,99€",
        period: "/mois",
        color: "#C0C0C0",
        icon: Shield,
        description: "Un dressing qui suit ton style",
        features: [
            "10 propositions de tenues par jour",
            "Dressing jusqu'à 30 pièces",
            "IA thématisation avancée",
            "Publicités limitées",
            "1 livraison offerte/mois",
        ]
    },
    {
        id: "gold",
        name: "Gold",
        price: "8,99€",
        period: "/mois",
        color: "#FFD700",
        icon: Crown,
        badge: "Populaire",
        description: "Le meilleur de FashionFolio, sans compromis",
        features: [
            "Propositions de tenues illimitées",
            "Dressing jusqu'à 40 pièces",
            "Suggestions météo et événements",
            "Sans publicité",
            "3 livraisons offertes/mois",
            "Codes de réduction partenaires",
        ]
    }
];

export default function SubscriptionsScreen() {
    const navigation = useNavigation();

    const handleSelectPlan = (planId) => {
    if (planId === 'free') {
        navigation.goBack();
        return;
    }
    Alert.alert(
        'Abonnement',
        'Le paiement sera disponible prochainement !',
        [{ text: 'OK' }]
    );
    };

    return (
        <ScrollView style={styles.container}>
        {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <ArrowLeft color="#1C0256" size={24} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Abonnements</Text>
                <View style={{ width: 24 }} />
            </View>

            <View style={styles.subtitle}>
                <Text style={styles.subtitleText}>Pensé pour sublimer ton style au quotidien</Text>
            </View>

        {/* Plans */}
        <View style={styles.plansContainer}>
            {PLANS.map((plan) => {
            const Icon = plan.icon;
            const isFree = plan.id === 'free';
            return (
                <View
                    key={plan.id}
                style={[styles.planCard, { borderColor: plan.badge ? plan.color : '#f0f0f0' }]}
                >
                {/* Badge */}
                {plan.badge && (
                    <View style={[styles.badge, { backgroundColor: plan.color }]}>
                        <Text style={styles.badgeText}>{plan.badge}</Text>
                    </View>
                )}

                {/* Icône + Titre */}
                <View style={styles.planHeader}>
                    <View style={[styles.planIconContainer, { backgroundColor: `${plan.color}20` }]}>
                        <Icon color={plan.color} size={28} />
                    </View>
                        <View style={styles.planTitleContainer}>
                            <Text style={styles.planName}>{plan.name}</Text>
                            <Text style={styles.planDescription}>{plan.description}</Text>
                        </View>
                </View>

                {/* Prix */}
                <View style={styles.priceContainer}>
                    <Text style={[styles.planPrice, { color: plan.color }]}>{plan.price}</Text>
                    {plan.period && <Text style={styles.planPeriod}>{plan.period}</Text>}
                </View>

                {/* Features */}
                <View style={styles.featuresContainer}>
                    {plan.features.map((feature, idx) => (
                        <View key={idx} style={styles.featureRow}>
                            <Check color={plan.color} size={16} />
                            <Text style={styles.featureText}>{feature}</Text>
                        </View>
                    ))}
                </View>

                {/* Bouton */}
                <TouchableOpacity
                    style={[
                    styles.planButton,
                    { backgroundColor: isFree ? '#f0f0f0' : plan.color }
                    ]}
                    onPress={() => handleSelectPlan(plan.id)}
                >
                    <Text style={[
                        styles.planButtonText,
                        { color: isFree ? '#1C0256' : '#fff' }
                        ]}>
                        {isFree ? 'Commencer gratuitement' : `Choisir ${plan.name}`}
                    </Text>
                </TouchableOpacity>
            </View>
            );
        })}
        </View>

        <Text style={styles.footer}>
            Les abonnements se renouvellent automatiquement. Vous pouvez annuler à tout moment.
        </Text>
    </ScrollView>
     );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f5f5f5' },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: 60,
        paddingBottom: 16,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#1C0256' },
    subtitle: { padding: 20, alignItems: 'center' },
    subtitleText: { fontSize: 14, color: '#909090', textAlign: 'center' },
    plansContainer: { paddingHorizontal: 16, gap: 16, paddingBottom: 16 },
    planCard: {
        backgroundColor: '#fff',
        borderRadius: 24,
        padding: 20,
        borderWidth: 2,
        position: 'relative',
        marginBottom: 8,
    },
    badge: {
        position: 'absolute',
        top: -12,
        alignSelf: 'center',
        paddingHorizontal: 16,
        paddingVertical: 4,
        borderRadius: 20,
    },
    badgeText: { color: '#fff', fontSize: 12, fontWeight: '600' },
    planHeader: { flexDirection: 'row', gap: 12, marginBottom: 16, marginTop: 8 },
    planIconContainer: {
        width: 56,
        height: 56,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
    },
    planTitleContainer: { flex: 1, justifyContent: 'center' },
    planName: { fontSize: 20, fontWeight: 'bold', color: '#1C0256', marginBottom: 4 },
    planDescription: { fontSize: 12, color: '#909090' },
    priceContainer: { flexDirection: 'row', alignItems: 'baseline', gap: 4, marginBottom: 16 },
    planPrice: { fontSize: 32, fontWeight: 'bold' },
    planPeriod: { fontSize: 16, color: '#909090' },
    featuresContainer: { gap: 10, marginBottom: 20 },
    featureRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
    featureText: { fontSize: 13, color: '#1C0256', flex: 1 },
    planButton: {
        borderRadius: 12,
        paddingVertical: 14,
        alignItems: 'center',
    },
    planButtonText: { fontSize: 15, fontWeight: '600' },
    footer: {
        fontSize: 11,
        color: '#909090',
        textAlign: 'center',
        paddingHorizontal: 20,
        paddingBottom: 32,
    },
});