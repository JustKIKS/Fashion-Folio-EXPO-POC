import React, { useState } from 'react';
import {
    View, Text, StyleSheet, TouchableOpacity,
    TextInput, ScrollView, Image, KeyboardAvoidingView, Platform
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ArrowLeft, Camera } from 'lucide-react-native';
import { MOCK_USER } from '../../services/mock';

export default function EditProfileScreen() {
    const navigation = useNavigation();
    const [name, setName] = useState(MOCK_USER.name);
    const [username, setUsername] = useState(MOCK_USER.username);
    const [bio, setBio] = useState(MOCK_USER.bio);
    const [instagram, setInstagram] = useState('');
    const [tiktok, setTiktok] = useState('');
    const [website, setWebsite] = useState('');

    const handleSave = () => {
    navigation.goBack();
    };

    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        > 
        <ScrollView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <ArrowLeft color="#1C0256" size={24} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Modifier le profil</Text>
                <TouchableOpacity onPress={handleSave}>
                    <Text style={styles.saveButton}>Enregistrer</Text>
                </TouchableOpacity>
            </View>

            {/* Avatar */}
            <View style={styles.avatarSection}>
                <Image source={{ uri: MOCK_USER.avatar }} style={styles.avatar} />
                <TouchableOpacity style={styles.cameraButton}>
                    <Camera color="#fff" size={20} />
                </TouchableOpacity>
                <Text style={styles.changePhotoText}>Changer la photo</Text>
            </View>

            {/* Formulaire */}
            <View style={styles.form}>
                <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>Nom</Text>
                    <TextInput
                        style={styles.input}
                        value={name}
                        onChangeText={setName}
                        placeholder="Ton nom"
                        placeholderTextColor="#909090"
                    />
                </View>

                <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>Nom d'utilisateur</Text>
                    <TextInput
                        style={styles.input}
                        value={username}
                        onChangeText={setUsername}
                        placeholder="@username"
                        placeholderTextColor="#909090"
                    />
                </View>

                <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>Bio</Text>
                    <TextInput
                        style={[styles.input, styles.bioInput]}
                        value={bio}
                        onChangeText={setBio}
                        placeholder="Ta bio..."
                        placeholderTextColor="#909090"
                        multiline
                        numberOfLines={4}
                    />

            {/* Liens sociaux */}
            <View style={styles.socialSection}>
                <View style={styles.socialHeader}>
                    <Text style={styles.sectionTitle}>Liens sociaux</Text>
                </View>

                <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>Instagram</Text>
                    <TextInput
                        style={styles.input}
                        value={instagram}
                        onChangeText={setInstagram}
                        placeholder="@username"
                        placeholderTextColor="#909090"
                    />      
                </View>

                <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>TikTok</Text>
                    <TextInput
                        style={styles.input}
                        value={tiktok}
                        onChangeText={setTiktok}
                        placeholder="@username"
                        placeholderTextColor="#909090"
                    />
                </View>

                <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>Site web</Text>
                    <TextInput
                        style={styles.input}
                        value={website}
                        onChangeText={setWebsite}
                        placeholder="https://..."
                        placeholderTextColor="#909090"
                    />
                </View>
                </View>
                </View>
            </View>
        </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff' },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: 60,
        paddingBottom: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#1C0256' },
    saveButton: { fontSize: 16, fontWeight: '600', color: '#4A26D0' },
    avatarSection: { alignItems: 'center', paddingVertical: 24 },
    avatar: { width: 100, height: 100, borderRadius: 50, marginBottom: 8 },
    cameraButton: {
        position: 'absolute',
        top: 70,
        right: '38%',
        backgroundColor: '#4A26D0',
        width: 32,
        height: 32,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#fff',
    },
    changePhotoText: { color: '#4A26D0', fontWeight: '600', fontSize: 14 },
    form: { paddingHorizontal: 20 },
    inputGroup: { marginBottom: 20 },
    inputLabel: { fontSize: 13, fontWeight: '600', color: '#1C0256', marginBottom: 8 },
    input: {
        backgroundColor: '#f5f5f5',
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 12,
        fontSize: 14,
        color: '#1C0256',
    },
    bioInput: { height: 100, textAlignVertical: 'top' },
    socialSection: { marginTop: 20 },
    socialHeader: { marginBottom: 16 },
    sectionTitle: { fontSize: 16, fontWeight: 'bold', color: '#1C0256' },
});