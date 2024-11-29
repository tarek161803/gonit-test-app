import { Stack, useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import React, { useContext } from "react";
import { Alert, Pressable, Text } from "react-native";
import { UserContext } from "../../context/UserContext";

const AuthLayout = () => {
  const { setUser } = useContext(UserContext);
  const router = useRouter();

  const handleLogout = async () => {
    await SecureStore.deleteItemAsync("user");
    await SecureStore.deleteItemAsync("token");
    setUser(null);
    router.replace("login");
  };
  const logoutAlert = () =>
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
