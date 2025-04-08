import React from 'react';
import { Colors } from '../../colors';
import { View, Text, Dimensions, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { FIREBASE_AUTH } from '../../FirebaseConfig'; 
const { width } = Dimensions.get('window');

import AppbarHome from '../components/AppbarHome';
import WideCard from '../components/WideCard';

const Home = () => {
  return (
    <View style={{ flex: 1 }}>
      <AppbarHome title="Home" />
      <ScrollView contentContainerStyle={styles.scrollview}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent groups</Text>
          <WideCard 
            title='Sarmas lieliskais izcilais kurss'
            description='Palīgā'
            letter='A'
            imageSrc='https://placehold.co/100x100'
            accentColor='#ff0000'
          />
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
        color: Colors.text,
    },
})