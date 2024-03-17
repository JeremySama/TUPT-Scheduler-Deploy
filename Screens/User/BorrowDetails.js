import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Image, Button } from "react-native";
import axios from 'axios';
import baseURL from '../../assets/common/baseUrl';
import { ScrollView } from "react-native-gesture-handler";
import { StatusBar } from 'expo-status-bar';
import { printToFileAsync } from 'expo-print';
import { shareAsync } from 'expo-sharing';

const BorrowDetails = ({ route }) => {
  const { borrow } = route.params;
  //console.log('Borrow object:', borrow);
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

  const generateHTML = () => {
    return `
      <html>
        <head>
          <meta charset="utf-8">
          <title>Borrow Details</title>
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
            #logo {
              float: left;
              margin-right: 20px;
            }
            #logo img {
              max-width: 60px; /* Adjust the max-width as needed */
              height: auto;
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
            footer {
              margin-top: 20px;
              text-align: center;
              font-size: 0.8em;
            }
          </style>
        </head>
        <body>
          <header>
  <div style="text-align: center; margin-bottom: 20px;">
    <img src="https://res.cloudinary.com/dt49xskmp/image/upload/v1707134383/eqoxekugng6gidftcv1v.png" style="max-width: 100px; height: auto;" alt="Logo">
    <h2 style="margin-top: 10px; color: maroon; font-family: Arial, sans-serif;">TECHNOLOGICAL UNIVERSITY OF THE PHILIPPINES TAGUIG CITY</h2>
    <p style="font-size: 12px; margin-top: 10px;">The Technological University of the Philippines shall be a premier state university with recognized excellence in engineering and technology education at par with the leading universities in the ASEAN region.</p>
    <h3 style="text-decoration: underline; margin-top: 20px;">BORROWING SLIP</h3>
  </div>
</header>
         <main>
  <div style="margin-bottom: 20px;">
    <p><strong>Borrower's Name:</strong> ${borrow.user}</p>
    <p><strong>Reason for Borrow:</strong> ${borrow.borrowingInfo.reason_borrow}</p>
    <p><strong>Date Borrow:</strong> ${formatDate(borrow.borrowingInfo.date_borrow)}</p>
    <p><strong>Date Return:</strong> ${formatDate(borrow.date_return)}</p>
    <h4 style="color: maroon;">ITEM STATUS REPORTS</h4>
    <p><strong>Issue:</strong> ${borrow.issue}</p>
    <p><strong>Status:</strong> ${borrow.status}</p>
    <p><strong>Reason of Denied:</strong> ${borrow.reason_status}</p>
  </div>
  <div>
    <h2 style="color: maroon; margin-bottom: 10px;">Borrow Items</h2>
    <table style="width: 100%; border-collapse: collapse;">
      <thead>
        <tr style="background-color: #f0f0f0;">
          <th style="padding: 10px; border: 1px solid #ddd;">Item Name</th>
          <th style="padding: 10px; border: 1px solid #ddd;">Quantity</th>
        </tr>
      </thead>
      <tbody>
        ${borrow.borrowItems.map(item => `
          <tr>
            <td style="padding: 10px; border: 1px solid #ddd;">${item.name}</td>
            <td style="padding: 10px; border: 1px solid #ddd;">${item.quantity}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  </div>
</main>
          <footer>
            Borrow details created on a computer.
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
      console.error('Error generating or sharing PDF:', error);
    }
  };


  return (
    <ScrollView>
      <View style={styles.container}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Borrower's Information</Text>
          <View style={styles.detailContainer}>
            <Text style={styles.label}>Name:</Text>
            <Text>{borrow.user}</Text>
          </View>
          <View style={styles.detailContainer}>
            <Text style={styles.label}>Reason for Borrow:</Text>
            <Text>{borrow.borrowingInfo.reason_borrow}</Text>
          </View>
          <View style={styles.detailContainer}>
            <Text style={styles.label}>Date Borrowed:</Text>
            <Text>{formatDate(borrow.borrowingInfo.date_borrow)}</Text>
          </View>
          <View style={styles.detailContainer}>
            <Text style={styles.label}>Date Return:</Text>
            <Text>{formatDate(borrow.date_return)}</Text>
          </View>
          <View style={styles.detailContainer}>
            <Text style={styles.label}>Issue:</Text>
            <Text>{borrow.issue}</Text>
          </View>
          <View style={styles.detailContainer}>
            <Text style={styles.label}>Status:</Text>
            <Text>{borrow.status}</Text>
          </View>
          <View style={styles.detailContainer}>
            <Text style={styles.label}>Reason of Denial:</Text>
            <Text>{borrow.reason_status}</Text>
          </View>
        </View>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Borrow Items</Text>
          {borrow.borrowItems.map((item, index) => (
            <View key={index} style={styles.borrowItem}>
              <Image source={{ uri: item.image }} style={styles.itemImage} />
              <View style={styles.itemDetails}>
                <Text style={styles.label}>{item.name}</Text>
                <Text>Quantity: {item.quantity}</Text>
              </View>
            </View>
          ))}
        </View>
        <Button title="Generate Borrowing Slip" onPress={generatePdf} />
      </View>

      <StatusBar style="auto" />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f0f0f0",
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    color: "maroon",
  },
  detailContainer: {
    marginBottom: 10,
  },
  label: {
    fontWeight: "bold",
    color: "#333",
  },
  borrowItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  itemImage: {
    width: 80,
    height: 80,
    borderRadius: 10,
    marginRight: 10,
  },
  itemDetails: {
    flex: 1,
  },
});

export default BorrowDetails;
