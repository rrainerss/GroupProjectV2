import { View, Text, StyleSheet, Dimensions, ScrollView } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { collection, query, where, onSnapshot, Timestamp, limit } from 'firebase/firestore';
import { FAB } from 'react-native-paper';

import { FIREBASE_AUTH, FIREBASE_DB } from '../../FirebaseConfig'; 
import { Colors } from '../../colors';
import AppbarHome from '../components/AppbarHome';
import WideCard from '../components/WideCard';

const Home = () => {
  //Variables
  const navigation = useNavigation();
  const user = FIREBASE_AUTH.currentUser;
  interface Chat {
    id: string;
    updatedAt: Timestamp;
    users: string[];
    lastMessage: string;
    usersInfo: { uid: string, email: string }[];
  }
  const [recentGroups, setRecentGroups] = useState<any[]>([]);
  const [recentChats, setRecentChats] = useState<Chat[]>([]);

  //Fetch recent groups from Firebase
  useEffect(() => {
    if (!user?.uid) return;

    const fetchRecentGroups = () => {
      const groupsRef = collection(FIREBASE_DB, 'groups');
      const q = query(groupsRef, where('createdAt', '!=', null), limit(3));

      const unsubscribeGroups = onSnapshot(q, (snapshot) => {
        const groups = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setRecentGroups(groups);
      });

      return unsubscribeGroups;
    };

    //Fetch recent chats
    const fetchRecentChats = () => {
      const privateChatsRef = collection(FIREBASE_DB, 'privateChats');
      const q = query(privateChatsRef, where('users', 'array-contains', user.uid));

      const unsubscribeChats = onSnapshot(q, (snapshot) => {
        const fetchedChats = snapshot.docs.map((doc) => {
          const data = doc.data();

          return {
            id: doc.id,
            updatedAt: data.updatedAt ? data.updatedAt : Timestamp.fromMillis(0),
            users: data.users || [],
            lastMessage: data.lastMessage || '',
            usersInfo: data.usersInfo || [],
          };
        });

        //Sort chats in descending order
        const sortedChats = fetchedChats.sort((a, b) => {
          const aUpdatedAt = a.updatedAt instanceof Timestamp ? a.updatedAt.toMillis() : 0;
          const bUpdatedAt = b.updatedAt instanceof Timestamp ? b.updatedAt.toMillis() : 0;
          return bUpdatedAt - aUpdatedAt;
        });

        setRecentChats(sortedChats);
      });

      return unsubscribeChats;
    };

    fetchRecentGroups();
    fetchRecentChats();
  }, [user?.uid]);

  //Get the other user's email for displaying
  const getOtherUserEmail = (usersInfo: { uid: string, email: string }[]) => {
    if (usersInfo && user) {
      const otherUser = usersInfo.find((u) => u.uid !== user.uid);
      return otherUser ? otherUser.email : 'Unknown';
    }
    return 'Unknown';
  };

  //Navigation to PrivateChat
  const handleNavigateToPrivateChat = (chatId: string, otherUserEmail: string) => {
    navigation.navigate('PrivateChat', {
      chatId,
      otherUserEmail,
      accentColor: Colors.accent,
    });
  };

  //Navigation to GroupChat
  const handleNavigateToGroupChat = (groupId: string, groupName: string, accentColor: string) => {
    navigation.navigate('GroupChat', {
      groupId,
      groupName,
      accentColor,
    });
  };

  return (
    <View style={{ flex: 1 }}>
      <AppbarHome title="Home" />
      <ScrollView contentContainerStyle={styles.scrollview}>
        {/* Recent Groups Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recently created groups</Text>
          {recentGroups.map(group => (
            <WideCard 
              key={group.id}
              title={group.name}
              description={group.description}
              letter={group.name?.charAt(0) || '?'}
              imageSrc="https://placehold.co/100x100"
              accentColor={group.color}
              onPress={() => handleNavigateToGroupChat(group.id, group.name, group.color)}
            />
          ))}
        </View>
        {/* Recent Chats Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent chats</Text>
          {recentChats.map(chat => {
            const otherUserEmail = getOtherUserEmail(chat.usersInfo);
            return (
              <WideCard 
                key={chat.id}
                title={otherUserEmail}
                description={chat.lastMessage || 'No message content'}
                letter={otherUserEmail.charAt(0).toUpperCase()}
                imageSrc="https://placehold.co/100x100"
                accentColor={Colors.accent}
                onPress={() => handleNavigateToPrivateChat(chat.id, otherUserEmail)}
              />
            );
          })}
        </View>
      </ScrollView>
      <FAB
        icon="plus"
        onPress={() => navigation.navigate('CreateChat')}
        style={styles.fab}
        color={Colors.accent}
        customSize={60}
      />
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  scrollview: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 10,
  },
  fab: {
    position: 'absolute',
    right: 25,
    bottom: 30,
    backgroundColor: 'white',
    elevation: 4,
  },
});