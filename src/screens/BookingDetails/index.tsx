import {StyleSheet, Text, View, FlatList, Pressable} from 'react-native';
import React from 'react';
import {SafeAreaView, SafeAreaProvider} from 'react-native-safe-area-context';
import {TDetailsScreenProps} from '../../types/drawerscreens.types';
import {BookingDetailsCard, CarService} from '../../common/GencCards';
import {SvgWrapper} from '../../common/SvgWrapper';
import Icons from '../../assets/svgs/icons';
const BookingHistory = [
  {
    id: 1,
    serviceeName: 'John Doe',
    date: '2024-12-09',
    time: '14:00',
    service: 'Haircut',
    status: 'Completed',
    price: 25,
  },
  {
    id: 2,
    serviceeName: 'Jane Smith',
    date: '2024-12-08',
    time: '10:30',
    service: 'Spa Treatment',
    status: 'Cancelled',
    price: 50,
  },
  {
    id: 3,
    serviceeName: 'Michael Brown',
    date: '2024-12-07',
    time: '18:00',
    service: 'Massage',
    status: 'Upcoming',
    price: 40,
  },
];

export const BookingDetails: React.FC<TDetailsScreenProps> = ({
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
            Booking Details
          </Text>
        </View>
      </View>
      <SafeAreaProvider>
        <SafeAreaView style={styles.container}>
          <FlatList
            data={BookingHistory}
            keyExtractor={item => item.id.toString()}
            renderItem={({item}) => (
              <BookingDetailsCard item={item?.serviceeName || ''} />
            )}
            showsVerticalScrollIndicator={false}
          />
        </SafeAreaView>
      </SafeAreaProvider>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f2f2f2',
    paddingTop: 30,
    paddingHorizontal: 20,
  },
});
