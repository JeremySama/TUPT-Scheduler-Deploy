import React, { useState, useEffect, useContext, useCallback } from "react";
import axios from "axios";
import baseURL from "../assets/common/baseUrl";
import AuthGlobal from "../Context/Store/AuthGlobal";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import { StyleSheet } from "react-native";
import { Badge, Text } from "native-base";
import { useSelector } from 'react-redux';

const NotificationIcon = (props) => {
    const [notifList, setNotifList] = useState([]);
    const [userId, setUserId] = useState("");
    const [role, setRole] = useState("");
    const [refreshFlag, setRefreshFlag] = useState(false);
    const context = useContext(AuthGlobal);

    useEffect(() => {
        if (context.stateUser.user.userId) {
          setUserId(context.stateUser.user.userId);
          setRole(context.stateUser.user.role);
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
              setRefreshFlag(!refreshFlag);
              setNotifList(filteredNotifs);
            } catch (error) {
              console.log('Error fetching Notifications:', error);
            }
          };
      
          fetchNotifications();
        }, [role, userId])
      );

  return (
    <>
      {notifList.length > 0 && (
        <Badge style={styles.badge}>
          <Text style={styles.text}>{notifList.length}</Text>
        </Badge>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  badge: {
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "red", // Background color for the badge
    width: 24, // Adjust the width of the badge
    height: 24, // Adjust the height of the badge
    borderRadius: 13, // Make the badge circular
    top: 1, // Move the badge lower
    left: 27, // Move the badge to the left
  },
  text: {
    top: -2, // Move the badge lower
    fontSize: 12,
    fontWeight: "bold",
    color: "white", // Text color for the badge
  },
});

export default NotificationIcon;
