import React, { useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  Image,
  TouchableOpacity,
  Dimensions,
  Modal,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import { useNavigation } from "@react-navigation/native";
import EasyButton from "../../Shared/StyledComponents/EasyButtons";
import moment from "moment";
var { width } = Dimensions.get("window");

const EquipmentStocksLogsListItem = ({ item, index }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  let navigation = useNavigation();
  //console.log(item);
  return (
    <View>
      <TouchableOpacity
        style={[
          styles.container,
          {
            backgroundColor: index % 2 == 0 ? "white" : "gainsboro",
          },
        ]}
      >
        <Text style={styles.item} numberOfLines={1} ellipsizeMode="tail">
          {item.name}
        </Text>
        <Text style={styles.item} numberOfLines={1} ellipsizeMode="tail">
          {item.quantity}
        </Text>
        <Text style={styles.item} numberOfLines={1} ellipsizeMode="tail">
          {item.status}
        </Text>
        <Text style={styles.item} numberOfLines={1} ellipsizeMode="tail">
          {item.by}
        </Text>
        {/* <Text style={styles.item} numberOfLines={1} ellipsizeMode="tail">
          {moment(item.createdAt).format("MMMM Do YYYY, h:mm:ss a")}
        </Text> */}
        {/* <Text style={styles.item} numberOfLines={1} ellipsizeMode="tail">
          {item.createdAt}
        </Text> */}
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
  image: {
    borderRadius: 50,
    width: width / 6,
    height: 20,
    margin: 2,
  },
  item: {
    flexWrap: "wrap",
    margin: 3,
    width: width / 4.9,
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

export default EquipmentStocksLogsListItem;
