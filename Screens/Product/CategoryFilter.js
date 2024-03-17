import React from 'react';
import { StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Badge, Text, VStack, Divider, HStack } from 'native-base';
const CategoryFilter = (props) => {
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
                            props.categoryFilter('all'), props.setActive(-1)
                        }}
                    >
                        <Badge style={[styles.center, { margin: 5 },
                        props.active === -1 ? styles.active : styles.inactive]} colorScheme="info" >
                            <Text style={{ color: 'black', fontSize: 12, fontWeight: "bold" }}>ALL</Text>
                        </Badge>
                    </TouchableOpacity>
                    {props.categories.map((item) => (
                        <TouchableOpacity
                            key={item._id}
                            onPress={() => {
                                props.categoryFilter(item.name),
                                    props.setActive(props.categories.indexOf(item))
                            }}
                        >

                            <Badge
                                style={[styles.center,
                                { margin: 5 },
                                props.active == props.categories.indexOf(item) ? styles.active : styles.inactive
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
        borderRadius: 1,
        textTransform: 'uppercase'
    },
    active: {
        backgroundColor: 'white',
        elevation: 5,
        textTransform: 'uppercase'
    },
    inactive: {
        backgroundColor: '#FFF',
        elevation: 5,
        textTransform: 'uppercase'
    }
})

export default CategoryFilter;