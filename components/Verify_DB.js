import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

export default function Verify_DB() {
  const verify_user = [
    { username: "yyyyy", time: "9:42" },
    { username: "yyyyy", time: "9:41" },
    { username: "yyyyy", time: "9:38" },
    { username: "yyyyy", time: "9:38" },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Verify new walker</Text>
      {verify_user.map((user, index) => (
        <TouchableOpacity key={index} style={styles.reportContainer}>
          <Text style={styles.reportText}>user: {user.username}</Text>
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
    width: "50%",

    shadowColor: '#000',
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
  },
  reportText: {
    fontSize: 16,
  },
  reportTime: {
    fontSize: 14,
    color: "#000",
  },
});
