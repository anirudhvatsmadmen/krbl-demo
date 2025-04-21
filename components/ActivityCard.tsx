import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { Plane, Hotel, MapPin, Utensils, Calendar, Clock, Check, X } from 'lucide-react-native';
import Colors from '../constants/Colors';
import { Activity } from '../type/trip';

interface ActivityCardProps {
  activity: Activity;
  onPress?: () => void;
  onToggleComplete?: () => void;
}

const ActivityCard: React.FC<ActivityCardProps> = ({ 
  activity, 
  onPress, 
  onToggleComplete 
}) => {
  const getCategoryIcon = () => {
    switch (activity.category) {
      case 'transportation':
        return <Plane size={20} color={Colors.primary} />;
      case 'accommodation':
        return <Hotel size={20} color={Colors.primary} />;
      case 'sightseeing':
        return <MapPin size={20} color={Colors.primary} />;
      case 'food':
        return <Utensils size={20} color={Colors.primary} />;
      case 'event':
        return <Calendar size={20} color={Colors.primary} />;
      default:
        return <Clock size={20} color={Colors.primary} />;
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <TouchableOpacity 
      style={[
        styles.container, 
        activity.completed && styles.completedContainer
      ]} 
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={styles.timeColumn}>
        <Text style={styles.timeText}>{formatTime(activity.startTime)}</Text>
        <View style={styles.timeConnector} />
        <Text style={styles.timeText}>{formatTime(activity.endTime)}</Text>
      </View>
      
      <View style={styles.contentColumn}>
        <View style={styles.header}>
          <View style={styles.iconContainer}>
            {getCategoryIcon()}
          </View>
          <Text style={styles.title}>{activity.title}</Text>
          
          {onToggleComplete && (
            <TouchableOpacity 
              style={[
                styles.completeButton,
                activity.completed ? styles.completedButton : {}
              ]} 
              onPress={onToggleComplete}
            >
              {activity.completed ? (
                <Check size={16} color={Colors.white} />
              ) : (
                <X size={16} color={Colors.textSecondary} />
              )}
            </TouchableOpacity>
          )}
        </View>
        
        {activity.description && (
          <Text style={styles.description}>{activity.description}</Text>
        )}
        
        {activity.location && (
          <View style={styles.locationRow}>
            <MapPin size={14} color={Colors.textSecondary} />
            <Text style={styles.locationText}>
              {activity.location.name}
            </Text>
          </View>
        )}
        
        {activity.bookingReference && (
          <View style={styles.bookingRow}>
            <Text style={styles.bookingLabel}>Booking Ref:</Text>
            <Text style={styles.bookingValue}>{activity.bookingReference}</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  completedContainer: {
    opacity: 0.7,
    backgroundColor: Colors.lightGray,
  },
  timeColumn: {
    width: 60,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  timeText: {
    fontSize: 12,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  timeConnector: {
    width: 1,
    flex: 1,
    backgroundColor: Colors.border,
    marginVertical: 4,
  },
  contentColumn: {
    flex: 1,
    marginLeft: 12,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.lightGray,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.text,
    flex: 1,
  },
  description: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 8,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  locationText: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginLeft: 4,
  },
  bookingRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  bookingLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginRight: 4,
  },
  bookingValue: {
    fontSize: 12,
    fontWeight: '500',
    color: Colors.primary,
  },
  completeButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.lightGray,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  completedButton: {
    backgroundColor: Colors.success,
  },
});

export default ActivityCard;