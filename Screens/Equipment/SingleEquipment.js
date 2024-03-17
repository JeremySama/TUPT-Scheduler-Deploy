import React, { useState, useEffect, useContext } from "react";
import {
  Image,
  View,
  StyleSheet,
  Text,
  ScrollView,
  TextInput,
  FlatList,
  Dimensions
} from "react-native";
import {
  HStack,
  Center,
  Heading,
} from "native-base";
import Icon from "react-native-vector-icons/FontAwesome";
import CartIcon from "../../Shared/CartIcon";
import Toast from "react-native-toast-message";
import * as actions from "../../Redux/Actions/borrowActions";
import { useDispatch } from "react-redux";
import EasyButton from "../../Shared/StyledComponents/EasyButtons";
import TrafficLight from "../../Shared/StyledComponents/TrafficLight";
import axios from "axios";
import baseURL from "../../assets/common/baseUrl";
import AuthGlobal from "../../Context/Store/AuthGlobal";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import Swiper from "react-native-swiper";
var { width } = Dimensions.get("window");
const SingleEquipment = (props) => {
  const [item, setItem] = useState(props.route.params.item);
  const [userProfile, setUserProfile] = useState(null);
  const dispatch = useDispatch();
  const [availability, setAvailability] = useState(null);
  const [availabilityText, setAvailabilityText] = useState("");
  const { stateUser } = useContext(AuthGlobal);
  const navigation = useNavigation()
  const [bannerData, setBannerData] = useState([]);

  useEffect(() => {
    const itemImages = props.route.params.item.images;

    // Check if itemImages is an array and has at least one element
    if (Array.isArray(itemImages) && itemImages.length > 0) {
      // Extract all image URLs from the itemImages array
      const imageUrls = itemImages.map(image => image.url);
      setBannerData(imageUrls);
    } else {
      setBannerData([]); // Set an empty array if itemImages is not as expected
    }

    return () => {
      setBannerData([]);
    };
  }, [props.route.params.item]);

//console.log(bannerData);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = await AsyncStorage.getItem("jwt");
        if (token && stateUser.user.userId) {
          const response = await axios.get(
            `${baseURL}users/${stateUser.user.userId}`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          setUserProfile(response.data);
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    };

    fetchUserProfile();
  }, [stateUser.user.userId, stateUser.user.userId]);

  useEffect(() => {
    if (item.stock == 0) {
      setAvailability(<TrafficLight unavailable></TrafficLight>);
      setAvailabilityText("Unvailable");
    } else if (item.stock <= 5) {
      setAvailability(<TrafficLight limited></TrafficLight>);
      setAvailabilityText("Limited Stock");
    } else {
      setAvailability(<TrafficLight available></TrafficLight>);
      setAvailabilityText("Available");
    }

    return () => {
      setAvailability(null);
      setAvailabilityText("");
    };
  }, []);

  return (
    <Center flexGrow={1} style={{ backgroundColor: "white", }}>
      <LinearGradient
        colors={["#FFF", "#FFF"]}
      >
        <ScrollView style={{ marginBottom: 80, padding: 5 }}>
          <View style={styles.swiper}>
            <Swiper
              style={{ height: width / 2 }}
              showButtons={false}
              autoplay={true}
              autoplayTimeout={2}
            >
              {bannerData.map((item) => {
                return (
                  <Image
                    key={item}
                    style={styles.imageBanner}
                    resizeMode="contain"
                    source={{ uri: item }}
                  />
                );
              })}
            </Swiper>
            <View style={{ height: 20 }}></View>
          </View>

          <View style={styles.contentContainer}>
            <Heading style={styles.contentHeader} size="xl">
              {item.name}
            </Heading>
            <View style={styles.availability}>
              <Text style={{ marginRight: 5, fontStyle: "italic", fontSize: 12, }}>
                {availabilityText}  {availability}
              </Text>
            </View>
          </View>
          <View >
            <Text style={{ fontSize: 15, fontStyle: 'italic' }}>Description: {item.description}</Text>
          </View>
          <View style={styles.availabilityContainer}>
            <Text style={{ marginBottom: 25 }}>Stock: {item.stock}</Text>
          </View>
        </ScrollView>
      </LinearGradient>
      <View style={styles.bottomContainer}>
        <HStack space={3} justifyContent="center">
          <EasyButton
            primary
            large
            onPress={() => {
              dispatch(actions.addToBorrow({ ...item, quantity: 1 }));
              Toast.show({
                topOffset: 60,
                type: "success",
                text1: `${item.name} added to Borrow`,
                text2: "Go to your cart to complete the order",
              });
            }}
            style={styles.addButton}
          >
            <Text style={styles.addButtonText}>Add to Borrow</Text>
            
          </EasyButton>
        </HStack>
      </View>
    </Center>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "relative",
    height: "100%",

    //
  },

  reviewUserName: {
    fontSize: 14,
    fontWeight: "bold"

  },
  imageContainer: {
    backgroundColor: "white",
    padding: 0,
    margin: 0,

  },
  image: {
    width: "100%",
    height: undefined,
    aspectRatio: 1.3,
    backgroundColor: "#CCCCCC",
    borderBottomRightRadius: 20, borderBottomLeftRadius: 20


  },
  contentContainer: {
    marginTop: 1,
    // justifyContent: "center",


  },
  contentHeader: {
    fontWeight: "bold",
    fontStyle: "italic",
    fontSize: 24,


  },

  contentText: {
    fontSize: 12,
    fontWeight: "bold",
    marginBottom: 10,

  },
  bottomContainer: {
    flexDirection: "row",
    position: "absolute",
    bottom: 0,
    left: 70,

  },
  price: {
    fontSize: 20,
    margin: 20,
    color: "red",
    fontWeight: "bold",
    marginRight: 2

  },
  availabilityContainer: {
    marginBottom: 20,



  },
  productReviewContainer: {
    marginTop: 30,
  },

  availability: {
    marginLeft: 150

  },
  addButton: {
    backgroundColor: "#1260CC",
    borderRadius: 5,
    paddingHorizontal: 0,
    paddingVertical: 0,

  },
  addButtonText: {
    color: "white",
    fontSize: 12,
    fontWeight: "bold",
    textTransform: 'uppercase',

  },
  addIconText: {
    color: "white",
    position: 'absolute',
    top: 25,
    left: 35

  },

  ratingText: {
    fontSize: 20,
    marginLeft: 145,
    fontStyle: 'italic',
    fontWeight: "bold"

  },
  reviewContainer: {
    alignItems: "flex-start"
  },

  bottomContainer: {
    flexDirection: "column",
    position: "absolute",
    bottom: 0,
    left: 0,
    width: '100%',
    alignItems: 'center',
  },

  lineBreak: {
    borderBottomWidth: 1,
    borderBottomColor: 'black',
    marginVertical: 1,
  },
  bannerImage: {
    width: "100%",
    height: undefined,
    aspectRatio: 1.3,
    backgroundColor: "#CCCCCC",
    borderBottomRightRadius: 20,
    borderBottomLeftRadius: 20,
  },
  swiper: {
    width: width,
    alignItems: "center",
    marginTop: 10,
  },
  imageBanner: {
    height: width / 2,
    width: width - 40,
    borderRadius: 10,
    marginHorizontal: 20,
  },
  bottomContainer: {
    flexDirection: "row",
    position: "absolute",
    bottom: 0,
    left: 0,
    width: "100%",
    alignItems: "center",
    justifyContent: "center", // Center the button horizontally
    marginBottom: 20,
  },

  addButton: {
    backgroundColor: "#1260CC",
    borderRadius: 5,
    paddingHorizontal: 20,
    paddingVertical: 10,
    flexDirection: "row", // Align icon and text horizontally
    alignItems: "center", // Center items vertically
  },

  addButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
    textTransform: "uppercase",
    marginRight: 10, // Space between text and icon
  },

  cartIconContainer: {
    flexDirection: "row",
    alignItems: "center",
  },

  cartIcon: {
    color: "white",
    marginLeft: 5, // Space between text and icon
    width: 10,
  
  },
});

export default SingleEquipment;
