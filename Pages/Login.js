import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { PageStyle } from '../Style/PageStyle';

export default function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigation = useNavigation();

    const correctUsername = '';
    const correctPassword = '';

    const handleSubmit = () => {
        // Add your login logic here
        if (username === correctUsername && password === correctPassword) {
            navigation.navigate('Main'); // Navigate to the "Main" page
        } else {
            Alert.alert('Login Failed', 'Incorrect username or password');
        }
    };

    return (
        <View style={PageStyle.loginBg}>
            <Text style={PageStyle.loginHeaderText}>Admin</Text>
            <View style={PageStyle.loginContainer}>
                <Text style={PageStyle.loginHeader}>Login</Text>
                <TextInput
                    style={PageStyle.loginInput}
                    placeholder="Username"
                    value={username}
                    onChangeText={setUsername}
                />
                <TextInput
                    style={PageStyle.loginInput}
                    placeholder="Password"
                    secureTextEntry
                    value={password}
                    onChangeText={setPassword}
                />
                <TouchableOpacity style={PageStyle.loginButton} onPress={handleSubmit}>
                    <Text style={PageStyle.loginButtonText}>Login</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}