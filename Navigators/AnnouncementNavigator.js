import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { Ionicons } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native";
import Announcements from "../Screens/Announcement/AnnouncementContainer";
import AnnouncementForm from "../Screens/Announcement/AnnouncementForm";

const Stack = createStackNavigator();

function MyStack({ navigation }) {
    return (
        <Stack.Navigator
            screenOptions={{
                headerStyle: {
                    backgroundColor: "maroon", // Set your desired background color
                },
                headerTintColor: "#fff", // Set the text color in the header
                headerTitleAlign: "center",
                headerTitleStyle: {
                    fontWeight: "bold",
                },
            }}
        >
            <Stack.Screen
                name="Announcements"
                component={Announcements}
                options={{
                    title: "Announcements",
                    
                }}
            />
            <Stack.Screen
                name="AnnouncementForm"
                component={AnnouncementForm}
                options={{
                    title: "Add Announcements",
                }}
            />
        </Stack.Navigator>
    );
}

export default function AnnouncementNavigator() {
    return <MyStack />;
}
