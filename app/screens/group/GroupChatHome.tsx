import { View, Text, StyleSheet, Dimensions, ScrollView } from 'react-native';
import React, { useEffect, useState } from 'react';
import { addDoc, onSnapshot, collection, Timestamp } from 'firebase/firestore';
import { FAB } from 'react-native-paper';

import { FIREBASE_AUTH, FIREBASE_DB } from '../../../FirebaseConfig'; 
import AppbarHome from '@/app/components/AppbarHome';
import WideCard from '@/app/components/WideCard';
import { Colors } from '@/colors';
import { useNavigation } from '@react-navigation/native';
const { width } = Dimensions.get('window');

const ChatHome = () => {  
    const [groups, setGroups] = useState<any[]>([]);
    const user = FIREBASE_AUTH.currentUser;
    const navigation = useNavigation();

    // name: groupName,
    // description: groupDescription,
    // createdAt: Timestamp.now(),
    // createdBy: {
    //   uid: user.uid,
    //   email: user.email,
    // },
    // year: selectedYear,
    // color: selectedColor,

    //Fetch groups on load and dynamically
    useEffect(() => {
      const unsubscribe = onSnapshot(collection(FIREBASE_DB, 'groups'), (snapshot) => {
        const data = snapshot.docs.map((doc) => ({
          id: doc.id, ...doc.data(),
        }));
        setGroups(data);
      });

      return () => unsubscribe();
    }, []);

    //Jsx
    return (
      <View style={{ flex: 1 }}>
        <AppbarHome title="Groups" />
        <ScrollView contentContainerStyle={styles.scrollview}>
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>All groups</Text>
            </View>

            {groups.map((group) => (
              <WideCard
                key={group.id}
                title={group.name}
                description={`Created by ${group.createdBy?.email || 'unknown'}`}
                letter={group.name?.charAt(0) || '?'}
                imageSrc="https://placehold.co/100x100"
                accentColor={group.color}
                onPress={() => navigation.navigate('GroupChat', { groupId: group.id, groupName: group.name, accentColor: group.color })}
              />
            ))}
          </View>
        </ScrollView>
        <FAB
          icon="plus"
          onPress={() => navigation.navigate('CreateGroup')}
          style={styles.fab}
          color={Colors.accent}
          customSize={60}
        />
      </View>
    );
};

export default ChatHome;

const styles = StyleSheet.create({
    scrollview: {
      paddingHorizontal: 20,
      paddingVertical: 10,
    },
    section: {

    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: Colors.text,
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
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