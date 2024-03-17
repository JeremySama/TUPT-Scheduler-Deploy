import React, { useEffect, useState,useContext } from "react";
import { View, Text, StyleSheet } from "react-native";
import { Picker } from "@react-native-picker/picker";  // Correct import for Picker
import Icon from "react-native-vector-icons/FontAwesome";
import TrafficLight from "./StyledComponents/TrafficLight";
import EasyButton from "./StyledComponents/EasyButtons";
import Toast from "react-native-toast-message";

import AsyncStorage from '@react-native-async-storage/async-storage'
import axios from "axios";
import baseURL from "../assets/common/baseUrl";
import { useNavigation } from '@react-navigation/native'
import AuthGlobal from "../Context/Store/AuthGlobal";


const codes = [
  { name: "Pending", code: "Pending " },
  { name: "For Pickup", code: "For Pickup" },
  { name: "Sold", code: "Sold" },
];

const OrderCard = ({ item }) => {
  const [orderStatus, setOrderStatus] = useState();
  const [statusText, setStatusText] = useState();
  const [statusChange, setStatusChange] = useState("");
  const [token, setToken] = useState("");
  const [cardColor, setCardColor] = useState();
  const navigation = useNavigation();

  const context = useContext(AuthGlobal);

  const [name, setName] = useState(null);
  const [department, setDepartment] = useState(null);
  const [course, setCourse] = useState(null);
  const [year, setYear] = useState(null);
  const [role, setRole] = useState(null);

  
  useEffect(() => {
    if (context.stateUser.user.userId) {
      setName(context.stateUser.user.name);
      setDepartment(context.stateUser.user.department);
      setCourse(context.stateUser.user.course);
      setYear(context.stateUser.user.year);
      setRole(context.stateUser.user.role);
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

  const updateOrder = async () => {
    try {
      const token = await AsyncStorage.getItem("jwt");
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      let userInfo = "";
      if (role === "professor") {
        userInfo = `${name}, ${department}`;
      } else {
        userInfo = `${name}, ${department}, ${course}, ${year}`;
      }

      const order = {
        user: userInfo,
        orderStatus: statusChange,
      };
      const response = await axios.put(`${baseURL}orders/${item.id}`, order, config);
  
      if (response.status === 200 || response.status === 201) {
        Toast.show({
          topOffset: 60,
          type: "success",
          text1: "Product Edited",
          text2: "",
        });
        setTimeout(() => {
          navigation.navigate("Products");
        }, 500);
      }
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
    if (item.orderStatus === "Pending") {
      setOrderStatus(<TrafficLight unavailable></TrafficLight>);
      setStatusText("Pending ");
      setCardColor("#E74C3C");
    } else if (item.orderStatus === "For Pickup") {
      setOrderStatus(<TrafficLight limited></TrafficLight>);
      setStatusText("For Pickup");
      setCardColor("#F1C40F");
    } else {
      setOrderStatus(<TrafficLight available></TrafficLight>);
      setStatusText("Sold");
      setCardColor("#2ECC71");
      //console.log(item.orderStatus)
    }

    return () => {
      setOrderStatus();
      setStatusText();
      setCardColor();
    };
  }, []);

  return (
    <View style={[{ backgroundColor: "#D3D3D3" }, styles.container]}>
      <View style={styles.container}>
        <Text>Order Number: #{item.id}</Text>
      </View>
      <View style={{ marginTop: 10 }}>
        <Text style={{ color: cardColor, fontWeight: "bold" }}>
          Status: {statusText} {orderStatus}
        </Text>
        <Text>
          Customer: {item.customer}
        </Text>

        <Text>
          Address: {item.shippingInfo.address}
        </Text>
        <Text>City: {item.shippingInfo.city}</Text>
        <Text>Payment Method: {item.paymentMeth}</Text>
        <Text>Reference Number: {item.reference_num}</Text>
        <Text>Date Ordered: {item.createdAt.split("T")[0]}</Text>
        <View style={styles.priceContainer}>
          <Text>Price: </Text>
          <Text style={styles.price}>₱ {item.totalPrice}</Text>
        </View>
        <View>
          <Picker
            mode="dropdown"
            iosIcon={<Icon name="arrow-down" color={"#007aff"} />}
            style={{ width: undefined, color: "black" }}
            selectedValue={statusChange}
            onValueChange={(value) => setStatusChange(value)}
          >
            <Picker.Item label="Change Status" value="" />
            {codes.map((c) => (
              <Picker.Item key={c.name} label={c.name} value={c.name} />
            ))}
          </Picker>

          <EasyButton secondary large onPress={updateOrder}>
            <Text style={{ color: "white" }}>Update</Text>
          </EasyButton>
        </View>
      </View>
    </View>
  );
}

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
});

export default OrderCard;
