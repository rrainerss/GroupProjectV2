import './gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useEffect, useState } from 'react';
import { StyleSheet, View, Text, Linking } from 'react-native';
import { onAuthStateChanged, User, signOut } from 'firebase/auth';
import { FIREBASE_AUTH } from './FirebaseConfig';
import { createDrawerNavigator, DrawerItem, DrawerContentScrollView, DrawerItemList, DrawerContentComponentProps } from '@react-navigation/drawer';
import { Colors } from './colors';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import Welcome from './app/screens/auth/Welcome';
import Login from './app/screens/auth/Login';
import Register from './app/screens/auth/Register';
import Home from './app/screens/Home';
import ChatHome from './app/screens/chat/ChatHome';
import PrivateChat from './app/screens/chat/PrivateChat';
import GroupChat from './app/screens/chat/GroupChat';
import Files from './app/screens/files/Files';

const Stack = createNativeStackNavigator();
const InsideStack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

//Nav stacks
const HomeStack = () => {
  return (
    <Stack.Navigator screenOptions={{
      headerShown: false,
      contentStyle: styles.mainContent,
    }}>
      <Stack.Screen name="HomeStack" component={Home} />
    </Stack.Navigator>
  );
};

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
      <Stack.Screen name="FilesHome" component={Files} />
    </Stack.Navigator>
  );
};

//Custom Drawer wrapper (with signout added)
const CustomDrawerContent = (props: any) => {
  const handleSignOut = () => {
    signOut(FIREBASE_AUTH)
      .then(() => {
        console.log('User signed out');
      })
      .catch((error) => {
        console.error('Sign out error:', error);
      });
  };

  return (
    <DrawerContentScrollView {...props}
      contentContainerStyle={{ flex: 1 }}
    >
      <DrawerItemList {...props} />
      <DrawerItem
        label="Sign Out"
        onPress={handleSignOut}
        icon={({ color, size }: { color: string; size: number }) => (
          <MaterialCommunityIcons name="logout" size={size} color={color} />
        )}
        style={{ marginTop: 'auto' }}
      />
    </DrawerContentScrollView>
  );
};

//Inside layout with drawer for authenticated users
function InsideLayout() {
  return (
    <Drawer.Navigator
      screenOptions={{
        drawerActiveTintColor: Colors.accent,
        headerShown: false,
        contentStyle: styles.mainContent,
        drawerStyle: {
          width: 180,
        },
      }}
      drawerContent={(props: DrawerContentComponentProps) => <CustomDrawerContent {...props} />}
    >
      <Drawer.Screen
        name="Home"
        component={HomeStack}
        options={{
          drawerIcon: ({ color, size }: { color: string; size: number }) => (
            <MaterialCommunityIcons name="home-outline" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="Messages"
        component={MessagesStack}
        options={{
          drawerIcon: ({ color, size }: { color: string; size: number }) => (
            <MaterialCommunityIcons name="message-text-outline" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="Groups"
        component={GroupsStack}
        options={{
          drawerIcon: ({ color, size }: { color: string; size: number }) => (
            <MaterialCommunityIcons name="account-group-outline" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="Files"
        component={FilesStack}
        options={{
          drawerIcon: ({ color, size }: { color: string; size: number }) => (
            <MaterialCommunityIcons name="file-outline" size={size} color={color} />
          ),
        }}
      />
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
    backgroundColor: Colors.background,
  },
});