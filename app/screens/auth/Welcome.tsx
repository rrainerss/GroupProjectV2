import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

const Welcome = ({ navigation }: any) => {
  return (
    <View style={styles.container}>
      {/* More Curved White Ellipse */}
      <View style={styles.ellipse} />

      {/* "Welcome to" Text */}
      <Text style={styles.welcomeText}>Welcome to</Text>

      {/* AppName Image */}
      <Image 
        source={require("../../../assets/smoodle.png")} 
        style={styles.logo}
        resizeMode="contain"
      />

      {/* Roblox Character Image */}
      <Image 
        source={require("../../../assets/noob.png")} 
        style={styles.character}
        resizeMode="contain"
      />

      {/* Buttons */}
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Register')}>
        <Text style={styles.buttonText}>Register</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Login')}>
        <Text style={styles.buttonText}>Log in</Text>
      </TouchableOpacity>
      
    </View>
  );
};

export default Welcome;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#F3EAFD', // Light purple background
    justifyContent: 'center',
  },
  ellipse: {
    position: 'absolute',
    width: width * 1.5,
    height: height * 0.85, // Adjusted to make the curve higher
    backgroundColor: '#FFFFFF',
    borderBottomLeftRadius: width, 
    borderBottomRightRadius: width,
    top: -height * 0.22, // Slightly lowered
    left: -(width * 0.25),
  },
  welcomeText: {
    fontSize: 36,
    fontFamily: 'SecularOne-Regular',
    color: '#F98012',
    marginTop: height * 0.072,
    textAlign: 'center',
    fontWeight: "bold",
  },
  logo: {
    width: 252,
    height: 60,
    marginTop: 0,
  },
  character: {
    width: 315,
    height: 315,
    marginTop: -30, // Move character down so feet touch ellipse
    marginBottom: 50, // Adjusted
  },
  button: {
    backgroundColor: '#F98012',
    paddingVertical: 12,
    paddingHorizontal: 0,
    borderRadius: 100,
    width: 178,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,

  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
