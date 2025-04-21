import React, { useRef, useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import {
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  MoreHorizontal,
  Play,
} from "lucide-react-native";
import Colors from "../constants/Colors";
import { Post } from "../type/trip";
import { ResizeMode, Video } from "expo-av";

interface SocialPostCardProps {
  post: Post;
  onLike?: () => void;
  onComment?: () => void;
  onShare?: () => void;
  onSave?: () => void;
  onUserPress?: () => void;
  isSaved?: boolean;
}

const SocialPostCard: React.FC<any> = ({
  post,
  onLike,
  onComment,
  onShare,
  onSave,
  onUserPress,
  isLiked,

  isSaved = false,
}) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
    const diffMinutes = Math.floor(diffTime / (1000 * 60));

    if (diffDays > 0) {
      return `${diffDays}d ago`;
    } else if (diffHours > 0) {
      return `${diffHours}h ago`;
    } else if (diffMinutes > 0) {
      return `${diffMinutes}m ago`;
    } else {
      return "Just now";
    }
  };

  const screenWidth = Dimensions.get("window").width;
  const imageWidth = screenWidth - 32; // Accounting for container padding

  // const isVideo = (url: string) => {
  //   return url?.toLowerCase().endsWith(".mp4");
  // };

  const videoRef = useRef<Video>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onUserPress} style={styles.userInfo}>
          <Image
            source={{
              uri:
                post.userAvatar ||
                "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=1780&auto=format&fit=crop",
            }}
            style={styles.avatar}
          />
          <View>
            <Text
              style={styles.userName}
            >{`${post?.user?.firstName} ${post?.user?.lastName}`}</Text>
            <Text style={styles.timestamp}>{formatDate(post.createdAt)}</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.moreButton}>
          <MoreHorizontal size={20} color={Colors.textSecondary} />
        </TouchableOpacity>
      </View>

      {post.caption && <Text style={styles.content}>{post.caption}</Text>}

      {/* {post.mediaUrls?.length > 0 && (
        <View style={styles.mediaContainer}>
          {post.content?.length === 1 ? (
            <Image
              source={{ uri: post.content }}
              style={[
                styles.singleImage,
                { width: imageWidth, height: imageWidth * 0.75 },
              ]}
              resizeMode="cover"
            />
          ) : (
            <View style={styles.mediaGrid}>
              {post.mediaUrls.slice(0, 4).map((url: any, index: any) => (
                <Image
                  key={index}
                  source={{ uri: url }}
                  style={[
                    styles.gridImage,
                    {
                      width: (imageWidth - 4) / 2,
                      height: (imageWidth - 4) / 2,
                    },
                  ]}
                  resizeMode="cover"
                />
              ))}
              {post.mediaUrls.length > 4 && (
                <View
                  style={[
                    styles.moreImagesOverlay,
                    {
                      width: (imageWidth - 4) / 2,
                      height: (imageWidth - 4) / 2,
                    },
                  ]}
                >
                  <Text style={styles.moreImagesText}>
                    +{post.mediaUrls.length - 4}
                  </Text>
                </View>
              )}
            </View>
          )}
        </View>
      )} */}
      <View style={styles.mediaContainer}>
        {post.content?.endsWith(".mp4") ? (
          <TouchableOpacity
            style={[
              styles.videoWrapper,
              { width: imageWidth, height: imageWidth * 0.75 },
            ]}
            onPress={() => {
              // Optional: open full screen video or play inline
            }}
          >
            <TouchableOpacity
              activeOpacity={1}
              style={[
                styles.videoWrapper,
                { width: imageWidth, height: imageWidth * 0.75 },
              ]}
              onPress={async () => {
                if (videoRef.current) {
                  if (isPlaying) {
                    await videoRef.current.pauseAsync();
                    setIsPlaying(false);
                  } else {
                    await videoRef.current.playAsync();
                    setIsPlaying(true);
                  }
                }
              }}
            >
              <Video
                ref={videoRef}
                source={{ uri: post.content }}
                style={{
                  width: imageWidth,
                  height: imageWidth * 0.75,
                  borderRadius: 10,
                  backgroundColor: "black",
                }}
                isLooping
                shouldPlay={false}
                useNativeControls={false}
                resizeMode={ResizeMode.CONTAIN}
              />
              {!isPlaying && (
                <View style={styles.playIconOverlay}>
                  <Play size={40} color="#fff" />
                </View>
              )}
            </TouchableOpacity>
          </TouchableOpacity>
        ) : (
          <View>
            <Image
              source={{ uri: post.content }}
              style={[
                styles.singleImage,
                { width: imageWidth, height: imageWidth * 0.75 },
              ]}
              resizeMode="cover"
            />
          </View>
        )}
      </View>
      <View style={styles.stats}>
        <Text style={styles.statsText}>{post.likes.length} likes</Text>
        <Text style={styles.statsText}>{post.comments.length} comments</Text>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity style={styles.actionButton} onPress={onLike}>
          <Heart
            size={20}
            color={Colors.textSecondary}
            fill={isLiked ? "red" : "transparent"}
          />
          <Text style={styles.actionText}>Like</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton} onPress={onComment}>
          <MessageCircle size={20} color={Colors.textSecondary} />
          <Text style={styles.actionText}>Comment</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton} onPress={onShare}>
          <Share2 size={20} color={Colors.textSecondary} />
          <Text style={styles.actionText}>Share</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton} onPress={onSave}>
          <Bookmark
            size={20}
            color={isSaved ? Colors.primary : Colors.textSecondary}
            fill={isSaved ? Colors.primary : Colors.transparent}
          />
          <Text
            style={[styles.actionText, isSaved && { color: Colors.primary }]}
          >
            {isSaved ? "Saved" : "Save"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
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
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  userName: {
    fontSize: 16,
    fontWeight: "bold",
    color: Colors.text,
  },
  timestamp: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  moreButton: {
    padding: 4,
  },
  content: {
    fontSize: 16,
    color: Colors.text,
    marginBottom: 12,
    lineHeight: 22,
  },
  mediaContainer: {
    marginBottom: 12,
    borderRadius: 8,
    overflow: "hidden",
  },
  singleImage: {
    borderRadius: 8,
  },
  mediaGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 4,
  },
  gridImage: {
    borderRadius: 8,
    marginBottom: 4,
  },
  moreImagesOverlay: {
    position: "absolute",
    bottom: 4,
    right: 0,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
  },
  moreImagesText: {
    color: Colors.white,
    fontSize: 18,
    fontWeight: "bold",
  },
  stats: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
    marginTop: 5,
  },
  statsText: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  actions: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    paddingTop: 12,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  actionText: {
    marginLeft: 4,
    fontSize: 14,
    color: Colors.textSecondary,
  },

  video: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    borderRadius: 8,
  },
  videoWrapper: {
    borderRadius: 8,
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  playIconOverlay: {
    position: "absolute",
    top: "40%",
    left: "40%",
    zIndex: 10,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    padding: 10,
    borderRadius: 30,
  },
  playIcon: {
    width: 40,
    height: 40,
    tintColor: "#fff",
  },
});

export default SocialPostCard;
