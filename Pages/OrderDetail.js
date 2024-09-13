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
import Header from "../components/Header";

export default function OrderDetail() {
  // State for order and user details
  const [orderDetails, setOrderDetails] = useState({
    orderId: "#1234",
    totalPrice: "xx บาท",
    deliveryFee: "xx บาท",
    serviceFee: "xx บาท",
    orderedItems: [
      { restaurant: "ร้านค้า1", menuItems: ["เมนูที่1 - ราคา", "เมนูที่2 - ราคา"] },
      // Add more ordered items here
    ],
  });

  const [requesterInfo, setRequesterInfo] = useState({
    user: "xxxxx",
    price: "xx บาท",
    phone: "123456789", // Placeholder phone number
  });

  const [walkerInfo, setWalkerInfo] = useState({
    user: "xxxxx",
    payment: "xx บาท",
    phone: "987654321", // Placeholder phone number
  });

  const [deliveryAddress, setDeliveryAddress] = useState({
    address: "สถานที่จัดส่ง",
    recipient: "ผู้รับส่ง",
  });

  const [modalVisible, setModalVisible] = useState(false); // For cancel modal
  const [reason, setReason] = useState(""); // For storing the cancellation reason

  const handleCancelOrder = () => {
    setModalVisible(true);
  };

  const handleApprove = () => {
    // Handle approve logic for cancellation
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
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        horizontal={false}
      >
        <View style={styles.leftColumn}>
          <View style={styles.LeftUp}>
            <View style={styles.LeftLeft}>
              {/* User Info */}
              <Text style={styles.userTitle}>user: {requesterInfo.user} (requester)</Text>

              {/* Personal Verification */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>หลักฐานการยืนยันตัวตน</Text>
                <Image
                  source={{ uri: "https://via.placeholder.com/100" }}
                  style={styles.profilePic}
                />
              </View>

              {/* Food Pickup Info */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>หลักฐานการรับอาหาร</Text>
                <Image
                  source={{ uri: "https://via.placeholder.com/150" }}
                  style={styles.foodImage}
                />
              </View>

              {/* Proof of Delivery */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>หลักฐานการจัดส่ง</Text>
                <Image
                  source={{ uri: "https://via.placeholder.com/150" }}
                  style={styles.deliveryImage}
                />
              </View>
            </View>

            <View style={styles.LeftRight}>
              {/* Delivery Address */}
              <View style={styles.section}>
                <Text style={[styles.sectionTitle, { marginTop: 20 }]}>ตำแหน่งจัดส่ง</Text>
                <View style={styles.iconRow}>
                  <View>
                    <Text style={styles.sectionDetail}>ที่อยู่จัดส่ง: {deliveryAddress.address}</Text>
                    <Text style={styles.sectionDetail}>ผู้รับส่ง: {deliveryAddress.recipient}</Text>
                  </View>
                </View>
              </View>

              {/* Requester and Walker Info */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Requester</Text>
                <Text style={styles.sectionDetail}>user: {requesterInfo.user}</Text>
                <Text style={styles.sectionDetail}>ราคา: {requesterInfo.price}</Text>
                <TouchableOpacity style={styles.telButton}>
                  <Ionicons
                    name="call-outline"
                    size={16}
                    color="#fff"
                    style={{ marginRight: 5 }}
                  />
                  <Text style={styles.telButtonText}>Tel</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Walker</Text>
                <Text style={styles.sectionDetail}>user: {walkerInfo.user}</Text>
                <Text style={styles.sectionDetail}>เงินที่ต้องชำระให้: {walkerInfo.payment}</Text>
                <TouchableOpacity style={styles.telButton}>
                  <Ionicons
                    name="call-outline"
                    size={16}
                    color="#fff"
                    style={{ marginRight: 5 }}
                  />
                  <Text style={styles.telButtonText}>Tel</Text>
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
          <Text style={styles.orderTitle}>Order: {orderDetails.orderId}</Text>

          {/* Ordered Items */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>รายการที่สั่ง</Text>
            {orderDetails.orderedItems.map((item, index) => (
              <View key={index} style={styles.sectionlistorder}>
                <Text style={styles.sectionRestName}>{item.restaurant}</Text>
                {item.menuItems.map((menuItem, i) => (
                  <Text key={i} style={styles.sectionMenu}>{menuItem}</Text>
                ))}
              </View>
            ))}
            <Text style={styles.sectionDetail}>ราคาทั้งหมด - {orderDetails.totalPrice}</Text>
            <Text style={styles.sectionDetail}>ค่าส่ง - {orderDetails.deliveryFee}</Text>
            <Text style={styles.sectionDetail}>ค่าบริการ - {orderDetails.serviceFee}</Text>
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
              <Text style={styles.modalTitle}>ยกเลิกออร์เดอร์</Text>
              <Text>สาเหตุ :</Text>
              <TextInput
                style={styles.textInput}
                placeholder="กรุณาระบุสาเหตุ"
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
    flex: 1, // Ensure the main container takes up the whole screen
    height: "100%", // Ensure the main container takes up the whole screen
  },
  leftColumn: {
    flex: 1, // Left column takes up the remaining space next to the right column
    justifyContent: "space-between", // Ensures that the sections are spaced out
    padding: 10,
    backgroundColor: "#fafbfc", // White background
    borderRadius: 10,
    shadowColor: "#ccc",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    flexDirection: "column", // Stack items in a column
    marginRight: 10, // Add some space between the two columns
  },
  LeftUp: {
    flexDirection: "row", // Align LeftLeft and LeftRight side by side
    justifyContent: "space-between", // Space between the two sections
    paddingBottom: 20, // Add some space between LeftUp and LeftDown
  },
  LeftLeft: {
    flex: 1, // Take up equal space in the left column
    paddingRight: 10, // Add some space between LeftLeft and LeftRight
    flexDirection: "column", // Stack items in a column
    justifyContent: "space-between", // Space between the sections
  },
  LeftRight: {
    flex: 1, // Take up equal space in the left column
    paddingLeft: 10, // Add some space between LeftRight and LeftLeft
  },
  LeftDown: {
    alignItems: "center", // Center the cancel button horizontally
    justifyContent: "flex-end", // Align the cancel button to the bottom
  },
  rightColumn: {
    width: "35%", // Set width to allow side-by-side layout
    padding: 10,
    backgroundColor: "#fafbfc",
    borderRadius: 10,
    shadowColor: "#ccc",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
  },
  userTitle: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20,
  },
  orderTitle: {
    fontSize: 28,
    fontWeight: "bold",
    marginVertical: 10,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 5,
  },
  sectionlistorder: {
    marginBottom: 20,
    marginLeft: 20,
  },
  sectionRestName: {
    fontSize: 24,
    fontWeight: "400",
    marginBottom: 5,
  },
  sectionMenu: {
    fontSize: 20,
    marginBottom: 5,
    marginLeft: 20,
  },
  sectionDetail: {
    marginBottom: 5,
    fontSize: 24,
    marginLeft: 20,
  },
  profilePic: {
    width: 100,
    height: 100,
    borderRadius: 40,
    marginBottom: 10,
    marginLeft: 50,
    marginTop: 10,
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
    marginTop: 20,
    paddingVertical: 15,
    backgroundColor: "#f44336",
    borderRadius: 5,
    alignSelf: "center", // Center the cancel button at the bottom
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
