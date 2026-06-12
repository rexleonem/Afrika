import { View, Text, StyleSheet } from 'react-native';
import { Stack } from 'expo-router';

export default function NommoScreen() {
  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: 'Nommo AI' }} />
      <Text style={styles.title}>Nommo</Text>
      <Text style={styles.text}>Ambient Intelligence Interface</Text>
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
    color: '#D2A66D',
    marginBottom: 8,
  },
  text: {
    color: '#888888',
  },
});
