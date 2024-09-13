import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";

export default function Verify_DB() {
  const navigation = useNavigation();

  // Initialize user data with useState
  const [verifyUser, setVerifyUser] = useState([
    { userid: 1, username: "Walker User 1", time: "9:42" },
    { userid: 2, username: "Walker User 2", time: "9:41" },
    { userid: 3, username: "Walker User 3", time: "9:38" },
    { userid: 4, username: "Walker User 4", time: "9:38" },
  ]);

  // Navigate to VerifyDetail and pass the selected user's id
  const gotoVerifydetail = (user) => {
    navigation.navigate("VerifyDetail", { user });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Verify new walker</Text>
      {/* Loop through the user data */}
      {verifyUser.map((user, index) => (
        <TouchableOpacity
          key={index}
          style={styles.reportContainer}
          onPress={() => gotoVerifydetail(user)} // Pass the user's ID to the function
        >
          <Text style={styles.reportText}>user: {user.userid} : {user.username}</Text>
          <Text style={styles.reportTime}>{user.time}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#fafbfc",
    borderRadius: 10,
    width: "100%", // Set to full width for better presentation
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  header: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 20,
  },
  reportContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 15,
    marginBottom: 10,
    backgroundColor: "#FFF",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    width: "48%",
  },
  reportText: {
    fontSize: 16,
  },
  reportTime: {
    fontSize: 14,
    color: "#000",
  },
});
