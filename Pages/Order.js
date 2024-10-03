import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  ActivityIndicator,
  Alert,
  FlatList,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import Header from "../components/Header";
import FilterOrder from "../components/FilterOrder";

export default function Order() {
  const navigation = useNavigation();
  const [orderData, setOrderData] = useState([]); // Store orders
  const [filteredData, setFilteredData] = useState([]); // Filtered data for search and filter
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state
  const [searchText, setSearchText] = useState(""); // State for search input
  const [modalVisible, setModalVisible] = useState(false); // Filter modal

  const gotoOrderDetail = (order) => {
    navigation.navigate("OrderDetail", { order: order });
  };

  const toggleModal = () => {
    setModalVisible(!modalVisible);
  };

  // Fetch order data from the API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const headersList = {
          Accept: "*/*",
        };

        const response = await fetch(
          "https://ku-man-api.vimforlanie.com/admin/order",
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

          const sortedData = data.sort((a, b) => {
            const statusOrder = {
              waitingAdmin: 1,
              inProgress: 2,
              lookingForWalker: 3,
              completed: 4,
              cancelled: 5,
            };
            return statusOrder[a.orderStatus] - statusOrder[b.orderStatus];
          });
          setOrderData(sortedData); // Set order data
          setFilteredData(sortedData); // Set filtered data to show initially
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

  // Update the data after filtering
  const applyFilter = (filteredOrders) => {
    setFilteredData(filteredOrders);
  };

  // Search Functionality
  const handleSearch = (text) => {
    setSearchText(text); // Update the search input
    if (text === "") {
      setFilteredData(orderData); // If search is cleared, show all data
    } else {
      const filteredOrders = orderData.filter((order) =>
        order.orderId.toString().includes(text)
      );
      setFilteredData(filteredOrders);
      
      useEffect(() => {
        const fetchData = async () => {
          try {
            const headersList = {
              Accept: "*/*",
            };
    
            const response = await fetch(
              `https://ku-man-api.vimforlanie.com/admin/order/search?walkerId=${searchText}&requesterId=${searchText}&orderId=${searchText}`,
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
    
              const sortedData = data.sort((a, b) => {
                const statusOrder = {
                  waitingAdmin: 1,
                  inProgress: 2,
                  lookingForWalker: 3,
                  completed: 4,
                  cancelled: 5,
                };
                return statusOrder[a.orderStatus] - statusOrder[b.orderStatus];
              });
              setOrderData(sortedData); // Set order data
              setFilteredData(sortedData); // Set filtered data to show initially
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

  // Loading state
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Loading Orders...</Text>
      </View>
    );
  }

  // Error state
  if (error) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Error: {error}</Text>
      </View>
    );
  }

  if (filteredData.length === 0) {
    return (
      <View style={styles.loadingContainer}>
        <Text>No orders available</Text>
      </View>
    );
  }

  // Function to set background color based on order status
  const getBackgroundColor = (status) => {
    switch (status) {
      case "inProgress":
        return "rgb(255, 240, 186)"; // Softer Yellow
      case "completed":
        return "rgb(144, 238, 144)"; // Softer Green
      case "cancelled":
        return "rgb(255, 182, 193)"; // Softer Pink
      case "lookingForWalker":
        return "rgb(211, 211, 211)"; // Softer Gray
      case "waitingAdmin":
        return "rgb(255, 222, 173)"; // Softer Peach
      default:
        return "#FFF";
    }
  };

  // Render each item for FlatList
  const renderOrderItem = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.orderContainer,
        { backgroundColor: getBackgroundColor(item.orderStatus) },
      ]}
      onPress={() => gotoOrderDetail(item)}
    >
      <Text style={[styles.orderText, { fontWeight: "600" }]}>
        Order ID: {item.orderId}
      </Text>
      <Text style={styles.orderText}>{item.orderStatus}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.OR_container}>
      <Header />
      <View style={styles.OR_header}>
        <Text style={styles.OR_title}>Order List</Text>
        <View style={styles.OR_searchContainer}>
          <TextInput
            style={styles.OR_searchInput}
            placeholder="Search by Order ID"
            value={searchText}
            onChangeText={handleSearch} // Call the search function when text changes
          />
          <TouchableOpacity
            onPress={toggleModal} // Toggle filter modal
            style={styles.OR_filterButton}
          >
            <Image
              source={require("../Image/FilterIcon.png")} // Placeholder for filter icon
              style={styles.OR_filterIcon}
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* Order List using FlatList */}
      <FlatList
        data={filteredData}
        keyExtractor={(item) => item.orderId.toString()}
        renderItem={renderOrderItem}
        contentContainerStyle={styles.orderList}
      />

      {/* Pass applyFilter to FilterOrder */}
      <FilterOrder
        modalVisible={modalVisible}
        toggleModal={toggleModal}
        applyFilter={applyFilter}
      />
    </View>
  );
}

// Styles for the Order component
const styles = StyleSheet.create({
  OR_container: {
    flex: 1,  // Ensure the container takes the full available space
    padding: 16,
    flexDirection: "column",
    justifyContent: "flex-start",
    backgroundColor: "#F5F5F5",
  },
  OR_header: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
    width: "100%", // Make sure it stretches across the entire screen width
    alignSelf: "center",
  },
  OR_title: {
    fontSize: 30,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  OR_searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "80%",
    paddingHorizontal: 16,
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
  orderList: {
    paddingBottom: 10, // Padding for the list
    flexGrow: 1, // Allow the list to grow and scroll properly
  },
  orderContainer: {
    padding: 15,
    marginBottom: 10,
    borderRadius: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  orderText: {
    fontSize: 20,
    marginBottom: 5,
    color: "#333", // Darker text color for better contrast with softer background
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
