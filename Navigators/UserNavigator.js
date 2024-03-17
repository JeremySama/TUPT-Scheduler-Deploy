import React, { useContext, useState, useEffect } from "react";
import { createStackNavigator } from '@react-navigation/stack'
import AuthGlobal from "../Context/Store/AuthGlobal";
import Login from "../Screens/User/Login";
import Register from "../Screens/User/Register";
import UserProfile from "../Screens/User/UserProfile";
import UserProfileForm from "../Screens/User/UserProfileForm";
import OrderDetails from "../Screens/User/OrderDetails";
import CalendarDetails from "../Screens/User/CalendarDetails";
import BorrowDetails from "../Screens/User/BorrowDetails";

const Stack = createStackNavigator();

const UserNavigator = (props) => {
    const { stateUser } = useContext(AuthGlobal);
    const isAdminOrSuperAdmin = stateUser.user.userId
    return (
        <Stack.Navigator>
            {!isAdminOrSuperAdmin ? (
            <Stack.Screen
                name="Login"
                component={Login}
                options={{
                    headerShown: false
                }}
            />
            ) : ( <Stack.Screen
                name="User Profile"
                component={UserProfile}
                options={{
                    headerShown: false
                }}
            />
                )}

            <Stack.Screen
                name="Register"
                component={Register}
                options={{
                    headerShown: false
                }}
            />

            <Stack.Screen
                name="UserProfileForm"
                component={UserProfileForm}
                options={{
                    title: "Edit Profile"
                }}
            />
            <Stack.Screen
                name="OrderDetails"
                component={OrderDetails}
                options={{
                    title: "Order Details"
                }}
            />
            <Stack.Screen
                name="CalendarDetails"
                component={CalendarDetails}
                options={{
                    title: "Calendar Details"
                }}
            />
            <Stack.Screen
                name="BorrowDetails"
                component={BorrowDetails}
                options={{
                    title: "Borrow Details"
                }}
            />
        </Stack.Navigator>
    )

}

export default UserNavigator;