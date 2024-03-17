import React, { useState, useEffect, useContext } from "react";
import {
  Image,
  View,
  StyleSheet,
  Text,
  ScrollView,
  TextInput,
  FlatList,
  Dimensions,
  Switch,
} from "react-native";
import {
  HStack,
  Center,
  Heading,
} from "native-base";
import Icon from "react-native-vector-icons/FontAwesome";
import CartIcon from "../../Shared/CartIcon";
import Toast from "react-native-toast-message";
import * as actions from "../../Redux/Actions/cartActions";
import { useDispatch } from "react-redux";
import EasyButton from "../../Shared/StyledComponents/EasyButtons";
import TrafficLight from "../../Shared/StyledComponents/TrafficLight";
import { Rating, AirbnbRating } from "react-native-ratings";
import axios from "axios";
import baseURL from "../../assets/common/baseUrl";
import AuthGlobal from "../../Context/Store/AuthGlobal";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import Swiper from "react-native-swiper";
var { width } = Dimensions.get("window");
const SingleProduct = (props) => {
  const [item, setItem] = useState(props.route.params.item);
  const [userReview, setUserReview] = useState({
    comment: "",
    rating: 5, // Default rating
  });
  const [userProfile, setUserProfile] = useState(null);
  const dispatch = useDispatch();
  const [availability, setAvailability] = useState(null);
  const [availabilityText, setAvailabilityText] = useState("");
  const { stateUser } = useContext(AuthGlobal);
  const navigation = useNavigation();
  const [isAnonymous, setIsAnonymous] = useState(false); // State for checkbox

  const roundedRating = Math.round(item.ratings * 10) / 10;
  const [bannerData, setBannerData] = useState([]);

  useEffect(() => {
    const itemImages = props.route.params.item.images;

    if (Array.isArray(itemImages) && itemImages.length > 0) {
      const imageUrls = itemImages.map(image => image.url);
      setBannerData(imageUrls);
    } else {
      setBannerData([]);
    }

    return () => {
      setBannerData([]);
    };
  }, [props.route.params.item]);

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

  const handleReviewSubmit = async () => {
    try {
      const token = await AsyncStorage.getItem("jwt");

      if (!token || !stateUser.user.userId) {
        navigation.navigate("User", { screen: "Login" });
        return;
      }

      if (!userReview.comment.trim()) {
        Toast.show({
          type: "error",
          text1: "Validation Error",
          text2: "Please provide a comment",
        });
        return;
      }

      const reviewData = {
        comment: userReview.comment,
        rating: userReview.rating,
        user: {
          _id: stateUser.user.userId,
          name: isAnonymous ? 'Anonymous' : userProfile.name,
        },
      };

      const response = await axios.put(
        `${baseURL}products/createReviews/${item._id}`,
        reviewData
      );

      navigation.goBack();
      //console.log("Review submitted:", response.data);
    } catch (error) {
      console.error("Error submitting review:", error);
    }
  };

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
        colors={["#FFF", "#FFF", "#FFF", "#FFF", "#FFF", "#FFF"]}
      >
        <ScrollView style={{ marginBottom: 80, padding: 5 }}>
          <View style={styles.swiper}>
            <Swiper
              style={{ height: width / 2 }}
              showButtons={false}
              autoplay={true}
              autoplayTimeout={1.5}
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
              <Text style={{  fontStyle: "italic", fontSize: 12,  }}>
                {availabilityText}  {availability}
              </Text>
            </View>
          </View>
          <View >
            <Text style={{ fontSize: 15, fontStyle: 'italic' }}>Description: {item.description}</Text>
          </View>
          <View style={styles.availabilityContainer}>
            <Text style={{ marginBottom: 25, marginTop: 25 }}>Stock: {item.stock}</Text>
            <Text style={{ fontSize: 18, fontStyle: "italic" }}>Product Review  </Text>
            <Text style={{ postion: 'absolute', left: 100, top: 2 }}> {Number.isInteger(roundedRating) ? roundedRating : roundedRating.toFixed(1)}/5 </Text>
            <Text style={{ postion: 'absolute', top: -18, }}><Rating
              type="star"
              startingValue={item.ratings}
              imageSize={20}
              readonly
              ratingBackgroundColor='transparent'
            /></Text>
            <View style={styles.productReviewContainer}>
            {/* Checkbox for anonymity */}
            <View style={styles.anonymityContainer}>
              <Text style={styles.anonymityText}>Anonymous:</Text>
              <Switch
                value={isAnonymous}
                onValueChange={(value) => setIsAnonymous(value)}
              />
            </View>
          </View>


            {item.reviews === null ? null : (
              <View>
                {item.reviews.map((review) => (
                  <View>
                    <View style={styles.lineBreak} />


                    <View style={styles.reviewContainer}>

                      <Text style={styles.reviewUserName}> <Image
                        source={{
                          uri: item.image
                            ? item.image
                            : "https://res.cloudinary.com/dt49xskmp/image/upload/v1704709653/xv8wtoscyrnbzycwqibo.png",
                        }}
                        style={{ width: 30, height: 30 }}
                        className="rounded"
                      /> {review.name}</Text>
                      <Rating
                        type="star"
                        startingValue={review.rating}
                        imageSize={13}
                        readonly
                        style={{ ...styles.reviewRating, backgroundColor: "pink" }}
                      />

                      <View>
                        <Text >Comment: {review.comment}</Text>
                      </View>

                    </View>
                  </View>
                ))}
              </View>
            )}
          </View>
          <View style={styles.productReviewContainer}>

            <View style={styles.ratingContainer}>
              <AirbnbRating
                count={5}
                defaultRating={userReview.rating}
                size={30}
                showRating={false}
                onFinishRating={(rating) =>
                  setUserReview({ ...userReview, rating })
                }

              />
              <Text style={styles.ratingText}>Rate it</Text>
              <Text style={styles.reviewHeaderText}>Make a Comment</Text>
              <TextInput
                placeholder="Your comment..."
                style={{
                  ...styles.reviewInput,
                  backgroundColor: 'white', // Set a background color
                  borderWidth: 1, // Add a border
                  borderColor: 'gray', // Border color
                }}
                value={userReview.comment}
                onChangeText={(text) => setUserReview({ ...userReview, comment: text })}
              />
            </View>
            <EasyButton
              primary
              large
              onPress={handleReviewSubmit}
              style={styles.submitReviewButton}
            >
              <Text style={styles.submitReviewText}>Submit Review</Text>
            </EasyButton>
          </View>
        </ScrollView>
      </LinearGradient>
      <View style={styles.bottomContainer}>
        <HStack space={3} justifyContent="center">
          
          <Text style={styles.price}>₱ {item.price}</Text>
          <EasyButton
    primary
    medium
    onPress={() => {
        dispatch(actions.addToCart({ ...item, quantity: 1 }));
        Toast.show({
            topOffset: 60,
            type: "success",
            text1: `${item.name} added to Cart`,
            text2: "Go to your cart to complete order",
        });
    }}
    style={styles.addButton}
    disabled={item.stock === 0}
>
{item.stock === 0 ? (
        <Text style={styles.addButtonTextDisabled}>Out of Stock</Text>
    ) : (
        <Text style={styles.addButtonText}>Add to Cart</Text>
    )}
    <Text style={styles.addIconText}>
        <>
            <CartIcon />
            <Icon
                name="shopping-cart"
                style={{ position: "relative" }}
                size={25}
            />
        </>
    </Text>
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
    fontWeight: "bold",
    marginBottom: 12

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
  addButtonTextDisabled: {
    color: "white",
    // textTransform: 'uppercase',

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
});

export default SingleProduct;
