import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TextInput,
  Pressable,
  TouchableOpacity,
  Alert,
} from "react-native";
import React, { useEffect, useState } from "react";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import DateTimePicker from "@react-native-community/datetimepicker";
import { addActivity } from "@/redux/features/event/eventSlice";
import { useDispatch } from "react-redux";
import * as ImagePicker from "expo-image-picker";
import { uploadFileToS3 } from "@/utils/uploadFileToS3";
import CustomLoader from "@/components/CustomLoader";

const AddActivityPage = () => {
  const { id } = useLocalSearchParams();
  const dispatch: any = useDispatch();
  const router: any = useRouter();
  const [activityName, setActivityName] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [description, setDescription] = useState("");
  const [isOpen, setIsOpen] = useState(true);
  const [startTime, setStartTime] = useState(new Date());
  const [endTime, setEndTime] = useState(new Date());
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);
  const [locationUrl, setLocationUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [coverImage, setCoverImage] = useState<any>(null);

  const onTimeChange = (
    event: any,
    selectedDate: any,
    type: "start" | "end"
  ) => {
    if (type === "start") {
      setShowStartPicker(false);
      if (selectedDate) setStartTime(selectedDate);
    } else {
      setShowEndPicker(false);
      if (selectedDate) setEndTime(selectedDate);
    }
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
      base64: false,
    });

    if (!result.canceled) {
      setCoverImage(result.assets[0]);
    }
  };
  useEffect(() => {
    const getPermissions = async () => {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        alert("Permission to access media library is required!");
      }
    };

    getPermissions();
  }, []);

  const handleSubmit = async () => {
    if (!activityName?.trim()) {
      Alert.alert("Validation Error", "Event name is required.");
      return;
    }
    try {
      setIsLoading(true);
      let uploadedImageUrl = "";

      // If there's a cover image, upload it to S3
      if (coverImage) {
        uploadedImageUrl = await uploadFileToS3(coverImage);
      }

      // Prepare the payload with the required data
      const payload = {
        dayId: id,
        activityName: activityName,
        activitySubtitle: subtitle,
        description: description,
        isClose: isOpen,
        schedules: {
          from: startTime,
          to: endTime,
        },
        locationUrl: locationUrl,
        coverPicture: uploadedImageUrl,
      } as any;

      dispatch(addActivity(payload));
      setIsLoading(false);
      router.push({
        pathname: `/trip/day/${id}`,
        params: {
          id: id,
        },
      });
    } catch (error) {
      console.error("Error while submitting activity:", error);
      alert("There was an issue submitting the activity. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <Stack.Screen
        options={{
          title: "Add Activity",
          headerTitleAlign: "center",
        }}
      />
      <ScrollView
        style={{ backgroundColor: "#000", flex: 1 }}
        contentContainerStyle={{ padding: 20 }}
      >
        {/* 1. Event Name */}
        <Text style={styles.label}>
          1. What would you like to call your activity?
        </Text>
        <TextInput
          placeholder="Enter activity name"
          placeholderTextColor="#A8B5DB"
          value={activityName}
          onChangeText={setActivityName}
          style={styles.input}
        />

        {/* 2. Subtitle */}
        <Text style={styles.label}>2. Activity Subtitle (optional)</Text>
        <TextInput
          placeholder="Enter subtitle"
          placeholderTextColor="#A8B5DB"
          value={subtitle}
          onChangeText={setSubtitle}
          style={styles.input}
        />

        {/* 3. Description */}
        <Text style={styles.label}>3. Add description for your activity</Text>
        <TextInput
          placeholder="Write a short description..."
          placeholderTextColor="#A8B5DB"
          value={description}
          onChangeText={setDescription}
          style={[styles.input, { height: 80 }]}
          multiline
        />

        {/* 4. Is it closed activity */}
        <Text style={styles.label}>4. Is it a closed activity?</Text>
        <View style={styles.toggleContainer}>
          <Pressable
            style={[styles.toggleButton, isOpen && styles.selectedToggle]}
            onPress={() => setIsOpen(true)}
          >
            <Text style={[styles.toggleText, isOpen && { color: "#000" }]}>
              Open
            </Text>
          </Pressable>
          <Pressable
            style={[styles.toggleButton, !isOpen && styles.selectedToggle]}
            onPress={() => setIsOpen(false)}
          >
            <Text style={[styles.toggleText, !isOpen && { color: "#000" }]}>
              Close
            </Text>
          </Pressable>
        </View>

        {/* 5. Start/End Time */}
        <Text style={styles.label}>5. When is it scheduled?</Text>
        <View style={styles.dateRow}>
          <Pressable
            onPress={() => setShowStartPicker(true)}
            style={styles.coverButton}
          >
            <Text style={{ color: "#fff" }}>
              Start: {startTime.toLocaleTimeString()}
            </Text>
          </Pressable>
          <Pressable
            onPress={() => setShowEndPicker(true)}
            style={styles.coverButton}
          >
            <Text style={{ color: "#fff" }}>
              End: {endTime.toLocaleTimeString()}
            </Text>
          </Pressable>
        </View>
        {showStartPicker && (
          <DateTimePicker
            value={startTime}
            mode="time"
            display="spinner"
            onChange={(event, date) => onTimeChange(event, date, "start")}
          />
        )}
        {showEndPicker && (
          <DateTimePicker
            value={endTime}
            mode="time"
            display="spinner"
            onChange={(event, date) => onTimeChange(event, date, "end")}
          />
        )}

        {/* 6. Location URL */}
        <Text style={styles.label}>6. Activity location URL</Text>
        <TextInput
          placeholder="https://maps.google.com/..."
          placeholderTextColor="#A8B5DB"
          value={locationUrl}
          onChangeText={setLocationUrl}
          style={styles.input}
        />

        {/* 5. Cover Picture */}
        <Text style={styles.label}>5. Finally, Choose a cover picture.</Text>
        <Text style={styles.description}>A square picture works the best.</Text>
        <TouchableOpacity style={styles.coverButton} onPress={pickImage}>
          <Text style={styles.toggleText}>📁 Select Cover Picture</Text>
        </TouchableOpacity>

        {/* Submit Button */}
        <Pressable style={styles.submitButton} onPress={handleSubmit}>
          <Text style={{ fontWeight: "bold" }}>Save Activity</Text>
        </Pressable>

        <CustomLoader visible={isLoading} message="Activity create..." />
      </ScrollView>
    </View>
  );
};

export default AddActivityPage;

const styles = StyleSheet.create({
  label: {
    color: "white",
    fontSize: 16,
    marginTop: 20,
    marginBottom: 10,
    fontWeight: "bold",
  },
  input: {
    borderBottomWidth: 1,
    borderColor: "#444",
    paddingVertical: 8,
    color: "white",
    marginBottom: 20,
  },
  toggleContainer: {
    flexDirection: "row",
    gap: 10,
    marginVertical: 10,
  },
  toggleButton: {
    flex: 1,
    padding: 10,
    backgroundColor: "#222",
    borderWidth: 1,
    borderColor: "#666",
    borderRadius: 8,
    alignItems: "center",
  },
  selectedToggle: {
    backgroundColor: "#fff",
  },
  toggleText: {
    color: "white",
    fontWeight: "bold",
  },
  dateRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  coverButton: {
    padding: 12,
    backgroundColor: "#444",
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 10,
  },
  submitButton: {
    backgroundColor: "white",
    padding: 14,
    borderRadius: 10,
    marginTop: 30,
    alignItems: "center",
  },
  description: {
    color: "#aaa",
    fontSize: 13,
    marginBottom: 10,
  },
});
