import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ImageBackground,
} from "react-native";
import {
  Stack,
  useFocusEffect,
  useLocalSearchParams,
  useRouter,
} from "expo-router";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteActivity,
  getSingleActivity,
} from "@/redux/features/event/eventSlice";
import CustomAlert from "@/components/CustomAlert";
import { Camera, Pencil } from "lucide-react-native";
import EditActivityModal from "@/components/EditActivityModal";
import { editActivity } from "@/redux/features/event/eventSlice";
import CustomLoader from "@/components/CustomLoader";
import { SafeAreaView } from "react-native-safe-area-context";
import * as ImagePicker from "expo-image-picker";
import { uploadFileToS3 } from "@/utils/uploadFileToS3";
import AsyncStorage from "@react-native-async-storage/async-storage";

const ActivityDetailsPage = () => {
  const dispatch: any = useDispatch();
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const { singleActivityInfo, isLoading, isError, message } = useSelector(
    (state: any) => state.event
  );
  const [activeData, setActiveData] = useState(singleActivityInfo?.data);
  const [showAlert, setShowAlert] = useState(false);
  const [isEditModalVisible, setEditModalVisible] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState<any>(null);
  const [isImageLoading, setIsImageLoading] = useState(false);
  const [getUser, setGetUSer] = useState(null);

  const formatDateRange = (startDate: string, endDate: string) => {
    const start = new Date(startDate);
    const end = new Date(endDate);

    const startMonth = start.toLocaleString("default", { month: "short" });
    const endMonth = end.toLocaleString("default", { month: "short" });

    if (startMonth === endMonth && start.getFullYear() === end.getFullYear()) {
      return `${startMonth} ${start.getDate()} - ${end.getDate()}, ${start.getFullYear()}`;
    } else {
      return `${startMonth} ${start.getDate()} - ${endMonth} ${end.getDate()}, ${end.getFullYear()}`;
    }
  };

  const handleDeletePress = () => {
    setShowAlert(true);
  };

  const handleConfirmDelete = () => {
    dispatch(deleteActivity(id as any));
    setShowAlert(false);
    router.back();
  };

  const handleEdit = (activityData: any) => {
    setSelectedActivity(activityData);
    setEditModalVisible(true);
  };

  const handleEditCoverImage = async (activity: any) => {
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

    if (result.canceled || !result.assets?.[0]) return;

    const selectedImage = result.assets[0];
    setIsImageLoading(true);

    try {
      const uploadedImageUrl = await uploadFileToS3(selectedImage);
      const payload: any = {
        activityName: activity.activityName,
        eventId: activity.event,
        dayId: activity._id,
        coverImage: uploadedImageUrl,
        schedules: {
          from: activity?.schedules?.from,
          to: activity?.schedules?.to,
        },
      };

      await dispatch(
        editActivity({
          activityId: activity._id,
          activityData: payload,
        } as any)
      );

      dispatch(getSingleActivity(id as any));
      setIsImageLoading(false);
    } catch (err) {
      console.error("Image upload or update failed", err);
      Alert.alert("Error", "Failed to update image.");
    } finally {
      setIsImageLoading(false);
    }
  };

  const handleSaveEdit = async (editActivityData: any) => {
    setLoading(true);
    try {
      const payload: any = {
        eventId: editActivityData?.event,
        dayId: editActivityData?._id,
        activityName: editActivityData?.activityTitle,
        subtitle: editActivityData?.subtitle,
        description: editActivityData?.description,
        coverImage: editActivityData?.coverImage || activeData?.coverPicture,
        schedules: {
          from: editActivityData?.schedules?.from,
          to: editActivityData?.schedules?.to,
        },
      };
      await dispatch(
        editActivity({
          activityId: editActivityData._id,
          activityData: payload,
        } as any)
      );
      dispatch(getSingleActivity(id as any));
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error("Error updating event day:", error);
    } finally {
    }
  };

  useEffect(() => {
    dispatch(getSingleActivity(id as any));
  }, [dispatch, id]);

  useEffect(() => {
    if (singleActivityInfo) {
      setActiveData(singleActivityInfo?.data);
    }
  }, [singleActivityInfo]);

  useFocusEffect(
    React.useCallback(() => {
      const checkUser = async () => {
        try {
          const userData = await AsyncStorage.getItem("user");
          const user: any = userData ? JSON.parse(userData) : null;
          setGetUSer(user?.data.user.role);
        } catch (error) {
          console.error("Failed to load user:", error);
        }
      };

      checkUser();
    }, [])
  );

  return (
    <>
      <Stack.Screen
        options={{
          title: "Activity Details",
          headerTitleAlign: "center",
        }}
      />
      <View style={styles.container}>
        {/* Title Section */}
        {activeData?.coverPicture ? (
          <ImageBackground
            source={{ uri: activeData.coverPicture }}
            style={styles.cardBackground}
            imageStyle={{ borderRadius: 12 }}
          >
            <View style={styles.overlayContent}>
              <View>
                <Text style={styles.cardTitle}>{activeData?.activityName}</Text>
                <Text style={styles.cardTime}>
                  {formatDateRange(
                    activeData?.schedules?.from,
                    activeData?.schedules?.from
                  )}
                </Text>
              </View>

              {getUser === "admin" && (
                <View style={styles.editIcon}>
                  <TouchableOpacity
                    onPress={() => handleEditCoverImage(activeData)}
                  >
                    <Camera size={20} color="#fff" />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => handleEdit(activeData)}>
                    <Pencil size={24} color="#fff" />
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </ImageBackground>
        ) : (
          <View style={styles.card}>
            <View>
              <Text style={styles.cardTitle}>{activeData?.activityName}</Text>
              <Text style={styles.cardTime}>
                {formatDateRange(
                  activeData?.schedules?.from,
                  activeData?.schedules?.from
                )}
              </Text>
            </View>

            {getUser === "admin" && (
              <View style={styles.editIcon}>
                <TouchableOpacity
                  onPress={() => handleEditCoverImage(activeData)}
                >
                  <Camera size={20} color="#fff" />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleEdit(activeData)}>
                  <Pencil size={24} color="#fff" />
                </TouchableOpacity>
              </View>
            )}
          </View>
        )}

        <Text style={styles.description}>
          {activeData?.description || "No Description"}
        </Text>

        {/* Delete Button */}
        {getUser === "admin" && (
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={() => {
              handleDeletePress();
            }}
          >
            <Text style={styles.deleteButtonText}>Delete Activity</Text>
          </TouchableOpacity>
        )}

        <CustomAlert
          visible={showAlert}
          title="Delete Activity"
          message="Are you sure you want to delete this activity?"
          onCancel={() => setShowAlert(false)}
          onConfirm={handleConfirmDelete}
        />

        <EditActivityModal
          visible={isEditModalVisible}
          activity={selectedActivity}
          onClose={() => setEditModalVisible(false)}
          onSave={handleSaveEdit}
        />
      </View>
      <SafeAreaView>
        <CustomLoader
          visible={isImageLoading || loading}
          message={isImageLoading ? "Updating image..." : "Save Activity..."}
        />
      </SafeAreaView>
    </>
  );
};

