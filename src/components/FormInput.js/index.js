import {View, Text, TextInput, StyleSheet, useColorScheme} from 'react-native';
import React from 'react';
import fonts from '../../constant/fonts';
import colors from '../../constant/colors';

const FormInput = ({
  label,
  value,
  onChangeText,
  placeHolder,
  keyboardType,
  numberOfLines,
  caretHidden,
}) => {
  const theme = useColorScheme();
  return (
    <View>
      <Text
        style={[styles.label, {color: theme === 'dark' ? '#4c4c4c' : '#000'}]}>
        {label}
      </Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeHolder}
        keyboardType={keyboardType ? keyboardType : 'default'}
        numberOfLines={numberOfLines || 1}
        caretHidden={caretHidden || false}
        style={styles.input}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderColor: colors.ib,
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 8,
    fontFamily: fonts.regular,
    marginBottom: 20,
  },
  label: {
    // color: '#000',
    letterSpacing: 0.5,
    marginBottom: 8,
    fontFamily: fonts.semiBold,
  },
});

export default FormInput;
