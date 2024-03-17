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

const UserListItem = ({ item, index, deleteUser }) => {
  const [modalVisible, setModalVisible] = useState(false);
  let navigation = useNavigation();

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
              onPress={() => {
                setModalVisible(false);
              }}
              style={styles.closeButton}
            >
              <Icon name="close" size={20} />
            </TouchableOpacity>

            <EasyButton
              medium
              secondary
              onPress={() => {
                if (item) {
                  navigation.navigate("UpdateUserStatus", { user: item });
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
                  deleteUser(item._id);
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
            navigation.navigate("UpdateUserStatus", { user: item });
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
            <Text style={styles.item}>{item.name}</Text>
            <Text style={styles.item}>{item.email}</Text>
            <Text style={styles.item}>{item.status}</Text>
            <Text style={styles.item}>{item.role}</Text>
            {/* Add other user details if needed */}
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
  closeButton: {
    alignSelf: "flex-end",
    position: "absolute",
    top: 5,
    right: 10,
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
  },
});

export default UserListItem;
