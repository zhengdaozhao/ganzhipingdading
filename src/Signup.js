import { useState } from 'react';
import { View, TextInput, Button } from 'react-native';
import { getAuth, createUserWithEmailAndPassword } from '@react-native-firebase/auth';

export default function SignUp({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignUp = () => {
    const auth = getAuth();
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredentials) => {
        console.log('User registered:', userCredentials.user);
        navigation.navigate('Home');
      })
      .catch((error) => {
        console.error('Error registering user:', error);
      });
  };

  return (
    <View>
      <TextInput
        placeholder="Enter Email"
        value={email}
        onChangeText={(text) => setEmail(text)}
      />
      <TextInput
        secureTextEntry
        placeholder="Enter Password"
        value={password}
        onChangeText={(text) => setPassword(text)}
      />
      <Button title="Sign Up" onPress={handleSignUp} />
    </View>
  );
}