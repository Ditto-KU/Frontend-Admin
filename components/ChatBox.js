import React, { useState, useEffect, useRef } from "react";
import {
  SafeAreaView,
  TextInput,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons"; // For icons
import io from "socket.io-client";
import "react-native-url-polyfill/auto";

export default function ChatBox() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [socket, setSocket] = useState(null);
  const flatListRef = useRef(null); // Reference for FlatList to auto-scroll

  // Initialize Socket.IO client
  useEffect(() => {
    const newSocket = io("https://ku-man-chat.vimforlanie.com/");
    setSocket(newSocket);

    // Join the chat room for the specific order
    newSocket.emit("joinOrderChat", { userId, role, orderId });

    // Listen for incoming messages
    newSocket.on("message", (data) => {
      setMessages((prevMessages) => [...prevMessages, data]);
    });

    return () => newSocket.disconnect(); // Cleanup on component unmount
  }, [orderId]);

  const sendMessage = (msg) => {
    if (socket && msg.trim() !== "") {
      const newMessage = {
        orderId,
        message: msg,
        fromUser: userId,
        role,
        targetRole: "admin", // Assuming you're sending messages to the admin
      };

      socket.emit("orderMessage", newMessage); // Send message via Socket.IO
      setMessages((prevMessages) => [...prevMessages, newMessage]); // Update messages state
      setMessage(""); // Clear input field
    }
  };

  // Scroll to the bottom of the message list whenever new messages arrive
  useEffect(() => {
    if (flatListRef.current) {
      flatListRef.current.scrollToEnd({ animated: true });
    }
  }, [messages]);

  return (
    <SafeAreaView style={styles.container}>
      {/* Messages */}
      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View
            style={[
              styles.messageWrapper,
              item.fromUser === userId
                ? styles.sentMessage
                : styles.receivedMessage,
            ]}
          >
            <Text style={styles.messageText}>{item.message}</Text>
            <Ionicons
              name={item.role === "admin" ? "person-circle" : "person-circle-outline"}
              size={24}
              color={item.role === "admin" ? "black" : "green"}
            />
          </View>
        )}
      />

      {/* Message Input with KeyboardAvoidingView */}
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 5 : 0}
        style={styles.inputWrapper}
      >
        <TextInput
          style={styles.messageInput}
          placeholder="Send a message"
          value={message}
          onChangeText={setMessage}
          onSubmitEditing={() => sendMessage(message)}  // Trigger sendMessage on Enter
          blurOnSubmit={false} // Prevent losing focus on pressing Enter
        />
        <TouchableOpacity onPress={() => sendMessage(message)} style={styles.sendButton}>
          <Ionicons name="send" size={24} color="white" />
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fafbfc",
    borderRadius: 10,
    padding: 10,
  },
  messageWrapper: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 10,
    maxWidth: "80%", // Ensure the message doesn't take the full width
  },
  sentMessage: {
    backgroundColor: "#E0E0E0",
    padding: 10,
    borderRadius: 15,
    alignSelf: "flex-end", // Align sent messages to the right
  },
  receivedMessage: {
    backgroundColor: "#E8F5E9",
    padding: 10,
    borderRadius: 15,
    alignSelf: "flex-start", // Align received messages to the left
  },
  messageText: {
    fontSize: 16,
    marginRight: 10,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "#ccc",
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: "#F8F8F8",
  },
  messageInput: {
    flex: 1,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#fff",
    paddingHorizontal: 10,
    borderColor: "#ccc",
    borderWidth: 1,
    marginRight: 10,
  },
  sendButton: {
    backgroundColor: "#4CAF50",
    borderRadius: 20,
    padding: 10,
  },
});
