import React from "react";
import { StyleSheet, View, Text, TouchableOpacity, Image } from "react-native";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { Calendar, MapPin } from "lucide-react-native";
import Colors from "../constants/Colors";

interface TripCardProps {
  trip: any;
  onPress?: () => void;
}

const TripCard: React.FC<TripCardProps> = ({ trip, onPress }) => {
  const router = useRouter();

  const handlePress = () => {
    if (onPress) {
      onPress();
    } else {
      router.push(`/trip/${trip.id}`);
    }
  };

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

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={handlePress}
      activeOpacity={0.9}
    >
      <Image
        source={{
          uri:
            trip.coverPicture ||
            "https://cdn.carbonpaper.app/program_images/67ae2b7f6838.contentMobile.jpg",
        }}
        style={styles.image}
      />

      <LinearGradient
        colors={["transparent", "rgba(0,0,0,0.7)"]}
        style={styles.gradient}
      >
        <View style={styles.content}>
          <Text style={styles.title}>{trip.eventName}</Text>

          <View style={styles.infoRow}>
            <MapPin size={16} color={Colors.white} />
            <Text style={styles.infoText}>
              {trip?.destination?.city || "Tokiyo"},
              {trip.destination?.country || "Japan"}
            </Text>
          </View>

          <View style={styles.infoRow}>
            <Calendar size={16} color={Colors.white} />
            <Text style={styles.infoText}>
              {formatDateRange(trip.schedules.from, trip.schedules.to)}
            </Text>
          </View>

          {trip.rsvp === "open invite" && (
            <View style={styles.activeTag}>
              <Text style={styles.activeTagText}>Join</Text>
            </View>
          )}
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 200,
    borderRadius: 16,
    overflow: "hidden",
    marginBottom: 16,
    backgroundColor: Colors.card,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  image: {
    width: "100%",
    height: "100%",
    position: "absolute",
  },
  gradient: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: "70%",
    justifyContent: "flex-end",
  },
  content: {
    padding: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: Colors.white,
    marginBottom: 8,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  infoText: {
    fontSize: 14,
    color: Colors.white,
    marginLeft: 6,
  },
  activeTag: {
    position: "absolute",
    bottom: 16,
    right: 16,
    backgroundColor: Colors.primary,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  activeTagText: {
    color: Colors.white,
    fontSize: 12,
    fontWeight: "bold",
  },
});

export default TripCard;
