import React, { useState } from 'react';
import { View, Text, Button, StyleSheet, Modal, TouchableOpacity } from 'react-native';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

export default function DatePickerDropdown() {
  const [selectedDate, setSelectedDate] = useState('');
  const [isDatePickerVisible, setDatePickerVisible] = useState(false);

  const handleDateChange = (date) => {
    const formattedDate = date.toISOString().split('T')[0]; // Format as YYYY-MM-DD
    setSelectedDate(formattedDate);
    setDatePickerVisible(false); // Close the modal after selecting the date
  };

  const toggleDatePicker = () => {
    setDatePickerVisible(!isDatePickerVisible);
  };

  return (
    <View style={styles.container}>
      {/* <Text style={styles.label}>วันที่</Text> */}

      {/* Date Picker Button */}
      <TouchableOpacity
        style={styles.dropdownButton}
        onPress={toggleDatePicker}
      >
        <Text style={styles.dropdownButtonText}>
          {selectedDate ? selectedDate : 'Select Date'}
        </Text>
      </TouchableOpacity>

      {/* Conditional rendering of the DatePicker component */}
      {isDatePickerVisible && (
        <View style={styles.datePickerDropdown}>
          <DatePicker
            selected={selectedDate ? new Date(selectedDate) : null}
            onChange={handleDateChange}
            inline
            dateFormat="yyyy-MM-dd"
          />
          <Button title="Close" onPress={() => setDatePickerVisible(false)} />
        </View>
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
  label: {
    fontSize: 16,
    marginBottom: 10,
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
  datePickerDropdown: {
    marginTop: 10, // Push the DatePicker dropdown below the button
    backgroundColor: '#FFF',
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    zIndex: 1000, // Ensure the datepicker is above other content
  },
});
