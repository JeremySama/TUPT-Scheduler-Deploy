import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Platform,
  Button,
  ScrollView,
} from "react-native";
import { Select, Box } from "native-base";
import FormContainer from "../../Shared/Form/FormContainer";
import Input from "../../Shared/Form/Input";
import EasyButton from "../../Shared/StyledComponents/EasyButtons";
import Icon from "react-native-vector-icons/FontAwesome";
import Toast from "react-native-toast-message";
import AsyncStorage from "@react-native-async-storage/async-storage";
import baseURL from "../../assets/common/baseUrl";
import Error from "../../Shared/Error";
import axios from "axios";
import * as ImagePicker from "expo-image-picker";
import { useNavigation } from "@react-navigation/native";
import mime from "mime";
import AuthGlobal from "../../Context/Store/AuthGlobal";

const ProductForm = (props) => {
  const context = useContext(AuthGlobal);
  const [pickerValue, setPickerValue] = useState("");
  const [name, setName] = useState("");
  const [price, setPrice] = useState(0);
  const [description, setDescription] = useState("");
  const [seller, setSeller] = useState("");
  const [department, setDepartment] = useState("");
  const [course, setCourse] = useState("");
  const [year, setYear] = useState("");
  const [role, setRole] = useState("");
  const [user, setUser] = useState("");
  const [images, setImages] = useState([]);
  const [category, setCategory] = useState("");
  const [categories, setCategories] = useState([]);
  const [token, setToken] = useState();
  const [error, setError] = useState();
  const [countInStock, setCountInStock] = useState();
  const [rating, setRating] = useState(0);
  const [numReviews, setNumReviews] = useState(0);
  const [item, setItem] = useState(null);
  const [priceError, setPriceError] = useState(null);
  const [stockError, setStockError] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState("");
  let navigation = useNavigation();
  useEffect(() => {
    if (context.stateUser.user.userId) {
      setUser(context.stateUser.user.userId);
      setSeller(context.stateUser.user.name);
      setDepartment(context.stateUser.user.department);
      setCourse(context.stateUser.user.course);
      setYear(context.stateUser.user.year);
      setRole(context.stateUser.user.role);
    } else {
      navigation.navigate("User", { screen: "Login" });
      Toast.show({
        topOffset: 60,
        type: "error",
        text1: "Please Login to Checkout",
        text2: "",
      });
    }
  }, []);
  useEffect(() => {
    if (!props.route.params) {
      setItem(null);
    } else {
      setItem(props.route.params.item);
      setName(props.route.params.item.name);
      setPrice(props.route.params.item.price.toString());
      setDescription(props.route.params.item.description);
      setImages(
        props.route.params.item.images.map((image) => ({
          uri: image.url, // Assuming image.url contains the correct URI
        }))
      );
      console.log(images);
      setCategory(props.route.params.item.category._id);
      setPickerValue(props.route.params.item.category._id);
      setSelectedStatus(props.route.params.item.status);
    }
    AsyncStorage.getItem("jwt")
      .then((res) => {
        setToken(res);
      })
      .catch((error) => console.log(error));
    axios
      .get(`${baseURL}categories`)
      .then((res) => setCategories(res.data))
      .catch((error) => alert("Error to load categories"));
    (async () => {
      if (Platform.OS !== "web") {
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== "granted") {
          alert("Sorry, we need camera roll permissions to make this work!");
        }
      }
    })();
    return () => {
      setCategories([]);
    };
  }, []);

  const pickImage = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      alert("Permission to access camera roll is required!");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    //console.log(result);

    if (!result.canceled) {
      // Extract the first asset from the "assets" array
      const selectedAsset =
        result.assets && result.assets.length > 0 ? result.assets[0] : null;

      if (selectedAsset) {
        // Store the entire image object in the array with both uri and url properties
        const updatedImages = [
          ...images,
          { uri: selectedAsset.uri, url: selectedAsset.uri },
        ];
        setImages(updatedImages);
      }
    }
  };

  const removeImage = (index) => {
    const newImages = [...images];
    newImages.splice(index, 1); // Remove the image at the specified index
    setImages(newImages);
  };

  const addProduct = () => {
    if (name === "" || description === "" || category === "") {
      setError("Please fill in the required fields");
      return;
    } else {
      setError(null);
    }

    // Check if price and countInStock are not empty and do not exceed 5 digits
    if (price === "" || isNaN(price) || price.length > 5) {
      setPriceError("Please enter a valid price (up to 5 digits)");
      return;
    } else {
      setPriceError(null);
    }
    let byInfo = "";
    if (role === "professor") {
      byInfo = `${seller}, ${department}`;
    } else {
      byInfo = `${seller}, ${department}, ${course}, ${year}`;
    }

    let formData = new FormData();
    formData.append("name", name);
    formData.append("price", price);
    formData.append("description", description);
    formData.append("category", category);
    formData.append("rating", rating);
    formData.append("status", selectedStatus);
    formData.append("user", user);
    formData.append("seller", byInfo);
    formData.append("numReviews", numReviews);
    images.forEach((image, index) => {
      // Use the uri property for both existing and new images
      formData.append("images", {
        uri: image.uri,
        name: `image-${index}`,
        type: "image/jpg",
      });
    });

    const config = {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
    };
    if (item !== null) {
      //console.log(item);
      axios
        .put(`${baseURL}products/${item.id}`, formData, config)
        .then((res) => {
          if (res.status == 200 || res.status == 201) {
            Toast.show({
              topOffset: 60,
              type: "success",
              text1: "Product successfuly updated",
              text2: "",
            });
            setTimeout(() => {
              navigation.navigate("Products");
            }, 500);
          }
        })
        .catch((error) => {
          Toast.show({
            topOffset: 60,
            type: "error",
            text1: "Something went wrong",
            text2: "Please try again",
          });
        });
    } else {
      axios
        .post(`${baseURL}products`, formData, config)
        .then((res) => {
          if (res.status == 200 || res.status == 201) {
            Toast.show({
              topOffset: 60,
              type: "success",
              text1: "New Product added",
              text2: "",
            });
            setTimeout(() => {
              navigation.navigate("Products");
            }, 500);
          }
        })
        .catch((error) => {
          console.log(error);
          Toast.show({
            topOffset: 60,
            type: "error",
            text1: "Something went wrong",
            text2: "Please try again",
          });
        });
    }
  };
  return (
    <FormContainer title="Add Product">
      <View style={styles.label}>
        <Text style={{ textDecorationLine: "underline" }}>Name</Text>
      </View>
      <Input
        placeholder="Name"
        name="name"
        id="name"
        value={name}
        onChangeText={(text) => setName(text)}
      />
      <View style={styles.label}>
        <Text style={{ textDecorationLine: "underline" }}>Price</Text>
      </View>
      <Input
        placeholder="Price"
        name="price"
        id="price"
        value={price}
        keyboardType={"numeric"}
        onChangeText={(text) => setPrice(text)}
      />
      {priceError && <Error message={priceError} />}
      <View style={styles.label}>
        <Text style={{ textDecorationLine: "underline" }}>Description</Text>
      </View>
      <Input
        placeholder="Description"
        name="description"
        id="description"
        value={description}
        onChangeText={(text) => setDescription(text)}
      />
      <Box>
        <Select
          minWidth="90%"
          placeholder="Select your Category"
          selectedValue={pickerValue}
          onValueChange={(e) => [setPickerValue(e), setCategory(e)]}
        >
          {categories.map((c, index) => {
            return <Select.Item key={c.name} label={c.name} value={c.name} />;
          })}
        </Select>
      </Box>
      <Box>
        <Select
          minWidth="90%"
          placeholder="Select Status"
          selectedValue={selectedStatus}
          onValueChange={(value) => setSelectedStatus(value)}
        >
          <Select.Item label="Active" value="active" />
          <Select.Item label="Inactive" value="inactive" />
        </Select>
      </Box>
      <View style={styles.formGroup}>
        <Button
          title="Choose Image"
          onPress={pickImage}
          color="#007BFF" // Use a color that matches your app's theme
        />
      </View>
      <View style={styles.imageContainer}>
        {images.map((image, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => removeImage(index)} // Handle tap event to remove the image
            style={styles.imageItem}
          >
            <Image source={{ uri: image.uri }} style={styles.image} />
          </TouchableOpacity>
        ))}
      </View>

      {error ? <Error message={error} /> : null}
      <View style={styles.buttonContainer}>
        <EasyButton large primary onPress={() => addProduct()}>
          <Text style={styles.buttonText}>Confirm</Text>
        </EasyButton>
      </View>
    </FormContainer>
  );
};

const styles = StyleSheet.create({
  label: {
    width: "80%",
    marginTop: 10,
  },
  buttonContainer: {
    width: "80%",
    marginBottom: 80,
    marginTop: 20,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
  },
  imageContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "flex-start",
    marginVertical: 10,
    paddingHorizontal: 5,
  },
  imageItem: {
    flexDirection: "column",
    alignItems: "center",
    marginHorizontal: 5,
    marginBottom: 10,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 8,
  },
  removeButton: {
    position: "absolute",
    top: 5,
    right: 5,
  },
  formGroup: {
    marginBottom: 15,
    marginTop: 15,
  },
});

export default ProductForm;
