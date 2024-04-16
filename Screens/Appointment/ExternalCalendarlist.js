import React, { useState} from "react";
import { TouchableOpacity, View, Dimensions, Modal, StyleSheet, Text } from "react-native";
import { useNavigation } from '@react-navigation/native';
import ExternalCalendarCard from "./ExternalCalendarCard";

var { width } = Dimensions.get("window")

const ExternalCalendarlist = (props) => {
    const { item } = props;
    const navigation = useNavigation();
    const [modalVisible, setModalVisible] = useState(false);
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

    const showModal = () => {
        setModalVisible(true);
    };

    const hideModal = () => {
        setModalVisible(false);
    };
    
    return (
        <>
            <TouchableOpacity
                style={{ width: '50%' }}
                onPress={showModal}
            >
                <View style={{ width: width / 2, backgroundColor: '#F8F9F5' }}>
                    <ExternalCalendarCard {...item} />
                </View>
            </TouchableOpacity>

            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={hideModal}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.title}>
                            Title:
                        </Text>
                        <Text style={styles.description}>
                            {item.event_name}
                        </Text>
                        <Text style={styles.title}>
                            Organization:
                        </Text>
                        <Text style={styles.description}>
                            {item.organization}
                        </Text>
                        <Text style={styles.title}>
                            Event Organizer:
                        </Text>
                        <Text style={styles.description}>
                            {item.eventOrganizerName}
                        </Text>
                        <Text style={styles.title}>
                            Venue:
                        </Text>
                        <Text style={styles.description}>
                            {item.venueName}
                        </Text>
                        <Text style={styles.title}>
                            Date:
                        </Text>
                        <Text style={styles.date}>
                            {formatDate(item.start)} - {formatDate(item.end)}
                        </Text>
                        <TouchableOpacity onPress={hideModal}>
                            <Text style={styles.closeButton}>Close</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </>
    )
}
const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)'
    },
    modalContent: {
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 10,
        width: '80%'
    },
    title: {
        fontWeight: 'bold',
        fontSize: 16,
        marginBottom: 5,
        textAlign: 'left'
    },
    description: {
        fontSize: 14,
        marginBottom: 10,
        textAlign: 'left'
    },
    date: {
        fontSize: 14,
        marginBottom: 10,
        textAlign: 'left'
    },
    closeButton: {
        marginTop: 10,
        color: 'blue',
        textAlign: 'center'
    }
});

export default ExternalCalendarlist;
