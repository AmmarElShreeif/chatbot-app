import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Switch,
  ScrollView,
} from 'react-native';
import {
  Moon,
  Sun,
  Smartphone,
  Info,
  Bell,
  Lock,
  HelpCircle,
} from 'lucide-react-native';
import { useTheme } from '../../context/ThemeContext';

export default function SettingsScreen() {
  const { colors, theme, setTheme, isDark } = useTheme();

  const renderThemeOption = (
    optionTheme: 'light' | 'dark' | 'system',
    label: string,
    icon: React.ReactNode
  ) => {
    const isSelected = theme === optionTheme;

    return (
      <TouchableOpacity
        style={[
          styles.themeOption,
          isSelected && [
            styles.selectedThemeOption,
            { borderColor: colors.primary },
          ],
          { backgroundColor: colors.card },
        ]}
        onPress={() => setTheme(optionTheme)}
      >
        <View
          style={[
            styles.themeIconContainer,
            {
              backgroundColor: isSelected ? colors.primary : colors.background,
            },
          ]}
        >
          {icon}
        </View>
        <Text
          style={[
            styles.themeLabel,
            { color: colors.text },
            isSelected && { fontFamily: 'Inter-SemiBold' },
          ]}
        >
          {label}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      {/* Appearance Section */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          Appearance
        </Text>
        <Text style={[styles.sectionSubtitle, { color: colors.placeholder }]}>
          Choose how the app looks to you
        </Text>

        <View style={styles.themeOptionsContainer}>
          {renderThemeOption(
            'light',
            'Light',
            <Sun size={24} color={isDark ? '#fff' : colors.text} />
          )}

          {renderThemeOption(
            'dark',
            'Dark',
            <Moon size={24} color={isDark ? '#fff' : colors.text} />
          )}

          {renderThemeOption(
            'system',
            'System',
            <Smartphone size={24} color={isDark ? '#fff' : colors.text} />
          )}
        </View>
      </View>

      {/* Notifications Section */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          Notifications
        </Text>

        <View style={[styles.settingRow, { borderBottomColor: colors.border }]}>
          <View style={styles.settingInfo}>
            <Text style={[styles.settingLabel, { color: colors.text }]}>
              Push Notifications
            </Text>
            <Text
              style={[styles.settingDescription, { color: colors.placeholder }]}
            >
              Receive notifications when AI responds
            </Text>
          </View>
          <Switch
            value={true}
            onValueChange={() => {}}
            trackColor={{ false: colors.border, true: colors.primary }}
            thumbColor="#fff"
          />
        </View>

        <View style={[styles.settingRow, { borderBottomColor: colors.border }]}>
          <View style={styles.settingInfo}>
            <Text style={[styles.settingLabel, { color: colors.text }]}>
              Email Notifications
            </Text>
            <Text
              style={[styles.settingDescription, { color: colors.placeholder }]}
            >
              Receive weekly summaries and updates
            </Text>
          </View>
          <Switch
            value={false}
            onValueChange={() => {}}
            trackColor={{ false: colors.border, true: colors.primary }}
            thumbColor="#fff"
          />
        </View>
      </View>

      {/* Security Section */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          Security
        </Text>

        <View style={[styles.settingRow, { borderBottomColor: colors.border }]}>
          <View style={styles.settingInfo}>
            <Text style={[styles.settingLabel, { color: colors.text }]}>
              Change Password
            </Text>
            <Text
              style={[styles.settingDescription, { color: colors.placeholder }]}
            >
              Update your account password
            </Text>
          </View>
          <Lock size={24} color={colors.placeholder} />
        </View>

        <View style={[styles.settingRow, { borderBottomColor: colors.border }]}>
          <View style={styles.settingInfo}>
            <Text style={[styles.settingLabel, { color: colors.text }]}>
              Two-Factor Authentication
            </Text>
            <Text
              style={[styles.settingDescription, { color: colors.placeholder }]}
            >
              Add an extra layer of security
            </Text>
          </View>
          <Switch
            value={false}
            onValueChange={() => {}}
            trackColor={{ false: colors.border, true: colors.primary }}
            thumbColor="#fff"
          />
        </View>
      </View>

      {/* Help & Support Section */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          Help & Support
        </Text>

        <View style={[styles.settingRow, { borderBottomColor: colors.border }]}>
          <View style={styles.settingInfo}>
            <Text style={[styles.settingLabel, { color: colors.text }]}>
              FAQ
            </Text>
            <Text
              style={[styles.settingDescription, { color: colors.placeholder }]}
            >
              Frequently asked questions
            </Text>
          </View>
          <HelpCircle size={24} color={colors.placeholder} />
        </View>

        <View style={[styles.settingRow, { borderBottomColor: colors.border }]}>
          <View style={styles.settingInfo}>
            <Text style={[styles.settingLabel, { color: colors.text }]}>
              Contact Support
            </Text>
            <Text
              style={[styles.settingDescription, { color: colors.placeholder }]}
            >
              Get help from our support team
            </Text>
          </View>
          <Info size={24} color={colors.placeholder} />
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'Inter-SemiBold',
    marginBottom: 8,
  },
  sectionSubtitle: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    marginBottom: 16,
  },
  themeOptionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  themeOption: {
    flex: 1,
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  selectedThemeOption: {
    borderWidth: 2,
  },
  themeIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  themeLabel: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  settingInfo: {
    flex: 1,
  },
  settingLabel: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
  },
});
