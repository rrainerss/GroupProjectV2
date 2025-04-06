import * as React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Appbar } from 'react-native-paper';
import { Colors } from '../../colors.js';
import {
  NavigationContainer,
  DrawerActions,
  useNavigation,
} from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';

//Screens
const HomeScreen = () => (
  <View style={styles.screen}>
    <AppbarHome title="Home" />
    <Text>Welcome to Home</Text>
  </View>
);

const MessagesScreen = () => (
  <View style={styles.screen}>
    <AppbarHome title="Messages" />
    <Text>Messages go here</Text>
  </View>
);

const GroupsScreen = () => (
  <View style={styles.screen}>
    <AppbarHome title="Groups" />
    <Text>Groups content</Text>
  </View>
);

const FilesScreen = () => (
  <View style={styles.screen}>
    <AppbarHome title="Files" />
    <Text>File list</Text>
  </View>
);

//Drawer
const Drawer = createDrawerNavigator();

//Appbar
type AppbarHomeProps = {
  title: string;
};

const AppbarHome = ({ title }: AppbarHomeProps) => {
  const navigation = useNavigation();

  return (
    <Appbar.Header style={styles.header}>
      <Appbar.Action
        icon="menu"
        onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
      />
      <View style={styles.titleView}>
        <Text style={styles.title}>{title}</Text>
      </View>
      <Appbar.Action icon="account" onPress={() => {}} />
    </Appbar.Header>
  );
};

const AppWithDrawer = () => {
  return (
    <NavigationContainer>
      <Drawer.Navigator
        screenOptions={{
          headerShown: false,
        }}
      >
        <Drawer.Screen name="Home" component={HomeScreen} />
        <Drawer.Screen name="Messages" component={MessagesScreen} />
        <Drawer.Screen name="Groups" component={GroupsScreen} />
        <Drawer.Screen name="Files" component={FilesScreen} />
      </Drawer.Navigator>
    </NavigationContainer>
  );
};

export default AppWithDrawer;

const styles = StyleSheet.create({
  header: {
    justifyContent: 'space-between',
  },
  titleView: {
    flex: 1,
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.accent,
  },
  screen: {
    flex: 1,
    paddingTop: 16,
    paddingHorizontal: 16,
  },
});
