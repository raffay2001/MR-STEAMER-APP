import {
  KeyboardAvoidingView,
  Pressable,
  StyleSheet,
  Text,
  View,
  Keyboard,
  TouchableWithoutFeedback,
} from 'react-native';
import React, {useState} from 'react';
import {TRegisterProps} from './types';
import {IoChevronBackOutline} from 'react-icons/io5';
import Input from '../../components/Input';
import {SvgWrapper} from '../../common/SvgWrapper';
import {goBackWhiteSvg, PersonSvg, WhiteArrowSvg} from '../../assets/svgs';
import {DropDown} from '../../common/DropDown';
import Button from '../../components/Button';

export const Register: React.FC<TRegisterProps> = ({navigation, route}) => {
  const [selectVehicle, setSelectVehicle] = useState(false);
  const [selectType, setSelectType] = useState(false);
  const [selectValue, setSelectValue] = useState(null);
  const [selectItems, setSelectItems] = useState([
    {label: 'Apple', value: 'apple'},
    {label: 'Banana', value: 'banana'},
  ]);
  const [CompanyValue, setCompanyValue] = useState(null);
  const [companyItems, setCompanySelectItems] = useState([
    {label: 'Apple', value: 'apple'},
    {label: 'Banana', value: 'banana'},
  ]);

  return (
    <View style={styles.container}>
      <Pressable style={{marginLeft: 10}} onPress={() => navigation.goBack()}>
        <SvgWrapper xml={goBackWhiteSvg} width={16} height={16} />
      </Pressable>

      <Text style={styles.mainHeading}>Register With Us</Text>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <KeyboardAvoidingView>
          <View style={styles.formContainer}>
            <View style={styles.feildContainer}>
              <Text className="text-white m-2 text-base font-semibold	">
                Name
              </Text>
              <Input placeholder="Enter Name" />
            </View>

            <View>
              <Text className="text-white m-2 text-base font-semibold	">
                Mobile Number
              </Text>
              <Input placeholder="Mobile Number" keyboardType="numeric" />
            </View>

            <View>
              <Text className="text-white m-2 text-base font-semibold	">
                Vehice Type
              </Text>
              <DropDown
                open={selectVehicle}
                items={selectItems}
                defaultValue={selectValue}
                setOpen={setSelectVehicle}
                setDefaultValue={setSelectValue}
              />
            </View>

            <View>
              <Text className="text-white m-2 text-base font-semibold	">
                Individual / Company
              </Text>
              <DropDown
                open={selectType}
                items={companyItems}
                defaultValue={CompanyValue}
                setOpen={setSelectType}
                setDefaultValue={setCompanyValue}
              />
            </View>
            <Button
              style={{
                backgroundColor: 'white',
                borderColor: 'white',
                width: '100%',
                marginVertical: 24,
              }}
              variant="primary"
              onPress={() => navigation.navigate('Register')}>
              <Text className="text-black text-center font-[Poppins-Medium] text-[18px]">
                Register
              </Text>
            </Button>
          </View>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
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
  feildContainer: {
    marginVertical: 8,
    marginHorizontal: 2,
  },
});
