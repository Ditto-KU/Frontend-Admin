import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import { useRoute } from "@react-navigation/native";
import Header from "../components/Header"; // Import Header component

export default function UserDetail() {
  const route = useRoute();
  const { user, userType } = route.params; // Extract user data and userType from route params

  return (
    <View style={styles.container}>
      {/* Include Header */}
      <Header />

      {/* User General Information */}
      <View style={styles.userInfoContainer}>
        <Text style={styles.userId}>UserID: {user.id || "N/A"}</Text>
        <Text style={styles.userName}>Name: {user.username || "N/A"}</Text>
        <Text style={styles.userPhone}>Phone: {user.phoneNumber || "N/A"}</Text>
      </View>

      {/* Conditional rendering based on userType */}
      {userType === "walker" ? (
        <View style={styles.walkerContainer}>
          {/* Display face photo for walkers */}
          <View style={styles.facePhotoContainer}>
            <Text style={styles.sectionTitle}>Face Photo</Text>
            <Image
              source={{
                uri: user.profilePicture
                  ? user.profilePicture
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
      ) : (
        <View style={styles.requesterContainer}>
          {/* Display address for requesters */}
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

          {/* Display order frequency */}
          <Text style={styles.sectionTitle}>Order Frequency</Text>
          <Text style={styles.userInfo}>
            {user.orderFrequency || 0} orders
          </Text>
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
    alignItems: "center",
  },
  userInfoContainer: {
    alignItems: "flex-start",
    width: "100%",
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  userId: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#555",
  },
  userName: {
    fontSize: 20,
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
    marginBottom: 10,
    color: "#000",
  },
  facePhotoContainer: {
    alignItems: "center",
    marginTop: 30,
  },
  facePhoto: {
    width: 150,
    height: 150,
    borderRadius: 75,
    borderWidth: 2,
    borderColor: "#ccc",
    marginBottom: 20,
  },
  bankInfoContainer: {
    alignItems: "flex-start",
    marginTop: 20,
  },
  userInfo: {
    fontSize: 16,
    color: "#333",
    marginBottom: 5,
  },
  walkerContainer: {
    alignItems: "center",
    width: "100%",
    paddingHorizontal: 16,
    marginTop: 20,
  },
  requesterContainer: {
    alignItems: "flex-start",
    width: "100%",
    paddingHorizontal: 16,
    marginTop: 30,
  },
  addressContainer: {
    marginBottom: 15,
  },
});
