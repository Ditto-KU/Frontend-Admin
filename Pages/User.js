import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import Head from "../components/Header";
import { PageStyle } from "../Style/PageStyle";

export default function User() {
  return (
    <View style={PageStyle.US_container}>
      <Head />
      {/* Buttons */}
      <View style={PageStyle.US_buttonContainer}>
        <TouchableOpacity style={PageStyle.US_button}>
          <Text style={PageStyle.US_buttonText}>Walker</Text>
        </TouchableOpacity>
        <TouchableOpacity style={PageStyle.US_button}>
          <Text style={PageStyle.US_buttonText}>Requester</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

