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

const codes = [
  { name: "Pending", code: "Pending " },
  { name: "Approved", code: "Approved" },
  { name: "Denied", code: "Denied" },
  { name: "Returned", code: "Returned" },
  { name: "Borrowed", code: "Borrowed" },
];

const issues = [
  "N/A",
  "Damage",
  "Missing",
  "Incorrect Equipment",
  "Dirty or Unhygienic Equipment",
  "Incomplete Sets",
  "Incorrect Use or Mishandling",
  "Stolen or Unreturned Items",
  "On Process",
];

const formatDate = (date) => {
  const options = {
    year: "numeric",
    month: "numeric",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
  };
  return new Date(date).toLocaleDateString("en-US", options);
};

const BorrowCard = ({ item }) => {
  const [borrowStatus, setBorrowStatus] = useState();
  const [statusText, setStatusText] = useState();
  const [statusChange, setStatusChange] = useState("");
  const [issueChange, setIssueChange] = useState("");
  const [datePickerVisible, setDatePickerVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState("N/A"); // Initial value set to "N/A"
  const [reasonStatus, setReasonStatus] = useState("");
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

  const showDatePicker = () => {
    setDatePickerVisible(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisible(false);
  };

  const handleDateConfirm = (date) => {
    setSelectedDate(date);
    hideDatePicker();
    //console.log(selectedDate)
  };

  const updateBorrow = async () => {
    try {
      const token = await AsyncStorage.getItem("jwt");
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      let BorrowerInfo = "";
      if (role === "professor") {
        BorrowerInfo = `${name}, ${department}`;
      } else {
        BorrowerInfo = `${name}, ${department}, ${course}, ${year}`;
      }

      // Set date_return to null if selectedDate is "N/A"
    const dateReturn = selectedDate === "N/A" ? null : selectedDate.toISOString();

      const borrow = {
        user: BorrowerInfo,
        status: statusChange,
        issue: issueChange,
        date_return: dateReturn,
      };
      const response = await axios.put(
        `${baseURL}borrows/${item.id}`,
        borrow,
        config
      );

      if (response.status === 200 || response.status === 201) {
        Toast.show({
          topOffset: 60,
          type: "success",
          text1: "Order Edited",
          text2: "",
        });
        setTimeout(() => {
          navigation.navigate("Equipments");
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
    if (item.status === "Denied") {
      setBorrowStatus(<TrafficLight unavailable></TrafficLight>);
      setStatusText("Denied");
      setCardColor("#E74C3C");
    } else if (item.status === "Pending") {
      setBorrowStatus(<TrafficLight limited></TrafficLight>);
      setStatusText("Pending");
      setCardColor("#F1C40F");
    } else if (item.status === "Approved") {
      setBorrowStatus(<TrafficLight limited></TrafficLight>);
      setStatusText("Approved");
      setCardColor("#008000");
    } else if (item.status === "Borrowed") {
      setBorrowStatus(<TrafficLight limited></TrafficLight>);
      setStatusText("Borrowed");
      setCardColor("#F1C40F");
    } else {
      setBorrowStatus(<TrafficLight available></TrafficLight>);
      setStatusText("Returned");
      setCardColor("#008000");
    }

    // Set the initial value of selectedDate based on item.date_return
    const initialDate =
      item.date_return === "N/A" ? "N/A" : new Date(item.date_return);
    setSelectedDate(initialDate);
    setReasonStatus(item.reason_status || "");
    return () => {
      setBorrowStatus();
      setStatusText();
      setCardColor();
    };
  }, []);

  const initialDate =
    item.date_return === "N/A" ? "N/A" : new Date(item.date_return);

  return (
    <View style={[{ backgroundColor: "#D3D3D3" }, styles.container]}>
      <View style={styles.container}>
        <Text>Borrow Number: #{item.id}</Text>
      </View>
      <View style={{ marginTop: 10 }}>
        <Text style={{ color: cardColor, fontWeight: "bold" }}>
          Status: {statusText} {borrowStatus}
        </Text>
        <Text>User: {item.user}</Text>
        <Text>Reason for Borrowing: {item.borrowingInfo.reason_borrow}</Text>
        <Text>Borrowing Date: {item.borrowingInfo.date_borrow?.split("T")[0]}</Text>

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
          <Picker
            mode="dropdown"
            iosIcon={<Icon name="arrow-down" color={"#007aff"} />}
            style={{ width: undefined, color: "black" }}
            selectedValue={issueChange}
            onValueChange={(value) => setIssueChange(value)}
          >
            <Picker.Item label="Select Issue" value="" />
            {issues.map((issue) => (
              <Picker.Item key={issue} label={issue} value={issue} />
            ))}
          </Picker>
          <Text>Reason for Denied:</Text>
          <TextInput
            placeholder="Reason Status"
            value={reasonStatus}
            onChangeText={(text) => setReasonStatus(text)}
            style={styles.input}
          />
          <Text>
            Date of Returning:{" "}
            {selectedDate === "N/A" ? "N/A" : formatDate(selectedDate)}
          </Text>
          <View>
            <DateTimePickerModal
              isVisible={datePickerVisible}
              mode="datetime"
              onConfirm={handleDateConfirm}
              onCancel={hideDatePicker}
            />
            <EasyButton secondary large onPress={showDatePicker}>
              <Text style={{ color: "white" }}>Select Date & Time</Text>
            </EasyButton>
          </View>

          <EasyButton secondary large onPress={updateBorrow}>
            <Text style={{ color: "white" }}>Update</Text>
          </EasyButton>
        </View>
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

export default BorrowCard;
