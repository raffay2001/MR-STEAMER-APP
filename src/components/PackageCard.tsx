import React, {useState} from 'react';
import {View, Text, StyleSheet, Pressable} from 'react-native';

import CheckBox from 'react-native-check-box';
type CardProps = {
  title: string;
  description: string;
  onPressLink?: () => void;
};

const Card: React.FC<CardProps> = ({title, description, onPressLink}) => {
  const [isChecked, setIsChecked] = useState(false);
  return (
    <View style={styles.card}>
      {/* Title Row */}
      <View style={styles.row}>
        <CheckBox
          onClick={() => {
            setIsChecked(!isChecked); // Toggle the state
          }}
          isChecked={isChecked}
          checkBoxColor="#2CB67D"
        />
        <Text style={styles.title}>{title}</Text>
      </View>

      {/* Description */}
      <Text style={styles.description}>
        {/* <Icon name="arrowright" size={24} color="green" /> */}
        {description}
      </Text>

      {/* Link */}
      <Pressable onPress={onPressLink}>
        <Text style={styles.link}>Steam it</Text>
      </Pressable>
    </View>
  );
};

export default Card;

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    margin: 10,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    width: '100%',
    borderBottomColor: '#aaa9a9',
    borderBottomWidth: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333333',
    marginLeft: '30%',
    justifyContent: 'center',
  },
  description: {
    fontSize: 16,
    color: '#666666',
    marginVertical: 8,
  },
  link: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#3B82F6',
    textDecorationLine: 'underline',
    marginTop: 8,
    alignSelf: 'center',
  },
});
