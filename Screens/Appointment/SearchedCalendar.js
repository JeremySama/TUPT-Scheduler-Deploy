import React from 'react';
import { View, StyleSheet, Dimensions, FlatList, TouchableOpacity } from 'react-native'
import { useNavigation } from '@react-navigation/native'; // Import useNavigation
import {
    Container,
    VStack,
    Text,
    HStack,
    Box,
    Avatar,
    Spacer,
} from "native-base";

var { width } = Dimensions.get("window");

const SearchedCalendar = (props) => {
    const { calendarsFiltered } = props;
    const navigation = useNavigation(); // Use the useNavigation hook to get the navigation object

    const handleItemPress = (item) => {
        // Navigate to the details screen when an item is pressed
        navigation.navigate('SingleCalendarEvent', { item }); // 'CalendarDetail' is the name of the details screen
    }

    return (
        <Container style={{ width: width }}>
            {calendarsFiltered.length > 0 ? (
                <Box width={80}>
                    <FlatList 
                        data={calendarsFiltered} 
                        renderItem={({ item }) => (
                            <TouchableOpacity onPress={() => handleItemPress(item)}>
                                <Box borderBottomWidth="1" _dark={{
                                    borderColor: "muted.50"
                                }} borderColor="muted.800" pl={["0", "4"]} pr={["0", "5"]} py="2">
                                    <HStack space={[2, 3]} justifyContent="space-between">
                                        <Avatar size="48px" source={{
                                            uri: item.image ?
                                                item.image : 'https://cdn.example.com/default-image.png'
                                        }} />
                                        <VStack>
                                            <Text _dark={{
                                                color: "warmGray.50"
                                            }} color="coolGray.800" bold>
                                                {item.title}
                                            </Text>
                                            <Text color="coolGray.600" _dark={{
                                                color: "warmGray.200"
                                            }}>
                                                {item.description}
                                            </Text>
                                        </VStack>
                                        <Spacer />
                                        <Text fontSize="xs" _dark={{
                                            color: "warmGray.50"
                                        }} color="coolGray.800" alignSelf="flex-start">
                                            {item.timeStart} - {item.timeEnd}
                                        </Text>
                                    </HStack>
                                </Box>
                            </TouchableOpacity>
                        )}
                        keyExtractor={item => item.id}
                    />
                </Box>
            ) : (
                <View style={styles.center}>
                    <Text style={{ alignSelf: 'center' }}>
                        No calendars match the selected criteria
                    </Text>
                </View>
            )}
        </Container>
    );
};

const styles = StyleSheet.create({
    center: {
        
        justifyContent: 'center',
        alignItems: 'center',
        height: 100
    },
});

export default SearchedCalendar;
