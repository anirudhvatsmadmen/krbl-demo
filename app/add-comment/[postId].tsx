// app/add-comment/[postId].tsx
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  Image,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import {
  Stack,
  useLocalSearchParams,
  useRouter,
  useFocusEffect,
} from "expo-router";
import { useDispatch, useSelector } from "react-redux";
import {
  getSingleMedia,
  UserAddComment,
  userGetComment,
} from "@/redux/features/media/mediaSlice";
import CustomLoader from "@/components/CustomLoader";
import { SafeAreaView } from "react-native-safe-area-context";

const AddComment = () => {
  const dispatch: any = useDispatch();
  const router: any = useRouter();
  const { postId } = useLocalSearchParams();

  const { getCommentInfo, isLoading, isError, message } = useSelector(
    (state: any) => state.media
  );

  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchPost = async (id: any) => {
    try {
      await dispatch(getSingleMedia(id));
    } catch (error) {
      console.error("Error fetching post:", error);
    }
  };

  const fetchComments = async (id: any) => {
    try {
      setLoading(true);
      await dispatch(userGetComment(id));
      setLoading(false);
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  };

  const handleAddComment = async () => {
    if (!text.trim()) return;

    try {
      setLoading(true);
      await dispatch(UserAddComment({ mediaId: postId, text } as any));
      setText("");
      fetchComments(postId);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error("Error adding comment:", error);
    }
  };

  useEffect(() => {
    if (getCommentInfo?.data) {
      setComments(getCommentInfo.data);
    }
  }, [getCommentInfo]);

  useFocusEffect(
    React.useCallback(() => {
      if (postId) {
        // Fetch both post and comments when screen comes into focus
        fetchPost(postId);
        fetchComments(postId);
      }

      return () => {
        // Optional cleanup if needed
      };
    }, [postId])
  );

  return (
    <>
      <Stack.Screen
        options={{
          title: "Comments",
          headerTitleAlign: "center",
        }}
      />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View style={styles.container}>
          {post && (
            <Image
              source={{ uri: post?.imageUrl }}
              style={styles.image}
              resizeMode="cover"
            />
          )}
          <Text style={styles.commentsHeader}>Comments</Text>
          {comments && comments.length > 0 ? (
            <FlatList
              data={comments}
              keyExtractor={(item) => item?._id}
              renderItem={({ item }) => (
                <View style={styles.commentItem}>
                  <View style={styles.commentHeader}>
                    <Image
                      source={{
                        uri:
                          item?.user?.image ||
                          "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=1780&auto=format&fit=crop",
                      }}
                      style={styles.userImage}
                    />
                    <Text style={styles.commentUser}>
                      {item?.user?.firstName || "User"}
                    </Text>
                  </View>
                  <Text style={styles.commentText}>{item?.text}</Text>
                </View>
              )}
            />
          ) : (
            <Text style={styles.noComments}>No comments yet</Text>
          )}
        </View>

        <View style={styles.inputContainer}>
          <TextInput
            placeholder="Write a comment..."
            value={text}
            onChangeText={setText}
            style={styles.input}
          />
          <Button title="Post" onPress={handleAddComment} disabled={false} />
        </View>
      </KeyboardAvoidingView>
      <SafeAreaView>
        <CustomLoader visible={loading} message="Please wait..." />
      </SafeAreaView>
    </>
  );
};

export default AddComment;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  image: {
    width: "100%",
    height: 250,
    borderRadius: 10,
    marginBottom: 10,
  },
  commentsHeader: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  commentItem: {
    paddingVertical: 10,
    borderBottomWidth: 0.5,
    borderColor: "#ccc",
    marginBottom: 5,
  },
  commentUser: {
    fontWeight: "600",
  },
  inputContainer: {
    flexDirection: "row",
    padding: 10,
    borderTopWidth: 1,
    borderColor: "#ddd",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  input: {
    flex: 1,
    backgroundColor: "#f1f1f1",
    padding: 8,
    borderRadius: 6,
    marginRight: 10,
  },
  commentHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
  },
  userImage: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 10,
  },
  commentText: {
    fontSize: 14,
    color: "#333",
    paddingLeft: 42, // Indent text to align with username
  },
  noComments: {
    textAlign: "center",
    color: "#666",
    padding: 20,
  },
});
