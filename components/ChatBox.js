import React, { useState, useRef } from "react";
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet } from "react-native";

export default function ChatBox() {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState("");
  const textInputRef = useRef(null); // Create a reference for the TextInput

  const sendMessage = () => {
    if (inputText.trim()) {
      setMessages([...messages, { id: Date.now().toString(), text: inputText }]);
      setInputText("");

      // Automatically focus back on the TextInput after sending a message
      if (textInputRef.current) {
        textInputRef.current.focus();
      }
    }
  };

  const renderMessage = ({ item }) => (
    <View style={styles.messageContainer}>
      <Text style={styles.messageText}>{item.text}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item) => item.id}
        style={styles.chatArea}
      />

      <View style={styles.inputArea}>
        <TextInput
          ref={textInputRef} // Attach the reference to the TextInput
          style={styles.textInput}
          placeholder="Type a message..."
          value={inputText}
          onChangeText={setInputText}
          onSubmitEditing={sendMessage} // Sends message on pressing Enter
          blurOnSubmit={false} // Prevents the TextInput from losing focus
        />
        <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
          <Text style={styles.sendButtonText}>Send</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
    backgroundColor: "#ffffff",
    // width: "70%",
    height: "100%",
    borderRadius: 10,
  },
  chatArea: {
    flex: 1,
    marginBottom: 10,
  },
  messageContainer: {
    marginBottom: 10,
    padding: 10,
    backgroundColor: "#ffffff",
    borderRadius: 10,
    alignSelf: "flex-end", // Adjust to "flex-end" for right alignment (e.g., for sender messages)
  },
  messageText: {
    fontSize: 16,
  },
  inputArea: {
    flexDirection: "row",
    alignItems: "center",
    borderTopWidth: 1,
    borderColor: "#cccccc",
    backgroundColor: "#ffffff",
    padding: 10,
    borderRadius: 10,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    padding: 10,
    backgroundColor: "#e0e0e0",
    borderRadius: 20,
    marginRight: 10,
  },
  sendButton: {
    backgroundColor: "#007AFF",
    padding: 10,
    borderRadius: 20,
  },
  sendButtonText: {
    color: "#ffffff",
    fontSize: 16,
  },
});
