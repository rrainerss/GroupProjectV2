import { View, Text, StyleSheet, Dimensions, ScrollView } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { collection, query, where, onSnapshot, Timestamp } from 'firebase/firestore';
import { FAB } from 'react-native-paper';

import { FIREBASE_AUTH, FIREBASE_DB } from '../../../FirebaseConfig'; 
import { Colors } from '@/colors';
import AppbarHome from '@/app/components/AppbarHome';
import WideCard from '@/app/components/WideCard';

const PrivateChatHome = () => {  
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
  const [chats, setChats] = useState<Chat[]>([]);

  //Data fetch from firebase
  useEffect(() => {
    if (!user?.uid) return;

    const chatsRef = collection(FIREBASE_DB, 'privateChats');
    const q = query(chatsRef, where('users', 'array-contains', user.uid));

    const unsubscribe = onSnapshot(q, (snapshot) => {
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

      setChats(sortedChats);
    });

    return unsubscribe;
  }, [user?.uid]);

  return (
    <View style={styles.container}>
      <AppbarHome title='Messages' />
      <ScrollView contentContainerStyle={styles.scrollview}>
        <View>
          <Text style={styles.sectionTitle}>Recent chats</Text>
          {/* Generate chats */}
          {chats.map(chat => {
            let otherUserEmail = 'Unknown';
            if (user && chat.usersInfo) {
              const otherUser = chat.usersInfo.find(u => u.uid !== user.uid);
              if (otherUser) {
                otherUserEmail = otherUser.email ?? 'Unknown';
              }
            }
            return (
              <WideCard 
                key={chat.id}
                title={otherUserEmail}
                description={chat.lastMessage || 'Start chatting!'}
                letter={otherUserEmail.charAt(0).toUpperCase()}
                imageSrc='https://placehold.co/100x100'
                accentColor={Colors.accent}
                onPress={() => navigation.navigate('PrivateChat', {
                  chatId: chat.id,
                  otherUserEmail,
                  accentColor: Colors.accent,
                })}
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

export default PrivateChatHome;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    fab: {
      position: 'absolute',
      right: 25,
      bottom: 30,
      backgroundColor: 'white',
      elevation: 4,
    },
    scrollview: {
      paddingHorizontal: 20,
      paddingVertical: 10,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: Colors.text,
        marginBottom: 10,
    },
});
