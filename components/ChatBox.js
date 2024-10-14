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
  ScrollView,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import io from "socket.io-client";
import "react-native-url-polyfill/auto";

export default function ChatBox({ orderId, userId, role }) {
  const [targetRole, setTargetRole] = useState("admin");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [socket, setSocket] = useState(null);
  const [isSending, setIsSending] = useState(false);
  const scrollViewRef = useRef(null);

  useEffect(() => {
    const newSocket = io("https://ku-man-chat.vimforlanie.com/");
    setSocket(newSocket);

    if (userId && role && orderId) {
      newSocket.emit("joinOrderChat", { userId, role, orderId, targetRole });

      // Request chat history from server
      newSocket.emit("requestChatHistory", { orderId });
    }

    // Receive messages from the server
    newSocket.on("message", (data) => {
      setMessages((prevMessages) => {
        const updatedMessages = [...prevMessages, data];
        return updatedMessages.sort(
          (a, b) => new Date(a.timestamp) - new Date(b.timestamp)
        );
      });
      scrollToBottom();
    });

    newSocket.on("oldMessages", (oldMessages) => {
      setMessages((prevMessages) => {
        const combinedMessages = [...oldMessages, ...prevMessages];
        return combinedMessages.sort(
          (a, b) => new Date(a.timestamp) - new Date(b.timestamp)
        );
      });
      scrollToBottom();
    });

    return () => newSocket.disconnect();
  }, [orderId, userId, role, targetRole]);

  const scrollToBottom = () => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollToEnd({ animated: true });
    }
  };

  // Modify sendMessage to use state directly
  const sendMessage = () => {
    if (socket && message.trim() !== "" && !isSending) {
      setIsSending(true);

      const newMessage = {
        orderId,
        message: message.trim(),
        fromUser: userId,
        role,
        targetRole,
        timestamp: new Date().toISOString(),
      };

      socket.emit("orderMessage", newMessage, (response) => {
        setIsSending(false);

        if (response && response.success) {
          setMessages((prevMessages) => {
            const updatedMessages = [...prevMessages, newMessage];
            return updatedMessages.sort(
              (a, b) => new Date(a.timestamp) - new Date(b.timestamp)
            );
          });
          setMessage(""); // Clear the input
          scrollToBottom();
        }
      });

      setTimeout(() => {
        setIsSending(false);
        setMessage("");
      }, 100);
    }
  };

  const renderMessage = ({ item }) => {
    if (item.fromUser === userId) {
      return (
        <View style={styles.sentMessageWrapper}>
          <View style={styles.sentMessage}>
            <Text style={styles.messageText}>{item.message}</Text>
            <Text style={styles.timestamp}>
              {new Date(item.timestamp).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </Text>
          </View>
          <Ionicons
            name="person-circle"
            size={32}
            color="black"
            style={styles.sentIcon}
          />
        </View>
      );
    } else {
      return (
        <View style={styles.receivedMessageWrapper}>
          <Ionicons
            name="person-circle-outline"
            size={32}
            color="green"
            style={styles.receivedIcon}
          />
          <View style={styles.receivedMessage}>
            <Text style={styles.messageText}>{item.message}</Text>
            <Text style={styles.timestamp}>
              {new Date(item.timestamp).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </Text>
          </View>
        </View>
      );
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.chatContainer}>
        <ScrollView
          ref={scrollViewRef}
          contentContainerStyle={styles.messageScroll}
          onContentSizeChange={() =>
            scrollViewRef.current.scrollToEnd({ animated: true })
          }
        >
          <FlatList
            data={messages}
            keyExtractor={(item, index) => index.toString()}
            renderItem={renderMessage}
            style={styles.messageList}
            contentContainerStyle={styles.messageListContent}
          />
        </ScrollView>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 5 : 0}
        style={styles.inputWrapper}
      >
        <TextInput
          style={styles.messageInput}
          placeholder="Type a message..."
          value={message}
          onChangeText={setMessage}
          onSubmitEditing={sendMessage} // Use sendMessage directly
          blurOnSubmit={false}
        />
        <TouchableOpacity
          onPress={sendMessage} // Call sendMessage without arguments
          style={[styles.sendButton, isSending && styles.disabledButton]}
          disabled={isSending}
        >
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
    padding: 10,
  },
  messageList: {
    flex: 1,
  },
  chatContainer: {
    flex: 1,
    padding: 10,
    borderRadius: 10,
    maxHeight: Dimensions.get("window").height * 0.8,
  },
  messageScroll: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  messageListContent: {
    paddingBottom: 10,
  },
  messageWrapper: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 10,
    maxWidth: "80%",
  },
  sentMessageWrapper: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    marginVertical: 10,
    marginHorizontal: 16,
  },
  receivedMessageWrapper: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    marginVertical: 10,
    marginHorizontal: 16,
  },
  sentMessage: {
    backgroundColor: "#E0E0E0",
    padding: 10,
    borderRadius: 15,
    maxWidth: "80%",
  },
  receivedMessage: {
    backgroundColor: "#E8F5E9",
    padding: 10,
    borderRadius: 15,
    maxWidth: "80%",
  },
  messageText: {
    fontSize: 16,
  },
  timestamp: {
    fontSize: 12,
    color: "#888",
    marginTop: 5,
  },
  sentIcon: {
    marginLeft: 10,
  },
  receivedIcon: {
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
  disabledButton: {
    backgroundColor: "#999",
  },
});
