import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Switch,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert
} from "react-native";
import Header from "../components/Header";
import { useNavigation, useRoute } from "@react-navigation/native";

export default function RestaurantDetail() {
  const authToken =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdXRoSWQiOiJhZG1pbjIiLCJpYXQiOjE3MjgxMjg1MDIsImV4cCI6MTczNjc2ODUwMn0.gqSAFiuUiAAnZHupDmJdlOqlKz2rqPxAbPVffcKt1Is";
  const route = useRoute();
  const navigation = useNavigation();
  const { shopId } = route.params;

  const [isRestaurantOpen, setIsRestaurantOpen] = useState(true);
  const [menuItems, setMenuItems] = useState([]);
  const [shopInfo, setShopInfo] = useState(null); 
  const [loading, setLoading] = useState(true); 
  const [shopLoading, setShopLoading] = useState(true); 
  const [error, setError] = useState(null);

  // Function to toggle restaurant open/close and update the status
  const toggleRestaurantStatus = async () => {
    const newStatus = !isRestaurantOpen;
    setIsRestaurantOpen(newStatus);

    // API call to update the shop status
    try {
      let headersList = {
        Accept: "*/*",
        Authorization: `Bearer ${authToken}`,
        "Content-Type": "application/json",
      };

      let response = await fetch(
        `https://ku-man-api.vimforlanie.com/admin/update-status`,
        {
          method: "PATCH",
          headers: headersList,
          body: JSON.stringify({
            "shopId": shopId,
            "status": newStatus, // Send the new status to the API
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      let data = await response.json();
      Alert.alert("Success", `Shop is now ${newStatus ? "Open" : "Closed"}`);
      console.log("Updated shop status:", newStatus);
    } catch (error) {
      console.error("Error updating shop status:", error);
      Alert.alert("Error", error.message);
    }
  };

  // Function to toggle the availability of a menu item
  const toggleMenuItem = async (menuId, index) => {
    const updatedMenuItems = [...menuItems];
    const item = updatedMenuItems[index];

    // Toggle the status
    item.status = !item.status;
    setMenuItems(updatedMenuItems); // Optimistically update the UI

    try {
      let headersList = {
        Accept: "*/*",
        Authorization: `Bearer ${authToken}`,
        "Content-Type": "application/json",
      };

      let response = await fetch(
        `https://ku-man-api.vimforlanie.com/admin/menu/update-status`,
        {
          method: "PATCH",
          headers: headersList,
          body: JSON.stringify({
            "menuId": menuId,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Updated menu item status:", data);
    } catch (error) {
      console.error("Error updating menu item status:", error);
      Alert.alert("Error", error.message);
    }
  };

  // Function to navigate to the Order History screen
  const navigateToOrderHistory = () => {
    navigation.navigate("OrderHistory", { shopId });
  };

  // Function to fetch menu items from the API
  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        let headersList = {
          Accept: "*/*",
          Authorization: `Bearer ${authToken}`,
        };
        let response = await fetch(
          `https://ku-man-api.vimforlanie.com/admin/canteen/shop/menu?shopId=${shopId}`,
          {
            method: "GET",
            headers: headersList,
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        let data = await response.json();
        setMenuItems(data);
        console.log("Fetched menu items:", data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching menu items:", error);
        setError(error.message);
        Alert.alert("Error", error.message);
        setLoading(false);
      }
    };

    fetchMenuItems();
  }, [shopId]);

  // Function to fetch shop information from the API
  useEffect(() => {
    const fetchShopInfo = async () => {
      try {
        let headersList = {
          Accept: "*/*",
          Authorization: `Bearer ${authToken}`,
        };

        let response = await fetch(
          `https://ku-man-api.vimforlanie.com/admin/canteen/shop/info?shopId=${shopId}`,
          {
            method: "GET",
            headers: headersList,
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        let data = await response.json();
        setShopInfo(data);
        setIsRestaurantOpen(data.status); // Set initial status based on the fetched data
        setShopLoading(false);
      } catch (error) {
        console.error("Error fetching shop info:", error);
        setError(error.message);
        Alert.alert("Error", error.message);
        setShopLoading(false);
      }
    };

    const intervalId = setInterval(fetchShopInfo, 1000); // Fetch every 1000 ms (1 second)

    return () => clearInterval(intervalId);
  }, [shopId]);

  if (shopLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Loading Shop Info...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Error: {error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header />
      <Text style={styles.restaurantName}>{shopInfo?.shopName || "Shop"}</Text>

      <View style={styles.mainContainer}>
        {/* Left Section: Restaurant Status */}
        <View style={styles.statusContainer}>
          <Text style={styles.statusText}>Shop Status</Text>
          <View style={styles.statusToggleContainer}>
            <Text style={styles.statusLabel}>
              {isRestaurantOpen ? "Open" : "Closed"}
            </Text>
            <View style={styles.switchContainer}>
              <Switch
                value={isRestaurantOpen}
                onValueChange={toggleRestaurantStatus}
                thumbColor={isRestaurantOpen ? "#34C759" : "#f4f3f4"}
                trackColor={{ false: "#f4f3f4", true: "#34C759" }}
              />
            </View>
          </View>
        </View>

        {/* Menu List */}
        <View style={styles.menuContainer}>
          <Text style={styles.menuTitle}>Menu</Text>
          <ScrollView style={{ flexGrow: 1 }}>
            {menuItems.map((item, index) => (
              <View key={item.menuId} style={styles.menuItem}>
                <Image
                  source={{ uri: item.picture || "https://via.placeholder.com/60" }}
                  style={styles.menuImage}
                />
                <View style={styles.menuDetails}>
                  <Text style={styles.menuName}>{item.name}</Text>
                  <Text style={styles.menuPrice}>{item.price} THB</Text>
                </View>
                <View style={styles.switchContainer}>
                  <Switch
                    value={item.status}
                    onValueChange={() => toggleMenuItem(item.menuId)}
                    thumbColor={item.status ? "#34C759" : "#f4f3f4"}
                    trackColor={{ false: "#f4f3f4", true: "#34C759" }}
                  />
                </View>
              </View>
            ))}
          </ScrollView>
        </View>

        {/* Restaurant Details */}
        <View style={styles.detailsContainer}>
          <Text style={styles.detailsTitle}>Description</Text>
          <View style={styles.detailsTextContainer}>
            <Text style={styles.detailsText}>
              Username: {shopInfo?.username || "N/A"}
            </Text>
            <Text style={styles.detailsText}>
              Shop Name: {shopInfo?.shopName || "N/A"}
            </Text>
            <Text style={styles.detailsText}>Tel: {shopInfo?.tel || "N/A"}</Text>
            <Text style={styles.detailsText}>
              Canteen Id: {shopInfo?.canteenId || "N/A"}
            </Text>
            <Text style={styles.detailsText}>
              Shop Number: {shopInfo?.shopNumber || "N/A"}
            </Text>
          </View>
        </View>
      </View>

      {/* Button for Order History */}
      <TouchableOpacity
        style={styles.historyButton}
        onPress={navigateToOrderHistory}
      >
        <Text style={styles.historyButtonText}>Order History</Text>
      </TouchableOpacity>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    padding: 10,
    height: "100%",
  },
  restaurantName: {
    fontSize: 34,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 16,
    marginBottom: 20,
  },
  mainContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    height: "65%",
  },
  statusContainer: {
    width: "20%",
    justifyContent: "center",
    alignItems: "center",
    borderRightWidth: 1,
    borderRightColor: "#E0E0E0",
    paddingRight: 16,
  },
  statusText: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 10,
  },
  statusToggleContainer: {
    flexDirection: "column",
    alignItems: "center",
  },
  statusLabel: {
    fontSize: 24,
    marginBottom: 10,
    color: "#34C759",
  },
  switchContainer: {
    transform: [{ scaleX: 1.4 }, { scaleY: 1.4 }], // Increase size of the Switch
  },
  menuContainer: {
    width: "50%",
    paddingHorizontal: 16,
  },
  menuTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#EFEFEF",
    paddingRight: 20,
  },
  menuImage: {
    width: 60,
    height: 60,
    borderRadius: 10,
  },
  menuDetails: {
    flex: 1,
    marginLeft: 10,
  },
  menuName: {
    fontSize: 20,
    fontWeight: "bold",
  },
  menuPrice: {
    fontSize: 16,
    color: "#777",
  },
  detailsContainer: {
    width: "30%",
    paddingLeft: 16,
  },
  detailsTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  detailsTextContainer: {
    flexDirection: "column",
    marginLeft: 30,
  },
  detailsText: {
    fontSize: 20,
    marginBottom: 10,
  },
  historyButton: {
    backgroundColor: "#000000",
    padding: 15,
    alignItems: "center",
    borderRadius: 8,
    marginTop: 40,
    marginHorizontal: 16,
  },
  historyButtonText: {
    color: "#FFFFFF",
    fontSize: 24,
    fontWeight: "bold",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
