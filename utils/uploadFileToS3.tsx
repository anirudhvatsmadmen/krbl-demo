import { Platform } from "react-native";

export const uploadFileToS3 = async (data: any) => {
  try {
    // Create FormData object
    const formData = new FormData();

    if (Platform.OS === "web") {
      // For web, directly append the file
      formData.append("file", data.file);
    } else {
      // For Expo/React Native on mobile
      // Extract the file information from the data
      const fileUri = data.uri;
      const fileName = data.fileName || `image_${Date.now()}.jpg`;
      const mimeType = data.mimeType || "image/jpeg";

      // Create the file object in the format expected by FormData and Expo
      // The key is to include the correct uri, name, and type properties
      const fileObject = {
        uri: fileUri,
        name: fileName,
        type: mimeType,
      };

      // Append with 'file' key as expected by your server
      formData.append("file", fileObject as any);
    }

    // Make the fetch request
    const response = await fetch(
      "https://krbl-backend.vercel.app/api/v1/event/upload",
      {
        method: "POST",
        body: formData,
      }
    );

    const responseText = await response.text();

    // Parse the response safely
    let responseData;
    try {
      responseData = JSON.parse(responseText);
    } catch (e) {
      throw new Error(`Invalid JSON response: ${responseText}`);
    }

    if (!response.ok) {
      throw new Error(responseData.message || "Upload failed");
    }

    return responseData.data.url;
  } catch (error) {
    console.error("Upload error:", error);
    throw error;
  }
};
