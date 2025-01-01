import {
  ImageBackground,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React from 'react';
import {TCheckoutScreenProps} from '../../services/types/drawerscreens.types';
import {SvgWrapper} from '../../common/SvgWrapper';
import Icons from '../../assets/svgs/icons';
import Button from '../../components/Button';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {FlatList} from 'react-native-gesture-handler';
import {BookingCheckOutCard} from '../../common/GencCards';
import {BOOKINGS} from '../../constants/index';
import ArrivalTime from '../../common/ArrivalTime';
export const BookingCheckout: React.FC<TCheckoutScreenProps> = ({
  navigation,
  route,
}) => {
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
            Your Booking
          </Text>
        </View>
      </View>
      <SafeAreaProvider>
        <SafeAreaView style={styles.container}>
          <Text className="pb-5 text-base text-black	">
            Choose a package for the best service
          </Text>
          <FlatList
            data={BOOKINGS}
            keyExtractor={item => item.bookingId.toString()}
            renderItem={({item}) => (
              <BookingCheckOutCard
                BookingId={item?.bookingId}
                Package={item?.package}
                Details={item?.detail}
              />
            )}
            showsVerticalScrollIndicator={false}
            ListFooterComponent={<ArrivalTime />} // Footer button
          />
        </SafeAreaView>
      </SafeAreaProvider>
      <Button
        style={{
          backgroundColor: '#2D4795',
          borderColor: '#2D4795',
          width: '80%',
          marginVertical: 24,
          marginHorizontal: 50,
        }}
        variant="primary"
        onPress={() => navigation.navigate('CheckOut')}>
        <Text className="text-white text-center font-[Poppins-Medium] text-[20px]">
          Check Out
        </Text>
      </Button>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f2f2f2',
    paddingTop: 10,
    paddingHorizontal: 20,
  },
});
