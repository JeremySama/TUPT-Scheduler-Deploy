import React, { useState, useEffect, useContext } from "react";
import { View, Text, StyleSheet, Button } from "react-native";
import FormContainer from "../../Shared/Form/FormContainer";
import EasyButton from "../../Shared/StyledComponents/EasyButtons";
import Toast from "react-native-toast-message";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import AuthGlobal from "../../Context/Store/AuthGlobal";
import { useNavigation } from "@react-navigation/native";
import baseURL from "../../assets/common/baseUrl";
import { Picker } from "@react-native-picker/picker";

const UpdateUserStatus = (props) => {
  const [role, setRole] = useState("user"); // Role for the user
  const [status, setStatus] = useState("active"); // Role for the user
  const [user, setUser] = useState("");
  const [token, setToken] = useState("");
  const [error, setError] = useState("");

  const context = useContext(AuthGlobal);
  let navigation = useNavigation();

  useEffect(() => {
    if (context.stateUser.user.userId) {
      // Check if the user parameter exists in navigation
      const userFromParams = props.route.params?.user;
  
      // Use the userFromParams if it exists, otherwise use the logged-in user
      setUser(userFromParams ? userFromParams._id : '');
    } else {
      navigation.navigate("User", { screen: "Login" });
      Toast.show({
        topOffset: 60,
        type: "error",
        text1: "Please Login to Checkout",
        text2: "",
      });
    }
  }, [props.route.params, context.stateUser.user.userId]);

  useEffect(() => {
    AsyncStorage.getItem("jwt")
      .then((res) => {
        setToken(res);
      })
      .catch((error) => console.log(error));
  }, []);

  const updateUserRole = () => {
    if (role === "") {
      setError("Please select a role");
      return;
    }

    const userData = {
      role,
      status,
    };

    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };

    axios
      .put(`${baseURL}users/${user}`, userData, config)
      .then((res) => {
        if (res.status === 200 || res.status === 201) {
          Toast.show({
            topOffset: 60,
            type: "success",
            text1: "User role successfully updated",
            text2: "",
          });
          setTimeout(() => {
            // Navigate to the appropriate screen after updating role
            navigation.navigate("Users");
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
    <FormContainer >
      <Text style={styles.label}>Role</Text>
      <Picker
        selectedValue={role}
        style={{ height: 50, width: "100%" }}
        onValueChange={(itemValue) => setRole(itemValue)}
      >
        <Picker.Item label="User" value="user" />
        <Picker.Item label="Admin" value="admin"/>
        <Picker.Item label="Officer" value="officer"/>
        <Picker.Item label="Professor" value="professor"/>
        {/* Add more roles if needed */}
      </Picker>
      <Picker
        selectedValue={status}
        style={{ height: 50, width: "100%" }}
        onValueChange={(itemValue) => setStatus(itemValue)}
      >
        <Picker.Item label="Active" value="active" />
        <Picker.Item label="Inactive" value="inactive"/>
        {/* Add more roles if needed */}
      </Picker>
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <View style={styles.buttonContainer}>
        <EasyButton large primary onPress={() => updateUserRole()}>
          <Text style={styles.buttonText}>Update Role</Text>
        </EasyButton>
      </View>
    </FormContainer>
  );
};

const styles = StyleSheet.create({
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 10,
  },
  error: {
    color: "red",
    marginTop: 5,
  },
  buttonContainer: {
    alignItems: "center",
    marginTop: 20,
  },
  buttonText: {
    color: "white",
  },
});

export default UpdateUserStatus;
