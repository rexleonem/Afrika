import { View, Text, StyleSheet } from 'react-native';
import { Stack, useLocalSearchParams } from 'expo-router';

export default function CreatorScreen() {
  const { id } = useLocalSearchParams();
  
  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: `@${id}` }} />
      <Text style={styles.title}>@{id}</Text>
      <Text style={styles.text}>Curator profile is empty.</Text>
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
