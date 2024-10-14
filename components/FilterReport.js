import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
  TouchableWithoutFeedback,
  Animated, // Import Animated API
  Dimensions,
  Platform,
} from "react-native";

export default function FilterReport({
  modalVisible,
  toggleModal,
  applyFilter, // Function to apply filters and send them back
}) {
  const [selectedDate, setSelectedDate] = useState(""); // Date filter
  const dateInputRef = useRef(null); // Create a ref for the date input (web only)
  const slideAnim = useRef(
    new Animated.Value(Dimensions.get("window").width)
  ).current; // Set initial value to off-screen right

  // Slide-in animation
  useEffect(() => {
    if (modalVisible) {
      Animated.timing(slideAnim, {
        toValue: 0, // Slide to 0 (fully visible)
        duration: 300,
        useNativeDriver: true,
      }).start();

      // Auto-trigger the date picker on web when modal opens
      if (Platform.OS === "web" && dateInputRef.current) {
        dateInputRef.current.click(); // Programmatically trigger a click on the date input
      }
    } else {
      Animated.timing(slideAnim, {
        toValue: Dimensions.get("window").width, // Slide out to the right
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [modalVisible]);

  // Handle date change for mobile
  const handleDateChangeMobile = (event, date) => {
    if (date) {
      setSelectedDate(date.toISOString().split("T")[0]); // Set selected date for mobile
    }
  };

  // Handle date change for web
  const handleDateChangeWeb = (event) => {
    setSelectedDate(event.target.value); // Set the selected date from input field on web
  };

  // Function to reset filters and close the modal
  const handleReset = () => {
    setSelectedDate(""); // Clear selected date
    applyFilter(null);
    toggleModal(); // Close the modal
  };

  // Submit filter criteria to parent
  const handleSubmit = () => {
    const filterData = {
      date: selectedDate, // Only the selected date filter
    };
    applyFilter(filterData); // Pass the filter data back to the parent component
    toggleModal(); // Close the modal after submitting
  };

  return (
    <Modal
      visible={modalVisible}
      transparent={true}
      animationType="none"
      onRequestClose={toggleModal}
    >
      <TouchableWithoutFeedback onPress={toggleModal}>
        <View style={styles.modalOverlay}>
          <TouchableWithoutFeedback onPress={() => {}}>
            <Animated.View
              style={[
                styles.modalContainer,
                { transform: [{ translateX: slideAnim }] },
              ]}
            >
              <Text style={styles.filterTitle}>Select Date</Text>
              <input
                ref={dateInputRef} // Assign the ref to this input
                type="date"
                value={selectedDate}
                onChange={handleDateChangeWeb} // Handle change for web
                style={styles.webDateInput} // Style for the web date input
              />
              <View style={styles.buttonRow}>
                <TouchableOpacity
                  onPress={handleSubmit}
                  style={styles.submitButton}
                >
                  <Text style={{ color: "#fff" }}>Submit</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={handleReset}
                  style={styles.resetButton}
                >
                  <Text style={{ color: "#fff" }}>Reset</Text>
                </TouchableOpacity>
              </View>
            </Animated.View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "flex-end",
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Allow clicking outside to close
  },
  modalContainer: {
    width: "20%", // Narrow the width
    height: "100%", // Set height to 100% to fill the screen
    padding: 20,
    backgroundColor: "#FFF",
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
    position: "absolute",
    right: 0, // Ensure it starts off to the right
  },
  filterTitle: {
    fontSize: 18,
    marginBottom: 20,
    fontWeight: "bold",
  },
  webDateInput: {
    padding: 10,
    fontSize: 16,
    width: "100%",
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 20,
    marginRight: 50,
  },
  submitButton: {
    marginTop: 16,
    backgroundColor: "#007BFF",
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  resetButton: {
    marginTop: 16,
    backgroundColor: "#FF6347",
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonRow: {
    flexDirection: "column",
    marginTop: 20,
  },
});
