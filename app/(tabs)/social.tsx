import React, { useCallback, useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Share,
} from "react-native";
import { Stack, useFocusEffect, useRouter } from "expo-router";
import { Plus, Filter } from "lucide-react-native";
import { useTripStore } from "@/store/trip-store";
import { useUserStore } from "@/store/user-store";
import SocialPostCard from "@/components/SocialPostCard";
import Colors from "../../constants/Colors";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllMediaInfo,
  mediaLike,
  userSaveMedia,
} from "../../redux/features/media/mediaSlice";
import AsyncStorage from "@react-native-async-storage/async-storage";
import CustomLoader from "@/components/CustomLoader";
import {
  getUserProfile,
  getUserSavePost,
} from "@/redux/features/user/userSlice";
import AddCommentModal from "@/components/addCommetModel";

export default function SocialScreen() {
  const router: any = useRouter();
  const dispatch: any = useDispatch();

  const { media, isLoading, isError, message } = useSelector(
    (state: any) => state.media
  );

  const { posts, likePost } = useTripStore();
  const { user, savePost, unsavePost } = useUserStore();
  const [loginUser, setLoginUser] = useState<any>();
  const [filter, setFilter] = useState<"all" | "following" | "saved">("all");
  const [mediaData, setMediaData] = useState<any[]>([]);
  const [userSavePost, setUserSavePost] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [commentModel, setCommentModel] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);

  const filteredPosts = posts.filter((post) => {
    if (filter === "following") {
      // In a real app, this would filter by followed users
      return true;
    }
    if (filter === "saved") {
      return user?.savedPosts.includes(post.id) || false;
    }
    return true;
  });

  const handleLike = (postId: string) => {
    setMediaData((prevData: any) =>
      prevData.map((post: any) => {
        if (post._id === postId) {
          const alreadyLiked = post.likes.some(
            (like: any) => like.user._id === loginUser?.id
          );

          const updatedLikes = alreadyLiked
            ? post.likes.filter((like: any) => like.user._id !== loginUser?.id)
            : [...post.likes, { user: { _id: loginUser?.id } }];

          return { ...post, likes: updatedLikes };
        }
        return post;
      })
    );

    dispatch(mediaLike(postId));
  };

  const handleComment = (postId: string) => {
    // router.push(`/add-comment/${postId}`);
    setSelectedPostId(postId);
    setCommentModel(true);
  };

  const handleShare = async (post: any) => {
    const isDevelopment = __DEV__;
    const baseURL = isDevelopment
      ? `exp://192.168.0.111:8081`
      : `https://yourapp.com`;

    const postLink = `${baseURL}/post/${post._id}`;
    try {
      const result = await Share.share({
        message: `${post.caption}\n\nCheck this out on MyApp: ${postLink}`,
        // message: `${post.caption}\n\nCheck this out on MyApp: exp://192.168.0.111:8081/post/${post._id}`
      });

      if (result.action === Share.sharedAction) {
        console.log("✅ Shared successfully");
      } else if (result.action === Share.dismissedAction) {
        console.log("❌ Share dismissed");
      }
    } catch (error) {
      console.error("⚠️ Share error:", error);
    }
  };

  const handleSave = (postId: string) => {
    const isAlreadySaved = userSavePost.some(
      (post: any) => post._id === postId
    );

    if (isAlreadySaved) {
      setUserSavePost((prev) =>
        prev.filter((post: any) => post._id !== postId)
      );
    } else {
      const postToAdd = mediaData.find((post) => post._id === postId);
      if (postToAdd) {
        setUserSavePost((prev) => [...prev, postToAdd]);
      }
    }

    dispatch(userSaveMedia(postId));
  };

  const handleUserPress = (userId: string) => {
    // router.push(`/user/${userId}`);
  };

  const handleCreatePost = () => {
    router.push("/create-post");
  };

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      dispatch(getAllMediaInfo() as any);
      setLoading(false);
    }, [])
  );

  useEffect(() => {
    const getUser = async () => {
      const userData = await AsyncStorage.getItem("user");
      const user = userData ? JSON.parse(userData) : null;
      setLoginUser(user?.data?.user);
      const data = await dispatch(getUserSavePost());
      setUserSavePost(data.payload);
    };
    getUser();
  }, []);

  useEffect(() => {
    if (media?.data) {
      setMediaData(media.data);
    }
  }, [media]);

  return (
    <>
      <Stack.Screen
        options={{
          title: "Social",
          headerTitleAlign: "center",
        }}
      />
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}></Text>

          <View style={styles.headerButtons}>
            <TouchableOpacity
              style={styles.addButton}
              onPress={handleCreatePost}
            >
              <Plus size={24} color={Colors.white} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.filterContainer}></View>

        {
          <FlatList
            data={mediaData.slice().reverse()}
            keyExtractor={(item) => item?._id}
            renderItem={({ item }) => (
              <SocialPostCard
                post={item}
                onLike={() => handleLike(item?._id)}
                onComment={() => handleComment(item?._id)}
                onShare={() => handleShare(item)}
                onSave={() => handleSave(item?._id)}
                onUserPress={() => handleUserPress(item?.userId)}
                isSaved={
                  Array.isArray(userSavePost) &&
                  userSavePost.some((saved) => saved?._id === item?._id)
                }
                isLiked={item.likes?.some(
                  (like: { user: { _id: any } }) =>
                    like.user._id === loginUser?.id
                )}
              />
            )}
            contentContainerStyle={styles?.listContent}
            showsVerticalScrollIndicator={false}
          />
        }
        <CustomLoader visible={loading} message="Please wait..." />
        <AddCommentModal
          visible={commentModel}
          postId={selectedPostId || ""}
          onClose={() => {
            setCommentModel(false);
            setSelectedPostId(null);
          }}
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
