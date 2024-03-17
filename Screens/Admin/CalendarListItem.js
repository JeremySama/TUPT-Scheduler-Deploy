import React, { useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Dimensions,
  Modal,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import EasyButton from "../../Shared/StyledComponents/EasyButtons";
import { useNavigation } from "@react-navigation/native";

var { width } = Dimensions.get("window");

const CalendarListItem = ({ item, index, deleteCalendar }) => {
  const [modalVisible, setModalVisible] = useState(false);
  let navigation = useNavigation();

  const formatDate = (dateTime) => {
    const date = new Date(dateTime);
    const options = {
      year: "numeric",
      month: "numeric",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
    };
    return date.toLocaleDateString(undefined, options);
  };

  return (
    <View>
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(false);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <TouchableOpacity
              underlayColor="#E8E8E8"
              onPress={() => {
                setModalVisible(false);
              }}
              style={{
                alignSelf: "flex-end",
                position: "absolute",
                top: 5,
                right: 10,
              }}
            >
              <Icon name="close" size={20} />
            </TouchableOpacity>

            <EasyButton
              medium
              secondary
              onPress={() => {
                if (item) {
                  navigation.navigate("CalendarFormUpdate", { event: item });
                  setModalVisible(false);
                }
              }}
              title="Edit"
            >
              <Text style={styles.textStyle}>Edit</Text>
            </EasyButton>
            <EasyButton
              medium
              danger
              onPress={() => {
                if (item) {
                  deleteCalendar(item._id);
                  setModalVisible(false);
                }
              }}
              title="Delete"
            >
              <Text style={styles.textStyle}>Delete</Text>
            </EasyButton>
          </View>
        </View>
      </Modal>
      <TouchableOpacity
        onPress={() => {
          if (item) {
            navigation.navigate("SingleCalendarEvent", { item });
          }
        }}
        onLongPress={() => setModalVisible(true)}
        style={[
          styles.container,
          {
            backgroundColor: index % 2 === 0 ? "white" : "gainsboro",
          },
        ]}
      >
        {item ? (
          <>
            <Text style={styles.item}>{item.title}</Text>
            <Text style={styles.item}>
               {formatDate(item.timeStart)}
            </Text>
            <Text style={styles.item}>
              {formatDate(item.timeEnd)}
            </Text>
            <Text style={styles.item}>
              {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
            </Text>
            {/* Add other event details if needed */}
          </>
        ) : null}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    padding: 5,
    width: width,
  },
  item: {
    flexWrap: "wrap",
    margin: 3,
    width: width / 4,
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
  },
});

export default CalendarListItem;
