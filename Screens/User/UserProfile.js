import React, { useContext, useState, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Image,
  ImageBackground, // Import Image component from react-native
} from "react-native";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import baseURL from "../../assets/common/baseUrl";
import AuthGlobal from "../../Context/Store/AuthGlobal";
import { logoutUser } from "../../Context/Actions/Auth.actions";
import { LinearGradient } from "expo-linear-gradient";

const UserProfile = (props) => {
  const context = useContext(AuthGlobal);
  const [userProfile, setUserProfile] = useState("");
  const [orders, setOrders] = useState([]);
  const [borrows, setBorrows] = useState([]);
  const [calendars, setCalendars] = useState([]);
  const navigation = useNavigation();

  const handleEditPress = () => {
    navigation.navigate("UserProfileForm", { userProfile });
  };

  const handleOrderPress = (order) => {
    //console.log("Order pressed:", order);
    navigation.navigate("OrderDetails", { order });
  };

  const handleCalendarPress = (calendar) => {
    //console.log("Calendar pressed:", calendar);
    navigation.navigate("CalendarDetails", { calendar });
  };

  const handleBorrowPress = (borrow) => {
   //console.log("Borrow pressed:", borrow);
    navigation.navigate("BorrowDetails", { borrow });
  };

  useFocusEffect(
    useCallback(() => {
      if (
        context.stateUser.user.userId
      ) {
        navigation.navigate("Login");
      }

      AsyncStorage.getItem("jwt")
        .then((res) => {
          axios
            .get(`${baseURL}users/${context.stateUser.user.userId}`, {
              headers: { Authorization: `Bearer ${res}` },
            })
            .then((user) => setUserProfile(user.data));
        })
        .catch((error) => console.log(error));

      axios
        .get(`${baseURL}orders`)
        .then((response) => {
          const userOrders = response.data.filter(
            (order) =>
              order.user && order.user.id === context.stateUser.user.userId
          );

          setOrders(userOrders || []);
        })
        .catch((error) => console.log(error));

      axios
        .get(`${baseURL}borrows`)
        .then((response) => {
          const userBorrows = response.data.filter(
            (borrow) =>
              borrow.userId === context.stateUser.user.userId
          );
          console.log("Errors", userBorrows)
          setBorrows(userBorrows || []);
        })
        .catch((error) => console.log(error));

      axios
        .get(`${baseURL}appointments`)
        .then((response) => {
          const userCalendars = response.data.filter(
            (calendar) =>
              calendar.userId &&
              calendar.userId.id === context.stateUser.user.userId
          );

          setCalendars(userCalendars || []);
        })
        .catch((error) => console.log(error));

      return () => {
        setUserProfile("");
        setOrders([]);
        setCalendars([]);
        setBorrows([]);
      };
    }, [context.stateUser.user.userId])
  );
  //console.log("Profile:",userProfile)
  return (
    <View style={styles.container}>

      <ScrollView contentContainerStyle={styles.contentContainer}>

        <LinearGradient colors={["maroon", "white", "white"]}>
          {/* <ImageBackground
          source={require("../../assets/ito.jpg")} // Update with the path to your background image
          style={{ flex: 1, margin: 1 }}
          resizeMode="cover"
        > */}

          {userProfile && userProfile.avatar ? (

            <Image
              source={{ uri: userProfile.avatar.url }}
              style={styles.userImage}
            />
          ) : null}
          <Text style={styles.headerText}>
            {userProfile ? userProfile.name : ""}
          </Text>
          <View style={styles.userInfoContainer}>
            <Text style={styles.userInfoText}>
              <Text style={{ fontWeight: "bold" }}>EMAIL:</Text> {userProfile ? userProfile.email : ""}
            </Text>
            <Text style={styles.userInfoText}>
              <Text style={{ fontWeight: "bold" }}>DEPARTMENT:</Text> {userProfile ? userProfile.department : ""}
            </Text>
            <Text style={styles.userInfoText}>
              <Text style={{ fontWeight: "bold" }}>COURSE:</Text> {userProfile ? userProfile.course : ""}
            </Text>
            <Text style={styles.userInfoText}>
              <Text style={{ fontWeight: "bold" }}>YEAR:</Text> {userProfile ? userProfile.year : ""}
            </Text>
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              onPress={handleEditPress}
              style={[styles.buttonEdit, styles.customButton]}
            >
              <Text
                style={{
                  color: "white",
                  fontStyle: "italic",
                  textTransform: "uppercase",
                  fontWeight: "bold",
                }}
              >
                SETTING
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => [
                AsyncStorage.removeItem("jwt"),
                logoutUser(context.dispatch),
              ]}
              style={styles.customButton}
            >
              <Text
                style={{
                  color: "white",
                  fontStyle: "italic",
                  textTransform: "uppercase",
                  fontWeight: "bold",
                }}
              >
                Sign Out
              </Text>
            </TouchableOpacity>
          </View>
        </LinearGradient>
        {/* </ImageBackground> */}
        {/* <ImageBackground
          source={require("../../assets/court.png")} // Update with the path to your background image
          style={{ flex: 1 }}
          resizeMode="cover"
        > */}
        <View style={styles.orderContainer}>
          <Text
            style={{
              ...styles.orderHeaderText,
              backgroundColor: "rgba(255, 255, 255, .9)",
            }}
          >
            Purchase Records
          </Text>
          <View
            style={{
              ...styles.ordersList,
              backgroundColor: "rgba(255, 255, 255, .85)",
            }}
          >
            {orders && orders.length > 0 ? (
              orders.map((order, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.orderItem}
                  onPress={() => handleOrderPress(order)}
                >
                  {/* <Text style={styles.orderItemText}>Order ID: {order.id}</Text> */}
                  <View style={styles.detailsContainer}>

                    <View style={styles.space}>
                      {order.orderItems.map((item, index) => (
                        <View key={index} style={styles.orderItemContainer}>
                          <Text style={styles.label}>{item.name}</Text>
                          <Text>Price: ₱{item.price}, Quantity: {item.quantity}</Text>
                        </View>
                      ))}
                    </View>
                  </View>
                  <View style={styles.detailsContainer}>
                    <Text style={styles.label}>Status:  <Text>{order.orderStatus}</Text></Text>

                  </View>
                </TouchableOpacity>
              ))
            ) : (
              <View style={styles.noOrderContainer}>
                <Text>You have no orders</Text>
              </View>
            )}
          </View>
        </View>
        <View style={styles.orderContainer}>
          <Text
            style={{
              ...styles.orderHeaderText,
              backgroundColor: "rgba(255, 255, 255, .9)",
            }}
          >
            Scheduled Events
          </Text>
          <View
            style={{
              ...styles.ordersList,
              backgroundColor: "rgba(255, 255, 255, .85)",
            }}
          >
            {calendars && calendars.length > 0 ? (
              calendars.map((calendar, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.orderItem}
                  onPress={() => handleCalendarPress(calendar)}
                >

                  {/* <Text style={styles.orderItemText}>
                    Appointment ID: {calendar.id}
                  </Text> */}
                  <View style={styles.detailsContainer}>
                    <Text style={styles.label}>Title: <Text>{`${calendar.title}`}</Text></Text>

                  </View>
                  <View style={styles.detailsContainer}>
                    <Text style={styles.label}>Location:  <Text>{calendar.location}</Text></Text>

                  </View>
                  <View style={styles.detailsContainer}>
                    <Text style={styles.label}>Status: <Text>{calendar.status}</Text></Text>

                  </View>
                </TouchableOpacity>
              ))
            ) : (
              <View style={styles.noOrderContainer}>
                <Text>You have no Appoointents</Text>
              </View>
            )}
          </View>
        </View>
        <View style={styles.orderContainer}>
          <Text
            style={{
              ...styles.orderHeaderText,
              backgroundColor: "rgba(255, 255, 255, .9)",
            }}
          >
            Borrowed Gear
          </Text>
          <View
            style={{
              ...styles.ordersList,
              backgroundColor: "rgba(255, 255, 255, .85)",
            }}
          >
            {borrows && borrows.length > 0 ? (
              borrows.map((borrow, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.orderItem}
                  onPress={() => handleBorrowPress(borrow)}
                >
                  {/* <Text style={styles.orderItemText}>
                      Borrow ID: {borrow.id}
                    </Text> */}
                  <View style={styles.detailsContainer}>
                    <View style={styles.space}>
                      {borrow.borrowItems.map((item, index) => (
                        <View key={index} style={styles.orderItemContainer}>
                          <Text style={styles.label}>{item.name}</Text>
                          <Text>Quantity: {item.quantity}</Text>
                          <Image
                            source={{ uri: item.image }}
                            style={styles.productImage}
                          />
                        </View>
                      ))}
                    </View>

                  </View>
                  <View style={styles.detailsContainer}>
                    <Text style={styles.label}>Status: <Text>{borrow.status}</Text></Text>

                  </View>
                </TouchableOpacity>

              ))
            ) : (
              <View style={styles.noOrderContainer}>
                <Text>You have no Borrow Equipment</Text>
              </View>
            )}
          </View>
        </View>
        {/* </ImageBackground> */}
      </ScrollView>
    </View >
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  contentContainer: {
    flexGrow: 1,
    paddingHorizontal: 0,
  },
  headerText: {
    fontSize: 15,
    marginTop: 18,
    textAlign: "center",
    fontWeight: "bold",
    color: "black",
    textTransform: "uppercase",
    fontStyle: "italic",
  },
  userInfoContainer: {
    marginVertical: 18,
    padding: 20,
    paddingLeft: 20,
    paddingRight: 20,
    backgroundColor: "white",
    borderRadius: 0,
    elevation: 2,
    alignSelf: "center",
  },
  userInfoText: {
    marginBottom: 0,
    fontSize: 16,
    color: "black",
    fontWeight: "",
  },
  buttonContainer: {
    flexDirection: "row",
    marginBottom: 20,
    marginTop: 20,
    justifyContent: "space-between",
    margin: 50,
  },
  customButton: {
    backgroundColor: "black",
    borderRadius: 3,
    paddingVertical: 5,
    paddingHorizontal: 20,
    elevation: 15,
    color: "black",
  },

  orderContainer: {
    marginBottom: 20,
    borderTopRightRadius: 75
  },
  orderHeaderText: {
    fontSize: 20,
    marginBottom: 0,
    textAlign: "",
    fontWeight: "bold",
    color: "black",
    fontStyle: "italic",
    backgroundColor: "white",
    width: 250,
    marginLeft: 10,
    marginTop: 15,
    elevation: 0,
    borderRadius: 0,
  },
  ordersList: {
    backgroundColor: "#fff",
    borderRadius: 1,
    paddingVertical: 1,
  },
  orderItem: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  orderItemText: {
    fontWeight: "bold",
    fontSize: 12,
    color: "black",
  },
  noOrderContainer: {
    alignItems: "center",
    marginTop: 20,
  },
  // Style for the user image
  userImage: {
    marginTop: 5,
    width: 300,
    height: 250,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    borderBottomRightRadius: 50,
    borderBottomLeftRadius: 50,
    alignSelf: "center",
  },
});

export default UserProfile;
