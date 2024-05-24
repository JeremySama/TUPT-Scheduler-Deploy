import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  Button,
  TextInput,
  TouchableOpacity,
} from "react-native";
import FormContainer from "../../Shared/Form/FormContainer";
import EasyButton from "../../Shared/StyledComponents/EasyButtons";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import Toast from "react-native-toast-message";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import AuthGlobal from "../../Context/Store/AuthGlobal";
import { useNavigation } from "@react-navigation/native";
import baseURL from "../../assets/common/baseUrl";
import { Select, CheckIcon } from "native-base";
import CheckBox from "@react-native-community/checkbox";

const CalendarFormUpdate = (props) => {
  const [title, setTitle] = useState("");
  const [professor, setProfessor] = useState("");
  const [description, setDescription] = useState("");
  const [timeStart, setTimeStart] = useState("");
  const [timeEnd, setTimeEnd] = useState("");
  const [name, setUser] = useState("");
  const [department, setDepartment] = useState(null);
  const [course, setCourse] = useState(null);
  const [year, setYear] = useState(null);
  const [role, setRole] = useState(null);
  const [token, setToken] = useState("");
  const [error, setError] = useState("");
  const [event, setEvent] = useState(null);
  const [status, setStatus] = useState("Pending"); // Added status state
  const [location, setLocation] = useState("Gymnasium"); // Added location state
  const [reason, setReason] = useState("");
  const [requester, setRequester] = useState("");
  const [key, setKey] = useState("");
  const [isStartDatePickerVisible, setStartDatePickerVisibility] =
    useState(false);
  const [isEndDatePickerVisible, setEndDatePickerVisibility] = useState(false);
  const [datePickerType, setDatePickerType] = useState("");
  const context = useContext(AuthGlobal);
  const [isCheckboxChecked, setIsCheckboxChecked] = useState(false);

  const CustomCheckbox = ({ checked, onPress, title }) => (
    <TouchableOpacity style={styles.checkboxContainer} onPress={onPress}>
      <View style={styles.checkbox}>
        {checked && <View style={styles.checkmark} />}
      </View>
      <Text style={styles.checkboxTitle}>{title}</Text>
    </TouchableOpacity>
  );

  // Function to handle checkbox change
const handleCheckboxChange = () => {
  setIsCheckboxChecked(!isCheckboxChecked);
};

// Function to handle location change


  let navigation = useNavigation();

  useEffect(() => {
    if (context.stateUser.user.userId) {
      setUser(context.stateUser.user.name);
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

  const handleLocationChange = (value) => {
    setLocation(value); // Update selected location state
    //console.log("Selected location:", value);
  };
  const [locationList, setLocationList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const token = await AsyncStorage.getItem("jwt");
        const response = await axios.get(`${baseURL}locations`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setLocationList(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching locations:", error);
      }
    };

    fetchLocations();
  }, []);

  useEffect(() => {
    if (context.stateUser.user.userId) {
      setUser(context.stateUser.user.name);
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

  const showDatePicker = (type) => {
    setDatePickerType(type);
    if (type === "start") {
      setStartDatePickerVisibility(true);
    } else if (type === "end") {
      setEndDatePickerVisibility(true);
    }
  };

  const hideDatePicker = () => {
    setStartDatePickerVisibility(false);
    setEndDatePickerVisibility(false);
  };

  const handleConfirm = (date) => {
    const formattedDate = date.toISOString();

    if (datePickerType === "start") {
      setTimeStart(formattedDate);
    } else if (datePickerType === "end") {
      setTimeEnd(formattedDate);
    }
    hideDatePicker();
  };

  useEffect(() => {
    if (!props.route.params) {
      setEvent(null);
    } else {
      setEvent(props.route.params.event);
      setTitle(props.route.params.event.title);
      setDescription(props.route.params.event.description);
      setTimeStart(props.route.params.event.timeStart);
      setTimeEnd(props.route.params.event.timeEnd);
      setLocation(props.route.params.event.location);
      setStatus(props.route.params.event.status);
      setReason(props.route.params.event.reason);
      setRequester(props.route.params.event.requester);
      setProfessor(props.route.params.event.history[0].professor);
      setKey(props.route.params.event.key);
    }
    AsyncStorage.getItem("jwt")
      .then((res) => {
        setToken(res);
      })
      .catch((error) => console.log(error));
  }, []);

  const addOrUpdateEvent = () => {
    if (
      title === "" ||
      description === "" ||
      timeStart === "" ||
      timeEnd === ""
    ) {
      setError("Please fill in the form correctly");
      return;
    }

    let byInfo = "";
    if (role === "professor") {
      byInfo = `${name}, ${department}`;
    } else {
      byInfo = `${name}, ${department}, ${course}, ${year}`;
    }

    const eventData = {
      title,
      requester,
      description,
      timeStart,
      timeEnd,
      status, // Add the status field to the eventData object
      reason,
      by: byInfo,
      key,
      professor,
      location, // Include the selected location in the eventData object
    };

    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };

    if (event !== null) {
      axios
        .put(`${baseURL}appointments/${event.id}`, eventData, config)
        .then((res) => {
          if (res.status === 200 || res.status === 201) {
            Toast.show({
              topOffset: 60,
              type: "success",
              text1: "Event successfully updated",
              text2: "",
            });
            setTimeout(() => {
              navigation.navigate("Calendars");
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
    } else {
      axios
        .post(`${baseURL}appointments`, eventData, config)
        .then((res) => {
          if (res.status === 200 || res.status === 201) {
            Toast.show({
              topOffset: 60,
              type: "success",
              text1: "New Event added",
              text2: "",
            });
            setTimeout(() => {
              navigation.navigate("CalendarsContainer");
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
    }
  };

  const generateRandomKey = () => {
    const characters = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    let key = "";
    for (let i = 0; i < 6; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      key += characters.charAt(randomIndex);
    }
    setKey(key);
  };

  return (
    <FormContainer title="Add Event">
      <Text style={styles.label}>Title</Text>
      <TextInput
        placeholder="Title"
        name="title"
        id="title"
        value={title}
        onChangeText={(text) => setTitle(text)}
        editable={false}
        style={{
          borderWidth: 1,
          borderColor: "black",
          borderRadius: 5,
          padding: 10,
          color: "black",
          fontSize: 16,
          width: 300,
          textAlign: "center",
        }}
        placeholderTextColor="gray" // Adjust placeholder color
      />
      <Text style={styles.label}>Description</Text>
      <TextInput
        placeholder="Description"
        name="description"
        id="description"
        value={description}
        onChangeText={(text) => setDescription(text)}
        editable={false}
        style={{
          borderWidth: 1,
          borderColor: "black",
          borderRadius: 5,
          padding: 10,
          color: "black",
          fontSize: 16,
          width: 300,
          textAlign: "center",
        }}
        placeholderTextColor="gray" // Adjust placeholder color
      />
      <Text style={styles.label}>Requester</Text>
      <TextInput
        placeholder="Requester"
        name="requester"
        id="requester"
        value={requester}
        onChangeText={(text) => setRequester(text)}
        editable={false}
        style={{
          borderWidth: 1,
          borderColor: "black",
          borderRadius: 5,
          padding: 10,
          color: "black",
          fontSize: 16,
          width: 300,
          textAlign: "center",
        }}
        placeholderTextColor="gray" // Adjust placeholder color
      />
      <Text style={styles.label}>Start Date and Time</Text>
      <Button
        title="Select Start Date"
        onPress={() => showDatePicker("start")}
      />
      <Text
        style={{
          fontSize: 16,
          borderWidth: 1,
          borderColor: "black",
          borderRadius: 5,
          padding: 10,
          color: "black",
          fontSize: 16,
          width: 300,
          textAlign: "center",
        }}
      >
        {timeStart ? new Date(timeStart).toLocaleString() : ""}
      </Text>
      <Text style={styles.label}>End Date and Time</Text>
      <Button title="Select End Date" onPress={() => showDatePicker("end")} />
      <Text
        style={{
          fontSize: 16,
          borderWidth: 1,
          borderColor: "black",
          borderRadius: 5,
          padding: 10,
          color: "black",
          fontSize: 16,
          width: 300,
          textAlign: "center",
        }}
      >
        {timeEnd ? new Date(timeEnd).toLocaleString() : ""}
      </Text>

      <Text style={styles.label}>Status</Text>
      <Select
        selectedValue={status}
        minWidth={200}
        accessibilityLabel="Choose status"
        onValueChange={setStatus}
        _selectedItem={{
          bg: "teal.600",
          endIcon: <CheckIcon size="5" />,
        }}
        style={{ marginBottom: 10 }}
      >
        <Select.Item label="Pending" value="Pending" />
        <Select.Item label="Approved" value="Approved" />
        <Select.Item label="Denied" value="Denied" />
        <Select.Item label="PE Class" value="PE Class" />
        <Select.Item label="Moved" value="Moved" />
        <Select.Item label="On Process" value="On Process" />

      </Select>
      <Text style={styles.label}>Location</Text>
      <Select
        placeholder="Select location"
        selectedValue={location}
        minWidth={290}
        accessibilityLabel="Choose location"
        onValueChange={handleLocationChange}
        _selectedItem={{
          bg: "teal.600",
          endIcon: <CheckIcon size="5" />,
        }}
        isDisabled={!isCheckboxChecked} // Disable based on checkbox state
      >
        {locationList.map((location) => (
          <Select.Item
            key={location.id}
            label={location.name}
            value={location.name}
          />
        ))}
      </Select>
      <CustomCheckbox
  checked={isCheckboxChecked}
  onPress={handleCheckboxChange}
  title="Move"
/>

      <Text style={styles.label}>Professor</Text>
      <TextInput
        placeholder="Professor"
        name="professor"
        id="professor"
        value={professor}
        onChangeText={(text) => setProfessor(text)}
        editable={false}
        style={{
          borderWidth: 1,
          borderColor: "black",
          borderRadius: 5,
          padding: 10,
          color: "black",
          fontSize: 16,
          width: 300,
          textAlign: "center",
        }}
        placeholderTextColor="gray" // Adjust placeholder color
      />
      <Text style={styles.label}>Reason of Denial</Text>
      <Select
        placeholder="Reason of Denial"
        selectedValue={reason}
        minWidth={290}
        accessibilityLabel="Choose Reason"
        onValueChange={setReason}
        _selectedItem={{
          bg: "teal.600",
          endIcon: <CheckIcon size="5" />,
        }}
      >
        <Select.Item label="N/A" value="N/A" />
        <Select.Item label="Reason 1" value="Reason 1" />
        <Select.Item label="Reason 2" value="Reason 2" />
        <Select.Item label="Reason 3" value="Reason 3" />
      </Select>

      <Text style={styles.label}>Generate Key</Text>
      <TextInput
        placeholder="Generate Key"
        name="key"
        id="key"
        value={key}
        onChangeText={(text) => setKey(text)}
        style={{
          borderWidth: 1,
          borderColor: "black",
          borderRadius: 5,
          padding: 10,
          color: "black",
          fontSize: 16,
          width: 300,
          textAlign: "center",
        }}
        placeholderTextColor="gray" // Adjust placeholder color
      />
      <Button
        title="Select End Date"
        onPress={generateRandomKey}
        style={styles.generateButton}
      />

      {error ? <Text>{error}</Text> : null}
      <View style={styles.buttonContainer}>
        <EasyButton large primary onPress={() => addOrUpdateEvent()}>
          <Text style={styles.buttonText}>Confirm</Text>
        </EasyButton>
      </View>

      <DateTimePickerModal
        isVisible={isStartDatePickerVisible || isEndDatePickerVisible}
        mode="datetime"
        onConfirm={handleConfirm}
        onCancel={hideDatePicker}
      />
    </FormContainer>
  );
};

const styles = StyleSheet.create({
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
  keyInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  generateButton: {
    backgroundColor: "red",
    padding: 10,
    borderRadius: 5,
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderWidth: 1,
    borderColor: "black",
    borderRadius: 4,
    justifyContent: "center",
    alignItems: "center",
  },
  checkmark: {
    width: 12,
    height: 12,
    backgroundColor: "black",
    borderRadius: 2,
    display: "flex",
  },
  checkboxTitle: {
    marginLeft: 8,
    fontSize: 16,
  },
});

export default CalendarFormUpdate;
