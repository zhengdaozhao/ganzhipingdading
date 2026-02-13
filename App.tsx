// /**
//  * Sample React Native App
//  * https://github.com/facebook/react-native
//  *
//  * @format
//  */

// import { NewAppScreen } from '@react-native/new-app-screen';
// import { StatusBar, StyleSheet, useColorScheme, View } from 'react-native';
// import {
//   SafeAreaProvider,
//   useSafeAreaInsets,
// } from 'react-native-safe-area-context';

// function App() {
//   const isDarkMode = useColorScheme() === 'dark';

//   return (
//     <SafeAreaProvider>
//       <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
//       <AppContent />
//     </SafeAreaProvider>
//   );
// }

// function AppContent() {
//   const safeAreaInsets = useSafeAreaInsets();

//   return (
//     <View style={styles.container}>
//       <NewAppScreen
//         templateFileName="App.tsx"
//         safeAreaInsets={safeAreaInsets}
//       />
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//   },
// });

// export default App;
import { initializeApp } from '@react-native-firebase/app';
// import { getAuth } from '@react-native-firebase/auth';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Login from './src/Login';
// import SignUp from './src/Signup';
import ListItems from './src/ListItems';
import AddItem from './src/AddItem';
import SpecifiedWriting from './src/SpecifiedWriting';
import OneWriting from './src/OneWriting';

const firebaseConfig = {
  apiKey: "AIzaSyAStYrORQ9xpJvqocbZyFg_Si_mfU2ynyo",
  authDomain: "dpj-android-zack.firebaseapp.com",
  databaseURL: "https://dpj-android-zack-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "dpj-android-zack",
  storageBucket: "dpj-android-zack.appspot.com",
  messagingSenderId: "645325348182",
  appId: "1:645325348182:web:19c19f206160e483e94af7",
  measurementId: "G-LLW3S7GCFY"
};

initializeApp(firebaseConfig);
// const auth = getAuth();

const Stack = createNativeStackNavigator();
export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        {/* <Stack.Screen name="Home" component={Home} /> */}
        <Stack.Screen name="Login" component={Login} />
        {/* <Stack.Screen name="SignUp" component={SignUp} /> */}
        <Stack.Screen name="ganzhuzhudafeibi" component={ListItems} />
        <Stack.Screen name="AddItem" component={AddItem} />
        <Stack.Screen name="houruzhiping" component={SpecifiedWriting} />
        <Stack.Screen name="kuangcaozhaojing" component={OneWriting} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}