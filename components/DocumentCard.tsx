import React, { useState } from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { MoreVertical } from "lucide-react-native";

const DocumentCard = ({ imageSrc, title, onDelete, onDownload, onPress }) => {
  const [menuVisible, setMenuVisible] = useState(false);

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
      <View style={styles.card}>
        <Image source={{ uri: imageSrc }} style={styles.image} />
        <Text style={styles.title}>{title}</Text>

        <TouchableOpacity
          style={styles.menuButton}
          onPress={() => setMenuVisible(!menuVisible)}
        >
          <MoreVertical color="white" size={20} />
        </TouchableOpacity>

        {menuVisible && (
          <View style={styles.dropdownMenu}>
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => {
                setMenuVisible(false);
                onDelete();
              }}
            >
              <Text>Delete</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => {
                setMenuVisible(false);
                onDownload();
              }}
            >
              <Text>Download</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    width: 160,
    backgroundColor: "#000",
    borderColor: "#666",
    borderWidth: 1,
    borderRadius: 10,
    overflow: "visible",
    marginBottom: 20,
    paddingBottom: 10,
  },
  image: {
    width: "100%",
    height: 120,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  title: {
    padding: 10,
    color: "white",
    textAlign: "center",
  },
  menuButton: {
    position: "absolute",
    top: 8,
    right: 8,
    padding: 5,
    zIndex: 2,
  },
  dropdownMenu: {
    position: "absolute",
    top: 35,
    right: 8,
    backgroundColor: "white",
    borderRadius: 6,
    paddingVertical: 6,
    elevation: 5,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    zIndex: 3,
  },
  menuItem: {
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
});

export default DocumentCard;
