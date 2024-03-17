import React from 'react';
import { StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Badge, Text, VStack, Divider, HStack } from 'native-base';
const SportFilter = (props) => {
    return (
        <ScrollView
            bounces={true}
            horizontal={true}
            style={{ backgroundColor: "#fff", }}
        >
            <VStack space={4} divider={<Divider />} w="100%" style={{}}>
                <HStack justifyContent="space-between">
                    <TouchableOpacity
                        key={1}
                        onPress={() => {
                            props.sportFilter('all'), props.setActive(-1)
                        }}
                    >
                        <Badge style={[styles.center, { margin: 4 },
                        props.active === -1 ? styles.active : styles.inactive]} colorScheme="info" >
                            <Text style={{ color: 'black', fontSize: 12, fontWeight: "bold" }}>ALL</Text>
                        </Badge>
                    </TouchableOpacity>
                    {props.sports.map((item) => (
                        <TouchableOpacity
                            key={item._id}
                            onPress={() => {
                                props.sportFilter(item.name),
                                    props.setActive(props.sports.indexOf(item))
                            }}
                        >

                            <Badge
                                style={[styles.center,
                                { margin: 5 },
                                props.active == props.sports.indexOf(item) ? styles.active : styles.inactive
                                ]}
                            >
                                <Text style={{ color: 'black', textTransform: 'uppercase', fontSize: 12, fontWeight: "bold" }}>{item.name}</Text>
                            </Badge>
                        </TouchableOpacity>
                    ))}
                </HStack>
            </VStack>

        </ScrollView>


    )
}

const styles = StyleSheet.create({
    center: {
        justifyContent: 'center',
        alignItems: 'center',
        // borderRadius:56,
        textTransform: 'uppercase'
    },
    active: {
        backgroundColor: 'white',
        elevation: 5,
        textTransform: 'uppercase'
    },
    inactive: {
        backgroundColor: 'white',
        elevation: 5,
        textTransform: 'uppercase'
    }
})

export default SportFilter;