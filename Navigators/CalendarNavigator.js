import React from "react"
import { createStackNavigator } from "@react-navigation/stack"
import CalendarsContainer from "../Screens/Appointment/CalendarContainer"
import SingleCalendarEvent from '../Screens/Appointment/SingleCalendarEvent'
import FormEvent from '../Screens/Admin/CalendarForm'
const Stack = createStackNavigator();
function MyStack() {
    return (
        <Stack.Navigator>
            <Stack.Screen 
                name="CalendarsContainer"
                component={CalendarsContainer}
                options={{
                    headerShown: false,
                }}
            />
            <Stack.Screen 
                name="SingleCalendarEvent"
                component={SingleCalendarEvent}
                options={{
                    title: "Calendar Event Details",
                }}
            />
            <Stack.Screen 
                name="FormEvent"
                component={FormEvent}
                options={{
                    title: "Calendar Event Form",
                }}
            />



        </Stack.Navigator>
    )
}
export default function CalendarNavigator() {
    return <MyStack />
}