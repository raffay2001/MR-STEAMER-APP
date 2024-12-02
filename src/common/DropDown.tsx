import {StyleSheet, ViewProps, ViewStyle, TextStyle} from 'react-native';
import React, {ReactNode} from 'react';
import DropDownPicker from 'react-native-dropdown-picker';

type TDropDownProps = {
  open: boolean;
  setOpen: any;
  items: Array<{label: string; value: any}>;
  placeholder?: string;
  style?: ViewStyle;
  containerStyle?: ViewStyle;
  itemStyle?: ViewStyle;
  labelStyle?: TextStyle;
  arrowStyle?: ViewStyle;
  dropDownStyle?: ViewStyle;
  dropDownContainerStyle?: ViewStyle;
  defaultValue?: any;
  setDefaultValue: any;
  multiple?: boolean;
  multipleText?: string;
  searchable?: boolean;
  searchablePlaceholder?: string;
  searchablePlaceholderTextColor?: string;
  selectedLabelStyle?: TextStyle;
  selectedItemStyle?: ViewStyle;
  selectedItemsStyle?: ViewStyle;
  itemSeparatorStyle?: ViewStyle;
  listStyle?: ViewStyle;
};
export const DropDown: React.FC<TDropDownProps> = ({
  open,
  items,
  defaultValue,
  setOpen,
  setDefaultValue,
}) => {
  return (
    <DropDownPicker
      open={open}
      value={defaultValue}
      items={items}
      placeholder="Select"
      containerStyle={open ? styles.dropDownContOpen : styles.dropDownContClose}
      style={styles.dropDownStyle}
      dropDownContainerStyle={styles.dropDownContainerStyle}
      arrowIconStyle={styles.arrowIconStyle}
      labelStyle={styles.labelStyle}
      setOpen={setOpen}
      setValue={setDefaultValue}
      placeholderStyle={styles.placeholderStyle}
    />
  );
};

const styles = StyleSheet.create({
  dropDownContClose: {
    borderRadius: 25,
    width: '100%',
    height: 60,
    backgroundColor: '#2A2A2A',
    borderWidth: 1,
    justifyContent: 'center',
    tintColor: '#FFFFFF',
  },

  dropDownContOpen: {
    borderRadius: 25,
    borderBottomStartRadius: 0,
    borderBottomEndRadius: 0,
    width: '100%',
    height: '20%',
    backgroundColor: '#2A2A2A',
    justifyContent: 'center',
  },

  arrowIconStyle: {
    width: 20,
    height: 20,
    marginBottom: 0,
    tintColor: '#FFFFFF',
  },

  dropDownStyle: {
    borderRadius: 25,
    borderWidth: 0,
    backgroundColor: '#2A2A2A',
    height: 60,
    justifyContent: 'center',
    paddingHorizontal: 16,
    tintColor: '#FFFFFF',
  },

  dropDownContainerStyle: {
    borderWidth: 0,
    borderBottomStartRadius: 25,
    borderBottomEndRadius: 25,
    width: 370,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 3},
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5, // Elevation for Android
    zIndex: 100,
  },
  labelStyle: {
    color: '#FFFFFF', // Make the dropdown item labels white
    fontSize: 16,
    fontWeight: 'bold',
    tintColor: '#FFFFFF',
  },
  placeholderStyle: {
    color: '#FFFFFF', // White placeholder text
    fontSize: 16,
  },
});
