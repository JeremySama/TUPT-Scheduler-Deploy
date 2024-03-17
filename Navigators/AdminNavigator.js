import React from "react"
import { createStackNavigator } from "@react-navigation/stack"
import Orders from "../Screens/Admin/Orders"
import Borrows from "../Screens/Admin/Borrows"
import Products from "../Screens/Admin/Products"
import Equipments from "../Screens/Admin/Equipments"
import EquipmentForm from "../Screens/Admin/EquipmentForm"
import ProductForm from "../Screens/Admin/ProductForm"
import Categories from "../Screens/Admin/Categories"
import Calendars from "../Screens/Admin/Calendars"
import CalendarForm from "../Screens/Admin/CalendarForm"
import CalendarFormUpdate from "../Screens/Admin/CalendarFormUpdate"
import SingleCalendarEvent from '../Screens/Appointment/SingleCalendarEvent'
import Locations from '../Screens/Admin/Locations'
import Sports from '../Screens/Admin/Sports'
import Users from '../Screens/Admin/Users'
import UpdateUserStatus from "../Screens/Admin/UpdateUserStatus"
import CalendarsContainer from "../Screens/Appointment/CalendarContainer"
import SingleEquipment from '../Screens/Equipment/SingleEquipment'
import CalendarLogs from '../Screens/Admin/CalendarLogs'
import EquipmentLogs from '../Screens/Admin/EquipmentLogs'
import EquipmentStockLogs from '../Screens/Admin/EquipmentStockLogs'
import EquipmentStockForm from '../Screens/Admin/EquipmentStockForm'
import ProductStockLogs from '../Screens/Admin/ProductStockLogs'
import ProductFormStock from '../Screens/Admin/ProductFormStock'
import OrderHistory from '../Screens/Admin/OrderHistory'
import BorrowHistory from '../Screens/Admin/BorrowHistory'

const Stack = createStackNavigator();

