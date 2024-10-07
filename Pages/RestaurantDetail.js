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
import { useNavigation, useRoute } from "@react-navigation/native"; // Import useNavigation and useRoute

export default function RestaurantDetail() {
  const authToken =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdXRoSWQiOiJhZG1pbjIiLCJpYXQiOjE3MjgxMjg1MDIsImV4cCI6MTczNjc2ODUwMn0.gqSAFiuUiAAnZHupDmJdlOqlKz2rqPxAbPVffcKt1Is";
  const route = useRoute(); // Get the route to access passed parameters
  const navigation = useNavigation(); // Initialize navigation
  const { shopId } = route.params; // Retrieve the shopId passed from the previous screen
  // States for toggling restaurant, menu items, and shop info
  const [isRestaurantOpen, setIsRestaurantOpen] = useState(true);
  const [menuItems, setMenuItems] = useState([]);
  const [shopInfo, setShopInfo] = useState(null); // State for storing shop info
  const [loading, setLoading] = useState(true); // Loading state for menu
  const [shopLoading, setShopLoading] = useState(true); // Loading state for shop info
  const [error, setError] = useState(null); // Error state
  
  // Function to toggle restaurant open/close
  const toggleRestaurantStatus = () => {
    setIsRestaurantOpen(!isRestaurantOpen);
  };

  // Function to toggle menu item availability
  const toggleMenuItem = (index) => {
    const newMenuItems = [...menuItems];
    newMenuItems[index].status = !newMenuItems[index].status;
    setMenuItems(newMenuItems);
  };

  // Function to navigate to the Order History screen
  const navigateToOrderHistory = () => {
    navigation.navigate("OrderHistory", { shopId }); // Pass shopId to OrderHistory
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

        let data = await response.json(); // Parse response as JSON
        setMenuItems(data); // Update state with the fetched menu items
        setLoading(false); // Stop loading
      } catch (error) {
        console.error("Error fetching menu items:", error);
        setError(error.message);
        Alert.alert("Error", error.message);
        setLoading(false); // Stop loading even if there is an error
      }
    };

    fetchMenuItems();
  }, [shopId]); // Fetch the menu items when the component mounts and shopId is available

  // Function to fetch shop information from the API
  useEffect(() => {
    const fetchShopInfo = async () => {
      try {
        let headersList = {
          Accept: "*/*",
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

        let data = await response.json(); // Parse response as JSON
        setShopInfo(data); // Update state with the fetched shop info
        setShopLoading(false); // Stop loading
      } catch (error) {
        console.error("Error fetching shop info:", error);
        setError(error.message);
        Alert.alert("Error", error.message);
        setShopLoading(false); // Stop loading even if there is an error
      }
    };

    // Set an interval to fetch data every second
    const intervalId = setInterval(fetchShopInfo, 1000); // Fetch every 1000 ms (1 second)

    // Clean up the interval on component unmount
    return () => clearInterval(intervalId);
  }, [shopId]); // Fetch the shop info when the component mounts and shopId is available


  // Render loading or error state for the shop info
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
      {/* Including the custom Header component */}
      <Header />

      {/* Restaurant Name */}
      <Text style={styles.restaurantName}>{shopInfo?.shopName || 'Shop 1'}</Text>

      <View style={styles.mainContainer}>
        {/* Left Section: Restaurant Status */}
        <View style={styles.statusContainer}>
          <Text style={styles.statusText}>Shop Status</Text>
          <View style={styles.statusToggleContainer}>
            <Text style={styles.statusLabel}>
              {isRestaurantOpen ? "Open" : "Close"}
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

        {/* Center Section: Menu List */}
        <View style={styles.menuContainer}>
          <Text style={styles.menuTitle}>Menu</Text>
          <ScrollView style={{ flexGrow: 1 }}>
            {menuItems.map((item, index) => (
              <View key={item.menuId} style={styles.menuItem}>
                <Image
                  source={{ uri: item.picture || "https://via.placeholder.com/60" }} // Use placeholder if no image
                  style={styles.menuImage}
                />
                <View style={styles.menuDetails}>
                  <Text style={styles.menuName}>{item.name}</Text>
                  <Text style={styles.menuPrice}>{item.price} THB</Text>
                </View>
                <View style={styles.switchContainer}>
                  <Switch
                    value={item.status}
                    onValueChange={() => toggleMenuItem(index)}
                    thumbColor={isRestaurantOpen ? "#34C759" : "#f4f3f4"}
                    trackColor={{ false: "#f4f3f4", true: "#34C759" }}
                  />
                </View>
              </View>
            ))}
          </ScrollView>
        </View>

        {/* Right Section: Restaurant Details */}
        <View style={styles.detailsContainer}>
          <Text style={styles.detailsTitle}>Description</Text>
          <View style={styles.detailsTextContainer}>
            <Text style={styles.detailsText}>Username: {shopInfo?.username || 'N/A'}</Text>
            <Text style={styles.detailsText}>Shop Name: {shopInfo?.shopName || 'N/A'}</Text>
            <Text style={styles.detailsText}>Tel: {shopInfo?.tel || 'N/A'}</Text>
            <Text style={styles.detailsText}>Canteen Id: {shopInfo?.canteenId || 'N/A'}</Text>
            <Text style={styles.detailsText}>Shop Number: {shopInfo?.shopNumber || 'N/A'}</Text>
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
