import React from "react";
import { StyleSheet } from "react-native";
import { Badge, Text } from "native-base";
import { useSelector } from 'react-redux';

const CartIcon = (props) => {
  const cartItems = useSelector(state => state.cartItems);

  return (
    <>
      {cartItems.length > 0 && (
        <Badge style={styles.badge}>
          <Text style={styles.text}>{cartItems.length}</Text>
        </Badge>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  badge: {
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "red", // Background color for the badge
    width: 24, // Adjust the width of the badge
    height: 24, // Adjust the height of the badge
    borderRadius: 13, // Make the badge circular
    top: 1, // Move the badge lower
    left: 24, // Move the badge to the left
  },
  text: {
    top: -2, // Move the badge lower
    fontSize: 12,
    fontWeight: "bold",
    color: "white", // Text color for the badge
  },
});

export default CartIcon;
