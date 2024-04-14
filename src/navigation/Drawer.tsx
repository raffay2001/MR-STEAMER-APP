/* eslint-disable react/no-unstable-nested-components */
import React from 'react';
import {createDrawerNavigator} from '@react-navigation/drawer';
import {Home} from '../screens';
import {SafeAreaView} from 'react-native';
import Icons from '../assets/svgs/icons';
import {SvgWrapper} from '../common/SvgWrapper';
import {CustomDrawerComponent} from '../components/DrawerComponents';
import {DrawerStackParamList} from '../types/drawerscreens.types';

const Drawer = createDrawerNavigator<DrawerStackParamList>();

const MyDrawer = () => {
  return (
    <SafeAreaView style={{backgroundColor: 'white', flex: 1}}>
      <Drawer.Navigator
        screenOptions={({navigation}): any => ({
          drawerStyle: {
            backgroundColor: 'white',
            width: '80%',
          },
          headerLeft: () => <HeaderLeft navigation={navigation} />,
          headerRight: () => <HeaderRight navigation={navigation} />,
          title: 'Abdullah Al-Saleem',
          headerTitleStyle: {fontSize: 16, letterSpacing: 0.8, fontWeight: 400},
        })}
        drawerContent={props => <CustomDrawerComponent {...props} />}>
        <Drawer.Screen name="Home" component={Home} />
      </Drawer.Navigator>
    </SafeAreaView>
  );
};

export default MyDrawer;

const HeaderLeft = ({navigation}: any) => {
  return (
    <SvgWrapper
      xml={Icons.menuIcon}
      width={22}
      height={22}
      style={{marginLeft: 20}}
      icon={true}
      onPress={() => navigation.toggleDrawer()}
    />
  );
};

const HeaderRight = ({navigation}: any) => {
  return (
    <SvgWrapper
      xml={Icons.shoppingIcon}
      width={22}
      height={22}
      style={{marginRight: 20}}
      icon={true}
      onPress={() => navigation.toggleDrawer()}
    />
  );
};
