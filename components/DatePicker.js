import React, { useState } from 'react';
import { View, Text, Button, StyleSheet, Modal, TouchableOpacity } from 'react-native';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

export default function CustomDatePickerDropdown() {
  const [selectedDate, setSelectedDate] = useState('');
  const [isModalVisible, setModalVisible] = useState(false);

  const handleDateChange = (date) => {
    const formattedDate = date.toISOString().split('T')[0]; // Format as YYYY-MM-DD
    setSelectedDate(formattedDate);
    setModalVisible(false); // Close the modal after selecting the date
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>วันที่</Text>

      {/* Custom Dropdown */}
      <TouchableOpacity
        style={styles.dropdownButton}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.dropdownButtonText}>
          {selectedDate ? selectedDate : 'Select Date'}
        </Text>
      </TouchableOpacity>

      {/* Modal for Date Picker */}
      {isModalVisible && (
        <View style={styles.datePickerDropdown}>
          <DatePicker
            selected={selectedDate ? new Date(selectedDate) : null}
            onChange={handleDateChange}
            inline
            dateFormat="yyyy-MM-dd"
          />

          <Button title="Close" onPress={() => setModalVisible(false)} />
        </View>
      )}
    </View>
  );
}

// Styles for the component
const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 50,
  },
  label: {
    fontSize: 16,
    marginBottom: 10,
  },
  dropdownButton: {
    height: 50,
    width: 250,
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
  datePickerDropdown: {
    position: 'absolute',
    top: 60, // Position the dropdown below the button
    backgroundColor: '#FFF',
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    zIndex: 1000, // Ensure the datepicker is above other content
  },
});
