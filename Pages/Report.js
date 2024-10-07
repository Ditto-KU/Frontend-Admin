import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  ActivityIndicator,
  ScrollView,
  Dimensions,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import Head from "../components/Header";
import FilterComponent from "../components/FilterComponent"; // Import the FilterComponent

export default function Report() {
  const authToken =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdXRoSWQiOiJhZG1pbjIiLCJpYXQiOjE3MjgxMjg1MDIsImV4cCI6MTczNjc2ODUwMn0.gqSAFiuUiAAnZHupDmJdlOqlKz2rqPxAbPVffcKt1Is";
  const navigation = useNavigation(); // Get navigation hook
  const [modalVisible, setModalVisible] = useState(false); // State for controlling filter modal visibility
  const [reportData, setReportData] = useState([]); // Combined list for reports
  const [filteredData, setFilteredData] = useState([]); // Filtered data based on search and filters
  const [loading, setLoading] = useState(true); // Loading state for API call
  const [searchText, setSearchText] = useState(""); // Search text state
  const [activeFilters, setActiveFilters] = useState({}); // State to store applied filters

  useEffect(() => {
    // Fetch report data from the API
    const fetchReportData = async () => {
      try {
        let headersList = {
          Accept: "*/*",
          Authorization: `Bearer ${authToken}`,        };

        let response = await fetch("https://ku-man-api.vimforlanie.com/admin/report", {
          method: "GET",
          headers: headersList,
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json(); // Parse the response to JSON
        setReportData(data); // Set the report data to the state
        setFilteredData(data); // Set filteredData initially
        setLoading(false); // Stop loading after fetching the data
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    fetchReportData(); // Fetch data on component mount
  }, []);

  // Function to navigate to report details
  const handleReportPress = (report) => {
    navigation.navigate("ReportDetails", { report});
  };

  // Function to toggle modal visibility
  const toggleModal = () => {
    setModalVisible(!modalVisible);
  };

  // Apply filters to the data
  const applyFilter = (filters) => {
    setActiveFilters(filters); // Set the active filters
    filterReports(searchText, filters); // Filter reports based on current searchText and filters
  };

  // Function to filter the reports based on search and active filters
  const filterReports = (text, filters) => {
    let filtered = reportData;

    // Apply search filter by title or description
    if (text) {
      filtered = filtered.filter(
        (item) =>
          item.title.toLowerCase().includes(text.toLowerCase()) ||
          item.description.toLowerCase().includes(text.toLowerCase())
      );
    }

    // Apply other filters (like status, requester, walker)
    if (filters && filters.status) {
      filtered = filtered.filter((item) => item.status === filters.status);
    }

    if (filters && filters.requesterId) {
      filtered = filtered.filter((item) => item.requesterId === filters.requesterId);
    }

    if (filters && filters.walkerId) {
      filtered = filtered.filter((item) => item.walkerId === filters.walkerId);
    }

    setFilteredData(filtered); // Set the filtered data to be displayed
  };

  // Search Functionality
  const handleSearch = (text) => {
    setSearchText(text); // Update the search input
    if (text === "") {
      setFilteredData(reportData); // If search is cleared, show all data
    } else {
      const filteredReports = reportData.filter((order) =>
        order.orderId.toString().includes(text)
      );
      setFilteredData(filteredReports);
  
      useEffect(() => {
        const fetchData = async () => {
          try {
            const headersList = {
              Accept: "*/*",
            };
    
            const response = await fetch(
              `https://ku-man-api.vimforlanie.com/admin/report/search?walkerId=${searchText}&requesterId=${searchText}&orderId=${searchText}`,
              {
                method: "GET",
                headers: headersList,
              }
            );
    
            if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
            }
    
            const contentType = response.headers.get("content-type");
            if (contentType && contentType.includes("application/json")) {
              const data = await response.json();
    
              setReportData(reportData); // Set order data
            } else {
              throw new Error(`Unexpected content-type: ${contentType}`);
            }
          } catch (error) {
            console.error("Error fetching data:", error);
            setError(error.message);
            Alert.alert("Error", error.message);
          } finally {
            setLoading(false);
          }
        };
    
        fetchData(); // Initial data fetch
      }, []);
    }
  };

  // Render each report item
  const renderItem = ({ item }) => (
    <TouchableOpacity onPress={() => handleReportPress(item)}>
      <View style={styles.RP_listItem}>
        <View style={{ flexDirection: "column" }}>
          <Text style={[styles.RP_listText, { fontWeight: "600" }]}>
            Order ID : {item.orderId}
          </Text>
          <Text style={styles.RP_listText}>Title: {item.title}</Text>
        </View>
        <Text style={styles.RP_listTime}>{new Date(item.reportDate).toLocaleString()}</Text>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Loading Reports...</Text>
      </View>
    );
  }

  return (
    <View style={styles.RP_container}>
      <Head />
      <View style={styles.RP_header}>
        <Text style={styles.RP_title}>Reports</Text>
        <View style={styles.RP_searchContainer}>
          <TextInput
            style={styles.RP_searchInput}
            placeholder="Search by Order ID"
            value={searchText}
            onChangeText={handleSearch}
          />
          <TouchableOpacity
            onPress={toggleModal}
            style={styles.RP_filterButton}
          >
            <Image
              source={require("../Image/FilterIcon.png")} // Adjust the path as necessary
              style={styles.RP_filterIcon}
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* Report List */}
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <FlatList
          data={filteredData}
          renderItem={renderItem}
          keyExtractor={(item) => item.reportId.toString()}
          contentContainerStyle={styles.RP_requesterList}
        />
      </ScrollView>

      {/* Include the FilterComponent and pass props */}
      <FilterComponent
        modalVisible={modalVisible}
        toggleModal={toggleModal}
        applyFilter={applyFilter}
      />
    </View>
  );
}

// Updated styles with RP_ prefix

const styles = StyleSheet.create({
  RP_container: {
    flex: 1,
    padding: 16,
    flexDirection: "column",
    justifyContent: "flex-start",
    backgroundColor: "#F5F5F5",
  },
  RP_header: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
    width: "100%",
    alignSelf: "center",
  },
  RP_title: {
    fontSize: 30,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  RP_searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "80%",
    paddingHorizontal: 16,
  },
  RP_searchInput: {
    flex: 1,
    height: 40,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#ccc",
    paddingHorizontal: 8,
    borderRadius: 16,
    backgroundColor: "#FFFFFF",
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  RP_requesterList: {
    maxHeight: (Dimensions.get('screen').height)*0.8, // Set max height for scrollable area
    flex: 1, 
    paddingBottom: 20,
  },
  RP_filterButton: {
    marginLeft: 10,
    padding: 5,
    borderRadius: 5,
    backgroundColor: "#EFEFEF",
  },
  RP_filterIcon: {
    width: 30,
    height: 30,
    resizeMode: "cover",
  },
  RP_listItem: {
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
  RP_listText: {
    fontSize: 16,
    marginBottom: 5,
  },
  RP_listTime: {
    fontSize: 14,
    color: "#777",
    alignSelf: "center",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
