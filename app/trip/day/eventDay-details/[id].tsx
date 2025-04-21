import { View, Text, StyleSheet, ImageBackground } from "react-native";
import React, { useEffect } from "react";
import { Stack, useLocalSearchParams } from "expo-router";
import { useDispatch, useSelector } from "react-redux";
import { getDayDetails } from "@/redux/features/event/eventSlice";
import { SafeAreaView } from "react-native-safe-area-context";

const EventDetailsPage = () => {
  const dispatch: any = useDispatch();
  const { id: dayId } = useLocalSearchParams<any>();
  const { dayDetails, isLoading, isError, message } = useSelector(
    (state: any) => state.event
  );

  const dayData = dayDetails?.data;

  function formatDate(dateString: any) {
    const date = new Date(dateString);

    const options: any = { day: "numeric", month: "long", year: "numeric" };
    return date.toLocaleDateString("en-GB", options);
  }

  useEffect(() => {
    dispatch(getDayDetails(dayId) as any);
  }, [dayId, useLocalSearchParams]);

  return (
    <>
      <Stack.Screen
        options={{
          title: "Day Info",
          headerTitleAlign: "center",
        }}
      />

      <View style={styles.container}>
        {/* Title Section */}
        {dayData?.coverImage ? (
          <ImageBackground
            source={{ uri: dayData.coverImage }}
            style={styles.cardBackground}
            imageStyle={{ borderRadius: 12 }}
          >
            <View style={styles.overlayContent}>
              <View>
                <Text style={styles.cardTitle}>{dayData?.activityTitle}</Text>
                <Text style={styles.cardTime}>{formatDate(dayData?.date)}</Text>
              </View>
            </View>
          </ImageBackground>
        ) : (
          <View style={styles.card}>
            <View>
              <Text style={styles.cardTitle}>{dayData?.activityName}</Text>
              <Text style={styles.cardTime}>{formatDate(dayData?.date)}</Text>
            </View>
          </View>
        )}
      </View>

      <View>
        <Text style={styles.description}>{dayData?.subTitle}</Text>
        <Text style={styles.description}>
          {dayData?.description || "No description"}
        </Text>
      </View>
    </>
  );
};

export default EventDetailsPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 10,
    backgroundColor: "#121212",
    maxHeight: 300,
  },
  card: {
    backgroundColor: "pink",
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
    color: "#000",
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
