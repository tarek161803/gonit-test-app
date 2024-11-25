import { Stack, useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import React, { useContext } from "react";
import { Pressable, Text } from "react-native";
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
  return (
    <Stack>
      <Stack.Screen
        name="home"
        options={{
          title: "Home",
          headerRight: () => (
            <Pressable onPress={handleLogout}>
              <Text>Log Out</Text>
            </Pressable>
          ),
        }}
      />

      <Stack.Screen name="[id]" options={{ title: "Question" }} />
    </Stack>
  );
};

export default AuthLayout;
