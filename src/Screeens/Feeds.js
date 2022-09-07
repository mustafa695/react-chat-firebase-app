import {View, Text, StyleSheet, useColorScheme} from 'react-native';
import React from 'react';
import colors from '../constant/colors';

const Feeds = () => {
  const theme = useColorScheme();
  return (
    <View
      style={[
        styles.container,
        {backgroundColor: theme === 'dark' ? colors.dark : colors.light},
      ]}>
      <Text>Feeds</Text>
    </View>
  );
};

export default Feeds;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
