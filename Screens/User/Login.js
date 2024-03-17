import Input from "../../Shared/Form/Input";
import React, { useState, useContext, useEffect } from "react";
import { Image, View, Text, StyleSheet, ImageBackground } from 'react-native'
import FormContainer from "../../Shared/Form/FormContainer";
import { useNavigation } from '@react-navigation/native';
import Error from '../../Shared/Error'
import AuthGlobal from '../../Context/Store/AuthGlobal'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { loginUser } from '../../Context/Actions/Auth.actions'
import EasyButton from "../../Shared/StyledComponents/EasyButtons";
import { LinearGradient } from "expo-linear-gradient";

const Login = (props) => {
    const context = useContext(AuthGlobal)
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState("")
    let navigation = useNavigation()

    const handleSubmit = async () => {
        const user = {
            email,
            password,
        };

        if (email === "" || password === "") {
            setError("Please fill in your credentials");
        } else {
            try {
                await loginUser(user, context.dispatch);
                if (context.stateUser.isAuthenticated === true) {
                    navigation.navigate("User Profile");
                }
            } catch (err) {
                setError(err.message);
            }
        }
    };

    useEffect(() => {
        // Check if user is already authenticated (logged in) when the component mounts
        if (context.stateUser.isAuthenticated === true) {
            navigation.navigate("User Profile");
        }
    }, [context.stateUser.isAuthenticated, navigation]);

    AsyncStorage.getAllKeys((err, keys) => {
        AsyncStorage.multiGet(keys, (error, stores) => {
            stores.map((result, i, store) => {
                //console.log({ [store[i][0]]: store[i][1] });
                return true;
            });
        });
    });

    return (

        <ImageBackground
            source={require('../../assets/court.png')}
            style={{ flex: 1 }}
            resizeMode="cover"
        >
            <View style={{ ...styles.container, backgroundColor: 'rgba(255, 255, 255, 0.1)' }}>
                <FormContainer>
                    <Input
                        placeholder={"ENTER EMAIL"}
                        name={"email"}
                        id={"email"}
                        value={email}
                        onChangeText={(text) => setEmail(text.toLowerCase())}
                        style={styles.input}

                    />
                    <Input
                        placeholder={"ENTER PASSWORD"}
                        name={"password"}
                        id={"password"}
                        secureTextEntry={true}
                        value={password}
                        onChangeText={(text) => setPassword(text)}
                    />
                    <View style={styles.buttonGroup}>
                        {error ? <Error message={error} /> : null}
                        <View style={styles.row}>
                            <EasyButton
                                medium
                                primary
                                onPress={() => handleSubmit()}
                                style={styles.customButtonLogin}
                            ><Text style={{ color: "white", fontStyle: "italic" }}>LOGIN</Text>
                            </EasyButton>
                            <EasyButton
                                medium
                                secondary
                                onPress={() => navigation.navigate("Register")}
                                style={styles.customButtonRegister}
                            >
                                <Text style={{ color: "white", fontStyle: "italic" }}>Register</Text>
                            </EasyButton>

                        </View>

                    </View>

                </FormContainer>
                <Image
                    source={require('../../assets/tup.png')}
                    style={styles.image}
                />
            </View>
        </ImageBackground>
    )
}

const styles = StyleSheet.create({

    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        borderRadius: 8,
        paddingLeft: 10,
        marginBottom: 10,


    },

    buttonGroup: {
        marginTop: 35,
        width: "80%",
        alignItems: "center",
    },

    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        marginBottom: 100

    },
    middleText: {
        marginBottom: 20,
        alignSelf: "center",
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        margin: 5,
        marginTop: 10,
        borderRadius: 20,
        borderBottomColor: '#FA8072',
        // borderBottomWidth: 2,
        borderRightColor: '#FA8072',
        // borderRightWidth: 10,
        borderBottomStartRadius: 56,
        backgroundColor: "white"
    },
    image: {
        width: 185,
        height: 185,
        marginRight: 180,
        position: "absolute",
        top: 358,
        right: -18
    },
    customButtonLogin: {
        backgroundColor: 'blue',
        borderRadius: 10,
        elevation: 20
    },

    customButtonRegister: {
        backgroundColor: 'green',
        borderRadius: 10,
        elevation: 20

    },
});

export default Login;
