import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import { useRoute } from "@react-navigation/native";
import Header from "../components/Header"; // Import Header component

export default function UserDetail() {
  const route = useRoute();
  const { user, userType } = route.params; // Extract user data and userType from route params
  const authToken =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdXRoSWQiOiJhZG1pbjIiLCJpYXQiOjE3MjgxMjg1MDIsImV4cCI6MTczNjc2ODUwMn0.gqSAFiuUiAAnZHupDmJdlOqlKz2rqPxAbPVffcKt1Is";
  
  // Fetch order data from the API inside useEffect
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true); // Show loading indicator
        const headersList = {
          Accept: "*/*",
          Authorization: `Bearer ${authToken}`,
        };
        const response = await fetch(
          "https://ku-man-api.vimforlanie.com/admin/order",
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

          setOrderData(sortedData); // Set full order data
        } else {
          throw new Error(`Unexpected content-type: ${contentType}`);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setError(error.message);
        Alert.alert("Error", error.message);
      } finally {
        setLoading(false); // Hide loading indicator
      }
    };

    fetchData(); // Fetch data when component mounts
  }, []);


  return (
    <View style={styles.container}>
      {/* Include Header */}
      <Header />

      {/* User General Information */}
      
      <View style={styles.card}>
        <View style={styles.userInfoContainer}>
          <Text style={styles.userId}>{userType}ID: {userType === "walker" ? user.walkerId : user.requesterId}</Text>
          <Text style={styles.userName}>Name: {user.username || "N/A"}</Text>
          <Text style={styles.userPhone}>Phone: {user.phoneNumber || "N/A"}</Text>
        </View>
      </View>

      {/* Conditional rendering based on userType */}
      {userType === "walker" ? (
        <View style={styles.card}>
          <View style={styles.walkerContainer}>
            {/* Display face photo for walkers */}
            <View style={styles.facePhotoContainer}>
              <Text style={styles.sectionTitle}>Face Photo</Text>
              <Image
                source={{
                  uri: user.profilePicture
                    ? `data:image/jpeg;base64,${user.profilePicture}`
                    : "https://via.placeholder.com/150",
                }} // Display profile picture or a placeholder
                style={styles.facePhoto}
              />
            </View>

            {/* Display bank account for walkers */}
            <View style={styles.bankInfoContainer}>
              <Text style={styles.sectionTitle}>Bank Account</Text>
              <Text style={styles.userInfo}>
                Account Name: {user.bankAccountName || "Not provided"}
              </Text>
              <Text style={styles.userInfo}>
                Account No: {user.bankAccountNo || "Not provided"}
              </Text>
            </View>
          </View>
        </View>
      ) : (
        <View style={styles.card}>
          <View style={styles.requesterContainer}>
            {/* Display address for requesters */}
            <View style={styles.facePhotoContainer}>
              <Text style={styles.sectionTitle}>Face Photo</Text>
              <Image
                source={{
                  uri: user.profilePicture
                    ? `data:image/jpeg;base64,${user.profilePicture}`
                    : "https://via.placeholder.com/150",
                }} // Display profile picture or a placeholder
                style={styles.facePhoto}
              />
            </View>
            <Text style={styles.sectionTitle}>Address</Text>
            {user.address && user.address.length > 0 ? (
              user.address.map((addr, index) => (
                <View key={index} style={styles.addressContainer}>
                  <Text style={styles.userInfo}>Name: {addr.name}</Text>
                  <Text style={styles.userInfo}>Detail: {addr.detail}</Text>
                  <Text style={styles.userInfo}>
                    Latitude: {addr.latitude}, Longitude: {addr.longitude}
                  </Text>
                </View>
              ))
            ) : (
              <Text style={styles.userInfo}>No address available</Text>
            )}

          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#F5F5F5",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 5 },
    shadowRadius: 15,
    elevation: 5,
    padding: 20,
    marginBottom: 20,
    borderColor: "#e0e0e0",
    borderWidth: 1,
    width: "70%",
    alignSelf: "center",
  },
  userInfoContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  userId: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#555",
    marginBottom: 5,
  },
  userName: {
    fontSize: 22,
    fontWeight: "600",
    color: "#333",
    marginTop: 5,
  },
  userPhone: {
    fontSize: 16,
    color: "#666",
    marginTop: 5,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    paddingBottom: 5,
    textAlign: "left",
    width: "100%",
  },
  facePhotoContainer: {
    alignItems: "center",
    marginVertical: 20,
  },
  facePhoto: {
    width: 150,
    height: 150,
    borderRadius: 75,
    borderWidth: 3,
    borderColor: "#ccc",
    marginBottom: 20,
  },
  bankInfoContainer: {
    marginTop: 20,
  },
  userInfo: {
    fontSize: 16,
    color: "#333",
    marginBottom: 5,
    paddingLeft: 5,
  },
  walkerContainer: {
    width: "100%",
  },
  requesterContainer: {
    width: "100%",
  },
  addressContainer: {
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    paddingBottom: 10,
  },
});
