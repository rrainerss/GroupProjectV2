import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Welcome from './app/screens/auth/Welcome';
import Login from './app/screens/auth/Login';
import Register from './app/screens/auth/Register';
import Home from './app/screens/Home';
import { useEffect, useState } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { FIREBASE_AUTH } from './FirebaseConfig';
import PrivateChat from './app/screens/chat/PrivateChat';
import GroupChat from './app/screens/chat/GroupChat';

const Stack = createNativeStackNavigator();
const InsideStack = createNativeStackNavigator();

function InsideLayout() {
  return (
    <InsideStack.Navigator>
      <InsideStack.Screen name="Home" component={Home} />
      <InsideStack.Screen name="PrivateChat" component={PrivateChat} />
      <InsideStack.Screen name="GroupChat" component={GroupChat} />
    </InsideStack.Navigator>
  )
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
          <Stack.Screen name="InsideApp" component={InsideLayout} options={{ headerShown: false }} />
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
