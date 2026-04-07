import { useNavigation } from '@react-navigation/native';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, TextInput, FlatList } from 'react-native';
import { Heart, MessageCircle, Send, Search, X, MoreVertical } from 'lucide-react-native';
import React, { useState } from 'react';

const MOCK_POSTS = [
  {
    id: "1",
    username: "sophie_m",
    avatar: "https://picsum.photos/seed/user1/150",
    image_url: "https://picsum.photos/seed/outfit1/400/500",
    caption: "Look du jour ✨",
    likes_count: 42,
    comments_count: 5,
    tags: ["casual", "summer"]
  },

  {
    id: "2",
    username: "luka_broubrou",
    avatar: "https://picsum.photos/seed/user2/150",
    image_url: "https://picsum.photos/seed/outfit2/400/500",
    caption: "Ma tenue pour la soirée 🔥",
    likes_count: 30,
    comments_count: 2,
    tags: ["elegant", "spring"]
  },

  {
    id: "3",
    username: "max_gogo",
    avatar: "https://picsum.photos/seed/user3/150",
    image_url: "https://picsum.photos/seed/outfit3/400/500",
    caption: "Nouvelle pièce dans mon dressing 👗",
    likes_count: 50,
    comments_count: 15,
    tags: ["elegant", "spring"]
  }

];

export default function FeedScreen() {
  const navigation = useNavigation();
  const [likedPosts, setLikedPosts] = useState(new Set());
  const [showSearchPanel, setShowSearchPanel] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <View>
      
    </View>
  );
}