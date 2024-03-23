import React from 'react';
import {createDrawerNavigator} from '@react-navigation/drawer';
import {Home} from '../screens';
import {SafeAreaView} from 'react-native';

const Drawer = createDrawerNavigator();

const MyDrawer = () => {
  return (
    <SafeAreaView style={{backgroundColor:'white', flex:1}}>
      <Drawer.Navigator>
        <Drawer.Screen name="Home" component={Home} />
      </Drawer.Navigator>
    </SafeAreaView>
  );
};

export default MyDrawer;
