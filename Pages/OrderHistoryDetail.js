import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRoute, useNavigation } from "@react-navigation/native";
import Header from "../components/Header";

export default function OrderHistoryDetail() {
  const route = useRoute();
  const navigation = useNavigation();
  const { orderId  } = route.params; // Destructure orderId from the route parameters
  const authToken =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdXRoSWQiOiJhZG1pbjIiLCJpYXQiOjE3MjgxMjg1MDIsImV4cCI6MTczNjc2ODUwMn0.gqSAFiuUiAAnZHupDmJdlOqlKz2rqPxAbPVffcKt1Is";
  // State to manage fetched order details, loading, and error
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Handler for navigating to the report page
  const handleReport = () => {
    navigation.navigate("ReportDetail", { orderId });
  };

  // Fetch order details using orderId
  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        let headersList = {
          Accept: "*/*",
          Authorization: `Bearer ${authToken}`,
        };
        let response = await fetch(
          `https://ku-man-api.vimforlanie.com/admin/order/detail?orderId=${orderId}`,
          {
            method: "GET",
            headers: headersList,
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json(); // Parse the response to JSON
        setOrder(data); // Set order data
      } catch (error) {
        console.error("Error fetching order details:", error);
        setError(error.message);
        Alert.alert("Error", error.message);
      } finally {
        setLoading(false); // Stop loading after fetch or error
      }
    };

    fetchOrderDetails();
  }, [orderId]);

  // Render loading or error state
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Loading Order Details...</Text>
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

  // Render the UI only if order data exists
  if (!order) {
    return (
      <View style={styles.loadingContainer}>
        <Text>No order data available</Text>
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
              {/* User Info */}
              <Text style={styles.userTitle}>Requester: {order.requester.username}</Text>

              {/* Personal Verification */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>User Verification</Text>
                <Image
                  source={{ uri: order.requester.profilePicture }} // Use actual profile picture
                  style={styles.profilePic}
                />
              </View>

              {/* Food Pickup Info */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Food Pickup Proof</Text>
                <Image
                  source={{ uri: order.Photo.photoPath }} // Use actual food pickup image
                  style={styles.foodImage}
                />
              </View>

              {/* Proof of Delivery */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Delivery Proof</Text>
                <Image
                  source={{ uri: order.Photo.photoPath }} // Use actual delivery image
                  style={styles.deliveryImage}
                />
              </View>
            </View>

            <View style={styles.LeftRight}>
              {/* Delivery Address */}
              <View style={styles.section}>
                <Text style={[styles.sectionTitle, { marginTop: 20 }]}>Delivery Address</Text>
                <View style={styles.iconRow}>
                  <Text style={styles.sectionDetail}>Address: {order.address.name}</Text>
                  <Text style={styles.sectionDetail}>Recipient: {order.requester.username}</Text>
                </View>
              </View>

              {/* Requester Info */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Requester</Text>
                <Text style={styles.sectionDetail}>User: {order.requester.username}</Text>
                <Text style={styles.sectionDetail}>Total: {order.totalPrice} Baht</Text>
                <TouchableOpacity style={styles.telButton}>
                  <Ionicons
                    name="call-outline"
                    size={16}
                    color="#fff"
                    style={{ marginRight: 5 }}
                  />
                  <Text style={styles.telButtonText}>Call</Text>
                </TouchableOpacity>
              </View>

              {/* Walker Info */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Walker</Text>
                <Text style={styles.sectionDetail}>Phone: {order.walker.phoneNumber}</Text>
                <Text style={styles.sectionDetail}>Payment: {order.totalPrice} Baht</Text>
                <TouchableOpacity style={styles.telButton}>
                  <Ionicons
                    name="call-outline"
                    size={16}
                    color="#fff"
                    style={{ marginRight: 5 }}
                  />
                  <Text style={styles.telButtonText}>Call</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.rightColumn}>
          {/* Order Info */}
          <Text style={styles.orderTitle}>Order: {order.orderId}</Text>

          {/* Ordered Items */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Ordered Items</Text>
            <Text style={styles.sectionRestName}>Canteen: {order.canteen.name}</Text>
            <Text style={styles.sectionDetail}>Total: {order.totalPrice} Baht</Text>
            <Text style={styles.sectionDetail}>Shipping Fee: {order.shippingFee} Baht</Text>
          </View>
        </View>

        {/* Add Report Button */}
        <TouchableOpacity style={styles.reportButton} onPress={handleReport}>
          <Text style={styles.reportButtonText}>Report Issue</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  scrollContainer: {
    flexDirection: "row",
    padding: 10,
    paddingBottom: 20,
    backgroundColor: "#f0f0f0",
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
  telButton: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: "#333",
    borderRadius: 5,
    marginHorizontal: 40,
  },
  telButtonText: {
    color: "#fff",
    textAlign: "center",
  },
  reportButton: {
    paddingVertical: 15,
    backgroundColor: "#f44336",
    borderRadius: 5,
    alignSelf: "center",
    paddingHorizontal: 60,
    marginTop: 20,
  },
  reportButtonText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold",
  },
});
