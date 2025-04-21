import React, { Fragment, useEffect, useState } from "react";
import { getActivity } from "@/redux/features/event/eventSlice";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Pressable,
  ImageBackground,
  TouchableOpacity,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import {
  router,
  Stack,
  useFocusEffect,
  useLocalSearchParams,
} from "expo-router";
import { Plus } from "lucide-react-native";

const EventDayPage = () => {
  const dispatch: any = useDispatch();
  const { activityInfo, isLoading, isError, message } = useSelector(
    (state: any) => state.event
  );

  const dayInfo = activityInfo?.data?.day;
  const activityData = activityInfo?.data?.activities;
  const { id: dayId, eventId } = useLocalSearchParams<any>();

  useFocusEffect(
    React.useCallback(() => {
      dispatch(getActivity({ eventId, dayId } as any));
    }, [eventId, dayId])
  );

  console.log("activityInfo", activityInfo);

  const formatDate = (isoDate: string) => {
    const date = new Date(isoDate);
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "short",
      day: "numeric",
    };
    return date.toLocaleDateString("en-US", options);
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: "Event Activity",
          headerTitleAlign: "center",
        }}
      />
      <View style={styles.container}>
        {/* Top bar */}
        <ImageBackground
          source={{ uri: dayInfo?.coverImage }}
          style={styles.headerBackground}
          resizeMode="cover"
        >
          <View style={styles.overlay}>
            <Text style={styles.headerTitle}>{dayInfo?.title}</Text>
            <Text style={styles.headerDate}>{formatDate(dayInfo?.date)}</Text>
          </View>
        </ImageBackground>

        {/* Date */}
        <Text style={styles.date}>{formatDate(dayInfo?.date)}</Text>

        {/* Key Info Button */}
        <TouchableOpacity
          style={styles.keyInfoButton}
          onPress={() =>
            router.push({
              pathname: `/trip/day/eventDay-details/${dayId}`,
              params: { id: dayId },
            } as any)
          }
        >
          <Text style={styles.keyInfoText}>ℹ️ Key Info</Text>
        </TouchableOpacity>

        {/* Timeline */}
        <ScrollView
          style={{ backgroundColor: "#000", flex: 1 }}
          contentContainerStyle={{ padding: 20 }}
          showsVerticalScrollIndicator={false}
        >
          {activityData?.map((item: any, index: number) => {
            return (
              <Fragment key={index}>
                {/* <Text style={styles.time}>08 AM</Text> */}
                <Pressable
                  onPress={() =>
                    router.push({
                      pathname: `/trip/day/activity/${item._id}`,
                      params: { id: item._id },
                    } as any)
                  }
                >
                  {item?.coverPicture ? (
                    <ImageBackground
                      source={{ uri: item.coverPicture }}
                      style={styles.cardBackground}
                      imageStyle={{ borderRadius: 10 }}
                    >
                      <View style={styles.overlayContent}>
                        <View style={styles.cardHeader}>
                          <Text style={styles.cardTitle}>
                            {item?.activityName}
                          </Text>

                          <Text style={styles.cardDesc}>
                            {item?.description}
                          </Text>
                          {/* <Text style={styles.cardTime}>8.00 AM</Text> */}
                          {/* <Text style={styles.cardDuration}>1h</Text> */}
                        </View>
                      </View>
                    </ImageBackground>
                  ) : (
                    <View style={[styles.card, { backgroundColor: "#00d5d5" }]}>
                      <View style={styles.cardHeader}>
                        <Text style={styles.cardTitle}>
                          {item?.activityName}
                        </Text>
                        <Text style={styles.cardDesc}>{item?.description}</Text>
                        {/* <Text style={styles.cardTime}>8.00 AM</Text> */}
                        {/* <Text style={styles.cardDuration}>1h</Text> */}
                      </View>
                      <Text style={styles.cardDesc}>
                        {item?.activitySubtitle}
                      </Text>
                    </View>
                  )}
                </Pressable>
              </Fragment>
            );
          })}
        </ScrollView>
        {/* Floating "+" Button */}
        <TouchableOpacity
          style={styles.floatingButton}
          onPress={() => {
            router.push({
              pathname: "/add-activity/page",
              params: { id: dayId },
            });
          }}
        >
          <Text style={styles.floatingButtonText}>
            <Plus color="#000" />
          </Text>
        </TouchableOpacity>
      </View>
    </>
  );
};

export default EventDayPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  header: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 16,
    height: 200,
    backgroundColor: "#ccc",
  },
  headerTitle: {
    fontSize: 24,
    color: "#fff",
    fontWeight: "bold",
  },
  headerDate: {
    fontSize: 24,
    color: "#fff",
    fontWeight: "bold",
  },
  date: {
    fontSize: 18,
    color: "#000",
    marginLeft: 16,
    marginBottom: 10,
  },
  keyInfoButton: {
    alignSelf: "flex-end",
    backgroundColor: "#1a1a1a",
    borderRadius: 8,
    padding: 6,
    marginRight: 16,
    marginBottom: 10,
  },
  keyInfoText: {
    color: "#fff",
    fontSize: 14,
  },
  time: {
    color: "#fff",
    fontSize: 16,
    marginTop: 20,
    marginBottom: 8,
  },
  card: {
    backgroundColor: "#1a1a1a",
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    height: 200,
  },
  cardHeader: {
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "flex-start",
    height: 150,
  },
  cardTitle: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    flex: 1,
  },
  cardTime: {
    color: "#fff",
    marginLeft: 10,
  },
  cardDuration: {
    color: "#ccc",
    marginLeft: 10,
  },
  cardDesc: {
    color: "#fff",
    marginTop: 8,
    fontSize: 18,
  },
  headerBackground: {
    width: "100%",
    height: 200, // or any height you want
    justifyContent: "center",
    alignItems: "center",
  },
  overlay: {
    backgroundColor: "rgba(0,0,0,0.4)",
    padding: 10,
    borderRadius: 8,
  },
  floatingButton: {
    position: "absolute",
    bottom: 20,
    right: 20,
    width: 60,
    height: 60,
    backgroundColor: "#fff",
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowOffset: { width: 2, height: 2 },
    shadowRadius: 5,
    zIndex: 9,
  },
  floatingButtonText: {
    fontSize: 30,
    color: "#fff",
    fontWeight: "bold",
  },

  cardBackground: {},
  overlayContent: {},
});
