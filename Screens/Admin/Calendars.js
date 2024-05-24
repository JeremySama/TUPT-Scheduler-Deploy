import React, { useState, useCallback, useContext } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  Dimensions,
  Button,
  RefreshControl,
  TouchableOpacity,
  ScrollView,
  Modal,
} from "react-native";
import {Box } from "native-base";
import Icon from "react-native-vector-icons/FontAwesome";
import { useFocusEffect } from "@react-navigation/native";
import { Searchbar } from "react-native-paper";
import ListItem from "./CalendarListItem";
import { Picker } from "@react-native-picker/picker";
import axios from "axios";
import baseURL from "../../assets/common/baseUrl";
import AsyncStorage from "@react-native-async-storage/async-storage";
import EasyButton from "../../Shared/StyledComponents/EasyButtons";
import { useNavigation } from "@react-navigation/native";
import DateTimePickerModal from "react-native-modal-datetime-picker";


var { height, width } = Dimensions.get("window");

const ListHeader = () => {
  return (
    <View elevation={1} style={styles.listHeader}>
      <View style={styles.headerItem}>
        <Text style={{ fontWeight: "600" }}>Title</Text>
      </View>
      <Text style={{ fontWeight: "600" }}>         </Text>
      <View style={styles.headerItem}>
        <Text style={{ fontWeight: "600" }}>Start Date</Text>
      </View>
      <Text style={{ fontWeight: "600" }}>         </Text>
      <View style={styles.headerItem}>
        <Text style={{ fontWeight: "600" }}>End Date</Text>
      </View>
      <Text style={{ fontWeight: "600" }}>        </Text>
      <View style={styles.headerItem}>
        <Text style={{ fontWeight: "600" }}>Status</Text>
      </View>
    </View>
  );
};

