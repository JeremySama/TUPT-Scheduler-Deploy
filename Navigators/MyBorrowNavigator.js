import React from 'react'
import { createStackNavigator } from "@react-navigation/stack"

import Borrow from '../Screens/Borrow/Borrow';
import BorrowNavigator from './BorrowNavigator';

const Stack = createStackNavigator();

function MyStack() {
    return(
        <Stack.Navigator>
            <Stack.Screen 
                name="Borrow"
                component={Borrow}
                options={{
                    headerShown: false
                }}
            />
            <Stack.Screen 
                name="BorrowCheckout"
                component={BorrowNavigator}
                options={{
                    title: 'Borrow'
                }}
            />
        </Stack.Navigator>
    )
}

export default function MyBorrowNavigator() {
    return <MyStack />
}