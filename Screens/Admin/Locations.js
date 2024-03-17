import React, { useState, useCallback, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  RefreshControl,
  Modal,
  TextInput,
  ScrollView,
  StyleSheet,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import axios from "axios";
import baseURL from "../../assets/common/baseUrl";
import EasyButton from "../../Shared/StyledComponents/EasyButtons";
import { useNavigation } from "@react-navigation/native";
import { Box } from "native-base";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Locations = () => {
  const [locationList, setLocationList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [locationName, setLocationName] = useState("");
  const [editingLocation, setEditingLocation] = useState(null);
  const navigation = useNavigation();

  const fetchLocations = useCallback(async () => {
    try {
      const token = await AsyncStorage.getItem("jwt");
      const response = await axios.get(`${baseURL}locations`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setLocationList(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching locations:", error);
    }
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      fetchLocations();
      setRefreshing(false);
    }, 2000);
  }, [fetchLocations]);

  useEffect(() => {
    fetchLocations();
  }, [fetchLocations]);

  const addLocation = async () => {
    try {
    const token = await AsyncStorage.getItem("jwt");
      if (editingLocation) {
        await axios.put(
          `${baseURL}locations/${editingLocation._id}`,
          { name: locationName },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const updatedLocations = locationList.map((location) =>
          location._id === editingLocation._id
            ? { ...location, name: locationName }
            : location
        );
        setLocationList(updatedLocations);
        setEditingLocation(null);
      } else {
        const response = await axios.post(`${baseURL}locations`, {
          name: locationName,},
        { headers: { Authorization: `Bearer ${token}` } });
        setLocationList([...locationList, response.data]);
      }

      setLocationName("");
      setModalVisible(false);
    } catch (error) {
      console.error("Error adding/updating location:", error);
    }
  };

  const editLocation = (location) => {
    setEditingLocation(location);
    setLocationName(location.name);
    setModalVisible(true);
  };
  
    return (
        <Box flex={1}>
      <FlatList
        data={locationList}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        renderItem={({ item }) => (
          <View style={styles.categoryItem}>
            <Text>{item.name}</Text>
            <EasyButton
              style={styles.editButton}
              onPress={() => editLocation(item)}
            >
              <Text style={{ color: "white" }}>Edit</Text>
            </EasyButton>
          </View>
        )}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: 20 }} // Adjust as needed
      />
  
        <Modal visible={modalVisible} animationType="slide" transparent>
          <View style={styles.overlay}>
            <View style={styles.modalContainer}>
              <Text style={styles.sectionTitle}>
                {editingLocation ? "Edit Location" : "Add Location"}
              </Text>
              <TextInput
                style={styles.input}
                placeholder="Location Name"
                value={locationName}
                onChangeText={(text) => setLocationName(text)}
              />
              <View style={styles.buttonContainer}>
                <EasyButton style={styles.modalButton} onPress={addLocation}>
                  <Text style={styles.buttonText}>
                    {editingLocation ? "Edit" : "Add"}
                  </Text>
                </EasyButton>
                <EasyButton
                  style={styles.modalButton2}
                  onPress={() => setModalVisible(false)}
                >
                  <Text style={styles.buttonText}>Cancel</Text>
                </EasyButton>
              </View>
            </View>
          </View>
        </Modal>
      </Box>
    );
  };
  

const styles = StyleSheet.create({
    categoryItem: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        padding: 10,
        borderBottomWidth: 1,
        borderColor: "lightgray",
      },
      overlay: {
        flex: 1,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        justifyContent: "center",
        alignItems: "center",
      },
      modalContainer: {
        padding: 20,
        backgroundColor: "#f0f0f0",
        width: "80%",
        borderRadius: 10,
      },
      sectionTitle: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 10,
      },
      input: {
        height: 40,
        borderColor: "gray",
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 10,
        marginBottom: 10,
      },
      buttonContainer: {
        flexDirection: "row",
        marginTop: 20,
      },
      buttonText: {
        color: "white",
      },
      editButton: {
        backgroundColor: "red",
        padding: 10,
        borderRadius: 5,
      },
      editButtonText: {
        color: "white",
        fontWeight: "bold",
      },

  // Updated styles for the buttons in Modal
  modalButton: {
    flex: 1,
    backgroundColor: "red",
    padding: 10,
    borderRadius: 5,
    marginLeft: 10,
  },
  modalButton2: {
    flex: 1,
    backgroundColor: "#45b6fe",
    padding: 10,
    borderRadius: 5,
    marginLeft: 10,
  },
});

export default Locations;
