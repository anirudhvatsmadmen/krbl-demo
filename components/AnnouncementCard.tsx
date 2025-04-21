import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { AlertCircle, Bell, BellRing } from 'lucide-react-native';
import Colors from '../constants/Colors';
import { Announcement } from '../type/trip';

interface AnnouncementCardProps {
  announcement: Announcement;
  onPress?: () => void;
}

const AnnouncementCard: React.FC<AnnouncementCardProps> = ({ 
  announcement, 
  onPress 
}) => {
  const getPriorityColor = () => {
    switch (announcement.priority) {
      case 'high':
        return Colors.error;
      case 'medium':
        return Colors.warning;
      default:
        return Colors.info;
    }
  };

  const getPriorityIcon = () => {
    switch (announcement.priority) {
      case 'high':
        return <BellRing size={24} color={Colors.error} />;
      case 'medium':
        return <Bell size={24} color={Colors.warning} />;
      default:
        return <AlertCircle size={24} color={Colors.info} />;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, { 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <TouchableOpacity 
      style={[
        styles.container,
        { borderLeftColor: getPriorityColor() }
      ]} 
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <View style={[
            styles.iconContainer,
            { backgroundColor: `${getPriorityColor()}15` }
          ]}>
            {getPriorityIcon()}
          </View>
          <Text style={styles.title}>{announcement.title}</Text>
        </View>
        <View style={styles.metaRow}>
          <Text style={styles.author}>{announcement.author}</Text>
          <Text style={styles.date}>{formatDate(announcement.createdAt)}</Text>
        </View>
      </View>
      
      <Text style={styles.content}>{announcement.content}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderLeftWidth: 4,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  header: {
    marginBottom: 12,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.text,
    flex: 1,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  author: {
    fontSize: 14,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  date: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  content: {
    fontSize: 15,
    color: Colors.text,
    lineHeight: 22,
  },
});

export default AnnouncementCard;