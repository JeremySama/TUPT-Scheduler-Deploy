import React from 'react'
import { createStackNavigator } from "@react-navigation/stack"
import EquipmentContainer from '../Screens/Equipment/EquipmentContainer'
import SingleEquipment from '../Screens/Equipment/SingleEquipment'
const Stack = createStackNavigator()
function MyStack() {
    return (

        <Stack.Navigator>
            <Stack.Screen
                name='Equipments'
                component={EquipmentContainer}
                options={{
                    headerShown: false,

                }}
            />
            <Stack.Screen
                name='Equipment Detail'
                component={SingleEquipment}
                options={{
                    title: 'Equipment Details',
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

export default function EquipmentNavigator() {
    return <MyStack />;
}