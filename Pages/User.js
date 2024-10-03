import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  TextInput,
} from "react-native";
import { useNavigation } from "@react-navigation/native"; // Import navigation hook
import { PageStyle } from "../Style/PageStyle";
import Head from "../components/Header";

export default function User() {
  const navigation = useNavigation(); // Initialize navigation

  // State for walkers, requesters, loading state, and error handling
  const [walkers, setWalkers] = useState([]);
  const [requesters, setRequesters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Separate search states for walkers and requesters
  const [walkerSearchText, setWalkerSearchText] = useState("");
  const [requesterSearchText, setRequesterSearchText] = useState("");

  // Fetch data for walkers and requesters
  useEffect(() => {
    const fetchWalkersAndRequesters = async () => {
      try {
        let headersList = {
          Accept: "*/*",
        };

        // Fetch walkers
        let walkerResponse = await fetch("https://ku-man-api.vimforlanie.com/admin/walker", {
          method: "GET",
          headers: headersList,
        });
        if (!walkerResponse.ok) {
          throw new Error(`Error fetching walkers: ${walkerResponse.status}`);
        }
        let walkersData = await walkerResponse.json();
        setWalkers(walkersData);

        // Fetch requesters
        let requesterResponse = await fetch("https://ku-man-api.vimforlanie.com/admin/requester", {
          method: "GET",
          headers: headersList,
        });
        if (!requesterResponse.ok) {
          throw new Error(`Error fetching requesters: ${requesterResponse.status}`);
        }
        let requestersData = await requesterResponse.json();
        setRequesters(requestersData);
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchWalkersAndRequesters();
  }, []);

  if (loading) {
    return (
      <View style={PageStyle.US_loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Loading data...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={PageStyle.US_loadingContainer}>
        <Text style={PageStyle.errorText}>Error: {error}</Text>
      </View>
    );
  }

  // Search handlers for walkers and requesters
  const handleWalkerSearch = (text) => {
    setWalkerSearchText(text);
  };

  const handleRequesterSearch = (text) => {
    setRequesterSearchText(text);
  };

  // Filtered data for walkers and requesters based on search text
  const filteredWalkers = walkers.filter((walker) =>
    walker.username.toLowerCase().includes(walkerSearchText.toLowerCase())
  );

  const filteredRequesters = requesters.filter((requester) =>
    requester.username.toLowerCase().includes(requesterSearchText.toLowerCase())
  );

  // Render individual user items and navigate to user detail on press
  const renderUserItem = (item, userType) => (
    <TouchableOpacity
      style={styles.userItem}
      onPress={() => navigation.navigate("UserDetail", { user: item, userType })}
    >
      <Text style={styles.userName}>{item.username}</Text>
      <Text>User ID: {userType === "walker" ? item.walkerId : item.requesterId}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={PageStyle.US_container}>
      <Head />
      <Text style={PageStyle.US_title}>KU-MAN User</Text>

      {/* Container for both walker and requester lists */}
      <View style={styles.listContainer}>
        {/* Walkers Column */}
        <View style={styles.listColumn}>
          <Text style={styles.columnTitle}>Walkers</Text>

          {/* Walker Search Bar */}
          <View style={styles.searchContainer}>
            <TextInput
              style={styles.searchInput}
              placeholder="Search Walkers"
              value={walkerSearchText}
              onChangeText={handleWalkerSearch} // Search for walkers
            />
          </View>

          {/* Walker List */}
          <FlatList
            data={filteredWalkers}
            renderItem={({ item }) => renderUserItem(item, "walker")}
            keyExtractor={(item) => item.walkerId.toString()}
          />
        </View>

        {/* Requesters Column */}
        <View style={styles.listColumn}>
          <Text style={styles.columnTitle}>Requesters</Text>

          {/* Requester Search Bar */}
          <View style={styles.searchContainer}>
            <TextInput
              style={styles.searchInput}
              placeholder="Search Requesters"
              value={requesterSearchText}
              onChangeText={handleRequesterSearch} // Search for requesters
            />
          </View>

          {/* Requester List */}
          <FlatList
            data={filteredRequesters}
            renderItem={({ item }) => renderUserItem(item, "requester")}
            keyExtractor={(item) => item.requesterId.toString()}
          />
        </View>
      </View>
    </View>
  );
}

// Styles for the User component and lists
const styles = StyleSheet.create({
  listContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 10,
  },
  listColumn: {
    flex: 1,
    marginHorizontal: 10,
  },
  columnTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  searchContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 10,
  },
  searchInput: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderColor: "#ccc",
    paddingHorizontal: 8,
    borderRadius: 16,
    backgroundColor: "#FFFFFF",
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
});
