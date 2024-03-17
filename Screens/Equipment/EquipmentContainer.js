import React, { useState, useEffect, useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";
import {
  View,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  Dimensions
} from "react-native";
import {
  Container,
  Input,
  Text,
  VStack,
  Center,
} from "native-base";
import Icon from "react-native-vector-icons/FontAwesome";
import EquipmentList from "./EquipmentList";
import SearchedEquipment from "./SearchedEquipment";
import Banner from "../../Shared/Banner";
import SportFilter from "./SportFilter";
import baseURL from "../../assets/common/baseUrl";
import axios from "axios";
import { LinearGradient } from "expo-linear-gradient";

var { width, height } = Dimensions.get("window");

const EquipmentContainer = () => {
  const [equipments, setEquipments] = useState([]);
  const [equipmentsFiltered, setEquipmentsFiltered] = useState([]);
  const [focus, setFocus] = useState();
  const [sports, setSports] = useState([]);
  const [active, setActive] = useState([]);
  const [initialState, setInitialState] = useState([]);
  const [equipmentsSpt, setEquipmentsSpt] = useState([]);
  const [loading, setLoading] = useState(true);

  const searchEquipment = (text) => {
    setEquipmentsFiltered(
      equipments.filter((i) => i.name.toLowerCase().includes(text.toLowerCase()))
    );
  };

  const openList = () => {
    setFocus(true);
  };

  const onBlur = () => {
    setFocus(false);
  };

  const changeSpt = (spt) => {
    if (spt === "all") {
      setEquipmentsFiltered(initialState.filter(equipment => equipment.status === "active"));
      setActive(true);
    } else {
      const filteredEquipments = initialState.filter(
        (equipment) =>
          equipment.sport &&
          equipment.sport.toLowerCase() === spt.toLowerCase() &&
          equipment.status === "active"
      );
      setEquipmentsFiltered(filteredEquipments);
      setActive(true);
    }
  };


  useFocusEffect(
    useCallback(() => {
      setFocus(false);
      setActive(-1);

      // Products
      axios
        .get(`${baseURL}equipments`)
        .then((res) => {
          const activeEquipments = res.data.filter((equipment) => equipment.status === "active");
          //console.log("Active Equipments:", activeEquipments);
          setEquipments(activeEquipments);
          setEquipmentsFiltered(activeEquipments);
          setEquipmentsSpt(res.data);
          setInitialState(res.data);
          setLoading(false);
        })
        .catch((error) => {

        });

      // Categories
      axios
        .get(`${baseURL}sports`)
        .then((res) => {
          setSports(res.data);
        })
        .catch((error) => {

        });

      return () => {
        setEquipments([]);
        setEquipmentsFiltered([]);
        setFocus();
        setSports([]);
        setActive();
        setInitialState();
      };
    }, [])
  );


  return (
    <>
      {loading === false ? (

        <Center>
          <LinearGradient
            colors={["white", "white"]}
          >
            <VStack w="97%" space={6} alignSelf="center" style={styles.VStack}>
              <Input
                onFocus={openList}
                onChangeText={(text) => searchEquipment(text)}
                placeholder="SEARCH HERE FOR EQUIPMENT NEED"
                variant="filled"
                backgroundColor="white"
                width="100%"
                borderRadius="5"
                py="1"
                px="2"
                borderColor="black"
                InputLeftElement={
                  <Icon
                  name="search"
                  style={{ position: "relative" }}
                  color="black"
                  size={30}
                />
                }
                InputRightElement={
                  focus === true ? (
                    <Icon
                    name="search"
                    style={{ position: "relative" }}
                    color="black"
                    size={30}
                  />
                  ) : null
                }
              />
              <View>
                <SportFilter
                  sports={sports}
                  sportFilter={changeSpt}
                  equipmentsSpt={equipmentsSpt}
                  active={active}
                  setActive={setActive}
                />
              </View>
            </VStack>
          </LinearGradient>

          {focus === true ? (
            <SearchedEquipment equipmentsFiltered={equipmentsFiltered} />
          ) : (
            <ScrollView style={{ marginBottom: 20}}>
              <View>
                <Banner />
              </View>

              {equipmentsFiltered.length > 0 ? (
                <View style={styles.listContainer}>
                  {equipmentsFiltered.map((item) => {
                    return (
                      <EquipmentList
                        // navigation={props.navigation}
                        key={item._id.$oid}
                        item={item}
                      />
                    );
                  })}
                </View>
              ) : (
                <View style={[styles.center, { height: height / 2 }]}>
                  <Text>No Equipments found</Text>
                </View>
              )}
            </ScrollView>
          )}

        </Center>
      ) : (
        <Container style={[styles.center, { backgroundColor: "white" }]}>
          <ActivityIndicator size="large" color="red" />
        </Container>
      )}
    </>
  );
};
const styles = StyleSheet.create({
  container: {
    flexWrap: "wrap",
    backgroundColor: "white",
  },
  listContainer: {
    //   height: "100%",
    flex: 1,
    flexDirection: "row",
    alignItems: "flex-start",
    flexWrap: "wrap",
    backgroundColor: "white",
  },
  center: {
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
  },
  VStack: {
    margin: 15,
  }
});

export default EquipmentContainer;
