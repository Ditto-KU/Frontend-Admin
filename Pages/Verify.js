import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import Header from "../components/Header";

export default function Verify() {
  const navigation = useNavigation();

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

  const renderItem = ({ item }) => (
    <TouchableOpacity onPress={() => handleUserPress(item)}>
      <View style={styles.VE_listItem}>
        <View style={{ flexDirection: "column" }}>
          <Text style={styles.VE_textName}>Username: {item.username}</Text>
          {/* <Text>Email: {item.email}</Text>
          <Text>Phone: {item.phoneNumber}</Text>
          <Text>Bank Account Name: {item.bankAccountName}</Text>
          <Text>Bank Account No: {item.bankAccountNo}</Text>
          <Text>Status: {item.status ? "Verified" : "Not Verified"}</Text> */}
        </View>
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
      <FlatList
        data={verifyUser}
        renderItem={renderItem}
        keyExtractor={(item) => item.email} // Unique key based on email
        contentContainerStyle={styles.VE_userList}
      />
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
    padding: 15,
    marginBottom: 10,
    backgroundColor: "#FFF",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
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
    color: "red",
  },
});
