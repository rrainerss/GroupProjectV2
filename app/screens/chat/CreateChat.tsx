import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { collection, doc, getDoc, onSnapshot, serverTimestamp, setDoc } from 'firebase/firestore';
import { useNavigation } from '@react-navigation/native';

import { FIREBASE_DB, FIREBASE_AUTH } from '../../../FirebaseConfig';
import { Colors } from '@/colors';
import AppbarNested from '@/app/components/AppbarNested';

const CreateChat = () => {
  //Variables
  type User = {
    id: string;
    uid: string;
    email: string;
    year: number;
  };
  const [users, setUsers] = useState<User[]>([]);
  const user = FIREBASE_AUTH.currentUser;
  const navigation = useNavigation();

  //Load all users
  useEffect(() => {
    if (!user?.email) return;
  
    const usersRef = collection(FIREBASE_DB, 'users');
  
    const unsubscribe = onSnapshot(usersRef, (snapshot) => {
      const fetchedUsers: User[] = snapshot.docs
        .map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            uid: data.uid ?? doc.id,
            email: data.email,
            year: data.year,
          };
        })
        .filter(u => u.email !== user.email);
      setUsers(fetchedUsers);
    });
  
    return () => unsubscribe();
  }, [user?.email]);

  //Start a new chat with user
  const startChat = async (otherUser: User) => {
    if (!user) return;
    const chatId = [user.uid, otherUser.uid].sort().join('_');
    const chatRef = doc(FIREBASE_DB, 'privateChats', chatId);
  
    const chatSnap = await getDoc(chatRef);
    if (!chatSnap.exists()) {
      await setDoc(chatRef, {
        users: [user.uid, otherUser.uid],
        usersInfo: [
          { uid: user.uid, email: user.email },
          { uid: otherUser.uid, email: otherUser.email },
        ],
        updatedAt: serverTimestamp(),
        lastMessage: '',
      });
    }
  
    navigation.navigate('PrivateChat' as never, {
      chatId,
      otherUserEmail: otherUser.email,
      accentColor: Colors.accent,
    } as never);
  };

  //Render a user card
  const renderItem = ({ item }: { item: User }) => (
    <TouchableOpacity onPress={() => startChat(item)} style={styles.userItem}>
      <Text style={styles.avatarLetter}>{item.email.charAt(0).toUpperCase()}</Text>
      <View>
        <Text style={styles.userEmail}>{item.email}</Text>
        <Text style={styles.userYear}>Year {item.year}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <AppbarNested title="Start a Chat" backgroundColor={Colors.accent} />
      <FlatList
        data={users}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No other users found.</Text>
        }
      />
    </View>
  );
};

export default CreateChat;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  list: {
    padding: 16,
  },
  userItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 12,
    marginVertical: 6,
    borderRadius: 10,
    elevation: 2,
  },
  avatarLetter: {
    backgroundColor: Colors.accent,
    color: 'white',
    fontWeight: 'bold',
    width: 32,
    height: 32,
    textAlign: 'center',
    textAlignVertical: 'center',
    borderRadius: 16,
    marginRight: 12,
    fontSize: 16,
  },
  userEmail: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  userYear: {
    color: 'gray',
    fontSize: 12,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
    color: 'gray',
  },
});