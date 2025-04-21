import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Alert,
} from "react-native";
import * as DocumentPicker from "expo-document-picker";
import * as ImagePicker from "expo-image-picker";
import { Picker } from "@react-native-picker/picker";
import { Camera, FileCheck, Flag, Images, X } from "lucide-react-native";
import { useDispatch, useSelector } from "react-redux";
import { uploadFileToS3 } from "@/utils/uploadFileToS3";
import {
  deleteDocument,
  downloadDocument,
  getDocument,
  uploadDocument,
} from "@/redux/features/user/userSlice";
import DocumentCard from "@/components/DocumentCard";
import * as WebBrowser from "expo-web-browser";
import { Stack, useFocusEffect } from "expo-router";
import CustomLoader from "@/components/CustomLoader";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import * as MediaLibrary from "expo-media-library";

export default function DocumentUploadScreen() {
  const dispatch: any = useDispatch();

  const [selectedType, setSelectedType] = useState<any>("");
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedFile, setSelectedFile] = useState<any>(null);
  const [userDoc, setUserDoc] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const pickFromGallery = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
    });
    if (!result.canceled) {
      setSelectedFile(result.assets[0]);
      //   setModalVisible(false);
    }
  };

  const pickFromCamera = async () => {
    const result = await ImagePicker.launchCameraAsync();
    if (!result.canceled) {
      setSelectedFile(result.assets[0]);
      //   setModalVisible(false);
    }
  };

  const pickDocument = async () => {
    const result = await DocumentPicker.getDocumentAsync({ type: "*/*" });
    if (result.assets && result.assets.length > 0) {
      setSelectedFile(result.assets[0]);
      //   setModalVisible(false);
    }
  };

  const handleUpload = () => {
    setModalVisible(true);
  };

  const confirmUpload = async () => {
    try {
      if (!selectedType || !selectedFile) {
        Alert.alert(
          "Missing Information",
          "Please select document type and file"
        );
        return;
      }
      setLoading(true);
      // Upload to S3
      const uploadedFileUrl = await uploadFileToS3(selectedFile);

      if (!uploadedFileUrl) {
        Alert.alert(
          "Upload Failed",
          "Unable to upload the file. Please try again."
        );
        return;
      }

      // Construct payload
      const payload = {
        documentName: selectedType,
        fileUrl: uploadedFileUrl,
      } as any;

      // Dispatch to Redux or send to backend
      dispatch(uploadDocument(payload));

      setLoading(false);
      setModalVisible(false);
    } catch (error) {
      setLoading(false);
      console.error("Upload error:", error);
      Alert.alert("Error", "Something went wrong during upload.");
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      let isActive = true;

      const fetchData = async () => {
        const data: any = await dispatch(getDocument());
        if (isActive) {
          setUserDoc(data?.payload?.data);
        }
      };

      fetchData();

      return () => {
        isActive = false;
      };
    }, [dispatch])
  );

  const handleOpenDocument = async (url: string) => {
    try {
      await WebBrowser.openBrowserAsync(url);
    } catch (error) {
      console.log("Open error", error);
      Alert.alert("Error", "Failed to open document.");
    }
  };

  const handleDelete = async (id: any) => {
    try {
      await dispatch(deleteDocument(id));

      setUserDoc((prevDocs: any) =>
        prevDocs.filter((doc: any) => doc._id !== id)
      );
    } catch (error) {
      console.log("Delete error", error);
      Alert.alert("Error", "Failed to delete document.");
    }
  };

  const handleDownload = async (id: any) => {
    try {
      const response: any = await dispatch(downloadDocument(id));
      const fileUrl = response?.payload?.fileUrl;

      if (!fileUrl) {
        Alert.alert("Error", "File URL not found.");
        return;
      }

      const uri = fileUrl.startsWith("http") ? fileUrl : `http://${fileUrl}`;
      const fileExtension = uri.split(".").pop();
      const fileName = `document_${Date.now()}.${fileExtension}`;
      const fileUri = FileSystem.documentDirectory + fileName;

      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Error", "Permission to access media library is required.");
        return;
      }

      const downloadResult = await FileSystem.downloadAsync(uri, fileUri);

      if (downloadResult?.uri) {
        const asset = await MediaLibrary.createAssetAsync(downloadResult.uri);
        await MediaLibrary.createAlbumAsync("Download", asset, false);
        Alert.alert("Success", "File saved to Downloads.");
      } else {
        Alert.alert("Error", "Download failed.");
      }
    } catch (error) {
      console.log("Download error", error);
      Alert.alert("Error", "Something went wrong during download.");
    }
  };
  return (
    <>
      <Stack.Screen
        options={{
          title: "Document",
          headerTitleAlign: "center",
        }}
      />
      <View style={styles.container}>
        <Text style={styles.header}>Welcome to Document Store</Text>

        <View style={styles.cardContainer}>
          {userDoc?.length > 0 ? (
            userDoc?.map((doc: any, index: number) => (
              <View style={styles.cardWrapper} key={index}>
                <DocumentCard
                  imageSrc={doc.fileUrl}
                  title={doc.documentName}
                  onDelete={() => handleDelete(doc?._id)}
                  onDownload={() => handleDownload(doc?._id)}
                  onPress={() => handleOpenDocument(doc?.fileUrl)}
                />
              </View>
            ))
          ) : (
            <Text style={styles.subHeader}>
              Document Store provides you a safe space to upload and store your
              documents digitally.
            </Text>
          )}
        </View>

        <TouchableOpacity style={styles.uploadButton} onPress={handleUpload}>
          <Text style={styles.uploadText}>Upload Document</Text>
        </TouchableOpacity>

        {/* Upload Modal */}
        <Modal visible={modalVisible} transparent animationType="slide">
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Text style={styles.modalTitle}>Upload Options</Text>
                <TouchableOpacity onPress={() => setModalVisible(false)}>
                  <X size={24} color="black" />
                </TouchableOpacity>
              </View>

              {/* Picker */}
              <Picker
                selectedValue={selectedType}
                onValueChange={(itemValue) => setSelectedType(itemValue)}
                style={styles.picker}
              >
                <Picker.Item label="Select Document Type" value="" />
                <Picker.Item label="Aadhar Card" value="Aadhar Card" />
                <Picker.Item label="PAN Card" value="PAN Card" />
                <Picker.Item label="Driving License" value="Driving License" />
                <Picker.Item label="Passport" value="Passport" />
                <Picker.Item label="Other" value="Other" />
              </Picker>

              {/* Icon Buttons */}
              <View style={styles.iconRow}>
                <TouchableOpacity
                  onPress={pickFromCamera}
                  style={styles.iconBox}
                >
                  <Camera size={30} color="#000" />
                  <Text style={styles.iconLabel}>Camera</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={pickFromGallery}
                  style={styles.iconBox}
                >
                  <Images size={30} color="#000" />
                  <Text style={styles.iconLabel}>Gallery</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={pickDocument} style={styles.iconBox}>
                  <FileCheck size={30} color="#000" />
                  <Text style={styles.iconLabel}>File</Text>
                </TouchableOpacity>
              </View>

              <TouchableOpacity
                style={[
                  styles.uploadButtonSubmit,
                  {
                    marginTop: 20,
                    backgroundColor: "#000",
                  },
                ]}
                onPress={confirmUpload}
              >
                <Text style={[styles.uploadText, { color: "#fff" }]}>
                  Submit Upload
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
      <CustomLoader visible={loading} message={"uploading..."} />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#212121",
    padding: 20,
    justifyContent: "flex-start",
    gap: 20,
  },

  cardContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginVertical: 10,
  },
  cardWrapper: {
    width: "48%", // Two cards per row with space between
    marginBottom: 15,
  },
  subHeader: {
    fontSize: 16,
    textAlign: "center",
    marginVertical: 20,
    color: "#555",
  },
  header: {
    fontSize: 26,
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
    marginBottom: 20,
  },
  subHeader: {
    fontSize: 16,
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
    marginBottom: 20,
  },
  card: {
    backgroundColor: "#F1F4F4",
    padding: 20,
    borderRadius: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
  },
  uploadButton: {
    marginTop: 30,
    borderWidth: 1,
    borderColor: "#fff",
    paddingVertical: 12,
    borderRadius: 10,
    alignSelf: "center",
    paddingHorizontal: 24,
    backgroundColor: "transparent",
    position: "absolute",
    bottom: 20,
  },

  uploadButtonSubmit: {
    marginTop: 30,
    borderWidth: 1,
    borderColor: "#fff",
    paddingVertical: 12,
    borderRadius: 10,
    alignSelf: "center",
    paddingHorizontal: 24,
    backgroundColor: "transparent",
  },
  uploadText: {
    color: "#fff",
    fontSize: 16,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "#00000099",
    justifyContent: "center",
    padding: 20,
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  iconRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 40,
  },
  iconBox: {
    alignItems: "center",
  },
  iconLabel: {
    marginTop: 5,
    fontSize: 12,
  },
  picker: {
    borderWidth: 1,
    borderColor: "#000",
    outline: "#000",
    marginTop: 10,
    padding: 10,
  },
});
