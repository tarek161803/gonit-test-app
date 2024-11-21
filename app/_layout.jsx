import { Slot, useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import React, { useContext } from "react";
import { Alert } from "react-native";
import UserProvider, { UserContext } from "../context/UserContext";

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

  React.useEffect(() => {
    handleGetUserInfo();
  }, []);

  return <Slot />;
};

const MainLayout = () => {
  return (
    <UserProvider>
      <InitialLayout />
    </UserProvider>
  );
};

export default MainLayout;
