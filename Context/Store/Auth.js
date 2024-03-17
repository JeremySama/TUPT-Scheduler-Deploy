import React, { useEffect, useReducer, useState } from "react";
import jwt_decode from "jwt-decode";
import AsyncStorage from '@react-native-async-storage/async-storage'

import authReducer from "../Reducers/Auth.reducer";
import { setCurrentUser } from "../Actions/Auth.actions";
import AuthGlobal from "./AuthGlobal";

const Auth = (props) => {
    const [stateUser, dispatch] = useReducer(authReducer, {
        isAuthenticated: null,
        user: {},
    });
    const [showChild, setShowChild] = useState(false);

    useEffect(() => {
        const loadUser = async () => {
            try {
                const token = await AsyncStorage.getItem("jwt");
                if (token) {
                    const decoded = jwt_decode(token);
                    dispatch(setCurrentUser(decoded));
                }
            } catch (error) {
                console.error("Error loading user:", error);
            }
        };

        setShowChild(true);
        loadUser();

        return () => setShowChild(false);
    }, []);

    if (!showChild) {
        return null;
    } else {
        return (
            <AuthGlobal.Provider
                value={{
                    stateUser,
                    dispatch,
                }}
            >
                {props.children}
            </AuthGlobal.Provider>
        );
    }
};

export default Auth;
