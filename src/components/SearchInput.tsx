import React from 'react';
import { View, TextInput } from 'react-native';
import { SvgWrapper } from '../common/SvgWrapper';
import Icons from '../assets/svgs/icons';
import i18n from '../i18n';

interface SearchInputProps {
  placeholder: string;
  icon?: string;
  onChangeText?: (text: string) => void;
  value?: string;
}

const SearchInput = ({ placeholder, icon, ...rest }: SearchInputProps) => {
  const isAr = i18n.language?.startsWith('ar');

  return (
    <View
      className="w-full flex-row items-center bg-[#F5F7FA] rounded-3xl"
      style={{
        flexDirection: isAr ? 'row-reverse' : 'row',
        paddingHorizontal: 16,
        height: 48,
        borderWidth: 1,
        borderColor: '#E5E7EB',
      }}
    >
      <SvgWrapper
        xml={icon ? icon : Icons.searchIcon}
        width={20}
        height={20}
        style={{
          marginLeft: isAr ? 8 : 0,
          marginRight: isAr ? 0 : 8,
          opacity: 0.8,
        }}
      />
      <TextInput
        placeholder={placeholder || ''}
        placeholderTextColor="#0000004D"
        style={{
          flex: 1,
          color: '#111',
          fontSize: 14,
          textAlign: isAr ? 'right' : 'left',
          paddingVertical: 0, // centers text inside 48px height
        }}
        {...rest}
      />
    </View>
  );
};

export default SearchInput;
