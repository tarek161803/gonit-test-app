import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { Stack, useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import React from "react";
import { Alert, Pressable, Text, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import COLORS from "../../constants/Colors";
import { setUserInfo } from "../../redux/slices/auth/authSlice";
import { toggleSound } from "../../redux/slices/settings/settingsSlice";
import { SECURE_STORE_KEYS, setSecureItem } from "../../utils/secureStore";

const AuthLayout = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { soundEnabled } = useSelector((state) => state.settings);

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

  const handleToggleSound = async () => {
    dispatch(toggleSound());
    await setSecureItem(SECURE_STORE_KEYS.SOUND_ENABLED, !soundEnabled);
  };

  return (
    <Stack>
      <Stack.Screen
        name="home"
        options={{
          title: "Home",
          headerLeft: () => (
            <Pressable
              onPress={handleToggleSound}
              hitSlop={8}
              accessibilityRole="switch"
              accessibilityState={{ checked: soundEnabled }}
              accessibilityLabel={
                soundEnabled ? "Turn sound off" : "Turn sound on"
              }
              style={{ padding: 4 }}
            >
              <MaterialCommunityIcons
                name={soundEnabled ? "volume-high" : "volume-off"}
                size={24}
                color={soundEnabled ? COLORS.primary : "#9a9a9a"}
              />
            </Pressable>
          ),
          headerRight: () => (
            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 12 }}
            >
              <Pressable
                style={{ alignItems: "flex-end", padding: 4 }}
                onPress={logoutAlert}
              >
                <Text style={{ fontSize: 16 }}>Log Out</Text>
              </Pressable>
            </View>
          ),
        }}
      />

      <Stack.Screen name="[id]" options={{ title: "Question" }} />
    </Stack>
  );
};

export default AuthLayout;
