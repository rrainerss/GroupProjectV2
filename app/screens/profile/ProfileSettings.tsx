import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Alert, ActivityIndicator, TouchableOpacity } from 'react-native';
import { TextInput, Button, Text } from 'react-native-paper';  // Importing TextInput and Button
import { getAuth } from 'firebase/auth';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { FIREBASE_DB } from '../../../FirebaseConfig';
import AppbarNested from '@/app/components/AppbarNested';
import { Colors } from '@/colors';

export default function ProfileSettings() {
  const auth = getAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [userData, setUserData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    course: '',
    year: '',
  });

  const years = [1, 2, 3, 4, 5];
  const courses = ['IT', 'eIT', 'MT', 'BV', 'KI'];

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      setLoading(true);
      const user = auth.currentUser;
      if (!user) {
        Alert.alert('Error', 'Please log in again');
        return;
      }

      const userDocRef = doc(FIREBASE_DB, `users/${user.uid}`);
      const snapshot = await getDoc(userDocRef);

      if (snapshot.exists()) {
        const data = snapshot.data();
        console.log('Loading user data:', data);

        // Check if any profile fields are missing
        if (!data.firstName || !data.lastName || !data.course || !data.year) {
          console.log('Missing required fields in user data');
          Alert.alert('Warning', 'Some profile information is missing. Please update your profile.');
        }

        setUserData({
          firstName: data.firstName || '',
          lastName: data.lastName || '',
          email: user.email || '',
          course: data.course || '',
          year: data.year?.toString() || '',
        });
      } else {
        console.log('No user data found in Firestore');
        Alert.alert('Warning', 'Profile data not found. Please update your profile.');
      }
    } catch (error) {
      console.error('Error loading user data from Firestore:', error);
      Alert.alert('Error', 'Failed to load profile data');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const user = auth.currentUser;
      if (!user) {
        Alert.alert('Error', 'Please log in again');
        return;
      }

      const userDocRef = doc(FIREBASE_DB, `users/${user.uid}`);
      await updateDoc(userDocRef, {
        firstName: userData.firstName.trim(),
        lastName: userData.lastName.trim(),
        course: userData.course,
        year: userData.year,
      });

      Alert.alert('Success', 'Profile updated successfully');
    } catch (error) {
      console.error('Error updating profile in Firestore:', error);
      Alert.alert('Error', 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#F98012" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* AppbarNested at the top */}
      <AppbarNested title="Profile" backgroundColor={Colors.accent} />

      <ScrollView style={styles.content}>
        <Text style={styles.sectionTitle}>Personal Information</Text>
        <TextInput
          label="First Name"
          value={userData.firstName}
          onChangeText={(text) => setUserData({ ...userData, firstName: text })}
          style={styles.input}
          mode="outlined"
        />
        <TextInput
          label="Last Name"
          value={userData.lastName}
          onChangeText={(text) => setUserData({ ...userData, lastName: text })}
          style={styles.input}
          mode="outlined"
        />
        <TextInput
          label="Email"
          value={userData.email}
          editable={false}
          style={styles.input}
          mode="outlined"
        />
        <Text style={styles.sectionTitle}>Year</Text>
        <View style={styles.selectionContainer}>
          {years.map((y) => (
            <TouchableOpacity
              key={y}
              style={[
                styles.option,
                userData.year === y.toString() && styles.selectedOption
              ]}
              onPress={() => setUserData({ ...userData, year: y.toString() })}
            >
              <Text style={[
                styles.optionText,
                userData.year === y.toString() && styles.selectedText
              ]}>{y}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.sectionTitle}>Course</Text>
        <View style={styles.selectionContainer}>
          {courses.map((c) => (
            <TouchableOpacity
              key={c}
              style={[
                styles.option,
                userData.course === c && styles.selectedOption
              ]}
              onPress={() => setUserData({ ...userData, course: c })}
            >
              <Text style={[
                styles.optionText,
                userData.course === c && styles.selectedText
              ]}>{c}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Button
          mode="contained"
          onPress={handleSave}
          loading={saving}
          style={styles.saveButton}
          labelStyle={styles.saveButtonText}
        >
          Save Changes
        </Button>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EDE5F6',
    paddingTop: 0,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
    color: '#000',
  },
  input: {
    marginBottom: 16,
    backgroundColor: '#fff',
  },
  selectionContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
    flexWrap: 'wrap',
  },
  option: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 25,
    borderWidth: 1,
    marginHorizontal: 5,
    marginBottom: 10,
    backgroundColor: '#fff',
  },
  selectedOption: {
    backgroundColor: '#F98012',
    borderWidth: 0,
  },
  optionText: {
    fontSize: 16,
  },
  selectedText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  saveButton: {
    marginTop: 24,
    marginBottom: 32,
    backgroundColor: '#F98012',
    paddingVertical: 8,
    borderRadius: 100,
  },
  saveButtonText: {
    fontSize: 18,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#EDE5F6',
  },
});