const Calendars = (props) => {
  const [calendarList, setCalendarList] = useState();
  const [calendarFilter, setCalendarFilter] = useState();
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState();
  const [statusFilter, setStatusFilter] = useState("All");
  const [refreshing, setRefreshing] = useState(false);
  const navigation = useNavigation();
  const [isMorningPickerVisible, setMorningPickerVisible] = useState(false);
  const [isAfternoonPickerVisible, setAfternoonPickerVisible] = useState(false);
  const [selectedMorningTime, setSelectedMorningTime] = useState(new Date());
  const [selectedAfternoonTime, setSelectedAfternoonTime] = useState(new Date());
  const [selectedMorningTimeIndex, setSelectedMorningTimeIndex] = useState(0);
  const [selectedAfternoonTimeIndex, setSelectedAfternoonTimeIndex] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);
  const [loadedSettings, setLoadedSettings] = useState(null);
  const [selectedDays, setSelectedDays] = useState([
    { name: "Monday", checked: false },
    { name: "Tuesday", checked: false },
    { name: "Wednesday", checked: false },
    { name: "Thursday", checked: false },
    { name: "Friday", checked: false },
    { name: "Saturday", checked: false },
    { name: "Sunday", checked: false },
  ]);
  const [morningSchedule, setMorningSchedule] = useState([
    "08:00 AM",
    "09:00 AM",
  ]);
  const [afternoonSchedule, setAfternoonSchedule] = useState([
    "01:00 PM",
    "02:00 PM",
  ]);

  const searchCalendar = (text) => {
    if (text === "") {
      setCalendarFilter(calendarList);
    }
    setCalendarFilter(
      calendarList.filter((i) =>
        i.title.toLowerCase().includes(text.toLowerCase())
      )
    );
  };

  const deleteCalendar = (id) => {
    axios
      .delete(`${baseURL}appointments/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        const calendars = calendarFilter.filter((item) => item.id !== id);
        setCalendarFilter(calendars);
      })
      .catch((error) => console.log(error));
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      axios.get(`${baseURL}appointments`).then((res) => {
        setCalendarList(res.data);
        setCalendarFilter(res.data);
        setLoading(false);
      });
      setRefreshing(false);
    }, 2000);
  }, []);

  useFocusEffect(
    useCallback(() => {
      // Get Token
      AsyncStorage.getItem("jwt")
        .then((res) => {
          setToken(res);
        })
        .catch((error) => console.log(error));

      axios.get(`${baseURL}appointments`).then((res) => {
        setCalendarList(res.data);
        setCalendarFilter(res.data);
        setLoading(false);
      });

      return () => {
        setCalendarList();
        setCalendarFilter();
        setLoading(true);
      };
    }, [])
  );

  const filterByStatus = (status) => {
    setStatusFilter(status); // Update the statusFilter state

    if (status === "All") {
      setCalendarFilter(calendarList);
    } else {
      const filteredCalendars = calendarList.filter(
        (item) => item.status === status
      );
      setCalendarFilter(filteredCalendars);
    }
  };

  const fetchSettings = async () => {
    try {
      const response = await axios.get(`${baseURL}settings`);
      setLoadedSettings(response.data);

      // Set the selected days based on the loaded settings
      const loadedDays = response.data?.day_schedule || [];
      const updatedSelectedDays = selectedDays.map((day) => ({
        ...day,
        checked: loadedDays.includes(day.name),
      }));
      setSelectedDays(updatedSelectedDays);

      // Set morning and afternoon schedules from loaded settings
      setMorningSchedule(
        response.data?.morning_schedule || ["08:00 AM", "09:00 AM"]
      );
      setAfternoonSchedule(
        response.data?.afternoon_schedule || ["01:00 PM", "02:00 PM"]
      );
    } catch (error) {
      console.error("Error fetching settings:", error);
    }
  };

  // Function to update settings in the database
  const updateSettingsInDatabase = async () => {
    try {
      // Extract names of checked days
      const checkedDays = selectedDays
        .filter((day) => day.checked)
        .map((day) => day.name);

      // Create the settings object
      const updatedSettings = {
        day_schedule: checkedDays,
        morning_schedule: morningSchedule,
        afternoon_schedule: afternoonSchedule,
      };

      // Make the Axios PUT request
      const response = await axios.put(`${baseURL}settings`, updatedSettings);
      //console.log("Settings updated:", response.data);
    } catch (error) {
      // Handle error
    }
  };

  const openModal = () => {
    setModalVisible(true);
    fetchSettings();
  };

  
  const closeModal = () => {
    setModalVisible(false);
  };

  const handleSave = () => {
    updateSettingsInDatabase();
    closeModal();
  };

  const toggleCheckbox = (index) => {
    const updatedDays = [...selectedDays];
    updatedDays[index].checked = !updatedDays[index].checked;
    setSelectedDays(updatedDays);
  };

  const handleTimePicker = (isMorning, index) => {
    if (isMorning) {
      setSelectedMorningTimeIndex(index);
      setMorningPickerVisible(true);
    } else {
      setSelectedAfternoonTimeIndex(index);
      setAfternoonPickerVisible(true);
    }
  };
  
  
  const handleTimeConfirm = (date, schedule, setSchedule, isMorning, index) => {
    const formattedTime = new Date(date).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
    const updatedSchedule = [...schedule];
    updatedSchedule[index] = formattedTime;
  
    setSchedule(updatedSchedule);
    isMorning ? setMorningPickerVisible(false) : setAfternoonPickerVisible(false);
  };

  const renderScheduleInputs = (schedule, setSchedule, isMorning) => {
    return (
      <View>
        {schedule.map((time, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => handleTimePicker(isMorning, index)}
          >
            <View style={styles.input}>
              <Text>{time}</Text>
            </View>
          </TouchableOpacity>
        ))}
        <DateTimePickerModal
          isVisible={isMorning ? isMorningPickerVisible : isAfternoonPickerVisible}
          mode="time"
          onConfirm={(date) =>
            handleTimeConfirm(date, schedule, setSchedule, isMorning, isMorning ? selectedMorningTimeIndex : selectedAfternoonTimeIndex)
          }
          onCancel={() => handleTimeCancel(isMorning)}
        />
      </View>
    );
  };
  
  

  return (
    <Box flex={1}>
      <View style={{ backgroundColor: "maroon" }}>
        <ScrollView horizontal={true} style={styles.buttonContainer}>

          <EasyButton
            secondary
            medium
            onPress={() => navigation.navigate("CalendarForm")}
          >
            <Icon name="plus" size={15} color="black" />
            <Text style={styles.buttonText}>Calendar</Text>
          </EasyButton>
          <EasyButton
            secondary
            medium
            onPress={() => navigation.navigate("Products")}
          >
            <Icon name="shopping-cart" size={18} color="black" />
            <Text style={styles.buttonText}>Product</Text>
          </EasyButton>
          <EasyButton
            secondary
            medium
            onPress={() => navigation.navigate("Equipments")}
          >
            <Icon name="archive" size={18} color="black" />
            <Text style={styles.buttonText}>Equipment</Text>
          </EasyButton>
          <EasyButton
            secondary
            medium
            onPress={() => navigation.navigate("Users")}
          >
            <Icon name="user" size={18} color="black" />
            <Text style={styles.buttonText}>User</Text>
          </EasyButton>
          <EasyButton
            secondary
            medium
            onPress={() => navigation.navigate("Locations")}
          >
            <Icon name="location-arrow" size={18} color="black" />
            <Text style={styles.buttonText}>Location</Text>
          </EasyButton>
          <EasyButton secondary medium onPress={() => openModal()}>
            <Icon name="cog" size={18} color="black" />
            <Text style={styles.buttonText}>Setting</Text>
          </EasyButton>
          <EasyButton
            secondary
            medium
            onPress={() => navigation.navigate("CalendarLogs")}
          >
            <Icon name="file-text" size={18} color="black" />
            <Text style={styles.buttonText}>logs</Text>
          </EasyButton>
        </ScrollView>
      </View>
      <Searchbar
        width="80%"
        placeholder="Search"
        onChangeText={(text) => searchCalendar(text)}
      />
      <Picker
        selectedValue={statusFilter}
        style={{ height: 50, width: 150 }}
        onValueChange={(itemValue) => filterByStatus(itemValue)}
      >
        <Picker.Item label="All" value="All" />
        <Picker.Item label="Approved" value="Approved" />
        <Picker.Item label="Denied" value="Denied" />
        <Picker.Item label="Pending" value="Pending" />
        <Picker.Item label="PE Class" value="PE Class" />
      </Picker>
      {loading ? (
        <View style={styles.spinner}>
          <ActivityIndicator size="large" color="red" />
        </View>
      ) : (
        <FlatList
          data={calendarFilter}
          ListHeaderComponent={ListHeader}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          renderItem={({ item, index }) => (
            <ListItem
              item={item}
              index={index}
              deleteCalendar={deleteCalendar}
            />
          )}
          keyExtractor={(item) => item.id}
        />
      )}

      <Modal
        visible={modalVisible}
        onRequestClose={closeModal}
        animationType="slide"
        onShow={fetchSettings}
        transparent
      >
        <View style={styles.overlay}>
          <View style={styles.modalContainer}>
            <ScrollView showsVerticalScrollIndicator={false}>
              {loadedSettings ? (
                <View style={{ flex: 1 }}>
                  <Text style={styles.sectionTitle}>Select Days:</Text>
                  {selectedDays.map((day, index) => (
                    <TouchableOpacity
                      key={index}
                      onPress={() => toggleCheckbox(index)}
                      style={styles.checkboxContainer}
                    >
                      <View style={styles.checkboxContent}>
                        <View
                          style={[
                            styles.checkbox,
                            {
                              backgroundColor: day.checked
                                ? "#ff007f"
                                : "transparent",
                            },
                          ]}
                        >
                          {day.checked && (
                            <Text style={styles.checkmark}>✓</Text>
                          )}
                        </View>
                        <Text style={styles.dayText}>{day.name}</Text>
                      </View>
                    </TouchableOpacity>
                  ))}

<Text style={styles.sectionTitle}>Morning Schedule:</Text>
{renderScheduleInputs(morningSchedule, setMorningSchedule, true)}

<Text style={styles.sectionTitle}>Afternoon Schedule:</Text>
{renderScheduleInputs(afternoonSchedule, setAfternoonSchedule, false)}

                  <View style={styles.buttonContainer}>
                    <Button title="Save" onPress={handleSave} />
                    <Button title="Close" onPress={closeModal} />
                  </View>
                </View>
              ) : (
                <ActivityIndicator size="large" color="blue" />
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </Box>
  );
};

const styles = StyleSheet.create({
  section: {
    marginTop: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  picker: {
    height: 40,
    width: "80%",
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "gray",
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Adjust the alpha value for the transparency
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f0f0f0",
    // Adjust these properties to control the modal's size and positioning
    justifyContent: "center", // Vertically center the modal
    alignItems: "center", // Horizontally center the modal
    width: "80%", // Set a specific width
    maxHeight: "70%", // Set a maximum height
    borderRadius: 10, // Adjust border radius for rounded corners
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 10,
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 5,
  },
  checkboxContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  checkbox: {
    height: 24,
    width: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "black",
    marginRight: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  checkmark: {
    color: "black",
  },
  dayText: {
    fontSize: 16,
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 20,
  },

  listHeader: {
    flexDirection: "row",
    padding: 5,
    backgroundColor: "gainsboro",
  },
  headerItem: {
    margin: 3,
    width: width / 6,
  },
  spinner: {
    height: height / 2,
    alignItems: "center",
    justifyContent: "center",
  },
  container: {
    marginBottom: 160,
    backgroundColor: "white",
  },
  buttonContainer: {
    margin: 20,
    alignSelf: "center",
    flexDirection: "row",
  },
  buttonText: {
    marginLeft: 4,
    color: "white",
  },
});

export default Calendars;
