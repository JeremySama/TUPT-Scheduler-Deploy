import React, { useCallback, useState, useEffect } from "react";
import { View, FlatList, StyleSheet } from "react-native";
import axios from "axios";
import baseURL from "../../assets/common/baseUrl";
import BorrowCard from "../../Shared/BorrowCard";
import { Picker } from "@react-native-picker/picker"; // Import Picker from @react-native-picker/picker

const Borrows = (props) => {
  const [borrowList, setBorrowList] = useState([]);
  const [originalBorrowList, setOriginalBorrowList] = useState([]);
  const [statusFilter, setStatusFilter] = useState("All");

  useEffect(() => {
    getBorrows();
  }, []);

  const getBorrows = () => {
    axios
      .get(`${baseURL}borrows`)
      .then((res) => {
        setBorrowList(res.data);
        setOriginalBorrowList(res.data); // Store the original borrow list
        //console.log("Borrow list:", res.data);
      })
      .catch((error) => {
        console.log("Error fetching borrows:", error);
      });
  };

  const filterByStatus = (status) => {
    if (status === "All") {
      setBorrowList(originalBorrowList); // Use the original borrow list for filtering
    } else {
      const filteredBorrows = originalBorrowList.filter(
        (item) => item.status === status
      );
      setBorrowList(filteredBorrows); // Set the filtered borrow list to the state
      //console.log("Filtered borrow list:", filteredBorrows);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={statusFilter}
          style={styles.picker}
          onValueChange={(itemValue) => {
            setStatusFilter(itemValue); // Update statusFilter when a different value is selected
            filterByStatus(itemValue); // Call filterByStatus with the selected value
          }}
        >
          <Picker.Item label="All" value="All" />
          <Picker.Item label="Pending" value="Pending" />
          <Picker.Item label="Approved" value="Approved" />
          <Picker.Item label="Denied" value="Denied" />
          <Picker.Item label="Borrowed" value="Borrowed" />
          <Picker.Item label="Returned" value="Returned" />
        </Picker>
      </View>
      <FlatList
        data={borrowList}
        renderItem={({ item }) => <BorrowCard item={item} />}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  pickerContainer: {
    marginVertical: 10,
    marginLeft: 10,
  },
  picker: {
    height: 50,
    width: 150,
  },
  container: {
    padding: 20,
    marginBottom: 80,
    borderRadius: 10,
  },
});

export default Borrows;
