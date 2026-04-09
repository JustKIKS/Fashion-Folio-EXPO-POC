import React, { useState } from 'react';
import {
    View, Text, StyleSheet, TouchableOpacity,
    TextInput, ScrollView, Alert
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ArrowLeft, Eye, EyeOff } from 'lucide-react-native';

export default function ChangePasswordScreen() {
    const navigation = useNavigation();
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showCurrent, setShowCurrent] = useState(false);
    const [showNew, setShowNew] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    const handleSave = () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
        Alert.alert('Erreur', 'Veuillez remplir tous les champs');
        return;
    }
    if (newPassword !== confirmPassword) {
        Alert.alert('Erreur', 'Les mots de passe ne correspondent pas');
        return;
    }
    if (newPassword.length < 8) {
        Alert.alert('Erreur', 'Le mot de passe doit contenir au moins 8 caractères');
        return;
    }
    Alert.alert('Succès', 'Mot de passe modifié avec succès', [
        { text: 'OK', onPress: () => navigation.goBack() }
    ]);
    };

    return (
    <ScrollView style={styles.container}>
        <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
                <ArrowLeft color="#1C0256" size={24} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Modifier le mot de passe</Text>
            <View style={{ width: 24 }} />
        </View>

        <View style={styles.form}>
            {/* Mot de passe actuel */}
            <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Mot de passe actuel</Text>
                <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    value={currentPassword}
                    onChangeText={setCurrentPassword}
                    placeholder="••••••••"
                    placeholderTextColor="#909090"
                    secureTextEntry={!showCurrent}
                />
                    <TouchableOpacity onPress={() => setShowCurrent(!showCurrent)}>
                        {showCurrent
                        ? <EyeOff color="#909090" size={20} />
                        : <Eye color="#909090" size={20} />
                        }
                    </TouchableOpacity>
                </View>
            </View>

            {/* Nouveau mot de passe */}
            <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Nouveau mot de passe</Text>
                <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    value={newPassword}
                    onChangeText={setNewPassword}
                    placeholder="••••••••"
                    placeholderTextColor="#909090"
                    secureTextEntry={!showNew}
                />
                    <TouchableOpacity onPress={() => setShowNew(!showNew)}>
                        {showNew
                        ? <EyeOff color="#909090" size={20} />
                        : <Eye color="#909090" size={20} />
                        }
                    </TouchableOpacity>
                </View>
            </View>

            {/* Confirmer le mot de passe */}
            <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Confirmer le mot de passe</Text>
                <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                placeholder="••••••••"
                placeholderTextColor="#909090"
                secureTextEntry={!showConfirm}
                />
                    <TouchableOpacity onPress={() => setShowConfirm(!showConfirm)}>
                        {showConfirm
                        ? <EyeOff color="#909090" size={20} />
                        : <Eye color="#909090" size={20} />
                        }
                    </TouchableOpacity>
                </View>
            </View>

            <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                <Text style={styles.saveButtonText}>Enregistrer</Text>
            </TouchableOpacity>
        </View>
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
    form: { padding: 16 },
    inputGroup: { marginBottom: 16 },
    inputLabel: { fontSize: 13, fontWeight: '600', color: '#1C0256', marginBottom: 8 },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderWidth: 1,
        borderColor: '#f0f0f0',
    },
    input: { flex: 1, fontSize: 14, color: '#1C0256' },
    saveButton: {
        backgroundColor: '#4A26D0',
        borderRadius: 12,
        paddingVertical: 16,
        alignItems: 'center',
        marginTop: 8,
    },
    saveButtonText: { color: '#fff', fontWeight: '600', fontSize: 16 },
});