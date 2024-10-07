import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  FlatList,
  ScrollView,
  Dimensions,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import Header from "../components/Header";

export default function Verify() {
  const navigation = useNavigation();
  const authToken =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdXRoSWQiOiJhZG1pbjIiLCJpYXQiOjE3MjgxMjg1MDIsImV4cCI6MTczNjc2ODUwMn0.gqSAFiuUiAAnZHupDmJdlOqlKz2rqPxAbPVffcKt1Is";

  // State for API data, loading, and error
  const [verifyUser, setVerifyUser] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch data from the API
  useEffect(() => {
    const fetchData = async () => {
      try {
        let headersList = {
          Accept: "*/*",
          Authorization: `Bearer ${authToken}`,
        };
        let response = await fetch(
          "https://ku-man-api.vimforlanie.com/admin/verify",
          {
            method: "GET",
            headers: headersList,
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const contentType = response.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
          const data = await response.json();
          setVerifyUser(data);
        } else {
          throw new Error(`Unexpected content-type: ${contentType}`);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setError(error.message); // Display the error message in UI
      } finally {
        setLoading(false);
      }
    };

    // Set an interval to fetch data every second
    const intervalId = setInterval(fetchData, 1000); // Fetch every 1000 ms (1 second)

    // Clean up the interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Loading...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text>Error: {error}</Text>
      </View>
    );
  }

  const handleUserPress = (user) => {
    navigation.navigate("VerifyDetail", { user });
  };

  // Render each user item
  const renderItem = ({ item }) => (
    <TouchableOpacity onPress={() => handleUserPress(item)}>
      <View style={styles.VE_listItem}>
        <Text style={styles.VE_textName}>Username: {item.username}</Text>
        <Text style={styles.VE_textTime}>
          Registered At: {new Date(item.registerAt).toLocaleString()}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.VE_container}>
      <Header />
      <View style={styles.VE_header}>
        <Text style={styles.VE_title}>User Verification</Text>
      </View>

      {/* Use FlatList for displaying the list */}
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <FlatList
          data={verifyUser}
          renderItem={renderItem}
          keyExtractor={(item) => item.username}
          contentContainerStyle={styles.verifyList}
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  VE_container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#F5F5F5",
  },
  VE_header: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
    width: "100%",
  },
  VE_title: {
    fontSize: 36,
    fontWeight: "bold",
    marginVertical: 15,
    textAlign: "center",
  },
  VE_listItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 20,
    marginBottom: 10,
    backgroundColor: "#FFF",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    width: "100%",
  },
  VE_textName: {
    fontSize: 20,
    fontWeight: "600",
  },
  VE_textTime: {
    fontSize: 16,
    color: "#555",
    marginTop: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  verifyList: {
    maxHeight: (Dimensions.get('screen').height)*0.8, // Set max height for scrollable area
    flex: 1, 
    paddingBottom: 20,
  },
});
