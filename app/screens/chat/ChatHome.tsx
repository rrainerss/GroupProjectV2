import { View, Text, StyleSheet, Dimensions } from 'react-native';
import React from 'react';

import { FIREBASE_AUTH } from '../../../FirebaseConfig'; 
const { width } = Dimensions.get('window');

const ChatHome = () => {  
    //functionality here

    return (
        <View style={styles.container}>
            <Text>ChatHome</Text>
        </View>
    );
};

export default ChatHome;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});