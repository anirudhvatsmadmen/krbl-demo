import { Platform } from "react-native";

export const uploadFileToS3 = async (data: any) => {
  try {
    const formData = new FormData();

    if (Platform.OS === "web") {
      formData.append("file", data.file);
    } else {
      const fileUri = data.uri;
      const fileName = data.fileName || `file_${Date.now()}`;
      const mimeType = data.mimeType || getMimeType(fileUri);

      const fileObject = {
        uri: fileUri,
        name: fileNameWithExtension(fileName, mimeType),
        type: mimeType,
      };

      formData.append("file", fileObject as any);
    }

    const response = await fetch(
      "https://krbl-backend.vercel.app/api/v1/event/upload",
      {
        method: "POST",
        body: formData,
      }
    );

    const responseText = await response.text();

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

// ✅ Helper to determine MIME type based on URI
const getMimeType = (uri: string): string => {
  if (uri.endsWith(".pdf")) return "application/pdf";
  if (uri.endsWith(".doc")) return "application/msword";
  if (uri.endsWith(".docx"))
    return "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
  if (uri.endsWith(".png")) return "image/png";
  if (uri.endsWith(".jpg") || uri.endsWith(".jpeg")) return "image/jpeg";
  return "application/octet-stream"; // fallback
};

// ✅ Helper to ensure correct file name extension
const fileNameWithExtension = (name: string, mimeType: string): string => {
  if (name.includes(".")) return name;

  switch (mimeType) {
    case "application/pdf":
      return `${name}.pdf`;
    case "application/msword":
      return `${name}.doc`;
    case "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
      return `${name}.docx`;
    case "image/png":
      return `${name}.png`;
    case "image/jpeg":
      return `${name}.jpg`;
    default:
      return `${name}.bin`;
  }
};
