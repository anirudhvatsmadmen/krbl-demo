import React, { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import { signin } from "@/redux/features/user/userSlice";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Modal,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";
import CustomAlert from "@/components/CustomAlert";

const SignIn = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { user, isLoading, isError, message } = useSelector(
    (state: any) => state.user
  );
  const [loading, setIsLoading] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertTitle, setAlertTitle] = useState("");
  const [alertMessage, setAlertMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const showAlert = (title: any, message: any) => {
    setAlertTitle(title);
    setAlertMessage(message);
    setAlertVisible(true);
  };

  const handleLogin = async () => {
    if (!email || !password) {
      showAlert("Error", "Please fill all fields");
      return;
    }
    try {
      const payload: any = { email, password };
      const resultAction = await dispatch(signin(payload) as any);

      if (signin.fulfilled.match(resultAction)) {
        await AsyncStorage.setItem(
          "user",
          JSON.stringify(resultAction.payload)
        );
        router.push("/");
      } else {
        // Alert.alert("Login Failed", resultAction.payload || "Try again");
        console.log(resultAction, "resultAction");
        setAlertVisible(true);
        setAlertMessage("Invalid credentials");
      }
    } catch (error) {
      console.log("Login Error:", error);
      Alert.alert("Error", "Something went wrong");
      // setAlertMessage("Something went wrong");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign In</Text>

      <TextInput
        placeholder="Email"
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
      />

      <TextInput
        placeholder="Password"
        style={styles.input}
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Sign In</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push("/auth/sign-up")}>
        <Text style={styles.linkText}>Don't have an account? Sign Up</Text>
      </TouchableOpacity>

      <CustomAlert
        alert="alert"
        visible={alertVisible}
        title={alertTitle}
        message={alertMessage}
        onCancel={() => setAlertVisible(false)}
        onConfirm={() => setAlertVisible(false)}
      />
    </View>
  );
};

export default SignIn;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
    padding: 20,
    justifyContent: "center",
  },
  title: {
    fontSize: 24,
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 25,
  },
  input: {
    backgroundColor: "#fff",
    borderRadius: 6,
    padding: 12,
    marginBottom: 15,
  },
  button: {
    backgroundColor: "#00d5d5",
    paddingVertical: 15,
    borderRadius: 6,
    alignItems: "center",
    marginBottom: 15,
  },
  buttonText: {
    fontWeight: "bold",
    color: "#000",
  },
  linkText: {
    color: "#00d5d5",
    textAlign: "center",
    marginTop: 10,
  },
});
