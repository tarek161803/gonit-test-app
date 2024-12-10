import { useFonts } from "expo-font";
import { Slot, useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect } from "react";
import { Alert } from "react-native";
import { Provider, useDispatch } from "react-redux";

import { GestureHandlerRootView } from "react-native-gesture-handler";
import { setUserInfo } from "../redux/slices/auth/authSlice";
import { store } from "../redux/store";

SplashScreen.preventAutoHideAsync();

const InitialLayout = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const handleGetUserInfo = async () => {
    try {
      const savedUser = await SecureStore.getItemAsync("user");
      const savedToken = await SecureStore.getItemAsync("token");

      if (savedUser && savedToken) {
        dispatch(setUserInfo({ user: JSON.parse(savedUser), token: savedToken }));
        router.replace("home");
      } else {
        router.replace("login");
      }
    } catch (err) {
      console.log(err);
      Alert.alert("Something Went Wrong!", "Please try again later.");
    }
  };

  useEffect(() => {
    handleGetUserInfo();
  }, []);

  return <Slot />;
};

const MainLayout = () => {
  const [loaded, error] = useFonts({
    DefaultRegular: require("../assets/fonts/Lato-Regular.ttf"),
    DefaultBold: require("../assets/fonts/Lato-Bold.ttf"),
  });

  useEffect(() => {
    if (error) {
      console.log(error);
    }
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Provider store={store}>
        <InitialLayout />
      </Provider>
    </GestureHandlerRootView>
  );
};

export default MainLayout;
