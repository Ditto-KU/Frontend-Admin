import React, { useState, useRef, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, KeyboardAvoidingView, Platform } from "react-native";
import { Ionicons } from '@expo/vector-icons';  // For better icons

export default function ChatBox() {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState("");
  const textInputRef = useRef(null); // Create a reference for the TextInput
  const flatListRef = useRef(null);  // Reference for FlatList to auto-scroll

  // Scroll to the end when a new message is added
  useEffect(() => {
    if (flatListRef.current) {
      flatListRef.current.scrollToEnd({ animated: true });
    }
  }, [messages]);

  const sendMessage = () => {
    if (inputText.trim()) {
      const newMessage = { id: Date.now().toString(), text: inputText, timestamp: new Date().toLocaleTimeString(), sender: "me" };
      setMessages([...messages, newMessage]);
      setInputText("");

      // Automatically focus back on the TextInput after sending a message
      if (textInputRef.current) {
        textInputRef.current.focus();
      }
    }
  };

  const renderMessage = ({ item }) => (
    <View style={[styles.CB_messageContainer, item.sender === "me" ? styles.CB_myMessage : styles.CB_receivedMessage]}>
      <Text style={styles.CB_messageText}>{item.text}</Text>
      <Text style={styles.CB_timestamp}>{item.timestamp}</Text>
    </View>
  );

  return (
    <KeyboardAvoidingView style={styles.CB_container} >
      <FlatList
        ref={flatListRef} // Attach ref to FlatList for auto-scrolling
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item) => item.id}
        style={styles.CB_chatArea}
        contentContainerStyle={styles.CB_contentContainer} // Ensure smooth scrolling
        showsVerticalScrollIndicator={false} // Hide scroll bar for a cleaner look
      />

      <View style={styles.CB_inputArea}>
        <TextInput
          ref={textInputRef} // Attach the reference to the TextInput
          style={styles.CB_textInput}
          placeholder="Type a message..."
          value={inputText}
          onChangeText={setInputText}
          onSubmitEditing={sendMessage} // Sends message on pressing Enter
          blurOnSubmit={false} // Prevents the TextInput from losing focus
        />
        <TouchableOpacity style={styles.CB_sendButton} onPress={sendMessage}>
          <Ionicons name="send" size={24} color="white" />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  CB_container: {
    padding: 10,
    backgroundColor: "#fafbfc",
    // flex: 1, // Ensures the container takes up all available space
    borderRadius: 10,
    width: "30%",
    height: "90%",
    marginTop: 54,
  },
  CB_chatArea: {
    flex: 1, // Makes the chat area grow to fill available space
    marginBottom: 10,
  },
  CB_contentContainer: {
    flexGrow: 1,
    justifyContent: 'flex-end', // Ensure the messages start from the bottom
  },
  CB_messageContainer: {
    marginBottom: 10,
    padding: 10,
    borderRadius: 10,
    maxWidth: "75%",
    alignSelf: "flex-start", // Default alignment for received messages
  },
  CB_myMessage: {
    backgroundColor: "#007AFF",
    alignSelf: "flex-end", // Align sent messages to the right
    borderTopRightRadius: 0,
  },
  CB_receivedMessage: {
    backgroundColor: "#e0e0e0",
    alignSelf: "flex-start", // Align received messages to the left
    borderTopLeftRadius: 0,
  },
  CB_messageText: {
    fontSize: 16,
    color: "#fff",
  },
  CB_timestamp: {
    fontSize: 10,
    color: "#ccc",
    marginTop: 5,
    textAlign: "right",
  },
  CB_inputArea: {
    flexDirection: "row",
    alignItems: "center",
    borderTopWidth: 1,
    borderColor: "#cccccc",
    backgroundColor: "#ffffff",
    padding: 10,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 1, // Add shadow on Android
  },
  CB_textInput: {
    flex: 1,
    fontSize: 16,
    padding: 10,
    backgroundColor: "#f0f0f0",
    borderRadius: 20,
    marginRight: 10,
  },
  CB_sendButton: {
    backgroundColor: "#007AFF",
    padding: 10,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
  },
});
