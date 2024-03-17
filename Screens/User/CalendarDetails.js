import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Clipboard,
  Button,
} from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { StatusBar } from "expo-status-bar";
import { printToFileAsync } from "expo-print";
import { shareAsync } from "expo-sharing";

const CalendarDetails = ({ route }) => {
  const { calendar } = route.params;
  const [copied, setCopied] = useState(false);
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

  const handleCopyToClipboard = () => {
    Clipboard.setString(calendar.key);
    setCopied(true);
  };

  const generateHTML = () => {
    return `
      <html>
        <head>
          <meta charset="utf-8">
          <title>Calendar Details</title>
          <style>
            /* Define your CSS styles here */
          </style>
        </head>
        <body>
         <header>
  <div style="text-align: center; margin-bottom: 20px;">
    <img src="https://res.cloudinary.com/dt49xskmp/image/upload/v1707134383/eqoxekugng6gidftcv1v.png" style="max-width: 100px; height: auto;" alt="Logo">
    <h2 style="margin-top: 10px; color: maroon; font-family: Arial, sans-serif;">TECHNOLOGICAL UNIVERSITY OF THE PHILIPPINES TAGUIG CITY</h2>
    <p style="font-size: 12px; margin-top: 10px;">The Technological University of the Philippines shall be a premier state university with recognized excellence in engineering and technology education at par with the leading universities in the ASEAN region.</p>
    <h3 style="text-decoration: underline; margin-top: 20px;">EVENT DETAILS</h3>
  </div>
</header>
  <main>
  <table style="width: 100%; border-collapse: collapse;">
    <tr style="border-bottom: 1px solid #ddd;">
      <td style="padding: 8px;"><strong>Title:</strong>${calendar.title}</td>
      
    </tr>
    <tr style="border-bottom: 1px solid #ddd;">
      <td style="padding: 8px;"><strong>Purpose:</strong>${
        calendar.description
      }</td>
     
    </tr>
    <tr style="border-bottom: 1px solid #ddd;">
      <td rowspan="2" style="padding: 8px;"><strong>Location:</strong>${
        calendar.location
      }</td>
     
    </tr>
    <tr style="border-bottom: 1px solid #ddd;">
      <td style="padding: 8px;"><strong>Status:</strong> ${calendar.status}</td>
    </tr>
    <tr style="border-bottom: 1px solid #ddd;">
      <td style="padding: 8px;"><strong>Attendees:</strong></td>
      <td style="padding: 8px;">${calendar.attendees.join(", ")}</td>
    </tr>
    <tr style="border-bottom: 1px solid #ddd;">
      <td style="padding: 8px;"><strong>Reason of Denial:</strong>${
        calendar.reason
      }</td>
      
    </tr>
    <tr style="border-bottom: 1px solid #ddd; border-right: 1px solid #ddd;">
      <td rowspan="2" style="padding: 8px;"><strong>Start Time Date:</strong>${formatDate(
        calendar.timeStart
      )}</td>
     
    </tr>
    <tr>
      <td style="padding: 8px;"><strong>End Time Date:</strong> ${formatDate(
        calendar.timeEnd
      )}</td>
    </tr>
  </table>
</main>
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
    <ScrollView>
      <View style={styles.container}>
        <View style={styles.tableContainer}>
          <View style={styles.tableRow}>
            <View style={styles.tableColumn}>
              <Text style={styles.label}>Title:</Text>
              <Text>{calendar.title}</Text>
            </View>
          </View>
          <View style={styles.tableRow}>
            <View style={styles.tableColumn}>
              <Text style={styles.label}>Purpose:</Text>
              <Text>{calendar.description}</Text>
            </View>
          </View>
          <View style={styles.tableRow}>
            <View style={styles.tableColumn}>
              <Text style={styles.label}>Location:</Text>
              <Text>{calendar.location}</Text>
            </View>
            <View style={styles.tableColumn}>
              <Text style={styles.label}>Status:</Text>
              <Text>{calendar.status}</Text>
            </View>
          </View>
          <View style={styles.tableRow}>
            <View style={styles.tableColumn}>
              <Text style={styles.label}>Attendees:</Text>
              {calendar.attendees.map((attendee, index) => (
                <Text key={index}>{attendee}</Text>
              ))}
            </View>
          </View>
          <View style={styles.tableRow}>
            <View style={styles.tableColumn}>
              <Text style={styles.label}>Reason of Denial:</Text>
              <Text>{calendar.reason}</Text>
            </View>
          </View>
          <View style={styles.tableRow}>
            <View style={styles.tableColumn}>
              <Text style={styles.label}>Start Time Date:</Text>
              <Text>{formatDate(calendar.timeStart)}</Text>
            </View>
            <View style={styles.tableColumn}>
              <Text style={styles.label}>End Time Date:</Text>
              <Text>{formatDate(calendar.timeEnd)}</Text>
            </View>
          </View>
        </View>
        <Text style={styles.label}>Screenshot Documents:</Text>
        <View style={styles.imageContainer}>
          {calendar.screenShot.map((image, index) => (
            <Image
              key={index}
              source={{ uri: image.url }}
              style={styles.productImage}
            />
          ))}
        </View>

        <View style={styles.detailsContainer}>
          <Text style={styles.label}>Generated Key:</Text>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Text style={styles.text}>{calendar.key}</Text>
            <TouchableOpacity onPress={handleCopyToClipboard}>
              <Image
                source={require("../../assets/copy.png")}
                style={{ width: 20, height: 20, marginLeft: 5 }}
              />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.detailsContainer}>
          <Text style={styles.label}>Date Created:</Text>
          <Text>{formatDate(calendar.createdAt)}</Text>
        </View>

        <Button title="Generate PDF" onPress={generatePdf} />
        <StatusBar style="auto" />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f0f0f0",
  },
  tableContainer: {
    marginBottom: 15,
  },
  tableRow: {
    flexDirection: "row",
    marginBottom: 10,
  },
  tableColumn: {
    flex: 1,
    marginRight: 10,
  },
  label: {
    fontWeight: "bold",
  },
  text: {
    color: "#333",
  },
  detailsContainer: {
    marginBottom: 15,
  },
  productImage: {
    width: 80,
    height: 80,
    borderRadius: 10,
    marginTop: 10,
  },
});

export default CalendarDetails;
