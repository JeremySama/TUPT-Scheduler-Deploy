import React, { useState,useEffect } from "react";
import { View, Text, StyleSheet, ImageBackground } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useNavigation } from "@react-navigation/native";
import { Select } from "native-base";
import FormContainer from "../../Shared/Form/FormContainer";
import Input from "../../Shared/Form/Input";
import Error from "../../Shared/Error";
import axios from "axios";
import baseURL from "../../assets/common/baseUrl";
import Toast from "react-native-toast-message";
import EasyButton from "../../Shared/StyledComponents/EasyButtons";


const Register = (props) => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [department, setDepartment] = useState("");
  const [course, setCourse] = useState("");
  const [courseList, setCourseList] = useState([]);
  const [year, setYear] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigation = useNavigation();

  const departmentList = [
    "BS Engineering Program",
    "BS Degree Program",
    "BTVTED Program",
    "BET Program",
  ];

  const coursesByDepartment = {
    "BS Engineering Program": ["N/A", "BSEE", "BSEcE", "BSME", "BSCE"],
    "BS Degree Program": ["N/A","BSIT", "BSES"],
    "BTVTED Program": ["N/A","BTVTEDET", "BTVTEDELXT", "BETVTEDICT","BTVTEDICT-CH"],
    "BET Program": ["N/A","BETAT", "BETCHT", "BETCT", "BETET",
                    "BETELXT", "BETHVAC/RT", "BETMT",
                    "ВЕТМЕСТ", "BETNDT", "BETDMT", "BETEMT"
                    , "BETICT"],
  };

  const handleDepartmentChange = (selectedDepartment) => {
    setDepartment(selectedDepartment);
    setCourseList(coursesByDepartment[selectedDepartment] || []);
  };

  const handleYearChange = (selectedYear) => {
    setYear(selectedYear);
  };

  const yearList = ["N/A","1st Year", "2nd Year", "3rd Year", "4th Year"];

  const checkEmailExists = () => {
    return axios.get(`${baseURL}users`)
      .then(response => {
        const users = response.data;
        const userWithEmail = users.find(user => user.email === email);
        return !!userWithEmail; // Returns true if user with given email exists, false otherwise
        //console.log("Email is already used")
      })
      .catch(error => {
        console.error("Error checking email:", error);
        return false;
      });
  };
  

  const register = () => {
    (async () => {
      setError(""); // Clear previous errors
  
      // Check if email already exists
      const emailExists = await checkEmailExists();
      if (emailExists) {
        setError("Email is already in use");
        return;
      }

       // Validate email format
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isValidEmailFormat = emailPattern.test(email);
    if (!isValidEmailFormat) {
      setError("Invalid email format");
      return;
    }

    // Check if email ends with "tup.edu.ph"
    if (!email.endsWith("tup.edu.ph")) {
      setError("Email must end with 'tup.edu.ph'");
      return;
    }
  
      // Validate form fields
      if (
        email === "" ||
        name === "" ||
        password === "" ||
        department === "" ||
        course === "" ||
        year === ""
      ) {
        setError("Please fill in the form correctly");
        return;
      }
  
      // Register user
      let user = {
        name: name,
        email: email,
        password: password,
        department: department,
        course: course,
        year: year,
      };
      try {
        const res = await axios.post(`${baseURL}users/register`, user);
        if (res.status == 200) {
          Toast.show({
            topOffset: 60,
            type: "success",
            text1: "Registration Succeeded",
            text2: "Please Login into your account",
          });
          setTimeout(() => {
            navigation.navigate("Login");
          }, 500);
        }
      } catch (error) {
        console.error("Registration error:", error);
        Toast.show({
          position: "bottom",
          bottomOffset: 20,
          type: "error",
          text1: "Something went wrong",
          text2: "Please try again",
        });
      }
    })();
  };
  

  return (
    <ImageBackground
      source={require("../../assets/court.png")} // Update with the path to your background image
      style={{ flex: 1 }}
      resizeMode="cover"
    >
      {/* <Text style={styles.title}>REGISTRATION</Text> */}
      <KeyboardAwareScrollView
        style={{
          ...styles.FormContainer,
          backgroundColor: "rgba(255, 255, 255, 0.1)",
        }}
        viewIsInsideTabBar={true}
        extraHeight={200}
        enableOnAndroid={true}
      >
        <FormContainer>
          <Input
            placeholder={"Email"}
            name={"email"}
            id={"email"}
            onChangeText={(text) => setEmail(text.toLowerCase())}
          />
          <Input
            placeholder={"Name"}
            name={"name"}
            id={"name"}
            onChangeText={(text) => setName(text)}
          />
          <Input
            placeholder={"Password"}
            name={"password"}
            id={"password"}
            secureTextEntry={true}
            onChangeText={(text) => setPassword(text)}
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
          
          {department && (
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

<View style={styles.pickerContainer}>
            <Select
              placeholder="Select Year"
              selectedValue={year}
              onValueChange={(itemValue) => handleYearChange(itemValue)}
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


          <View style={styles.buttonGroup}>
            {error ? <Error message={error} /> : null}
          </View>
          <View>
            <EasyButton
              large
              primary
              onPress={() => register()}
              style={styles.customButtonRegister}
            >
              <Text style={{ color: "white", fontStyle: "italic" }}>
                Register
              </Text>
            </EasyButton>
          </View>
          <View>
            <EasyButton
              large
              secondary
              onPress={() => navigation.navigate("Login")}
              style={styles.customButtonLogin}
            >
              <Text style={{ color: "white", fontStyle: "italic" }}>
                Back to Login
              </Text>
            </EasyButton>
          </View>
        </FormContainer>
      </KeyboardAwareScrollView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  buttonGroup: {
    width: "80%",
    margin: 10,
    alignItems: "center",
  },

  FormContainer: {
    margin: 5,
    marginTop: 10,
    borderRadius: 20,
    borderBottomStartRadius: 56,
    backgroundColor: "white",
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
  customButtonRegister: {
    backgroundColor: "green",
    borderRadius: 10,
    elevation: 5,
  },
  customButtonLogin: {
    backgroundColor: "blue",
    borderRadius: 10,
    elevation: 5,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
    fontStyle: "italic",
    color: "black",
    position: "absolute",
    top: 20,
    left: 20,
    backgroundColor: "white",
    borderRadius: 5,
    padding: 5,
  },
});

export default Register;
