import { Stack } from "expo-router";
import React from "react";

const PublicLayout = () => {
  return (
    <Stack>
      <Stack.Screen name="login" options={{ title: "Login" }} />
    </Stack>
  );
};

export default PublicLayout;
