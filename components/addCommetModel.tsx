import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Modal,
  FlatList,
  Image,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  Pressable,
  ActivityIndicator,
} from "react-native";
import React, { useState, useEffect } from "react";
import { Stack, useRouter, useFocusEffect } from "expo-router";
import { useDispatch, useSelector } from "react-redux";
import {
  getSingleMedia,
  UserAddComment,
  userGetComment,
} from "@/redux/features/media/mediaSlice";
import CustomLoader from "@/components/CustomLoader";
import { SafeAreaView } from "react-native-safe-area-context";

interface AddCommentModalProps {
  visible: boolean;
  postId: string;
  onClose: () => void;
}

interface Comment {
  _id: string;
  text: string;
  user: {
    firstName?: string;
    image?: string;
  };
}

export default function AddCommentModal({
  visible,
  postId,
  onClose,
}: AddCommentModalProps) {
  const dispatch = useDispatch<any>();
  const router = useRouter<any>();

  const { getCommentInfo, isLoading } = useSelector(
    (state: any) => state.media
  );

  const [text, setText] = useState("");
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(false);
  const [post, setPost] = useState<any>(null);

  const fetchPost = async (id: string) => {
    try {
      const response = await dispatch(getSingleMedia(id));
      setPost(response?.payload?.data);
    } catch (error) {
      console.error("Error fetching post:", error);
    }
  };

  const fetchComments = async (id: string) => {
    try {
      setLoading(true);
      await dispatch(userGetComment(id));
    } catch (error) {
      console.error("Error fetching comments:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddComment = async () => {
    if (!text.trim()) return;
    try {
      setLoading(true);
      await dispatch(UserAddComment({ mediaId: postId, text }));
      setText("");
      fetchComments(postId);
    } catch (error) {
      console.error("Error adding comment:", error);
    } finally {
      setLoading(false);
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
        fetchPost(postId);
        fetchComments(postId);
      }
      return () => {};
    }, [postId])
  );

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.container}>
          <View style={styles.modalContent}>
            <Stack.Screen
              options={{ title: "Comments", headerTitleAlign: "center" }}
            />
            <KeyboardAvoidingView
              style={{ flex: 1 }}
              behavior={Platform.OS === "ios" ? "padding" : undefined}
            >
              {post?.imageUrl && (
                <Image
                  source={{ uri: post.imageUrl }}
                  style={styles.image}
                  resizeMode="cover"
                />
              )}

              <Text style={styles.commentsHeader}>Comments</Text>
              {loading ? (
                <View style={styles.loaderContainer}>
                  <ActivityIndicator size="large" color="#000" />
                  <Text style={styles.loadingText}>Loading comments...</Text>
                </View>
              ) : comments.length > 0 ? (
                <FlatList
                  data={comments}
                  keyExtractor={(item) => item._id}
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

              <View style={styles.inputContainer}>
                <TextInput
                  placeholder="Write a comment..."
                  value={text}
                  onChangeText={setText}
                  style={styles.input}
                />
                <Button title="Post" onPress={handleAddComment} />
              </View>

              {/* <CustomLoader visible={loading} message="Please wait..." /> */}
            </KeyboardAvoidingView>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#00000088",
    justifyContent: "flex-end",
  },
  modalContent: {
    flex: 1,
    backgroundColor: "#fff",
    marginTop: 50,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 15,
    paddingHorizontal: 15,
    overflow: "hidden",
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
    position: "absolute",
    bottom: 20,
    width: "100%",
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
    paddingLeft: 42,
  },
  noComments: {
    textAlign: "center",
    color: "#666",
    padding: 20,
  },
  closeButton: {
    alignItems: "center",
    padding: 12,
    backgroundColor: "#f2f2f2",
    marginTop: 10,
    borderRadius: 10,
    marginBottom: 20,
  },
  closeText: {
    fontSize: 16,
    color: "#333",
    fontWeight: "500",
  },

  loaderContainer: {
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 20,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#666",
  },
});
