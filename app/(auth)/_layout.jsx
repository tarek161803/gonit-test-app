import { Stack, useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import React from "react";
import { Alert, Pressable, Text } from "react-native";
import { useDispatch } from "react-redux";
import { setUserInfo } from "../../redux/slices/auth/authSlice";

const AuthLayout = () => {
  const dispatch = useDispatch();
  const router = useRouter();

  const handleLogout = async () => {
    await SecureStore.deleteItemAsync("user");
    await SecureStore.deleteItemAsync("token");
    dispatch(setUserInfo(null));
    router.replace("login");
  };
  const logoutAlert = () => {
    Alert.alert("Confirm Logout", "Are you sure you want to log out?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Logout",
        onPress: () => handleLogout(),
      },
    ]);
  };

  return (
    <Stack>
      <Stack.Screen
        name="home"
        options={{
          title: "Home",
          headerRight: () => (
            <Pressable style={{ width: 80, alignItems: "flex-end", padding: 4 }} onPress={logoutAlert}>
              <Text style={{ fontSize: 16 }}>Log Out</Text>
            </Pressable>
          ),
        }}
      />

      <Stack.Screen name="[id]" options={{ title: "Question" }} />
    </Stack>
  );
};

export default AuthLayout;
