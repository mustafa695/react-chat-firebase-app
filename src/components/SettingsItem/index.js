import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  useColorScheme,
} from 'react-native';
import React from 'react';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

import colors from '../../constant/colors';
import fonts from '../../constant/fonts';

const SettingsItem = ({settingText, icon, onTap}) => {
  const theme = useColorScheme();
  return (
    <>
      <TouchableOpacity style={styles.row} onPress={onTap}>
        <View style={styles.inline}>
          {icon}
          <Text
            style={[
              styles.txt,
              {color: theme === 'dark' ? '#ddd' : "#000"},
            ]}>
            {settingText}
          </Text>
        </View>
        <FontAwesome name="angle-right" size={20} color={colors.themeColor} />
      </TouchableOpacity>
      <View style={[styles.line, {borderColor: theme === "dark" ? colors.borderDark : '#ddd'}]}></View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  row: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
    height: 57,
    paddingHorizontal: 20,
    position: 'relative',
  },
  inline: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  txt: {
    paddingLeft: 12,
    fontFamily: fonts.regular,
    fontSize: 15,
  },
  line: {
    borderBottomWidth: 1,

    width: '100%',
  },
});

export default SettingsItem;
