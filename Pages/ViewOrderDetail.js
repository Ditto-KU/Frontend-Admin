import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  ActivityIndicator,
  TouchableOpacity,
  Modal,
  TextInput,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Header from "../components/Header";

export default function ViewOrderDetail({ orderId }) {
  const [order, setOrder] = useState(null);  // State to store the fetched order
  const [loading, setLoading] = useState(true);  // Loading state
  const [error, setError] = useState(null);  // State for error handling
  const [modalVisible, setModalVisible] = useState(false);  // Modal state
  const [reason, setReason] = useState("");  // For storing the cancellation reason
  const [orderStatus, setOrderStatus] = useState("");  // Track the order status locally
  const [loadingCancel, setLoadingCancel] = useState(false);  // Loading state for the cancel order API call
  const authToken =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdXRoSWQiOiJhZG1pbjIiLCJpYXQiOjE3MjgxMjg1MDIsImV4cCI6MTczNjc2ODUwMn0.gqSAFiuUiAAnZHupDmJdlOqlKz2rqPxAbPVffcKt1Is";

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
        setOrderStatus(foundOrder.orderStatus);  // Set initial order status
      } catch (error) {
        console.error("Error fetching order details:", error);
        setError(error.message);  // Set error message
      } finally {
        setLoading(false);  // Stop loading when data is fetched
      }
    };

    fetchOrderDetails();
  }, [orderId]);

  const handleCancelOrder = () => {
    setModalVisible(true);  // Show modal for canceling order
  };

  const handleApprove = async () => {
    setLoadingCancel(true);  // Set loading state for cancel action
    try {
      // API call to update the order status to cancelled
      const headersList = {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      };
      const bodyContent = JSON.stringify({
        orderStatus: "cancelled",
        reason: reason,  // Reason for cancellation
      });

      const response = await fetch(
        `https://ku-man-api.vimforlanie.com/admin/approval/${orderId}`,
        {
          method: "PUT",
          body: bodyContent,
          headers: headersList,
        }
      );

      if (!response.ok) {
        throw new Error("Failed to cancel order");
      }

      const data = await response.json();
      console.log("Order Approved for Cancellation:", data);

      // Update the local orderStatus to reflect the cancelled status
      setOrderStatus("cancelled");
      setModalVisible(false);  // Close modal
    } catch (error) {
      console.error("Error cancelling order:", error);
    } finally {
      setLoadingCancel(false);  // Stop loading
    }
  };

  const handleDisapprove = () => {
    setModalVisible(false);  // Close modal without action
  };

  const closeModal = () => {
    setModalVisible(false);  // Close the modal
  };

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

          <View style={styles.LeftDown}>
            {orderStatus !== "cancelled" && (
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={handleCancelOrder}
              >
                <Text style={styles.cancelButtonText}>Cancel order</Text>
              </TouchableOpacity>
            )}

            {loadingCancel && <ActivityIndicator size="small" color="#0000ff" />}
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

          {orderStatus === "cancelled" && (
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: "red" }]}>Order Cancelled</Text>
            </View>
          )}
        </View>

        {/* Modal for cancel order */}
        <Modal
          transparent={true}
          animationType="fade"
          visible={modalVisible}
          onRequestClose={closeModal}
        >
          <TouchableOpacity
            style={styles.modalBackground}
            onPressOut={closeModal}
          >
            <View style={styles.modalContainer}>
              <TouchableOpacity style={styles.closeButton} onPress={closeModal}>
                <Ionicons name="close-circle" size={24} color="black" />
              </TouchableOpacity>
              <Text style={styles.modalTitle}>Cancel Order</Text>
              <Text>Reason:</Text>
              <TextInput
                style={styles.textInput}
                placeholder="Enter reason for cancellation"
                value={reason}
                onChangeText={setReason}
              />
              <View style={styles.buttonRow}>
                <TouchableOpacity
                  style={styles.approveButton}
                  onPress={handleApprove}
                >
                  <Text style={styles.buttonText}>Approve</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.disapproveButton}
                  onPress={handleDisapprove}
                >
                  <Text style={styles.buttonText}>Disapprove</Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableOpacity>
        </Modal>
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
  modalBackground: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContainer: {
    width: 300,
    padding: 20,
    backgroundColor: "#fff",
    borderRadius: 10,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 20,
  },
  textInput: {
    width: "100%",
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  approveButton: {
    backgroundColor: "#4CAF50",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginRight: 10,
  },
  disapproveButton: {
    backgroundColor: "#f44336",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  closeButton: {
    position: "absolute",
    top: 10,
    right: 10,
  },
});
