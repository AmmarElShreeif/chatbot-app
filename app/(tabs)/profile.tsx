import { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  TextInput,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Edit2, LogOut, User as UserIcon } from 'lucide-react-native';
import { supabase, getUserProfile } from '@/lib/supabase';
import { useTheme } from '@/context/ThemeContext';

export default function ProfileScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [newUserName, setNewUserName] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const loadUserData = async () => {
      try {
        // Get user profile from Supabase
        const profile = await getUserProfile();
        const user = await supabase.auth.getUser();

        if (profile) {
          setUserName(profile.username);
          setNewUserName(profile.username);
          setUserEmail(user.data?.user?.email || '');
        } else {
          throw new Error('User profile not found');
        }
      } catch (error) {
        console.error('Error loading user data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadUserData();
  }, []);

  const handleSaveProfile = async () => {
    if (!newUserName.trim()) {
      Alert.alert('Error', 'Username cannot be empty');
      return;
    }

    setIsSaving(true);

    try {
      // Get current user
      const { data: userData, error: userError } =
        await supabase.auth.getUser();

      if (userError || !userData.user) {
        throw new Error('Error getting user');
      }

      // Update profile in Supabase
      const { error } = await supabase
        .from('profiles')
        .update({
          username: newUserName,
          updated_at: new Date().toISOString(),
        })
        .eq('id', userData.user.id);

      if (error) {
        throw error;
      }

      // Update state
      setUserName(newUserName);
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      Alert.alert('Error', 'Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();

      if (error) throw error;

      router.replace('/welcome');
    } catch (err) {
      console.error('Error logging out:', err);
      Alert.alert('Error', 'Failed to log out. Please try again.');
    }
  };

  if (isLoading) {
    return (
      <View
        style={[
          styles.loadingContainer,
          { backgroundColor: colors.background },
        ]}
      >
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <View style={styles.header}>
        <View
          style={[styles.avatarContainer, { backgroundColor: colors.primary }]}
        >
          <UserIcon size={40} color="#fff" />
        </View>

        {isEditing ? (
          <View style={styles.editNameContainer}>
            <TextInput
              style={[
                styles.nameInput,
                {
                  backgroundColor: colors.card,
                  color: colors.text,
                  borderColor: colors.border,
                },
              ]}
              value={newUserName}
              onChangeText={setNewUserName}
              placeholder="Enter your name"
              placeholderTextColor={colors.placeholder}
            />

            <View style={styles.editButtonsContainer}>
              <TouchableOpacity
                style={[styles.editButton, { backgroundColor: colors.error }]}
                onPress={() => {
                  setIsEditing(false);
                  setNewUserName(userName);
                }}
              >
                <Text style={[styles.editButtonText, { color: '#fff' }]}>
                  Cancel
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.editButton, { backgroundColor: colors.primary }]}
                onPress={handleSaveProfile}
                disabled={isSaving}
              >
                {isSaving ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Text style={[styles.editButtonText, { color: '#fff' }]}>
                    Save
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <View style={styles.nameContainer}>
            <Text style={[styles.userName, { color: colors.text }]}>
              {userName}
            </Text>
            <TouchableOpacity
              style={[styles.editNameButton, { backgroundColor: colors.card }]}
              onPress={() => setIsEditing(true)}
            >
              <Edit2 size={16} color={colors.primary} />
              <Text style={[styles.editNameText, { color: colors.primary }]}>
                Edit
              </Text>
            </TouchableOpacity>
          </View>
        )}

        <Text style={[styles.userEmail, { color: colors.placeholder }]}>
          {userEmail}
        </Text>
      </View>

      <View
        style={[
          styles.section,
          { backgroundColor: colors.card, borderColor: colors.border },
        ]}
      >
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          Account
        </Text>

        <TouchableOpacity
          style={[styles.logoutButton, { borderColor: colors.border }]}
          onPress={handleLogout}
        >
          <LogOut size={20} color={colors.error} />
          <Text style={[styles.logoutText, { color: colors.error }]}>
            Log Out
          </Text>
        </TouchableOpacity>
      </View>

      <View
        style={[
          styles.section,
          { backgroundColor: colors.card, borderColor: colors.border },
        ]}
      >
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          App Info
        </Text>

        <View style={styles.infoRow}>
          <Text style={[styles.infoLabel, { color: colors.text }]}>
            Version
          </Text>
          <Text style={[styles.infoValue, { color: colors.placeholder }]}>
            1.0.0
          </Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={[styles.infoLabel, { color: colors.text }]}>Build</Text>
          <Text style={[styles.infoValue, { color: colors.placeholder }]}>
            2025.1
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    alignItems: 'center',
    paddingVertical: 30,
    paddingHorizontal: 20,
  },
  avatarContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  nameContainer: {
    alignItems: 'center',
    marginBottom: 8,
  },
  userName: {
    fontFamily: 'Inter-Bold',
    fontSize: 24,
    marginBottom: 8,
  },
  editNameButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  editNameText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    marginLeft: 4,
  },
  userEmail: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
  },
  editNameContainer: {
    width: '80%',
    marginBottom: 16,
  },
  nameInput: {
    height: 50,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    marginBottom: 12,
  },
  editButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  editButton: {
    flex: 0.48,
    height: 40,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  editButtonText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
  },
  section: {
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
  },
  sectionTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    marginBottom: 16,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderTopWidth: 1,
  },
  logoutText: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    marginLeft: 12,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  infoLabel: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
  },
  infoValue: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
  },
});
