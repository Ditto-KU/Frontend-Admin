import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Image,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import Head from "../components/Header"; // Assuming you have a Header component

export default function UserList() {
  const navigation = useNavigation();
  const route = useRoute();

  // Get user list and type (walker or requester) from the previous screen
  const { users, userType } = route.params;

  // State for search text and filtered data
  const [searchText, setSearchText] = useState("");
  const [filteredUsers, setFilteredUsers] = useState(users); // Initially, display all users

  // Function to handle pressing on a user item
  const handleUserPress = (user) => {
    navigation.navigate("UserDetail", { user, userType }); // Pass user and userType
  };

  // Function to handle search and filter data based on search input
  const handleSearch = (text) => {
    setSearchText(text); // Update the search text
    if (text === "") {
      setFilteredUsers(users); // If search is empty, show all users
    } else {
      const filtered = users.filter((user) =>
        user.username.toLowerCase().includes(text.toLowerCase())
      );
      setFilteredUsers(filtered); // Set filtered users
    }
  };

  // Function to render each user item in the list
  const renderItem = ({ item }) => (
    <TouchableOpacity onPress={() => handleUserPress(item)} style={styles.userItem}>
      <Text style={styles.userName}>{item.username}</Text>
      <Text>User: {userType === "walker" ? item.walkerId : item.requesterId}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Head /> {/* Header component */}
      <Text style={styles.title}>
        {userType === "requester" ? "Requester List" : "Walker List"}
      </Text>

      {/* Search bar */}
      <View style={styles.OR_searchContainer}>
        <TextInput
          style={styles.OR_searchInput}
          placeholder="Search by Username"
          value={searchText}
          onChangeText={handleSearch} // Call the search function when text changes
        />
        <TouchableOpacity style={styles.OR_filterButton}>
          <Image
            source={require("../Image/FilterIcon.png")} // Placeholder for filter icon
            style={styles.OR_filterIcon}
          />
        </TouchableOpacity>
      </View>

      {/* User List */}
      <FlatList
        data={filteredUsers} // Use the filtered data instead of the original users list
        renderItem={renderItem}
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
  OR_searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  OR_searchInput: {
    flex: 1,
    height: 40,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#ccc",
    paddingHorizontal: 8,
    borderRadius: 16,
    backgroundColor: "#FFFFFF",
  },
  OR_filterButton: {
    marginLeft: 10,
    padding: 5,
    borderRadius: 5,
    backgroundColor: "#EFEFEF",
  },
  OR_filterIcon: {
    width: 30,
    height: 30,
    resizeMode: "cover",
  },
});
