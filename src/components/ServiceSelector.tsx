import {StyleSheet, Text, View} from 'react-native';
import React, {useState} from 'react';
import {Dropdown} from 'react-native-element-dropdown';
import {TouchableOpacity} from 'react-native-gesture-handler';

interface TProps {
  name: string;
  value?: string;
  label?: string;
  placeHolder: string;
  subHeading: string;
}

export const ServiceSelector = ({
  name,
  label,
  value,
  placeHolder,
  subHeading,
}: TProps) => {
  const data = [
    {label: 'Item 1', value: '1'},
    {label: 'Item 2', value: '2'},
    {label: 'Item 3', value: '3'},
    {label: 'Item 4', value: '4'},
    {label: 'Item 5', value: '5'},
    {label: 'Item 6', value: '6'},
    {label: 'Item 7', value: '7'},
    {label: 'Item 8', value: '8'},
  ];
  const [values, setValues] = useState<String | null>(null);
  console.log(values);
  return (
    <View style={styles.container}>
      <Text style={styles.headingText}>{name}</Text>
      <View style={styles.dropDownContainer}>
        <Text
          style={{
            fontSize: 18,
            color: 'black',
            fontWeight: 'bold',
            marginBottom: 10,
          }}>
          Select Service
        </Text>
        <Dropdown
          style={styles.dropdown}
          placeholderStyle={styles.placeholderStyle}
          selectedTextStyle={styles.selectedTextStyle}
          iconStyle={styles.iconStyle}
          data={data}
          maxHeight={300}
          labelField="label"
          valueField="value"
          placeholder={placeHolder}
          value={values}
          onChange={item => {
            setValues(item.value);
          }}
        />
      </View>
      <Text style={styles.subHeading}>{subHeading}</Text>
      <Text style={styles.description}>
        Lorem Ipsum is simply dummy text of the printing and typesetting
        industry. Lorem Ipsum has been the industry's standard dummy text ever
        since the 1500s, when an unknown printer took a galley of type and
        scrambled it to make a type specimen book. It has survived not only five
        centuries, but also the leap into electronic typesetting, remaining
        essentially unc
      </Text>
      <TouchableOpacity className="w-[40%] bg-blue-800 h-[56px] flex justify-center items-center rounded-[10px]">
        <Text className="text-white text-lg tracking-[0.5px]">Stream It</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    margin: 16,
  },
  headingText: {
    color: '#2D4795',
    fontSize: 18,
    fontWeight: 'bold',
  },
  dropDownContainer: {
    margin: 10,
  },
  dropdown: {
    height: 60,
    borderColor: 'gray',
    borderWidth: 0.5,
    borderRadius: 8,
    paddingHorizontal: 20,
    backgroundColor: 'transparent',
  },
  label: {
    position: 'absolute',
    backgroundColor: 'white',
    left: 22,
    top: 8,
    zIndex: 999,
    paddingHorizontal: 8,
    fontSize: 14,
  },
  placeholderStyle: {
    fontSize: 16,
  },
  selectedTextStyle: {
    fontSize: 16,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  subHeading: {
    color: 'red',
    fontWeight: 'bold',
    marginBottom: 10,
  },
  description: {
    lineHeight: 20,
    fontSize: 16,
    marginBottom: 10,
  },
});
