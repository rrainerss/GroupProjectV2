import 'react-native-gesture-handler';
import React from 'react';
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
import ProfileSettings from './app/screens/profile/ProfileSettings';

const Stack = createNativeStackNavigator();
const InsideStack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

type RootStackParamList = {
  Welcome: undefined;
  Login: undefined;
  Register: undefined;
  Inside: undefined;
};

type InsideStackParamList = {
  HomeStack: undefined;
  MessagesHome: undefined;
  GroupsHome: undefined;
  FilesHome: undefined;
  ProfileSettings: undefined;
};

//Nav stacks
const HomeStack = () => {
  return (
    <Stack.Navigator 
      initialRouteName="HomeStack"
      screenOptions={{
        headerShown: false,
        contentStyle: styles.mainContent,
      }}
    >
      <Stack.Screen name="HomeStack" component={Home} />
      <Stack.Screen 
        name="ProfileSettings" 
        component={ProfileSettings}
        options={{
          headerShown: true,
          headerTitle: "Profile Settings",
          headerStyle: {
            backgroundColor: '#FFFFFF',
            borderBottomWidth: 1,
            borderBottomColor: '#E0E0E0',
          },
          headerTitleStyle: {
            color: '#F98012',
            fontSize: 20,
            fontWeight: 'bold',
            marginBottom: 8,
          },
          headerTintColor: '#F98012',
          headerShadowVisible: false,
        }}
      />
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
const CustomDrawerContent = (props: DrawerContentComponentProps) => {
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
      drawerContent={(props: any) => <CustomDrawerContent {...props} />}
      screenOptions={{
        headerShown: false,
        drawerStyle: {
          backgroundColor: Colors.background,
          width: 240,
        },
        drawerActiveTintColor: Colors.accent,
        drawerInactiveTintColor: Colors.text,
      }}
    >
      <Drawer.Screen
        name="Home"
        component={HomeStack}
        options={{
          drawerIcon: ({ color, size }: { color: string; size: number }) => (
            <MaterialCommunityIcons name="home" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="Messages"
        component={MessagesStack}
        options={{
          drawerIcon: ({ color, size }: { color: string; size: number }) => (
            <MaterialCommunityIcons name="message" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="Groups"
        component={GroupsStack}
        options={{
          drawerIcon: ({ color, size }: { color: string; size: number }) => (
            <MaterialCommunityIcons name="account-group" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="Files"
        component={FilesStack}
        options={{
          drawerIcon: ({ color, size }: { color: string; size: number }) => (
            <MaterialCommunityIcons name="file" size={size} color={color} />
          ),
        }}
      />
    </Drawer.Navigator>
  );
}

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(FIREBASE_AUTH, (user) => {
      setUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {user ? (
          <Stack.Screen name="Inside" component={InsideLayout} />
        ) : (
          <>
            <Stack.Screen name="Welcome" component={Welcome} />
            <Stack.Screen name="Login" component={Login} />
            <Stack.Screen name="Register" component={Register} />
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background,
  },
});