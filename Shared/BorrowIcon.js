import React from "react";
import { StyleSheet } from "react-native";
import { Badge, Text } from "native-base";
import { useSelector } from 'react-redux';

const BorrowIcon = (props) => {
  const borrowItems = useSelector(state => state.borrowItems);

  return (
    <>
      {borrowItems.length > 0 && (
        <Badge style={styles.badge}>
          <Text style={styles.text}>{borrowItems.length}</Text>
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


export default BorrowIcon;
