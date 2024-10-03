import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  Modal,
  TextInput,
} from "react-native";
import { Ionicons } from "@expo/vector-icons"; // Assuming use of Expo for icon management
import { useRoute } from "@react-navigation/native"; // To get the passed order data
import Header from "../components/Header";

export default function OrderDetail() {
  // Use route to get the passed order object
  const route = useRoute();
  const { order } = route.params; // Destructure the passed 'order' from the previous screen

  // Modal and cancellation state
  const [modalVisible, setModalVisible] = useState(false);
  const [reason, setReason] = useState(""); // For storing the cancellation reason

  // Handlers for modal actions
  const handleCancelOrder = () => {
    setModalVisible(true);
  };

  const handleApprove = () => {
    // Handle approve logic for cancellation (possibly an API call)
    console.log("Order Approved for Cancellation:", reason);
    setModalVisible(false);
  };

  const handleDisapprove = () => {
    // Handle disapprove logic for cancellation
    console.log("Order Disapproved for Cancellation");
    setModalVisible(false);
  };

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
                  source={{ uri: "https://via.placeholder.com/100" }} // Replace with actual image if needed
                  style={styles.profilePic}
                />
              </View>

              {/* Food Pickup Info */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Food Pickup Proof</Text>
                <Image
                  source={{ uri: "https://via.placeholder.com/150" }} // Replace with actual image if needed
                  style={styles.foodImage}
                />
              </View>

              {/* Proof of Delivery */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Delivery Proof</Text>
                <Image
                  source={{ uri: "https://via.placeholder.com/150" }} // Replace with actual image if needed
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

              {/* Requester and Walker Info */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Requester</Text>
                <Text style={styles.sectionDetail}>User: {order.requester.username}</Text>
                <Text style={styles.sectionDetail}>Total: {order.totalPrice}</Text>
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

              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Walker</Text>
                <Text style={styles.sectionDetail}>User: {order.walker.username}</Text>
                <Text style={styles.sectionDetail}>Payment: {order.totalPrice}</Text>
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

          <View style={styles.LeftDown}>
            {/* Cancel Button at the bottom */}
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={handleCancelOrder}
            >
              <Text style={styles.cancelButtonText}>Cancel order</Text>
            </TouchableOpacity>
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

        {/* Modal for cancel order */}
        <Modal
          transparent={true}
          animationType="fade"
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalBackground}>
            <View style={styles.modalContainer}>
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
          </View>
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
  LeftDown: {
    alignItems: "center",
    justifyContent: "flex-end",
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
});
