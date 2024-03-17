import React, { useState } from "react";
import {
  View,
  StyleSheet,
  Dimensions,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { Text, HStack, VStack, Avatar, Spacer } from "native-base";

import * as actions from "../../../Redux/Actions/cartActions";

import Toast from "react-native-toast-message";
import axios from "axios";
import baseURL from "../../../assets/common/baseUrl";
import { useNavigation } from "@react-navigation/native";
import { useDispatch } from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";

var { width, height } = Dimensions.get("window");

const Confirm = (props) => {
  const [token, setToken] = useState();
  const finalOrder = props.route.params;
  //console.log("order", finalOrder)
  const dispatch = useDispatch();
  let navigation = useNavigation();

  const confirmOrder = () => {
    const order = finalOrder.order.order;
    const payment = finalOrder.payment;

    order.paymentMeth = payment.paymentMeth;
    order.reference_num = payment.reference_num;
    // console.log("Order Details: ",order)

    const formData = new FormData();
    formData.append(
      "shippingInfo[address]",
      finalOrder.order.order.shippingInfo.address
    );
    formData.append(
      "shippingInfo[city]",
      finalOrder.order.order.shippingInfo.city
    );
    formData.append(
      "shippingInfo[phoneNo]",
      finalOrder.order.order.shippingInfo.phoneNo
    );
    formData.append(
      "shippingInfo[postalCode]",
      finalOrder.order.order.shippingInfo.postalCode
    );
    formData.append(
      "shippingInfo[country]",
      finalOrder.order.order.shippingInfo.country
    );
    formData.append("user", finalOrder.order.order.user);
    formData.append("customer", finalOrder.order.order.customer);
    formData.append("email", finalOrder.order.order.email);
    const orderItems = finalOrder.order.order.orderItems;
    formData.append("orderItems", JSON.stringify(orderItems));
    formData.append("paymentInfo[id]", finalOrder.order.order.paymentInfo.id);
    formData.append(
      "paymentInfo[status]",
      finalOrder.order.order.paymentInfo.status
    );
    formData.append("itemsPrice", finalOrder.order.order.itemsPrice);
    formData.append("shippingPrice", finalOrder.order.order.shippingPrice);
    formData.append("orderStatus", finalOrder.order.order.orderStatus);
    formData.append("deliveredAt", finalOrder.order.order.deliveredAt);
    formData.append("paymentMeth", finalOrder.payment.paymentMeth);
    formData.append("reference_num", finalOrder.payment.reference_num);
    finalOrder.payment.images.forEach((image, index) => {
      // Append each image as a file
      formData.append(`images`, {
        uri: image.uri,
        name: `image-${index}.jpg`,
        type: "image/jpeg", // Correct MIME type for JPEG images
      });
    });
   // console.log("Order Details: ", formData);

    AsyncStorage.getItem("jwt")
      .then((res) => {
        setToken(res);
      })
      .catch((error) => console.log(error));
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    };

    axios
      .post(`${baseURL}orders`, formData, config)
      .then((res) => {
        if (res.status == 200 || res.status == 201) {
          Toast.show({
            topOffset: 60,
            type: "success",
            text1: "Order Completed",
            text2: "",
          });
          setTimeout(() => {
            dispatch(actions.clearCart());
            navigation.navigate("Cart");
          }, 500);
        }
      })
      .catch((error) => {
        Toast.show({
          topOffset: 60,
          type: "error",
          text1: "Something went wrong",
          text2: "Please try again",
        });
      });
  };
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.titleContainer}>
        <Text style={{ fontSize: 20, fontWeight: "bold" }}>Confirm Order</Text>
        {props.route.params ? (
          <View style={{ borderWidth: 1, borderColor: "orange" }}>
            <Text style={styles.title}>Shipping to:</Text>
            <View style={{ padding: 8 }}>
              <Text>
                Address: {finalOrder.order.order.shippingInfo.address}
              </Text>
              <Text>City: {finalOrder.order.order.shippingInfo.city}</Text>
              <Text>
                Zip Code: {finalOrder.order.order.shippingInfo.postalCode}
              </Text>
              <Text>Total Price: ₱{finalOrder.order.order.totalPrice}</Text>
              <Text>Payment Method: {finalOrder.payment.paymentMeth}</Text>
              <Text>Reference Number: {finalOrder.payment.reference_num}</Text>
            </View>
            <Text style={styles.title}>items</Text>

            {finalOrder.order.order.orderItems.map((item) => {
              return (
                <HStack
                  space={[2, 3]}
                  justifyContent="space-between"
                  key={item.id}
                >
                  <Avatar
                    size="48px"
                    source={{
                      uri:
                        item.images.length > 0
                          ? item.images[0].url
                          : "https://cdn.pixabay.com/photo/2012/04/01/17/29/box-23649_960_720.png",
                    }}
                  />
                  <VStack>
                    <Text
                      _dark={{
                        color: "warmGray.50",
                      }}
                      color="coolGray.800"
                      bold
                    >
                      {item.name}
                    </Text>
                  </VStack>
                  <Spacer />
                  <Text
                    fontSize="xs"
                    _dark={{
                      color: "warmGray.50",
                    }}
                    color="coolGray.800"
                    alignSelf="flex-start"
                  >
                    ₱ {item.price} x {item.quantity}
                  </Text>
                </HStack>
              );
            })}
          </View>
        ) : null}
      </View>
      <View style={{ alignItems: "center", margin: 20 }}>
        <TouchableOpacity
          style={{
            backgroundColor: "#EF4444",
            borderRadius: 20,
            paddingVertical: 15,
            alignItems: "center",
            width: 300,
          }}
          onPress={() => confirmOrder()}
        >
          <Text style={{ fontSize: 18, fontWeight: "bold", color: "white" }}>
            Confirm
          </Text>
        </TouchableOpacity>
        {/* <Button title={"Place order"} onPress={confirmOrder} /> */}
      </View>
    </ScrollView>
  );
};
const styles = StyleSheet.create({
  container: {
    height: height,
    padding: 8,
    alignContent: "center",
    backgroundColor: "white",
  },
  titleContainer: {
    justifyContent: "center",
    alignItems: "center",
    margin: 8,
  },
  title: {
    alignSelf: "center",
    margin: 8,
    fontSize: 16,
    fontWeight: "bold",
  },
  listItem: {
    alignItems: "center",
    backgroundColor: "white",
    justifyContent: "center",
    width: width / 1.2,
  },
  body: {
    margin: 10,
    alignItems: "center",
    flexDirection: "row",
  },
});
export default Confirm;
