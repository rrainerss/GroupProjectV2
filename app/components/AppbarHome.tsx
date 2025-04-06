import * as React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Appbar } from 'react-native-paper';
import { Colors } from '../../colors';
import { DrawerActions, useNavigation } from '@react-navigation/native';

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
});

export default AppbarHome;
