import { StyleSheet } from "react-native";

export const ComponentStyle = StyleSheet.create({
    // Sidebar
  sidebar: {
    backgroundColor: "#f8f8f8",
    flex: 1,
    width: "15%",
    height: "100%",
    minHeight: "97.5vh",
    borderRadius: 7,
    justifyContent: "space-between",
  },
  sidebarHeader: {
    fontSize: 30,
    fontWeight: "bold",
    color: "green",
    padding: 20,
    textAlign: "center",
  },
  sidebarContent: {
    padding: 10,
    marginTop: 10,
    flexDirection: "column",
    justifyContent: "center",
  },
  sidebarButton: {
    padding: 10,
    paddingLeft: 20,
    marginBottom: 10,
    borderRadius: 5,
  },
  sidebarButtonPressed: {
    backgroundColor: "#FFF",
  },
  sidebarButtonText: {
    color: "black",
    fontSize: 24, // Adjust text size as needed
    textAlign: "center",
  },
  sidebarIconAndText: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sidebarIcon: {
    width: 30,
    height: 30,
    marginRight: 10,
  },
  sidebarSignOut: {
    alignItems: 'center',
    marginBottom: 10,
    width: "100%",
  },

  // Dashboard
  DB_container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '85%',
    padding: 10,
  },
 
});