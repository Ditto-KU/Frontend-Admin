import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import Header from '../components/Header'; // Assuming you have a Header component

export default function OrderHistory() {
  const navigation = useNavigation();
  const route = useRoute();
  const { shopId } = route.params; // Get shopId from the previous screen
  
  // States to manage fetched orders, loading and error state
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Handle navigation to OrderHistoryDetail page
  const handleOrderPress = (orderId) => {
    navigation.navigate("OrderHistoryDetail", { orderId });
  };

  // Fetch order data based on shopId
  useEffect(() => {
    const fetchOrderHistory = async () => {
      try {
        let headersList = {
          Accept: "*/*",
        };

        let response = await fetch(
          `https://ku-man-api.vimforlanie.com/admin/canteen/shop/order?shopId=${shopId}`,
          {
            method: "GET",
            headers: headersList,
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json(); // Parse response to JSON
        setOrders(data); // Set the fetched orders in state
      } catch (error) {
        console.error("Error fetching order history:", error);
        setError(error.message);
        Alert.alert("Error", error.message);
      } finally {
        setLoading(false); // Stop loading after data is fetched or error occurs
      }
    };
    // Set an interval to fetch data every second
    const intervalId = setInterval(fetchOrderHistory, 1000); // Fetch every 1000 ms (1 second)

    // Clean up the interval on component unmount
    return () => clearInterval(intervalId);
  }, [shopId]); // Fetch when shopId changes


  // Render each order in the list
  const renderItem = ({ item }) => (
    <View style={styles.orderItem}>
      <Text style={styles.orderText}>Order ID: {item.orderId}</Text>
      <Text style={styles.orderText}>Quantity: {item.quantity}</Text>
      <Text style={styles.orderText}>Total Price: {item.totalPrice} THB</Text>
      <Text style={styles.orderText}>Status: {item.orderItemStatus}</Text>
      <Text style={styles.orderText}>Order Date: {new Date(item.orderItemDate).toLocaleDateString()}</Text>

      {/* Button to navigate to order history detail */}
      <TouchableOpacity
        style={styles.detailButton}
        onPress={() => handleOrderPress(item.orderId)}
      >
        <Text style={styles.buttonText}>View Details</Text>
      </TouchableOpacity>
    </View>
  );

  // Render loading or error state
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Loading Orders...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Error: {error}</Text>
      </View>
    );
  }

  // Render the orders list
  return (
    <View style={styles.container}>
      {/* Add custom header */}
      <Header />

      <Text style={styles.header}>Order History</Text>

      {/* Order List */}
      <FlatList
        data={orders} // Orders fetched from the API
        renderItem={renderItem}
        keyExtractor={(item) => item.orderItemId.toString()}
        contentContainerStyle={styles.orderList}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#F5F5F5",
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
  },
  orderList: {
    paddingVertical: 10,
  },
  orderItem: {
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
  orderText: {
    fontSize: 16,
    color: "#333",
  },
  detailButton: {
    marginTop: 10,
    paddingVertical: 10,
    backgroundColor: "#2196F3",
    borderRadius: 5,
    alignItems: "center",
  },
  buttonText: {
    color: "#FFF",
    fontWeight: "bold",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
