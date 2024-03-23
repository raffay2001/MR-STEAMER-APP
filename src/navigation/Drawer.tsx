import {createDrawerNavigator} from '@react-navigation/drawer';
import {Home} from '../screens';

const Drawer = createDrawerNavigator();

function DrawerNavigator() {
  return (
    <Drawer.Navigator>
      {/* Add your screens here */}
      <Drawer.Screen name="Home" component={Home} />
    </Drawer.Navigator>
  );
};
export default DrawerNavigator;
