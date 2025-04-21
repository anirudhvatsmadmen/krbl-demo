import React, { useReducer, useState } from "react";
import { Tabs, useRouter } from "expo-router";
import {
  Home,
  Compass,
  Users,
  MessageSquare,
  User,
  Plus,
  FileUp,
} from "lucide-react-native";
import Colors from "../../constants/Colors";
import { Pressable } from "react-native";
import UploadModel from "../../components/UploadModel";

export default function TabLayout() {
  const router: any = useRouter();
  const [isModalVisible, setModalVisible] = useState<any>(false);

  const handlePlusPress = () => {
    // setModalVisible(true);
    router.push("/create-post");
  };

  const closeModal = () => {
    setModalVisible(false);
  };
  return (
    <>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: Colors.primary,
          tabBarInactiveTintColor: Colors.textSecondary,
          tabBarStyle: {
            backgroundColor: Colors.white,
            borderTopColor: Colors.border,
            elevation: 0,
            shadowOpacity: 0,
            height: 60,
            paddingBottom: 8,
          },
          tabBarLabelStyle: {
            fontSize: 12,
            fontWeight: "500",
          },
          headerStyle: {
            backgroundColor: Colors.white,
            elevation: 0,
            shadowOpacity: 0,
            borderBottomColor: Colors.border,
            borderBottomWidth: 1,
          },
          headerTitleStyle: {
            fontWeight: "bold",
            fontSize: 18,
          },
          headerTintColor: Colors.text,
        }}
      >
        {/* <Tabs.Screen
        name="index"
        options={{
          title: "My Event",
          tabBarLabel: "Event",
          tabBarIcon: ({ color, size }) => <Home size={size} color={color} />,
          }}
          /> */}

        <Tabs.Screen
          name="index"
          options={{
            title: "Event days",
            tabBarLabel: "Days",
            tabBarIcon: ({ color, size }) => <Home size={size} color={color} />,
          }}
        />
        {/* <Tabs.Screen
        name="explore"
        options={{
          title: "Explore",
          tabBarIcon: ({ color, size }) => (
            <Compass size={size} color={color} />
            ),
            }}
            /> */}
        <Tabs.Screen
          name="social"
          options={{
            title: "Social",
            tabBarIcon: ({ color, size }) => (
              <Users size={size} color={color} />
            ),
          }}
        />

        <Tabs.Screen
          name="upload"
          options={{
            title: "Post",
            tabBarIcon: ({ color, size }) => <Plus size={size} color={color} />,
          }}
        />

        {/* <Tabs.Screen
          name="upload" // This doesn't need to correspond to an actual file
          options={{
            tabBarLabel: "Post",
            tabBarIcon: ({ color, size }) => <Plus size={size} color={color} />,
            tabBarButton: (props) => (
              <Pressable {...props} onPress={handlePlusPress} />
            ),
          }}
          listeners={{
            tabPress: (e) => {
              e.preventDefault();
              router.push("/create-post");
            },
          }}
        /> */}

        <Tabs.Screen
          name="documents"
          options={{
            title: "Documents",
            tabBarIcon: ({ color, size }) => (
              <FileUp size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: "Profile",
            tabBarIcon: ({ color, size }) => <User size={size} color={color} />,
          }}
        />
      </Tabs>
      {isModalVisible && <UploadModel onClose={closeModal} />}
    </>
  );
}
