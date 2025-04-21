import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Pressable,
  Alert,
  ImageBackground,
} from "react-native";
import {
  useLocalSearchParams,
  useRouter,
  Stack,
  useFocusEffect,
} from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import {
  Calendar,
  MapPin,
  FileText,
  Bell,
  Users,
  Share2,
  MoreVertical,
  Camera,
  Pencil,
} from "lucide-react-native";
import { useTripStore } from "@/store/trip-store";
import Colors from "../../constants/Colors";
import { useDispatch, useSelector } from "react-redux";
import {
  getEvent,
  updateEventDays,
} from "../../redux/features/event/eventSlice";
import { useNavigation } from "@react-navigation/native";
import EditDaysModal from "@/components/EditDaysModal";
import * as ImagePicker from "expo-image-picker";
import { uploadFileToS3 } from "@/utils/uploadFileToS3";
import CustomLoader from "@/components/CustomLoader";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function TripDetailScreen() {
  const dispatch: any = useDispatch();
  const navigation: any = useNavigation();
  const { eventInfo, isLoading, isError, message } = useSelector(
    (state: any) => state.event
  );

  //   const { id } = useLocalSearchParams<any>();
  const id: any = "6803d78407338ec2853d4870";
  const router = useRouter();
  const { trips, toggleActivityCompletion } = useTripStore();
  const [eventData, setEventData] = useState(eventInfo?.data);
  const [isEditModalVisible, setEditModalVisible] = useState(false);
  const [selectedDay, setSelectedDay] = useState(null);
  const [mediaData, setMediaData] = useState([]);
  const [image, setImage] = useState<any>(null);
  const [isImageLoading, setIsImageLoading] = useState(false);
  const [editDayLoading, setEditDayLoading] = useState(false);
  const [getUser, setGetUSer] = useState(null);

  const [activeTab, setActiveTab] = useState<
    "overview" | "itinerary" | "documents" | "bulletin"
  >("overview");

  const trip = trips.find((t) => t.id === id);

  if (trip) {
    return (
      <SafeAreaView style={styles.container}>
        <Text>Event not found</Text>
      </SafeAreaView>
    );
  }

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

  const handleEdit = (day: any) => {
    setSelectedDay(day);
    setEditModalVisible(true);
  };

  const handleSaveEdit = async (dayPost: any) => {
    try {
      setEditDayLoading(true);

      setMediaData((prevData: any) =>
        prevData.map((days: any) => (days._id === dayPost._id ? dayPost : days))
      );

      const payload: any = {
        eventId: dayPost.event,
        dayId: dayPost._id,
        activityTitle: dayPost.activityTitle,
        subtitle: dayPost.subtitle,
        description: dayPost.description,
      };

      await dispatch(updateEventDays(payload));
      await dispatch(getEvent(id));
    } catch (error) {
      console.error("Error updating event day:", error);
    } finally {
      setEditDayLoading(false);
    }
  };

  const handleEditCoverImage = async (dayPost: any) => {
    try {
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

      setIsImageLoading(true);

      if (!result.assets || result.assets.length === 0) {
        Alert.alert("Error", "Please select an image and enter a caption.");
        setIsImageLoading(false);
        return;
      }

      const uploadedImageUrl = await uploadFileToS3(result.assets[0]);

      const payload: any = {
        eventId: dayPost.event,
        dayId: dayPost._id,
        coverImage: uploadedImageUrl,
      };

      await dispatch(updateEventDays(payload));
      await dispatch(getEvent(id));
    } catch (error) {
      console.error("Error updating cover image:", error);
      Alert.alert(
        "Error",
        "Something went wrong while updating the cover image."
      );
    } finally {
      setIsImageLoading(false);
    }
  };

  useEffect(() => {
    dispatch(getEvent(id));
  }, [id, activeTab]);

  useEffect(() => {
    if (eventInfo?.data) {
      setEventData(eventInfo?.data);
      setMediaData(eventInfo?.data?.days || []);
    }
  }, [eventInfo]);

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

  const renderTabContent = () => {
    switch (activeTab) {
      case "overview":
        return (
          <>
            <Stack.Screen
              options={{
                title: "Days Details",
                headerTitleAlign: "center",
              }}
            />
            <View style={styles.overviewContainer}>
              <View style={styles.infoSection}>
                <Text style={styles.sectionTitle}>Event Details</Text>
                <Text style={styles.description}>
                  {eventData?.description || "description"}
                </Text>

                <View style={styles.infoRow}>
                  <Calendar size={18} color={Colors.primary} />
                  <Text style={styles.infoText}>
                    {formatDateRange(
                      eventInfo?.data?.schedules?.from,
                      eventInfo?.data?.schedules?.from
                    )}
                  </Text>
                </View>

                <View style={styles.infoRow}>
                  <MapPin size={18} color={Colors.primary} />
                  <Text style={styles.infoText}>
                    {eventData?.destination?.city || "Tokiyo"},
                    {eventData?.destination?.country || "Japan"}
                  </Text>
                </View>

                <View style={styles.infoRow}>
                  <Users size={18} color={Colors.primary} />
                  <Text style={styles.infoText}>
                    {eventData?.participants?.length} Participants
                  </Text>
                </View>
              </View>
              <View></View>

              {eventData?.budget && (
                <View style={styles.budgetSection}>
                  <Text style={styles.sectionTitle}>Budget</Text>
                  <View style={styles.budgetContainer}>
                    <View style={styles.budgetInfo}>
                      <Text style={styles.budgetLabel}>Total Budget</Text>
                      <Text style={styles.budgetTotal}>
                        {eventData?.budget?.currency}{" "}
                        {eventData?.budget?.total?.toLocaleString()}
                      </Text>
                    </View>

                    <View style={styles.budgetInfo}>
                      <Text style={styles.budgetLabel}>Spent</Text>
                      <Text style={styles.budgetSpent}>
                        {eventData?.budget?.currency}{" "}
                        {eventData?.budget?.spent.toLocaleString()}
                      </Text>
                    </View>

                    <View style={styles.budgetProgressContainer}>
                      <View
                        style={[
                          styles.budgetProgress,
                          {
                            width: `${Math.min(
                              100,
                              (eventData?.budget?.spent /
                                eventData?.budget?.total) *
                                100
                            )}%`,
                          },
                        ]}
                      />
                    </View>

                    <Text style={styles.budgetRemaining}>
                      {eventData?.budget?.currency}{" "}
                      {(
                        eventData?.budget?.total - eventData?.budget?.spent
                      ).toLocaleString()}{" "}
                      remaining
                    </Text>
                  </View>
                </View>
              )}
            </View>
          </>
        );

      case "itinerary":
        return (
          <>
            <Stack.Screen
              options={{
                title: "Event Days",
                headerTitleAlign: "center",
              }}
            />
            <View style={styles.itineraryContainer}>
              <ScrollView>
                {eventData?.days?.map((event: any, index: number) => (
                  <Pressable
                    key={index}
                    style={styles.cardWrapper}
                    onPress={() => {
                      router.push({
                        pathname: "/trip/day/[id]",
                        params: {
                          id: event._id,
                          eventId: event.event,
                        },
                      });
                    }}
                  >
                    <View style={styles.dateColumn}>
                      <Text style={styles.day}>{event.day}</Text>
                      <Text style={styles.month}>
                        <Text style={styles.day}>
                          {new Date(event?.date).toLocaleDateString("en-US", {
                            weekday: "short",
                          })}
                        </Text>
                      </Text>
                      <Text style={styles.dateNumber}>
                        {new Date(event?.date).toLocaleDateString("en-US", {
                          month: "short",
                        })}
                      </Text>
                      <Text style={styles.dateNumber}>
                        {new Date(event?.date).getDate()}
                      </Text>
                    </View>

                    <ImageBackground
                      source={{
                        uri:
                          event?.coverImage ||
                          "https://via.placeholder.com/300",
                      }}
                      style={styles.card}
                      imageStyle={{ borderRadius: 12 }}
                    >
                      <View style={styles.cardOverlay}>
                        <View style={styles.cardHeader}>
                          <View>
                            <Text style={styles.title}>
                              {event?.activityTitle}
                            </Text>
                            <Text style={styles.title}>{event?.subtitle}</Text>
                          </View>
                          {getUser === "admin" && (
                            <View style={styles.editIcon}>
                              <TouchableOpacity
                                onPress={() => handleEditCoverImage(event)}
                              >
                                <Camera size={20} color="#fff" />
                              </TouchableOpacity>
                              <TouchableOpacity
                                onPress={() => handleEdit(event)}
                              >
                                <Pencil size={24} color="#fff" />
                              </TouchableOpacity>
                            </View>
                          )}
                        </View>

                        {event.note && (
                          <Text style={styles.note}>{event?.subtitle}</Text>
                        )}
                      </View>
                    </ImageBackground>
                  </Pressable>
                ))}
              </ScrollView>
            </View>
          </>
        );

      case "documents":
        return (
          <>
            <Stack.Screen
              options={{
                title: "Event Details",
                headerTitleAlign: "center",
              }}
            />
            <View style={styles.documentsContainer}>
              {eventData.documents?.length > 0 ? (
                eventData.documents.map((document: any) => (
                  <TouchableOpacity
                    key={document.id}
                    style={styles.documentItem}
                    onPress={() =>
                      router.push(
                        `/trip/${eventData?.id}/document/${document?.id}`
                      )
                    }
                  >
                    <View style={styles.documentIcon}>
                      <FileText size={24} color={Colors?.primary} />
                    </View>
                    <View style={styles.documentInfo}>
                      <Text style={styles.documentTitle}>
                        {document?.title}
                      </Text>
                      <Text style={styles.documentType}>{document?.type}</Text>
                    </View>
                  </TouchableOpacity>
                ))
              ) : (
                <View style={styles.emptyState}>
                  <Text style={styles.emptyStateText}>
                    No documents added yet
                  </Text>
                  <TouchableOpacity
                    style={styles.addButton}
                    onPress={() =>
                      router.push(`/trip/${eventData?.id}/document/create`)
                    }
                  >
                    <Text style={styles.addButtonText}>Add Document</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </>
        );

      case "bulletin":
        return (
          <>
            <Stack.Screen
              options={{
                title: "Event Details",
                headerTitleAlign: "center",
              }}
            />
            <View style={styles.bulletinContainer}>
              {eventData.announcements?.length > 0 ? (
                eventData?.announcements.map((announcement: any) => (
                  <TouchableOpacity
                    key={announcement.id}
                    style={styles.announcementItem}
                    onPress={() =>
                      router.push(
                        `/trip/${eventData?.id}/announcement/${announcement?.id}`
                      )
                    }
                  >
                    <View style={styles.announcementHeader}>
                      <View style={styles.announcementIcon}>
                        <Bell size={20} color={Colors.primary} />
                      </View>
                      <Text style={styles.announcementTitle}>
                        {announcement?.title}
                      </Text>
                    </View>
                    <Text style={styles.announcementContent} numberOfLines={2}>
                      {announcement?.content}
                    </Text>
                    <View style={styles.announcementMeta}>
                      <Text style={styles.announcementAuthor}>
                        {announcement?.author}
                      </Text>
                      <Text style={styles.announcementDate}>
                        {new Date(announcement?.createdAt).toLocaleDateString()}
                      </Text>
                    </View>
                  </TouchableOpacity>
                ))
              ) : (
                <View style={styles.emptyState}>
                  <Text style={styles.emptyStateText}>
                    No announcements yet
                  </Text>
                  <TouchableOpacity
                    style={styles.addButton}
                    onPress={() =>
                      router.push(`/trip/${eventData?.id}/announcement/create`)
                    }
                  >
                    <Text style={styles.addButtonText}>Add Announcement</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </>
        );

      default:
        return null;
    }
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: "Event Details",
          headerTitleAlign: "center",
        }}
      />
      <Stack.Screen
        options={{
          title: eventData?.eventName,
          headerRight: () => (
            <TouchableOpacity style={{ marginRight: 16 }}>
              <MoreVertical size={24} color={Colors.text} />
            </TouchableOpacity>
          ),
        }}
      />

      <SafeAreaView style={styles.container}>
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* <View style={styles.coverImageContainer}>
            <Image
              source={{
                uri:
                  eventData?.coverImage ||
                  "https://cdn.carbonpaper.app/program_images/67ae2b7f6838.contentMobile.jpg",
              }}
              style={styles.coverImage}
            />

            <LinearGradient
              colors={["transparent", "rgba(0,0,0,0.7)"]}
              style={styles.gradient}
            >
              <View style={styles.tripInfo}>
                <View style={styles.statusContainer}>
                 
                </View>

                <View style={styles.actions}>
                  <TouchableOpacity style={styles.actionButton}>
                    <Share2 size={20} color={Colors.white} />
                  </TouchableOpacity>
                </View>
              </View>
            </LinearGradient>
          </View> */}

          {/* <View style={styles.tabsContainer}>
            <TouchableOpacity
              style={[styles.tab, activeTab === "overview" && styles.activeTab]}
              onPress={() => setActiveTab("overview")}
            >
              <Text
                style={[
                  styles.tabText,
                  activeTab === "overview" && styles.activeTabText,
                ]}
              >
                Overview
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.tab,
                activeTab === "itinerary" && styles.activeTab,
              ]}
              onPress={() => setActiveTab("itinerary")}
            >
              <Text
                style={[
                  styles.tabText,
                  activeTab === "itinerary" && styles.activeTabText,
                ]}
              >
                Itinerary
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.tab,
                activeTab === "documents" && styles.activeTab,
              ]}
              onPress={() => setActiveTab("documents")}
            >
              <Text
                style={[
                  styles.tabText,
                  activeTab === "documents" && styles.activeTabText,
                ]}
              >
                Documents
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.tab, activeTab === "bulletin" && styles.activeTab]}
              onPress={() => setActiveTab("bulletin")}
            >
              <Text
                style={[
                  styles.tabText,
                  activeTab === "bulletin" && styles.activeTabText,
                ]}
              >
                Bulletin
              </Text>
            </TouchableOpacity>
          </View> */}

          <Stack.Screen
            options={{
              title: "Event Days",
              headerTitleAlign: "center",
            }}
          />
          <View style={styles.itineraryContainer}>
            <ScrollView>
              {eventData?.days?.map((event: any, index: number) => (
                <Pressable
                  key={index}
                  style={styles.cardWrapper}
                  onPress={() => {
                    router.push({
                      pathname: "/trip/day/[id]",
                      params: {
                        id: event._id,
                        eventId: event.event,
                      },
                    });
                  }}
                >
                  <View style={styles.dateColumn}>
                    <Text style={styles.day}>{event.day}</Text>
                    <Text style={styles.month}>
                      <Text style={styles.day}>
                        {new Date(event?.date).toLocaleDateString("en-US", {
                          weekday: "short",
                        })}
                      </Text>
                    </Text>
                    <Text style={styles.dateNumber}>
                      {new Date(event?.date).toLocaleDateString("en-US", {
                        month: "short",
                      })}
                    </Text>
                    <Text style={styles.dateNumber}>
                      {new Date(event?.date).getDate()}
                    </Text>
                  </View>

                  <ImageBackground
                    source={{
                      uri:
                        event?.coverImage || "https://via.placeholder.com/300",
                    }}
                    style={styles.card}
                    imageStyle={{ borderRadius: 12 }}
                  >
                    <View style={styles.cardOverlay}>
                      <View style={styles.cardHeader}>
                        <View>
                          <Text style={styles.title}>
                            {event?.activityTitle}
                          </Text>
                          <Text style={styles.subTitle}>{event?.subtitle}</Text>
                          <Text style={styles.subTitle}>
                            {event?.description}
                          </Text>
                        </View>
                        {getUser === "admin" && (
                          <View style={styles.editIcon}>
                            <TouchableOpacity
                              onPress={() => handleEditCoverImage(event)}
                            >
                              <Camera size={20} color="#fff" />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => handleEdit(event)}>
                              <Pencil size={24} color="#fff" />
                            </TouchableOpacity>
                          </View>
                        )}
                      </View>

                      {event.note && (
                        <Text style={styles.note}>{event?.subtitle}</Text>
                      )}
                    </View>
                  </ImageBackground>
                </Pressable>
              ))}
            </ScrollView>
          </View>

          <EditDaysModal
            visible={isEditModalVisible}
            day={selectedDay}
            onClose={() => setEditModalVisible(false)}
            onSave={handleSaveEdit}
          />
        </ScrollView>
        <CustomLoader
          visible={isImageLoading || editDayLoading}
          message={isImageLoading ? "Updating image..." : "Save Program.."}
        />
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  coverImageContainer: {
    height: 200,
    position: "relative",
  },
  coverImage: {
    width: "100%",
    height: "100%",
  },
  gradient: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: "100%",
    justifyContent: "flex-end",
  },
  tripInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    padding: 16,
  },
  statusContainer: {
    // backgroundColor: "rgba(0,0,0,0.6)",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
  },
  statusText: {
    color: Colors.white,
    fontWeight: "600",
    fontSize: 14,
  },
  actions: {
    flexDirection: "row",
  },
  actionButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(0,0,0,0.6)",
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 8,
  },
  tabsContainer: {
    flexDirection: "row",
    backgroundColor: Colors.white,
    paddingTop: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  tab: {
    flex: 1,
    alignItems: "center",
    paddingBottom: 12,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: Colors.primary,
  },
  tabText: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  activeTabText: {
    color: Colors.primary,
    fontWeight: "600",
  },
  overviewContainer: {
    padding: 16,
  },
  infoSection: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: Colors.text,
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    color: Colors.text,
    lineHeight: 24,
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  infoText: {
    fontSize: 16,
    color: Colors.text,
    marginLeft: 8,
  },
  budgetSection: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  budgetContainer: {
    marginTop: 8,
  },
  budgetInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  budgetLabel: {
    fontSize: 16,
    color: Colors.textSecondary,
  },
  budgetTotal: {
    fontSize: 16,
    fontWeight: "bold",
    color: Colors.text,
  },
  budgetSpent: {
    fontSize: 16,
    fontWeight: "bold",
    color: Colors.primary,
  },
  budgetProgressContainer: {
    height: 8,
    backgroundColor: Colors.lightGray,
    borderRadius: 4,
    marginVertical: 8,
  },
  budgetProgress: {
    height: "100%",
    backgroundColor: Colors.primary,
    borderRadius: 4,
  },
  budgetRemaining: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: "right",
  },
  upcomingSection: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  viewAllButton: {
    alignItems: "center",
    paddingVertical: 12,
    marginTop: 8,
  },
  viewAllText: {
    fontSize: 16,
    color: Colors.primary,
    fontWeight: "500",
  },
  itineraryContainer: {
    padding: 16,
  },
  documentsContainer: {
    padding: 16,
  },
  documentItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  documentIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: `${Colors.primary}15`,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
  },
  documentInfo: {
    flex: 1,
  },
  documentTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: Colors.text,
    marginBottom: 4,
  },
  documentType: {
    fontSize: 14,
    color: Colors.textSecondary,
    textTransform: "capitalize",
  },
  bulletinContainer: {
    padding: 16,
  },
  announcementItem: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  announcementHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  announcementIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: `${Colors.primary}15`,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  announcementTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: Colors.text,
    flex: 1,
  },
  announcementContent: {
    fontSize: 14,
    color: Colors.text,
    marginBottom: 8,
    lineHeight: 20,
  },
  announcementMeta: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  announcementAuthor: {
    fontSize: 12,
    color: Colors.textSecondary,
    fontWeight: "500",
  },
  announcementDate: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
    backgroundColor: Colors.white,
    borderRadius: 12,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  emptyStateText: {
    fontSize: 16,
    color: Colors.textSecondary,
    marginBottom: 16,
  },
  addButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  addButtonText: {
    color: Colors.white,
    fontSize: 14,
    fontWeight: "600",
  },

  dateColumn: {
    width: 60,
    alignItems: "flex-start",
    height: "100%",
    marginTop: 30,
  },
  day: { color: "#000", fontSize: 16, fontWeight: "bold" },
  month: { color: "#000", fontSize: 12, fontWeight: "bold" },
  dateNumber: { color: "#000", fontSize: 20, fontWeight: "bold" },
  card: {
    flex: 1,
    borderRadius: 8,
    // padding: 10,
    marginLeft: 10,
    position: "relative",
    overflow: "hidden",
    height: 160,
    marginVertical: 10,
    backgroundColor: "rgba(0, 0, 0, 0.8)",
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  title: { color: "#fff", fontSize: 18, fontWeight: "bold" },
  subTitle: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    maxWidth: 200,
    marginTop: 10,
  },
  editIcon: {
    width: 20,
    height: 100,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginRight: 10,
  },
  note: { color: "#fff", marginTop: 5 },
  fab: {
    position: "absolute",
    bottom: 20,
    right: 20,
    backgroundColor: "#fff",
    borderRadius: 30,
    padding: 12,
    elevation: 6,
  },

  cardOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.4)", // dark transparent overlay
    padding: 12,
    justifyContent: "space-between",
  },

  cardWrapper: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
});
