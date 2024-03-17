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
import { Box } from "native-base";
import Icon from "react-native-vector-icons/FontAwesome";
import { useFocusEffect } from "@react-navigation/native";
import { Searchbar } from "react-native-paper";
import ListItem from "./ListItem";
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
        <Text style={{ fontWeight: "600" }}>Stocks</Text>
      </View>
      <View style={styles.headerItem}>
        <Text style={{ fontWeight: "600" }}>Price</Text>
      </View>
    </View>
  );
};

const Products = (props) => {
  const [productList, setProductList] = useState();
  const [productFilter, setProductFilter] = useState();
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState();
  const [refreshing, setRefreshing] = useState(false);
  const navigation = useNavigation();

  const searchProduct = (text) => {
    if (text === "") {
      setProductFilter(productList);
    }
    setProductFilter(
      productList.filter((i) =>
        i.name.toLowerCase().includes(text.toLowerCase())
      )
    );
  };
  const deleteProduct = (id) => {
    axios
      .delete(`${baseURL}products/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        const products = productFilter.filter((item) => item.id !== id);
        setProductFilter(products);
      })
      .catch((error) => console.log(error));
  };
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      axios.get(`${baseURL}products`).then((res) => {
        // console.log(res.data)
        setProductList(res.data);
        setProductFilter(res.data);
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

      axios.get(`${baseURL}products`).then((res) => {
        //console.log(res.data);
        setProductList(res.data);
        setProductFilter(res.data);
        setLoading(false);
        //console.log(res.data)
      });

      return () => {
        setProductList();
        setProductFilter();
        setLoading(true);
      };
    }, [])
  );

  return (
    <Box flex={1}>
      <View style={{ backgroundColor: "maroon" }}>
        <ScrollView horizontal={true} style={styles.buttonContainer}>
          <EasyButton
            secondary
            medium
            onPress={() => navigation.navigate("Orders")}
          >
            <Icon name="shopping-bag" size={18} color="black" />
            <Text style={styles.buttonText}>Orders</Text>
          </EasyButton>
          <EasyButton
            secondary
            medium
            onPress={() => navigation.navigate("OrderHistory")}
          >
            <Icon name="file-text" size={18} color="black" />
            <Text style={styles.buttonText}>Orders log</Text>
          </EasyButton>
          
          <EasyButton
            secondary
            medium
            onPress={() => navigation.navigate("ProductForm")}
          >
            <Icon name="plus" size={18} color="black" />
            <Text style={styles.buttonText}>Products</Text>
          </EasyButton>
          <EasyButton
            secondary
            medium
            onPress={() => navigation.navigate("ProductStockLogs")}
          >
            <Icon name="file-text" size={18} color="black" />
            <Text style={styles.buttonText}>Prod Logs</Text>
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
            onPress={() => navigation.navigate("Calendars")}
          >
            <Icon name="calendar" size={18} color="black" />
            <Text style={styles.buttonText}>Calendar</Text>
          </EasyButton>
          <EasyButton
            secondary
            medium
            onPress={() => navigation.navigate("Users")}
          >
            <Icon name="user" size={18} color="black" />
            <Text style={styles.buttonText}>Users</Text>
          </EasyButton>
          <EasyButton
            secondary
            medium
            onPress={() => navigation.navigate("Categories")}
          >
            <Icon name="list" size={18} color="black" />
            <Text style={styles.buttonText}>Categories</Text>
          </EasyButton>
        </ScrollView>
      </View>
      <Searchbar
        style={{
          backgroundColor: 'white', // Set a background color
          borderWidth: 1, // Add a border
          borderColor: 'gray', // Border color
          marginBottom: 10,
          marginTop: 10
        }}
        width="180%"
        placeholder="Search products here"
        onChangeText={(text) => searchProduct(text)}
      />
      {loading ? (
        <View style={styles.spinner}>
          <ActivityIndicator size="large" color="red" />
        </View>
      ) : (
        <FlatList
          data={productFilter}
          ListHeaderComponent={ListHeader}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          renderItem={({ item, index }) => (
            <ListItem item={item} index={index} deleteProduct={deleteProduct} />
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
    backgroundColor: "maroon"
  },
  buttonText: {
    marginLeft: 4,
    color: "white",
  },
});

export default Products;
