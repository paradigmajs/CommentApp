import React, {useState, useCallback} from 'react';
import {
  View,
  TextInput,
  Button,
  Text,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import {addUser} from '../database/database';
import {REGEX} from '../constants';

interface RegisterScreenProps {
  navigation: any;
}

const RegisterScreen: React.FC<RegisterScreenProps> = ({navigation}) => {
  const [email, setEmail] = useState<string>('');
  const [username, setUsername] = useState<string>('');

  const handleRegister = useCallback(() => {
    if (email && username) {
      if (!REGEX.EMAIL.test(email)) {
        Alert.alert('Invalid email format');
        return;
      }
      if (!REGEX.USERNAME.test(username)) {
        Alert.alert('Username can only contain letters, digits, and symbols');
        return;
      }
      addUser(email, username, (userId: number) => {
        navigation.navigate('CommentScreen', {userId});
      });
    } else {
      Alert.alert('Please enter both email and username');
    }
  }, [email, username, navigation]);

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={100}>
      <ScrollView contentContainerStyle={styles.innerContainer}>
        <Text style={styles.header}>Register</Text>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Email:</Text>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            placeholder="Enter your email"
            placeholderTextColor="#888"
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Username:</Text>
          <TextInput
            style={styles.input}
            value={username}
            onChangeText={setUsername}
            placeholder="Choose a username"
            placeholderTextColor="#888"
          />
        </View>
        <Button title="Register" onPress={handleRegister} color="#007BFF" />
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f4f4',
  },
  innerContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  inputContainer: {
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    color: '#555',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
    backgroundColor: '#fff',
  },
});

export default RegisterScreen;
