import React, { useState, useEffect } from "react";
import { View, Text, FlatList, TextInput, TouchableOpacity, StyleSheet, Image } from "react-native";
import { useNavigation } from '@react-navigation/native';
import Header from "../components/Header";
import FilterComponent from "../components/FilterComponent";

export default function Order() {
  const navigation = useNavigation(); // Get navigation hook

  // Order Data with status
  const [orderData, setOrderData] = useState([
    { id: 1, name: "#12345", time: "10:00 AM", status: "ongoing" },
    { id: 2, name: "#67890", time: "10:30 AM", status: "complete" },
    { id: 3, name: "#54321", time: "11:00 AM", status: "cancel" },
    { id: 4, name: "#09876", time: "9:45 AM", status: "ongoing" },
  ]);

  // State to control the filter modal visibility
  const [modalVisible, setModalVisible] = useState(false);

  // Function to navigate to the order details page
  const handleOrderPress = (order) => {
    navigation.navigate('OrderDetail', { order }); // Navigate to OrderDetail screen
  };

  // Function to render each order item
  const renderItem = ({ item }) => {
    // Define softer RGB colors based on status
    let backgroundColor = "rgb(255, 255, 255)"; // Default white background
    if (item.status === "complete") backgroundColor = "rgb(144, 238, 144)"; // Softer Green for complete
    else if (item.status === "ongoing") backgroundColor = "rgb(255, 240, 186)"; // Softer Yellow for ongoing
    else if (item.status === "cancel") backgroundColor = "rgb(255, 182, 193)"; // Softer Pink for cancel

    return (
      <TouchableOpacity onPress={() => handleOrderPress(item)}>
        <View style={[styles.OR_listItem, { backgroundColor }]}>
          <Text style={[styles.OR_listText, { fontWeight: "600" }]}>{item.name}</Text>
          <Text style={styles.OR_listTime}>{item.time}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  // Sort orders based on status: Ongoing -> Cancel -> Complete
  useEffect(() => {
    const sortedOrders = [...orderData].sort((a, b) => {
      const statusOrder = { "ongoing": 1, "cancel": 2, "complete": 3 };
      return statusOrder[a.status] - statusOrder[b.status];
    });
    setOrderData(sortedOrders);
  }, [orderData]);

  // Function to toggle the filter modal
  const toggleModal = () => {
    setModalVisible(!modalVisible);
  };

  return (
    <View style={styles.OR_container}>
      {/* Including Header Component */}
      <Header />

      {/* Order List Title */}
      <View style={styles.OR_header}>
        <Text style={styles.OR_title}>Order List</Text>
        <View style={styles.OR_searchContainer}>
          <TextInput style={styles.OR_searchInput} placeholder="Search Orders" />
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

      {/* Orders List */}
      <View style={styles.OR_content}>
        <FlatList
          data={orderData}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.OR_orderList}
        />
      </View>

      {/* Include FilterComponent for filtering orders */}
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
    width: "30%", // Make sure it stretches across the entire screen width
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
  OR_content: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 10,
  },
  OR_listItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 15,
    marginBottom: 10,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  OR_listText: {
    fontSize: 20,
    marginBottom: 5,
    color: "#333", // Darker text color for better contrast with softer background
  },
  OR_listTime: {
    fontSize: 16,
    color: "#333", // Darker text color for better contrast with softer background
    alignSelf: "center",
  },
});
