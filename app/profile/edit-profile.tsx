import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Image,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { Stack, useRouter } from "expo-router";
import {
  changeUserPassword,
  getUserProfile,
  logoutUser,
  userEditProfile,
} from "@/redux/features/user/userSlice";
import CustomLoader from "@/components/CustomLoader";
import EditPasswordModal from "@/components/EditPasswordModal";

const EditProfileScreen = () => {
  const router: any = useRouter();
  const dispatch: any = useDispatch();
  const { userData, isLoading, isError, message } = useSelector(
    (state: any) => state.user
  );

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [organization, setOrganization] = useState("Your organisation");
  const [bio, setBio] = useState("Write a short bio...");
  const [tags, setTags] = useState("");
  const [avatar, setAvatar] = useState<any>(null);
  const [isEditModalVisible, setEditModalVisible] = useState(false);
  const [isPasswordLoading, setIsPasswordLoading] = useState(false);
  // const [passwordData, setPasswordData] = useState<any>(null);
  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleSaveEdit = async ({ oldPassword, newPassword }: any) => {
    try {
      const payload = {
        currentPassword: oldPassword,
        newPassword: newPassword,
      } as any;
      setIsPasswordLoading(true);
      dispatch(changeUserPassword(payload));
      setIsPasswordLoading(false);
      dispatch(logoutUser());
      router.push("/auth/sign-in");
    } catch (err) {
      setIsPasswordLoading(false);
      console.error("Error changing password:", err);
      alert("Error updating password.");
    }
  };

  // Function to handle the save action
  const handleSave = async () => {
    try {
      const payload = {
        firstName,
        lastName,
        organization,
        bio,
        tags,
      } as any;
      dispatch(userEditProfile(payload));
      router.push("/profile");
    } catch (error) {
      console.error("Error while saving profile:", error);
      alert(
        "Something went wrong while saving your profile. Please try again."
      );
    }
  };

  const handleChangePassword = () => {
    setEditModalVisible(true);
  };

  useEffect(() => {
    if (userData?.data) {
      setFirstName(userData?.data?.firstName || "");
      setLastName(userData?.data?.lastName || "");
      setOrganization(userData?.data?.organizationName || "");
      setBio(userData?.data.bio || "");
      setTags("");
      setAvatar(userData?.data?.avatar || null);
    }
  }, [userData]);

  useEffect(() => {
    const fetchUserProfile = async () => {
      await dispatch(getUserProfile());
    };

    fetchUserProfile();
  }, [dispatch]);

  return (
    <>
      <Stack.Screen
        options={{
          title: "Edit profile",
          headerTitleAlign: "center",
        }}
      />
      <SafeAreaView style={{ flex: 1, backgroundColor: "#121212" }}>
        <ScrollView contentContainerStyle={styles.container}>
          {/* <View style={styles.avatar}>
          <Text style={styles.avatarText}>A</Text>
          </View> */}

          <TouchableOpacity style={styles.avatar}>
            {avatar ? (
              <Image
                source={{
                  uri: typeof avatar === "string" ? avatar : avatar?.uri,
                }}
                style={styles.avatarImage}
              />
            ) : (
              <Text style={styles.avatarText}>
                {firstName ? firstName.charAt(0).toUpperCase() : "A"}
              </Text>
            )}
          </TouchableOpacity>

          <Text style={styles.name}>{`${firstName} ${lastName}`}</Text>

          <TouchableOpacity
            onPress={() => {
              handleChangePassword();
            }}
          >
            <Text style={styles.changePassword}>Change Password</Text>
          </TouchableOpacity>

          <View style={styles.inputBox}>
            <Text style={styles.label}>Email Id</Text>
            <TextInput
              style={styles.input}
              value={userData?.data?.email}
              editable={false}
            />
          </View>

          <View style={styles.inputBox}>
            <Text style={styles.label}>First Name</Text>
            <TextInput
              style={styles.input}
              value={firstName}
              onChangeText={setFirstName}
              placeholder="Anirudh Vats"
            />
          </View>

          <View style={styles.inputBox}>
            <Text style={styles.label}>Last Name</Text>
            <TextInput
              style={styles.input}
              value={lastName}
              onChangeText={setLastName}
              placeholder="Anirudh Vats"
            />
          </View>

          <View style={styles.inputBox}>
            <Text style={styles.label}>organization</Text>
            <TextInput
              style={styles.input}
              value={organization}
              onChangeText={setOrganization}
              placeholder="Your organization"
            />
          </View>

          <View style={styles.inputBox}>
            <Text style={styles.label}>Bio</Text>
            <TextInput
              style={styles.input}
              value={bio}
              onChangeText={setBio}
              placeholder="Write a short bio..."
            />
          </View>

          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.saveButtonText}>Save</Text>
          </TouchableOpacity>
        </ScrollView>

        <CustomLoader visible={isLoading} message="Updating" />

        <EditPasswordModal
          visible={isEditModalVisible}
          onClose={() => setEditModalVisible(false)}
          onSave={handleSaveEdit}
        />

        <CustomLoader
          visible={isPasswordLoading}
          message="Please login again"
        />
      </SafeAreaView>
    </>
  );
};

export default EditProfileScreen;

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#121212",
    margin : 20
  },
  backButton: {
    marginBottom: 10,
  },
  heading: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
    marginBottom: 20,
  },
  avatar: {
    alignSelf: "center",
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#5a4033",
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: {
    fontSize: 40,
    color: "#fff",
  },
  name: {
    color: "#fff",
    textAlign: "center",
    fontSize: 18,
    marginTop: 10,
  },
  changePassword: {
    color: "#33AFFF",
    textAlign: "center",
    marginTop: 5,
    marginBottom: 20,
  },
  inputBox: {
    marginBottom: 15,
  },
  label: {
    color: "#aaa",
    marginBottom: 5,
  },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: "#444",
    color: "#fff",
    paddingVertical: 8,
  },
  saveButton: {
    backgroundColor: "#33AFFF",
    paddingVertical: 12,
    borderRadius: 5,
    marginTop: 30,
    alignItems: "center",
  },
  saveButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },

  avatarImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
});
