import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native'; // Import navigation hook
import Head from "../components/Header";

export default function Cafeteria() {
  const navigation = useNavigation(); // Hook to access navigation

  // Function to handle button press and navigate to RestaurantInCafeteria screen
  const handleCafeteriaPress = (cafeteriaName) => {
    navigation.navigate("RestaurantInCafeteria", { cafeteriaName }); // Navigate and pass cafeteria name
  };

  return (
    <View style={styles.CA_container}>
      <Head />
      <View style={styles.CA_header}>
        <Text style={styles.CA_title}>Cafeteria List</Text>
      </View>
      {/* Cafeteria Buttons in Column */}
      <View style={styles.CA_column}>
        <TouchableOpacity
          style={styles.CA_button}
          onPress={() => handleCafeteriaPress("โรงอาหารกลาง1(บาร์ใหม่)")}
        >
          <Text style={styles.CA_buttonText}>โรงอาหารกลาง1(บาร์ใหม่)</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.CA_button}
          onPress={() => handleCafeteriaPress("โรงอาหารกลาง2(บาร์ใหม่กว่า)")}
        >
          <Text style={styles.CA_buttonText}>โรงอาหารกลาง2(บาร์ใหม่กว่า)</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.CA_button}
          onPress={() => handleCafeteriaPress("โรงอาหารคณะวิศวกรรมศาสตร์(บาร์วิศวะ)")}
        >
          <Text style={styles.CA_buttonText}>โรงอาหารคณะวิศวกรรมศาสตร์(บาร์วิศวะ)</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.CA_button}
          onPress={() => handleCafeteriaPress("โรงอาหารคณะวิทยาศาสตร์(บาร์วิทย์)")}
        >
          <Text style={styles.CA_buttonText}>โรงอาหารคณะวิทยาศาสตร์(บาร์วิทย์)</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// Styles for Cafeteria with column layout (no grid)
const styles = StyleSheet.create({
  CA_container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#F0F0F0", // Softer background for better contrast
  },
  CA_header: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
    width: "100%", // Full width for balance
  },
  CA_title: {
    fontSize: 36,
    fontWeight: "600",
    color: "#333",
    textAlign: "center",
    marginBottom: 20,
  },
  CA_column: {
    flex: 1,
    justifyContent: "flex-start", // Align buttons to the top
    alignItems: "center", // Center buttons horizontally
    paddingVertical: 10,
  },
  CA_button: {
    width: "70%", // Occupies most of the width of the screen
    paddingVertical: 36, // Increase padding for better touchable area
    marginVertical: 16,
    backgroundColor: "#FFF",
    borderRadius: 12, // Keep slightly rounded corners
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4, // Light elevation for depth
  },
  CA_buttonText: {
    fontSize: 24, // Increased font size for better readability
    // fontWeight: "bold", // Bolder font for emphasis
    color: "#444", // Soft color for the text
    textAlign: "center",
  },
});
