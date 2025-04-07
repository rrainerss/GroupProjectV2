import './gesture-handler';
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';
import { onAuthStateChanged, User } from 'firebase/auth';
import { FIREBASE_AUTH } from './FirebaseConfig';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { Colors } from './colors';

import Welcome from './app/screens/auth/Welcome';
import Login from './app/screens/auth/Login';
import Register from './app/screens/auth/Register';
import Home from './app/screens/Home';
import ChatHome from './app/screens/chat/ChatHome';
import PrivateChat from './app/screens/chat/PrivateChat';
import GroupChat from './app/screens/chat/GroupChat';

const Stack = createNativeStackNavigator();
const InsideStack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

//Home stack for authenticated users
const HomeStack = () => {
  return (
    <Stack.Navigator screenOptions={{ 
      headerShown: false,
      contentStyle: styles.mainContent,
     }}>
      <Stack.Screen name="Home" component={Home} />
      {/* <Stack.Screen name="PrivateChat" component={PrivateChat} />
      <Stack.Screen name="GroupChat" component={GroupChat} /> */}
      {/* Maybe duplicate screens can be included for showing most recent stuff */}
    </Stack.Navigator>
  );
};

// Define the other stacks with the placeholder screens
const MessagesStack = () => {
  return (
    <Stack.Navigator screenOptions={{ 
      headerShown: false,
      contentStyle: styles.mainContent,
     }}>
      <Stack.Screen name="MessagesHome" component={Home} />
    </Stack.Navigator>
  );
};

const GroupsStack = () => {
  return (
    <Stack.Navigator screenOptions={{ 
      headerShown: false,
      contentStyle: styles.mainContent,
     }}>
      <Stack.Screen name="GroupsHome" component={Home} />
    </Stack.Navigator>
  );
};

const FilesStack = () => {
  return (
    <Stack.Navigator screenOptions={{ 
      headerShown: false,
      contentStyle: styles.mainContent,
     }}>
      <Stack.Screen name="FilesHome" component={Home} />
    </Stack.Navigator>
  );
};

//Inside layout with drawer
function InsideLayout() {
  return (
    <Drawer.Navigator 
      screenOptions={{
        headerShown: false,
        contentStyle: styles.mainContent,
      }}>
      <Drawer.Screen name="HomeStack" component={HomeStack} />
      <Drawer.Screen name="MessagesStack" component={MessagesStack} />
      <Drawer.Screen name="GroupsStack" component={GroupsStack} />
      <Drawer.Screen name="FilesStack" component={FilesStack} />
    </Drawer.Navigator>
  );
}

export default function App() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    onAuthStateChanged(FIREBASE_AUTH, (user) => {
      console.log('The user:', user);
      setUser(user);
    });
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName='Welcome'>
        {user ? (
          <Stack.Screen 
            name="InsideApp" 
            component={InsideLayout} 
            options={{ headerShown: false }} 
          />
        ) : (
          <>
            <Stack.Screen name="Welcome" component={Welcome} options={{ headerShown: false }} />
            <Stack.Screen name="Login" component={Login} options={{ headerShown: false }} />
            <Stack.Screen name="Register" component={Register} options={{ headerShown: false }} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
    mainContent: {
      backgroundColor: Colors.background
    }
})