import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, ActivityIndicator, Alert } from "react-native";
import { useNavigation } from '@react-navigation/native';
import Header from "../components/Header";
import FilterComponent from "../components/FilterComponent";

export default function Order() {
  const navigation = useNavigation();
  const [orderData, setOrderData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  
  // Fetch order data from the API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const headersList = {
          Accept: "*/*",
        };

        const response = await fetch("https://ku-man.runnakjeen.com/admin/order", {
          method: "GET",
          headers: headersList,
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const contentType = response.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
          const data = await response.json();

          const sortedData = data.sort((a, b) => {
            const statusOrder = { "waitingAdmin": 1, "inProgress": 2, "lookingForWalker": 3, "completed": 4, "cancelled": 5 };
            return statusOrder[a.orderStatus] - statusOrder[b.orderStatus];
          });
          setOrderData(sortedData); // Set order data
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
    
    fetchData();
  }, []);
  
  const gotoOrderDetail = (order) => {
    navigation.navigate('OrderDetail', { order: order });
  };

  const toggleModal = () => {
    setModalVisible(!modalVisible);
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

  if (orderData.length === 0) {
    return (
      <View style={styles.loadingContainer}>
        <Text>No orders available</Text>
      </View>
    );
  }


  return (
    <View style={styles.OR_container}>
      <Header />
      <View style={styles.OR_header}>
        <Text style={styles.OR_title}>Order List</Text>
        <View style={styles.OR_searchContainer}>
          <TextInput 
            style={styles.OR_searchInput} 
            placeholder="Search Orders" 
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

      {/* Order List using map() */}
      <View style={styles.orderList}>
        <Text style={styles.header}>Orders</Text>
        {orderData.map((order, index) => {
          let backgroundColor = "#FFF"; // Default background
          if (order.orderStatus === "inProgress") backgroundColor = "rgb(255, 240, 186)"; // Softer Yellow
          else if (order.orderStatus === "completed") backgroundColor = "rgb(144, 238, 144)"; // Softer Green
          else if (order.orderStatus === "cancelled") backgroundColor = "rgb(255, 182, 193)"; // Softer Pink
          else if (order.orderStatus === "lookingForWalker") backgroundColor = "rgb(211, 211, 211)"; // Softer Gray
          else if (order.orderStatus === "waitingAdmin") backgroundColor = "rgb(255, 222, 173)"; // Softer Peach

          return (
            <TouchableOpacity
              key={index}
              style={[styles.orderContainer, { backgroundColor }]}
              onPress={() => gotoOrderDetail(order)}
            >
              <Text style={[styles.orderText,{fontWeight: 600}]}>Order ID: {order.orderId}</Text>
              <Text style={styles.orderText}>{order.orderStatus}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <FilterComponent modalVisible={modalVisible} toggleModal={toggleModal} />
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
  orderList: {
    padding: 10,
  },
  orderContainer: {
    padding: 15,
    marginBottom: 10,
    borderRadius: 10,
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
