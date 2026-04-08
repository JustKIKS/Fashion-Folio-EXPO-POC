import React, { useState, useCallback } from 'react';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { View, Text, StyleSheet, TouchableOpacity, Image, FlatList, TextInput, Modal } from 'react-native';
import { Heart, MessageCircle, Send, Search, X } from 'lucide-react-native';
import { FAKE_CONVERSATIONS } from '../../services/mock';

const MOCK_POSTS = [
  {
    id: "1",
    username: "sophie_m",
    avatar: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?q=80&w=764",
    image_url: "https://images.unsplash.com/photo-1687825519599-8724ef446d7d?q=80&w=1974",
    caption: "Look du jour ✨",
    likes_count: 42,
    tags: ["casual", "summer"],
    created_at: "2026-04-08T10:30:00.000Z",
    comments: [
      { id: "1", username: "luka_broubrou", text: "Trop beau ce look ! 🔥" },
      { id: "2", username: "max_gogo", text: "J'adore la couleur ✨" },
      { id: "3", username: "emma_l", text: "Tu es trop stylée 😍" }
    ]
  },
  {
    id: "2",
    username: "luka_broubrou",
    avatar: "https://images.unsplash.com/photo-1522529599102-193c0d76b5b6?q=80&w=2070",
    image_url: "https://plus.unsplash.com/premium_photo-1769290472469-a8a7aa929fc9?q=80&w=1974",
    caption: "Ma tenue pour la soirée 🔥",
    likes_count: 30,
    tags: ["elegant", "spring"],
    created_at: "2026-03-08T08:15:00.000Z",
    comments: [
      { id: "1", username: "sophie_m", text: "Parfait pour une soirée 👌" },
      { id: "2", username: "max_gogo", text: "Ce manteau est incroyable !" },
      { id: "3", username: "emma_l", text: "Tu assures 🙌" }
    ]
  },
  {
    id: "3",
    username: "max_gogo",
    avatar: "https://images.unsplash.com/photo-1625181796571-7f0d4571ab12?q=80&w=702",
    image_url: "https://plus.unsplash.com/premium_photo-1688497831535-120bd47d9f9c?q=80&w=1974",
    caption: "Nouvelle pièce dans mon dressing 👗",
    likes_count: 50,
    tags: ["streetwear", "spring"],
    created_at: "2026-01-07T20:00:00.000Z",
    comments: [
      { id: "1", username: "sophie_m", text: "Belle pièce ! 😍" },
      { id: "2", username: "luka_broubrou", text: "Le streetwear c'est la vie 🤙" },
      { id: "3", username: "emma_l", text: "Trop cool ce style ✨" }
    ]
  }
];

const getTimeAgo = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInMs = now - date;
  const diffInMins = Math.floor(diffInMs / 60000);
  const diffInHours = Math.floor(diffInMs / 3600000);
  const diffInDays = Math.floor(diffInMs / 86400000);
  if (diffInMins < 60) return `${diffInMins} min`;
  if (diffInHours < 24) return `${diffInHours}h`;
  return `${diffInDays}j`;
};

