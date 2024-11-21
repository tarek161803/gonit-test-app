import { Stack } from "expo-router";
import React from "react";

const AuthLayout = () => {
  return (
    <Stack>
      <Stack.Screen name="home" options={{ title: "Home" }} />
    </Stack>
  );
};

export default AuthLayout;
