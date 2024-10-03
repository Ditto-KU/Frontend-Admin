import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
  TouchableWithoutFeedback,
  ScrollView,
  Switch,
  CheckBox,
  Picker,
  Alert,
} from "react-native";
import DatePicker from "./DatePicker";

export default function FilterComponent({ modalVisible, toggleModal }) {
  const [selectedDate, setSelectedDate] = useState(""); // State to hold selected order date
  const [canteens, setCanteens] = useState([]);
  const [restaurants, setRestaurants] = useState([]);
  const [selectedCanteen, setSelectedCanteen] = useState("");
  const [selectedRestaurant, setSelectedRestaurant] = useState("");
  //   const [includeRequester, setIncludeRequester] = useState(true);
  //   const [includeWalker, setIncludeWalker] = useState(true);
  const [sortPrice, setSortPrice] = useState(""); // State to track sort price (asc/desc)

  // Order status checkboxes
  const [orderStatus, setOrderStatus] = useState({
    lookingForWalker: false,
    inProgress: false,
    completed: false,
    cancelled: false,
    waitingAdmin: false,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch canteen data on mount
  useEffect(() => {
    const fetchCanteens = async () => {
      try {
        const response = await fetch(
          "https://ku-man-api.vimforlanie.com/admin/canteen",
          {
            method: "GET",
            headers: { Accept: "*/*" },
          }
        );

        if (!response.ok)
          throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        setCanteens(data);
      } catch (error) {
        setError(error.message);
        Alert.alert("Error", error.message);
      } finally {
        setLoading(false);
      }
    };

    // Set an interval to fetch data every second
    const intervalId = setInterval(fetchCanteens, 1000); // Fetch every 1000 ms (1 second)

    // Clean up the interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  // Fetch restaurant data when a canteen is selected
  useEffect(() => {
    if (!selectedCanteen) return;

    const fetchRestaurants = async () => {
      try {
        const response = await fetch(
          `https://ku-man-api.vimforlanie.com/admin/canteen/shop?canteenId=${selectedCanteen}`,
          {
            method: "GET",
            headers: { Accept: "*/*" },
          }
        );

        if (!response.ok)
          throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        setRestaurants(data);
      } catch (error) {
        setError(error.message);
        Alert.alert("Error", error.message);
      } finally {
        setLoading(false);
      }
    };

    // Set an interval to fetch data every second
    const intervalId = setInterval(fetchRestaurants, 1000); // Fetch every 1000 ms (1 second)

    // Clean up the interval on component unmount
    return () => clearInterval(intervalId);
  }, [selectedCanteen]);

  // Handle form submission
  const handleSubmit = async () => {
    // Construct query parameters based on selected filters
    const queryParams = new URLSearchParams();

    if (selectedCanteen) queryParams.append("canteenId", selectedCanteen);
    if (selectedRestaurant) queryParams.append("shopId", selectedRestaurant);
    if (sortPrice) queryParams.append("sortPrice", sortPrice);

    const selectedOrderStatuses = Object.keys(orderStatus).filter(
      (status) => orderStatus[status]
    );
    if (selectedOrderStatuses.length > 0) {
      queryParams.append("orderStatus", selectedOrderStatuses.join(",")); // Pass order statuses as comma-separated values
    }

    // // Add other filter options
    // if (includeRequester) queryParams.append("requester", "included");
    // if (includeWalker) queryParams.append("walker", "included");

    if (selectedDate) queryParams.append("orderDate", selectedDate); // Add the selected order date to the query

    // Construct the URL with query params
    const url = `https://ku-man-api.vimforlanie.com/admin/order/filter?${queryParams.toString()}`;

    console.log("Request URL:", url); // Debug the URL

    let headersList = {
      Accept: "application/json",
      "Content-Type": "application/json",
    };

    try {
      // Perform the API call with GET request
      let response = await fetch(url, {
        method: "GET",
        headers: headersList,
      });

      // Handle the response
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      let data = await response.json(); // Parse response as JSON
      console.log("Filtered Data:", data); // Output the filtered data
    } catch (error) {
      console.error("Error fetching filtered data:", error);
    }
    

    toggleModal(); // Close the modal after submission
  };

  // Toggle order status checkboxes
  const toggleOrderStatus = (status) => {
    setOrderStatus((prev) => ({
      ...prev,
      [status]: !prev[status],
    }));
  };

  return (
    <Modal
      visible={modalVisible}
      transparent={true}
      animationType="slide"
      onRequestClose={toggleModal}
    >
      <TouchableWithoutFeedback onPress={toggleModal}>
        <View style={styles.modalOverlay}>
          <TouchableWithoutFeedback onPress={() => {}}>
            <View style={styles.modalContainer}>
              <ScrollView contentContainerStyle={styles.scrollContainer}>
                {/* Date Picker */}
                <DatePicker onDateSelected={setSelectedDate} />

                {/* Canteen Picker */}
                <Picker
                  selectedValue={selectedCanteen}
                  onValueChange={(itemValue) => setSelectedCanteen(itemValue)}
                  style={styles.dropdownPicker}
                >
                  <Picker.Item label="Select Canteen" value="" />
                  {canteens.map((canteen) => (
                    <Picker.Item
                      key={canteen.canteenId}
                      label={canteen.name}
                      value={canteen.canteenId}
                    />
                  ))}
                </Picker>

                {/* Restaurant Picker */}
                {selectedCanteen ? (
                  <Picker
                    selectedValue={selectedRestaurant}
                    onValueChange={(itemValue) =>
                      setSelectedRestaurant(itemValue)
                    }
                    style={styles.dropdownPicker}
                  >
                    <Picker.Item label="Select Restaurant" value="" />
                    {restaurants.map((restaurant) => (
                      <Picker.Item
                        key={restaurant.shopId}
                        label={restaurant.shopName}
                        value={restaurant.shopId}
                      />
                    ))}
                  </Picker>
                ) : (
                  <Text style={styles.disabledText}>
                    Please select a canteen before restaurant
                  </Text>
                )}

                {/* Order Status Checkboxes */}
                <Text style={styles.sectionTitle}>Order Status</Text>
                {Object.keys(orderStatus).map((status) => (
                  <View key={status} style={styles.checkboxContainer}>
                    <Text style={styles.checkboxLabel}>{status}</Text>
                    <CheckBox
                      value={orderStatus[status]}
                      onValueChange={() => toggleOrderStatus(status)}
                    />
                  </View>
                ))}

                {/* Sort Price */}
                <Text style={styles.sectionTitle}>Sort by Price</Text>
                <Picker
                  selectedValue={sortPrice}
                  onValueChange={(value) => setSortPrice(value)}
                  style={styles.dropdownPicker}
                >
                  <Picker.Item label="Select Sort Price" value="" />
                  <Picker.Item label="Ascending" value="asc" />
                  <Picker.Item label="Descending" value="desc" />
                </Picker>

                {/* Requester Switch */}
                {/* <View style={styles.switchContainer}>
                  <Text style={styles.ChooseUserText}>Requester</Text>
                  <Switch
                    value={includeRequester}
                    onValueChange={setIncludeRequester}
                  />
                </View> */}

                {/* Walker Switch */}
                {/* <View style={styles.switchContainer}>
                  <Text style={styles.ChooseUserText}>Walker</Text>
                  <Switch
                    value={includeWalker}
                    onValueChange={setIncludeWalker}
                  />
                </View> */}

                <TouchableOpacity
                  onPress={handleSubmit}
                  style={styles.submitButton}
                >
                  <Text style={styles.SubmitText}>Submit</Text>
                </TouchableOpacity>
              </ScrollView>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

// Styles for FilterComponent
const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "flex-end",
    backgroundColor: "rgba(0, 0, 0, 0.2)", // Transparent black to dim background
  },
  modalContainer: {
    width: "30%",
    height: "100%",
    padding: 20,
    backgroundColor: "#FFF",
    borderTopLeftRadius: 20,
    borderBottomLeftRadius: 20,
  },
  scrollContainer: {
    paddingBottom: 20,
  },
  dropdownPicker: {
    height: 50,
    width: "100%",
    marginTop: 20,
  },
  //   switchContainer: {
  //     flexDirection: 'row',
  //     justifyContent: 'space-between',
  //     alignItems: 'center',
  //     marginTop: 16,
  //   },
  ChooseUserText: {
    fontSize: 20,
  },
  submitButton: {
    marginTop: 20,
    backgroundColor: "#007BFF",
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  SubmitText: {
    color: "#FFF",
    fontSize: 24,
  },
  disabledText: {
    color: "#999",
    fontStyle: "italic",
    marginTop: 16,
    fontSize: 20,
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 5,
  },
  checkboxLabel: {
    fontSize: 18,
    marginRight: 10,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginVertical: 10,
  },
});
