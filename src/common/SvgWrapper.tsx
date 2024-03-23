import React from 'react';
import {TouchableOpacity, View, ViewProps} from 'react-native';
import {SvgXml} from 'react-native-svg';

type TSvgWrapperProps = {
  width?: number | string;
  height?: number | string;
  xml: string;
  icon?: boolean;
};

export const SvgWrapper: React.FC<TSvgWrapperProps & ViewProps> = ({
  width = 35,
  height = 35,
  xml,
  icon = false,
  ...props
}) => {
  if (icon) {
    return (
      <TouchableOpacity {...props}>
        <SvgXml xml={xml} width={width} height={height} />
      </TouchableOpacity>
    );
  }
  return (
    <View {...props}>
      <SvgXml xml={xml} width={width} height={height} />
    </View>
  );
};
