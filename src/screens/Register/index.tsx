import {Pressable, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {TRegisterProps} from './types';
import {IoChevronBackOutline} from 'react-icons/io5';
import Input from '../../components/Input';
import {SvgWrapper} from '../../common/SvgWrapper';
import {goBackWhiteSvg, PersonSvg, WhiteArrowSvg} from '../../assets/svgs';

export const Register: React.FC<TRegisterProps> = ({navigation, route}) => {
  return (
    <View style={styles.container}>
      <Pressable style={{marginLeft: 10}} onPress={() => navigation.goBack()}>
        <SvgWrapper xml={goBackWhiteSvg} width={16} height={16} />
      </Pressable>

      <Text style={styles.mainHeading}>Register With Us</Text>
      <View style={styles.formContainer}>
        <View style={styles.feildContainer}>
          <Text className='text-white m-2 text-base font-semibold	'>Name</Text>
          <Input
            placeholder="Enter Name"
          />
        </View>

        <View>
          <Text className='text-white m-2 text-base font-semibold	'>Mobile Number</Text>
          <Input
            placeholder="Mobile Number"
            keyboardType='numeric'
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  mainHeading: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 32,
    textAlign: 'center',
    marginVertical: '20%',
  },
  formContainer: {
    marginHorizontal: '5%',
    alignItems: 'center',
  },
  feildContainer:{
    margin: 2
  }
});
