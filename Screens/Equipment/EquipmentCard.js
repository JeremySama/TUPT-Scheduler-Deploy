import React from "react";
import {
  StyleSheet,
  View,
  Dimensions,
  Image,
  Text,
  Button,
  ImageBackground,
} from "react-native";
import Toast from "react-native-toast-message";

import { useDispatch } from "react-redux";
import * as actions from "../../Redux/Actions/borrowActions";

var { width } = Dimensions.get("window");

const EquipmentCard = (props) => {
  const { _id, name, images, stock, description } = props;
  const dispatch = useDispatch();
  return (
    <View style={styles.container}>
      <Image
        style={styles.image}
        resizeMode="contain"
        source={{
          uri: images.length > 0 ? images[0].url : "https://cdn.pixabay.com/photo/2012/04/01/17/29/box-23649_960_720.png",
        }}
      />
      <View style={styles.card} />
      <Text style={styles.title}>
        {name.length > 15 ? name.substring(0, 15 - 3) + "..." : name}
      </Text>
      {stock > 0 ? (
        <View style={{ marginBottom: 60 }}>
          <Button
            title={"Add To Borrow"}
            color={"#FF5F1F"}
            onPress={() => {
              dispatch(actions.addToBorrow({ ...props, quantity: 1 })),
                Toast.show({
                  topOffset: 60,
                  type: "success",
                  text1: `${name} added to Borrow`,
                  text2: "Go to your Borrow to complete Borrowing",
                });
            }}
          />
          <Text style={styles.titles}>
            Stock: {stock}
          </Text>
        </View>
      ) : (
        <Text style={{ marginTop: 20 }}>Currently Unavailable</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 150,
    height: 250,
    padding: 10,
    borderRadius: 10,
    marginTop: 25,
    marginBottom: 55,
    marginLeft: 16,
    marginRight: 10,
    alignItems: "center",
    elevation: 8,
    backgroundColor: "white",
  },
  image: {
    width: width / 2 - 20 - 10,
    height: width / 2 - 20 - 30,
    backgroundColor: "transparent",
    position: "absolute",
    top: -30,
    marginBottom: 20, // Adjusted margin for the image
  },
  card: {
    marginBottom: 10,
    height: width / 2 - 20 - 90,
    backgroundColor: "transparent",
    width: width / 2 - 20 - 10,
  },
  title: {
    fontWeight: "bold",
    fontSize: 20,
    //textAlign: "",
    marginBottom: 10, // Adjusted margin for the title
    marginTop: 15, // Adjusted margin for the title
  },
  titles: {
    fontSize: 15,
    textAlign: "center",
    marginTop: 10, // Adjusted margin for the description
  },
  price: {
    fontSize: 20,
    color: "red",
    marginTop: 10,
  },
});

export default EquipmentCard;
