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
import { useFocusEffect } from "@react-navigation/native";
import { Searchbar } from "react-native-paper";
import ListItem from "./BorrowHistoryItems";
import axios from "axios";
import baseURL from "../../assets/common/baseUrl";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { Picker } from "@react-native-picker/picker"; // Import Picker from @react-native-picker/picker
var { height, width } = Dimensions.get("window");

const ListHeader = () => {
  return (
    <View elevation={1} style={styles.listHeader}>
      <View style={styles.headerItem}>
        <Text style={{ fontWeight: "600" }}>Customer</Text>
      </View>
      <View style={styles.headerItem}>
        <Text style={{ fontWeight: "600" }}>No of Items</Text>
      </View>
      <View style={styles.headerItem}>
        <Text style={{ fontWeight: "600" }}>Date Ret</Text>
      </View>
      <View style={styles.headerItem}>
        <Text style={{ fontWeight: "600" }}>By</Text>
      </View>
      <View style={styles.headerItem}>
        <Text style={{ fontWeight: "600" }}>Status</Text>
      </View>
    </View>
  );
};

const BorrowHistory = (props) => {
  const [orderLogList, setOrderLogList] = useState();
  const [orderLogFilter, setOrderLogFilter] = useState();
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState();
  const [refreshing, setRefreshing] = useState(false);
  const [statusFilter, setStatusFilter] = useState("All"); // State for status filter
  const navigation = useNavigation();

  const searchCalendarLog = (text) => {
    if (text === "") {
      setOrderLogFilter(orderLogList);
    }
    setOrderLogFilter(
      orderLogList.filter((i) =>
        i.name.toLowerCase().includes(text.toLowerCase())
      )
    );
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      axios.get(`${baseURL}borrow/historyBorrow/all`).then((res) => {
        setOrderLogList(res.data);
        setOrderLogFilter(res.data);
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

      axios.get(`${baseURL}borrows/historyBorrow/all`).then((res) => {
        setOrderLogList(res.data);
        setOrderLogFilter(res.data);
        setLoading(false);
      });

      return () => {
        setOrderLogList();
        setOrderLogFilter();
        setLoading(true);
      };
    }, [])
  );

  const filterByStatus = (status) => {
    setStatusFilter(status); // Update the statusFilter state

    if (status === "All") {
      setOrderLogFilter(orderLogList);
    } else {
      const filteredLogs = orderLogList.filter(
        (item) => item.status === status
      );
      setOrderLogFilter(filteredLogs);
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
          <Picker.Item label="Approved" value="Approved" />
          <Picker.Item label="Denied" value="Denied" />
          <Picker.Item label="Pending" value="Pending" />
          <Picker.Item label="Borrowed" value="Borrowed" />
          <Picker.Item label="Returned" value="Returned" />
        </Picker>
      </View>
      {loading ? (
        <View style={styles.spinner}>
          <ActivityIndicator size="large" color="red" />
        </View>
      ) : (
        <FlatList
          data={orderLogFilter}
          ListHeaderComponent={ListHeader}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          renderItem={({ item, index }) => (
            <ListItem item={item} index={index} />
          )}
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

export default BorrowHistory;
