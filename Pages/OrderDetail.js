import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    StyleSheet,
    Image,
    TouchableOpacity,
    ScrollView,
    Modal,
    TextInput,
    ActivityIndicator,
    Alert,
    Linking,
} from "react-native";
import { Ionicons } from "@expo/vector-icons"; // Assuming use of Expo for icon management
import { useRoute } from "@react-navigation/native"; // To get the passed order data
import Header from "../components/Header";

export default function OrderDetail() {
    const route = useRoute();
    const { orderID } = route.params; // Destructure the passed 'orderID'
    const authToken =
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdXRoSWQiOiJhZG1pbjIiLCJpYXQiOjE3MjgxMjg1MDIsImV4cCI6MTczNjc2ODUwMn0.gqSAFiuUiAAnZHupDmJdlOqlKz2rqPxAbPVffcKt1Is";

    const [order, setOrder] = useState(null); // Order state
    const [modalVisible, setModalVisible] = useState(false);
    const [reason, setReason] = useState(""); // For storing the cancellation reason
    const [walker, setWalkers] = useState();
    const [requester, setRequesters] = useState();
    const [orderStatus, setOrderStatus] = useState(""); // Track the order status
    const [loading, setLoading] = useState(false); // Loading state for the API call
    const [error, setError] = useState(null); // Error state
    const [confirmModalVisible, setConfirmModalVisible] = useState(false); // For confirmation modal


    const [walkerID, setWalkerID] = useState();
    const [requesterID, setRequesterID] = useState();

    const [walkerProfile, setWalkerProfile] = useState();

    console.log("Order ID:", orderID);

    // Fetch order data from the API
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true); // Show loading indicator
                const headersList = {
                    Accept: "*/*",
                    Authorization: `Bearer ${authToken}`,
                };
                const response = await fetch(
                    `https://ku-man-api.vimforlanie.com/admin/order/info?orderId=${orderID}`,
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
                    setOrder(data); // Set order data
                    setOrderStatus(data.orderStatus);
                    setWalkerID(data.walker.walkerId)
                    setRequesterID(data.requester.requesterId)
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

        fetchData();
    }, [orderID]);

    const makeCall = (phoneNumber) => {
        const formattedNumber = phoneNumber.replace(/[^0-9]/g, ""); // Sanitize the phone number
        const url = `tel:${formattedNumber}`;

        Linking.canOpenURL(url)
            .then((supported) => {
                if (!supported) {
                    Alert.alert("Error", "Your device does not support this functionality.");
                } else {
                    return Linking.openURL(url);
                }
            })
            .catch((err) => {
                console.error("Error making a call", err);
                Alert.alert("Error", "Failed to make the call. Please try again.");
            });
    };

    // In the fetch walkers and requesters useEffect
    useEffect(() => {
        const fetchWalkersAndRequesters = async () => {
            try {
                let headersList = {
                    Accept: "*/*",
                    Authorization: `Bearer ${authToken}`,
                };

                // Fetch walkers
                let walkerResponse = await fetch("https://ku-man-api.vimforlanie.com/admin/walker", {
                    method: "GET",
                    headers: headersList,
                });
                if (!walkerResponse.ok) {
                    throw new Error(`Error fetching walkers: ${walkerResponse.status}`);
                }
                let walkersData = await walkerResponse.json();
                setWalkers(walkersData);

                // Set walker profile if walkerID matches
                const currentWalker = walkersData.find((w) => w.walkerId === walkerID);
                if (currentWalker) {
                    setWalkerProfile(currentWalker.profilePicture);
                }

                // Fetch requesters
                let requesterResponse = await fetch("https://ku-man-api.vimforlanie.com/admin/requester", {
                    method: "GET",
                    headers: headersList,
                });
                if (!requesterResponse.ok) {
                    throw new Error(`Error fetching requesters: ${requesterResponse.status}`);
                }
                let requestersData = await requesterResponse.json();
                setRequesters(requestersData);
            } catch (err) {
                console.error(err);
                setError(err.message);
            }
        };

        fetchWalkersAndRequesters(); // Fetch walkers and requesters when loading the component
    }, [walkerID]); // Run effect when walkerID changes


    const cancelOrder = async () => {
        try {
            let headersList = {
                Accept: "*/*",
                Authorization: `Bearer ${authToken}`,
                "Content-Type": "application/json", // Ensure Content-Type is included
            };

            let bodyContent = JSON.stringify({
                "orderStatus": "cancelled"
            });

            let response = await fetch(`https://ku-man-api.vimforlanie.com/admin/approval/${orderID}`, {
                method: "PUT",
                headers: headersList,
                body: bodyContent,
            });

            if (!response.ok) {
                throw new Error(`Error cancelling order: ${response.status}`);
            }

            let data = await response.text();
            console.log(data);

            Alert.alert("Success", "Order has been cancelled.");

            // Refetch the updated order data to get the correct status
            await refetchOrderData(); // Call a function to fetch the updated order details
        } catch (error) {
            console.error("Error cancelling order:", error);
            Alert.alert("Error", "Failed to cancel the order.");
        }
    };

    // Function to refetch the order data
    const refetchOrderData = async () => {
        try {
            const headersList = {
                Accept: "*/*",
                Authorization: `Bearer ${authToken}`,
            };

            const response = await fetch(
                `https://ku-man-api.vimforlanie.com/admin/order/info?orderId=${orderID}`,
                {
                    method: "GET",
                    headers: headersList,
                }
            );

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            setOrder(data); // Update order data with the latest
            setOrderStatus(data.orderStatus); // Ensure the status is updated
        } catch (error) {
            console.error("Error refetching order data:", error);
            setError(error.message);
        }
    };

    

    // Show cancel button only if the order status is "waitingAdmin", "inProgress", or "lookingForWalker"
    const showCancelButton = ["waitingAdmin", "inProgress", "lookingForWalker"].includes(orderStatus);


    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#0000ff" />
                <Text>Loading order details...</Text>
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

    if (!order) {
        return null;
    }

    return (
        <View style={styles.container}>
          <Header />
          <ScrollView contentContainerStyle={styles.scrollContainer}>
            {/* Left column */}
            <View style={styles.leftColumn}>
              <View style={styles.leftColumnContainer}>
                {/* Left column part 1 */}
                <View style={styles.leftColumnPart}>
                  {/* User Verification */}
                  <View style={styles.section}>
                    <Text style={styles.sectionTitle}>User Verification</Text>
                    <Image
                      source={{ uri: walkerProfile || 'placeholder-url-for-verification-image' }} // Replace with actual source
                      style={styles.profileImage}
                    />
                  </View>
      
                  {/* Food Pickup Proof */}
                  <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Food Pickup Proof</Text>
                    <View style={styles.imageContainer}>
                      {order.foodPickupProofImages?.map((imageUri, index) => (
                        <Image
                          key={index}
                          source={{ uri: imageUri }}
                          style={styles.proofImage}
                        />
                      ))}
                    </View>
                  </View>
      
                  {/* Delivery Proof */}
                  <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Delivery Proof</Text>
                    {order.deliveryProofImage && (
                      <Image
                        source={{ uri: order.deliveryProofImage }}
                        style={styles.proofImage}
                      />
                    )}
                  </View>
                </View>
      
                {/* Left column part 2 */}
                <View style={styles.leftColumnPart}>
                  {/* Requester Info */}
                  <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Requester Info</Text>
                    <Text style={styles.sectionDetail}>RequesterId: {order.requester.requesterId}</Text>
                    <Text style={styles.sectionDetail}>Phone: {order.requester.phoneNumber}</Text>
                    <TouchableOpacity
                      style={styles.callButton}
                      onPress={() => makeCall(order.requester.phoneNumber)}
                    >
                      <Ionicons name="call-outline" size={16} color="#fff" />
                      <Text style={styles.callButtonText}>Call Requester</Text>
                    </TouchableOpacity>
                  </View>
      
                  {/* Walker Info */}
                  <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Walker Info</Text>
                    <Text style={styles.sectionDetail}>WalkerId: {order.walker.walkerId}</Text>
                    <Text style={styles.sectionDetail}>Phone: {order.walker.phoneNumber}</Text>
                    <TouchableOpacity
                      style={styles.callButton}
                      onPress={() => makeCall(order.walker.phoneNumber)}
                    >
                      <Ionicons name="call-outline" size={16} color="#fff" />
                      <Text style={styles.callButtonText}>Call Walker</Text>
                    </TouchableOpacity>
                  </View>
      
                  {/* Delivery Address */}
                  <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Delivery Address</Text>
                    <Text style={styles.sectionDetail}>Address: {order.address.name}</Text>
                    <Text style={styles.sectionDetail}>Detail: {order.address.detail}</Text>
                    <Text style={styles.sectionDetail}>Note: {order.address.note}</Text>
                  </View>
                </View>
              </View>
      
              {/* Cancel Order Button at the bottom of Left Column */}
              <View style={styles.LeftDown}>
                {showCancelButton && (
                  <TouchableOpacity
                    style={styles.cancelButton}
                    onPress={() => setConfirmModalVisible(true)} // Open confirmation modal
                  >
                    <Text style={styles.cancelButtonText}>Cancel order</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
      
            {/* Right column */}
            <View style={styles.rightColumn}>
              {/* Order Info */}
              <Text style={styles.orderTitle}>Order: {order.orderId}</Text>
      
              {/* Order Status */}
              <Text style={styles.orderTitle}>Status: {order.orderStatus}</Text>
      
              {/* Ordered Items */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Ordered Items</Text>
                {order.orderItem.map((item, index) => (
                  <View key={item.orderItemId} style={styles.orderItem}>
                    <Text style={styles.sectionDetail}>
                      {index + 1}. {item.menu.name} - {item.totalPrice} THB
                    </Text>
                    <Text style={styles.sectionDetail}>
                      Special Instructions: {item.specialInstructions || "None"}
                    </Text>
                    {item.orderItemExtra.length > 0 && (
                      <Text style={styles.sectionDetail}>
                        Extra:{" "}
                        {item.orderItemExtra
                          .map((extra) => extra.optionItem.name)
                          .join(", ")}
                      </Text>
                    )}
                  </View>
                ))}
              </View>
      
              {/* Canteen Info */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Canteen Information</Text>
                <Text style={styles.sectionDetail}>Canteen Name: {order.canteen.name}</Text>
              </View>
      
              {/* Pricing Info */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Pricing Details</Text>
                <Text style={styles.sectionDetail}>Total Price: {order.totalPrice} Baht</Text>
                <Text style={styles.sectionDetail}>Shipping Fee: {order.shippingFee} Baht</Text>
              </View>
            </View>
          </ScrollView>
      
          {/* Confirmation Modal */}
          <Modal
            transparent={true}
            visible={confirmModalVisible}
            onRequestClose={() => setConfirmModalVisible(false)}
          >
            <View style={styles.modalOverlay}>
              <View style={styles.confirmModalContainer}>
                <Text style={styles.modalTitle}>ยกเลิกออร์เดอร์</Text>
                <Text style={styles.modalSubtitle}>สาเหตุ :</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter reason"
                  value={reason}
                  onChangeText={(text) => setReason(text)}
                  multiline
                />
                <View style={styles.buttonContainer}>
                  <TouchableOpacity
                    style={styles.approveButton}
                    onPress={() => {
                      setConfirmModalVisible(false); // Close the modal
                      cancelOrder(); // Proceed to cancel the order
                    }}
                  >
                    <Text style={styles.approveButtonText}>Approve</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.disapproveButton}
                    onPress={() => setConfirmModalVisible(false)} // Close modal without action
                  >
                    <Text style={styles.disapproveButtonText}>Disapprove</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>
        </View>
      );
      
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    scrollContainer: {
        flexDirection: "row",
        padding: 10,
        paddingBottom: 20,
        backgroundColor: "#f0f0f0",
        flex: 1,
        height: "100%",
    },
    leftColumn: {
        flex: 1,
        padding: 10,
        backgroundColor: "#fafbfc",
        borderRadius: 10,
        marginRight: 10,
        justifyContent: "space-between", // Ensures the cancel button is at the bottom
    },
    leftColumnContainer: {
        flexDirection: "row", // Divides the left column into two columns
        justifyContent: "space-between", // Space between the two sections
    },
    leftColumnPart: {
        flex: 1, // Each column takes up equal space
        marginRight: 10, // Adds space between the two columns
    },
    LeftUp: {
        flexDirection: "column",
        paddingBottom: 20,
    },
    LeftDown: {
        alignItems: "center",
        justifyContent: "flex-end",
    },
    imageContainer: {
        flexDirection: "row", // Display images in a row
        flexWrap: "wrap", // Wrap images to a new row if they overflow
    },
    proofImage: {
        width: 150,
        height: 150,
        borderRadius: 10,
        marginRight: 10,
        marginBottom: 10,
    },
    rightColumn: {
        width: "35%",
        padding: 10,
        backgroundColor: "#fafbfc",
        borderRadius: 10,
    },
    orderTitle: {
        fontSize: 24,
        fontWeight: "bold",
        marginVertical: 10,
    },
    section: {
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 5,
    },
    sectionDetail: {
        fontSize: 18,
        marginBottom: 5,
    },
    callButton: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 10,
        paddingVertical: 10,
        paddingHorizontal: 20,
        backgroundColor: "#333",
        borderRadius: 5,
        alignSelf: "flex-start",
    },
    callButtonText: {
        color: "#fff",
        marginLeft: 5,
    },
    orderItem: {
        marginBottom: 10,
    },
    cancelButton: {
        paddingVertical: 15,
        backgroundColor: "#f44336",
        borderRadius: 5,
        alignSelf: "center",
        paddingHorizontal: 60,
    },
    cancelButtonText: {
        color: "#fff",
        textAlign: "center",
        fontWeight: "bold",
    },
    profileImage: {
        width: 100,
        height: 100,
        borderRadius: 50,
        marginBottom: 10,
    },
    modalOverlay: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
    confirmModalContainer: {
        width: 300,
        padding: 20,
        backgroundColor: "#fff",
        borderRadius: 10,
        alignItems: "center",
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 10,
    },
    modalSubtitle: {
        fontSize: 16,
        marginBottom: 10,
    },
    input: {
        width: "100%",
        borderColor: "#ccc",
        borderWidth: 1,
        borderRadius: 5,
        padding: 10,
        height: 100,
        marginBottom: 20,
        textAlignVertical: "top",
    },
    buttonContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        width: "100%",
    },
    approveButton: {
        backgroundColor: "green",
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
    },
    approveButtonText: {
        color: "#fff",
        fontWeight: "bold",
    },
    disapproveButton: {
        backgroundColor: "red",
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
    },
    disapproveButtonText: {
        color: "#fff",
        fontWeight: "bold",
    },

});
