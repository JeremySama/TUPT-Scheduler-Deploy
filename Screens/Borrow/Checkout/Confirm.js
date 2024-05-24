import React, { useState } from "react";
import {
  View,
  StyleSheet,
  Dimensions,
  ScrollView,
  TouchableOpacity,
  Modal,
  Alert,
} from "react-native";
import { Text, HStack, VStack, Avatar, Spacer, Button } from "native-base";
import * as actions from "../../../Redux/Actions/borrowActions";
import Toast from "react-native-toast-message";
import axios from "axios";
import baseURL from "../../../assets/common/baseUrl";
import { useNavigation } from "@react-navigation/native";
import { useDispatch } from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";

var { width, height } = Dimensions.get("window");

const Confirm = (props) => {
  const [token, setToken] = useState();
  const [showConfirmation, setShowConfirmation] = useState(false); // State for confirmation dialog
  const finalBorrow = props.route.params;
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const confirmBorrow = () => {
    // Execute only if the user confirms terms and agreement
    if (showConfirmation) {
      const borrow = finalBorrow.borrow;

      AsyncStorage.getItem("jwt")
        .then((res) => {
          setToken(res);
        })
        .catch((error) => console.log(error));
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
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
            setTimeout(() => {
              dispatch(actions.clearBorrow());
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
    } else {
      // Show confirmation dialog
      setShowConfirmation(true);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.titleContainer}>
        <Text style={{ fontSize: 20, fontWeight: "bold" }}>
          Confirm Borrowing
        </Text>
        {props.route.params ? (
          <View style={{ borderWidth: 1, borderColor: "orange" }}>
            <Text style={styles.title}>Borrow by:</Text>
            <View style={{ padding: 8 }}>
              <Text>User: {finalBorrow.borrow.user}</Text>
              <Text>
                Reason to Borrow:{" "}
                {finalBorrow.borrow.borrowingInfo.reason_borrow}
              </Text>
              <Text>
                Date Borrow:{" "}
                {finalBorrow.borrow.borrowingInfo.date_borrow.toLocaleString()}
              </Text>
            </View>
            <Text style={styles.title}>items</Text>

            {finalBorrow.borrow.borrowItems.map((item) => {
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
                    Quantity: {item.quantity}
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
          onPress={() => confirmBorrow()}
        >
          <Text style={{ fontSize: 18, fontWeight: "bold", color: "white" }}>
            Confirm
          </Text>
        </TouchableOpacity>
      </View>

      {/* Confirmation Dialog */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={showConfirmation}
        onRequestClose={() => setShowConfirmation(false)}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <ScrollView>
            <Text style={styles.termsText}>
              Welcome to TUP-T Grayhawks! By accessing or utilizing our
              services, you agree to abide by the following terms and
              conditions. These terms govern the use of our website, products,
              and services offered by TUP-T Grayhawks.
              {"\n\n"}
              Acceptance of Terms: Your access to or use of our services
              indicates your acceptance of these terms of agreement. If you
              disagree with any part of these terms, kindly refrain from
              accessing or using our services.
              {"\n\n"}
              Use of Services: Our services are provided on an "as is" and "as
              available" basis. You agree to utilize our services solely for
              lawful purposes and in compliance with all applicable laws and
              regulations.
              {"\n\n"}
              Intellectual Property: All content accessible through our
              services, including but not limited to text, graphics, logos,
              button icons, images, audio clips, digital downloads, and data
              compilations, is the exclusive property of TUP-T Grayhawks or its
              content suppliers and is protected by international copyright
              laws.
              {"\n\n"}
              Privacy Policy: We value your privacy. Please review our Privacy
              Policy, which governs your use of our services, to understand our
              data handling practices.
              {"\n\n"}
              Same Item, Higher Price Policy: Occasionally, due to market
              dynamics or other factors, the price of an item may fluctuate
              without prior notice. While we endeavor to maintain consistent
              pricing, we retain the right to adjust prices as necessary. By
              agreeing to these terms, you acknowledge that the price of an item
              may be higher than previously advertised.
              {"\n\n"}
              Limitation of Liability: Under no circumstances shall TUP-T
              Grayhawks, its officers, directors, employees, or agents be liable
              for any direct, indirect, incidental, special, or consequential
              damages arising from your use of our services, without regard to
              its conflict of law provisions.
              {"\n\n"}
              Changes to Terms: TUP-T Grayhawks reserves the right to modify or
              replace these terms at any time without prior notice. It is your
              responsibility to periodically review these terms for any changes.
              Your continued use of our services after any modifications to
              these terms constitutes acceptance of the revised terms.
              {"\n\n"}
              Thank you for choosing TUP-T Grayhawks.
            </Text>
            </ScrollView>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '100%' }}>
        <Button colorScheme="red" onPress={() => setShowConfirmation(false)} style={{ marginLeft: 40 }}>Cancel</Button>
        <Button colorScheme="green" onPress={() => confirmBorrow()}style={{ marginRight: 40 }}>Agree</Button>
      </View>
          </View>
        </View>
      </Modal>
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
  // Confirmation Dialog styles
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
  },
  termsText: {
    textAlign: "center",
    fontSize: 14,
    marginBottom: 20,
  },
});

export default Confirm;
