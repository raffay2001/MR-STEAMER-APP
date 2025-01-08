import {
  Pressable,
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  FlatList,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {TPackagesScreenProps} from '../../services/types/drawerscreens.types';
import {SvgWrapper} from '../../common/SvgWrapper';
import Icons from '../../assets/svgs/icons';
import Card from '../../components/PackageCard';
import {PACKAGE_DATA} from '../../constants';
import {GET} from '../../services';
import {vehiclePayload} from '../../services/types/vehicle.types';
import {
  ErrorResponse,
  packagePayload,
} from '../../services/types/packages.types';
import {ROUTES} from '../../routes';
import {ErrorSuccessToast} from '../../utils/helper';

export const Packages: React.FC<TPackagesScreenProps> = ({
  navigation,
  route,
}) => {
  const [loading, setLoading] = useState(false);
  const [packageList, setPackageList] = useState([]);
  const renderItem = ({item}: {item: (typeof PACKAGE_DATA)[0]}) => (
    <Card
      title={item.title}
      description={item.description}
      onPressLink={() => console.log(`${item.title} link pressed!`)}
    />
  );
  const getPackages = async () => {
    setLoading(true);
    console.log();
    try {
      // Validating; the input using LoginSchema
      // Calling the login API if validation passes
      const packagesPayload = await GET<packagePayload & ErrorResponse>(
        ROUTES.PACKAGES,
      );
      console.log('Package payload', packagesPayload.data);
      const result = packagesPayload.data?.results;
      setPackageList(result);
    } catch (error: any) {
      // logging the error
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
    getPackages();
  }, []);

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
            data={PACKAGE_DATA}
            renderItem={renderItem}
            keyExtractor={item => item.id} // Unique key for each item
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
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
