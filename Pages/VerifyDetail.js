import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Modal,
  StyleSheet,
  Alert,
} from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import Header from "../components/Header"; // Importing Header component

export default function VerifyDetail() {
  const route = useRoute(); // To get the passed user data
  const navigation = useNavigation();
  const { user } = route.params; // Destructure passed user data
  const [modalVisible, setModalVisible] = useState(false);
  const [result, setResult] = useState(null); // To store Pass/Unpass result (true/false)

  // Function to handle confirmation for both true (pass) and false (fail)
  const handleConfirm = (status) => {
    setResult(status); // Set the status (pass/unpass)
    setModalVisible(true); // Open the modal for confirmation
  };

  // Function to send data to backend and remove user
  const sendResultToBackend = async () => {
    if (result === false) {
      // If the result is "unpass" (false), send an email and delete the user
      await sendEmailNotification();
      await deleteUserFromBackend();
    } else {
      // If the result is "pass", just update the user status
      await updateUserStatus();
    }
    setModalVisible(false);
  };

  // Function to send email notification when "ไม่ผ่าน"
  const sendEmailNotification = async () => {
    try {
      const response = await fetch(
        "https://ku-man-api.vimforlanie.com/admin/send-email", // Change to your backend email API
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: user.email, // Send to user's email
            subject: "Your Verification Status",
            message: "Your verification has failed.", // Customize this message
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to send email notification");
      }

      Alert.alert("Success", "An email has been sent to the user.");
    } catch (error) {
      Alert.alert("Error", error.message);
    }
  };

  // Function to delete the user from the backend
  const deleteUserFromBackend = async () => {
    try {
      const response = await fetch(
        `https://ku-man-api.vimforlanie.com/admin/delete-user/${user.walkerId}`, // Assuming there's a DELETE endpoint for users
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete user");
      }

      Alert.alert("Success", "User has been removed.");
      setModalVisible(false);
      navigation.goBack(); // Go back to the previous screen after deletion
    } catch (error) {
      Alert.alert("Error", error.message);
    }
  };

  // Function to update the user's status to pass/unpass
  const updateUserStatus = async () => {
    try {
      const updatedUser = {
        walkerId: user.walkerId,
        status: result, // true for pass, false for unpass
      };

      const response = await fetch(
        "https://ku-man-api.vimforlanie.com/admin/verify",
        {
          method: "POST", // Assuming the update method is POST
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedUser),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update user status");
      }

      Alert.alert(
        `User status has been updated to: ${result ? "ผ่าน" : "ไม่ผ่าน"}`
      );

      setModalVisible(false);
      navigation.goBack(); // Go back to the previous screen
    } catch (error) {
      Alert.alert("Error", error.message);
    }
  };

  return (
    <View style={styles.container}>
      {/* Include Header */}
      <Header />
      <View style={styles.innerContainer}>
        <View style={styles.imageContainer}>
          <Image
            source={{
              uri: user.profilePicture
                ? `https://ku-man.runnakjeen.com/${user.profilePicture}` // If profilePicture is a valid path
                : "https://via.placeholder.com/150", // Fallback image
            }}
            style={styles.image}
          />
        </View>

        {/* Display user details */}
        <Text style={styles.userInfoTitle}>User Details</Text>
        <View style={styles.userInfoContainer}>
          <Text style={styles.userInfoLabel}>ชื่อผู้ใช้: </Text>
          <Text style={styles.userInfo}>{user.username}</Text>
        </View>
        <View style={styles.userInfoContainer}>
          <Text style={styles.userInfoLabel}>อีเมล: </Text>
          <Text style={styles.userInfo}>{user.email}</Text>
        </View>
        <View style={styles.userInfoContainer}>
          <Text style={styles.userInfoLabel}>เบอร์โทรศัพท์: </Text>
          <Text style={styles.userInfo}>{user.phoneNumber}</Text>
        </View>
        <View style={styles.userInfoContainer}>
          <Text style={styles.userInfoLabel}>บัญชีรับเงิน: </Text>
          <Text style={styles.userInfo}>
            {user.bankAccountName || "N/A"}
          </Text>{" "}
          {/* Check for missing data */}
        </View>
        <View style={styles.userInfoContainer}>
          <Text style={styles.userInfoLabel}>เลขที่บัญชี: </Text>
          <Text style={styles.userInfo}>
            {user.bankAccountNo || "N/A"}
          </Text>{" "}
          {/* Check for missing data */}
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.unpassButton}
            onPress={() => handleConfirm(false)} // Trigger modal for "Fail"
          >
            <Text style={styles.buttonText}>ไม่ผ่าน</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.passButton}
            onPress={() => handleConfirm(true)} // Trigger modal for "Pass"
          >
            <Text style={styles.buttonText}>ผ่าน</Text>
          </TouchableOpacity>
        </View>

        {/* Modal for confirmation */}
        <Modal
          transparent={true}
          visible={modalVisible}
          animationType="fade"
          onRequestClose={() => setModalVisible(false)} // This will allow closing modal on back press on Android
        >
          <View style={styles.modalBackground}>
            <View style={styles.modalContainer}>
              <Text style={styles.modalText}>
                {`คุณยืนยันที่จะให้ user คนนี้ ${result ? "ผ่าน" : "ไม่ผ่าน"}?`}
              </Text>
              <TouchableOpacity
                style={styles.confirmButton}
                onPress={sendResultToBackend} // Send the result to backend when confirmed
              >
                <Text style={styles.confirmButtonText}>ยืนยัน</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#F5F5F5",
  },
  innerContainer: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 5,
    elevation: 2,
    marginVertical: 20,
    marginHorizontal: "5%",
  },
  userInfo: {
    fontSize: 18,
    color: "#333",
  },
  imageContainer: {
    alignItems: "center",
    marginVertical: 20,
  },
  image: {
    width: 200,
    height: 200,
    borderRadius: 100,
    borderWidth: 3,
    borderColor: "#e0e0e0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 10,
  },
  userInfoTitle: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 20,
    color: "#333",
  },
  userInfoContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginVertical: 20,
  },
  userInfoLabel: {
    fontSize: 18,
    color: "#666",
    fontWeight: "bold",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    marginTop: 30,
  },
  passButton: {
    padding: 15,
    backgroundColor: "#4CAF50",
    borderRadius: 10,
    alignItems: "center",
    width: "40%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  unpassButton: {
    padding: 15,
    backgroundColor: "#F44336",
    borderRadius: 10,
    alignItems: "center",
    width: "40%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
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
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowOffset: { width: 0, height: 5 },
    shadowRadius: 5,
    elevation: 10,
  },
  modalText: {
    fontSize: 18,
    marginBottom: 20,
    textAlign: "center",
    color: "#333",
  },
  confirmButton: {
    backgroundColor: "#4CAF50",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 4,
    elevation: 5,
  },
  confirmButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});