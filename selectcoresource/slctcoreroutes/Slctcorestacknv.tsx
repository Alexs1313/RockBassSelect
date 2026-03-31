// stack

import {createStackNavigator} from '@react-navigation/stack';
import Seltabroutes from '../../Seltabroutes';

import Seltabonbscrn from '../slctcorescreens/Seltabonbscrn';
import Slctcoreloadde from '../slctcorecmpnts/Slctcoreloadde';
import Seltabcretacc from '../slctcorescreens/Seltabcretacc';
import Seltabmotvtnscr from '../slctcorescreens/Seltabmotvtnscr';
import Seltababotscr from '../slctcorescreens/Seltababotscr';

const Stack = createStackNavigator();

const Slctcorestacknv = () => {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="Slctcoreloadde" component={Slctcoreloadde} />
      <Stack.Screen name="Seltabcretacc" component={Seltabcretacc} />
      <Stack.Screen name="Seltabonbscrn" component={Seltabonbscrn} />
      <Stack.Screen name="Seltabroutes" component={Seltabroutes} />
      <Stack.Screen name="Seltabmotvtnscr" component={Seltabmotvtnscr} />
      <Stack.Screen name="Seltababotscr" component={Seltababotscr} />
    </Stack.Navigator>
  );
};

export default Slctcorestacknv;
