import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native"; // Import navigation hook
import Head from "../components/Header";
import { PageStyle } from "../Style/PageStyle";

export default function User() {
  const navigation = useNavigation(); // Initialize navigation

  // Sample data for walkers and requesters
  const walkers = [
    { id: 1, name: "Walker John Doe", time: "10:00 AM" },
    { id: 2, name: "Walker Jane Smith", time: "11:00 AM" },
  ];

  const requesters = [
    { id: 1, name: "Requester Alice", time: "9:00 AM" },
    { id: 2, name: "Requester Bob", time: "10:30 AM" },
  ];

  // Navigate to UserList page with walker data
  const handleWalkerPress = () => {
    navigation.navigate("UserList", {
      users: walkers,  // Passing walker data
      userType: "walker", // Pass user type as 'Walker'
    });
  };

  // Navigate to UserList page with requester data
  const handleRequesterPress = () => {
    navigation.navigate("UserList", {
      users: requesters,  // Passing requester data
      userType: "requester", // Pass user type as 'Requester'
    });
  };

  return (
    <View style={PageStyle.US_container}>
      <Head />
      {/* Buttons */}
      <View style={PageStyle.US_innerContainer}>
        <Text style={PageStyle.US_title}>KU-MAN User</Text>
        <View style={PageStyle.US_buttonContainer}>
          <TouchableOpacity style={PageStyle.US_button} onPress={handleWalkerPress}>
            <Text style={PageStyle.US_buttonText}>Walker</Text>
          </TouchableOpacity>
          <TouchableOpacity style={PageStyle.US_button} onPress={handleRequesterPress}>
            <Text style={PageStyle.US_buttonText}>Requester</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
