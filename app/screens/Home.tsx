import { View, Text, StyleSheet, Dimensions, Button } from 'react-native';
import React from 'react';
import AppbarHome from '../components/AppbarHome.js'

import { FIREBASE_AUTH } from '../../FirebaseConfig.js'; 
const { width } = Dimensions.get('window');

type HomeProps = {
    navigation: any;
};

const Home = ({ navigation }: HomeProps)=> {  
    //functionality here

    return (
        <View style={styles.container}>
            <AppbarHome title="ViA Home"/>
            
            <View style={styles.content}>
                <Text>Home</Text>
                <Button 
                    title="Go to Group Chat" 
                    onPress={() => navigation.navigate('GroupChat')} 
                />
                <Button title="Button 2" />
                <Button title="Button 3" />
            </View>
        </View>
    );
};

export default Home;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 20,
    }
});