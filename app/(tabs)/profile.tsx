import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Alert,
} from "react-native";
import { Stack, useFocusEffect, useRouter } from "expo-router";
import {
  Settings,
  LogOut,
  Globe,
  CreditCard,
  Bell,
  Shield,
  HelpCircle,
  MessageSquare,
  Camera,
} from "lucide-react-native";
import { useUserStore } from "@/store/user-store";
import Colors from "../../constants/Colors";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  getUserProfile,
  getUserSavePost,
  logoutUser,
  userEditProfile,
} from "@/redux/features/user/userSlice";
import { useDispatch, useSelector } from "react-redux";
import * as ImagePicker from "expo-image-picker";
import { uploadFileToS3 } from "@/utils/uploadFileToS3";

export default function ProfileScreen() {
  const router: any = useRouter();
  const dispatch: any = useDispatch();
  const { userData, isLoading, isError, message } = useSelector(
    (state: any) => state.user
  );

  // const { userPost } = useSelector(
  //   (state: any) => state.userPost
  // );

  // console.log("userPost", userPost);
  const [avatar, setAvatar] = useState<any>(null);

  const userProfile = userData?.data;
  const [user, setUser] = useState<any>(null);
  const [postData, setPostData] = useState([]);
  const handleEditProfile = () => {
    router.push("/profile/edit-profile");
  };

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
        base64: false,
      });

      if (!result.canceled && result.assets.length > 0) {
        const selectedImage = result.assets[0];
        setAvatar(selectedImage);

        const uploadedImageUrl = await uploadFileToS3(selectedImage);

        const payload = {
          avatar: uploadedImageUrl,
        } as any;

        dispatch(userEditProfile(payload));
      }
    } catch (error) {
      console.error("Error picking or uploading image:", error);
    }
  };

  const handleSettings = () => {
    // router.push('/profile/settings');
  };

  const handleLogout = async () => {
    try {
      // await AsyncStorage.removeItem("user");
      dispatch(logoutUser());
      setUser(null);
      router.push("/auth/sign-in");
    } catch (error) {
      Alert.alert("Logout Error", "Something went wrong while logging out.");
    }
  };

  // const getUserFromStorage = async () => {
  //   try {
  //     const userData = await AsyncStorage.getItem("user");

  //     if (userData) {
  //       const userJson = JSON.parse(userData);
  //       setUser(userJson.data.user);
  //     }
  //   } catch (error) {
  //     console.error("Error retrieving user from storage:", error);
  //   }
  // };

  // useEffect(() => {
  //   getUserFromStorage();
  // }, []);

  // useEffect(() => {}, [dispatch]);

  useFocusEffect(
    React.useCallback(() => {
      const fetchUserProfile = async () => {
        await dispatch(getUserProfile());
        const data = await dispatch(getUserSavePost());
        setPostData(data.payload);
      };

      fetchUserProfile();
    }, [dispatch])
  );

  const handleNavigate = (route: any) => {
    router.push(route);
  };

  // if (!user) {
  //   return (
  //     <View style={styles.container}>
  //       <Text>Please log in to view your profile.</Text>
  //     </View>
  //   );
  // }

  const handleSavedPress = () => {
    router.push("/saved-post"); // Replace with your actual screen name
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: "Profile",
          headerTitleAlign: "center",
        }}
      />
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.settingsButton}
            onPress={handleSettings}
          >
            <Settings size={24} color={Colors.text} />
          </TouchableOpacity>
        </View>

        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.profileSection}>
            <TouchableOpacity
              style={styles.avatarContainer}
              onPress={pickImage}
            >
              <View style={styles.avatar}>
                {avatar?.uri || userProfile?.avatar ? (
                  <Image
                    source={{ uri: avatar?.uri || userProfile?.avatar }}
                    style={styles.avatarImage}
                  />
                ) : (
                  <View style={styles.textContainer}>
                    <Text style={styles.avatarText}>
                      {userProfile?.firstName?.charAt(0).toUpperCase() ?? "A"}
                    </Text>
                  </View>
                )}

                {/* Camera Icon Overlay */}
                <View style={styles.cameraIconWrapper}>
                  <Camera size={18} color="#fff" />
                </View>
              </View>
            </TouchableOpacity>

            <Text
              style={styles.name}
            >{`${userProfile?.firstName} ${userProfile?.lastName}`}</Text>
            <Text style={styles.email}>{userProfile?.email}</Text>

            <TouchableOpacity
              style={styles.editButton}
              onPress={handleEditProfile}
            >
              <Text style={styles.editButtonText}>Edit Profile</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.statsSection}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>1</Text>
              <Text style={styles.statLabel}>Trips</Text>
            </View>

            <View style={styles.statDivider} />

            <TouchableOpacity onPress={handleSavedPress}>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{postData?.length}</Text>
                <Text style={styles.statLabel}>Saved</Text>
              </View>
            </TouchableOpacity>

            <View style={styles.statDivider} />

            <View style={styles.statItem}>
              <Text style={styles.statNumber}>0</Text>
              <Text style={styles.statLabel}>Following</Text>
            </View>
          </View>

          <View style={styles.menuSection}>
            {/* <TouchableOpacity
              style={styles.menuItem}
              onPress={() => handleNavigate("/profile/language")}
            >
              <View style={styles.menuIconContainer}>
                <Globe size={20} color={Colors.primary} />
              </View>
              <Text style={styles.menuText}>Language</Text>
            </TouchableOpacity> */}

            {/* <TouchableOpacity
              style={styles.menuItem}
              onPress={() => handleNavigate("/profile/payment")}
            >
              <View style={styles.menuIconContainer}>
                <CreditCard size={20} color={Colors.primary} />
              </View>
              <Text style={styles.menuText}>Payment Methods</Text>
            </TouchableOpacity> */}

            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => handleNavigate("/profile/notifications")}
            >
              <View style={styles.menuIconContainer}>
                <Bell size={20} color={Colors.primary} />
              </View>
              <Text style={styles.menuText}>Notifications</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => handleNavigate("/profile/privacy")}
            >
              <View style={styles.menuIconContainer}>
                <Shield size={20} color={Colors.primary} />
              </View>
              <Text style={styles.menuText}>Privacy & Security</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => handleNavigate("/profile/help")}
            >
              <View style={styles.menuIconContainer}>
                <HelpCircle size={20} color={Colors.primary} />
              </View>
              <Text style={styles.menuText}>Help & Support</Text>
            </TouchableOpacity>
            {/* 
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => handleNavigate("/profile/feedback")}
            >
              <View style={styles.menuIconContainer}>
                <MessageSquare size={20} color={Colors.primary} />
              </View>
              <Text style={styles.menuText}>Give Feedback</Text>
            </TouchableOpacity> */}
          </View>

          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <LogOut size={20} color={Colors.error} />
            <Text style={styles.logoutText}>Log Out</Text>
          </TouchableOpacity>

          <View style={styles.versionContainer}>
            <Text style={styles.versionText}>Version 1.0.0</Text>
          </View>
        </ScrollView>
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
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: Colors.text,
  },
  settingsButton: {
    padding: 8,
  },
  profileSection: {
    alignItems: "center",
    paddingVertical: 24,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 16,
  },
  name: {
    fontSize: 24,
    fontWeight: "bold",
    color: Colors.text,
    marginBottom: 4,
    marginTop: 10,
  },
  email: {
    fontSize: 16,
    color: Colors.textSecondary,
    marginBottom: 16,
  },
  editButton: {
    paddingVertical: 8,
    paddingHorizontal: 24,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  editButtonText: {
    fontSize: 14,
    color: Colors.primary,
    fontWeight: "500",
  },
  statsSection: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 16,
    marginHorizontal: 16,
    backgroundColor: Colors.white,
    borderRadius: 12,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    marginBottom: 24,
  },
  statItem: {
    alignItems: "center",
  },
  statNumber: {
    fontSize: 20,
    fontWeight: "bold",
    color: Colors.text,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  statDivider: {
    width: 1,
    height: "60%",
    backgroundColor: Colors.border,
    alignSelf: "center",
  },
  menuSection: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    marginHorizontal: 16,
    paddingVertical: 8,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    marginBottom: 24,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  menuIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: `${Colors.primary}15`,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
  },
  menuText: {
    fontSize: 16,
    color: Colors.text,
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    marginHorizontal: 16,
    backgroundColor: `${Colors.error}15`,
    borderRadius: 12,
    marginBottom: 24,
  },
  logoutText: {
    fontSize: 16,
    color: Colors.error,
    fontWeight: "500",
    marginLeft: 8,
  },
  versionContainer: {
    alignItems: "center",
    marginBottom: 24,
  },
  versionText: {
    fontSize: 14,
    color: Colors.textSecondary,
  },

  avatarImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  textContainer: {
    backgroundColor: "gray",
    width: 100,
    height: 100,
    borderRadius: 50,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    fontSize: 40,
    color: "#fff",
  },

  avatarContainer: {
    alignItems: "center",
    justifyContent: "center",
  },

  cameraIconWrapper: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "#000",
    borderRadius: 12,
    padding: 4,
    justifyContent: "center",
    alignItems: "center",
  },
});
