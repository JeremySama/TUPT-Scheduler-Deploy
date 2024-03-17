import React from "react";
import { TouchableOpacity, View, Dimensions } from "react-native";
import { useNavigation } from '@react-navigation/native';
import EquipmentCard from "./EquipmentCard";
var { width } = Dimensions.get("window")


const EquipmentList = (props) => {
    const { item } = props;
    const navigation = useNavigation();

    return (
      
        <TouchableOpacity
            style={{ width: '50%' }}
            onPress={() => navigation.navigate("Equipment Detail", { item: item })
            }

        >
            
            <View style={{ width: width / 2, backgroundColor: '#FFF' }}>
                <EquipmentCard {...item} />
            </View>

            
           
        </TouchableOpacity>
     
    )
}
export default EquipmentList;