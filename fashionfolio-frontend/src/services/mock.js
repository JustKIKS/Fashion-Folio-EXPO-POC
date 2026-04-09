export let FAKE_CONVERSATIONS = [
    {
        id: "fake-1",
        participant_name: "Sophie Martin",
        participant_avatar: "https://i.pravatar.cc/150?img=1",
        last_message: "J'adore ton dernier look ! 😍",
        last_message_date: new Date(Date.now() - 300000).toISOString(),
        unread_count: 2
    },
    {
        id: "fake-2",
        participant_name: "Thomas Dubois",
        participant_avatar: "https://i.pravatar.cc/150?img=12",
        last_message: "Tu as acheté où ce manteau ?",
        last_message_date: new Date(Date.now() - 3600000).toISOString(),
        unread_count: 0
    },
    {
        id: "fake-3",
        participant_name: "Emma Laurent",
        participant_avatar: "https://i.pravatar.cc/150?img=5",
        last_message: "Merci pour les conseils ! 🙏",
        last_message_date: new Date(Date.now() - 7200000).toISOString(),
        unread_count: 1
    },
    {
        id: "fake-4",
        participant_name: "Lucas Bernard",
        participant_avatar: "https://i.pravatar.cc/150?img=14",
        last_message: "Super tenue pour l'événement 👌",
        last_message_date: new Date(Date.now() - 86400000).toISOString(),
        unread_count: 0
    }
];

export const markAsRead = (conversationId) => {
    FAKE_CONVERSATIONS = FAKE_CONVERSATIONS.map(conv =>
    conv.id === conversationId ? { ...conv, unread_count: 0 } : conv
    );
};

export const MOCK_USER = {
    name: "User",
    username: "@user_mode",
    bio: "Passionné de mode 👗 | Streetwear & Élégance",
    avatar: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?q=80&w=764",
    isPremium: false,
    stats: {
        pieces: 24,
        outfits: 8,
        worn: 15,
        likes: 102,
        followers: 48,
        following: 32
    }
};