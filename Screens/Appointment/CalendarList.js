import React from "react";
import { TouchableOpacity, View, Dimensions } from "react-native";
import { useNavigation } from '@react-navigation/native';
import CalendarCard from "./CalendarCard";
var { width } = Dimensions.get("window")

const CalendarList = (props) => {
    const { item } = props;
    const navigation = useNavigation();

    return (
        <TouchableOpacity
            style={{ width: '50%' }}
            onPress={() => navigation.navigate("SingleCalendarEvent", { item: item })
            }
        >
            <View style={{ width: width / 2, backgroundColor: '#F8F9F5' }}>
                <CalendarCard {...item} />
            </View>
        </TouchableOpacity>
    )
}

export default CalendarList;
