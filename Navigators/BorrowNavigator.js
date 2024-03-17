import React from "react";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";

// Screens
import BorrowCheckout from "../Screens/Borrow/Checkout/Checkout";
import Confirm from "../Screens/Borrow/Checkout/Confirm";

const Tab = createMaterialTopTabNavigator();

function MyTabs() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="BorrowCheckout" component={BorrowCheckout}  options={{
          title: "Borrow Details",
        }}/>
      <Tab.Screen
        name="ConfirmBorrow"
        component={Confirm}
        options={{
          title: "Confirm Borrow",
        }}
      />
    </Tab.Navigator>
  );
}

export default function BorrowNavigator() {
  return <MyTabs />;
}
