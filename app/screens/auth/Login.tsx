import { View, Text, StyleSheet, TextInput, ActivityIndicator, TouchableOpacity, Image, KeyboardAvoidingView, Dimensions } from 'react-native';
import React from 'react';
import { FIREBASE_AUTH } from '../../../FirebaseConfig'; 
import { signInWithEmailAndPassword } from 'firebase/auth';

const { width } = Dimensions.get('window');

const Login = () => {  
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const auth = FIREBASE_AUTH;
    const [loading, setLoading] = React.useState(false);

    const signIn = async () => {
        setLoading(true);
        try { 
            const response = await signInWithEmailAndPassword(auth, email, password);
            console.log(response);
        } catch (error: any) {
            console.error(error);
            alert('Sign in failed! ' + error.message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <View style={styles.container}>
            {/* Smoodle Logo */}
            <Image source={require("../../../assets/smoodle.png")} style={styles.logo} />

            {/* University Name */}
            <Text style={styles.subtitle}>Vidzemes Augstskola (ViA)</Text>

            {/* Email & Password Inputs */}
            <KeyboardAvoidingView behavior="padding" style={styles.inputContainer}>
                <TextInput 
                    value={email} 
                    style={styles.input} 
                    placeholder="E-mail" 
                    placeholderTextColor="#A0A0A0" // Light gray placeholder text
                    autoCapitalize="none" 
                    keyboardType="email-address"
                    onChangeText={(text) => setEmail(text)} 
                />
                
                <TextInput 
                    secureTextEntry={true} 
                    value={password} 
                    style={styles.input} 
                    placeholder="Password" 
                    placeholderTextColor="#A0A0A0" // Light gray placeholder text
                    autoCapitalize="none" 
                    onChangeText={(text) => setPassword(text)} 
                />
            </KeyboardAvoidingView>

            {/* Login Button */}
            {loading ? (
                <ActivityIndicator size="large" color="#F98012" />
            ) : (
                <TouchableOpacity style={styles.loginButton} onPress={signIn}>
                    <Text style={styles.loginText}>Log In</Text>
                </TouchableOpacity>
            )}
        </View>
    );
};

export default Login;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#EDE5F6', // Light purple background
        alignItems: 'center',
        paddingTop: 30,
    },
    logo: {
        width: 252,
        height: 120,
        resizeMode: 'contain',
        marginBottom: 0,
        marginTop: 50,
    },
    subtitle: {
        fontSize: 20,
        color: '#F98012',
        marginBottom: 150,
        fontWeight: "bold",
    },
    inputContainer: {
        width: width * 0.85,
    },
    input: {
        width: '100%',
        height: 50,
        borderBottomWidth: 1,
        marginBottom: 15,
        paddingHorizontal: 10,
        fontSize: 16,
        color: '#A0A0A0', // Light gray text color
    },
    loginButton: {
        backgroundColor: '#F98012',
        paddingVertical: 15,
        paddingHorizontal: 50,
        borderRadius: 100,
        marginTop: 190,
    },
    loginText: {
        fontSize: 18,
        color: '#FFFFFF',
        fontWeight: 'bold',
    },
});
