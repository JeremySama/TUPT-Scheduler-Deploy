import React, { useContext } from "react";
import {
  View,
  Dimensions,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { Toast } from "native-base";
import { useSelector, useDispatch } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { clearBorrow, removeFromBorrow, updateBorrowItemQuantity } from '../../Redux/Actions/borrowActions';
import { Text, Box, HStack, Avatar, VStack, Spacer, Button } from 'native-base';
import { SwipeListView } from 'react-native-swipe-list-view';
import Icon from 'react-native-vector-icons/FontAwesome';
import EasyButton from '../../Shared/StyledComponents/EasyButtons';
import AuthGlobal from "../../Context/Store/AuthGlobal";

var { height, width } = Dimensions.get('window');


const Borrow = (props) => {
  const navigation = useNavigation();
  const borrowItems = useSelector((state) => state.borrowItems);
  const dispatch = useDispatch();
  const context = useContext(AuthGlobal);


  const borrow = () => {
    if (context.stateUser.user.userId) {
      navigation.navigate("BorrowCheckout")
    } else {
      navigation.navigate("User", { screen: "Login" });
      Toast.show({
        topOffset: 60,
        type: "error",
        text1: "Please Login to Checkout",
        text2: "",
      });
    }
  }

  const increaseQuantity = (item) => {
    dispatch(updateBorrowItemQuantity(item.id, item.quantity + 1));
  };

  const decreaseQuantity = (item) => {
    if (item.quantity > 1) {
      dispatch(updateBorrowItemQuantity(item.id, item.quantity - 1));
    }
  };

  const renderItem = ({ item, index }) => (
    <TouchableOpacity
      onPress={() => console.log('You touched me')}
      _dark={{
        bg: 'coolGray.800',
      }}
      _light={{
        bg: 'white',
      }}
    >
      <Box pl="4" pr="2" py="1" bg="white" flexDirection="column">
        <HStack alignItems="center" justifyContent="space-between">
          <Avatar
            size="48px"
            source={{
              uri: item.images.length > 0 ? item.images[0].url : "https://cdn.pixabay.com/photo/2012/04/01/17/29/box-23649_960_720.png",
            }}
          />

          <VStack ml="30" flex="1">
            <Text color="coolGray.800" _dark={{ color: 'warmGray.50' }} bold>
              {item.name}
            </Text>

          </VStack>

        </HStack>
        <HStack justifyContent="space-between" marginTop="2" marginBottom="2" marginLeft="20" marginRight="20" >


          <Button
            size="sm"
            colorScheme="red"
            onPress={() => decreaseQuantity(item)}
          >

            <Text color="white">-</Text>
          </Button>
          <Text>{item.quantity}</Text>
          <Button
            size="sm"
            colorScheme="blue"
            onPress={() => increaseQuantity(item)}
          >
            <Text color="white">+</Text>
          </Button>


        </HStack>
        <Box borderBottomWidth={2} borderBottomColor="black.200" />
      </Box>
    </TouchableOpacity>
  );

  const renderHiddenItem = (borrowItems) => (
    <TouchableOpacity onPress={() => dispatch(removeFromBorrow(borrowItems.item))}>
      <VStack alignItems="center" style={styles.hiddenButton} >
        <View>
          <Icon name="trash" color={"white"} size={30} bg="red" />
          <Text color="white" fontSize="xs" fontWeight="medium">
            Delete
          </Text>
        </View>
      </VStack>
    </TouchableOpacity>
  );

  return (
    <>
      {borrowItems.length > 0 ? (
        <Box bg="white" safeArea flex="1" width="100%">
          <SwipeListView
            data={borrowItems}
            renderItem={renderItem}
            renderHiddenItem={renderHiddenItem}
            disableRightSwipe={true}
            leftOpenValue={75}
            rightOpenValue={-150}
            previewOpenValue={-100}
            previewOpenDelay={3000}
          />
        </Box>
      ) : (
        <Box style={styles.emptyContainer}>
          <Text>No items in cart</Text>
        </Box>
      )}
      <VStack style={styles.bottomContainer} w="100%" justifyContent="space-between" >
        <HStack justifyContent="space-between">
        </HStack>
        <HStack justifyContent="space-between">
          <EasyButton danger medium alignItems="center" onPress={() => dispatch(clearBorrow())}>
            <Text style={{ color: 'white' }}>Clear</Text>
          </EasyButton>
        </HStack>
        <HStack justifyContent="space-between">
          <EasyButton
            secondary
            medium
            onPress={() => borrow()}
          >
            <Text style={{ color: 'white' }}>Borrow</Text>
          </EasyButton>
        </HStack>
      </VStack>
    </>
  );
};

const styles = StyleSheet.create({
  emptyContainer: {
    height: height,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottomContainer: {
    flexDirection: 'row',
    alignContent:'center',
    justifyContent: 'space-around', // Center the buttons
    position: 'absolute',
    bottom: 0,
    left: 0,
    backgroundColor: 'white',
    elevation: 20,
    paddingHorizontal: 60,
    paddingVertical: 5,
    width: '100%', // Set width to 100% to ensure buttons are centered

  },

  hiddenButton: {
    backgroundColor: 'red',
    justifyContent: 'center',
    alignItems: 'flex-end',
    paddingRight: 50,
    height: 70,
    width: width / 1,
  },
});

export default Borrow;
