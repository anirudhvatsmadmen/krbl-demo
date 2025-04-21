// components/CustomLoader.tsx
import React from "react";
import { View, Text, ActivityIndicator, StyleSheet, Modal } from "react-native";

interface CustomLoaderProps {
  visible: boolean;
  message?: string;
}

const CustomLoader = ({
  visible,
  message = "Creating event...",
}: CustomLoaderProps) => {
  return (
    <Modal transparent animationType="fade" visible={visible}>
      <View style={styles.overlay}>
        <View style={styles.loaderBox}>
          <ActivityIndicator size="large" color="#fff" />
          <Text style={styles.message}>{message}</Text>
        </View>
      </View>
    </Modal>
  );
};

export default CustomLoader;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    justifyContent: "center",
    alignItems: "center",
  },
  loaderBox: {
    padding: 20,
    borderRadius: 10,
    backgroundColor: "#222",
    alignItems: "center",
  },
  message: {
    color: "#fff",
    marginTop: 10,
    fontSize: 16,
  },
});
