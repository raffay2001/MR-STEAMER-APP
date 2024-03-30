import {View, TextInput} from 'react-native';
import React from 'react';
import {SvgWrapper} from '../common/SvgWrapper';
import Icons from '../assets/svgs/icons';

interface SearchInputProps {
  placeholder: string;
  icon?: string;
  onChangeText?: (text: string) => void;
}

const SearchInput = ({placeholder, icon, ...rest}: SearchInputProps) => {
  return (
    <View className="w-[100%] flex-row items-center bg-[#F5F7FA] rounded-3xl px-4 pl-5">
      <SvgWrapper xml={icon ? icon : Icons.searchIcon} width={22} height={22} />
      <TextInput
        placeholder={placeholder || ''}
        placeholderTextColor={'#0000004D'}
        className="text-md"
        {...rest}
      />
    </View>
  );
};

export default SearchInput;
