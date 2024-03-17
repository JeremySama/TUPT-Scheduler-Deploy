import React, { useState, useEffect, useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";
import {
  View,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  Dimensions,
} from "react-native";
import { Container, Input, Text, VStack, Center } from "native-base";
import Icon from "react-native-vector-icons/FontAwesome";
import ProductList from "./ProductList";
import SearchedProduct from "./SearchedProduct";
import Banner from "../../Shared/Banner";
import CategoryFilter from "./CategoryFilter";
import baseURL from "../../assets/common/baseUrl";
import axios from "axios";
import { LinearGradient } from "expo-linear-gradient";

const data = require("../../assets/data/products.json");
const productCategories = require("../../assets/data/categories.json");

var { width, height } = Dimensions.get("window");

const ProductContainer = () => {
  const [products, setProducts] = useState([]);
  const [productsFiltered, setProductsFiltered] = useState([]);
  const [focus, setFocus] = useState();
  const [categories, setCategories] = useState([]);
  const [active, setActive] = useState([]);
  const [initialState, setInitialState] = useState([]);
  const [productsCtg, setProductsCtg] = useState([]);
  const [loading, setLoading] = useState(true);

  const searchProduct = (text) => {
    //console.log(text);
    setProductsFiltered(
      products.filter((i) => i.name.toLowerCase().includes(text.toLowerCase()))
    );
  };

  const openList = () => {
    setFocus(true);
  };

  const onBlur = () => {
    setFocus(false);
  };

  const changeCtg = (ctg) => {
    if (ctg === "all") {
      setProductsFiltered(
        initialState.filter((product) => product.status === "active")
      );
      setActive(true);
    } else {
      const filteredProducts = initialState.filter(
        (product) =>
          product.category &&
          product.category.toLowerCase() === ctg.toLowerCase() &&
          product.status === "active"
      );
      setProductsFiltered(filteredProducts);
      setActive(true);
    }
  };

  useFocusEffect(
    useCallback(() => {
      setFocus(false);
      setActive(-1);

      // Categories
      axios
        .get(`${baseURL}categories`)
        .then((res) => {
          setCategories(res.data);
        })
        .catch((error) => {
          //console.log("Api call error");
        });

      // Products
      axios
        .get(`${baseURL}products`)
        .then((res) => {
          const activeProducts = res.data.filter(
            (product) => product.status === "active"
          );
          //console.log("Active Products:", activeProducts);
          setProducts(activeProducts);
          setProductsFiltered(activeProducts);
          setProductsCtg(res.data);
          setInitialState(res.data);
          setLoading(false);
        })
        .catch((error) => {
          console.log("Api call error");
        });

      return () => {
        setProducts([]);
        setProductsFiltered([]);
        setFocus();
        setCategories([]);
        setActive();
        setInitialState();
      };
    }, [])
  );
  //console.log(productsFiltered);

  return (
    <>
      {loading === false ? (
        <Center>
          <LinearGradient
            colors={["white", "white"]} //search
          >
            <VStack w="98%" space={6} alignSelf="center" style={styles.VStack}>
              <Input
                onFocus={openList}
                onChangeText={(text) => searchProduct(text)}
                placeholder="SEARCH HERE YOUR FAVORITE MERCH"
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
                <CategoryFilter
                  categories={categories}
                  categoryFilter={changeCtg}
                  productsCtg={productsCtg}
                  active={active}
                  setActive={setActive}
                />
              </View>
            </VStack>
          </LinearGradient>

          {focus === true ? (
            <SearchedProduct productsFiltered={productsFiltered} />
          ) : (
            <ScrollView style={{ marginBottom: 0, padding: 0 }}>
              <View style={{}}>
                <Banner />
              </View>

              {productsFiltered.length > 0 ? (
                <View style={styles.listContainer}>
                  {productsFiltered.map((item) => {
                    return (
                      <ProductList
                        // navigation={props.navigation}
                        key={item._id.$oid}
                        item={item}
                      />
                    );
                  })}
                </View>
              ) : (
                <View style={[styles.center, { height: height / 2 }]}>
                  <Text>No products found</Text>
                </View>
              )}
            </ScrollView>
          )}
        </Center>
      ) : (
        <Container style={[styles.center, { backgroundColor: "black" }]}>
          <ActivityIndicator size="large" color="red" />
        </Container>
      )}
    </>
  );
};
const styles = StyleSheet.create({
  container: {
    flexWrap: "wrap",
    backgroundColor: "black",
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
  },
});

export default ProductContainer;
