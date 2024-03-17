import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  Dimensions,
  ScrollView,
  RefreshControl,
} from "react-native";
import { Searchbar } from "react-native-paper";
import Icon from "react-native-vector-icons/FontAwesome";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Box } from "native-base";
import axios from "axios";
import baseURL from "../../assets/common/baseUrl";
import UserListItem from "./UserListItem";
import EasyButton from "../../Shared/StyledComponents/EasyButtons";


var { height, width } = Dimensions.get("window");

const ListHeader = () => {
  return (
    <View elevation={1} style={styles.listHeader}>
      <View style={styles.headerItem}>
        <Text style={{ fontWeight: "600" }}>Name</Text>
      </View>
      <View>
      <Text style={{ fontWeight: "600" }}>         </Text>
      </View>
      <View style={styles.headerItem}>
        <Text style={{ fontWeight: "600" }}>Email</Text>
      </View>
      <View>
      <Text style={{ fontWeight: "600" }}>        </Text>
      </View>
      <View style={styles.headerItem}>
        <Text style={{ fontWeight: "600" }}>Dept.</Text>
      </View>
      <View>
      <Text style={{ fontWeight: "600" }}>          </Text>
      </View> 
      <View style={styles.headerItem}>
        <Text style={{ fontWeight: "600" }}>Role</Text>
      </View>
      {/* Add other header items based on your user schema */}
    </View>
  );
};

const Users = (props) => {
  const [userList, setUserList] = useState();
  const [userFilter, setUserFilter] = useState();
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState();
  const [refreshing, setRefreshing] = useState(false);

  const navigation = useNavigation(); // Use useNavigation hook to get navigation object

  const searchUser = (text) => {
    if (text === "") {
      setUserFilter(userList);
    }
    setUserFilter(
      userList.filter((user) =>
        user.name.toLowerCase().includes(text.toLowerCase())
      )
    );
  };

  const deleteUser = (id) => {
    axios
      .delete(`${baseURL}users/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        const users = userFilter.filter((item) => item.id !== id);
        setUserFilter(users);
      })
      .catch((error) => console.log(error));
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      axios.get(`${baseURL}users`).then((res) => {
        setUserList(res.data);
        setUserFilter(res.data);
        setLoading(false);
      });
      setRefreshing(false);
    }, 2000);
  }, []);

  useFocusEffect(
    useCallback(() => {
      AsyncStorage.getItem("jwt")
        .then((res) => {
          setToken(res);
        })
        .catch((error) => console.log(error));

      axios.get(`${baseURL}users`).then((res) => {
        setUserList(res.data);
        setUserFilter(res.data);
        setLoading(false);
      });

      return () => {
        setUserList();
        setUserFilter();
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
            onPress={() => navigation.navigate("Equipments")}
          >
            <Icon name="archive" size={18} color="white" />
            <Text style={styles.buttonText}>Equipment</Text>
          </EasyButton>
        </ScrollView>
      </View>
      <Searchbar
        width="80%"
        placeholder="Search"
        onChangeText={(text) => searchUser(text)}
      />
      {loading ? (
        <View style={styles.spinner}>
          <ActivityIndicator size="large" color="red" />
        </View>
      ) : (
        <FlatList
          data={userFilter}
          ListHeaderComponent={ListHeader}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          renderItem={({ item, index }) => (
            <UserListItem
              item={item}
              index={index}
              deleteUser={deleteUser}
            />
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

export default Users;
