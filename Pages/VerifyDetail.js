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
  const [result, setResult] = useState(""); // To store Pass/Unpass result

  // Function to handle confirmation after approving or disapproving
  const handleConfirm = (status) => {
    setResult(status); // Set the status (pass/unpass)
    setModalVisible(true); // Open the modal for confirmation
  };

  // Function to send data to backend
  const sendResultToBackend = () => {
    navigation.goBack();
  };
  return (
    <View style={styles.container}>
      {/* Include Header */}
      <Header />
      <View style={styles.innerContainer}>
        <Text style={styles.userInfo}>ชื่อ: {user.name}</Text>
        <Text style={styles.userInfo}>เบอร์โทรศัพท์: 123456789</Text>
        <Text style={styles.userInfo}>บัญชีรับเงิน: ABC123</Text>

        <View style={styles.imageContainer}>
          <Image
            source={{ uri: "https://via.placeholder.com/150" }}
            style={styles.image}
          />
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.unpassButton}
            onPress={() => handleConfirm("ไม่ผ่าน")}
          >
            <Text style={styles.buttonText}>ไม่ผ่าน</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.passButton}
            onPress={() => handleConfirm("ผ่าน")}
          >
            <Text style={styles.buttonText}>ผ่าน</Text>
          </TouchableOpacity>
        </View>

        {/* Modal for confirmation */}
        <Modal
          transparent={true}
          visible={modalVisible}
          animationType="slide"
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalBackground}>
            <View style={styles.modalContainer}>
              <Text style={styles.modalText}>
                {`คุณยืนยันที่จะให้ user คนนี้ ${result}?`}
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
    padding: 10,
    marginHorizontal: "25%",
  },
  userInfo: {
    fontSize: 24,
    marginVertical: 10,
  },
  imageContainer: {
    alignItems: "center",
    marginVertical: 20,
  },
  image: {
    width: 300,
    height: 300,
    borderRadius: 75,
    borderWidth: 2,
    borderColor: "#ccc",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 20,
  },
  passButton: {
    padding: 10,
    backgroundColor: "green",
    borderRadius: 5,
    alignItems: "center",
  },
  unpassButton: {
    padding: 10,
    backgroundColor: "red",
    borderRadius: 5,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
    margin: 10,
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
  modalText: {
    fontSize: 18,
    marginBottom: 20,
    textAlign: "center",
  },
  confirmButton: {
    backgroundColor: "green",
    padding: 10,
    borderRadius: 5,
    width: 100,
    alignItems: "center",
  },
  confirmButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
