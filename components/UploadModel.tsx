// components/UploadModel.js
import React from "react";
import { Modal, View, Text, Pressable, StyleSheet } from "react-native";

export default function UploadModel({ onClose }) {
  return (
    <Modal transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.modalContent}>
          <Text style={styles.title}>Choose an action</Text>

          <Pressable style={styles.button}>
            <Text style={styles.buttonText}>Create a Post</Text>
          </Pressable>

          <Pressable style={styles.button}>
            <Text style={styles.buttonText}>Upload Documents</Text>
          </Pressable>

          <Pressable onPress={onClose}>
            <Text style={styles.cancelText}>Cancel</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 12,
    width: "80%",
    alignItems: "center",
  },
  title: {
    fontWeight: "bold",
    fontSize: 18,
    marginBottom: 16,
  },
  button: {
    backgroundColor: "#007bff",
    paddingVertical: 12,
    borderRadius: 8,
    marginVertical: 8,
    width: "100%",
  },
  buttonText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "600",
  },
  cancelText: {
    marginTop: 12,
    color: "#555",
    fontSize: 16,
  },
});
