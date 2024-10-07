import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { PageStyle } from "../Style/PageStyle";
import AsyncStorage from "@react-native-async-storage/async-storage"; // To store token

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false); // Loading state
  const navigation = useNavigation();

  const handleSubmit = async () => {
    if (username === "" || password === "") {
      Alert.alert("Validation Error", "Please enter username and password");
      return;
    }

    setLoading(true); // Show loading indicator

    try {
      // API call to login and get token
      const response = await fetch(
        "https://ku-man-api.vimforlanie.com/admin/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: username,
            password: password,
          }),
        }
      );

      // Check if response is OK
      if (!response.ok) {
        const errorText = await response.text(); // Capture error details if needed
        console.log(`Error Response: ${errorText}`);
        Alert.alert("Login Failed", "Invalid username or password");
        return;
      }

      const data = await response.json(); // Read response body only once
      console.log(response); // Logs the response object
      console.log(data); // Logs the response data

      if (response.status === 201) {
        const authAdmin = data.token; // Assuming the response returns a token

        // Save token to AsyncStorage for future use
        await AsyncStorage.setItem("authAdmin", authAdmin);

        // Navigate to the main screen
        navigation.navigate("Dashboard", { authAdmin: authAdmin });
      } else {
        Alert.alert(
          "Login Failed",
          data.message || "Invalid username or password"
        );
      }
    } catch (error) {
      console.error("Login error:", error);
      Alert.alert("Login Error", "Something went wrong. Please try again.");
    } finally {
      setLoading(false); // Hide loading indicator
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
          returnKeyType="next"
          onSubmitEditing={() => {
            // Focus the next input (password) when pressing enter
            this.passwordInput.focus();
          }}
        />
        <TextInput
          style={PageStyle.loginInput}
          placeholder="Password"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
          ref={(input) => {
            this.passwordInput = input;
          }} // Ref to control the input focus
          returnKeyType="done"
          onSubmitEditing={handleSubmit} // Call handleSubmit when the user presses Enter
        />
        {loading ? (
          <ActivityIndicator size="large" color="#0000ff" />
        ) : (
          <TouchableOpacity
            style={PageStyle.loginButton}
            onPress={handleSubmit}
          >
            <Text style={PageStyle.loginButtonText}>Login</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}
