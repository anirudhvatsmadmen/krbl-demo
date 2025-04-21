import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";

import { Plus, Search } from "lucide-react-native";
import { useTripStore } from "@/store/trip-store";
import TripCard from "@/components/TripCard";
import Colors from "../../constants/Colors";
import { Stack, useFocusEffect, useRouter } from "expo-router";
import { useDispatch, useSelector } from "react-redux";
import { getAllEvents } from "../../redux/features/event/eventSlice";
import { useIsFocused } from "@react-navigation/native";
import CustomLoader from "@/components/CustomLoader";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function TripsScreen() {
  const dispatch: any = useDispatch();
  const isFocused = useIsFocused();
  const { eventData, isLoading, isError, message } = useSelector(
    (state: any) => state.event
  );

  const router = useRouter();
  const { trips, setCurrentTrip } = useTripStore();
  const [filter, setFilter] = useState<"all" | "active" | "upcoming">("all");
  const [getUser, setGetUSer] = useState(null);

  const handleTripPress = (tripId: string) => {
    setCurrentTrip(tripId);
    router.push(`/trip/${tripId}`);
  };

  const handleAddTrip = () => {
    router.push("/create-event" as any);
  };

  // useEffect(() => {
  //   if (isFocused) {
  //     dispatch(getAllEvents());
  //   }
  // }, []);

  useFocusEffect(
    React.useCallback(() => {
      if (isFocused) {
        dispatch(getAllEvents());
      }
    }, [])
  );

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
          title: "My Event",
          headerTitleAlign: "center",
        }}
      />
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.searchButton}
            // onPress={() => router.push("/search")}
          >
            <Search size={20} color={Colors.textSecondary} />
            <Text style={styles.searchText}>Search trips...</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.addButton} onPress={handleAddTrip}>
            <Plus size={24} color={Colors.white} />
          </TouchableOpacity>
        </View>

        <View style={styles.filterContainer}>
          <TouchableOpacity
            style={[
              styles.filterButton,
              filter === "all" && styles.activeFilterButton,
            ]}
            onPress={() => setFilter("all")}
          >
            <Text
              style={[
                styles.filterText,
                filter === "all" && styles.activeFilterText,
              ]}
            >
              All
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.filterButton,
              filter === "active" && styles.activeFilterButton,
            ]}
            onPress={() => setFilter("active")}
          >
            <Text
              style={[
                styles.filterText,
                filter === "active" && styles.activeFilterText,
              ]}
            >
              Active
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.filterButton,
              filter === "upcoming" && styles.activeFilterButton,
            ]}
            onPress={() => setFilter("upcoming")}
          >
            <Text
              style={[
                styles.filterText,
                filter === "upcoming" && styles.activeFilterText,
              ]}
            >
              Upcoming
            </Text>
          </TouchableOpacity>
        </View>

        {eventData?.data?.length > 0 ? (
          <FlatList
            data={eventData.data}
            keyExtractor={(item) => item._id}
            renderItem={({ item }) => (
              <TripCard trip={item} onPress={() => handleTripPress(item._id)} />
            )}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
          />
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyTitle}>No trips found</Text>
            <Text style={styles.emptyText}>
              {filter === "all"
                ? "You haven't created any trips yet."
                : filter === "active"
                ? "You don't have any active trips."
                : "You don't have any upcoming trips."}
            </Text>
            <TouchableOpacity
              style={styles.createButton}
              onPress={handleAddTrip}
            >
              <Text style={styles.createButtonText}>Create a Trip</Text>
            </TouchableOpacity>
          </View>
        )}

        <CustomLoader visible={isLoading} message="Please wait..." />
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  searchButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.lightGray,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginRight: 12,
  },
  searchText: {
    marginLeft: 8,
    fontSize: 16,
    color: Colors.textSecondary,
  },
  addButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  filterContainer: {
    flexDirection: "row",
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  filterButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginRight: 8,
  },
  activeFilterButton: {
    backgroundColor: `${Colors.primary}15`,
  },
  filterText: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  activeFilterText: {
    color: Colors.primary,
    fontWeight: "600",
  },
  listContent: {
    padding: 16,
  },
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: Colors.text,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 16,
    color: Colors.textSecondary,
    textAlign: "center",
    marginBottom: 24,
  },
  createButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  createButtonText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: "600",
  },
});
