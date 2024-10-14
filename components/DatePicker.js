import React, { useState } from 'react';
import { View, Text, Button, StyleSheet, Modal, TouchableOpacity, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker'; // For mobile

export default function DatePickerDropdown() {
  const [selectedDate, setSelectedDate] = useState(null); // To store selected date
  const [isDatePickerVisible, setDatePickerVisible] = useState(false); // Controls the visibility of the date picker

  // Handle date change for mobile and update the state with the formatted date
  const handleDateChange = (event, date) => {
    if (date) {
      const formattedDate = date.toISOString().split('T')[0]; // Format as YYYY-MM-DD
      setSelectedDate(formattedDate); // Set selected date
    }
    setDatePickerVisible(false); // Close date picker after selection
  };

  // Function to handle date selection for web (HTML5 date input)
  const handleWebDateChange = (event) => {
    const webSelectedDate = event.target.value;
    setSelectedDate(webSelectedDate); // Set selected date for web
  };

  // Toggle the date picker visibility
  const toggleDatePicker = () => {
    if (Platform.OS === 'web') {
      // For web, we create an input element to handle date picking
      const input = document.createElement('input');
      input.type = 'date'; // Use HTML5 date input
      input.onchange = handleWebDateChange; // Attach the date change handler for web
      input.click(); // Simulate a click to open the date picker
    } else {
      // For mobile, show the native date picker
      setDatePickerVisible(true); // Open date picker modal on mobile
    }
  };

  return (
    <View style={styles.container}>
      {/* Date Picker Button */}
      <TouchableOpacity
        style={styles.dropdownButton}
        onPress={toggleDatePicker} // Opens the date picker
      >
        <Text style={styles.dropdownButtonText}>
          {selectedDate ? selectedDate : 'Select Date'}
        </Text>
      </TouchableOpacity>

      {/* Modal for displaying DateTimePicker on mobile (Android/iOS) */}
      {Platform.OS !== 'web' && isDatePickerVisible && (
        <Modal visible={isDatePickerVisible} transparent={true} animationType="slide">
          <View style={styles.modalContainer}>
            <View style={styles.datePickerContainer}>
              <DateTimePicker
                mode="date"
                value={selectedDate ? new Date(selectedDate) : new Date()} // Display the selected date or current date
                onChange={handleDateChange} // Update the state when the date changes
              />
              <Button title="Close" onPress={() => setDatePickerVisible(false)} />
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
}

// Styles for the component
const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginTop: 50,
    width: '100%',
  },
  dropdownButton: {
    height: 50,
    width: "100%",
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    backgroundColor: '#FFF',
  },
  dropdownButtonText: {
    fontSize: 16,
    color: '#333',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  datePickerContainer: {
    backgroundColor: '#FFF',
    padding: 20,
    borderRadius: 10,
  },
});
