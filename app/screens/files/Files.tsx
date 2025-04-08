import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, FlatList, Linking } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import { ref, uploadBytes, getDownloadURL, listAll, getMetadata } from 'firebase/storage';
import { FIREBASE_STORAGE } from '../../../FirebaseConfig';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { useNavigation } from '@react-navigation/native';
import { Colors } from '../../../colors';
import { Appbar } from 'react-native-paper';

interface FileItem {
  name: string;
  url: string;
  initial: string;
  color: string;
  uploadTime: Date;
}

const COLORS = {
  primary: Colors.accent,
  background: Colors.background,
  cardBackground: '#FFFFFF',
  text: Colors.text,
  secondaryText: '#666666',
};

const PASTEL_COLORS = [
  '#FFB5B5', // Light red
  '#FFD1B5', // Light orange
  '#FFFFB5', // Light yellow
  '#B5FFB5', // Light green
  '#B5FFFF', // Light cyan
  '#B5B5FF', // Light blue
  '#FFB5FF', // Light magenta
  '#E6B8B8', // Dusty pink
  '#B8E6E6', // Dusty blue
  '#B8E6B8', // Dusty green
];

const getColorForInitial = (initial: string): string => {
  const index = initial.toLowerCase().charCodeAt(0) % PASTEL_COLORS.length;
  return PASTEL_COLORS[index];
};

const formatUploadTime = (date: Date) => {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (diffInSeconds < 60) {
    return 'Just now';
  } else if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60);
    return `${minutes} ${minutes === 1 ? 'minute' : 'minutes'} ago`;
  } else if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600);
    return `${hours} ${hours === 1 ? 'hour' : 'hours'} ago`;
  } else if (diffInSeconds < 604800) {
    const days = Math.floor(diffInSeconds / 86400);
    return `${days} ${days === 1 ? 'day' : 'days'} ago`;
  } else {
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
};

export default function Files() {
  const navigation = useNavigation<DrawerNavigationProp<any>>();
  const [uploading, setUploading] = useState(false);
  const [files, setFiles] = useState<FileItem[]>([]);

  useEffect(() => {
    loadFiles();
    const interval = setInterval(() => {
      setFiles(prevFiles => [...prevFiles]); // Force re-render to update times
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  const loadFiles = async () => {
    try {
      const storageRef = ref(FIREBASE_STORAGE, 'uploads');
      const result = await listAll(storageRef);
      
      const filesData = await Promise.all(
        result.items.map(async (item) => {
          const [url, metadata] = await Promise.all([
            getDownloadURL(item),
            getMetadata(item)
          ]);
          const initial = item.name.charAt(0).toUpperCase();
          return {
            name: item.name,
            url,
            initial,
            color: getColorForInitial(initial),
            uploadTime: new Date(metadata.timeCreated)
          };
        })
      );
      
      setFiles(filesData.sort((a, b) => b.uploadTime.getTime() - a.uploadTime.getTime()));
    } catch (error) {
      console.error('Error loading files:', error);
    }
  };

  const pickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: '*/*',
        copyToCacheDirectory: true,
      });

      if (result.assets?.[0]) {
        const { uri, name } = result.assets[0];
        await uploadFile(uri, name || 'unnamed_file');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to pick document');
      console.error(error);
    }
  };

  const uploadFile = async (uri: string, fileName: string) => {
    try {
      setUploading(true);
      const storageRef = ref(FIREBASE_STORAGE, `uploads/${fileName}`);
      const response = await fetch(uri);
      const blob = await response.blob();
      await uploadBytes(storageRef, blob);
      await loadFiles();
      Alert.alert('Success', 'File uploaded successfully!');
    } catch (error) {
      Alert.alert('Error', 'Failed to upload file');
      console.error(error);
    } finally {
      setUploading(false);
    }
  };

  const handleDownload = async (url: string) => {
    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      } else {
        Alert.alert('Error', "Can't open this URL");
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to download file');
      console.error(error);
    }
  };

  const renderFileItem = ({ item }: { item: FileItem }) => (
    <TouchableOpacity 
      style={styles.fileItem}
      onPress={() => handleDownload(item.url)}
    >
      <View style={[styles.fileInitial, { backgroundColor: item.color }]}>
        <Text style={styles.initialText}>{item.initial}</Text>
      </View>
      <View style={styles.fileInfo}>
        <Text style={styles.fileName} numberOfLines={1} ellipsizeMode="middle">
          {item.name}
        </Text>
        <Text style={styles.fileDescription}>
          Uploaded {formatUploadTime(item.uploadTime)}
        </Text>
      </View>
      <TouchableOpacity 
        style={styles.downloadButton}
        onPress={() => handleDownload(item.url)}
      >
        <MaterialCommunityIcons name="download" size={24} color={COLORS.primary} />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Appbar.Header style={styles.header}>
        <Appbar.Action 
          icon="menu" 
          onPress={() => navigation.openDrawer()} 
        />
        <View style={styles.titleView}>
          <Text style={styles.title}>All Files</Text>
        </View>
        <Appbar.Action 
          icon="account" 
          onPress={() => {
            navigation.navigate('Home', {
              screen: 'ProfileSettings'
            });
          }} 
        />
      </Appbar.Header>

      <FlatList
        data={files}
        renderItem={renderFileItem}
        keyExtractor={(item) => item.name}
        contentContainerStyle={styles.listContainer}
      />

      <TouchableOpacity
        style={styles.fab}
        onPress={pickDocument}
        disabled={uploading}
      >
        <MaterialCommunityIcons name="plus" size={30} color="white" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    justifyContent: 'space-between',
    backgroundColor: '#fff',
  },
  titleView: {
    flex: 1,
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  listContainer: {
    padding: 16,
  },
  fileItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: COLORS.cardBackground,
    borderRadius: 12,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  fileInitial: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  initialText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
  },
  fileInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  fileName: {
    fontSize: 16,
    fontWeight: '500',
    color: COLORS.text,
    marginBottom: 4,
  },
  fileDescription: {
    fontSize: 14,
    color: COLORS.secondaryText,
  },
  downloadButton: {
    padding: 8,
  },
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
}); 