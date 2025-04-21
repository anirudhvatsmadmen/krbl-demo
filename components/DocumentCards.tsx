import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { FileText, Passport, Ticket, FileCheck, Shield, Clock } from 'lucide-react-native';
import Colors from '../constants/Colors';
import { Document } from '../type/trip';

interface DocumentCardProps {
  document: Document;
  onPress?: () => void;
}

const DocumentCard: React.FC<DocumentCardProps> = ({ document, onPress }) => {
  const getDocumentIcon = () => {
    switch (document.type) {
      case 'passport':
        return <Passport size={24} color={Colors.primary} />;
      case 'visa':
        return <FileCheck size={24} color={Colors.primary} />;
      case 'ticket':
        return <Ticket size={24} color={Colors.primary} />;
      case 'reservation':
        return <Clock size={24} color={Colors.primary} />;
      case 'insurance':
        return <Shield size={24} color={Colors.primary} />;
      default:
        return <FileText size={24} color={Colors.primary} />;
    }
  };

  const formatExpiryDate = (dateString?: string) => {
    if (!dateString) return null;
    
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const isExpiringSoon = (dateString?: string) => {
    if (!dateString) return false;
    
    const expiryDate = new Date(dateString);
    const today = new Date();
    const diffTime = expiryDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays > 0 && diffDays < 30;
  };

  const isExpired = (dateString?: string) => {
    if (!dateString) return false;
    
    const expiryDate = new Date(dateString);
    const today = new Date();
    
    return expiryDate < today;
  };

  return (
    <TouchableOpacity 
      style={styles.container} 
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={styles.iconContainer}>
        {getDocumentIcon()}
      </View>
      
      <View style={styles.content}>
        <Text style={styles.title}>{document.title}</Text>
        
        {document.expiryDate && (
          <View style={styles.expiryContainer}>
            <Text style={[
              styles.expiryText,
              isExpired(document.expiryDate) && styles.expiredText,
              isExpiringSoon(document.expiryDate) && styles.expiringSoonText
            ]}>
              {isExpired(document.expiryDate) 
                ? 'Expired: ' 
                : isExpiringSoon(document.expiryDate) 
                  ? 'Expires soon: ' 
                  : 'Expires: '
              }
              {formatExpiryDate(document.expiryDate)}
            </Text>
          </View>
        )}
        
        {document.notes && (
          <Text style={styles.notes} numberOfLines={2}>
            {document.notes}
          </Text>
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
    padding: 16,
    marginBottom: 12,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.lightGray,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 4,
  },
  expiryContainer: {
    marginBottom: 4,
  },
  expiryText: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  expiredText: {
    color: Colors.error,
    fontWeight: '500',
  },
  expiringSoonText: {
    color: Colors.warning,
    fontWeight: '500',
  },
  notes: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
});

export default DocumentCard;