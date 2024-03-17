import React, { useState, useEffect, useContext, useCallback } from "react";
import { View, FlatList, StyleSheet, Text, TouchableOpacity } from "react-native";
import axios from "axios";
import baseURL from "../../assets/common/baseUrl";
import NotifCard from "../../Shared/NotifCard";
import AuthGlobal from "../../Context/Store/AuthGlobal";
import { useNavigation } from "@react-navigation/native";
import Toast from "react-native-toast-message";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";

const Notifications = (props) => {
  const [notifList, setNotifList] = useState([]);
  const [userId, setUserId] = useState("");
  const [role, setRole] = useState("");
  const [refreshFlag, setRefreshFlag] = useState(false);
  const context = useContext(AuthGlobal);
  const navigation = useNavigation();

  useEffect(() => {
    if (context.stateUser.user.userId) {
      setUserId(context.stateUser.user.userId);
      setRole(context.stateUser.user.role);
    } else {
       navigation.navigate("User", { screen: "Login" });
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      const fetchNotifications = async () => {
        try {
          const response = await axios.get(`${baseURL}users/notification/all`);
          let filteredNotifs = response.data;
  
          if ((role === 'admin' || role === 'officer') && response.data) {
            filteredNotifs = response.data.filter(notification => {
              return notification.status === 'unread' && notification.type === 'created' || notification.userId === userId && notification.type === 'updated' && notification.status === 'unread';
            });
          } else if ((role === 'user' || role === 'professor') && response.data) {
            filteredNotifs = response.data.filter(notification => {
              return notification.userId === userId && notification.status === 'unread' && notification.type === 'updated';
            });
          }
  
          setNotifList(filteredNotifs);
        } catch (error) {
          console.log('Error fetching Notifications:', error);
        }
      };
  
      fetchNotifications();
    }, [role, userId])
  );
  

  const read = async () => {
    try {
      const token = await AsyncStorage.getItem("jwt");
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const notifs = {
        role: role,
        user: userId
      };
      const response = await axios.put(
        `${baseURL}users/notification/update`,
        notifs,
        config
      );
      setRefreshFlag(!refreshFlag);

      if (response.status === 200 || response.status === 201) {
        Toast.show({
          topOffset: 60,
          type: "success",
          text1: "All notifications are marked as read",
          text2: "",
        });
      }
    } catch (error) {
      console.log(error)
      Toast.show({
        topOffset: 60,
        type: "error",
        text1: "Something went wrong",
        text2: "Please try again",
      });
    }
  };

  if (notifList.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>You have 0 notifications</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={notifList}
        renderItem={({ item }) => <NotifCard item={item} />}
        keyExtractor={(item) => item.id}
      />
      <TouchableOpacity style={styles.button} onPress={read}>
        <Text style={styles.buttonText}>Mark All Read</Text>
      </TouchableOpacity>
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
  button: {
    backgroundColor: "#0080ff",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginTop: 20,
    alignSelf: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  text: {
    textAlign: "center", // Center the text horizontally
  },
});

export default Notifications;
