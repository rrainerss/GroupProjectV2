import * as React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Appbar } from 'react-native-paper';
import { Colors } from '../../colors';
import { useNavigation } from '@react-navigation/native';

type AppbarNestedBlankProps = {
  title: string;
};

const AppbarNestedBlank = ({ title }: AppbarNestedBlankProps) => {
  const navigation = useNavigation();

  return (
    <Appbar.Header style={styles.header}>
      <Appbar.BackAction onPress={() => navigation.goBack()} />
      <View style={styles.titleView}>
        <Text style={styles.title}>{title}</Text>
      </View>
      <Appbar.Action icon="blank" color="transparent" onPress={() => {}} />
    </Appbar.Header>
  );
};

const styles = StyleSheet.create({
  header: {
    justifyContent: 'space-between',
    zIndex: 1,
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

export default AppbarNestedBlank;