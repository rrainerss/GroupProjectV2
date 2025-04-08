import { View, Text, StyleSheet, Dimensions, ScrollView } from 'react-native';
import React, { useEffect, useState } from 'react';
import { onSnapshot, collection, doc, getDoc } from 'firebase/firestore';
import { FAB } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';

import { FIREBASE_AUTH, FIREBASE_DB } from '../../../FirebaseConfig'; 
import AppbarHome from '@/app/components/AppbarHome';
import WideCard from '@/app/components/WideCard';
import { Colors } from '@/colors';

const GroupsHome = () => {  
  //Variables
  const [groups, setGroups] = useState<any[]>([]);
  const [userYear, setUserYear] = useState<number | null>(null);
  const user = FIREBASE_AUTH.currentUser;
  const navigation = useNavigation();

  //Fetch user year
  useEffect(() => {
    const fetchUserYear = async () => {
      if (!user?.uid) return;
      const userDoc = await getDoc(doc(FIREBASE_DB, 'users', user.uid));
      if (userDoc.exists()) {
        const data = userDoc.data();
        setUserYear(data.year);
      }
    };

    fetchUserYear();
  }, [user?.uid]);

  //Fetch groups
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(FIREBASE_DB, 'groups'), (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setGroups(data);
    });

    return () => unsubscribe();
  }, []);

  //Filtered groups
  const myYearGroups = groups.filter(group => group.year === userYear);
  const otherGroups = groups.filter(group => group.year !== userYear);

  return (
    <View style={{ flex: 1 }}>
      <AppbarHome title="Groups" />
      <ScrollView contentContainerStyle={styles.scrollview}>
        <View style={styles.section}>
          {userYear !== null && (
            <>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Year {userYear} Groups</Text>
              </View>
              {myYearGroups.length > 0 ? (
                myYearGroups.map((group) => (
                  <WideCard
                    key={group.id}
                    title={group.name}
                    description={`Created by ${group.createdBy?.email || 'unknown'}`}
                    letter={group.name?.charAt(0) || '?'}
                    imageSrc="https://placehold.co/100x100"
                    accentColor={group.color}
                    onPress={() => navigation.navigate('GroupChat', {
                      groupId: group.id,
                      groupName: group.name,
                      accentColor: group.color
                    })}
                  />
                ))
              ) : (
                <Text style={styles.emptyText}>No groups for your year.</Text>
              )}
            </>
          )}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle2}>All Other Groups</Text>
          </View>
          {otherGroups.length > 0 ? (
            otherGroups.map((group) => (
              <WideCard
                key={group.id}
                title={group.name}
                description={`Created by ${group.createdBy?.email || 'unknown'}`}
                letter={group.name?.charAt(0) || '?'}
                imageSrc="https://placehold.co/100x100"
                accentColor={group.color}
                onPress={() => navigation.navigate('GroupChat', {
                  groupId: group.id,
                  groupName: group.name,
                  accentColor: group.color
                })}
              />
            ))
          ) : (
            <Text style={styles.emptyText}>No other groups found.</Text>
          )}
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

export default GroupsHome;

const styles = StyleSheet.create({
  scrollview: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  section: {},
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.text,
  },
  sectionTitle2: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
    color: Colors.text,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  emptyText: {
    textAlign: 'center',
    color: 'gray',
    marginVertical: 10,
  },
  fab: {
    position: 'absolute',
    right: 25,
    bottom: 30,
    backgroundColor: 'white',
    elevation: 4,
  },
});