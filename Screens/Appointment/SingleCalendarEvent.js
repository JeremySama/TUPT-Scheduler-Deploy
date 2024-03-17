import React, { useState, useEffect, useContext } from "react";
import { Image, View, StyleSheet, Text, ScrollView, Button, Alert, TextInput, Modal } from "react-native";
import { Heading } from "native-base";
import TrafficLight from "../../Shared/StyledComponents/TrafficLight";
import AuthGlobal from "../../Context/Store/AuthGlobal";
import AsyncStorage from '@react-native-async-storage/async-storage';
import baseURL from "../../assets/common/baseUrl";
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';

const SingleCalendarEvent = (props) => {
  const navigation = useNavigation();
  const [event, setEvent] = useState(props.route.params.item);
  const [availability, setAvailability] = useState(null);
  const [availabilityText, setAvailabilityText] = useState("");
  const [joinKey, setJoinKey] = useState("");
  const [showKeyModal, setShowKeyModal] = useState(false);
  const { stateUser } = useContext(AuthGlobal);

  useEffect(() => {
    if (event.status === 'Approved') {
      setAvailability(<TrafficLight available />);
      setAvailabilityText("Approved");
    }else if (event.status === 'PE Class') {
      setAvailability(<TrafficLight available />);
      setAvailabilityText("PE Class");
    } else if (event.status === 'Pending') {
      setAvailability(<TrafficLight limited />);
      setAvailabilityText("Pending");
    } else {
      setAvailability(<TrafficLight unavailable />);
      setAvailabilityText("Denied");
    }

    return () => {
      setAvailability(null);
      setAvailabilityText("");
    };
  }, []);

  const formatDate = (dateTime) => {
    const date = new Date(dateTime);
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
    };
    return date.toLocaleDateString(undefined, options);
  };


  const handleJoin = async () => {
    try {
      if (!stateUser.user.userId) {
        navigation.navigate("User", { screen: "Login" });
        return;
      }

      const token = await AsyncStorage.getItem("jwt");

      if (!token) {
        navigation.navigate("User", { screen: "Login" });
        return;
      }

      setShowKeyModal(true);
    } catch (error) {
      console.error("Error:", error);
      // Handle exceptions
    }
  };

  const handleModalOK = async (key) => {
    setShowKeyModal(false);

    try {
      if (!stateUser.user.userId) {
        navigation.navigate("User", { screen: "Login" });
        return;
      }

      const token = await AsyncStorage.getItem("jwt");

      if (!token) {
        navigation.navigate("User", { screen: "Login" });
        return;
      }

      const res = await AsyncStorage.getItem("jwt");
      const user = await axios.get(`${baseURL}users/${stateUser.user.userId}`, {
        headers: { Authorization: `Bearer ${res}` },
      });

      if (key === event.key) {
        const confirm = await new Promise((resolve) => {
          Alert.alert(
            "Confirmation",
            "Are you sure you want to join this event?",
            [
              {
                text: "No",
                style: "cancel",
                onPress: () => resolve(false),
              },
              {
                text: "Yes",
                onPress: () => resolve(true),
              },
            ],
            { cancelable: true }
          );
        });

        if (confirm) {
          const response = await axios.put(`${baseURL}appointments/join/${event._id}`, {
            name: user.data.name,
          }, {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
          });

          if (response.status === 200) {
            const updatedEvent = response.data;
            setEvent(updatedEvent);
            // Handle success
          } else {
            console.log("Failed to join event. Status:", response.status);
            // Handle errors
          }
        }
      } else {
        Alert.alert("Incorrect Key", "The entered key is incorrect. Please try again.");
      }
    } catch (error) {
      console.error("Error:", error);
      // Handle exceptions
    }
  };

  const handleModalCancel = () => {
    setShowKeyModal(false);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.imageContainer}>
        <Image
          source={require("../../assets/Logo.png")}
          style={styles.image}
        />
      </View>

      <View style={styles.contentContainer}>
        <Heading style={styles.contentHeader} size="xl">
          {event.title}
        </Heading>
        <Text style={styles.contentText}>{event.description}</Text>
      </View>
      <View style={styles.availabilityContainer}>
        <View style={styles.availability}>
          <Text style={styles.availabilityText}>
            Status: {availabilityText}
          </Text>
          {availability}
        </View>
        <Text style={styles.eventInfo}>Location: {event.location}</Text>
        <Text style={styles.eventInfo}>Start: {formatDate(event.timeStart)}</Text>
        <Text style={styles.eventInfo}>End: {formatDate(event.timeEnd)}</Text>
        <Text style={styles.eventInfo}>
          Attendees: {event.attendees.join(", ")}
        </Text>
        <Button title="Join Event" onPress={handleJoin} />
      </View>

      <Modal
        visible={showKeyModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowKeyModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text>Please enter the join key for this event:</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter Join Key"
              onChangeText={(text) => setJoinKey(text)}
              value={joinKey}
            />
            <Button title="OK" onPress={() => handleModalOK(joinKey)} />
            <Button title="Cancel" onPress={handleModalCancel} />
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
  },
  imageContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  image: {
    width: 200,
    height: 100,
  },
  contentContainer: {
    marginBottom: 20,
  },
  contentHeader: {
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333",
  },
  contentText: {
    fontSize: 18,
    color: "#666",
  },
  availabilityContainer: {
    marginBottom: 20,
  },
  availability: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  availabilityText: {
    fontWeight: "bold",
    marginRight: 10,
    color: "#333",
  },
  eventInfo: {
    fontSize: 16,
    color: "#555",
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingLeft: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    elevation: 5,
  },
});

export default SingleCalendarEvent;
