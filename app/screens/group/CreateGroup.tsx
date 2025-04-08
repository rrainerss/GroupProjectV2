import { View, Text, StyleSheet, Dimensions, TextInput, TouchableOpacity, ToastAndroid } from 'react-native';
import React, { useState } from 'react';
import { addDoc, collection, Timestamp } from 'firebase/firestore';
import { useNavigation } from '@react-navigation/native';

import { FIREBASE_AUTH, FIREBASE_DB } from '../../../FirebaseConfig'; 
import { Colors } from '@/colors';
import AppbarNestedBlank from '@/app/components/AppbarNestedBlank';
const { width } = Dimensions.get('window');

const CreateGroup = () => {  
  //Variables
  const [groupName, setGroupName] = React.useState('');
  const [groupDescription, setGroupDescription] = React.useState('');
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [selectedColor, setSelectedColor] = useState<string>('');
  const years = [1, 2, 3, 4, 5];
  const user = FIREBASE_AUTH.currentUser;
  const navigation = useNavigation();
  const pastelColors = [
    '#FFB3BA', '#FFDFBA', '#FFFFBA',
    '#BAFFC9', '#BAE1FF', '#D7BAFF',
    '#F0BAFF', '#FFBACF', '#C7FFBA',
  ];

  //Group creation with field check
  const createGroup = async () => {
    if (!user) return;

    if (!groupName.trim() || !groupDescription.trim() || !selectedYear || !selectedColor) {
      ToastAndroid.show("Please fill in and select all fields", ToastAndroid.SHORT);
      return;
    }

    try {
      await addDoc(collection(FIREBASE_DB, 'groups'), {
        name: groupName,
        description: groupDescription,
        createdAt: Timestamp.now(),
        createdBy: {
          uid: user.uid,
          email: user.email,
        },
        year: selectedYear,
        color: selectedColor,
      });
      navigation.goBack();
    } 
    catch (error) {
      console.error('Failed to create group', error);
      ToastAndroid.show("Failed to create group", ToastAndroid.SHORT);
    }
  };

  return (
    <View style={{flex: 1}}>
      <AppbarNestedBlank title="Create a new group"/>
        <View style={styles.container}>
          <View style={styles.inputContainer}>
            <View style={styles.avatarCircle}></View>
            <TextInput 
              value={groupName} 
              style={styles.input} 
              placeholder="Group name" 
              placeholderTextColor="#A0A0A0"
              autoCapitalize="none" 
              keyboardType="default"
              onChangeText={(text) => setGroupName(text)} 
            />
            <TextInput 
              value={groupDescription} 
              style={styles.input} 
              placeholder="Describe your group here" 
              placeholderTextColor="#A0A0A0"
              autoCapitalize="none" 
              keyboardType="default"
              onChangeText={(text) => setGroupDescription(text)} 
            />
            <Text style={styles.sectionTitle}>Year</Text>
            <View style={styles.selectionContainer}>
              {years.map((year) => (
                <TouchableOpacity
                  key={year}
                  style={[styles.option, selectedYear === year && styles.selectedOption]}
                  onPress={() => setSelectedYear(year)}>
                  <Text style={[styles.optionText, selectedYear === year && styles.selectedText]}>{year}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
          <Text style={styles.sectionTitle}>Theme color</Text>
          <View style={styles.colorGrid}>
            <View style={styles.colorRow}>
              {pastelColors.slice(0, 5).map((color, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.colorCircle,
                    { backgroundColor: color },
                    selectedColor === color && styles.selectedCircle
                  ]}
                  onPress={() => setSelectedColor(color)}
                />
              ))}
            </View>
            <View style={styles.colorRow}>
              {pastelColors.slice(5).map((color, index) => (
                <TouchableOpacity
                  key={index + 5}
                  style={[
                    styles.colorCircle,
                    { backgroundColor: color },
                    selectedColor === color && styles.selectedCircle
                  ]}
                  onPress={() => setSelectedColor(color)}
                />
              ))}
            </View>
          </View>
          <TouchableOpacity style={styles.confirmButton} onPress={createGroup}>
              <Text style={styles.confirmText}>Create group</Text>
          </TouchableOpacity>
        </View>
    </View>
  )
};

export default CreateGroup;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',

  },
  inputContainer: {
    width: width * 0.85,
    alignItems: 'center',
  },
  input: {
    width: '100%',
    height: 50,
    borderBottomWidth: 1,
    marginBottom: 15,
    paddingHorizontal: 10,
    fontSize: 16,
    color: Colors.text,
  },
  avatarCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'lightgray',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 15,
  },
  selectionContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      marginTop: 10,
  },
  option: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 25,
    borderWidth: 1,
    marginHorizontal: 5,
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
  confirmButton: {
    backgroundColor: '#F98012',
    paddingVertical: 15,
    paddingHorizontal: 50,
    borderRadius: 100,
    marginTop: 25,
  },
  confirmText: {
    fontSize: 18,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  colorGrid: {
    marginTop: 15,
    alignItems: 'center',
  },
  colorRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 10,
  },
  colorCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginHorizontal: 6,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedCircle: {
    borderColor: Colors.accent,
  },
})