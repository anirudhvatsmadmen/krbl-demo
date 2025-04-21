// components/EditActivityModal.tsx
import React, { useState, useEffect } from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Pressable,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import Colors from "../constants/Colors";

const EditActivityModal = ({ visible, onClose, activity, onSave }: any) => {
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [description, setDescription] = useState("");
  const [locationUrl, setLocationUrl] = useState("");
  const [startTime, setStartTime] = useState(new Date());
  const [endTime, setEndTime] = useState(new Date());
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);

  useEffect(() => {
    if (activity) {
      setTitle(activity.activityName || "");
      setSubtitle(activity.activitySubtitle || "");
      setDescription(activity.description || "");
      setLocationUrl(activity.locationUrl || "");
      if (activity.schedules?.from) {
        setStartTime(new Date(activity.schedules.from));
      }
      if (activity.schedules?.to) {
        setEndTime(new Date(activity.schedules.to));
      }
    }
  }, [activity]);

  const onTimeChange = (
    event: any,
    date: Date | undefined,
    type: "start" | "end"
  ) => {
    if (date) {
      if (type === "start") {
        setStartTime(date);
        setShowStartPicker(false);
      } else {
        setEndTime(date);
        setShowEndPicker(false);
      }
    }
  };

  const handleSave = () => {
    onSave({
      ...activity,
      activityTitle: title,
      subtitle,
      description,
      locationUrl,
      schedules: {
        from: startTime,
        to: endTime,
      },
    });
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={true}>
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Edit Activity</Text>

          <TextInput
            style={styles.input}
            placeholder="Activity Title"
            value={title}
            onChangeText={setTitle}
          />

          <TextInput
            style={styles.input}
            placeholder="Subtitle"
            value={subtitle}
            onChangeText={setSubtitle}
          />

          <TextInput
            style={styles.input}
            placeholder="Description"
            multiline
            numberOfLines={3}
            value={description}
            onChangeText={setDescription}
          />

          <TextInput
            style={styles.input}
            placeholder="https://maps.google.com/..."
            placeholderTextColor="#A8B5DB"
            value={locationUrl}
            onChangeText={setLocationUrl}
          />

          <Text style={styles.label}>Calender</Text>
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

          <View style={styles.actions}>
            <TouchableOpacity onPress={onClose} style={styles.cancelButton}>
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleSave} style={styles.saveButton}>
              <Text style={styles.buttonText}>Save</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default EditActivityModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
    padding: 20,
  },
  modalContainer: {
    backgroundColor: Colors.white,
    borderRadius: 10,
    padding: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.gray,
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  label: {
    marginVertical: 10,
    fontWeight: "bold",
  },
  dateRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  coverButton: {
    backgroundColor: Colors.primary,
    padding: 10,
    borderRadius: 5,
    flex: 1,
    marginHorizontal: 5,
    alignItems: "center",
  },
  actions: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  cancelButton: {
    marginRight: 10,
  },
  saveButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 5,
    margin: "auto",
    marginTop: 30,
  },
  buttonText: {
    color: Colors.white,
  },
});
