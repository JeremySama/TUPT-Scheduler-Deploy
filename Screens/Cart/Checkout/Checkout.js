import React, { useEffect, useState, useContext } from "react";
import { Text, View,TouchableOpacity, StyleSheet } from "react-native";
import { Select, Toast,Input } from "native-base";
import Icon from "react-native-vector-icons/FontAwesome";
import FormContainer from "../../../Shared/Form/FormContainer";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import AuthGlobal from "../../../Context/Store/AuthGlobal";

const cities = require("../../../assets/countries.json");

const Checkout = (props) => {
  const [orderItems, setOrderItems] = useState([]);
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [zip, setZip] = useState("");
  const [error, setError] = useState("");
  const [phone, setPhone] = useState("");
  const [user, setUser] = useState("");
  const [department, setDepartment] = useState("");
  const [course, setCourse] = useState("");
  const [year, setYear] = useState("");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [totalPrice, setTotalPrice] = useState(0);

  const navigation = useNavigation();
  const cartItems = useSelector((state) => state.cartItems);
  const context = useContext(AuthGlobal);

  useEffect(() => {
    setOrderItems(cartItems);
    
    // Calculate total price
    let total = 0;
    cartItems.forEach((item) => {
      total += item.price * item.quantity;
    });
    setTotalPrice(total);

    if (context.stateUser.user.userId) {
      setUser(context.stateUser.user.userId);
      setEmail(context.stateUser.user.email);
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

    return () => {
      setOrderItems([]);
      //console.log("email: ", email);
    };
  }, [cartItems, context.stateUser.user.userId, navigation]);
  //console.log("haha",orderItems)
  const checkOut = async () => {
    
    setError(""); // Clear previous errors
    let total = 0;
    orderItems.forEach((item) => {
      total += item.price * item.quantity;
    });
    let customerInfo = "";
    if (role === "professor") {
      customerInfo = `${name} - ${department}`;
    } else {
      customerInfo = `${name} - ${department}, ${course}, ${year}`;
    }
    const isValidPhoneNumber = /^\d{11}$/.test(phone);
    if (!isValidPhoneNumber) {
      setError("Phone number must be 11 digits");
      return;
    }
    if (address === "" || city === "" || phone === "" || zip === "") {
      setError("Please fill in the form correctly");
      return;
    }
    let order = {
      shippingInfo: {
        address,
        city,
        phoneNo: phone,
        postalCode: zip,
        country: "Philippines", // Set your default country here
      },
      user,
      email,
      customer: customerInfo,
      orderItems,
      paymentInfo: {
        id: "pi_1DpdYh2eZvKYlo2CYIynhU32",
        status: "Pending",
      },
      paidAt: Date.now(),
      itemsPrice: total, // Add itemsPrice to the order
      shippingPrice: 0, // Update with your shipping price logic
      totalPrice: total, // Add totalPrice to the order
      orderStatus: "Pending",
      deliveredAt: Date.now(),
    };
    
    navigation.navigate("Payment", { order: order });
  };

  //console.log(orderItems);
  return (
    <KeyboardAwareScrollView
      viewIsInsideTabBar={true}
      extraHeight={200}
      enableOnAndroid={true}
      alignItems="center"
    >
      <FormContainer title={"Order Info"}>
        <Input
          placeholder={"Mobile Number"}
          name={"phone"}
          value={phone}
          keyboardType={"numeric"}
          onChangeText={(text) => setPhone(text)}
          maxLength={11}
          marginBottom={5}
        />
        <Input
          placeholder={"Address"}
          name={"ShippingAddress"}
          value={address}
          onChangeText={(text) => setAddress(text)}
          marginBottom={5}
        />
        <Input
          placeholder={"Zip Code"}
          name={"zip"}
          value={zip}
          keyboardType={"numeric"}
          onChangeText={(text) => setZip(text)}
          marginBottom={5}
          maxLength={4}
        />
        <Select
          width="80%"
          iosIcon={<Icon name="arrow-down" color={"#007aff"} />}
          style={{ width: undefined }}
          selectedValue={city}
          placeholder="Select your City"
          placeholderStyle={{ color: "#007aff" }}
          placeholderIconColor="#007aff"
          onValueChange={(e) => setCity(e)}
        >
          {cities.map((c) => {
            return <Select.Item key={c.code} label={c.name} value={c.name} />;
          })}
        </Select>

        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            marginTop: 20,
          }}
        >
          <Text style={{ fontSize: 16 }}>Total Price:</Text>
          <Text style={{ fontSize: 16, fontWeight: "bold" }}>
            ₱{totalPrice.toFixed(2)}
          </Text>
        </View>
        {error ? <Text style={styles.errorText}>{error}</Text> : null}
      </FormContainer>
      <View style={{ marginTop: 20, alignItems: "center" }}>
        <TouchableOpacity
          style={{
            backgroundColor: "#EF4444",
            borderRadius: 20,
            paddingVertical: 10,
            alignItems: "center",
            width: 300,
          }}
          onPress={() => checkOut()}
        >
          <Text style={{ fontSize: 18, fontWeight: "bold", color: "white" }}>
            Confirm
          </Text>
        </TouchableOpacity>
        {/* <Button title="Confirm" onPress={() => checkOut()} /> */}
      </View>
    </KeyboardAwareScrollView>
  );
};

const styles = StyleSheet.create({
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 5,
  },
  checkbox: {
    height: 24,
    width: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#007bff",
    marginRight: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  checkmark: {
    width: 12,
    height: 12,
    backgroundColor: "#007bff",
    borderRadius: 6,
  },
  checkboxTitle: {
    fontSize: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 10,
  },
  buttonContainer: {
    alignItems: "center",
    marginTop: 20,
  },
  buttonText: {
    color: "white",
  },
  errorText: {
    color: "red",
    marginTop: 10,
  },
  dateTimeText: {
    fontSize: 16,
    borderWidth: 1,
    borderColor: "black",
    borderRadius: 5,
    padding: 10,
    color: "black",
    width: 300,
    textAlign: "center",
  },
});
export default Checkout;
