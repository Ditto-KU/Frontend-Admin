import React from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import Head from "../components/Header"; // Assuming you have a Header component

export default function UserList() {
  const navigation = useNavigation();
  const route = useRoute();

  // Get user list and type (walker or requester) from the previous screen
  const { users, userType } = route.params; // Destructure params from navigation

  // Function to handle pressing on a user item
  const handleUserPress = (user) => {
    navigation.navigate("UserDetail", { user, userType }); // Pass user and userType
  };

  // Function to render each user item in the list
  const renderItem = ({ item }) => (
    <TouchableOpacity onPress={() => handleUserPress(item)} style={styles.userItem}>
      <Text style={styles.userName}>{item.name}</Text>
      <Text style={styles.userTime}>Time: {item.time}</Text>
      <Text style={styles.userType}>{userType}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Head /> {/* Header component */}
      <Text style={styles.title}>{userType === 'requester' ? "Requester List" : "Walker List"}</Text>
      <FlatList
        data={users} // Users passed from previous screen
        renderItem={renderItem} // Function to render each user
        keyExtractor={(item) => item.id.toString()} // Unique key for each item
        contentContainerStyle={styles.userList}
      />
    </View>
  );
}

// Styles for the UserList screen
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#F5F5F5",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 16,
  },
  userList: {
    paddingVertical: 10,
  },
  userItem: {
    padding: 15,
    marginVertical: 8,
    backgroundColor: "#FFF",
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  userName: {
    fontSize: 18,
    fontWeight: "bold",
  },
  userTime: {
    fontSize: 14,
    color: "#555",
    marginTop: 5,
  },
  userType: {
    fontSize: 12,
    color: "#888",
    marginTop: 2,
  },
});
