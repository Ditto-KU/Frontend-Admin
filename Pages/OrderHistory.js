import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import Header from '../components/Header'; // Assuming you have a Header component

export default function OrderHistory() {
  const navigation = useNavigation();
  const route = useRoute();
  const { shopId } = route.params; // Get shopId from the previous screen
  const authToken =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdXRoSWQiOiJhZG1pbjIiLCJpYXQiOjE3MjgxMjg1MDIsImV4cCI6MTczNjc2ODUwMn0.gqSAFiuUiAAnZHupDmJdlOqlKz2rqPxAbPVffcKt1Is";

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Handle navigation to OrderHistoryDetail page
  const handleOrderPress = (orderID) => {
    navigation.navigate("OrderDetail", { orderID });
  };

  // Fetch order data based on shopId
  useEffect(() => {
    const fetchOrderHistory = async () => {
      try {
        setLoading(true); // Show loading indicator
        const headersList = {
          Accept: "*/*",
          Authorization: `Bearer ${authToken}`,
        };
        const response = await fetch(
          `https://ku-man-api.vimforlanie.com/admin/canteen/shop/order?shopId=${shopId}`,
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

          setOrders(sortedData);
        } else {
          throw new Error(`Unexpected content-type: ${contentType}`);
        }
      } catch (error) {
        console.error("Error fetching order history:", error);
        setError(error.message);
        Alert.alert("Error", error.message);
      } finally {
        setLoading(false); // Stop loading after data is fetched or error occurs
      }
    };

    fetchOrderHistory();
  }, [shopId]);

  // Render each order in the list
  const renderItem = ({ item }) => (
    <View style={styles.orderItem}>
      <Text style={styles.orderText}>Order ID: {item.orderId}</Text>
      <Text style={styles.orderText}>Quantity: {item.quantity}</Text>
      <Text style={styles.orderText}>Total Price: {item.totalPrice} THB</Text>
      <Text style={styles.orderText}>Status: {item.orderStatus}</Text>
      <Text style={styles.orderText}>Order Date: {new Date(item.orderItemDate).toLocaleDateString()}</Text>

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
      <Header />
      <Text style={styles.header}>Order History</Text>
      <FlatList
        data={orders} // Orders fetched from the API
        renderItem={renderItem}
        keyExtractor={(item) => item.orderId.toString()}
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
