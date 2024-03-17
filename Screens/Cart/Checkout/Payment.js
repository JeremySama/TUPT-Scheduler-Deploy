import React, { useState } from "react";
import {
  View,
  Text,
  Select,
  CheckIcon,
  Input,
  Image,
  Button,
} from "native-base";
import { TouchableOpacity, ScrollView, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";

const Payment = (props) => {
  const order = props.route.params;
  const [selected, setSelected] = useState("");
  const [referenceNum, setReferenceNum] = useState("");
  const [images, setImages] = useState([]);
  const [error, setError] = useState("");
  const navigation = useNavigation();
  const paymentOptions = ["Walk-In", "GCash"];

  const handlePaymentMethodChange = (value) => {
    setSelected(value);
    if (value === "Walk-In") {
      setReferenceNum("N/A");
    } else {
      setReferenceNum("");
    }
  };

  const paydetails = async () => {
    setError(""); // Clear previous errors
    const isValidRefNum = /^\d{13}$/.test(referenceNum);
    if (!isValidRefNum && selected == "Gcash") {
      setError("Phone number must be 13 digits");
      return;
    }
    if (selected === "") {
      setError("Please fill in the form correctly");
      return;
    }
    let payment = {
      paymentMeth: selected,
      reference_num: referenceNum,
      images: images ? images : "", // Ensure selectedImage is not null
    };

    navigation.navigate("Confirm", { order: order, payment: payment });
  };

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
    //console.log("images",images)
  };

  const removeImage = (index) => {
    const newImages = [...images];
    newImages.splice(index, 1); // Remove the image at the specified index
    setImages(newImages);
  };

  return (
    <View style={{ backgroundColor: "#fff", flex: 1, padding: 20 }}>
      <ScrollView>
        <Text style={{ marginBottom: 20, fontSize: 20, fontWeight: "bold" }}>
          Payment Details
        </Text>
        <View
          style={{ backgroundColor: "#fff", padding: 15, borderRadius: 10 }}
        >
          <Text style={{ marginBottom: 10 }}>Payment Method</Text>
          <Select
            placeholder="Select payment method"
            value={selected}
            onValueChange={(value) => handlePaymentMethodChange(value)}
            _selectedItem={{
              bg: "teal.600",
              endIcon: <CheckIcon size="5" />,
            }}
          >
            {paymentOptions.map((option, index) => (
              <Select.Item key={index} label={option} value={option} />
            ))}
          </Select>
        </View>

        {selected === "GCash" && (
          <View
            style={{ backgroundColor: "#fff", padding: 15, borderRadius: 10 }}
          >
            <Image
              source={require("../../../assets/tup.png")}
              style={{ width: "100%", height: 300, marginTop: 20 }}
              alt="image"
            />
            <Text style={{ marginBottom: 10 }}>Reference Number</Text>
            <Input
              placeholder="Enter reference number"
              value={referenceNum}
              keyboardType={"numeric"}
              onChangeText={(text) => setReferenceNum(text)}
              maxLength={13}
            />
            <View style={{ marginTop: 20 }}>
              <TouchableOpacity
                style={{
                  backgroundColor: "#EF4444",
                  borderRadius: 20,
                  paddingVertical: 15,
                  alignItems: "center",
                }}
                onPress={pickImage}
              >
                <Text
                  style={{ fontSize: 18, fontWeight: "bold", color: "white" }}
                >
                  Select Documents
                </Text>
              </TouchableOpacity>
            </View>
            {/* <View>
              <Button
                title="Choose Images"
                onPress={pickImage}
                color="#007BFF" // Use a color that matches your app's theme
              />
            </View> */}
            <View style={styles.imageContainer}>
              {images.map((image, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => removeImage(index)} // Handle tap event to remove the image
                  style={styles.imageItem}
                >
                  <Image
                    source={{ uri: image.uri }}
                    style={styles.image}
                    alt="photo"
                  />
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}
        {error ? <Text style={styles.errorText}>{error}</Text> : null}
        <View style={{ marginTop: 20 }}>
          <TouchableOpacity
            style={{
              backgroundColor: "#EF4444",
              borderRadius: 20,
              paddingVertical: 15,
              alignItems: "center",
            }}
            onPress={() => paydetails()}
          >
            <Text style={{ fontSize: 18, fontWeight: "bold", color: "white" }}>
              Confirm
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};
const styles = StyleSheet.create({
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 5,
  },
  checkbox: {
    height: 24,
    width: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#007bff",
    marginRight: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  checkmark: {
    width: 12,
    height: 12,
    backgroundColor: "#007bff",
    borderRadius: 6,
  },
  checkboxTitle: {
    fontSize: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 10,
  },
  buttonContainer: {
    alignItems: "center",
    marginTop: 20,
  },
  buttonText: {
    color: "white",
  },
  errorText: {
    color: "red",
    marginTop: 10,
    alignSelf: "center",
  },
  dateTimeText: {
    fontSize: 16,
    borderWidth: 1,
    borderColor: "black",
    borderRadius: 5,
    padding: 10,
    color: "black",
    width: 300,
    textAlign: "center",
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
});
export default Payment;
