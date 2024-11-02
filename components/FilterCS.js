import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
  TouchableWithoutFeedback,
  Animated,
  Dimensions,
  CheckBox, // Import CheckBox for selecting roles
} from "react-native";

export default function FilterCS({
  modalVisible,
  toggleModal,
  applyFilter,
}) {
  const [walkerSelected, setWalkerSelected] = useState(false); // Walker role filter
  const [requesterSelected, setRequesterSelected] = useState(false); // Requester role filter
  const slideAnim = useRef(new Animated.Value(Dimensions.get("window").width)).current;

  useEffect(() => {
    if (modalVisible) {
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: Dimensions.get("window").width,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [modalVisible]);

  // Function to reset filters and close the modal
  const handleReset = () => {
    setWalkerSelected(false);
    setRequesterSelected(false);
    applyFilter(null);
    toggleModal();
  };

  // Submit filter criteria to parent
  const handleSubmit = () => {
    const filterData = {
      role: {
        walker: walkerSelected,
        requester: requesterSelected,
      },
    };
    console.log("Filter data:", filterData);
    applyFilter(filterData); // Pass the filter data back to the parent component
    toggleModal(); // Close the modal after submitting
  };

  return (
    <Modal
      visible={modalVisible}
      transparent={true}
      animationType="none"
      onRequestClose={toggleModal}
    >
      <TouchableWithoutFeedback onPress={toggleModal}>
        <View style={styles.modalOverlay}>
          <TouchableWithoutFeedback onPress={() => {}}>
            <Animated.View
              style={[
                styles.modalContainer,
                { transform: [{ translateX: slideAnim }] },
              ]}
            >
              <Text style={styles.filterTitle}>Select Role</Text>
              <View style={styles.checkboxContainer}>
                <CheckBox
                  value={walkerSelected}
                  onValueChange={() => setWalkerSelected(!walkerSelected)}
                  style={{ marginRight: 20 }}
                />
                <Text>Walker</Text>
              </View>
              <View style={styles.checkboxContainer}>
                <CheckBox
                  value={requesterSelected}
                  onValueChange={() => setRequesterSelected(!requesterSelected)}
                    style={{ marginRight: 20 }}
                />
                <Text>Requester</Text>
              </View>

              <View style={styles.buttonRow}>
                <TouchableOpacity
                  onPress={handleSubmit}
                  style={styles.submitButton}
                >
                  <Text style={{ color: "#fff" }}>Submit</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={handleReset}
                  style={styles.resetButton}
                >
                  <Text style={{ color: "#fff" }}>Reset</Text>
                </TouchableOpacity>
              </View>
            </Animated.View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "flex-end",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContainer: {
    width: "20%",
    height: "100%",
    padding: 20,
    backgroundColor: "#FFF",
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
    position: "absolute",
    right: 0,
  },
  filterTitle: {
    fontSize: 18,
    marginBottom: 10,
    fontWeight: "bold",
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    marginLeft: 10,
  },
  submitButton: {
    marginTop: 16,
    backgroundColor: "#007BFF",
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  resetButton: {
    marginTop: 16,
    backgroundColor: "#FF6347",
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonRow: {
    flexDirection: "column",
    marginTop: 20,
  },
});
