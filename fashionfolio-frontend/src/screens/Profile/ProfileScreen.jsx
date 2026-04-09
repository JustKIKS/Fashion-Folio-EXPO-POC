import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView } from 'react-native';
import { MOCK_USER } from '../../services/mock';

export default function ProfileScreen() {
  return (
    <ScrollView style={styles.container}>
      {/* Header profil */}
      <View style={styles.header}>
        <Image source={{ uri: MOCK_USER.avatar }} style={styles.avatar} />
        <Text style={styles.name}>{MOCK_USER.name}</Text>
        <Text style={styles.username}>{MOCK_USER.username}</Text>
        <Text style={styles.bio}>{MOCK_USER.bio}</Text>
      </View>

      {/* Stats */}
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{MOCK_USER.stats.pieces}</Text>
          <Text style={styles.statLabel}>Pièces</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{MOCK_USER.stats.outfits}</Text>
          <Text style={styles.statLabel}>Tenues</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{MOCK_USER.stats.friends}</Text>
          <Text style={styles.statLabel}>Amis</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    alignItems: 'center',
    paddingTop: 60,
    paddingBottom: 24,
    paddingHorizontal: 20,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 16,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1C0256',
    marginBottom: 4,
  },
  username: {
    fontSize: 14,
    color: '#909090',
    marginBottom: 8,
  },
  bio: {
    fontSize: 14,
    color: '#1C0256',
    textAlign: 'center',
    lineHeight: 20,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
    marginHorizontal: 20,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#f0f0f0',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statNumber: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#4A26D0',
  },
  statLabel: {
    fontSize: 12,
    color: '#909090',
    marginTop: 4,
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: '#f0f0f0',
  },
});
