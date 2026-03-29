import {NavigationContainer} from '@react-navigation/native';
import Slctcorestacknv from './selectcoresource/slctcoreroutes/Slctcorestacknv';
import {SlctcoreProvider} from './selectcoresource/slctcorestrage/slctcorescontext';
import Toast from 'react-native-toast-message';

const App = () => {
  return (
    <NavigationContainer>
      <SlctcoreProvider>
        <Slctcorestacknv />

        <Toast position="top" topOffset={40} />
      </SlctcoreProvider>
    </NavigationContainer>
  );
};

export default App;
