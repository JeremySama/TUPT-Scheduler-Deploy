import React, { useState, useCallback, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Dimensions,
  RefreshControl,
  Modal,
  TextInput,
  ScrollView,
} from "react-native";
import {Box } from "native-base";
import Icon from "react-native-vector-icons/FontAwesome";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import baseURL from "../../assets/common/baseUrl";
import EasyButton from "../../Shared/StyledComponents/EasyButtons";
import { useNavigation } from "@react-navigation/native";

var { height, width } = Dimensions.get("window");

const ListHeader = () => {
  return (
    <View elevation={1} style={styles.listHeader}>
      <View style={styles.headerItem}>
        <Text style={{ fontWeight: "600" }}>Category Name</Text>
      </View>
    </View>
  );
};

const Categories = () => {
  const [categoryList, setCategoryList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [categoryName, setCategoryName] = useState("");
  const [editingCategory, setEditingCategory] = useState(null);
  const navigation = useNavigation();

  const fetchCategories = useCallback(async () => {
    try {
      const token = await AsyncStorage.getItem("jwt");
      const response = await axios.get(`${baseURL}categories`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCategoryList(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      fetchCategories();
      setRefreshing(false);
    }, 2000);
  }, [fetchCategories]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const addCategory = async () => {
    try {
      const token = await AsyncStorage.getItem("jwt");
      if (editingCategory) {
        // If editingCategory is set, update the existing category
        await axios.put(
          `${baseURL}categories/${editingCategory.id}`,
          { name: categoryName },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const updatedCategories = categoryList.map((category) =>
          category.id === editingCategory.id
            ? { ...category, name: categoryName }
            : category
        );
        setCategoryList(updatedCategories);
        setEditingCategory(null);
      } else {
        // Otherwise, add a new category
        const response = await axios.post(
          `${baseURL}categories`,
          { name: categoryName },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setCategoryList([...categoryList, response.data]);
      }

      setCategoryName("");
      setModalVisible(false);
    } catch (error) {
      console.error("Error adding/updating category:", error);
    }
  };

  const editCategory = (category) => {
    setEditingCategory(category);
    setCategoryName(category.name);
    setModalVisible(true);
  };

  return (
    <Box flex={1}>
      <FlatList
        data={categoryList}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        renderItem={({ item }) => (
          <View style={styles.categoryItem}>
            <Text>{item.name}</Text>
            <EasyButton
              style={styles.editButton}
              onPress={() => editCategory(item)}
            >
              <Text style={{ color: "white" }}>Edit</Text>
            </EasyButton>
          </View>
        )}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: 20 }} // Adjust as needed
      />

      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.overlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.sectionTitle}>
              {editingCategory ? "Edit Category" : "Add Category"}
            </Text>
            <TextInput
              style={styles.input}
              placeholder="Category Name"
              value={categoryName}
              onChangeText={(text) => setCategoryName(text)}
            />
            <View style={styles.buttonContainer}>
              <EasyButton style={styles.modalButton} onPress={addCategory}>
                <Text style={styles.buttonText}>
                  {editingCategory ? "Edit" : "Add"}
                </Text>
              </EasyButton>
              <EasyButton
                style={styles.modalButton2}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.buttonText}>Cancel</Text>
              </EasyButton>
            </View>
          </View>
        </View>
      </Modal>
 
    </Box>
  );
};

const styles = StyleSheet.create({
  categoryItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
    borderBottomWidth: 1,
    borderColor: "lightgray",
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    padding: 20,
    backgroundColor: "#f0f0f0",
    width: "80%",
    borderRadius: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  buttonContainer: {
    flexDirection: "row",
    marginTop: 20,
  },
  buttonText: {
    color: "white",
  },
  editButton: {
    backgroundColor: "red",
    padding: 10,
    borderRadius: 5,
  },
  editButtonText: {
    color: "white",
    fontWeight: "bold",
  },

  // Updated styles for the buttons in Modal
  modalButton: {
    flex: 1,
    backgroundColor: "red",
    padding: 10,
    borderRadius: 5,
    marginLeft: 10,
  },
  modalButton2: {
    flex: 1,
    backgroundColor: "#45b6fe",
    padding: 10,
    borderRadius: 5,
    marginLeft: 10,
  },

  modalButtonText: {
    color: "white",
    textAlign: "center",
    fontWeight: "bold",
  },
});

export default Categories;
