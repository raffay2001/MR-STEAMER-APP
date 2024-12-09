import {StyleSheet, Text, View, FlatList} from 'react-native';
import React from 'react';
import {SafeAreaView, SafeAreaProvider} from 'react-native-safe-area-context';
import {TDetailsScreenProps} from '../../types/drawerscreens.types';
const BookingHistory = [
  {
    id: 1,
    customerName: 'John Doe',
    date: '2024-12-09',
    time: '14:00',
    service: 'Haircut',
    status: 'Completed',
    price: 25,
  },
  {
    id: 2,
    customerName: 'Jane Smith',
    date: '2024-12-08',
    time: '10:30',
    service: 'Spa Treatment',
    status: 'Cancelled',
    price: 50,
  },
  {
    id: 3,
    customerName: 'Michael Brown',
    date: '2024-12-07',
    time: '18:00',
    service: 'Massage',
    status: 'Upcoming',
    price: 40,
  },
];

export const BookingDetails: React.FC<TDetailsScreenProps> = () => {
  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <FlatList
          data={BookingHistory}
          keyExtractor={item => item.id.toString()}
          renderItem={}
        />
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({});
