import React, { useState, useEffect, useCallback, useContext } from "react";
import { useFocusEffect } from "@react-navigation/native";
import {
  View,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  Dimensions,
  Text,
} from "react-native";
import { Container, Input, VStack, Center, Toast } from "native-base";
import Icon from "react-native-vector-icons/FontAwesome";
import CalendarList from "./CalendarList";
import SearchedCalendar from "./SearchedCalendar";
import Banner from "../../Shared/Banner";
import baseURL from "../../assets/common/baseUrl";
import axios from "axios";
import EasyButton from "../../Shared/StyledComponents/EasyButtons";
import Icons from "react-native-vector-icons/FontAwesome";
import { useNavigation } from "@react-navigation/native";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import AuthGlobal from "../../Context/Store/AuthGlobal";
import { LinearGradient } from "expo-linear-gradient";
var { height } = Dimensions.get("window");
import { StatusBar } from "expo-status-bar";
import { printToFileAsync } from "expo-print";
import { shareAsync } from "expo-sharing";

const CalendarContainer = () => {
  const [calendars, setCalendars] = useState([]);
  const [calendarsFiltered, setCalendarsFiltered] = useState([]);
  const [focus, setFocus] = useState([]);
  const [initialState, setInitialState] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(null);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const navigation = useNavigation();
  const context = useContext(AuthGlobal);
  const searchCalendar = (text) => {
    setCalendarsFiltered(
      calendars.filter((i) =>
        i.title.toLowerCase().includes(text.toLowerCase())
      )
    );
  };
  const formDatas = () => {
    if (context.stateUser.user.userId) {
      navigation.navigate("FormEvent");
    } else {
      navigation.navigate("User", { screen: "Login" });
      Toast.show({
        topOffset: 60,
        type: "error",
        text1: "Please Login to proceed",
        text2: "",
      });
    }
  };
  const openList = () => {
    setFocus(true);
  };

  const onBlur = () => {
    setFocus(false);
  };

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (date) => {
    hideDatePicker();
    setSelectedDate(date);
  };

  const resetAndFetchAllCalendars = () => {
    setSelectedDate(null);

    // Fetch all calendars again
    axios
      .get(`${baseURL}appointments`)
      .then((res) => {
        setCalendars(res.data);
        setCalendarsFiltered(
          res.data.filter(
            (calendar) =>
              calendar.status === "Approved" || calendar.status === "PE Class"
          )
        );
        setLoading(false);
      })
      .catch((error) => {
        console.log("API call error", error);
      });
  };

  useFocusEffect(
    useCallback(() => {
      setFocus(false);

      // Calendars
      axios
        .get(`${baseURL}appointments`)
        .then((res) => {
          setCalendars(res.data);
          setCalendarsFiltered(
            res.data.filter(
              (calendar) =>
                calendar.status === "Approved" || calendar.status === "PE Class"
            )
          );
          setInitialState(res.data);
          setLoading(false);
        })
        .catch((error) => {
          console.log("API call error");
        });

      return () => {
        setCalendars([]);
        setCalendarsFiltered([]);
        setFocus();
        setInitialState();
      };
    }, [])
  );

  useEffect(() => {
    if (selectedDate) {
      const formattedDate = new Date(selectedDate);
      formattedDate.setHours(0, 0, 0, 0); // Normalize time to midnight

      const filteredCalendars = calendars.filter((calendar) => {
        const calendarDate = new Date(calendar.startDateTime);
        calendarDate.setHours(0, 0, 0, 0); // Normalize time to midnight

        return (
          calendarDate.getTime() === formattedDate.getTime() &&
          (calendar.status === "Approved" || calendar.status === "PE Class")
        );
      });
      setCalendarsFiltered(filteredCalendars);
    } else {
      const approvedCalendars = calendars.filter(
        (calendar) =>
          calendar.status === "Approved" || calendar.status === "PE Class"
      );
      setCalendarsFiltered(approvedCalendars);
    }
  }, [selectedDate, calendars]);

  const generateHTML = () => {
    return `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="utf-8">
        <title>Order Details</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
          }
          header {
            text-align: left;
            margin-bottom: 20px;
          }
          #company, #project {
            float: left;
            width: 50%;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
          }
          table, th, td {
            border: 1px solid #333;
          }
          th, td {
            padding: 10px;
            text-align: left;
          }
          #notices {
            padding-left: 6px;
            border-left: 6px solid #333;
          }
          #notices .notice {
            font-size: 1.2em;
          }
          footer {
            margin-top: 20px;
            text-align: center;
            font-size: 0.8em;
          }
          #logo {
            float: left;
            margin-right: 20px;
          }
          #logo img {
            max-width: 60px; /* Adjust the max-width as needed */
            height: auto;
          }
         
        </style>
      </head>
      <body>
    <header>
  <div style="text-align: center; margin-bottom: 20px;">
    <img src="https://res.cloudinary.com/dt49xskmp/image/upload/v1707134383/eqoxekugng6gidftcv1v.png" style="max-width: 100px; height: auto;" alt="Logo">
    <h2 style="margin-top: 10px; color: maroon; font-family: Arial, sans-serif;">TECHNOLOGICAL UNIVERSITY OF THE PHILIPPINES TAGUIG CITY</h2>
    <p style="font-size: 12px; margin-top: 10px;">The Technological University of the Philippines shall be a premier state university with recognized excellence in engineering and technology education at par with the leading universities in the ASEAN region.</p>
    <h3 style="text-decoration: underline; margin-top: 20px;">Appointment Waiver</h3>
  </div>
</header>
        
<div className="center-div" style={{ marginBottom: "150px" }}>
<div className="wrapper my-12 col-12" style={{ borderStyle: "solid", borderColor: "black", borderWidth: "4px" }}>
    <div className="letter ">
        <h6
            className="card-title"
            style={{
                fontFamily: "sans-serif",
                textAlign: "center",
                marginBottom: "10px",
                margin: "20px",
                backgroundColor: "maroon",
                color: "white",
                padding: "20px",
            }}
        >
            
            TECHNOLOGICAL UNIVERSITY OF THE PHILIPPINES TAGUIG CITY
            <p style={{ fontSize: "16px", marginTop: "14px", padding: "20px" }}>
                The Technological University of the Philippines shall be premier
                state university and the model of excellence in technology
                education in the country in a knowledge-based economy of the 21st
                century.
            </p>
            <h4
                className="my-4 text-center"
                style={{ textDecoration: "underline" }}
            >
                Waiver
            </h4>
        </h6>

        <div className=" " style={{ padding: "40px" }}>
            <p>{waiverText}</p>
            <p>
                By signing below, you acknowledge that you have read, understood,
                and agreed to the terms and conditions outlined in this waiver.
            </p>

        </div>
    </div>
</div>
</div>
        </header>
        <footer>
          Invoice was created on a computer and is valid without the signature and seal.
        </footer>
      </body>
    </html>
    `;
  };

  const generatePdf = async () => {
    try {
      const htmlContent = generateHTML();
      const file = await printToFileAsync({
        html: htmlContent,
        base64: false,
      });

      await shareAsync(file.uri);
    } catch (error) {
      console.error("Error generating or sharing PDF:", error);
    }
  };

  return (
    <>
      {loading === false ? (
        <Center>
          <LinearGradient colors={["white", "white"]}>
            <VStack
              w="97%"
              space={6}
              alignSelf="center"
              style={{ marginTop: 15 }}
            >
              <Input
                onFocus={openList}
                onChangeText={(text) => searchCalendar(text)}
                placeholder="SEARCH EVENTS HERE"
                backgroundColor="white"
                variant="filled"
                width="100%"
                borderRadius="5"
                py="1"
                px="2"
                borderColor="black"
                InputLeftElement={
                  <Icon
                  name="search"
                  style={{ position: "relative" }}
                  color="black"
                  size={30}
                />
                }
                InputRightElement={
                  focus === true ? (
                    <Icon
                  name="search"
                  style={{ position: "relative" }}
                  color="black"
                  size={30}
                />
                  ) : null
                }
              />
            </VStack>
            <View style={styles.buttonContainer}>
            <ScrollView horizontal={true}>
            <EasyButton
                secondary
                medium
                onPress={generatePdf}
                style={{ backgroundColor: "blue", elevation: 12 }}
              >
                <Icons name="plus" size={15} color="white" />
                <Text style={styles.buttonText}>Print</Text>
              </EasyButton>
            <StatusBar style="auto" />
              <EasyButton
                secondary
                medium
                onPress={() => formDatas()}
                style={{ backgroundColor: "blue", elevation: 12 }}
              >
                <Icons name="plus" size={15} color="white" />
                <Text style={styles.buttonText}>Add Event</Text>
              </EasyButton>

              <View style={styles.buttonSpacer} />

              <EasyButton
                secondary
                medium
                onPress={showDatePicker}
                style={{ backgroundColor: "blue", elevation: 12 }}
              >
                <Icons name="calendar" size={15} color="white" />
                <Text style={styles.buttonText}>Pick a Date</Text>
              </EasyButton>

              <View style={styles.buttonSpacer} />

              <EasyButton
                secondary
                medium
                onPress={resetAndFetchAllCalendars}
                style={{ backgroundColor: "blue", elevation: 12 }}
              >
                <Icons name="refresh" size={15} color="white" />
                <Text style={styles.buttonText}>Refresh</Text>
              </EasyButton>
              </ScrollView>
            </View>
          </LinearGradient>
          {focus === true ? (
            <SearchedCalendar calendarsFiltered={calendarsFiltered} />
          ) : (
            <ScrollView style={{ marginBottom: 60 }}>
              <View>
                <Banner />
              </View>
              {calendarsFiltered.length > 0 ? (
                <View style={styles.listContainer}>
                  {calendarsFiltered.map((item) => {
                    return <CalendarList key={item._id.$oid} item={item} />;
                  })}
                </View>
              ) : (
                <View
                  style={[
                    styles.center,
                    { height: height / 2, backgroundColor: "white" },
                  ]}
                >
                  <Text>No calendars found</Text>
                </View>
              )}
            </ScrollView>
          )}
          <DateTimePickerModal
            isVisible={isDatePickerVisible}
            mode="date"
            onConfirm={handleConfirm}
            onCancel={hideDatePicker}
          />
        </Center>
      ) : (
        <Container style={[styles.center, { backgroundColor: "#f2f2f2" }]}>
          <ActivityIndicator size="large" color="red" />
        </Container>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flexWrap: "wrap",
    backgroundColor: "gainsboro",
  },
  listContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "flex-start",
    flexWrap: "wrap",
    backgroundColor: "gainsboro",
  },
  center: {
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 10,
  },
  buttonSpacer: {
    width: 1, // Adjust the spacing between buttons as needed
  },
  buttonText: {
    color: "white",
    marginLeft: 5, // Adjust the spacing between icon and text as needed
    fontStyle: "italic",
    textTransform: "uppercase",
    fontSize: 12,
  },
  Reset: {
    backgroundColor: "blue",
    borderRadius: 10,
    elevation: 5,
  },
  DatePicker: {},
  Reset: {},
});

export default CalendarContainer;
