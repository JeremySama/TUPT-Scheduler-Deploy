import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const CalendarCard = (props) => {
    const { title, description, timeStart, timeEnd, attendees } = props;

    const formatDate = (dateTime) => {
        const date = new Date(dateTime);
        const options = {
            month: 'long',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
        };
        return date.toLocaleDateString(undefined, options);
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>
                TITLE:
            </Text>
            <Text style={styles.description}>
                {title.length > 15 ? title.substring(0, 15 - 3) + '...' : title}
            </Text>
            <Text style={styles.title}>
                Description:
            </Text>
            <Text style={styles.description}>
                {description.length > 30 ? description.substring(0, 30 - 3) + '...' : description}
            </Text>
            <Text style={styles.title}>
                Date:
            </Text>
            <Text style={styles.date}>
                {formatDate(timeStart)} - {formatDate(timeEnd)}
            </Text>
            {/* <Text style={styles.attendees}>Attendees: {attendees}</Text> */}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: 160,
        height: 160,
        padding: 10,
        borderRadius: 10,
        margin: 10,
        alignItems: 'center',
        elevation: 8,
        backgroundColor: 'white'
    },
    title: {
        fontWeight: 'bold',
        fontSize: 14,
        textAlign: 'center'
    },
    description: {
        fontSize: 12,
        textAlign: 'center'
    },
    date: {
        fontSize: 12,
        textAlign: 'center'
    },
    attendees: {
        fontSize: 12,
        textAlign: 'center'
    }
});

export default CalendarCard;
