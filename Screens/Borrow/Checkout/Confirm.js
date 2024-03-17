import React, { useState } from 'react'
import { View, StyleSheet, Dimensions, ScrollView, TouchableOpacity} from "react-native";
import { Text, HStack, VStack, Avatar, Spacer } from "native-base";

import * as actions from "../../../Redux/Actions/borrowActions";

import Toast from "react-native-toast-message";
import axios from "axios";
import baseURL from "../../../assets/common/baseUrl";
import { useNavigation } from '@react-navigation/native';
import {  useDispatch } from 'react-redux'
import AsyncStorage from "@react-native-async-storage/async-storage"


var { width, height } = Dimensions.get("window");

const Confirm = (props) => {
  const [token, setToken] = useState();
  const finalBorrow = props.route.params;
  const dispatch = useDispatch()
  const navigation = useNavigation();

  
  const confirmBorrow = () => {
    const borrow = finalBorrow.borrow;
    
    AsyncStorage.getItem("jwt")
      .then((res) => {
        setToken(res)

      })
      .catch((error) => console.log(error))
    const config = {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
    axios
      .post(`${baseURL}borrows`, borrow, config)
      .then((res) => {
        if (res.status == 200 || res.status == 201) {
          Toast.show({
            topOffset: 60,
            type: "success",
            text1: "Borrow Completed",
            text2: "",
          });
          // dispatch(actions.clearCart())
          // props.navigation.navigate("Cart")

          setTimeout(() => {
            dispatch(actions.clearBorrow())
            navigation.navigate("Borrow");
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
  }
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.titleContainer}>
        <Text style={{ fontSize: 20, fontWeight: "bold" }}>Confirm Borrowing</Text>
        {props.route.params ? (
          <View style={{ borderWidth: 1, borderColor: "orange" }}>
            <Text style={styles.title}>Borrow by:</Text>
            <View style={{ padding: 8 }}>
              <Text>User: {finalBorrow.borrow.user}</Text>
              <Text>Reason to Borrow: {finalBorrow.borrow.borrowingInfo.reason_borrow}</Text>
              <Text>Date Borrow: {(finalBorrow.borrow.borrowingInfo.date_borrow).toLocaleString()}</Text>
            </View>
            <Text style={styles.title}>items</Text>

            {finalBorrow.borrow.borrowItems.map((item) => {

              return (

                <HStack space={[2, 3]} justifyContent="space-between" key={item.id}>
                  <Avatar
            size="48px"
            source={{
              uri: item.images.length > 0 ? item.images[0].url : "https://cdn.pixabay.com/photo/2012/04/01/17/29/box-23649_960_720.png",
            }}
          />
                  <VStack>
                    <Text _dark={{
                      color: "warmGray.50"
                    }} color="coolGray.800" bold>
                      {item.name}
                    </Text>
                  </VStack>
                  <Spacer />
                  <Text fontSize="xs" _dark={{
                    color: "warmGray.50"
                  }} color="coolGray.800" alignSelf="flex-start">
                    Quantity: {item.quantity}
                  </Text>
                </HStack>
              )
            })}
          </View>
        ) : null}
      </View>
      <View style={{ alignItems: "center", margin: 20 }}>
        <TouchableOpacity
          style={{
            backgroundColor: '#EF4444',
            borderRadius: 20,
            paddingVertical: 15,
            alignItems: 'center',
            width: 300,
          }}
          onPress={() => confirmBorrow()}
        >
          <Text style={{ fontSize: 18, fontWeight: 'bold', color: 'white' }}>Confirm</Text>
        </TouchableOpacity>
          {/* <Button title={"Place order"} onPress={confirmOrder} /> */}
        </View>
    </ScrollView>
  )

}
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