import * as React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Appbar } from 'react-native-paper';
import { Colors } from '../../colors';
import { useNavigation } from '@react-navigation/native';

type AppbarNestedProps = {
  title: string;
  backgroundColor: string;
};

const AppbarNested = ({ title, backgroundColor }: AppbarNestedProps) => {
  const navigation = useNavigation();

  return (
    <Appbar.Header style={[{ backgroundColor: backgroundColor }, styles.header]}>
      <Appbar.BackAction onPress={() => navigation.goBack()} />
      <View style={styles.titleView}>
        <Text style={styles.title}>{title}</Text>
      </View>
      <Appbar.Action icon="information-outline" onPress={() => {}} />
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
    color: Colors.text,
  },
});

export default AppbarNested;