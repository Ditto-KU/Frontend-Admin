import React, { useState } from "react";
import {
  View, Text, TextInput, TouchableOpacity, Alert, ActivityIndicator,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { PageStyle } from "../Style/PageStyle";

export default function Login({ setAuthAdmin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();

  const handleSubmit = async () => {
    if (username === "" || password === "") {
      Alert.alert("Validation Error", "Please enter both username and password.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("https://ku-man-api.vimforlanie.com/admin/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        Alert.alert("Login Failed", "Invalid username or password");
        return;
      }

      const data = await response.json();
      const authAdmin = data.token;

      // Save the token in AsyncStorage
      await AsyncStorage.setItem("authAdmin", authAdmin);
      setAuthAdmin(authAdmin); // Set the token in App state

      // Navigate to the main screen
      navigation.replace("Dashboard");
    } catch (error) {
      console.error("Login error:", error);
      Alert.alert("Login Error", "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
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
          autoCapitalize="none"
        />
        <TextInput
          style={PageStyle.loginInput}
          placeholder="Password"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
        {loading ? (
          <ActivityIndicator size="large" color="#0000ff" />
        ) : (
          <TouchableOpacity style={PageStyle.loginButton} onPress={handleSubmit}>
            <Text style={PageStyle.loginButtonText}>Login</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}
