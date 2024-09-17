import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useNavigation } from "@react-navigation/native";

export default function Verify_DB() {
  const navigation = useNavigation();

  // Initialize state for verifyUser, loading, and error
  const [verifyUser, setVerifyUser] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch data from the API
  useEffect(() => {
    const fetchData = async () => {
      try {
        let headersList = {
          Accept: "*/*",
          Authorization:
            "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdXRoSWQiOiIwIiwiaWF0IjoxNzI2MTk4ODU2LCJleHAiOjE3MzQ4Mzg4NTZ9.JT_q3Emt2wiIKAGr4p76pkuZTBjD_rh6abPiHYm8f7s",
        };

        let response = await fetch(
          "https://ku-man.runnakjeen.com/admin/verify",
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

          // Filter out walkers whose status is true
          const filteredData = data.filter((user) => user.status === false);

          setVerifyUser(filteredData);
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

    fetchData();
  }, []);

  const gotoVerifydetail = (user) => {
    navigation.navigate("VerifyDetail", { user });
  };

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

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Verify New Walkers</Text>
      {/* Loop through the user data */}
      {verifyUser.length > 0 ? (
        verifyUser.map((user, index) => (
          <TouchableOpacity
            key={index}
            style={styles.reportContainer}
            onPress={() => gotoVerifydetail(user)} // Pass the user's data to the function
          >
            <Text style={styles.reportText}>
              Username: {user.username ?? "N/A"}
            </Text>
          </TouchableOpacity>
        ))
      ) : (
        <Text>No data available</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#fafbfc",
    borderRadius: 10,
    width: "100%", // Set to full width for better presentation
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  header: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 20,
  },
  reportContainer: {
    flexDirection: "column", // Changed to column for vertical layout
    justifyContent: "flex-start",
    padding: 15,
    marginBottom: 10,
    backgroundColor: "#FFF",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    width: "45%", // Ensure the report container takes the full width
  },
  reportText: {
    fontSize: 16,
    marginBottom: 5,
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
    color: "red",
  },
});
