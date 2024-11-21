import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import React, { useContext } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { UserContext } from "../../context/UserContext";

const Home = () => {
  const { user, setUser } = useContext(UserContext);
  const router = useRouter();
  const handleLogout = async () => {
    await SecureStore.deleteItemAsync("user");
    await SecureStore.deleteItemAsync("token");
    setUser(null);
    router.replace("login");
  };

  return (
    <View style={styles.container}>
      <Text>Hello {user?.user?.name}</Text>

      <Pressable onPress={handleLogout}>
        <Text>Logout</Text>
      </Pressable>
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 10,
  },
});
