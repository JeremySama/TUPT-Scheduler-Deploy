import React, { useState, useEffect } from "react";
import { View, Text, TextInput, StyleSheet, Button, Image, ScrollView } from "react-native";
import axios from "axios";
import baseURL from "../../assets/common/baseUrl";
import * as ImagePicker from "expo-image-picker";
import { TouchableOpacity } from "react-native-gesture-handler";

const AnnouncementForm = ({ navigation, route }) => {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (route.params?.announcementId) {
      axios
        .get(`${baseURL}announcements/${route.params.announcementId}`)
        .then((response) => {
          //console.log(response.data);
          const { title, body, images } = response.data;
          setTitle(title || "");
          setBody(body || "");

          // Normalize the structure of existing images to { uri: "", url: "" }
          const normalizedImages = images.map((image) => ({
            uri: image.url,
            url: image.url,
          }));

          setImages(normalizedImages); // Load existing images for editing
        })
        .catch((error) => {
          console.error("Error fetching announcement for edit: ", error);
          // Handle error (e.g., show error message, set default values, etc.)
        });
    }
  }, [route.params?.announcementId]);

  const handleAddOrUpdateAnnouncement = async () => {
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("body", body);

      images.forEach((image, index) => {
        // Use the uri property for both existing and new images
        formData.append("images", {
          uri: image.uri,
          name: `image-${index}`,
          type: "image/jpg",
        });
      });

      let url = `${baseURL}announcements`;
      let method = "post"; // Default to POST for adding announcements

      if (route.params?.announcementId) {
        url = `${baseURL}announcements/${route.params.announcementId}`;
        method = "put"; // Use PUT for editing existing announcements
      }

      const response = await axios.request({
        method,
        url,
        data: formData,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      //console.log("Announcement saved:", response.data);
      setLoading(false);
      navigation.navigate("Announcements");
    } catch (error) {
      console.error("Error saving announcement: ", error);
      setLoading(false);
    }
  };

  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
  
    if (permissionResult.granted === false) {
      alert("Permission to access camera roll is required!");
      return;
    }
  
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    //console.log(result);
  
    if (!result.canceled) {
      // Extract the first asset from the "assets" array
      const selectedAsset = result.assets && result.assets.length > 0 ? result.assets[0] : null;
  
      if (selectedAsset) {
        // Store the entire image object in the array with both uri and url properties
        const updatedImages = [...images, { uri: selectedAsset.uri, url: selectedAsset.uri }];
        setImages(updatedImages);
      }
    }
  };

  const removeImage = (index) => {
    const newImages = [...images];
    newImages.splice(index, 1); // Remove the image at the specified index
    setImages(newImages);
  };

  return (
    <View style={styles.container}>
      <ScrollView>
        <View style={styles.formGroup}>
          <Text style={styles.label}>Title:</Text>
          <TextInput
            style={styles.input}
            value={title}
            onChangeText={(text) => setTitle(text)}
            placeholder="Enter title"
          />
        </View>
        <View style={styles.formGroup}>
          <Text style={styles.label}>Body:</Text>
          <TextInput
            style={[styles.input, { height: 100 }]}
            value={body}
            onChangeText={(text) => setBody(text)}
            placeholder="Enter body"
            multiline
          />
        </View>
        <View style={styles.formGroup}>
          <Button
            title="Choose Image"
            onPress={pickImage}
            color="#007BFF" // Use a color that matches your app's theme
          />
        </View>
        <View style={styles.imageContainer}>
          {images.map((image, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => removeImage(index)} // Handle tap event to remove the image
              style={styles.imageItem}
            >
              <Image source={{ uri: image.url }} style={styles.image} />
            </TouchableOpacity>
          ))}
        </View>
        <Button
          title={loading ? "Saving Announcement..." : "Save Announcement"}
          onPress={handleAddOrUpdateAnnouncement}
          disabled={loading || !title || !body}
          style={styles.saveButton}
        />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  label: {
    fontSize: 18,
    marginBottom: 5,
  },
  input: {
    borderColor: "#ccc",
    borderWidth: 1,
    padding: 10,
    marginBottom: 15,
    fontSize: 16,
  },
  formGroup: {
    marginBottom: 15,
  },
  imageContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between", // Add this line to create two columns
    marginVertical: 10,
    paddingHorizontal: 5, // Add padding
  },
  imageItem: {
    flexDirection: "row",
    marginBottom: 5,
    width: "100%", // Set the width to create two columns with some space in between
  },
  image: {
    width: 100,
    height: 100,
    margin: 0,
  },
  saveButton: {
    backgroundColor: "#28a745",
    color: "#fff",
  },
});

export default AnnouncementForm;
