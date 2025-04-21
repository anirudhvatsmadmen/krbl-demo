import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import React, { useState } from "react";
import Colors from "@/constants/Colors";
import SocialPostCardView from "@/components/SocialPostCardView";
import { SafeAreaView } from "react-native-safe-area-context";
import { Plus } from "lucide-react-native";
import { Stack, useFocusEffect } from "expo-router";
import { useDispatch, useSelector } from "react-redux";
import { getUserSavePost } from "@/redux/features/user/userSlice";
import CustomLoader from "@/components/CustomLoader";

const UserSavePost = () => {
  const dispatch: any = useDispatch();
  const [postData, setPostData] = useState([]);
  const [loading, setLoading] = useState(false);

  useFocusEffect(
    React.useCallback(() => {
      const fetchUserProfile = async () => {
        const data = await dispatch(getUserSavePost());
        setPostData(data.payload);
      };

      fetchUserProfile();
    }, [dispatch])
  );
  return (
    <>
      <Stack.Screen
        options={{
          title: "Saved Post",
          headerTitleAlign: "center",
        }}
      />
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}></Text>
        </View>

        <View style={styles.filterContainer}>
          {/* <TouchableOpacity
          style={[
            styles.filterTab,
            filter === "all" && styles.activeFilterTab,
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
        </TouchableOpacity> */}

          {/* <TouchableOpacity
          style={[
            styles.filterTab,
            filter === "following" && styles.activeFilterTab,
          ]}
          onPress={() => setFilter("following")}
        >
          <Text
            style={[
              styles.filterText,
              filter === "following" && styles.activeFilterText,
            ]}
          >
            Following
          </Text>
        </TouchableOpacity> */}

          {/* <TouchableOpacity
          style={[
            styles.filterTab,
            filter === "saved" && styles.activeFilterTab,
          ]}
          onPress={() => setFilter("saved")}
        >
          <Text
            style={[
              styles.filterText,
              filter === "saved" && styles.activeFilterText,
            ]}
          >
            Saved
          </Text>
        </TouchableOpacity> */}
        </View>

        {
          <FlatList
            data={postData.slice().reverse()}
            keyExtractor={(item) => item?._id}
            renderItem={({ item }) => (
              <SocialPostCardView
                post={item}
                // onLike={() => handleLike(item?._id)}
                // onComment={() => handleComment(item?._id)}
                // onShare={() => handleShare(item)}
                // onSave={() => handleSave(item?._id)}
                // onUserPress={() => handleUserPress(item?.userId)}
                // isSaved={user?.savedPosts.includes(item?._id)}
                // isLiked={item.likes?.some(
                //   (like: { user: { _id: any } }) =>
                //     like.user._id === loginUser?.id
                // )}
              />
            )}
            contentContainerStyle={styles?.listContent}
            showsVerticalScrollIndicator={false}
          />
        }

        <CustomLoader visible={loading} message="Please wait..." />
      </SafeAreaView>
    </>
  );
};

export default UserSavePost;

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
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: Colors.text,
  },
  headerButtons: {
    flexDirection: "row",
    alignItems: "center",
  },
  filterButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.lightGray,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  filterContainer: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  filterTab: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 12,
  },
  activeFilterTab: {
    borderBottomWidth: 2,
    borderBottomColor: Colors.primary,
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
