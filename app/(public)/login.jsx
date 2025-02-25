import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { useState } from "react";
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
import { useDispatch } from "react-redux";
import COLORS from "../../constants/Colors";
import { useLoginMutation } from "../../redux/slices/auth/authApi";
import { setUserInfo } from "../../redux/slices/auth/authSlice";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const [loginUser, { isLoading }] = useLoginMutation();
  const dispatch = useDispatch();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Invalid Credentials!", "Please fill in all fields.");
      return;
    }

    try {
      const response = await loginUser({ email, password }).unwrap();
      console.log(response);
      if (response.status === "success") {
        await SecureStore.setItemAsync("user", JSON.stringify(response.user));
        await SecureStore.setItemAsync("token", response.token);
        dispatch(setUserInfo({ user: response.user, token: response.token }));
        router.replace("home");
      } else {
        Alert.alert("Invalid Credentials!", "Please try again.");
      }
    } catch {
      Alert.alert("Something Went Wrong!", "Please try again later.");
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
    height: 50,
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
