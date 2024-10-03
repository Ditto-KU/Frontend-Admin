import React, { useState } from "react";
import { View, Text, Picker, TouchableOpacity, Modal, StyleSheet, TouchableWithoutFeedback } from "react-native";
import Datepicker from "./DatePicker";

export default function FilterOrder({ modalVisible, toggleModal }) {
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedCanteen, setSelectedCanteen] = useState("");
  const [selectedRestaurant, setSelectedRestaurant] = useState("");
  const [includeRequester, setIncludeRequester] = useState(false);
  const [includeWalker, setIncludeWalker] = useState(false);

  const handleSubmit = () => {
    const filterData = {
      date: selectedDate,
      canteen: selectedCanteen,
      restaurant: selectedRestaurant,
      requester: includeRequester ? "included" : "excluded",
      walker: includeWalker ? "included" : "excluded",
    };

    // Send filterData to the backend
    fetch('YOUR_BACKEND_URL', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(filterData),
    })
      .then(response => response.json())
      .then(data => {
        console.log('Success:', data);
        toggleModal(); // Close the modal after submitting
      })
      .catch((error) => {
        console.error('Error:', error);
        toggleModal(); // Close the modal even if there's an error
      });
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
              {/* Datepicker component */}
              <Datepicker />

              <Text>โรงอาหาร</Text>
              <Picker
                selectedValue={selectedCanteen}
                onValueChange={(itemValue) => setSelectedCanteen(itemValue)}
                style={styles.dropdownPicker}
              >
                <Picker.Item label="Select Canteen" value="" />
                {/* Add your canteen options here */}
                <Picker.Item label="Canteen A" value="Canteen A" />
                <Picker.Item label="Canteen B" value="Canteen B" />
              </Picker>

              <Text>ร้านอาหาร</Text>
              {selectedCanteen ? (
                <Picker
                  selectedValue={selectedRestaurant}
                  onValueChange={(itemValue) => setSelectedRestaurant(itemValue)}
                  style={styles.dropdownPicker}
                >
                  <Picker.Item label="Select Restaurant" value="" />
                  {/* Add restaurant options here */}
                  <Picker.Item label="Restaurant 1" value="Restaurant 1" />
                  <Picker.Item label="Restaurant 2" value="Restaurant 2" />
                </Picker>
              ) : (
                <Text style={styles.disabledText}>Please select a canteen first</Text>
              )}

              {/* Requester Checkbox */}
              <View style={styles.checkboxContainer}>
                <Text>Requester</Text>
                <input
                  type="checkbox"
                  checked={includeRequester}
                  onChange={() => setIncludeRequester(!includeRequester)}
                />
              </View>

              {/* Walker Checkbox */}
              <View style={styles.checkboxContainer}>
                <Text>Walker</Text>
                <input
                  type="checkbox"
                  checked={includeWalker}
                  onChange={() => setIncludeWalker(!includeWalker)}
                />
              </View>

              <TouchableOpacity onPress={handleSubmit} style={styles.submitButton}>
                <Text style={{ color: '#fff' }}>Submit</Text>
              </TouchableOpacity>
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
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0)', // Add this to allow clicking outside to close
  },
  modalContainer: {
    width: '30%', // Adjusted to be more usable
    height: '100%',
    padding: 20,
    backgroundColor: '#FFF',
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
  },
  dropdownPicker: {
    height: 50,
    width: '100%',
    marginBottom: 16,
  },
  submitButton: {
    marginTop: 16,
    backgroundColor: '#007BFF',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  disabledText: {
    color: '#999',
    fontStyle: 'italic',
    marginBottom: 16,
  },
});
