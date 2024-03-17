import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  Dimensions,
  RefreshControl,
} from "react-native";
import { Box } from "native-base";
import Icon from "react-native-vector-icons/FontAwesome";
import { useFocusEffect } from "@react-navigation/native";
import { Searchbar } from "react-native-paper";
import ListItem from "./CalendarLogsListItem";
import axios from "axios";
import baseURL from "../../assets/common/baseUrl";
import AsyncStorage from "@react-native-async-storage/async-storage";
import EasyButton from "../../Shared/StyledComponents/EasyButtons";
import { useNavigation } from "@react-navigation/native";
import { Picker } from "@react-native-picker/picker"; // Import Picker from @react-native-picker/picker

var { height, width } = Dimensions.get("window");

const ListHeader = () => {
  return (
    <View elevation={1} style={styles.listHeader}>
      <View style={styles.headerItem}>
        <Text style={{ fontWeight: "600" }}>Title</Text>
      </View>
      <View style={styles.headerItem}>
        <Text style={{ fontWeight: "600" }}>Requester</Text>
      </View>
      <View style={styles.headerItem}>
        <Text style={{ fontWeight: "600" }}>Status</Text>
      </View>
      <View style={styles.headerItem}>
        <Text style={{ fontWeight: "600" }}>by</Text>
      </View>
      <View style={styles.headerItem}>
        <Text style={{ fontWeight: "600" }}>created at</Text>
      </View>
    </View>
  );
};

const CalendarLogs = (props) => {
  const [calendarLogList, setCalendarLogList] = useState();
  const [calendarLogFilter, setCalendarLogFilter] = useState();
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState();
  const [refreshing, setRefreshing] = useState(false);
  const [statusFilter, setStatusFilter] = useState("All"); // State for status filter
  const navigation = useNavigation();

  const searchCalendarLog = (text) => {
    if (text === "") {
      setCalendarLogFilter(calendarLogList);
    }
    setCalendarLogFilter(
      calendarLogList.filter((i) =>
        i.name.toLowerCase().includes(text.toLowerCase())
      )
    );
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      axios.get(`${baseURL}appointments/history/all`).then((res) => {
        // Sort the data by createdAt field in descending order
        const sortedData = res.data.sort((a, b) => {
          return new Date(b.createdAt) - new Date(a.createdAt);
        });
        
        // Update state with sorted data
        setCalendarLogList(sortedData);
        setCalendarLogFilter(sortedData);
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

      axios.get(`${baseURL}appointments/history/all`).then((res) => {
        // Sort the data by createdAt field in descending order
        const sortedData = res.data.sort((a, b) => {
          return new Date(b.createdAt) - new Date(a.createdAt);
        });
        
        // Update state with sorted data
        setCalendarLogList(sortedData);
        setCalendarLogFilter(sortedData);
        setLoading(false);
      });

      return () => {
        setCalendarLogList();
        setCalendarLogFilter();
        setLoading(true);
      };
    }, [])
  );

  const filterByStatus = (status) => {
    setStatusFilter(status); // Update the statusFilter state

    if (status === "All") {
      setCalendarLogFilter(calendarLogList);
    } else {
      const filteredLogs = calendarLogList.filter(
        (item) => item.status === status
      );
      setCalendarLogFilter(filteredLogs);
    }
  };

  return (
    <Box flex={1}>
      <Searchbar
        width="80%"
        placeholder="Search"
        onChangeText={(text) => searchCalendarLog(text)}
      />
      <View style={styles.pickerContainer}>
        <Text style={styles.pickerLabel}>Filter by Status:</Text>
        <Picker
          selectedValue={statusFilter}
          style={styles.picker}
          onValueChange={(itemValue) => filterByStatus(itemValue)}
        >
          <Picker.Item label="All" value="All" />
          <Picker.Item label="Pending" value="Pending" />
          <Picker.Item label="Approved" value="Approved" />
          <Picker.Item label="Denied" value="Denied" />
          <Picker.Item label="PE Class" value="PE Class" />
          {/* Add more status options as needed */}
        </Picker>
      </View>
      {loading ? (
        <View style={styles.spinner}>
          <ActivityIndicator size="large" color="red" />
        </View>
      ) : (
        <FlatList
          data={calendarLogFilter}
          ListHeaderComponent={ListHeader}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          renderItem={({ item, index }) => <ListItem item={item} index={index} />}
          keyExtractor={(item) => item.id}
        />
      )}
    </Box>
  );
};

const styles = StyleSheet.create({
  listHeader: {
    flexDirection: "row",
    padding: 5,
    backgroundColor: "gainsboro",
  },
  headerItem: {
    margin: 3,
    width: width / 5.2,
  },
  spinner: {
    height: height / 2,
    alignItems: "center",
    justifyContent: "center",
  },
  pickerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 10,
    marginLeft: 10,
  },
  pickerLabel: {
    fontWeight: "bold",
    marginRight: 10,
  },
  picker: {
    flex: 1,
    height: 50,
  },
});

export default CalendarLogs;
