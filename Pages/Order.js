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
  ScrollView,
  Dimensions,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import Header from "../components/Header";
import FilterOrder from "../components/FilterOrder";

export default function Order() {
  const navigation = useNavigation();
  const [orderData, setOrderData] = useState([]); // Store all orders
  const [filteredData, setFilteredData] = useState([]); // Filtered orders
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state
  const [searchText, setSearchText] = useState(""); // State for search input
  const [modalVisible, setModalVisible] = useState(false); // Filter modal visibility
  const [OrderAmount, setOrderAmount] = useState(); // State for total order amount
  const authToken =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdXRoSWQiOiJhZG1pbjIiLCJpYXQiOjE3MjgxMjg1MDIsImV4cCI6MTczNjc2ODUwMn0.gqSAFiuUiAAnZHupDmJdlOqlKz2rqPxAbPVffcKt1Is";

  // Function to navigate to order details page, only passing the orderId
  const gotoOrderDetail = (orderID) => {
    navigation.navigate("OrderDetail", { orderID });
  };

  // Toggle Filter Modal
  const toggleModal = () => {
    setModalVisible(!modalVisible);
  };

  // Apply filter function outside useEffect
  const applyFilter = (filterData) => {
    console.log("Data before filter:", orderData);
    console.log("Filter data:", filterData);
    if (filterData) {
      let filteredOrders = orderData;

      // Filter by canteen name
      if (filterData.canteen) {
        filteredOrders = filteredOrders.filter(
          (order) =>
            order.canteen &&
            order.canteen.name.trim() === filterData.canteen.trim()
        );
        console.log("Filtered by canteen:", filteredOrders);
      }

      // Filter by restaurant name
      if (filterData.restaurant) {
        filteredOrders = filteredOrders.filter(
          (order) =>
            order.orderItem &&
            order.orderItem.some(
              (item) =>
                item.shop && item.shop.shopName === filterData.restaurant
            )
        );
        console.log("Filtered by restaurant:", filteredOrders);
      }

      // Filter by order status
      const activeStatusFilters = Object.keys(filterData.statusFilter).filter(
        (status) => filterData.statusFilter[status]
      );

      if (activeStatusFilters.length > 0) {
        filteredOrders = filteredOrders.filter((order) =>
          activeStatusFilters.includes(order.orderStatus)
        );
      }

      // Set filtered data to the filtered results
      setFilteredData(filteredOrders);
    } else {
      setFilteredData(orderData); // No filter applied, show all data
    }
  };

  // Fetch order data from the API inside useEffect
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true); // Show loading indicator
        const headersList = {
          Accept: "*/*",
          Authorization: `Bearer ${authToken}`,
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

          setOrderAmount(sortedData.length); // Set total order amount
          setOrderData(sortedData); // Set full order data
          setFilteredData(sortedData); // Show all data initially
        } else {
          throw new Error(`Unexpected content-type: ${contentType}`);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setError(error.message);
        Alert.alert("Error", error.message);
      } finally {
        setLoading(false); // Hide loading indicator
      }
    };

    fetchData(); // Fetch data when component mounts
  }, []);



  // Search functionality
  const handleSearch = (text) => {
    setSearchText(text); // Update search text
    if (text === "") {
      setFilteredData(orderData); // Show all data if search is cleared
    } else {
      const filteredOrders = orderData.filter((order) =>
        order.orderId.toString().includes(text)
      );
      setFilteredData(filteredOrders);
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
        <Header />
        <Text>Error: {error}</Text>
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
      onPress={() => gotoOrderDetail(item.orderId)} // Send only the orderId to OrderDetail
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
        <Text style={styles.OR_title}>Order List ({OrderAmount})</Text>
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
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <FlatList
          data={filteredData}
          keyExtractor={(item) => item.orderId.toString()}
          renderItem={renderOrderItem}
          contentContainerStyle={styles.orderList}
        />
      </ScrollView>

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
    flex: 1,
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
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  orderList: {
    maxHeight: Dimensions.get("screen").height * 0.8, // Set max height for scrollable area
    flex: 1,
    paddingBottom: 20,
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
