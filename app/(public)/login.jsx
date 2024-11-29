import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { useContext, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import COLORS from "../../constants/Colors";
import { BASE_URL } from "../../constants/Utils";
import { UserContext } from "../../context/UserContext";

const Login = () => {
  const { setUser } = useContext(UserContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async () => {
    if (isLoading) return;

    if (!email || !password) {
      Alert.alert("Invalid Credentials!", "Please fill in all fields.");
      return;
    }

    setIsLoading(true);
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
    } catch {
      Alert.alert("Something Went Wrong!", "Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={{ flex: 1 }}
      keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
          <View style={styles.container}>
            <View>
              <Text style={styles.label}>Your Email</Text>
              <TextInput
                value={email}
                onChangeText={setEmail}
                style={styles.input}
                keyboardType="email-address"
                placeholder="e.g yourmail@example.com"
              />
            </View>
            <View style={{ marginTop: 20 }}>
              <Text style={styles.label}>Password</Text>
              <TextInput
                value={password}
                onChangeText={setPassword}
                style={styles.input}
                secureTextEntry
                placeholder="Password"
              />
            </View>
            <View style={{ marginTop: 20 }}>
              <Pressable style={styles.loginBtn} onPress={handleLogin}>
                {isLoading ? <ActivityIndicator color="white" /> : <Text style={styles.loginBtnText}>LOGIN</Text>}
              </Pressable>
            </View>
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export default Login;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 16,
    backgroundColor: "#ffffff",
  },
  label: {
    marginBottom: 4,
    fontSize: 16,
  },
  input: {
    borderColor: "gray",
    borderWidth: 1,
    padding: 12,
    paddingHorizontal: 10,
    borderRadius: 8,
    fontSize: 16,
  },
  loginBtn: {
    backgroundColor: COLORS.primary,
    borderRadius: 8,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    gap: 10,
  },
  loginBtnText: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
  },
});
