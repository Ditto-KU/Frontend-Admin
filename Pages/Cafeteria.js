import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  FlatList,
  Dimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Head from "../components/Header";
import { ScrollView } from 'react-native-gesture-handler';

export default function Cafeteria() {
  const navigation = useNavigation();
  const [canteens, setCanteens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const authToken =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdXRoSWQiOiJhZG1pbjIiLCJpYXQiOjE3MjgxMjg1MDIsImV4cCI6MTczNjc2ODUwMn0.gqSAFiuUiAAnZHupDmJdlOqlKz2rqPxAbPVffcKt1Is";

  // Handle button press and navigate to RestaurantInCafeteria screen
  const handleCafeteriaPress = (canteenId, cafeteriaName) => {
    navigation.navigate("RestaurantInCafeteria", { canteenId, cafeteriaName });
  };

  // Fetch canteen data from the API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const headersList = {
          Accept: "*/*",
          Authorization: `Bearer ${authToken}`,
        };

        const response = await fetch("https://ku-man-api.vimforlanie.com/admin/canteen", {
          method: "GET",
          headers: headersList,
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setCanteens(data);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError(error.message);
        Alert.alert("Error", error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Render loading state
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Loading Cafeterias...</Text>
      </View>
    );
  }

  // Render error state
  if (error) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Error: {error}</Text>
      </View>
    );
  }

  // Render each cafeteria item
  const renderCafeteriaItem = ({ item }) => (
    <TouchableOpacity
      style={styles.CA_listItem}
      onPress={() => handleCafeteriaPress(item.canteenId, item.name)}
    >
      <Text style={styles.CA_listText}>{item.name}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.CA_container}>
      <Head />
      <View style={styles.CA_header}>
        <Text style={styles.CA_title}>Cafeteria List</Text>
      </View>

      {/* FlatList for rendering cafeteria buttons */}
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <FlatList
          data={canteens}
          renderItem={renderCafeteriaItem}
          keyExtractor={(item) => item.canteenId.toString()}
          contentContainerStyle={styles.CA_listContainer}
        />
      </ScrollView>
    </View>
  );
}

// Styles for the Cafeteria component
const styles = StyleSheet.create({
  CA_container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#F5F5F5",
  },
  CA_header: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
    width: "100%",
  },
  CA_title: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
  },
  CA_listContainer: {
    maxHeight: Dimensions.get("screen").height * 0.8, // Set max height for scrollable area
    flex: 1,
    paddingBottom: 20,
  },
  CA_listItem: {
    flexDirection: "row",
    justifyContent: "center",
    padding: 15,
    marginVertical: 8,
    backgroundColor: "#FFF",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  CA_listText: {
    fontSize: 24,
    color: "#444",
    textAlign: "center",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 20,
  },
});

