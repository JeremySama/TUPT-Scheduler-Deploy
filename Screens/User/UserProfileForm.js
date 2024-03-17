import React, { useState, useEffect } from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity, ActivityIndicator } from "react-native";
import { useNavigation } from "@react-navigation/native";
import FormContainer from "../../Shared/Form/FormContainer";
import Input from "../../Shared/Form/Input";
import EasyButton from "../../Shared/StyledComponents/EasyButtons";
import Icon from "react-native-vector-icons/FontAwesome";
import Toast from "react-native-toast-message";
import AsyncStorage from "@react-native-async-storage/async-storage";
import baseURL from "../../assets/common/baseUrl";
import Error from "../../Shared/Error";
import axios from "axios";
import * as ImagePicker from "expo-image-picker";
import mime from "mime";
import { Select } from "native-base";


const UserProfileForm = (props) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [image, setImage] = useState("");
  const [mainImage, setMainImage] = useState("");
  const [token, setToken] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [department, setDepartment] = useState("");
  const [course, setCourse] = useState("");
  const [courseList, setCourseList] = useState([]);
  const [year, setYear] = useState("");
  const [availability, setAvailability] = useState("");
  const [isAdminOrProfessor, setIsAdminOrProfessor] = useState(false); // New state



  const departmentList = [
    "BS Engineering Program",
    "BS Degree Program",
    "BTVTED Program",
    "BET Program",
  ];

  const availabilityList = [
    "available",
    "unavailable"
  ];

  const coursesByDepartment = {
    "BS Engineering Program": ["N/A","BSCE", "BSEE", "BSEcE", "BSME"],
    "BS Degree Program": ["N/A","BSIT", "BSES"],
    "BTVTED Program": ["N/A","BTVTEDET", "BTVTEDELXT", "BETVTEDICT", "BTVTEDICT-CH"],
    "BET Program": ["N/A","BETAT", "BETCHT", "BETCT", "BETET", "BETELXT", "BETHVAC/RT", "BETMT", "ВЕТМЕСТ", "BETNDT", "BETDMT", "BETEMT", "BETICT"],
  };

  const yearList = ["N/A","1st Year", "2nd Year", "3rd Year", "4th Year"];

  const handleDepartmentChange = (selectedDepartment) => {
    setDepartment(selectedDepartment);
    setCourseList(coursesByDepartment[selectedDepartment] || []);
  };

  const navigation = useNavigation();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = await AsyncStorage.getItem("jwt");
        setToken(token);

        const response = await axios.get(
          `${baseURL}users/${props.route.params?.userProfile?._id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const userData = response.data;

        setName(userData?.name || "");
        setEmail(userData?.email || "");
        setMainImage(userData?.image || "");
        setImage(userData?.image || "");
        setDepartment(userData?.department || ""); // Set department from user data
        setCourseList(coursesByDepartment[userData?.department] || []);
        setCourse(userData?.course || ""); // Set course from user data
        setYear(userData?.year || ""); // Set year from user data
        setAvailability(userData?.availability || ""); // Set year from user data
        const roles = userData?.role || [];
        const isAdminOrProfessor = roles.includes("professor") || roles.includes("admin");
        setIsAdminOrProfessor(isAdminOrProfessor);
        setIsLoading(false);
 
      } catch (error) {
        console.error("Error fetching user data:", error);

        Toast.show({
          topOffset: 60,
          type: "error",
          text1: "Something went wrong",
          text2: "Please try again",
        });

        setIsLoading(false);
      }
    };

    fetchData();

    return () => {
      // Cleanup logic, if needed
    };
  }, [props.route.params?.userProfile?._id]);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.cancelled) {
      setMainImage(result.assets[0].uri);
      setImage(result.assets[0].uri);
    }
  };

  const updateUserProfile = async () => {
    try {
      if (
        name === "" ||
        email === "" ||
        department === "" ||
        course === "" ||
        year === "" 
      ) {
        setError("Please fill in the form correctly");
        return;
      }

      let formData = new FormData();
      const newImageUri = "file:///" + image.split("file:/").join("");

      formData.append("name", name);
      formData.append("email", email);
      formData.append("department", department);
      formData.append("course", course);
      formData.append("year", year);
      formData.append("availability", availability);
      formData.append("image", {
        uri: newImageUri,
        type: mime.getType(newImageUri),
        name: newImageUri.split("/").pop(),
      });

      const config = {
        timeout: 5000, // 5 seconds timeout
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      };

      const userId = props.route.params?.userProfile?._id;
      //console.log("User ID:", userId);

      const apiUrl = `${baseURL}users/${userId}`;
      //console.log("API URL:", apiUrl);

      const res = await axios.put(apiUrl, formData, config);

      if (res.status === 200 || res.status === 201) {
        Toast.show({
          topOffset: 60,
          type: "success",
          text1: "Profile updated successfully",
          text2: "",
        });
        setTimeout(() => {
          navigation.navigate("User Profile");
        }, 500);
      }
    } catch (error) {
      console.error("Error updating user profile:", error);

      Toast.show({
        topOffset: 60,
        type: "error",
        text1: "Something went wrong",
        text2: "Please try again",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <FormContainer title="Edit Profile">
      {isLoading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <>
          <View style={styles.imageContainer}>
            {mainImage !== "" && (
              <Image style={styles.image} source={{ uri: mainImage }} />
            )}
            <TouchableOpacity onPress={pickImage} style={styles.imagePicker}>
              <Icon style={{ color: "white" }} name="camera" />
            </TouchableOpacity>
          </View>
          <Input
            placeholder="Name"
            name="name"
            id="name"
            value={name}
            onChangeText={(text) => setName(text)}
          />
          <Input
            placeholder="Email"
            name="email"
            id="email"
            value={email}
            onChangeText={(text) => setEmail(text)}
          />

<View style={styles.pickerContainer}>
            <Select
              placeholder="Select Department"
              selectedValue={department}
              onValueChange={(itemValue) => handleDepartmentChange(itemValue)}
              style={styles.picker}
            >
              {departmentList.map((dept, index) => (
                <Select.Item
                  key={index}
                  label={dept}
                  value={dept}
                  style={styles.pickerItem}
                />
              ))}
            </Select>
          </View>

          {!isAdminOrProfessor && department && (
            <View style={styles.pickerContainer}>
              <Select
                placeholder="Select Course"
                selectedValue={course}
                onValueChange={(itemValue) => setCourse(itemValue)}
                style={styles.picker}
              >
                {courseList.map((course, index) => (
                  <Select.Item
                    key={index}
                    label={course}
                    value={course}
                    style={styles.pickerItem}
                  />
                ))}
              </Select>
            </View>
          )}

          {!isAdminOrProfessor && (
            <View style={styles.pickerContainer}>
              <Select
                placeholder="Select Year"
                selectedValue={year}
                onValueChange={(itemValue) => setYear(itemValue)}
                style={styles.picker}
              >
                {yearList.map((year, index) => (
                  <Select.Item
                    key={index}
                    label={year}
                    value={year}
                    style={styles.pickerItem}
                  />
                ))}
              </Select>
            </View>
          )}

          {isAdminOrProfessor && (
            <View style={styles.pickerContainer}>
              <Select
                placeholder="Select Availability"
                selectedValue={availability}
                onValueChange={(itemValue) => setAvailability(itemValue)}
                style={styles.picker}
              >
                {availabilityList.map((avail, index) => (
                  <Select.Item
                    key={index}
                    label={avail}
                    value={avail}
                    style={styles.pickerItem}
                  />
                ))}
              </Select>
            </View>
          )}



          {error ? <Error message={error} /> : null}
          <View style={styles.buttonContainer}>
            <EasyButton large primary onPress={() => updateUserProfile()}>
              <Text style={styles.buttonText}>Update Profile</Text>
            </EasyButton>
          </View>
        </>
      )}
    </FormContainer>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    width: "80%",
    marginBottom: 80,
    marginTop: 20,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
  },
  imageContainer: {
    width: 200,
    height: 200,
    borderStyle: "solid",
    borderWidth: 8,
    padding: 0,
    justifyContent: "center",
    borderRadius: 100,
    borderColor: "#E0E0E0",
    elevation: 10,
  },
  image: {
    width: "100%",
    height: "100%",
    borderRadius: 100,
  },
  imagePicker: {
    position: "absolute",
    right: 5,
    bottom: 5,
    backgroundColor: "grey",
    padding: 8,
    borderRadius: 100,
    elevation: 20,
  },
  pickerContainer: {
    width: "80%",
    marginBottom: 10,
  },
  picker: {
    height: 50,
    width: "100%",
    color: "black",
    backgroundColor: "white",
    
  },
  pickerItem: {
    width: "90%",
    backgroundColor: "white",
  },
});

export default UserProfileForm;
