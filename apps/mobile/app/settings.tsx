import { View, Text, StyleSheet } from 'react-native';
import { Stack } from 'expo-router';

export default function SettingsScreen() {
  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: 'Settings' }} />
      <Text style={styles.title}>Settings</Text>
      <Text style={styles.text}>Manage your preferences</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#121212',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 8,
  },
  text: {
    color: '#888888',
  },
});
