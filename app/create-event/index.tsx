import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Stack, useRouter } from "expo-router";
import { Picker } from "@react-native-picker/picker";
import { ScrollView } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { createEvents } from "../../redux/features/event/eventSlice";
import { uploadFileToS3 } from "@/utils/uploadFileToS3";
import DateTimePicker from "@react-native-community/datetimepicker";
import CustomLoader from "@/components/CustomLoader";

const CreateEventPage = () => {
  const dispatch: any = useDispatch();
  const router: any = useRouter();
  const { event, isLoading, isError, message } = useSelector(
    (state: any) => state.event
  );

  const [eventName, setEventName] = useState<any>("");
  const [isPrivate, setIsPrivate] = useState<any>(false);
  const [rsvp, setRsvp] = useState<any>("open");
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [coverImage, setCoverImage] = useState<any>(null);
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);
  const [loading, setLoading] = useState(false);

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

  const handleCreateEvent = async () => {
    // ✅ Step 1: Validate inputs
    if (!eventName?.trim()) {
      Alert.alert("Validation Error", "Event name is required.");
      return;
    }

    if (!startDate || !endDate) {
      Alert.alert(
        "Validation Error",
        "Please select a valid start and end date."
      );
      return;
    }

    if (!startDate || !endDate) {
      Alert.alert(
        "Validation Error",
        "Please select a valid start and end date."
      );
      return;
    }

    if (!coverImage) {
      Alert.alert("Validation Error", "Please select a cover image.");
      return;
    }

    setLoading(true);

    try {
      setLoading(true);
      let uploadedImageUrl = "";
      if (coverImage) {
        uploadedImageUrl = await uploadFileToS3(coverImage);
      }

      const payload: any = {
        eventName,
        isPrivate,
        rsvp,
        schedules: {
          from: startDate,
          to: endDate,
        },
        coverPicture: uploadedImageUrl,
      };

      const resultAction = await dispatch(createEvents(payload));

      // ✅ Step 2: Use the resultAction to check success
      if (createEvents.fulfilled.match(resultAction)) {
        router.push("/");
        setLoading(false);
      } else {
        Alert.alert(
          "Error",
          resultAction?.payload?.message || "Something went wrong"
        );
      }
    } catch (error) {
      Alert.alert("Error", "Failed to create event. Please try again later.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: "Create Event",
          headerTitleAlign: "center",
        }}
      />
      <ScrollView
        style={{ backgroundColor: "#000", flex: 1 }}
        contentContainerStyle={{ padding: 20 }}
      >
        {/* 1. Event Name */}
        <Text style={styles.label}>
          1. What would you like to call your event?
        </Text>
        <TextInput
          placeholder="Enter event name"
          placeholderTextColor="#A8B5DB"
          value={eventName}
          onChangeText={setEventName}
          style={styles.input}
        />

        {/* 2. Is it private */}
        <Text style={styles.label}>2. Is it a private event?</Text>
        <Text style={styles.description}>
          Private events are only visible to people you choose to share with.
        </Text>
        <View style={styles.toggleContainer}>
          <TouchableOpacity
            style={[styles.toggleButton, !isPrivate && styles.selectedToggle]}
            onPress={() => setIsPrivate(false)}
          >
            <Text style={styles.toggleText}>✓ PUBLIC</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.toggleButton, isPrivate && styles.selectedToggle]}
            onPress={() => setIsPrivate(true)}
          >
            <Text style={styles.toggleText}>PRIVATE</Text>
          </TouchableOpacity>
        </View>

        {/* 3. Invitation Type */}
        <Text style={styles.label}>
          3. How would you like to manage invitations?
        </Text>
        <Text style={styles.description}>
          You can send invitations. This setting manages how guests join.
        </Text>
        <View style={styles.dropdown}>
          <Picker
            selectedValue={rsvp}
            onValueChange={(itemValue) => setRsvp(itemValue)}
            dropdownIconColor="white"
            style={{ color: "white" }}
          >
            <Picker.Item label="Open (Anyone can join freely)" value="open" />
            <Picker.Item
              label="Open Invite (Anyone can request to join)"
              value="open invite"
            />
            <Picker.Item
              label="Invite Only (Only invite people can join)"
              value="invite only"
            />
          </Picker>
        </View>

        {/* 4. Dates */}
        <Text style={styles.label}>4. When is it scheduled?</Text>
        <View style={styles.dateContainer}>
          <View style={[styles.formGroup, { flex: 1, marginRight: 8 }]}>
            <Text style={styles.label}>Start Date</Text>
            <TouchableOpacity
              onPress={() => setShowStartPicker(true)}
              style={styles.input}
            >
              <Text style={{ color: "white" }}>
                {startDate ? startDate.toDateString() : "Select Start Date"}
              </Text>
            </TouchableOpacity>

            {showStartPicker && (
              <DateTimePicker
                value={startDate}
                mode="date"
                display="default"
                onChange={(event, selectedDate) => {
                  setShowStartPicker(false);
                  if (selectedDate) {
                    setStartDate(selectedDate);
                  }
                }}
              />
            )}
            <Text style={styles.helperText}>Format: YYYY-MM-DD</Text>
          </View>

          <View style={[styles.formGroup, { flex: 1, marginLeft: 8 }]}>
            <Text style={styles.label}>End Date</Text>
            <TouchableOpacity
              onPress={() => setShowEndPicker(true)}
              style={styles.input}
            >
              <Text style={{ color: "white" }}>
                {endDate ? endDate.toDateString() : "Select End Date"}
              </Text>
            </TouchableOpacity>

            {showEndPicker && (
              <DateTimePicker
                value={endDate}
                mode="date"
                display="default"
                onChange={(event, selectedDate) => {
                  setShowEndPicker(false);
                  if (selectedDate) {
                    setEndDate(selectedDate);
                  }
                }}
              />
            )}
            <Text style={styles.helperText}>Format: YYYY-MM-DD</Text>
          </View>
        </View>

        {/* 5. Cover Picture */}
        <Text style={styles.label}>5. Finally, Choose a cover picture.</Text>
        <Text style={styles.description}>A square picture works the best.</Text>
        <TouchableOpacity style={styles.coverButton} onPress={pickImage}>
          <Text style={styles.toggleText}>📁 Select Cover Picture</Text>
        </TouchableOpacity>

        {/* Submit Button */}
        <TouchableOpacity
          style={[
            styles.submitButton,
            loading && { opacity: 0.6 }, // Optional: visual feedback
          ]}
          onPress={handleCreateEvent}
          disabled={loading} // Disable while loading
        >
          <Text style={{ color: "#000", fontWeight: "bold" }}>
            {loading ? "Creating..." : "Create Event"}
          </Text>
        </TouchableOpacity>

        <CustomLoader visible={loading} />
        <ScrollView
          style={{ backgroundColor: "#000", flex: 1 }}
          contentContainerStyle={{ padding: 20 }}
        ></ScrollView>
      </ScrollView>
    </>
  );
};

export default CreateEventPage;

const styles = StyleSheet.create({
  label: {
    color: "white",
    fontSize: 16,
    marginTop: 20,
    marginBottom: 15,
    fontWeight: "bold",
  },
  description: {
    color: "#aaa",
    fontSize: 13,
    marginBottom: 10,
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
    color: "black",
    fontWeight: "bold",
  },
  dropdown: {
    borderWidth: 1,
    borderColor: "#666",
    borderRadius: 8,
    marginBottom: 20,
  },
  dateRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  coverButton: {
    padding: 10,
    backgroundColor: "#444",
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  submitButton: {
    backgroundColor: "white",
    padding: 14,
    borderRadius: 10,
    marginTop: 30,
    alignItems: "center",
  },

  dateContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  helperText: {},

  formGroup: {},

  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#000",
  },
});
