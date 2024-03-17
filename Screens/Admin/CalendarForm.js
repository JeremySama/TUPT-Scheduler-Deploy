import React, { useState, useEffect, useContext, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  Button,
  TouchableOpacity,
  ToastAndroid,
  Image,
} from "react-native";
import { Select, CheckIcon } from "native-base";
import FormContainer from "../../Shared/Form/FormContainer";
import Input from "../../Shared/Form/Input";
import EasyButton from "../../Shared/StyledComponents/EasyButtons";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import Toast from "react-native-toast-message";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import AuthGlobal from "../../Context/Store/AuthGlobal";
import { useNavigation } from "@react-navigation/native";
import baseURL from "../../assets/common/baseUrl";
import CheckBox from "@react-native-community/checkbox";
import { useFocusEffect } from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";

const CalendarForm = (props) => {
  const [title, setTitle] = useState("");
  const [images, setImages] = useState([]);
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [timeStart, setTimeStart] = useState("");
  const [timeEnd, setTimeEnd] = useState("");
  const [userId, setUser] = useState("");
  const [token, setToken] = useState("");
  const [error, setError] = useState("");
  const [event, setEvent] = useState(null);
  const [setting, setSettings] = useState(null);
  const [name, setName] = useState(null);
  const [department, setDepartment] = useState(null);
  const [course, setCourse] = useState(null);
  const [year, setYear] = useState(null);
  const [role, setRole] = useState(null);
  const [email, setEmail] = useState("");
  const [isStartDatePickerVisible, setStartDatePickerVisibility] =
    useState(false);
  const [isEndDatePickerVisible, setEndDatePickerVisibility] = useState(false);
  const [datePickerType, setDatePickerType] = useState("");
  const context = useContext(AuthGlobal);
  let navigation = useNavigation();
  const [professor, setProfessors] = useState([]);
  const [selectedProfessor, setSelectedProfessor] = useState("");
  const [peClassChecked, setPEClassChecked] = useState(false);
  const [peClass, setPEClass] = useState(false); // Define peClass state
  useEffect(() => {
    if (context.stateUser.user.userId) {
      setUser(context.stateUser.user.userId);
      setName(context.stateUser.user.name);
      setDepartment(context.stateUser.user.department);
      setCourse(context.stateUser.user.course);
      setYear(context.stateUser.user.year);
      setRole(context.stateUser.user.role);
      setEmail(context.stateUser.user.email);
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

  useFocusEffect(
    useCallback(() => {
      // Fetch user's appointments and check if there's an appointment on the current day
      const fetchUserAppointments = async () => {
        try {
          const token = await AsyncStorage.getItem("jwt");
          const response = await axios.get(`${baseURL}appointments`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          const today2 = new Date();
          const startOfWeek = new Date(today2);
          startOfWeek.setDate(
            today2.getDate() -
              today2.getDay() +
              (today2.getDay() === 0 ? -6 : 1)
          ); // Get the start of the current week (Monday)
          //console.log("start of the week",startOfWeek)
          const endOfWeek = new Date(today2);
          endOfWeek.setDate(today2.getDate() + (7 - today2.getDay())); // Get the end of the current week (Sunday)
          //console.log("End of the week",endOfWeek)
          const userAppointmentsThisWeek = response.data.filter(
            (appointment) => {
              const appointmentDate = new Date(appointment.createdAt);
              return (
                appointment.userId._id === userId &&
                appointmentDate >= startOfWeek &&
                appointmentDate <= endOfWeek
              );
            }
          );

          if (userAppointmentsThisWeek.length >= 3) {
            Toast.show({
              topOffset: 60,
              type: "error",
              text1: "You have reached the maximum appointments for this week",
              text2: "Please try again next week",
            });
            navigation.goBack();
          } else {
            const today = new Date().toISOString().split("T")[0]; // Get current date
            const userAppointmentsToday = response.data.filter(
              (appointment) => {
                const appointmentDate = new Date(appointment.createdAt)
                  .toISOString()
                  .split("T")[0];
                const appointmentUserId = appointment.userId._id; // assuming userId is an object with an _id property
                return appointmentUserId === userId && today == appointmentDate;
              }
            );

            if (userAppointmentsToday.length > 0) {
              Toast.show({
                topOffset: 60,
                type: "error",
                text1: "You can only request once per day",
                text2: "Please try again",
              });
              navigation.goBack();
            }
          }
        } catch (error) {
          console.error("Error fetching user appointments:", error);
        }
      };

      fetchUserAppointments();
    }, [navigation, userId]) // Add dependencies to ensure they are up to date
  );

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
    const fetchProfessors = async () => {
      try {
        const response = await axios.get(`${baseURL}users`);
        // Filter professors based on availability and role
        const filteredProfessors = response.data.filter(
          (professor) =>
            professor.availability === "available" &&
            professor.role === "professor"
        );
        setProfessors(filteredProfessors);
      } catch (error) {
        console.error("Error fetching professors: ", error);
      }
    };

    fetchProfessors();
  }, []);
  const fetchSettings = async () => {
    try {
      const response = await axios.get(`${baseURL}settings`);
      if (response.status === 200) {
        setSettings(response.data);
      }
    } catch (error) {
      console.error("Error fetching settings:", error);
    }
  };

  const CustomCheckbox = ({ checked, onPress, title }) => (
    <TouchableOpacity style={styles.checkboxContainer} onPress={onPress}>
      <View style={styles.checkbox}>
        {checked && <View style={styles.checkmark} />}
      </View>
      <Text style={styles.checkboxTitle}>{title}</Text>
    </TouchableOpacity>
  );

  const handlePEClassCheckboxPress = () => {
    setPEClass(!peClass); // Toggle the peClass state when the checkbox is pressed
  };

  useEffect(() => {
    fetchSettings();
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
    }
    AsyncStorage.getItem("jwt")
      .then((res) => {
        setToken(res);
      })
      .catch((error) => console.log(error));
  }, []);

  const pickImage = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      alert("Permission to access camera roll is required!");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    //console.log(result);

    if (!result.canceled) {
      // Extract the first asset from the "assets" array
      const selectedAsset =
        result.assets && result.assets.length > 0 ? result.assets[0] : null;

      if (selectedAsset) {
        // Store the entire image object in the array with both uri and url properties
        const updatedImages = [
          ...images,
          { uri: selectedAsset.uri, url: selectedAsset.uri },
        ];
        setImages(updatedImages);
      }
    }
  };

  const removeImage = (index) => {
    const newImages = [...images];
    newImages.splice(index, 1); // Remove the image at the specified index
    setImages(newImages);
  };

  const addOrUpdateEvent = () => {
    setError(""); // Clear previous errors
    // const lastAppointmentDate = await AsyncStorage.getItem("lastAppointmentDate");
    // const currentDate = new Date().toLocaleDateString();
    // if (lastAppointmentDate === currentDate) {
    //   setError("You can only create one appointment per day.");
    //   return;
    // }
    if (
      title === "" ||
      description === "" ||
      timeStart === "" ||
      location === "" ||
      timeEnd === ""
    ) {
      setError("Please fill in the form correctly");
      return;
    }

    if (!setting) {
      console.log("Settings not fetched yet");
      return;
    }

    const daysOfWeek = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];

    const startDate = new Date(timeStart);
    const endDate = new Date(timeEnd);
    const startDayIndex = startDate.getDay();
    const endDayIndex = endDate.getDay();
    const startHour = startDate.getHours();
    const endHour = endDate.getHours();
    // Define morning and afternoon schedule times
    const morningTimes = setting ? setting.morning_schedule : [];
    const afternoonTimes = setting ? setting.afternoon_schedule : [];
    const daySchedule = setting ? setting.day_schedule : [];

    // Convert morningTimes array to objects containing start and end hours
    const morningTimesObj = morningTimes.map((time) => {
      const [startHourStr, endHourStr] = time.split(":");
      return { start: parseInt(startHourStr), end: parseInt(endHourStr) };
    });

    // Check if requested time is within morning or afternoon schedule
    //console.log("Start Hour:", startHour);
    // console.log("Morning Times:", morningTimesObj);
    const isMorning = morningTimesObj.some(
      (time) => startHour >= time.start && startHour < time.end
    );
    //console.log("Is Morning:", isMorning);

    // Define requested day
    const requestedDay = daysOfWeek[startDayIndex];

    // Check if requested day is available in day schedule
    //console.log("Requested Day:", requestedDay);
    //console.log("Day Schedule:", daySchedule);
    const isDayAvailable = daySchedule.includes(requestedDay);
    //console.log("Is Day Available:", isDayAvailable);

    if (!isMorning && !isAfternoon) {
      setError("Requested time is not available");
      return;
    }

    if (!isDayAvailable) {
      setError("Requested day is not available");
      return;
    }
    let requesterInfo = "";
    if (role === "professor") {
      requesterInfo = `${name}, ${department}`;
    } else {
      requesterInfo = `${name}, ${department}, ${course}, ${year}`;
    }

    const professorInfo =
      location === "Outdoor Court" && selectedProfessor
        ? selectedProfessor
        : "N/A";

    // const eventData = {
    //   title,
    //   description,
    //   timeStart,
    //   timeEnd,
    //   userId,
    //   location,
    //   email,
    //   requester: requesterInfo,
    //   professor: professorInfo,
    //   status: peClass ? "PE Class" : "Pending", // Provide a default status
    //   dateCreated: new Date().toISOString(),
    // };

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("timeStart", timeStart);
    formData.append("timeEnd", timeEnd);
    formData.append("userId", userId);
    formData.append("location", location);
    formData.append("email", email);
    formData.append("requester", JSON.stringify(requesterInfo)); // Convert object to string
    formData.append("professor", JSON.stringify(professorInfo)); // Convert object to string
    formData.append("status", peClass ? "PE Class" : "Pending");

    // Append images
    images.forEach((image, index) => {
      // Append each image as a file
      formData.append(`images`, {
        uri: image.uri,
        name: `image-${index}.jpg`,
        type: "image/jpeg", // Correct MIME type for JPEG images
      });
    });

    const config = {
      headers: {
        "Content-Type": "multipart/form-data", // Set correct Content-Type header
        Authorization: `Bearer ${token}`,
      },
    };
    //console.log(formData)
    let axiosPromise;
    if (event !== null) {
      axiosPromise = axios.put(
        `${baseURL}appointments/${event.id}`,
        formData,
        config
      );
    } else {
      axiosPromise = axios.post(`${baseURL}appointments`, formData, config);
    }

    axiosPromise
      .then((res) => {
        if (res.status === 200 || res.status === 201) {
          Toast.show({
            topOffset: 60,
            type: "success",
            text1: event ? "Event successfully updated" : "New Event added",
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
  };

  return (
    <FormContainer title="Add Event">
      <Text style={styles.label}>Title</Text>
      <Input
        placeholder="Title"
        name="title"
        id="title"
        value={title}
        onChangeText={(text) => setTitle(text)}
      />
      <Text style={styles.label}>Purpose</Text>
      <Input
        placeholder="Purpose"
        name="description"
        id="description"
        value={description}
        onChangeText={(text) => setDescription(text)}
      />
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
      >
        {locationList.map((location) => (
          <Select.Item
            key={location.id}
            label={location.name}
            value={location.name}
          />
        ))}
      </Select>

      {location === "Outdoor Court" ? (
        <>
          <Text style={styles.label}>Select Professor:</Text>
          <Select
            placeholder="Select Professor"
            selectedValue={selectedProfessor}
            minWidth={290}
            accessibilityLabel="Choose Professor"
            onValueChange={(value) => setSelectedProfessor(value)}
            _selectedItem={{
              bg: "teal.600",
              endIcon: <CheckIcon size="5" />,
            }}
          >
            {professor.map((professors) => (
              <Select.Item
                key={professors._id}
                label={professors.name}
                value={professors.name}
              />
            ))}
          </Select>
        </>
      ) : null}

      <CustomCheckbox
        title="PE Class"
        checked={peClass} // Use peClass instead of peClassChecked
        onPress={handlePEClassCheckboxPress} // Use handlePEClassCheckboxPress to handle checkbox press
      />

      <Text style={styles.label}>Start Date and Time</Text>
      <Button
        title="Select Start Date"
        onPress={() => showDatePicker("start")}
      />
      <Text style={styles.dateTimeText}>
        {timeStart
          ? new Date(timeStart).toLocaleString("en-US", {
              year: "numeric",
              month: "numeric",
              day: "numeric",
              hour: "numeric",
              minute: "numeric",
              hour12: false,
            })
          : "Please Select Date and Time"}
      </Text>

      <Text style={styles.label}>End Date and Time</Text>
      <Button title="Select End Date" onPress={() => showDatePicker("end")} />
      <Text style={styles.dateTimeText}>
        {timeEnd
          ? new Date(timeEnd).toLocaleString("en-US", {
              year: "numeric",
              month: "numeric",
              day: "numeric",
              hour: "numeric",
              minute: "numeric",
              hour12: false,
            })
          : "Please Select Date and Time"}
      </Text>

      <View style={styles.formGroup}>
        <Button
          title="Choose Image"
          onPress={pickImage}
          color="#007BFF" // Use a color that matches your app's theme
        />
      </View>
      <View style={styles.imageContainer}>
        {images.map((image, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => removeImage(index)} // Handle tap event to remove the image
            style={styles.imageItem}
          >
            <Image source={{ uri: image.uri }} style={styles.image} />
          </TouchableOpacity>
        ))}
      </View>
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
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
  imageContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "flex-start",
    marginVertical: 10,
    paddingHorizontal: 5,
  },
  imageItem: {
    flexDirection: "column",
    alignItems: "center",
    marginHorizontal: 5,
    marginBottom: 10,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 8,
  },
});

export default CalendarForm;
