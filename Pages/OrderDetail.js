import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  Modal,
  TextInput,
  ActivityIndicator,
  Alert,
  Linking,
} from "react-native";
import { Ionicons } from "@expo/vector-icons"; // Assuming use of Expo for icon management
import { useRoute } from "@react-navigation/native"; // To get the passed order data
import Header from "../components/Header";

export default function OrderDetail() {
  const route = useRoute();
  const { orderID } = route.params; // Destructure the passed 'orderID'
  const authToken =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdXRoSWQiOiJhZG1pbjIiLCJpYXQiOjE3MjgxMjg1MDIsImV4cCI6MTczNjc2ODUwMn0.gqSAFiuUiAAnZHupDmJdlOqlKz2rqPxAbPVffcKt1Is";

  const [order, setOrder] = useState(null); // Order state
  const [modalVisible, setModalVisible] = useState(false);
  const [reason, setReason] = useState(""); // For storing the cancellation reason
  const [orderStatus, setOrderStatus] = useState(""); // Track the order status
  const [loading, setLoading] = useState(false); // Loading state for the API call
  const [error, setError] = useState(null); // Error state

  // Fetch order data from the API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true); // Show loading indicator
        const headersList = {
          Accept: "*/*",
          Authorization: `Bearer ${authToken}`,
        };
        const response = await fetch(
          `https://ku-man-api.vimforlanie.com/admin/order/info?orderId=${orderID}`,
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
          setOrder(data); // Set order data
          setOrderStatus(data.orderStatus);
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

    fetchData(); // Fetch orders initially
  }, [orderID]);

  const makeCall = (phoneNumber) => {
    const formattedNumber = phoneNumber.replace(/[^0-9]/g, ""); // Sanitize the phone number
    const url = `tel:${formattedNumber}`;
  
    Linking.canOpenURL(url)
      .then((supported) => {
        if (!supported) {
          Alert.alert("Error", "Your device does not support this functionality.");
        } else {
          return Linking.openURL(url);
        }
      })
      .catch((err) => {
        console.error("Error making a call", err);
        Alert.alert("Error", "Failed to make the call. Please try again.");
      });
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Loading order details...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text>Error: {error}</Text>
      </View>
    );
  }

  if (!order) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Header />
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Left column */}
        <View style={styles.leftColumn}>
          <View style={styles.LeftUp}>
            {/* Requester Info */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Requester Info</Text>
              <Text style={styles.sectionDetail}>Username: {order.requester.username}</Text>
              <Text style={styles.sectionDetail}>Phone: {order.requester.phoneNumber}</Text>
              <TouchableOpacity
                style={styles.callButton}
                onPress={() => makeCall(order.requester.phoneNumber)}
              >
                <Ionicons name="call-outline" size={16} color="#fff" />
                <Text style={styles.callButtonText}>Call Requester</Text>
              </TouchableOpacity>
            </View>

            {/* Walker Info */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Walker Info</Text>
              <Text style={styles.sectionDetail}>Username: {order.walker.username}</Text>
              <Text style={styles.sectionDetail}>Phone: {order.walker.phoneNumber}</Text>
              <TouchableOpacity
                style={styles.callButton}
                onPress={() => makeCall(order.walker.phoneNumber)}
              >
                <Ionicons name="call-outline" size={16} color="#fff" />
                <Text style={styles.callButtonText}>Call Walker</Text>
              </TouchableOpacity>
            </View>

            {/* Delivery Address */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Delivery Address</Text>
              <Text style={styles.sectionDetail}>Address: {order.address.name}</Text>
              <Text style={styles.sectionDetail}>Detail: {order.address.detail}</Text>
              <Text style={styles.sectionDetail}>Note: {order.address.note}</Text>
            </View>
          </View>

          <View style={styles.LeftDown}>
            {/* Show cancel button only if the order is not yet cancelled */}
            {orderStatus !== "cancelled" && (
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setModalVisible(true)}
              >
                <Text style={styles.cancelButtonText}>Cancel order</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Right column */}
        <View style={styles.rightColumn}>
          {/* Order Info */}
          <Text style={styles.orderTitle}>Order: {order.orderId}</Text>

          {/* Ordered Items */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Ordered Items</Text>
            {order.orderItem.map((item, index) => (
              <View key={item.orderItemId} style={styles.orderItem}>
                <Text style={styles.sectionDetail}>
                  {index + 1}. {item.menu.name} - {item.totalPrice} THB
                </Text>
                <Text style={styles.sectionDetail}>
                  Special Instructions: {item.specialInstructions || "None"}
                </Text>
                {item.orderItemExtra.length > 0 && (
                  <Text style={styles.sectionDetail}>
                    Extra:{" "}
                    {item.orderItemExtra
                      .map((extra) => extra.optionItem.name)
                      .join(", ")}
                  </Text>
                )}
              </View>
            ))}
          </View>

          {/* Canteen Info */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Canteen Information</Text>
            <Text style={styles.sectionDetail}>Canteen Name: {order.canteen.name}</Text>
          </View>

          {/* Pricing Info */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Pricing Details</Text>
            <Text style={styles.sectionDetail}>Total Price: {order.totalPrice} Baht</Text>
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
    padding: 10,
    backgroundColor: "#fafbfc",
    borderRadius: 10,
    marginRight: 10,
  },
  LeftUp: {
    flexDirection: "column",
    paddingBottom: 20,
  },
  LeftDown: {
    alignItems: "center",
    justifyContent: "flex-end",
  },
  rightColumn: {
    width: "35%",
    padding: 10,
    backgroundColor: "#fafbfc",
    borderRadius: 10,
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
  sectionDetail: {
    fontSize: 18,
    marginBottom: 5,
  },
  callButton: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: "#333",
    borderRadius: 5,
    alignSelf: "flex-start",
  },
  callButtonText: {
    color: "#fff",
    marginLeft: 5,
  },
  orderItem: {
    marginBottom: 10,
  },
  cancelButton: {
    paddingVertical: 15,
    backgroundColor: "#f44336",
    borderRadius: 5,
    alignSelf: "center",
    paddingHorizontal: 60,
  },
  cancelButtonText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold",
  },
});
