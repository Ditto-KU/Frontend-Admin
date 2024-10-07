import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  Alert,
  FlatList,
  StyleSheet,
} from "react-native";

export default function CanteenAndShops() {
  const [canteens, setCanteens] = useState([]); // Store canteens
  const [totalShops, setTotalShops] = useState(0); // Store total shops
  const [openShops, setOpenShops] = useState(0); // Store open shops
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state
  const authToken =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdXRoSWQiOiJhZG1pbjIiLCJpYXQiOjE3MjgxMjg1MDIsImV4cCI6MTczNjc2ODUwMn0.gqSAFiuUiAAnZHupDmJdlOqlKz2rqPxAbPVffcKt1Is";

  // Fetch all canteens from the API
  useEffect(() => {
    const fetchCanteens = async () => {
      try {
        let headersList = {
          Accept: "*/*",
          Authorization: `Bearer ${authToken}`,
        };

        let response = await fetch(
          `https://ku-man-api.vimforlanie.com/admin/canteen`,
          {
            method: "GET",
            headers: headersList,
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const canteensData = await response.json(); // Parse canteen data
        setCanteens(canteensData); // Set canteen data
      } catch (error) {
        console.error("Error fetching canteens:", error);
        setError(error.message);
        Alert.alert("Error", error.message);
      } finally {
        setLoading(false); // Stop loading after fetching canteen data
      }
    };

    fetchCanteens();
  }, []);

  // Fetch shops for all canteens
  useEffect(() => {
    const fetchShopsForCanteens = async () => {
      if (canteens.length > 0) {
        try {
          let totalShopCount = 0;
          let openShopCount = 0;

          // Fetch shops for each canteen
          const shopsPromises = canteens.map(async (canteen) => {
            let headersList = {
              Accept: "*/*",
              Authorization: `Bearer ${authToken}`,
            };
            let response = await fetch(
              `https://ku-man-api.vimforlanie.com/admin/canteen/shop?canteenId=${canteen.canteenId}`,
              {
                method: "GET",
                headers: headersList,
              }
            );

            if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
            }

            const shops = await response.json(); // Parse shop data

            // Count total shops and open shops
            totalShopCount += shops.length;
            openShopCount += shops.filter((shop) => shop.status === true).length;
          });

          // Resolve all promises
          await Promise.all(shopsPromises);

          // Set total and open shops count
          setTotalShops(totalShopCount);
          setOpenShops(openShopCount);
        } catch (error) {
          console.error("Error fetching shops:", error);
          setError(error.message);
          Alert.alert("Error", error.message);
        }
      }
    };

    fetchShopsForCanteens();
  }, [canteens]);

  // Calculate the percentage of open shops
  const openPercentage = totalShops > 0 ? ((openShops / totalShops) * 100).toFixed(2) : 0;

  // Loading state
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Loading Canteens and Shops...</Text>
      </View>
    );
  }

  // Error state
  if (error) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Error: {error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* <Text style={styles.text}>Total Shops: {totalShops}</Text>
      <Text style={styles.text}>Open Shops: {openShops}</Text> */}
      <Text style={styles.text}>Open Shops</Text>
      <Text style={styles.percentage}>{openPercentage}%</Text>
      <Text style={styles.subtext}>of all shops are open</Text>
    </View>
  );
}

// Styles for the component
const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fafbfc',
    borderRadius: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    justifyContent: 'center',
    width: '96%',
    padding: 10,
    height: "32%",
    marginLeft: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 5,
  },
  percentage: {
    fontSize: 34,
    fontWeight: "bold",
    color: "#4caf50", // Green color for the percentage
  },
  subtext: {
    fontSize: 16,
    color: "#666",
    marginTop: 5,
  },
});
