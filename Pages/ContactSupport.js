import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Image,
  ActivityIndicator,
  ScrollView,
  Dimensions,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import Head from "../components/Header";
import { useRoute } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function ContactSupport({ authAdmin }) {
  const route = useRoute();
  const navigation = useNavigation();
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [supportRequests, setSupportRequests] = useState([]);
  const [filteredRequests, setFilteredRequests] = useState([]); // State for filtered requests
  const [searchQuery, setSearchQuery] = useState(""); // State for search input
  const [filterStatus, setFilterStatus] = useState("all"); // State for filter by status

  // Fetch data from API
  useEffect(() => {
    const fetchSupportRequests = async () => {
      try {
        let headersList = {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${authAdmin}`,
        };

        let response = await fetch("https://ku-man-api.vimforlanie.com/admin/chat", {
          method: "GET",
          headers: headersList,
        });

        if (!response.ok) {
          throw new Error(`Error fetching data: ${response.status}`);
        }

        let data = await response.json();
        console.log("API Response:", data);

        // Combine requester and walker data into one array for easier mapping
        const combinedRequests = [
          ...(Array.isArray(data.requester) ? data.requester.map((req) => ({
            ...req,
            targetRole: "requester",  // Indicate that this is a requester
            userId: req.requesterId,
          })) : []),
          ...(Array.isArray(data.walker) ? data.walker.map((req) => ({
            ...req,
            targetRole: "walker",  // Indicate that this is a walker
            userId: req.walkerId,
          })) : [])
        ];
        setSupportRequests(combinedRequests);
        setFilteredRequests(combinedRequests); // Initialize filtered requests
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchSupportRequests();
  }, [authAdmin]);

  // Handle search input change
  const handleSearch = (text) => {
    setSearchQuery(text);
    filterRequests(text, filterStatus);
  };

  // Filter requests based on search and status
  const filterRequests = (query, status) => {
    let filtered = supportRequests;

    // Filter by orderId if there's a search query
    if (query) {
      filtered = filtered.filter((item) =>
        item.orderId.toString().includes(query)
      );
    }

    // Filter by status if a filter is applied
    if (status !== "all") {
      filtered = filtered.filter((item) => item.orderStatus === status);
    }

    setFilteredRequests(filtered);
  };

  // Sort the filtered requests by status
  const sortedRequests = [...filteredRequests].sort((a, b) => {
    const statusOrder = {
      inProgress: 1,
      lookingForWalker: 2,
      completed: 3,
      cancelled: 4,
    };

    return statusOrder[a.orderStatus] - statusOrder[b.orderStatus];
  });

  // Navigate to ContactSupportDetail with the orderId, userId, and role
  const handleCSPress = (orderId, userId, targetRole) => {
    navigation.navigate("ContactSupportDetail", { orderId, userId, targetRole });
  };

  const toggleModal = () => {
    setModalVisible(!modalVisible);
  };

  const renderItem = ({ item }) => {
    // Determine if the item is "completed" or "cancelled" to fade the button
    const isCompletedOrCancelled = item.orderStatus === "completed" || item.orderStatus === "cancelled";

    // Determine the correct ID to display based on the targetRole
    const user = item.targetRole === "requester" ? "requester" : "walker";
    const userId = item.targetRole === "requester" ? item.requesterId : item.walkerId;

    return (
      <TouchableOpacity
        onPress={() => handleCSPress(item.orderId, userId, item.targetRole)}  // Pass userId depending on role
        style={[styles.CS_listItem, isCompletedOrCancelled && styles.fadedButton]} // Apply faded style
      >
        <View>
          <Text style={[styles.CS_listText, { fontWeight: "600" }]}>
            Order ID: {item.orderId}  {user} ID: {userId}
          </Text>
          {/* <Text style={styles.CS_listText}>{user} ID: {userId}</Text> Display the correct ID */}
          <Text style={styles.CS_listText}>Status: {item.orderStatus}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  // If data is still loading
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Loading support requests...</Text>
      </View>
    );
  }

  // If there is an error
  if (error) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.errorText}>Error: {error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.CS_container}>
      <Head />
      <View style={styles.CS_header}>
        <Text style={styles.CS_title}>Contact Support</Text>
        <View style={styles.CS_searchContainer}>
          <TextInput
            style={styles.CS_searchInput}
            placeholder="Search by Order ID"
            value={searchQuery}
            onChangeText={handleSearch} // Handle search input change
          />
          <TouchableOpacity
            onPress={toggleModal}
            style={styles.CS_filterButton}
          >
            <Image
              source={require("../Image/FilterIcon.png")}
              style={styles.CS_filterIcon}
            />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <FlatList
          data={sortedRequests} // Display sorted requests
          renderItem={renderItem}
          keyExtractor={(item) => item.orderId.toString()}
          contentContainerStyle={styles.CS_requesterList}
        />
      </ScrollView>

      {/* FilterComponent */}
    </View>
  );
}

// Styles for ContactSupport
const styles = StyleSheet.create({
  CS_container: {
    flex: 1,
    padding: 16,
    flexDirection: "column",
    justifyContent: "flex-start",
    backgroundColor: "#F5F5F5",
  },
  CS_header: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
    width: "100%",
    alignSelf: "center",
  },
  CS_title: {
    fontSize: 30,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  CS_searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "80%",
    paddingHorizontal: 16,
  },
  CS_searchInput: {
    flex: 1,
    height: 40,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#ccc",
    paddingHorizontal: 8,
    borderRadius: 16,
    backgroundColor: "#FFFFFF",
  },
  CS_content: {
    flexDirection: "column",
    padding: 10,
  },
  CS_listItem: {
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
  fadedButton: {
    opacity: 0.5, // Reduce opacity to make button faded
  },
  CS_filterButton: {
    marginLeft: 10,
    padding: 5,
    borderRadius: 5,
    backgroundColor: "#EFEFEF",
  },
  CS_filterIcon: {
    width: 30,
    height: 30,
    resizeMode: "cover",
  },
  CS_listText: {
    fontSize: 22,
    marginVertical: 10,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  CS_requesterList: {
    maxHeight: (Dimensions.get('screen').height) * 0.8, // Set max height for scrollable area
    paddingBottom: 20,
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    color: "red",
    fontSize: 18,
  },
});
