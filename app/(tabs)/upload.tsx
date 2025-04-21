import { createPost } from "@/redux/features/media/mediaSlice";
import { router, Stack } from "expo-router";
import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Platform,
  ScrollView,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useDispatch } from "react-redux";
import { uploadFileToS3 } from "@/utils/uploadFileToS3";
import CustomLoader from "@/components/CustomLoader";

const CreatePostNative = () => {
  const dispatch: any = useDispatch();
  const [image, setImage] = useState<any>(null);
  const [caption, setCaption] = useState("");
  const [loading, setLoading] = useState(false);

  const pickImage = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert(
        "Permission required",
        "Please grant permission to access media library."
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
      allowsEditing: true,
    });

    if (!result.canceled) {
      setImage(result.assets[0]);
    }
  };

  const handleSubmit = async () => {
    if (!image || !caption) {
      Alert.alert("Error", "Please select an image and enter a caption.");
      return;
    }

    try {
      setLoading(true);
      const uploadedImageUrl = await uploadFileToS3(image); // Should return a public S3 URL

      // Create the JSON payload
      const payload: any = {
        media: uploadedImageUrl,
        caption: caption,
        eventId: "67f668dd44244c0060ecc78f",
        type: "image",
      };

      await dispatch(createPost(payload) as any);
      setLoading(false);
      Alert.alert("Success", "Your image has been uploaded.");
      router.back();
    } catch (error) {
      setLoading(false);
      console.error("Upload error:", error);
      Alert.alert(
        "Error",
        "Failed to upload image: " +
          (error instanceof Error ? error.message : "Unknown error")
      );
    }
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: "Add Post",
          headerTitleAlign: "center",
        }}
      />
      <View style={styles.container}>
        <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
          {image ? (
            <Image source={{ uri: image.uri }} style={styles.image} />
          ) : (
            <Text style={styles.imageText}>Tap to upload image</Text>
          )}
        </TouchableOpacity>

        <TextInput
          style={styles.caption}
          placeholder="Write a caption..."
          value={caption}
          onChangeText={setCaption}
          multiline
        />

        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Post</Text>
        </TouchableOpacity>

        <CustomLoader visible={loading} />
      </View>
    </>
  );
};

export default CreatePostNative;

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#fff",
    flex: 1,
  },
  imagePicker: {
    backgroundColor: "#f0f0f0",
    height: 200,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    marginBottom: 20,
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  imageText: {
    color: "#666",
  },
  caption: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 8,
    minHeight: 80,
    marginBottom: 20,
    textAlignVertical: "top",
  },
  button: {
    backgroundColor: "#007bff",
    paddingVertical: 12,
    borderRadius: 8,
  },
  buttonText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold",
  },
});
