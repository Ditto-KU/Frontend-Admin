import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Header from "../components/Header";

export default function ViewOrderDetail({ orderId }) {  // Receiving orderId as a prop
  const [order, setOrder] = useState(null);  // State to store the fetched order
  const [loading, setLoading] = useState(true);  // Loading state
  const [error, setError] = useState(null);  // State for error handling

  // Fetch order details when component mounts
  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const headersList = {
          Accept: "*/*",
          Authorization: `Bearer ${authToken}`,        
        };

        // Fetch all orders from the API
        let response = await fetch("https://ku-man-api.vimforlanie.com/admin/order", {
          method: "GET",
          headers: headersList,
        });

        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }

        let data = await response.json();  // Get all orders
        const foundOrder = data.find((item) => item.orderId === orderId);  // Filter the order by orderId

        if (!foundOrder) {
          throw new Error("Order not found");
        }

        setOrder(foundOrder);  // Set the found order
      } catch (error) {
        console.error("Error fetching order details:", error);
        setError(error.message);  // Set error message
      } finally {
        setLoading(false);  // Stop loading when data is fetched
      }
    };

    fetchOrderDetails();
  }, [orderId]);

  // Show loading indicator while fetching data
  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Loading order details...</Text>
      </View>
    );
  }

  // If there's an error, show an error message
  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Error: {error}</Text>
      </View>
    );
  }

  // If order is not found
  if (!order) {
    return (
      <View style={styles.container}>
        <Text>Order not found.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header />
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.leftColumn}>
          <View style={styles.LeftUp}>
            <View style={styles.LeftLeft}>
              <Text style={styles.userTitle}>Requester: {order.requester.username}</Text>

              <View style={styles.section}>
                <Text style={styles.sectionTitle}>User Verification</Text>
                <Image
                  source={{ uri: order.requester.profilePicture || "https://via.placeholder.com/100" }}
                  style={styles.profilePic}
                />
              </View>

              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Food Pickup Proof</Text>
                <Image
                  source={{ uri: order.pickupProof || "https://via.placeholder.com/150" }}
                  style={styles.foodImage}
                />
              </View>

              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Delivery Proof</Text>
                <Image
                  source={{ uri: order.deliveryProof || "https://via.placeholder.com/150" }}
                  style={styles.deliveryImage}
                />
              </View>
            </View>

            <View style={styles.LeftRight}>
              <View style={styles.section}>
                <Text style={[styles.sectionTitle, { marginTop: 20 }]}>Delivery Address</Text>
                <Text style={styles.sectionDetail}>Address: {order.address.name}</Text>
                <Text style={styles.sectionDetail}>Recipient: {order.requester.username}</Text>
              </View>

              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Requester</Text>
                <Text style={styles.sectionDetail}>User: {order.requester.username}</Text>
                <Text style={styles.sectionDetail}>Total: {order.totalPrice} Baht</Text>
              </View>

              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Walker</Text>
                <Text style={styles.sectionDetail}>User: {order.walker.username}</Text>
                <Text style={styles.sectionDetail}>Payment: {order.totalPrice}</Text>
              </View>
            </View>
          </View>
        </View>
        <View style={styles.rightColumn}>
          <Text style={styles.orderTitle}>Order: {order.orderId}</Text>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Ordered Items</Text>
            <Text style={styles.sectionRestName}>Canteen: {order.canteen.name}</Text>
            <Text style={styles.sectionDetail}>Total: {order.totalPrice} Baht</Text>
            <Text style={styles.sectionDetail}>Shipping Fee: {order.shippingFee} Baht</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  errorText: {
    color: "red",
    fontSize: 16,
  },
  scrollContainer: {
    flexDirection: "row",
    padding: 10,
    paddingBottom: 20,
    backgroundColor: "#fff",
    flex: 1,
    height: "100%",
  },
  leftColumn: {
    flex: 1,
    justifyContent: "space-between",
    padding: 10,
    backgroundColor: "#fafbfc",
    borderRadius: 10,
    shadowColor: "#ccc",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    marginRight: 10,
  },
  LeftUp: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingBottom: 20,
  },
  LeftLeft: {
    flex: 1,
    paddingRight: 10,
    justifyContent: "space-between",
  },
  LeftRight: {
    flex: 1,
    paddingLeft: 10,
  },
  rightColumn: {
    width: "35%",
    padding: 10,
    backgroundColor: "#fafbfc",
    borderRadius: 10,
    shadowColor: "#ccc",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
  },
  userTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  orderTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginVertical: 10,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 5,
  },
  sectionRestName: {
    fontSize: 20,
    fontWeight: "400",
    marginBottom: 5,
  },
  sectionDetail: {
    fontSize: 18,
    marginBottom: 5,
  },
  profilePic: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
    marginLeft: 50,
  },
  foodImage: {
    width: 150,
    height: 150,
    borderRadius: 10,
    marginLeft: 20,
    marginTop: 10,
  },
  deliveryImage: {
    width: 150,
    height: 150,
    borderRadius: 10,
    marginLeft: 20,
    marginTop: 10,
  },
});
