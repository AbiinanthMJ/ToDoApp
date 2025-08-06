import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Image,
  TextInput,
  ScrollView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'expo-router';

export default function Profile() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [displayName, setDisplayName] = useState('');
  const [bio, setBio] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [imageLoading, setImageLoading] = useState(false);

  useEffect(() => {
    loadProfileData();
    testAsyncStorage(); // Test AsyncStorage functionality
  }, []);

  const loadProfileData = async () => {
    try {
      const savedImage = await AsyncStorage.getItem('profile-image');
      const savedName = await AsyncStorage.getItem('display-name');
      const savedBio = await AsyncStorage.getItem('user-bio');
      
      console.log('Loading profile data...');
      console.log('Saved image:', savedImage);
      console.log('Saved name:', savedName);
      console.log('Saved bio:', savedBio);
      
      if (savedImage) {
        console.log('Loading saved image:', savedImage);
        setProfileImage(savedImage);
      }
      if (savedName) setDisplayName(savedName);
      if (savedBio) setBio(savedBio);
    } catch (error) {
      console.log('Error loading profile data:', error);
      Alert.alert('Error', 'Failed to load profile data. Please restart the app.');
    }
  };

  const requestPermissions = async () => {
    if (Platform.OS !== 'web') {
      const { status: mediaStatus } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      const { status: cameraStatus } = await ImagePicker.requestCameraPermissionsAsync();
      
      if (mediaStatus !== 'granted' || cameraStatus !== 'granted') {
        Alert.alert(
          'Permission needed', 
          'Please grant camera and photo library permissions to update your profile photo. You can enable permissions in your device settings.'
        );
        return false;
      }
    }
    return true;
  };

  const saveImageToStorage = async (imageUri: string) => {
    try {
      console.log('Attempting to save image URI:', imageUri);
      
      // Validate the URI
      if (!imageUri || imageUri.trim() === '') {
        console.error('Invalid image URI provided');
        return false;
      }
      
      await AsyncStorage.setItem('profile-image', imageUri);
      console.log('Image saved to storage successfully:', imageUri);
      
      // Verify the save by reading it back
      const savedImage = await AsyncStorage.getItem('profile-image');
      console.log('Verification - saved image:', savedImage);
      
      return savedImage === imageUri;
    } catch (error) {
      console.error('Error saving image to storage:', error);
      return false;
    }
  };

  const testAsyncStorage = async () => {
    try {
      const testKey = 'test-key';
      const testValue = 'test-value';
      
      await AsyncStorage.setItem(testKey, testValue);
      const retrievedValue = await AsyncStorage.getItem(testKey);
      
      console.log('AsyncStorage test:', retrievedValue === testValue ? 'PASSED' : 'FAILED');
      await AsyncStorage.removeItem(testKey);
      
      return retrievedValue === testValue;
    } catch (error) {
      console.error('AsyncStorage test failed:', error);
      return false;
    }
  };

  const pickImage = async () => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    setImageLoading(true);
    try {
      console.log('Launching image picker...');
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
        base64: false,
      });

      console.log('Image picker result:', result);

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const imageUri = result.assets[0].uri;
        console.log('Selected image URI:', imageUri);
        
        if (!imageUri) {
          throw new Error('No image URI received from picker');
        }
        
        // Update state immediately
        setProfileImage(imageUri);
        
        // Save to storage
        const saved = await saveImageToStorage(imageUri);
        if (saved) {
          Alert.alert('Success', 'Profile photo updated successfully!');
        } else {
          Alert.alert('Error', 'Failed to save profile photo. Please try again.');
          setProfileImage(null);
        }
      } else {
        console.log('Image picker was canceled or no image selected');
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', `Failed to pick image: ${error instanceof Error ? error.message : 'Unknown error'}. Please try again.`);
    } finally {
      setImageLoading(false);
    }
  };

  const takePhoto = async () => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    setImageLoading(true);
    try {
      console.log('Launching camera...');
      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
        base64: false,
      });

      console.log('Camera result:', result);

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const imageUri = result.assets[0].uri;
        console.log('Captured image URI:', imageUri);
        
        if (!imageUri) {
          throw new Error('No image URI received from camera');
        }
        
        // Update state immediately
        setProfileImage(imageUri);
        
        // Save to storage
        const saved = await saveImageToStorage(imageUri);
        if (saved) {
          Alert.alert('Success', 'Profile photo updated successfully!');
        } else {
          Alert.alert('Error', 'Failed to save profile photo. Please try again.');
          setProfileImage(null);
        }
      } else {
        console.log('Camera was canceled or no photo taken');
      }
    } catch (error) {
      console.error('Error taking photo:', error);
      Alert.alert('Error', `Failed to take photo: ${error instanceof Error ? error.message : 'Unknown error'}. Please try again.`);
    } finally {
      setImageLoading(false);
    }
  };

  const showImagePickerOptions = () => {
    if (imageLoading) {
      Alert.alert('Please wait', 'Processing image...');
      return;
    }
    
    Alert.alert(
      'Update Profile Photo',
      'Choose an option',
      [
        { text: 'Take Photo', onPress: takePhoto },
        { text: 'Choose from Library', onPress: pickImage },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  const saveProfile = async () => {
    setIsLoading(true);
    try {
      await AsyncStorage.setItem('display-name', displayName);
      await AsyncStorage.setItem('user-bio', bio);
      Alert.alert('Success', 'Profile updated successfully!');
    } catch (error) {
      Alert.alert('Error', 'Failed to save profile. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const clearProfileImage = async () => {
    Alert.alert(
      'Remove Profile Photo',
      'Are you sure you want to remove your profile photo?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: async () => {
            try {
              setProfileImage(null);
              await AsyncStorage.removeItem('profile-image');
              Alert.alert('Success', 'Profile photo removed successfully!');
            } catch (error) {
              console.error('Error removing profile image:', error);
              Alert.alert('Error', 'Failed to remove profile photo. Please try again.');
            }
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#333" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Profile</Text>
          <View style={styles.headerSpacer} />
        </View>

        {/* Profile Photo Section */}
        <View style={styles.profilePhotoSection}>
          <TouchableOpacity 
            onPress={showImagePickerOptions} 
            style={[styles.profilePhotoContainer, imageLoading && styles.profilePhotoContainerDisabled]}
            disabled={imageLoading}
          >
            {profileImage ? (
              <Image 
                source={{ uri: profileImage }} 
                style={styles.profilePhoto}
                onError={(error) => {
                  console.error('Image loading error:', error);
                  setProfileImage(null);
                }}
              />
            ) : (
              <View style={styles.profilePhotoPlaceholder}>
                <Ionicons name="person" size={60} color="#666" />
              </View>
            )}
            <View style={styles.cameraIconContainer}>
              {imageLoading ? (
                <Ionicons name="hourglass" size={20} color="#fff" />
              ) : (
                <Ionicons name="camera" size={20} color="#fff" />
              )}
            </View>
          </TouchableOpacity>
          
          {profileImage && (
            <TouchableOpacity onPress={clearProfileImage} style={styles.removePhotoButton}>
              <Text style={styles.removePhotoText}>Remove Photo</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Profile Information */}
        <View style={styles.formSection}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Display Name</Text>
            <TextInput
              style={styles.input}
              value={displayName}
              onChangeText={setDisplayName}
              placeholder="Enter your display name"
              placeholderTextColor="#999"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={[styles.input, styles.disabledInput]}
              value={user?.email || ''}
              editable={false}
              placeholderTextColor="#999"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Bio</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={bio}
              onChangeText={setBio}
              placeholder="Tell us about yourself..."
              placeholderTextColor="#999"
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
          </View>

          <TouchableOpacity
            style={[styles.saveButton, isLoading && styles.saveButtonDisabled]}
            onPress={saveProfile}
            disabled={isLoading}
          >
            <Text style={styles.saveButtonText}>
              {isLoading ? 'Saving...' : 'Save Changes'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Logout Section */}
        <View style={styles.logoutSection}>
          <TouchableOpacity style={styles.logoutButton} onPress={logout}>
            <Ionicons name="log-out-outline" size={20} color="#ff4444" />
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContent: {
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  backButton: {
    padding: 8,
  },
  headerSpacer: {
    width: 40,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  profilePhotoSection: {
    alignItems: 'center',
    marginBottom: 30,
  },
  profilePhotoContainer: {
    position: 'relative',
    marginBottom: 15,
  },
  profilePhotoContainerDisabled: {
    opacity: 0.6,
  },
  profilePhoto: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: '#4630EB',
  },
  profilePhotoPlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#e0e0e0',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#4630EB',
  },
  cameraIconContainer: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#4630EB',
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#fff',
  },
  removePhotoButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  removePhotoText: {
    color: '#ff4444',
    fontSize: 14,
    fontWeight: '500',
  },
  formSection: {
    marginBottom: 30,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#333',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  disabledInput: {
    backgroundColor: '#f8f8f8',
    color: '#666',
  },
  textArea: {
    height: 100,
    paddingTop: 12,
  },
  saveButton: {
    backgroundColor: '#4630EB',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
  },
  saveButtonDisabled: {
    backgroundColor: '#a0a0a0',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  logoutSection: {
    alignItems: 'center',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ff4444',
  },
  logoutText: {
    color: '#ff4444',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
}); 