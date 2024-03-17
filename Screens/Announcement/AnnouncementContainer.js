import React, { useState, useEffect, useContext, useCallback } from "react";
import { View, Text, StyleSheet, FlatList, ActivityIndicator, Image, ScrollView, Button } from "react-native";
import axios from "axios";
import EasyButton from "../../Shared/StyledComponents/EasyButtons";
import baseURL from "../../assets/common/baseUrl";
import Icon from "react-native-vector-icons/FontAwesome";
import { useNavigation } from "@react-navigation/native";
import { useFocusEffect } from "@react-navigation/native";
import AuthGlobal from "../../Context/Store/AuthGlobal";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";


const AnnouncementContainer = () => {
  const navigation = useNavigation();
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const { stateUser } = useContext(AuthGlobal);
  const [userProfile, setUserProfile] = useState(null);
  useFocusEffect(
    useCallback(() => {
      const refreshData = async () => {
        try {
          setLoading(true);
          const response = await axios.get(`${baseURL}announcements`);
          setAnnouncements(response.data);
          setLoading(false);
        } catch (error) {
          console.error("Error fetching announcements: ", error);
          setLoading(false);
        }
      };
      refreshData();
      const fetchUserProfile = async () => {
        try {
          const token = await AsyncStorage.getItem("jwt");
          if (token && stateUser.user.userId) {
            const response = await axios.get(
              `${baseURL}users/${stateUser.user.userId}`,
              {
                headers: { Authorization: `Bearer ${token}` },
              }
            );
            setUserProfile(response.data);
          }
        } catch (error) {
          console.error("Error fetching user profile:", error);
        }
      };

      fetchUserProfile();
    }, [])
  );

  const renderImages = (images) => {
    return images.map((image, index) => (
      <Image key={index} source={{ uri: image.url }} style={styles.image} />
    ));
  };

  const renderAnnouncementItem = ({ item }) => {
    const handleEditAnnouncement = (announcementId) => {
      // Navigate to the edit screen with the announcementId
      navigation.navigate("AnnouncementForm", { announcementId }); // Update the screen name and params
    };

    const handleDeleteAnnouncement = async (announcementId) => {
      try {
        await axios.delete(`${baseURL}announcements/${announcementId}`);
        // Refresh the data after deletion
        const response = await axios.get(`${baseURL}announcements`);
        setAnnouncements(response.data);
      } catch (error) {
        console.error("Error deleting announcement: ", error);
      }
    };

    // Convert timestamp to a readable date string
    const formattedDate = new Date(item.dateCreated).toLocaleDateString(); // You might need to adjust the date format

    return (
      <View style={styles.announcementItem}>
        <ScrollView horizontal>
          {renderImages(item.images)}
        </ScrollView>
        <Text style={styles.body}>Date: {formattedDate}</Text>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.body}>{item.body}</Text>


        {isAdminOrSuperAdmin && (
          <>
            <Button
              title="Edit"
              onPress={() => handleEditAnnouncement(item._id)}
            />
            <Button
              title="Delete"
              onPress={() => handleDeleteAnnouncement(item._id)}
              color="red"
            />
          </>
        )}
      </View>
    );
  };

  const navigateToAddAnnouncement = () => {
    navigation.navigate("AnnouncementForm"); // Update the screen name
  };

  const isAdminOrSuperAdmin =
    stateUser.isAuthenticated &&
    (stateUser.user.role === "admin" || stateUser.user.role === "super admin");

  return (

    <View style={styles.container}>
      <LinearGradient colors={["maroon", "white", "white"]}>
        {isAdminOrSuperAdmin && (
          <EasyButton secondary large onPress={navigateToAddAnnouncement} style={styles.addButton}>
            <Icon name="plus" size={18} color="white" />
            <Text style={styles.buttonText}>Post Announcement</Text>
          </EasyButton>
        )}
        {loading ? (
          <ActivityIndicator size="large" color="#0000ff" />
        ) : announcements.length > 0 ? (
          <FlatList
            data={announcements}
            renderItem={renderAnnouncementItem}
            keyExtractor={(item) => item._id}
            style={{ width: '100%' }} // Add this line to maximize the width
          />
        ) : (
          <Text>No announcements available</Text>
        )}
      </LinearGradient>
    </View>

  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 0,
    width: '100%', // Add this line to maximize the width
    backgroundColor: "rgba(176, 48, 96, 0.8)",
  },
  announcementItem: {
    backgroundColor: "#fff",
    padding: 0,
    marginVertical: 8,
    marginHorizontal: 16,

  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 5,
    margin: 10,
  },
  body: {
    fontSize: 16,
    marginBottom: 5,
    textAlign: "justify",
    margin: 10,
  },
  buttonText: {
    color: "white",
    marginLeft: 10,
  },
  image: {
    width: 500,
    height: 300,
    marginRight: 5,
  },
  addButton: {
    padding: 15, // Adjust the padding to your preference
    marginTop: 20, // Add margin-top for separation from other elements
  },
});

export default AnnouncementContainer;
