import React from "react";
import { TouchableOpacity, View, Dimensions } from "react-native";
import { useNavigation } from '@react-navigation/native';
import ProductCard from "./ProductCard";
import { LinearGradient } from "expo-linear-gradient";
var { width } = Dimensions.get("window")


const ProductList = (props) => {
    const { item } = props;
    const navigation = useNavigation();

    return (

        <TouchableOpacity
            style={{ width: '50%' }}
            onPress={() => navigation.navigate("Product Detail", { item: item })
            }

        >

            <View style={{ width: width / 2, backgroundColor: 'white' }}>
                
                    <ProductCard {...item} />
               
            </View>



        </TouchableOpacity>

    )
}
export default ProductList;