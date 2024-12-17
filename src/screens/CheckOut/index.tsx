import {
  Button,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import React from 'react';
import {TCheckOutProps} from './types';
import {SvgWrapper} from '../../common/SvgWrapper';
import Icons from '../../assets/svgs/icons';
import {Formik} from 'formik';
import {CardDetailsSchema} from '../../Validations';

export const CheckOut: React.FC<TCheckOutProps> = ({navigation, route}) => {
  return (
    <>
      <View
        style={{
          width: '100%',
          flexDirection: 'row',
          alignItems: 'center',
        }}>
        <Pressable style={{marginLeft: 12}} onPress={() => navigation.goBack()}>
          <SvgWrapper
            xml={Icons.backIcon}
            width={15}
            height={15}
            icon={true}
            onPress={() => navigation.goBack()}
          />
        </Pressable>
        <View style={{flex: 3}}>
          <Text className="m-8 text-xl text-center font-bold text-black">
            Checkout
          </Text>
        </View>
      </View>
      <View style={{marginHorizontal: 18}}>
        <Text className="text-black text-lg font-bold mb-4">
          Enter Card Details
        </Text>
        <Formik
          validationSchema={CardDetailsSchema}
          initialValues={{holder: '', cardNumber: ''}}
          onSubmit={values => console.log(values)}>
          {({
            handleChange,
            handleBlur,
            handleSubmit,
            values,
            errors,
            isValid,
          }) => (
            <>
              <Text style={styles.label}>Card Holder</Text>
              <TextInput
                placeholder="Card Holder"
                // style={styles.textInput}
                onChangeText={handleChange('holder')}
                onBlur={handleBlur('holder')}
                value={values.holder}
                className="border-2 border-[#e4e4e4e4] rounded-lg pl-4"
              />
              {errors.holder && (
                <Text style={{fontSize: 10, color: 'red'}}>
                  {errors.holder}
                </Text>
              )}
              <Text style={styles.label}>Card Number</Text>
              <TextInput
                placeholder="XXXX XXXX XXXX XXXX"
                keyboardType="numeric" // Opens numeric keyboard
                maxLength={16}
                onChangeText={handleChange('cardNumber')}
                onBlur={handleBlur('cardNumber')}
                value={values.cardNumber}
              />
              {errors.cardNumber && (
                <Text style={{fontSize: 10, color: 'red'}}>
                  {errors.cardNumber}
                </Text>
              )}
              <Text style={styles.label}>Card Number</Text>
              <TextInput
                placeholder="XXXX XXXX XXXX XXXX"
                keyboardType="numeric" // Opens numeric keyboard
                maxLength={16}
                onChangeText={handleChange('cardNumber')}
                onBlur={handleBlur('cardNumber')}
                value={values.cardNumber}
              />
              {errors.cardNumber && (
                <Text style={{fontSize: 10, color: 'red'}}>
                  {errors.cardNumber}
                </Text>
              )}
              <Button
                onPress={() => handleSubmit()}
                title="LOGIN"
                disabled={!isValid}
              />
            </>
          )}
        </Formik>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  label: {
    fontSize: 16,
    color: '#333',
    marginVertical: 18,
    fontWeight: 'bold',
  },
});
