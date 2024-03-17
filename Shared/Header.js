import React, { useContext, useEffect, useState } from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import AuthGlobal from "../Context/Store/AuthGlobal";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import baseURL from "../assets/common/baseUrl";
import { LinearGradient } from "expo-linear-gradient";

const Header = () => {
  const { stateUser } = useContext(AuthGlobal);
  const [userProfile, setUserProfile] = useState(null);
  const [currentDate, setCurrentDate] = useState("");

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = await AsyncStorage.getItem("jwt");
        if (token && stateUser.user.userId) {
          const response = await axios.get(`${baseURL}users/${stateUser.user.userId}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          setUserProfile(response.data);
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    };

    fetchUserProfile();

    setCurrentDate(new Date().toDateString());
  }, [stateUser.user.userId]);

  const welcomeMessage = userProfile
    ? `Welcome, \n${userProfile.name}`
    : "Welcome to TUPT - Event Scheduler";

  return (
    <LinearGradient
      colors={["maroon", "maroon"]}
      style={styles.header}
    >
      <Image
        source={require("../assets/tup.png")}
        resizeMode="contain"
        style={styles.logo}
      />
      <View>
        <Text style={styles.headerText}>
          {stateUser.user.userId ? welcomeMessage : "Welcome to\nTUPT - Event Scheduler"}
        </Text>
        <Text style={styles.innerText}>
          {currentDate}
        </Text>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 10,
    elevation: 20,
    borderStyle: "solid",
  },
  headerText: {
    fontSize: 18,
    color: "white",
    textAlign: "center",
    fontWeight: "bold",
    fontFamily: 'Cochin',
    marginRight: 80,
  },
  logo: {
    height: 85,
    width: 100,
    marginRight: 10,
    borderRadius: 10,
  },
  innerText: {
    color: "white", // Set the font color to white
    fontSize: 15,
    alignSelf: "center",
    marginRight: 80,
  },
});

export default Header;
