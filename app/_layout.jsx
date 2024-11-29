import { useFonts } from "expo-font";
import { Slot, useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import * as SplashScreen from "expo-splash-screen";
import React, { useContext, useEffect } from "react";
import { Alert } from "react-native";
import UserProvider, { UserContext } from "../context/UserContext";

SplashScreen.preventAutoHideAsync();

const InitialLayout = () => {
  const router = useRouter();
  const { setUser } = useContext(UserContext);

  const handleGetUserInfo = async () => {
    try {
      const savedUser = await SecureStore.getItemAsync("user");
      const savedToken = await SecureStore.getItemAsync("token");

      if (savedUser && savedToken) {
        router.replace("home");
        setUser({
          user: JSON.parse(savedUser),
          token: savedToken,
        });
      } else {
        router.replace("login");
      }
    } catch {
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
    <UserProvider>
      <InitialLayout />
    </UserProvider>
  );
};

export default MainLayout;