function MyStack() {
    return (
        <Stack.Navigator>
            <Stack.Screen
                name="Products"
                component={Products}
                options={{
                    title: 'Product List',
                    headerTitleStyle: {
                        color: 'white',
                        textTransform: 'uppercase',
                        fontWeight: 'bold',

                    },
                    headerStyle: {
                        backgroundColor: "maroon", // Set your desired background color
                        height: 50, // Adjust the height of the header as needed

                    },
                }}

            />
            <Stack.Screen
                name="Equipments"
                component={Equipments}
                options={{
                    title: 'Equipment list',
                    headerTitleStyle: {
                        color: 'white',
                        textTransform: 'uppercase',
                        fontWeight: 'bold',

                    },
                    headerStyle: {
                        backgroundColor: "maroon", // Set your desired background color
                        height: 50, // Adjust the height of the header as needed

                    },
                }}

            />
            <Stack.Screen
                name="CalendarLogs"
                component={CalendarLogs}
                options={{
                    title: 'Calendar Logs',
                    headerTitleStyle: {
                        color: 'white',
                        textTransform: 'uppercase',
                        fontWeight: 'bold',

                    },
                    headerStyle: {
                        backgroundColor: "maroon", // Set your desired background color
                        height: 50, // Adjust the height of the header as needed

                    },
                }}

            />
            <Stack.Screen
                name="EquipmentLogs"
                component={EquipmentLogs}
                options={{
                    title: 'Equipment Logs',
                    headerTitleStyle: {
                        color: 'white',
                        textTransform: 'uppercase',
                        fontWeight: 'bold',

                    },
                    headerStyle: {
                        backgroundColor: "maroon", // Set your desired background color
                        height: 50, // Adjust the height of the header as needed

                    },
                }}
            />
            <Stack.Screen
                name="EquipmentStockForm"
                component={EquipmentStockForm}
                options={{
                    title: 'Equipment Stock Form',
                    headerTitleStyle: {
                        color: 'white',
                        textTransform: 'uppercase',
                        fontWeight: 'bold',

                    },
                    headerStyle: {
                        backgroundColor: "maroon", // Set your desired background color
                        height: 50, // Adjust the height of the header as needed

                    },
                }}
            />
            <Stack.Screen
                name="ProductFormStock"
                component={ProductFormStock}
                options={{
                    title: 'Product Stock Form',
                    headerTitleStyle: {
                        color: 'white',
                        textTransform: 'uppercase',
                        fontWeight: 'bold',

                    },
                    headerStyle: {
                        backgroundColor: "maroon", // Set your desired background color
                        height: 50, // Adjust the height of the header as needed

                    },
                }}
            />
            <Stack.Screen
                name="EquipmentStockLogs"
                component={EquipmentStockLogs}
                options={{
                    title: 'Equipment Stock Logs',
                    headerTitleStyle: {
                        color: 'white',
                        textTransform: 'uppercase',
                        fontWeight: 'bold',

                    },
                    headerStyle: {
                        backgroundColor: "maroon", // Set your desired background color
                        height: 50, // Adjust the height of the header as needed

                    },
                }}
            />
            <Stack.Screen
                name="OrderHistory"
                component={OrderHistory}
                options={{
                    title: 'Order History',
                    headerTitleStyle: {
                        color: 'white',
                        textTransform: 'uppercase',
                        fontWeight: 'bold',

                    },
                    headerStyle: {
                        backgroundColor: "maroon", // Set your desired background color
                        height: 50, // Adjust the height of the header as needed

                    },
                }}
            />
            <Stack.Screen
                name="BorrowHistory"
                component={BorrowHistory}
                options={{
                    title: 'Borrow History',
                    headerTitleStyle: {
                        color: 'white',
                        textTransform: 'uppercase',
                        fontWeight: 'bold',

                    },
                    headerStyle: {
                        backgroundColor: "maroon", // Set your desired background color
                        height: 50, // Adjust the height of the header as needed

                    },
                }}
            />
            <Stack.Screen
                name="ProductStockLogs"
                component={ProductStockLogs}
                options={{
                    title: 'Product Stock Logs',
                    headerTitleStyle: {
                        color: 'white',
                        textTransform: 'uppercase',
                        fontWeight: 'bold',

                    },
                    headerStyle: {
                        backgroundColor: "maroon", // Set your desired background color
                        height: 50, // Adjust the height of the header as needed

                    },
                }}
            />
            <Stack.Screen
                name="Calendars"
                component={Calendars}
                options={{
                    title: 'EVENT LIST',
                    headerTitleStyle: {
                        color: 'white',
                        textTransform: 'uppercase',
                        fontWeight: 'bold',

                    },
                    headerStyle: {
                        backgroundColor: "maroon", // Set your desired background color
                        height: 50, // Adjust the height of the header as needed

                    },
                }}
            />
            <Stack.Screen
                name="Users"
                component={Users}
                options={{
                    title: 'USERS LIST',
                    headerTitleStyle: {
                        color: 'white',
                        textTransform: 'uppercase',
                        fontWeight: 'bold',

                    },
                    headerStyle: {
                        backgroundColor: "maroon", // Set your desired background color
                        height: 50, // Adjust the height of the header as needed

                    },
                }}
            />
            <Stack.Screen
                name="CalendarForm"
                component={CalendarForm}
                options={{
                    title: 'CALENDAR FORM',
                    headerTitleStyle: {
                        color: 'white',
                        textTransform: 'uppercase',
                        fontWeight: 'bold',

                    },
                    headerStyle: {
                        backgroundColor: "maroon", // Set your desired background color
                        height: 50, // Adjust the height of the header as needed

                    },
                }}
            />
            <Stack.Screen
                name="CalendarFormUpdate"
                component={CalendarFormUpdate}
                options={{
                    title: 'CALENDAR FORM',
                    headerTitleStyle: {
                        color: 'white',
                        textTransform: 'uppercase',
                        fontWeight: 'bold',

                    },
                    headerStyle: {
                        backgroundColor: "maroon", // Set your desired background color
                        height: 50, // Adjust the height of the header as needed

                    },
                }}
            />
            <Stack.Screen
                name="UpdateUserStatus"
                component={UpdateUserStatus}
                options={{
                    title: 'UPDATE USER STATUS',
                    headerTitleStyle: {
                        color: 'white',
                        textTransform: 'uppercase',
                        fontWeight: 'bold',

                    },
                    headerStyle: {
                        backgroundColor: "maroon", // Set your desired background color
                        height: 50, // Adjust the height of the header as needed

                    },
                }}
            />
            <Stack.Screen
                name="SingleCalendarEvent"
                component={SingleCalendarEvent}
                options={{
                    title: 'EVENT DETAILS',
                    headerTitleStyle: {
                        color: 'white',
                        textTransform: 'uppercase',
                        fontWeight: 'bold',

                    },
                    headerStyle: {
                        backgroundColor: "maroon", // Set your desired background color
                        height: 50, // Adjust the height of the header as needed

                    },
                }}
            />
            <Stack.Screen name="Categories" component={Categories}
                options={{
                    title: 'CATEGORIES',
                    headerTitleStyle: {
                        color: 'white',
                        textTransform: 'uppercase',
                        fontWeight: 'bold',

                    },
                    headerStyle: {
                        backgroundColor: "maroon", // Set your desired background color
                        height: 50, // Adjust the height of the header as needed

                    },
                }} />
            <Stack.Screen name="Orders" component={Orders}

                options={{
                    title: 'ORDER LIST',
                    headerTitleStyle: {
                        color: 'white',
                        textTransform: 'uppercase',
                        fontWeight: 'bold',

                    },
                    headerStyle: {
                        backgroundColor: "maroon", // Set your desired background color
                        height: 50, // Adjust the height of the header as needed

                    },
                }} />
            <Stack.Screen name="Borrows" component={Borrows} options={{
                title: 'BORROWING LIST',
                headerTitleStyle: {
                    color: 'white',
                    textTransform: 'uppercase',
                    fontWeight: 'bold',

                },
                headerStyle: {
                    backgroundColor: "maroon", // Set your desired background color
                    height: 50, // Adjust the height of the header as needed

                },
            }} />
            <Stack.Screen name="EquipmentForm" component={EquipmentForm} options={{
                title: 'EQUIPMENT FORM',
                headerTitleStyle: {
                    color: 'white',
                    textTransform: 'uppercase',
                    fontWeight: 'bold',

                },
                headerStyle: {
                    backgroundColor: "maroon", // Set your desired background color
                    height: 50, // Adjust the height of the header as needed

                },
            }}
            />
            <Stack.Screen name="ProductForm" component={ProductForm} options={{
                title: 'MERCHANDISE FORM',
                headerTitleStyle: {
                    color: 'white',
                    textTransform: 'uppercase',
                    fontWeight: 'bold',

                },
                headerStyle: {
                    backgroundColor: "maroon", // Set your desired background color
                    height: 50, // Adjust the height of the header as needed

                },
            }} />
            <Stack.Screen name="Locations" component={Locations} options={{
                title: 'LOCATION',
                headerTitleStyle: {
                    color: 'white',
                    textTransform: 'uppercase',
                    fontWeight: 'bold',

                },
                headerStyle: {
                    backgroundColor: "maroon", // Set your desired background color
                    height: 50, // Adjust the height of the header as needed

                },
            }} />
            <Stack.Screen name="Sports" component={Sports} options={{
                title: 'SPORTS',
                headerTitleStyle: {
                    color: 'white',
                    textTransform: 'uppercase',
                    fontWeight: 'bold',

                },
                headerStyle: {
                    backgroundColor: "maroon", // Set your desired background color
                    height: 50, // Adjust the height of the header as needed

                },
            }} />
            <Stack.Screen
                name="CalendarsContainer"
                component={CalendarsContainer}
                options={{
                    headerShown: false,
                }}
            />
            <Stack.Screen
                name='Equipment Detail'
                component={SingleEquipment}
                options={{
                    title: 'EQUIPMENT DETAIL',
                    headerTitleStyle: {
                        color: 'white',
                        textTransform: 'uppercase',
                        fontWeight: 'bold',

                    },
                    headerStyle: {
                        backgroundColor: "maroon", // Set your desired background color
                        height: 50, // Adjust the height of the header as needed

                    },
                }}

            />
        </Stack.Navigator>

    )
}
export default function AdminNavigator() {
    return <MyStack />
}