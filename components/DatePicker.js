import React, { useState } from 'react';
import { View, Text, Button, StyleSheet, TouchableOpacity } from 'react-native-web'; // Ensure you're using react-native-web
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

export default function DatePickerDropdown() {
  const [selectedDate, setSelectedDate] = useState(null);
  const [isDatePickerVisible, setDatePickerVisible] = useState(false);

  const handleDateChange = (date) => {
    const formattedDate = date.toISOString().split('T')[0]; // Format date as YYYY-MM-DD
    setSelectedDate(formattedDate);
    setDatePickerVisible(false); // Close modal after selecting a date
  };

  const toggleDatePicker = () => {
    setDatePickerVisible(!isDatePickerVisible);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.dropdownButton}
        onPress={toggleDatePicker}
      >
        <Text style={styles.dropdownButtonText}>
          {selectedDate ? selectedDate : 'Select Date'}
        </Text>
      </TouchableOpacity>

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
