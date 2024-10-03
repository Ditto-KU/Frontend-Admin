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
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import Head from "../components/Header";
import FilterComponent from "../components/FilterComponent";

export default function ContactSupport() {
  const navigation = useNavigation();
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [supportRequests, setSupportRequests] = useState([]);
  const [filteredRequests, setFilteredRequests] = useState([]); // State for filtered requests
  const [searchQuery, setSearchQuery] = useState(""); // State for search input

  // Fetch data from API
  useEffect(() => {
    const fetchSupportRequests = async () => {
      try {
        let headersList = {
          "Content-Type": "application/json",
          Accept: "application/json",
        };

        let response = await fetch("https://ku-man-api.vimforlanie.com/admin/chat", {
          method: "GET",
          headers: headersList,
        });

        if (!response.ok) {
          throw new Error(`Error fetching data: ${response.status}`);
        }

        let data = await response.json(); // Get the orderId data from the API
        setSupportRequests(data); // Set the fetched data (array of { orderId })
        setFilteredRequests(data); // Set the initial filtered data to be all data
        setLoading(false); // Set loading to false when data is loaded
      } catch (err) {
        setError(err.message); // Set error if fetch fails
        setLoading(false);
      }
    };

    fetchSupportRequests();
  }, []);

  // Function to filter support requests by search query (orderId)
  const handleSearch = (query) => {
    setSearchQuery(query); // Set the search query state
    if (query === "") {
      setFilteredRequests(supportRequests); // Show all if query is empty
    } else {
      const filteredData = supportRequests.filter((item) =>
        item.orderId.toString().includes(query) // Ensure both are compared as strings
      );
      setFilteredRequests(filteredData); // Update the filtered data
    }
  };

  // This function will navigate to the ContactSupportDetail page and pass the orderId.
  const handleCSPress = (orderId) => {
    navigation.navigate("ContactSupportDetail", { orderId });
  };

  const toggleModal = () => {
    setModalVisible(!modalVisible);
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity onPress={() => handleCSPress(item.orderId)}>
      <View style={styles.CS_listItem}>
        <Text style={[styles.CS_listText, { fontWeight: "600" }]}>
          Order ID: {item.orderId}
        </Text>
      </View>
    </TouchableOpacity>
  );

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

      <View style={styles.CS_content}>
        <FlatList
          data={filteredRequests} // Display filtered requests
          renderItem={renderItem}
          keyExtractor={(item) => item.orderId.toString()}
          contentContainerStyle={styles.CS_requesterList}
        />
      </View>

      <FilterComponent modalVisible={modalVisible} toggleModal={toggleModal} />
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
    width: "30%",
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
  CS_requesterList: {
    paddingBottom: 20,
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