export default function FeedScreen() {
  const navigation = useNavigation();
  const [likedPosts, setLikedPosts] = useState(new Set());
  const [likeCounts, setLikeCounts] = useState(
    Object.fromEntries(MOCK_POSTS.map(post => [post.id, post.likes_count]))
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [commentInput, setCommentInput] = useState("");
  const [postComments, setPostComments] = useState(
    Object.fromEntries(MOCK_POSTS.map(post => [post.id, post.comments]))
  );
  const [totalUnread, setTotalUnread] = useState(0);

  useFocusEffect(
    useCallback(() => {
      const total = FAKE_CONVERSATIONS.reduce((sum, conv) => sum + (conv.unread_count || 0), 0);
      setTotalUnread(total);
    }, [])
  );

  const handleLike = (postId) => {
    setLikedPosts(prev => {
      const newSet = new Set(prev);
      if (newSet.has(postId)) {
        newSet.delete(postId);
        setLikeCounts(counts => ({ ...counts, [postId]: counts[postId] - 1 }));
      } else {
        newSet.add(postId);
        setLikeCounts(counts => ({ ...counts, [postId]: counts[postId] + 1 }));
      }
      return newSet;
    });
  };

  const handleAddComment = (postId) => {
    if (!commentInput.trim()) return;
    const newComment = {
      id: String(Date.now()),
      username: "moi",
      text: commentInput.trim()
    };
    setPostComments(prev => ({
      ...prev,
      [postId]: [...(prev[postId] || []), newComment]
    }));
    setCommentInput("");
  };

  const filteredPosts = MOCK_POSTS.filter(post =>
    post.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
    post.caption.toLowerCase().includes(searchQuery.toLowerCase()) ||
    post.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Social Place</Text>
        <View style={styles.headerIcons}>
          <TouchableOpacity onPress={() => setShowSearch(!showSearch)}>
            <Search color="#1C0256" size={24} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('DMList')}>
            <View>
              <MessageCircle color="#1C0256" size={24} />
              {totalUnread > 0 && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{totalUnread}</Text>
                </View>
              )}
            </View>
          </TouchableOpacity>
        </View>
      </View>

      {/* Barre de recherche */}
      {showSearch && (
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Rechercher un post, utilisateur..."
            placeholderTextColor="#909090"
            autoFocus
          />
        </View>
      )}

      {/* Feed */}
      <FlatList
        data={filteredPosts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.postCard}>
            <View style={styles.postHeader}>
              <Image source={{ uri: item.avatar }} style={styles.avatar} />
              <View style={styles.postHeaderText}>
                <Text style={styles.username}>{item.username}</Text>
                <Text style={styles.timeAgo}>{getTimeAgo(item.created_at)}</Text>
              </View>
            </View>

            <Image source={{ uri: item.image_url }} style={styles.postImage} />

            <View style={styles.postActions}>
              <TouchableOpacity onPress={() => handleLike(item.id)}>
                <Heart
                  color={likedPosts.has(item.id) ? '#FF3B30' : '#1C0256'}
                  fill={likedPosts.has(item.id) ? '#FF3B30' : 'none'}
                  size={24}
                />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setSelectedPost(item.id)}>
                <MessageCircle color="#1C0256" size={24} />
              </TouchableOpacity>
              <TouchableOpacity>
                <Send color="#1C0256" size={24} />
              </TouchableOpacity>
            </View>

            <Text style={styles.likes}>{likeCounts[item.id]} j'aime</Text>
            <Text style={styles.caption}>
              <Text style={styles.username}>{item.username} </Text>
              {item.caption}
            </Text>

            <View style={styles.tagsContainer}>
              {item.tags.map((tag, idx) => (
                <View key={idx} style={styles.tag}>
                  <Text style={styles.tagText}>#{tag}</Text>
                </View>
              ))}
            </View>
          </View>
        )}
      />

      {/* Modal commentaires */}
      <Modal
        visible={selectedPost !== null}
        transparent
        animationType="slide"
        onRequestClose={() => setSelectedPost(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Commentaires</Text>
              <TouchableOpacity onPress={() => setSelectedPost(null)}>
                <X color="#1C0256" size={24} />
              </TouchableOpacity>
            </View>

            <FlatList
              data={selectedPost ? postComments[selectedPost] : []}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <View style={styles.commentItem}>
                  <Text style={styles.commentUsername}>{item.username} </Text>
                  <Text style={styles.commentText}>{item.text}</Text>
                </View>
              )}
            />

            <View style={styles.commentInputContainer}>
              <TextInput
                style={styles.commentInput}
                value={commentInput}
                onChangeText={setCommentInput}
                placeholder="Ajouter un commentaire..."
                placeholderTextColor="#909090"
              />
              <TouchableOpacity onPress={() => handleAddComment(selectedPost)}>
                <Send color="#4A26D0" size={24} />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
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
  headerTitle: { fontSize: 24, fontWeight: 'bold', color: '#1C0256' },
  headerIcons: { flexDirection: 'row', gap: 12, alignItems: 'center' },
  badge: {
    position: 'absolute',
    top: -4, right: -4,
    width: 18, height: 18,
    borderRadius: 9,
    backgroundColor: '#FF3B30',
    justifyContent: 'center', alignItems: 'center',
  },
  badgeText: { color: '#fff', fontSize: 10, fontWeight: 'bold' },
  searchContainer: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  searchInput: {
    backgroundColor: '#f5f5f5',
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 14,
    color: '#1C0256',
  },
  searchContainer: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  searchInput: {
    backgroundColor: '#f5f5f5',
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 14,
    color: '#1C0256',
  },
  postCard: {
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 16,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#f0f0f0',
    overflow: 'hidden',
  },
  postHeader: { flexDirection: 'row', alignItems: 'center', padding: 12, gap: 10 },
  postHeaderText: { flex: 1, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  avatar: { width: 40, height: 40, borderRadius: 20 },
  username: { fontWeight: '600', color: '#1C0256' },
  timeAgo: { fontSize: 12, color: '#909090' },
  postImage: { width: '100%', height: 300 },
  postActions: { flexDirection: 'row', gap: 16, padding: 12 },
  likes: { fontWeight: '600', color: '#1C0256', paddingHorizontal: 12 },
  caption: { color: '#1C0256', paddingHorizontal: 12, paddingBottom: 8 },
  tagsContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, paddingHorizontal: 12, paddingBottom: 12 },
  tag: { backgroundColor: '#EDE9FE', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 },
  tagText: { color: '#4A26D0', fontSize: 12, fontWeight: '500' },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    maxHeight: '60%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: { fontSize: 18, fontWeight: 'bold', color: '#1C0256' },
  commentItem: { flexDirection: 'row', marginBottom: 12 },
  commentUsername: { fontWeight: '600', color: '#1C0256' },
  commentText: { color: '#1C0256', flex: 1 },
  commentInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    paddingTop: 12,
    marginTop: 12,
    gap: 10,
  },
  commentInput: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 14,
    color: '#1C0256',
  },
});