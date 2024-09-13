import React, { useState } from "react";
import { View, Text, Picker, TouchableOpacity, Modal, StyleSheet, TouchableWithoutFeedback, ScrollView, Switch } from "react-native";
import DatePicker from './DatePicker';

export default function FilterComponent({ modalVisible, toggleModal }) {
  const [selectedCanteen, setSelectedCanteen] = useState("");
  const [selectedRestaurant, setSelectedRestaurant] = useState("");
  const [includeRequester, setIncludeRequester] = useState(true); // Requester switch state
  const [includeWalker, setIncludeWalker] = useState(true); // Walker switch state

  const handleSubmit = () => {
    const filterData = {
      canteen: selectedCanteen,
      restaurant: selectedRestaurant,
      requester: includeRequester ? "included" : "excluded",
      walker: includeWalker ? "included" : "excluded",
    };
    console.log(filterData);
    toggleModal(); // Close the modal after submission
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
                <DatePicker />

                {/* <Text>โรงอาหาร</Text> */}
                <Picker
                  selectedValue={selectedCanteen}
                  onValueChange={(itemValue) => setSelectedCanteen(itemValue)}
                  style={styles.dropdownPicker}
                >
                  <Picker.Item label="Select Canteen" value="" />
                  <Picker.Item label="Canteen A" value="Canteen A" />
                  <Picker.Item label="Canteen B" value="Canteen B" />
                </Picker>

                {/* <Text>ร้านอาหาร</Text> */}
                {selectedCanteen ? (
                  <Picker
                    selectedValue={selectedRestaurant}
                    onValueChange={(itemValue) => setSelectedRestaurant(itemValue)}
                    style={styles.dropdownPicker}
                  >
                    <Picker.Item label="Select Restaurant" value="" />
                    <Picker.Item label="Restaurant 1" value="Restaurant 1" />
                    <Picker.Item label="Restaurant 2" value="Restaurant 2" />
                  </Picker>
                ) : (
                  <Text style={styles.disabledText}>Please select a canteen before restaurant</Text>
                )}

                {/* Requester Switch */}
                <View style={styles.switchContainer}>
                  <Text style={styles.ChooseUserText}>Requester</Text>
                  <Switch
                    value={includeRequester}
                    onValueChange={setIncludeRequester}
                  />
                </View>

                {/* Walker Switch */}
                <View style={styles.switchContainer}>
                  <Text style={styles.ChooseUserText}>Walker</Text>
                  <Switch
                    value={includeWalker}
                    onValueChange={setIncludeWalker}
                  />
                </View>

                <TouchableOpacity onPress={handleSubmit} style={styles.submitButton}>
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
    justifyContent: 'flex-start',
    alignItems: 'flex-end', // Align to the right side of the screen
    backgroundColor: 'rgba(0, 0, 0, 0.2)', // Transparent black to dim background
  },
  modalContainer: {
    width: '30%', // Set the width of the filter to 30% of the screen
    height: '100%', // Full height for the filter modal
    padding: 20,
    backgroundColor: '#FFF',
    borderTopLeftRadius: 20,
    borderBottomLeftRadius: 20,
  },
  scrollContainer: {
    paddingBottom: 20,
  },
  dropdownPicker: {
    height: 50,
    width: '100%',
    marginTop: 20,
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 16,
  },
  ChooseUserText: {
    fontSize: 20,
  },
  submitButton: {
    marginTop: 20,
    backgroundColor: '#007BFF',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  SubmitText: {
    color: '#FFF',
    fontSize: 24,
  },
  disabledText: {
    color: '#999',
    fontStyle: 'italic',
    marginTop: 16,
    fontSize: 20,
  },
});
