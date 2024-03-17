import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  Dimensions,
  RefreshControl,
  ScrollView,
} from "react-native";
import {Box } from "native-base";
import Icon from "react-native-vector-icons/FontAwesome";
import { useFocusEffect } from "@react-navigation/native";
import { Searchbar } from "react-native-paper";
import ListItem from "./EquipmentListItem";
import axios from "axios";
import baseURL from "../../assets/common/baseUrl";
import AsyncStorage from "@react-native-async-storage/async-storage";
import EasyButton from "../../Shared/StyledComponents/EasyButtons";
import { useNavigation } from "@react-navigation/native";

var { height, width } = Dimensions.get("window");

const ListHeader = () => {
  return (
    <View elevation={1} style={styles.listHeader}>
      <View style={styles.headerItem}>
      <Text style={{ fontWeight: "600" }}>image</Text>
      </View>
      <View style={styles.headerItem}>
        <Text style={{ fontWeight: "600" }}>Name</Text>
      </View>
      <View style={styles.headerItem}>
        <Text style={{ fontWeight: "600" }}>Status</Text>
      </View>
      <View style={styles.headerItem}>
        <Text style={{ fontWeight: "600" }}>   Sport</Text>
      </View>
      <View style={styles.headerItem}>
        <Text style={{ fontWeight: "600" }}>  Stock</Text>
      </View>
    </View>
  );
};

const Equipments = (props) => {
  const [equipmentList, setEquipmentList] = useState();
  const [equipmentFilter, setEquipmentFilter] = useState();
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState();
  const [refreshing, setRefreshing] = useState(false);
  const navigation = useNavigation();

  const searchEquipment = (text) => {
    if (text === "") {
        setEquipmentFilter(equipmentList);
    }
    setEquipmentFilter(
        equipmentList.filter((i) =>
        i.name.toLowerCase().includes(text.toLowerCase())
      )
    );
  };
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      axios.get(`${baseURL}equipments`).then((res) => {
        // console.log(res.data)
        setEquipmentList(res.data);
        setEquipmentFilter(res.data);
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

      axios.get(`${baseURL}equipments`).then((res) => {
        //console.log(res.data);
        setEquipmentList(res.data);
        setEquipmentFilter(res.data);
        setLoading(false);
        //console.log(res.data)
      });

      return () => {
        setEquipmentList();
        setEquipmentFilter();
        setLoading(true);
      };
    }, [])
  );

  return (
    <Box flex={1}>
      <View>
        <ScrollView horizontal={true} style={styles.buttonContainer}>
        <EasyButton
            secondary
            medium
            onPress={() => navigation.navigate("Borrows")}
          >
            <Icon name="cube" size={18} color="black" />
            <Text style={styles.buttonText}>Borrows</Text>
          </EasyButton>
          <EasyButton
            secondary
            medium
            onPress={() => navigation.navigate("BorrowHistory")}
          >
            <Icon name="file-text" size={18} color="black" />
            <Text style={styles.buttonText}>Borrow Log</Text>
          </EasyButton>
          <EasyButton
            secondary
            medium
            onPress={() => navigation.navigate("EquipmentForm")}
          >
            <Icon name="plus" size={18} color="white" />
            <Text style={styles.buttonText}>Equipment</Text>
          </EasyButton>
          <EasyButton
            secondary
            medium
            onPress={() => navigation.navigate("EquipmentLogs")}
          >
            <Icon name="file-text" size={18} color="white" />
            <Text style={styles.buttonText}>Equipment Logs</Text>
          </EasyButton>
          <EasyButton
            secondary
            medium
            onPress={() => navigation.navigate("EquipmentStockLogs")}
          >
            <Icon name="file-text" size={18} color="white" />
            <Text style={styles.buttonText}>Stocks Log</Text>
          </EasyButton>
          <EasyButton
            secondary
            medium
            onPress={() => navigation.navigate("Products")}
          >
            <Icon name="shopping-cart" size={18} color="white" />
            <Text style={styles.buttonText}>Product</Text>
          </EasyButton>
          <EasyButton
            secondary
            medium
            onPress={() => navigation.navigate("Calendars")}
          >
            <Icon name="calendar" size={18} color="white" />
            <Text style={styles.buttonText}>Calendar</Text>
          </EasyButton>
          <EasyButton
            secondary
            medium
            onPress={() => navigation.navigate("Users")}
          >
            <Icon name="user" size={18} color="white" />
            <Text style={styles.buttonText}>Users</Text>
          </EasyButton>
          <EasyButton
            secondary
            medium
            onPress={() => navigation.navigate("Sports")}
          >
            <Icon name="list" size={18} color="white" />
            <Text style={styles.buttonText}>Sports</Text>
          </EasyButton>
        </ScrollView>
      </View>
      <Searchbar
        width="80%"
        placeholder="Search"
        onChangeText={(text) => searchEquipment(text)}
        //   value={searchQuery}
      />
      {loading ? (
        <View style={styles.spinner}>
          <ActivityIndicator size="large" color="red" />
        </View>
      ) : (
        <FlatList
          data={equipmentFilter}
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

export default Equipments;
