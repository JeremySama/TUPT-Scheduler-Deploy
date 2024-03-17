import React, { useCallback, useState, useEffect } from "react";
import { View, FlatList, StyleSheet } from "react-native";
import axios from "axios";
import baseURL from "../../assets/common/baseUrl";
import OrderCard from "../../Shared/OrderCard";
import { Picker } from "@react-native-picker/picker";

const Orders = (props) => {
  const [orderList, setOrderList] = useState([]);
  const [originalOrderList, setOriginalOrderList] = useState([]);
  const [statusFilter, setStatusFilter] = useState("All");

  useEffect(() => {
    getOrders();
  }, []);

  const getOrders = () => {
    axios
      .get(`${baseURL}orders`)
      .then((res) => {
        setOrderList(res.data);
        setOriginalOrderList(res.data); // Store the original order list
      })
      .catch((error) => console.log(error));
  };

  const filterByStatus = (status) => {
    if (status === "All") {
      setOrderList(originalOrderList); // Use the original order list for filtering
    } else {
      const filteredOrders = originalOrderList.filter(
        (item) => item.orderStatus === status
      );
      setOrderList(filteredOrders); // Set the filtered order list to the state
    }
  };

  return (
    <View style={styles.container}>
        <View style={styles.pickerContainer}>
        <Picker
          selectedValue={statusFilter}
          style={styles.picker}
          onValueChange={(itemValue) => {
            setStatusFilter(itemValue);
            filterByStatus(itemValue);
          }}
        >
          <Picker.Item label="All" value="All" />
          <Picker.Item label="Pending" value="Pending" />
          <Picker.Item label="For Pickup" value="For Pickup" />
          <Picker.Item label="Sold" value="Sold" />
        </Picker>
      </View>
      <FlatList
        data={orderList}
        renderItem={({ item }) => <OrderCard item={item} />}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
};

const styles = StyleSheet.create({
    container: {
        padding: 20,
        marginBottom: 80,
        borderRadius: 10,
      },
  pickerContainer: {
    marginVertical: 10,
    marginLeft: 10,
  },
  picker: {
    height: 50,
    width: 150,
  },
});

export default Orders;
