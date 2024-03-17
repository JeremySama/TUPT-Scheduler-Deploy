import React, { useEffect, useState, useContext } from "react";
import { Text, View, Button, TouchableOpacity,StyleSheet } from "react-native";
import { Toast } from "native-base";
import FormContainer from "../../../Shared/Form/FormContainer";
import Input from "../../../Shared/Form/Input";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import AuthGlobal from "../../../Context/Store/AuthGlobal";

const Checkout = (props) => {
  const [borrowItems, setBorrowItems] = useState([]);
  const [reason_borrow, setReasonBorrow] = useState("");
  const [date_borrow, setDateBorrow] = useState("");
  const [userId, setUserId] = useState("");
  const [user, setUser] = useState("");
  const [department, setDepartment] = useState("");
  const [course, setCourse] = useState("");
  const [year, setYear] = useState("");
  const [error, setError] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const navigation = useNavigation();
  const borrowsItems = useSelector((state) => state.borrowItems);
  const context = useContext(AuthGlobal);

  useEffect(() => {
    setBorrowItems(borrowsItems);

    if (context.stateUser.user.userId) {
      setUserId(context.stateUser.user.userId);
      setUser(context.stateUser.user.name);
      setDepartment(context.stateUser.user.department);
      setCourse(context.stateUser.user.course);
      setYear(context.stateUser.user.year);
      setEmail(context.stateUser.user.email);
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
      setBorrowItems([]);
    };
  }, [borrowsItems, context.stateUser.user.userId, navigation]);

  const checkOut = () => {
    setError(""); // Clear previous errors
    let BorrowerInfo = "";
    if (
      reason_borrow === "" ||
      date_borrow === ""
    ) {
      setError("Please fill in the form correctly");
      return;
    }
    if (role === "professor") {
      BorrowerInfo = `${user} - ${department}`;
    } else {
      BorrowerInfo = `${user} - ${department}, ${course}, ${year}`;
    }
    let borrow = {
      userId,
      user: BorrowerInfo,
      borrowItems,
      email,
      borrowingInfo: {
        reason_borrow,
        date_borrow
      },
    };
    navigation.navigate("ConfirmBorrow", { borrow: borrow });
  };

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (date) => {
    setDateBorrow(date);
    hideDatePicker();
  };

  return (
    <KeyboardAwareScrollView
      viewIsInsideTabBar={true}
      extraHeight={200}
      enableOnAndroid={true}
    >
      <FormContainer title={"Borrow Info"}>
        <Input
          placeholder={"Reason To Borrow"}
          name={"reason_borrow"}
          value={reason_borrow}
          onChangeText={(text) => setReasonBorrow(text)}
        />
        <TouchableOpacity style={{
            backgroundColor: "#EF4444",
            borderRadius: 20,
            paddingVertical: 10,
            alignItems: "center",
            width: 300,
          }} onPress={showDatePicker}>
          <Text style={{ fontSize: 18, fontWeight: "bold", color: "white" }}>
            Select Borrow Date and Time
          </Text>
        </TouchableOpacity>

        <DateTimePickerModal
          isVisible={isDatePickerVisible}
          mode="datetime"
          onConfirm={handleConfirm}
          onCancel={hideDatePicker}
        />

        {date_borrow && (
          <View style={{ marginTop: 20 }}>
            <Text style={{ fontSize: 18, fontWeight: "bold", color: "black" }}>Selected Date and Time:</Text>
            <Text style={{ fontSize: 18, fontWeight: "bold", color: "black" }}>
              {new Date(date_borrow).toLocaleString()}
            </Text>
          </View>
        )}

        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            marginTop: 20,
          }}
        ></View>
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
