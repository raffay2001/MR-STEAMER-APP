import {
  Button,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import React from 'react';
import {TCheckOutProps} from './types';
import {SvgWrapper} from '../../common/SvgWrapper';
import Icons from '../../assets/svgs/icons';
import {Formik} from 'formik';
import {CardDetailsSchema} from '../../Validations';
import {APPLE_PAY, MADA_LOGO, MASTER_LOGO, VISA_LOGO} from '../../assets';

const CheckBox = ({checked, onPress, label}: any) => (
  <TouchableOpacity style={styles.checkboxContainer} onPress={onPress}>
    <View style={[styles.checkbox, checked && styles.checked]} />
    <Text style={styles.label}>{label}</Text>
  </TouchableOpacity>
);

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
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <ScrollView>
              <Formik
                validationSchema={CardDetailsSchema}
                initialValues={{
                  holder: '',
                  cardNumber: '',
                  expiryDate: '',
                  CVV: '',
                  termsAccepted: false,
                  saveCard: false,
                }}
                onSubmit={(values, {resetForm}) => {
                  console.log('Form Submitted:', values);
                  resetForm(); // Clears all fields
                }}>
                {({
                  handleChange,
                  handleBlur,
                  handleSubmit,
                  values,
                  errors,
                  isValid,
                  setFieldValue,
                  touched,
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
                      className="border-2 border-[#e4e4e4e4] rounded-lg pl-4"
                    />
                    {errors.cardNumber && (
                      <Text style={{fontSize: 10, color: 'red'}}>
                        {errors.cardNumber}
                      </Text>
                    )}
                    <View
                      className="flex flex-row"
                      style={{marginHorizontal: 10}}>
                      <View className="w-[50%]">
                        <Text style={styles.label}>Expiry Date</Text>
                        <TextInput
                          placeholder="MM/YY"
                          maxLength={5}
                          onChangeText={handleChange('expiryDate')}
                          onBlur={handleBlur('expiryDate')}
                          value={values.expiryDate}
                          className="border-2 border-[#e4e4e4e4] rounded-lg pl-4 w-full"
                        />
                        {errors.cardNumber && (
                          <Text style={{fontSize: 10, color: 'red'}}>
                            {errors.cardNumber}
                          </Text>
                        )}
                      </View>
                      <View className="w-[50%] ml-2">
                        <Text style={styles.label}>CVV</Text>
                        <TextInput
                          placeholder="XXX"
                          maxLength={4}
                          onChangeText={handleChange('CVV')}
                          onBlur={handleBlur('CVV')}
                          value={values.CVV}
                          className="border-2 border-[#e4e4e4e4] rounded-lg pl-4 w-full"
                        />
                        {errors.cardNumber && (
                          <Text style={{fontSize: 10, color: 'red'}}>
                            {errors.cardNumber}
                          </Text>
                        )}
                      </View>
                    </View>
                    <Text className="my-10 text-base">
                      Other Payment method
                    </Text>
                    <View className="flex flex-row justify-center w-full self-center">
                      <Image source={APPLE_PAY} className="mx-2" />
                      <Image source={MADA_LOGO} className="mx-2 mt-4" />
                      <Image source={MASTER_LOGO} className="mx-2" />
                      <Image source={VISA_LOGO} className="mx-2" />
                    </View>
                    <View>
                      <CheckBox
                        checked={values.termsAccepted}
                        onPress={() =>
                          setFieldValue('termsAccepted', !values.termsAccepted)
                        }
                        label="I agree to the terms and conditions"
                      />
                      {touched.termsAccepted && errors.termsAccepted && (
                        <Text style={styles.errorText}>
                          {errors.termsAccepted}
                        </Text>
                      )}

                      {/* Save Card Details Checkbox */}
                      <CheckBox
                        checked={values.saveCard}
                        onPress={() =>
                          setFieldValue('saveCard', !values.saveCard)
                        }
                        label="Save card details for next time"
                      />
                    </View>
                    <Button
                      onPress={handleSubmit}
                      title="LOGIN"
                      disabled={!values.termsAccepted}
                    />
                  </>
                )}
              </Formik>
            </ScrollView>
          </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  // container: {
  //   flex: 1,
  // },
  label: {
    fontSize: 16,
    color: '#333',
    marginVertical: 18,
    fontWeight: 'bold',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    marginRight: 8,
  },
  checked: {
    backgroundColor: '#007bff',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
    fontSize: 16,
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginBottom: 10,
  },
});
