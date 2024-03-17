import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Image, Button } from "react-native";
import axios from 'axios';
import baseURL from '../../assets/common/baseUrl';
import { ScrollView } from "react-native-gesture-handler";
import { StatusBar } from 'expo-status-bar';
import { printToFileAsync } from 'expo-print';
import { shareAsync } from 'expo-sharing';


const OrderDetails = ({ route }) => {
  const { order } = route.params;

  //console.log('Order object:', order);
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
    <h3 style="text-decoration: underline; margin-top: 20px;">ONLINE GENERATED RECEIPT!</h3>
  </div>
</header>
        
        <div id="customer-details" style="margin-bottom: 20px;">
  <h3 style="margin-bottom: 10px; color: maroon;">Customer Details:</h3>
  <div style="border: 1px solid #ccc; padding: 10px; border-radius: 5px;">
    <div style="margin-bottom: 5px;"><strong>Name:</strong> ${order.customer}</div>
    <div style="margin-bottom: 5px;"><strong>Address:</strong> ${order.shippingInfo.address}, ${order.shippingInfo.city}, ${order.shippingInfo.postalCode}</div>
    <div style="margin-bottom: 5px;"><strong>Phone Number:</strong> ${order.shippingInfo.phoneNo}</div>
  </div>
  <h3 style="margin-top: 20px; margin-bottom: 10px; color: maroon;">Order Information:</h3>
  <div style="border: 1px solid #ccc; padding: 10px; border-radius: 5px;">
    <div style="margin-bottom: 5px;"><strong>Payment Status:</strong> ${order.paymentInfo.status}</div>
    <div style="margin-bottom: 5px;"><strong>Order Status:</strong> ${order.orderStatus}</div>
    <div style="margin-bottom: 5px;"><strong>Order Date:</strong> ${formatDate(order.createdAt)}</div>
    <div style="margin-bottom: 5px;"><strong>Order Reference No:</strong> ${order.id}</div>
  </div>
</div>
        </header>
        <main>
          <table>
            <thead>
              <tr>
                <th class="service">Order Items</th>
                <th>Price</th>
                <th>Quantity</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              ${order.orderItems.map(item => `
                <tr>
                  <td class="service">${item.name}</td>
                  <td class="unit">₱${item.price}</td>
                  <td class="qty">${item.quantity}</td>
                  <td class="total">₱${item.price * item.quantity}</td>
                </tr>
              `).join('')}
              <tr>
                <td colspan="4">SUBTOTAL</td>
                <td class="total">₱${order.totalPrice}</td>
              </tr>
            </tbody>
          </table>
        </main>
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
      console.error('Error generating or sharing PDF:', error);
    }
  };
  // console.log(order.screenShot.url)

  return (
    <ScrollView>
      <View style={styles.container}>

        <View style={styles.detailsContainer}>
          <Text style={styles.label}>Order Reference No:</Text>
          <Text style={styles.detailText}>{order.id}</Text>
        </View>
        <View style={styles.detailsContainer}>
          <Text style={styles.label}>Customer Information:</Text>
          <Text style={styles.detailText}>{order.customer}</Text>
        </View>
        <View style={styles.detailsContainer}>
          <Text style={styles.label}>Address:</Text>
          <Text style={styles.detailText}>{`${order.shippingInfo.address}, ${order.shippingInfo.city}, ${order.shippingInfo.postalCode}`}</Text>
        </View>
        <View style={styles.detailsContainer}>
          <Text style={styles.label}>Phone Number:</Text>
          <Text style={styles.detailText}>{order.shippingInfo.phoneNo}</Text>
        </View>
        <View style={styles.detailsContainer}>
          <Text style={styles.label}>Payment Info:</Text>
          <Text style={styles.detailText}>{order.paymentInfo.status}</Text>
        </View>
        <View style={styles.detailsContainer}>
          <Text style={styles.label}>Status:</Text>
          <Text style={styles.detailText}>{order.orderStatus}</Text>
        </View>
        <View style={styles.detailsContainer}>
          <Text style={styles.label}>Order Date:</Text>
          <Text style={styles.detailText}>{formatDate(order.createdAt)}</Text>
        </View>
        <View style={styles.totalContainer}>
          <Text style={styles.totalLabel}>Total Price:</Text>
          <Text style={styles.totalLabel2}> ₱ {order.totalPrice}</Text>
        </View>
        <Text style={styles.label}>Screenshot Documents:</Text>
        <View style={styles.imageContainer}>
          {order.screenShot.map((image, index) => (
            <Image
              key={index}
              source={{ uri: image.url }}
              style={styles.productImage}
            />
          ))}
        </View>
        <View style={styles.detailsContainer}>
          <Text style={styles.label}>Order Items:</Text>
          <View style={styles.space}>
            {order.orderItems.map((item, index) => (
              <View key={index} style={styles.orderItemContainer}>
                <Text style={styles.itemName}>{item.name}</Text>
                <Text style={styles.itemDetails}>Price: ₱{item.price}, Quantity: {item.quantity}</Text>
                <Image
                  source={{ uri: item.image }}
                  style={styles.productImage}
                />
              </View>
            ))}
          </View>
        </View>

        <Button title="Generate Receipt" onPress={generatePdf} />
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
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#333",
  },
  detailsContainer: {
    marginBottom: 15,
    backgroundColor: "#f9f9f9",
    padding: 10,
    borderRadius: 5,
  },
  label: {
    fontWeight: "bold",
    color: "#333",
    marginBottom: 5,
  },
  detailText: {
    color: "#555",
  },
  totalContainer: {
    marginTop: 15,
    backgroundColor: "#f9f9f9",
    padding: 10,
    borderRadius: 5,
  },
  totalLabel: {
    fontWeight: "bold",
    color: "red",
    fontSize: 16,
    marginBottom: 5,
  },
  totalLabel2: {
    fontWeight: "bold",
    color: "black",
    fontSize: 16,
  },
  orderItemContainer: {
    marginBottom: 20,
    backgroundColor: "#f9f9f9",
    padding: 10,
    borderRadius: 5,
  },
  itemName: {
    fontWeight: "bold",
    color: "#333",
    marginBottom: 5,
  },
  itemDetails: {
    color: "#555",
  },
  productImage: {
    width: 80,
    height: 80,
    borderRadius: 10,
    marginTop: 10,
  },

});

export default OrderDetails;
