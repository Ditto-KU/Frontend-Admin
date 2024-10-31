import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { PageStyle } from "../Style/PageStyle";

export default function Login({ setAuthAdmin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const navigation = useNavigation();

  const handleSubmit = async () => {
    setErrorMessage("");

    if (username === "" || password === "") {
      setErrorMessage("Please enter both username and password.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("https://ku-man-api.vimforlanie.com/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (response.status === 401 || response.status === 403) {
        setErrorMessage("Invalid username or password.");
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

      await AsyncStorage.setItem("authAdmin", authAdmin);
      setAuthAdmin(authAdmin);

      navigation.reset({
        index: 0,
        routes: [{ name: "Dashboard" }],
      });

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
          returnKeyType="next"
          onSubmitEditing={() => this.passwordInput.focus()}
        />
        <TextInput
          style={PageStyle.loginInput}
          placeholder="Password"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
          returnKeyType="done"
          onSubmitEditing={handleSubmit}
          ref={(input) => { this.passwordInput = input; }}
        />

        {errorMessage !== "" && (
          <Text style={PageStyle.loginErrorText}>{errorMessage}</Text>
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
