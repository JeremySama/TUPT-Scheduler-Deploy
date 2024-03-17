import React, { useEffect, useState, useContext } from "react";
import { View, Text, StyleSheet, TextInput } from "react-native";
import { Picker } from "@react-native-picker/picker";
import Icon from "react-native-vector-icons/FontAwesome";
import TrafficLight from "./StyledComponents/TrafficLight";
import EasyButton from "./StyledComponents/EasyButtons";
import Toast from "react-native-toast-message";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import baseURL from "../assets/common/baseUrl";
import { useNavigation } from "@react-navigation/native";
import AuthGlobal from "../Context/Store/AuthGlobal";

const NotifCard = ({ item }) => {
  const [borrowStatus, setBorrowStatus] = useState();
  const [statusText, setStatusText] = useState();
  const [cardColor, setCardColor] = useState();
  const navigation = useNavigation();
  const context = useContext(AuthGlobal);


  useEffect(() => {
    if (context.stateUser.user.userId) {
     
    } else {
      navigation.navigate("User", { screen: "Login" });
      Toast.show({
        topOffset: 60,
        type: "error",
        text1: "Please Login to Checkout",
        text2: "",
      });
    }
  }, []);

  const updateBorrow = async () => {
    try {
    } catch (error) {
      Toast.show({
        topOffset: 60,
        type: "error",
        text1: "Something went wrong",
        text2: "Please try again",
      });
    }
  };

  useEffect(() => {
    if (item.status === "unread") {
      setBorrowStatus(<TrafficLight unavailable></TrafficLight>);
      setStatusText("unread");
      setCardColor("#E74C3C");
    } else {
      setBorrowStatus(<TrafficLight available></TrafficLight>);
      setStatusText("read");
      setCardColor("#008000");
    }

  
    return () => {
      setBorrowStatus();
      setStatusText();
      setCardColor();
    };
  }, []);



  return (
    <View style={[{ backgroundColor: "#D3D3D3" }, styles.container]}>
      <View style={{ marginTop: 10 }}>
        <Text style={{ color: cardColor, fontWeight: "bold" }}>
          Status: {statusText} {borrowStatus}
        </Text>
        <Text>Message: {item.message}</Text>
        <Text>{item.createdAt?.split("T")[0]}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    margin: 10,
    borderRadius: 10,
  },
  title: {
    backgroundColor: "#62B1F6",
    padding: 5,
  },
  priceContainer: {
    marginTop: 10,
    alignSelf: "flex-end",
    flexDirection: "row",
  },
  price: {
    color: "black",
    fontWeight: "bold",
  },
  input: {
    backgroundColor: "white",
    padding: 10,
    marginTop: 10,
    borderRadius: 5,
  },
});

export default NotifCard;
