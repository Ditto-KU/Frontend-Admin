import { StyleSheet } from "react-native";

export const PageStyle = StyleSheet.create({
  titleImage: {
    flex: 1,
  },

  // Login
  loginBg: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 280,
  },
  loginHeaderText: {
    fontSize: 40,
    fontWeight: "bold",
    color: "Black",
    marginBottom: 20,
  },
  loginContainer: {
    flex: 1,
    padding: 10,
    backgroundColor: "#f8f8f8",
    width: 400,
    justifyContent: "center",
    alignItems: "center",

    height: 200, // Adjusted for better fit
    borderRadius: 10,
  },
  loginHeader: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  loginInput: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 15,
    paddingHorizontal: 10,
    borderRadius: 5,
    width: "100%",
  },
  loginButton: {
    backgroundColor: "lightgreen",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    width: "100%",
  },
  loginButtonText: {
    color: "black",
    fontSize: 16,
  },

  //Main
  M_main: {
    backgroundColor: "#FFFFFF",
    flex: 1,
    padding: 10,
    width: "100%",
    height: "100%",
    flexDirection: "row",
    // alignItems: "flex-start", // Align items to the top along the cross axis
    justifyContent: "space-between", // Align items to the left along the main axis
  },
  M_sidebar: {
    backgroundColor: "red",
    flex: 1,
    width: "15%",
    height: "100%",
    minHeight: "97.5vh",
    borderRadius: 10,
    justifyContent: "space-between",
    margin: 10,
  },
  M_container_DB: {
    backgroundColor: "#fff",
    flexDirection: "column",
    width: "85%",
    height: "100%",
  },
  M_containerUp_DB: {
    paddingHorizontal: 10,
    borderRadius: 10,
    backgroundColor: "#fff",
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    height: "45%",
  },
  M_CS_DB: {
    width: "50%", // Adjusted to accommodate margin
    height: "100%",
    backgroundColor: "#fff",
    borderRadius: 10,
    // marginRight: "0.7%", // This creates spacing between M_report_DB and M_verify_DB
  },
  M_order_DB: {
    width: "50%", // Adjusted to fit within the container
    height: "100%",
    backgroundColor: "#fff",
    borderRadius: 10,
  },  
  M_containerDown_DB: {
    paddingHorizontal: 10,
    paddingTop: 10,
    borderRadius: 10,
    width: "100%",
    height: "55%",
    backgroundColor: "#fff",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  M_BLcontent_DB: {
    width: "49.5%", //-0.5 for margin
    height: "100%",
    backgroundColor: "#fff",
    borderRadius: 10,
    flexDirection: "row",
  },
  M_UserGraph_DB: {
    width: "50%",
    height: "100%",
    backgroundColor: "#fff",
    borderRadius: 10,
  },
  M_BLcontentL_DB: {
    padding: 5,
    borderRadius: 10,
    width: "50%",
    height: "100%",
    backgroundColor: "#fff",
  },
  M_BLcontentL_Rest_DB: {
    padding: 5,
    borderRadius: 10,
    width: "100%",
    height: "33%",
    backgroundColor: "#fff",
  },
  M_BLcontentL_Income_DB: {
    padding: 5,
    borderRadius: 10,
    width: "100%",
    height: "33%",
    backgroundColor: "#fff",
  },
  M_BLcontentL_NewUser_DB: {
    padding: 5,
    borderRadius: 10,
    width: "100%",
    height: "33%",
    backgroundColor: "#fff",
  },
  M_Verify_DB: {
    padding: 5,
    borderRadius: 10,
    width: "50%",
    height: "100%",
    backgroundColor: "#fff",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  
  //Contact Support
  CS_container: {
    flex: 1,
    padding: 16,
    flexDirection: "column",
    justifyContent: "flex-start",
    backgroundColor: "#F5F5F5",
  },
  CS_header: {
    flexDirection: "column",
    alignItems: "center",
    marginBottom: 16,
  },
  CS_title: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 8,
  },
  CS_searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "20%",
    paddingHorizontal: 16,
    margin: 16
  },
  CS_searchInput: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderColor: "#ccc",
    paddingHorizontal: 8,
    borderRadius: 20,
    backgroundColor: "#FFFFFF",
  },
  CS_content: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 16,
  },
  CS_column: {
    flex: 1,
    justifyContent: "center",
    justifyItems: "center",
    margin: 10,
  },
  CS_columnTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
  },
  CS_requesterList: {
    flex: 1,
    width: "40%",
  },
  CS_walkerList: {
    flex: 1,
    width: "40%",
  },
  CS_listItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 12,  // Increased padding for better spacing
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    marginBottom: 12,  // Increased margin for spacing between items
    borderWidth: 1,  // Added border
    borderColor: "#E0E0E0",  // Light gray border color
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },

  // Report
  RP_container: {
    flex: 1,
    padding: 16,
    flexDirection: "column",
    justifyContent: "flex-start",
  },
  RP_header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  RP_title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  RP_searchContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  RP_searchInput: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderColor: "#ccc",
    paddingHorizontal: 8,
  },
  RP_content: {
    flexDirection: "row",
  },
  RP_requesterList: {
    flex: 1,
    marginRight: 16,
  },
  RP_walkerList: {
    flex: 1,
  },
  RP_listItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },

  // Order
  OR_container: {
    flex: 1,
    padding: 16,
    flexDirection: "column",
    justifyContent: "flex-start",
  },
  OR_header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  OR_title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  OR_searchContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  OR_searchInput: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderColor: "#ccc",
    paddingHorizontal: 8,
  },
  OR_content: {
    flexDirection: "row",
  },
  OR_orderList: {
    flex: 1,
  },
  OR_listItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },

  //Caferteria
  CA_container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  CA_grid: {
    flex: 1,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    alignItems: "center",
  },
  CA_button: {
    width: "48%",
    paddingVertical: 16,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: "#dcdcdc",
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  CA_buttonText: {
    textAlign: "center",
    fontSize: 16,
  },

  //Verify
  VE_container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  VE_buttonContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  VE_button: {
    width: "70%",
    paddingVertical: 16,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: "#dcdcdc",
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  VE_buttonText: {
    textAlign: "center",
    fontSize: 16,
  },

  //User
  US_container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f0f0f0", // Light gray background
  },
  US_buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 20,
  },
  US_button: {
    backgroundColor: "#4CAF50", // Green background for buttons
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 5,
  },
  US_buttonText: {
      color: "#ffffff", // White text color
      fontSize: 16,
      fontWeight: "bold",
      textAlign: "center",
    
  },

  //Contact Support Detail
  CSD_Container: {
    flex: 1,
    padding: 10,
    backgroundColor: "#f0f0f0", // Light gray background
  },
  CSD_Main: {
    flex: 1,
    padding: 10,
    backgroundColor: "#f0f0f0", // Light gray background
    flexDirection: "row",
  },
  CSD_OrderDetail: {
    flex: 1,
    backgroundColor: "#f0f0f0", // Light gray background
    flexDirection: "row",
  },
  CSD_ChatBox: {
    flex: 1,
    backgroundColor: "#f0f0f0", // Light gray background
    height: "100%"
  },
});
