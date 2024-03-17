import React, { useState, useEffect, useContext } from "react";
import { View, Text, StyleSheet, Button } from "react-native";
import FormContainer from "../../Shared/Form/FormContainer";
import Input from "../../Shared/Form/Input";
import EasyButton from "../../Shared/StyledComponents/EasyButtons";
import Toast from "react-native-toast-message";
import AsyncStorage from "@react-native-async-storage/async-storage";
import baseURL from "../../assets/common/baseUrl";
import Error from "../../Shared/Error";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";
import AuthGlobal from "../../Context/Store/AuthGlobal";

const ProductFormStock = (props) => {
  const context = useContext(AuthGlobal);

  const [quantity, setQuantity] = useState("");
  const [token, setToken] = useState();
  const [error, setError] = useState();
  const [department, setDepartment] = useState("");
  const [course, setCourse] = useState("");
  const [year, setYear] = useState("");
  const [username, setUsername] = useState("");
  const [role, setRole] = useState("");

  let navigation = useNavigation();

  useEffect(() => {
    if (context.stateUser.user.userId) {
      setUsername(context.stateUser.user.name);
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

  useEffect(() => {
    AsyncStorage.getItem("jwt")
      .then((res) => {
        setToken(res);
      })
      .catch((error) => console.log(error));
  }, []);

  const addEquipment = () => {
    if (quantity === "") {
      setError("Please enter quantity");
      return;
    } else {
      setError(null);
    }

    let byInfo = "";
    if (role === "professor") {
      byInfo = `${username}, ${department}`;
    } else {
      byInfo = `${username}, ${department}, ${course}, ${year}`;
    }

    const requestData = {
      quantity: parseInt(quantity),
      by: byInfo,
    };

    axios
      .put(`${baseURL}products/updateProductStock/${props.route.params.item.id}`, requestData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        if (res.status == 200 || res.status == 201) {
          Toast.show({
            topOffset: 60,
            type: "success",
            text1: "Equipment stock updated successfully",
            text2: "",
          });
          setTimeout(() => {
            navigation.navigate("Products");
          }, 500);
        }
      })
      .catch((error) => {
        console.log(error);
        Toast.show({
          topOffset: 60,
          type: "error",
          text1: "Something went wrong",
          text2: "Please try again",
        });
      });
  };

  return (
    <FormContainer title="Update Product Stock">
      <View style={styles.label}>
        <Text style={{ textDecorationLine: "underline" }}>Quantity</Text>
      </View>
      <Input
        keyboardType="numeric"
        placeholder="Quantity"
        name="quantity"
        id="quantity"
        value={quantity}
        onChangeText={(text) => setQuantity(text)}
      />
      {error ? <Error message={error} /> : null}
      <View style={styles.buttonContainer}>
        <EasyButton large primary onPress={() => addEquipment()}>
          <Text style={styles.buttonText}>Confirm</Text>
        </EasyButton>
      </View>
    </FormContainer>
  );
};

const styles = StyleSheet.create({
  label: {
    width: "80%",
    marginTop: 10,
  },
  buttonContainer: {
    width: "80%",
    marginBottom: 80,
    marginTop: 20,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
  },
});

export default ProductFormStock;
