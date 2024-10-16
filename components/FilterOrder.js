import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  Picker,
  TouchableOpacity,
  Modal,
  StyleSheet,
  TouchableWithoutFeedback,
  Alert,
  Animated, // Import Animated API
  Dimensions,
} from "react-native";
import Datepicker from "./DatePicker"; // Ensure you have this component or implement it

export default function FilterOrder({
  modalVisible,
  toggleModal,
  applyFilter, // Function to apply filters and send them back
}) {
  // Initial states for filters
  const initialStatusFilter = {
    waitingAdmin: false,
    inProgress: false,
    lookingForWalker: false,
    completed: false,
    cancelled: false,
  };

  const [selectedDate, setSelectedDate] = useState("");
  const [selectedCanteen, setSelectedCanteen] = useState("");
  const [canteens, setCanteens] = useState([]); // Store canteen data
  const [selectedRestaurant, setSelectedRestaurant] = useState("");
  const [restaurantList, setRestaurantList] = useState([]); // Store restaurant data
  const [statusFilter, setStatusFilter] = useState(initialStatusFilter); // Order status filters
  const [loading, setLoading] = useState(false); // Loading state
  const [error, setError] = useState(null); // Error state
  const authToken =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdXRoSWQiOiJhZG1pbjIiLCJpYXQiOjE3MjgxMjg1MDIsImV4cCI6MTczNjc2ODUwMn0.gqSAFiuUiAAnZHupDmJdlOqlKz2rqPxAbPVffcKt1Is";

  const slideAnim = useRef(new Animated.Value(Dimensions.get("window").width)).current; // Set initial value to off-screen right

  // Slide-in animation
  useEffect(() => {
    if (modalVisible) {
      Animated.timing(slideAnim, {
        toValue: 0, // Slide to 0 (fully visible)
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: Dimensions.get("window").width, // Slide out to the right
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [modalVisible]);

  // Fetch canteen data from the API
  useEffect(() => {
    const fetchCanteenData = async () => {
      setLoading(true); // Start loading
      try {
        let headersList = {
          Accept: "*/*",
          Authorization: `Bearer ${authToken}`,
        };

        let response = await fetch(
          `https://ku-man-api.vimforlanie.com/admin/canteen`,
          {
            method: "GET",
            headers: headersList,
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json(); // Parse the response to JSON
        setCanteens(data); // Set the canteen data to the state
      } catch (error) {
        console.error("Error fetching canteen data:", error);
        setError(error.message);
        Alert.alert("Error", error.message);
      } finally {
        setLoading(false); // Stop loading after fetching the data
      }
    };

    fetchCanteenData(); // Fetch canteens on component mount
  }, []);

  // Fetch restaurant data based on canteenId
  useEffect(() => {
    if (!selectedCanteen) return; // Exit if no canteen is selected

    const fetchRestaurantData = async () => {
      setLoading(true); // Start loading
      try {
        let headersList = {
          Accept: "*/*",
          Authorization: `Bearer ${authToken}`,
        };
        let response = await fetch(
          `https://ku-man-api.vimforlanie.com/admin/canteen/shop?canteenId=${selectedCanteen}`,
          {
            method: "GET",
            headers: headersList,
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json(); // Parse the response to JSON
        setRestaurantList(data); // Update state with restaurant data
      } catch (error) {
        console.error("Error fetching restaurant data:", error);
        setError(error.message); // Handle error
        Alert.alert("Error", error.message);
      } finally {
        setLoading(false); // Stop loading after fetching the data
      }
    };

    fetchRestaurantData(); // Fetch restaurants when selectedCanteen changes
  }, [selectedCanteen]);

  // Function to reset filters and close the modal
  const handleReset = () => {
    setSelectedDate(""); // Clear selected date
    setSelectedCanteen(""); // Reset canteen
    setSelectedRestaurant(""); // Reset restaurant
    setStatusFilter(initialStatusFilter); // Reset status filters
    applyFilter(null); 
    toggleModal(); // Close the modal
  };
  

  // Submit filter criteria to parent (Order.js)
  const handleSubmit = () => {
    const filterData = {
      date: selectedDate,
      canteen: selectedCanteen,
      restaurant: selectedRestaurant,
      statusFilter, // Order status filter
    };

    applyFilter(filterData); // Pass the filter data back to the parent component (Order.js)
    toggleModal(); // Close the modal after submitting
  };

  return (
    <Modal
      visible={modalVisible}
      transparent={true}
      animationType="none" // Disable built-in animation since we are using custom
      onRequestClose={toggleModal}
    >
      <TouchableWithoutFeedback onPress={toggleModal}>
        <View style={styles.modalOverlay}>
          <TouchableWithoutFeedback onPress={() => {}}>
            <Animated.View
              style={[styles.modalContainer, { transform: [{ translateX: slideAnim }] }]}
            >
              {/* Datepicker component */}
              {/* <Datepicker
                selectedDate={selectedDate}
                onDateChange={setSelectedDate}
              /> */}

              <Text>โรงอาหาร</Text>
              <Picker
                selectedValue={selectedCanteen} // The selected canteen ID will be stored here
                onValueChange={(itemValue) => setSelectedCanteen(itemValue)} // Set the numeric ID as the selected canteen
                style={styles.dropdownPicker}
              >
                <Picker.Item label="Select Canteen" value="" />
                {canteens.map((canteen) => (
                  <Picker.Item
                    key={canteen.id} // Unique key for each item
                    label={canteen.name} // Display the canteen name in the dropdown
                    value={canteen.canteenId} // Use the canteenId as the value
                  />
                ))}
              </Picker>

              <Text>ร้านอาหาร</Text>
              {selectedCanteen ? (
                <Picker
                  selectedValue={selectedRestaurant} // The selected restaurant ID will be stored here
                  onValueChange={(itemValue) => setSelectedRestaurant(itemValue)} // Set the restaurant's shopId as the selected restaurant
                  style={styles.dropdownPicker}
                >
                  <Picker.Item label="Select Restaurant" value="" />
                  {restaurantList.map((restaurant) => (
                    <Picker.Item
                      key={restaurant.shopId} // Unique key for each restaurant
                      label={restaurant.shopName} // Display the shop name in the dropdown
                      value={restaurant.shopId} // Use the shopId as the value
                    />
                  ))}
                </Picker>
              ) : (
                <Text style={styles.disabledText}>
                  Please select a canteen first
                </Text>
              )}

              {/* Order Status Checkboxes */}
              <Text>Order Status</Text>
              {Object.keys(statusFilter).map((status) => (
                <View style={styles.checkboxContainer} key={status}>
                  <Text>{status}</Text>
                  <input
                    type="checkbox"
                    checked={statusFilter[status]}
                    onChange={() =>
                      setStatusFilter({
                        ...statusFilter,
                        [status]: !statusFilter[status],
                      })
                    }
                  />
                </View>
              ))}

              <View style={styles.buttonRow}>
                <TouchableOpacity onPress={handleSubmit} style={styles.submitButton}>
                  <Text style={{ color: "#fff" }}>Submit</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={handleReset} style={styles.resetButton}>
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
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Add this to allow clicking outside to close
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
  dropdownPicker: {
    height: 50,
    width: "100%",
    marginBottom: 16,
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
    backgroundColor: "#FF6347", // Use a different color for reset button
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonRow: {
    flexDirection: "column",
    // justifyContent: "space-between",
    marginTop: 20,
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  disabledText: {
    color: "#999",
    fontStyle: "italic",
    marginBottom: 16,
  },
});
