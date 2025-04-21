import CustomAlert from "@/components/CustomAlert";
import CustomLoader from "@/components/CustomLoader";
import { createUser } from "@/redux/features/user/userSlice";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from "react-native";
import { useDispatch } from "react-redux";

const SignUp = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const [form, setForm] = useState({
    email: "",
    firstName: "",
    lastName: "",
    password: "",
    confirmPassword: "",
    organizationName: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const [alertVisible, setAlertVisible] = useState(false);
  const [alertTitle, setAlertTitle] = useState("");
  const [alertMessage, setAlertMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  const showAlert = (title: any, message: any, success = false) => {
    setAlertTitle(title);
    setAlertMessage(message);
    setIsSuccess(success);
    setAlertVisible(true);
  };

  const handleChange = (name: string, value: string) => {
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = () => {
    const {
      email,
      firstName,
      lastName,
      password,
      confirmPassword,
      organizationName,
    } = form;

    if (
      !email ||
      !firstName ||
      !lastName ||
      !password ||
      !confirmPassword ||
      !organizationName
    ) {
      showAlert("Error", "Please fill all fields");
      return;
    }

    if (password !== confirmPassword) {
      showAlert("Error", "Passwords do not match");
      return;
    }
    const payload: any = {
      email,
      firstName,
      lastName,
      password,
      organizationName,
    };
    setIsLoading(true);
    dispatch(createUser(payload) as any);
    showAlert("Success", "Account created successfully");
    router.push("/auth/sign-in" as any);
    setIsLoading(false);
  };

  const handleAlertCancel = () => {
    setAlertVisible(false);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Create an Account</Text>

      <TextInput
        placeholder="Email"
        style={styles.input}
        value={form.email}
        onChangeText={(text) => handleChange("email", text)}
      />

      <TextInput
        placeholder="First Name"
        style={styles.input}
        value={form.firstName}
        onChangeText={(text) => handleChange("firstName", text)}
      />

      <TextInput
        placeholder="Last Name"
        style={styles.input}
        value={form.lastName}
        onChangeText={(text) => handleChange("lastName", text)}
      />

      <TextInput
        placeholder="Organization Name"
        style={styles.input}
        value={form.organizationName}
        onChangeText={(text) => handleChange("organizationName", text)}
      />

      <TextInput
        placeholder="Password"
        style={styles.input}
        secureTextEntry
        value={form.password}
        onChangeText={(text) => handleChange("password", text)}
      />

      <TextInput
        placeholder="Confirm Password"
        style={styles.input}
        secureTextEntry
        value={form.confirmPassword}
        onChangeText={(text) => handleChange("confirmPassword", text)}
      />

      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Create Account</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push("/auth/sign-in")}>
        <Text style={styles.linkText}>You have an account? Sign in</Text>
      </TouchableOpacity>

      <CustomLoader visible={isLoading} message="Account creating..." />

      <CustomAlert
        alert="alert"
        visible={alertVisible}
        title={alertTitle}
        message={alertMessage}
        cancelText="OK"
        confirmVisible={false}
        onCancel={handleAlertCancel}
        onConfirm={() => setAlertVisible(false)}
      />
    </ScrollView>
  );
};

export default SignUp;

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#121212",
    flexGrow: 1,
    justifyContent: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    padding: 12,
    marginBottom: 15,
    backgroundColor: "#fff",
  },
  button: {
    backgroundColor: "#00d5d5",
    paddingVertical: 15,
    borderRadius: 6,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "#000",
    fontWeight: "bold",
  },
  linkText: {
    color: "#00d5d5",
    textAlign: "center",
    marginTop: 10,
  },
});
