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
import FilterCS from "../components/FilterCS";

export default function ContactSupport() {
  const route = useRoute();
  const navigation = useNavigation();
  const [modalVisible, setModalVisible] = useState(false);
  const [activeFilters, setActiveFilters] = useState(null); // Applied filters
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [supportRequests, setSupportRequests] = useState([]); // Original data from API
  const [filteredRequests, setFilteredRequests] = useState([]); // Filtered data to display
  const [searchQuery, setSearchQuery] = useState(""); // Search input state
  const [authAdmin, setAuthAdmin] = useState(""); // Authentication token

  useEffect(() => {
    const fetchAuthToken = async () => {
      const token = await AsyncStorage.getItem("authAdmin");
      setAuthAdmin(token);
      if (token) {
        fetchSupportRequests(token); // Fetch support requests using token
      } else {
        Alert.alert("Error", "Authentication token not found.");
      }
    };
    fetchAuthToken();
  }, []);

  // Fetch data from API
  const fetchSupportRequests = async (token) => {
    try {
      const headers = {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      };

      const response = await fetch("https://ku-man-api.vimforlanie.com/admin/chat", {
        method: "GET",
        headers: headers,
      });

      if (!response.ok) throw new Error(`Error fetching data: ${response.status}`);

      const data = await response.json();
      const combinedRequests = [
        ...(Array.isArray(data.requester) ? data.requester.map((req) => ({
          ...req,
          targetRole: "requester",
          userId: req.requesterId,
        })) : []),
        ...(Array.isArray(data.walker) ? data.walker.map((req) => ({
          ...req,
          targetRole: "walker",
          userId: req.walkerId,
        })) : []),
      ];

      setSupportRequests(combinedRequests);
      setFilteredRequests(combinedRequests); // Initialize filtered requests
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  // Handle search input change
  const handleSearch = (text) => {
    setSearchQuery(text);
    applyFilter(activeFilters, text); // Apply filters with updated search text
  };
  
  // Toggle modal visibility
  const toggleModal = () => {
    setModalVisible(!modalVisible);
  };
  
  // Navigate to ContactSupportDetail screen
  const handleCSPress = (orderId, userId, targetRole) => {
    navigation.navigate("ContactSupportDetail", { orderId, userId, targetRole });
  };

// Apply filters to the data
const applyFilter = (filters) => {
  console.log("Applying filters:", filters); // Debugging statement
  setActiveFilters(filters); // Set the active filters
  filterReports(filters, searchQuery); // Filter reports based on current searchText and filters
};
const filterReports = (filters, query) => {
  let filtered = supportRequests;
  console.log("Filters:", filters); // Debugging statement

  // Apply search filter (partial match)
  if (query) {
    filtered = filtered.filter(
      (item) =>
        item.orderId.toString().includes(query.trim()) ||
        (item.walkerId && item.walkerId.toString().includes(query.trim())) ||
        (item.requesterId && item.requesterId.toString().includes(query.trim()))
    );
  }

  // Apply role filter based on `walker` or `requester` selection
  if (filters && filters.role) {
    const { walker, requester } = filters.role;
    if (walker && !requester) {
      filtered = filtered.filter((item) => item.targetRole === "walker");
    } else if (requester && !walker) {
      filtered = filtered.filter((item) => item.targetRole === "requester");
    }
  }

  console.log("Filtered Requests:", filtered); // Debugging statement
  setFilteredRequests(filtered); // Update filtered requests to display
};

const renderItem = ({ item }) => {
  const isCompletedOrCancelled = item.orderStatus === "completed" || item.orderStatus === "cancelled";
  
  // Determine user ID based on role
  const user = item.targetRole === "requester" ? "requester" : "walker";
  const userId = item.targetRole === "requester" ? item.requesterId : item.walkerId;

  return (
    <TouchableOpacity
      onPress={() => handleCSPress(item.orderId, userId, item.targetRole)}
      style={[styles.CS_listItem, isCompletedOrCancelled && styles.fadedButton]}
    >
      <View>
        <Text style={[styles.CS_listText, { fontWeight: "600" }]}>
          Order ID: {item.orderId} {user} ID: {userId}
        </Text>
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
            onChangeText={handleSearch}
          />
          <TouchableOpacity onPress={toggleModal} style={styles.CS_filterButton}>
            <Image source={require("../Image/FilterIcon.png")} style={styles.CS_filterIcon} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <FlatList
          data={filteredRequests}
          renderItem={renderItem}
          keyExtractor={(item) => item.orderId.toString()}
          contentContainerStyle={styles.CS_requesterList}
        />
      </ScrollView>

      <FilterCS
        modalVisible={modalVisible}
        toggleModal={toggleModal}
        applyFilter={applyFilter}
      />
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
