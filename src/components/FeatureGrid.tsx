import {StyleSheet, Text, View} from 'react-native';
import React from 'react';

interface Props<T> {
  data: T[];
  renderItem(item: T): JSX.Element;
  col?: number;
}

export const FeatureGridView = <T extends any>(props: Props<T>) => {
  const {data, renderItem, col = 2} = props;

  return (
    <View style={styles.container}>
      {data.map((item, index) => {
        return (
          <View key={index} style={{width: `${100 / col}%`}}>
            <View style={{padding: 5}}>{renderItem(item)}</View>
          </View>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
});
