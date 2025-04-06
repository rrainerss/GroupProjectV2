import React from 'react';
import { View, Text, Dimensions } from 'react-native';
import AppbarHome from '../components/AppbarHome';

import { FIREBASE_AUTH } from '../../FirebaseConfig'; 
const { width } = Dimensions.get('window');

const Home = () => {
  return (
    <View style={{ flex: 1 }}>
      <AppbarHome title="Home" />
      <Text>Welcome to Home</Text>
    </View>
  );
};

export default Home;