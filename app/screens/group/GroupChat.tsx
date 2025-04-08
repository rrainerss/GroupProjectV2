import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, FlatList, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { collection, addDoc, onSnapshot, query, orderBy, Timestamp } from 'firebase/firestore';
import { IconButton } from 'react-native-paper';

import { FIREBASE_DB, FIREBASE_AUTH } from '../../../FirebaseConfig';
import AppbarNested from '@/app/components/AppbarNested';
import { Colors } from '@/colors';

const GroupChat = () => {
  //Variables
  const route = useRoute();
  const { groupId, groupName, accentColor } = route.params as { 
    groupId: string; 
    groupName: string; 
    accentColor: string; 
  };
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState('');
  const user = FIREBASE_AUTH.currentUser;

  //Set loaded messages
  useEffect(() => {
    const messagesRef = collection(FIREBASE_DB, 'groups', groupId, 'messages');
    const q = query(messagesRef, orderBy('createdAt', 'desc'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedMessages = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setMessages(fetchedMessages);
    });

    return () => unsubscribe();
  }, [groupId]);

  //Send a new message
  const sendMessage = async () => {
    if (input.trim().length === 0 || !user) return;

    await addDoc(collection(FIREBASE_DB, 'groups', groupId, 'messages'), {
      text: input,
      createdAt: Timestamp.now(),
      user: {
        uid: user.uid,
        email: user.email,
      },
    });

    setInput('');
  };

  //Message bubble, conditional styling
  const renderItem = ({ item }: { item: any }) => {
    const backgroundColor = accentColor || 'lightgray';
  
    return (
      <View style={styles.messageRow}>
        {item.user.uid !== user?.uid && (
          <View style={styles.avatarCircle}>
            <Text style={styles.avatarText}>
              {item.user.email?.charAt(0).toUpperCase() || '?'}
            </Text>
          </View>
        )}
        <View style={[ styles.messageBubble, item.user.uid === user?.uid ? { ...styles.myMessage, backgroundColor } : styles.otherMessage,]}>
          <Text style={styles.messageText}>{item.text}</Text>
          <Text style={styles.senderText}>
            {item.user.email === user?.email ? 'You' : item.user.email}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <>
      <AppbarNested title={groupName} backgroundColor={accentColor}></AppbarNested>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={100}>
        <FlatList
          data={messages}
          inverted
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={{ padding: 10 }}
          ListEmptyComponent={
            <Text style={{ textAlign: 'center', color: 'darkgray', flex: 1, height: 50, fontSize: 20 }}>
              No messages yet!
            </Text>
          }
        />

        <View style={styles.inputContainer}>
          <TextInput
            value={input}
            onChangeText={setInput}
            placeholder="Type a message"
            style={styles.input}
          />
          <IconButton icon="send" iconColor='white' onPress={sendMessage} style={[styles.sendButton, { backgroundColor: accentColor }]}></IconButton>
        </View>
      </KeyboardAvoidingView>
    </>
  );
};

export default GroupChat;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  messageBubble: {
    marginVertical: 4,
    padding: 10,
    borderRadius: 20,
    maxWidth: '70%',
    elevation: 3,
  },
  myMessage: {
    marginStart: 'auto',
    borderBottomRightRadius: 5,
  },
  otherMessage: {
    backgroundColor: 'lightgray',
    alignSelf: 'flex-start',
    borderBottomLeftRadius: 5,
  },
  messageText: {
    fontSize: 18,
  },
  senderText: {
    fontSize: 12,
    marginTop: 2,
    color: 'gray',
  },
  messageRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: 10,
  },
  avatarCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.accent,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  avatarText: {
    color: 'white',
    fontWeight: 'bold',
  },

  
  inputContainer: {
    flexDirection: 'row',
    paddingVertical: 7,
    alignItems: 'center',
    backgroundColor: 'white',
    borderBottomColor: 'white',
  },
  input: {
    flex: 1,
    height: 50,
    borderRadius: 25,
    paddingHorizontal: 15,
    marginLeft: 10,
    marginRight: 5,
    backgroundColor: Colors.background,
  },
  sendButton: {
    marginRight: 10,
    borderRadius: 25,
    width: 50,
    height: 50,
  },
});