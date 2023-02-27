// src/components/Button.tsx

import React from 'react';
import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';

const Button = ({
  label,
  onPress,
  style,
  textColor = '#ffffff',
  backgroundColor = '#95C4CB',
  fill = false,
  ...rest
}) => (
  <TouchableOpacity
    {...rest}
    onPress={onPress}
    activeOpacity={0.75}
    style={fill ? {flex: 1} : {}}>
    <View style={[s.wrapper, {backgroundColor}, style]}>
      <Text style={[s.label, {color: textColor}]}>{label}</Text>
    </View>
  </TouchableOpacity>
);

export default Button;

const s = StyleSheet.create({
  wrapper: {
    height: 45,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 30,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
  },
});
