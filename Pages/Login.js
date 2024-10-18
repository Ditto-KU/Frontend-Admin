import React, { useState } from "react";
import {
  View, Text, TextInput, TouchableOpacity, ActivityIndicator,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { PageStyle } from "../Style/PageStyle";

export default function Login({ setAuthAdmin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(""); // Add error message state
  const navigation = useNavigation();

  const handleSubmit = async () => {
    setErrorMessage(""); // Clear previous error messages

    if (username === "" || password === "") {
      setErrorMessage("Please enter both username and password."); // Set error message
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

      if (response.status === 401 || response.status === 403) {
        setErrorMessage("Invalid username or password. Please try again.");
        setLoading(false);
        return;
      }

      if (!response.ok) {
        setErrorMessage(`Login failed. Error: ${response.status}`);
        setLoading(false);
        return;
      }

      const data = await response.json();
      const authAdmin = data.token;

      // Save the token in AsyncStorage
      await AsyncStorage.setItem("authAdmin", authAdmin);
      setAuthAdmin(authAdmin); // Update App state with token

      // Navigate to the dashboard
      navigation.navigate("ParentNavigator", { screen: "Dashboard" });

    } catch (error) {
      console.error("Login error:", error);
      setErrorMessage("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={PageStyle.loginBg}>
      <Text style={PageStyle.loginHeaderText}>KU-Man Admin</Text>
      <View style={PageStyle.loginContainer}>
        <Text style={PageStyle.loginHeader}>Login</Text>
        <TextInput
          style={PageStyle.loginInput}
          placeholder="Username"
          value={username}
          onChangeText={setUsername}
          autoCapitalize="none"
          returnKeyType="next" // Move to the next field on 'Enter'
          onSubmitEditing={() => {
            // Focus the password input when 'Enter' is pressed
            this.passwordInput.focus();
          }}
        />
        <TextInput
          style={PageStyle.loginInput}
          placeholder="Password"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
          returnKeyType="done" // Indicates submission is expected
          onSubmitEditing={handleSubmit} // Submit the form when 'Enter' is pressed
          ref={(input) => { this.passwordInput = input; }} // Reference to focus this input
        />

        {/* Conditionally render the error message */}
        {errorMessage !== "" && (
          <Text style={PageStyle.loginErrorText}>Invalid username or password</Text> // Add error text style
        )}

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
