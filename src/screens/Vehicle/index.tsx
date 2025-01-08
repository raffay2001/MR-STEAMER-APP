import {
  View,
  Text,
  ScrollView,
  Image,
  Pressable,
  PressableProps,
  ActivityIndicator,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {TVehicleProps, TcarCardProps} from './types';
import {ACCESS_TOKEN, VEHICLEDATA} from '../../constants';
import {GET, POST} from '../../services';
import {
  ErrorResponse,
  vehiclePayload,
} from '../../services/types/vehicle.types';
import {ROUTES} from '../../routes';
import {useDispatch} from 'react-redux';
import {setVehicleState} from '../../redux/reducers/vehicle.reducer';
import {ErrorSuccessToast} from '../../utils/helper';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Vehicle: React.FC<TVehicleProps> = ({navigation}) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);
  const authToken = AsyncStorage.getItem(ACCESS_TOKEN);

  const handleCardClick = (card: any) => {
    console.log('Selected Card:', card); // Log the clicked card data
    setSelectedCard(card); // Save the clicked card data to state
  };

  const getVehicles = async () => {
    setLoading(true);
    console.log();
    try {
      // Validating; the input using LoginSchema
      // Calling the login API if validation passes
      const vehiclePayload = await GET<vehiclePayload & ErrorResponse>(
        ROUTES.ENUM,
      );
      console.log('Vehicle payload', vehiclePayload.data);
      dispatch(setVehicleState(vehiclePayload.data));
    } catch (error: any) {
      // logging the error
      console.log('Zajjaj', JSON.stringify(error.response.data));
      ErrorSuccessToast({
        type: 'error',
        message1: `${error.response.data.message}`,
        message2: '',
      });
      // navigation.navigate('Login');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log('Auth Zajjaj', authToken);
    getVehicles();
  }, []);

  return (
    <View className="flex-1 bg-white">
      <ScrollView showsVerticalScrollIndicator={false} className="bg-white">
        <View className="px-6 py-4 mb-7 bg-[#F5F7FA]">
          <Text className="text-black text-sm">Select Vehicle Type</Text>
        </View>
        {VEHICLEDATA?.map((car, i) => (
          <CarCard
            onPress={() => {
              navigation.navigate('Drawer', {screen: 'Home'});
              handleCardClick(car);
            }}
            key={i}
            img={car.img}
            text={car.text}
            color={car.color}
          />
        ))}
      </ScrollView>
    </View>
  );
};

const CarCard = ({
  img,
  text,
  color,
  ...props
}: TcarCardProps & PressableProps) => {
  return (
    <Pressable
      {...props}
      style={{backgroundColor: color}}
      className={'mb-7 rounded-xl px-9 py-4 items-center mx-6'}>
      <Image source={img} />
      <Text className="text-black text-xl">{text}</Text>
    </Pressable>
  );
};

export default Vehicle;
