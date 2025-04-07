import React from 'react';
import { Colors } from '../../colors';
import { View, Text, Dimensions, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { FIREBASE_AUTH } from '../../FirebaseConfig'; 
const { width } = Dimensions.get('window');

import AppbarHome from '../components/AppbarHome';

const Home = () => {
  return (
    <View style={{ flex: 1 }}>
      <AppbarHome title="Home" />
      <ScrollView contentContainerStyle={styles.scrollview}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent groups</Text>
          <TouchableOpacity style={styles.cardBody}>
            <View style={styles.imagePlaceholder}></View>
            <Text>Aaaaa</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      <ScrollView contentContainerStyle={styles.scrollview}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent messages</Text>

        </View>
      </ScrollView>
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

    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    cardBody: {
      backgroundColor: 'gray',
      marginTop: 10,
    },
    imagePlaceholder: {
      height: 60
    }
})