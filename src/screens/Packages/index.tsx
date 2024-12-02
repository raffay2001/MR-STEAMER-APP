import {
  Pressable,
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  FlatList,
} from 'react-native';
import React from 'react';
import {TPackagesScreenProps} from '../../types/drawerscreens.types';
import {SvgWrapper} from '../../common/SvgWrapper';
import Icons from '../../assets/svgs/icons';
import Card from '../../components/PackageCard';

export const Packages: React.FC<TPackagesScreenProps> = ({
  navigation,
  route,
}) => {
  const data = [
    {
      id: '1',
      title: 'Mr Silver',
      description: 'Monthly Package - SAR 90',
    },
    {
      id: '2',
      title: 'Mr Gold',
      description: 'Monthly Package - SAR 120',
    },
    {
      id: '3',
      title: 'Mr Platinum',
      description: 'Monthly Package - SAR 150',
    },
    {
      id: '4',
      title: 'Mr Platinum',
      description: 'Monthly Package - SAR 150',
    },
    {
      id: '5',
      title: 'Mr Platinum',
      description: 'Monthly Package - SAR 150',
    },
  ];

  const renderItem = ({item}: {item: (typeof data)[0]}) => (
    <Card
      title={item.title}
      description={item.description}
      onPressLink={() => console.log(`${item.title} link pressed!`)}
    />
  );

  return (
    <View style={{flex: 1, backgroundColor: '#FFFFFF'}}>
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
            Packages
          </Text>
        </View>
      </View>
      <View style={styles.mainContainer}>
        <Text className="text-md font-bold">
          Choose a package for the best service
        </Text>
        <SafeAreaView style={{flex: 1}}>
          <FlatList
            data={data}
            renderItem={renderItem}
            keyExtractor={item => item.id} // Unique key for each item
            contentContainerStyle={styles.listContent}
          />
        </SafeAreaView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
});
