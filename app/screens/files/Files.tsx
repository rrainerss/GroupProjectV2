import { View, Text, StyleSheet, Dimensions } from 'react-native';
import React from 'react';

import { FIREBASE_AUTH } from '../../../FirebaseConfig'; 
import AppbarHome from '@/app/components/AppbarHome';
const { width } = Dimensions.get('window');

const Files = () => {  
  //functionality here

  return (
    <View style={{ flex: 1 }}>
      <AppbarHome title="Files" />
    </View>
  );
};

export default Files;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});