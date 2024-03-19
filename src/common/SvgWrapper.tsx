import React from 'react';
import {View, ViewProps} from 'react-native';
import {SvgXml} from 'react-native-svg';

type TSvgWrapperProps = {
  width?: number;
  height?: number;
  xml: string;
};

export const SvgWrapper: React.FC<TSvgWrapperProps & ViewProps> = ({
  width = 35,
  height = 35,
  xml,
  ...props
}) => {
  return (
    <View {...props}>
      <SvgXml xml={xml} width={width} height={height} />
    </View>
  );
};
