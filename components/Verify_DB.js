import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";

export default function Verify_DB() {
  const navigation = useNavigation();

  const [verifyUser, setVerifyUser] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        let headersList = {
          Accept: "*/*",
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
          setVerifyUser(filteredData);
        } else {
          throw new Error(`Unexpected content-type: ${contentType}`);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    const intervalId = setInterval(fetchData, 1000);

    return () => clearInterval(intervalId);
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
      <Text style={styles.header}>
        Verify New Walkers ({verifyUser.length})
      </Text>
      <View style={styles.verifyList}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {verifyUser.map((user, index) => (
        <TouchableOpacity
          key={index}
          style={styles.reportContainer}
          onPress={() => gotoVerifydetail(user)}
        >
          <Text style={styles.reportText}>User: {user.username ?? "N/A"}</Text>
        </TouchableOpacity>
        ))}
      </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    marginRight: 20,
    backgroundColor: "#fafbfc",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    height: "100%",
    width: "50%",
  },
  verifyList: {
    flex: 1, // ใช้ flex เพื่อให้ ScrollView ยืดหยุ่น
    padding: 10,
    borderRadius: 10,
    maxHeight: 400, // จำกัดความสูงของ ScrollView
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  reportContainer: {
    flexDirection: "column",
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
    width: "100%", // Ensure the report container takes the full width
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
  },
});
