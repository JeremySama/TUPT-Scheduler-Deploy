import React, { useContext, useState, useEffect } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Icon from "react-native-vector-icons/FontAwesome";
import HomeNavigator from "./HomeNavigator";
import UserNavigator from "./UserNavigator";
import CartIcon from "../Shared/CartIcon";
import BorrowIcon from "../Shared/BorrowIcon";
import NotificationIcon from "../Shared/NotificationIcon";

import CartNavigator from "./CartNavigator";
import MyBorrowNavigator from "./MyBorrowNavigator";
import EquipmentNavigator from "./EquipmentNavigator";
import AdminNavigator from "./AdminNavigator";
import AuthGlobal from "../Context/Store/AuthGlobal";
import CalendarNavigator from "./CalendarNavigator";
import AnnouncementNavigator from "./AnnouncementNavigator";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Notifications from "../Screens/User/Notifications";

import axios from "axios";
import baseURL from "../assets/common/baseUrl";
import { Image } from "react-native";

const Tab = createBottomTabNavigator();

const Main = () => {
  const { stateUser } = useContext(AuthGlobal);
  const [userProfile, setUserProfile] = useState(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = await AsyncStorage.getItem("jwt");
        if (token && stateUser.user.userId) {
          const response = await axios.get(
            `${baseURL}users/${stateUser.user.userId}`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          setUserProfile(response.data);
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    };

    fetchUserProfile();

    // Cleanup function
    return () => {
      setUserProfile(null); // Reset userProfile to null on logout
    };
  }, [stateUser.isAuthenticated, stateUser.user.userId]);

  const renderUserIcon = () => {
    if (userProfile && userProfile.avatar.url) {
      return (
        <Image
          source={{ uri: userProfile.avatar.url }}
          style={{ width: 30, height: 30, borderRadius: 15 }}
        />
      );
    } else {
      return (
        <Icon
          name="user"
          style={{ position: "relative" }}
          color="gray" // Default icon color if user image is not available
          size={30}
        />
      );
    }
  };

  // Check if the user is logged in and has admin privileges
  const isAdminOrSuperAdmin =
    stateUser.isAuthenticated &&
    (stateUser.user.role === "admin" || stateUser.user.role === "officer");

  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={{
        tabBarHideOnKeyboard: true,
        tabBarShowLabel: false,
        tabBarActiveTintColor: "#e91e63",
      }}
    >
      <Tab.Screen
        name="Equipment"
        component={EquipmentNavigator}
        options={{
          tabBarIcon: ({ color }) => (
            <Icon
              name="archive"
              style={{ position: "relative" }}
              color={color}
              size={30}
            />
          ),
          headerStyle: {
            backgroundColor: "maroon", // Set your desired background color
            height: 50, // Adjust the height of the header as needed
          },
          headerTintColor: "#fff", // Set the text color in the header
          headerTitleAlign: "center",
          headerTitleStyle: {
            fontWeight: "bold",
            fontSize: 18, // Adjust the font size of the header title as needed
            marginTop: -40, // Adjust the top margin of the title as needed
            textTransform: "uppercase",
          },
        }}
      />

      <Tab.Screen
        name="MyBorrowNavigator"
        component={MyBorrowNavigator}
        options={{
          tabBarIcon: ({ color }) => (
            <>
              <BorrowIcon />
              <Icon
                name="cube"
                style={{ position: "relative" }}
                color={color}
                size={30}
              />
            </>
          ),
          headerStyle: {
            backgroundColor: "maroon", // Set your desired background color
            height: 30, // Adjust the height of the header as needed
          },
          headerTintColor: "#fff", // Set the text color in the header
          headerTitleAlign: "center",
          headerTitleStyle: {
            fontWeight: "bold",
            fontSize: 18, // Adjust the font size of the header title as needed
            marginTop: -40, // Adjust the top margin of the title as needed
            textTransform: "uppercase",
          },
          title: 'My Borrow List'
        }}
      />

      <Tab.Screen
        name="CartNavigator"
        component={CartNavigator}
        options={{
          tabBarIcon: ({ color }) => (
            <>
              <CartIcon />
              <Icon
                name="shopping-cart"
                style={{ position: "relative" }}
                color={color}
                size={30}
              />
            </>
          ),
          headerStyle: {
            backgroundColor: "maroon", // Set your desired background color
            height: 50, // Adjust the height of the header as needed
          },
          headerTintColor: "#fff", // Set the text color in the header
          headerTitleAlign: "center",
          headerTitleStyle: {
            fontWeight: "bold",
            fontSize: 18, // Adjust the font size of the header title as needed
            marginTop: -40, // Adjust the top margin of the title as needed
            textTransform: "uppercase",
          },
          title: 'Checkout'
        }}
      />

      <Tab.Screen
        name="Home"
        component={HomeNavigator}
        options={{
          tabBarIcon: ({ color }) => (
            <Icon
              name="home"
              style={{ position: "relative" }}
              color={color}
              size={30}
            />
          ),
          headerStyle: {
            height: 0, // Adjust the height of the header as needed
          },
          // headerTitleStyle: {
          //   fontSize: 2, // Adjust the font size of the header title as needed
          //   marginTop: -40,
          // },
        }}
      />

      <Tab.Screen
        name="Calendar"
        component={CalendarNavigator}
        options={{
          tabBarIcon: ({ color }) => (
            <Icon
              name="calendar"
              style={{ position: "relative" }}
              color={color}
              size={30}
            />
          ),
          headerStyle: {
            backgroundColor: "maroon", // Set your desired background color
            height: 50, // Adjust the height of the header as needed
          },
          headerTintColor: "#fff", // Set the text color in the header
          headerTitleAlign: "center",
          headerTitleStyle: {
            fontWeight: "bold",
            fontSize: 18, // Adjust the font size of the header title as needed
            marginTop: -40, // Adjust the top margin of the title as needed
            textTransform: "uppercase",
          },
        }}
      />

      <Tab.Screen
        name="Announcment"
        component={AnnouncementNavigator}
        options={{
          tabBarIcon: ({ color }) => (
            <Icon
              name="list"
              style={{ position: "relative" }}
              color={color}
              size={30}
            />
          ),
          headerStyle: {
            height: 0, // Adjust the height of the header as needed
          },
          // headerTitleStyle: {
          //   fontSize: 2, // Adjust the font size of the header title as needed
          //   marginTop: -40,
          // },
        }}
      />
      {stateUser.user.userId && (
        <Tab.Screen
          name="Notifications"
          component={Notifications}
          options={{
            tabBarIcon: ({ color }) => (
              <>
                <NotificationIcon />
                <Icon
                  name="bell"
                  style={{ position: "relative" }}
                  color={color}
                  size={30}
                />
              </>
            ),
            headerStyle: {
              height: 0,
            },
          }}
        />
      )}

      {isAdminOrSuperAdmin && (
        <Tab.Screen
          name="Admin"
          component={AdminNavigator}
          options={{
            tabBarIcon: ({ color }) => (
              <Icon
                name="cog"
                style={{ position: "relative" }}
                color={color}
                size={30}
              />
            ),
            headerStyle: {
              height: 30, // Adjust the height of the header as needed
            },
          }}
        />
      )}

      <Tab.Screen
        name="User"
        component={UserNavigator}
        options={{
          tabBarIcon: ({}) => renderUserIcon(),
          headerStyle: {
            height: 3, // Adjust the height of the header as needed
          },
          headerShown: false,
        }}
      />
    </Tab.Navigator>
  );
};

export default Main;