export default ActivityDetailsPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
    paddingHorizontal: 16,
    paddingTop: 10,
  },
  card: {
    backgroundColor: "#00d5d5",
    borderRadius: 4,
    padding: 20,
    alignItems: "flex-start",
    position: "relative",
    height: 250,
    display: "flex",
    justifyContent: "space-between",
    flexDirection: "row",
  },

  cardBackground: {
    borderRadius: 12,
    overflow: "hidden",
    padding: 16,
    marginBottom: 16,
    justifyContent: "space-between",
    height: 200,
  },
  overlayContent: {
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    padding: 12,
    borderRadius: 12,
    display: "flex",
    justifyContent: "space-between",
    flexDirection: "row",
    alignItems: "flex-start",
  },
  cardIcons: {
    position: "absolute",
    top: 10,
    right: 10,
    flexDirection: "row",
    gap: 12,
  },
  cardTitle: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 10,
  },
  cardFooter: {
    width: 300,
    height: 50,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  cardTime: {
    fontSize: 16,
    fontWeight: "500",
    color: "#fff",
  },
  description: {
    color: "#fff",
    fontSize: 16,
    marginTop: 40,
    marginBottom: 20,
    textAlign: "center",
  },
  deleteButton: {
    borderWidth: 1,
    borderColor: "#fff",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  deleteButtonText: {
    color: "#fff",
    fontWeight: "600",
  },

  editIcon: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: 50,
  },
});
