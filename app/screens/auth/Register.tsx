import { createUserWithEmailAndPassword } from 'firebase/auth';
import { ref, set } from 'firebase/database';
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { FIREBASE_AUTH, FIREBASE_DB } from '../../../FirebaseConfig';

const { width } = Dimensions.get('window');

const Register = () => {
    const [year, setYear] = useState(3); // Default year selection
    const [course, setCourse] = useState('IT'); // Default course selection
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const auth = FIREBASE_AUTH;
    const [loading, setLoading] = useState(false);

    const years = [1, 2, 3, 4, 5];
    const courses = ['IT', 'eIT', 'MT', 'BV', 'KI'];

    const signUp = async () => {
        setLoading(true);
        try { 
            // Validate required fields
            if (!firstName.trim() || !lastName.trim() || !email.trim() || !password.trim() || !course || !year) {
                alert('Please fill in all fields');
                setLoading(false);
                return;
            }

            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // Store additional user info in Realtime Database
            const userRef = ref(FIREBASE_DB, `users/${user.uid}`);
            await set(userRef, {
                email: email.trim(),
                firstName: firstName.trim(),
                lastName: lastName.trim(),
                year: year,
                course: course,
                createdAt: new Date().toISOString(),
            });

            console.log('User data saved:', {
                email: email.trim(),
                firstName: firstName.trim(),
                lastName: lastName.trim(),
                year: year,
                course: course
            });
            alert('Registration successful!');
        } catch (error: any) {
            console.error(error);
            alert('Sign up failed: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Register</Text>
            <Text style={styles.subtitle}>Vidzemes Augstskola (ViA)</Text>

            <TextInput 
                style={styles.input} 
                placeholder='First name' 
                onChangeText={(text) => setFirstName(text.trim())}
                value={firstName}
                autoCapitalize="words"
            />
            <TextInput 
                style={styles.input} 
                placeholder='Last name' 
                onChangeText={(text) => setLastName(text.trim())}
                value={lastName}
                autoCapitalize="words"
            />
            <TextInput 
                style={styles.input} 
                placeholder='E-mail' 
                keyboardType='email-address' 
                onChangeText={(text) => setEmail(text.trim())}
                value={email}
                autoCapitalize="none"
            />
            <TextInput 
                style={styles.input} 
                placeholder='Password' 
                secureTextEntry={true} 
                onChangeText={setPassword}
                value={password}
            />

            {/* Year Selection */}
            <Text style={styles.sectionTitle}>Year</Text>
            <View style={styles.selectionContainer}>
                {years.map((y) => (
                    <TouchableOpacity
                        key={y}
                        style={[styles.option, year === y && styles.selectedOption]}
                        onPress={() => setYear(y)}
                    >
                        <Text style={[styles.optionText, year === y && styles.selectedText]}>{y}</Text>
                    </TouchableOpacity>
                ))}
            </View>

            {/* Course Selection */}
            <Text style={styles.sectionTitle}>Course</Text>
            <View style={styles.selectionContainer}>
                {courses.map((c) => (
                    <TouchableOpacity
                        key={c}
                        style={[styles.option, course === c && styles.selectedOption]}
                        onPress={() => setCourse(c)}
                    >
                        <Text style={[styles.optionText, course === c && styles.selectedText]}>{c}</Text>
                    </TouchableOpacity>
                ))}
            </View>

            {/* Confirm Button */}
            <TouchableOpacity 
                style={[styles.confirmButton, loading && styles.disabledButton]} 
                onPress={signUp}
                disabled={loading}
            >
                <Text style={styles.confirmText}>{loading ? 'Registering...' : 'Confirm'}</Text>
            </TouchableOpacity>
        </View>
    );
};

export default Register;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#EDE5F6', // Light purple
        alignItems: 'center',
        paddingTop: 50,
    },
    title: {
        marginTop: 50,
        fontSize: 36,
        fontWeight: 'bold',
        color: '#F98012',
    },
    subtitle: {
        fontSize: 20,
        color: '#F98012',
        marginBottom: 55,
        fontWeight: "bold",
    },
    input: {
        width: width * 0.85,
        height: 50,
        borderBottomWidth: 1,
        marginBottom: 15,
        paddingHorizontal: 10,
        fontSize: 16,
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
    disabledButton: {
        opacity: 0.7,
    },
});
