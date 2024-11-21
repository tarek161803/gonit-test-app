import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { useContext, useState } from "react";
import { Alert, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import COLORS from "../../constants/Colors";
import { BASE_URL } from "../../constants/Utils";
import { UserContext } from "../_layout";

const Login = () => {
  const { setUser } = useContext(UserContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const handleLogin = async () => {
    try {
      const response = await fetch(BASE_URL + "/auth/login", {
        method: "POST",
        body: JSON.stringify({
          email,
          password,
        }),
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
      });

      const data = await response.json();
      if (data.status === "success") {
        await SecureStore.setItemAsync("user", JSON.stringify(data.user));
        await SecureStore.setItemAsync("token", data.token);
        setUser({
          user: data.user,
          token: data.token,
        });
        router.replace("home");
      } else {
        Alert.alert("Invalid Credentials!", "Please try again.");
      }
    } catch (error) {
      Alert.alert("Something Went Wrong!", "Please try again later.");
    }
  };

  return (
    <View style={styles.container}>
      <View>
        <View>
          <Text style={styles.label}>Email:</Text>
          <TextInput
            value={email}
            onChangeText={setEmail}
            style={styles.input}
            keyboardType="email-address"
            placeholder="e.g yourmail@example.com"
          />
        </View>
        <View style={{ marginTop: 20 }}>
          <Text style={styles.label}>Password:</Text>
          <TextInput
            value={password}
            onChangeText={setPassword}
            style={styles.input}
            secureTextEntry
            placeholder="12345678"
          />
        </View>

        <View style={{ marginTop: 20 }}>
          <Pressable style={styles.loginBtn} onPress={handleLogin}>
            <Text style={styles.loginBtnText}>Login</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
};

export default Login;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 10,
  },

  label: {
    marginBottom: 5,
    fontSize: 16,
  },

  input: {
    borderColor: "gray",
    borderWidth: 1,
    padding: 8,
    fontSize: 16,
  },

  loginBtn: {
    backgroundColor: COLORS.primary,
    padding: 12,
    alignItems: "center",
  },

  loginBtnText: {
    color: "white",
    fontSize: 16,
  },
});
