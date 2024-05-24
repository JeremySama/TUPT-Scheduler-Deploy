import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const ExternalCalendarCard = (props) => {
    const { event_name, organization, start, end } = props;

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
            {(event_name?.length ?? 0) > 15 ? event_name.substring(0, 12) + '...' : (event_name ?? 'Unnamed Event')}
            </Text>
            <Text style={styles.title}>
                Description:
            </Text>
            <Text style={styles.description}>
            {(organization?.length ?? 0) > 30 ? organization.substring(0, 27) + '...' : (organization ?? 'Unnamed Organization')}
            </Text>
            <Text style={styles.title}>
                Date:
            </Text>
            <Text style={styles.date}>
                {formatDate(start)} - {formatDate(end)}
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

export default ExternalCalendarCard;
