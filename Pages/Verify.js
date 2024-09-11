import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { PageStyle } from "../Style/PageStyle";
import Head from "../components/Header";

export default function Verify() {
  return (
    <View style={PageStyle.VE_container}>
      <Head />
      {/* Buttons */}
      <View style={PageStyle.VE_buttonContainer}>
        <TouchableOpacity style={PageStyle.VE_button}>
          <Text style={PageStyle.VE_buttonText}>Walker User</Text>
        </TouchableOpacity>
        <TouchableOpacity style={PageStyle.VE_button}>
          <Text style={PageStyle.VE_buttonText}>New Request</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
