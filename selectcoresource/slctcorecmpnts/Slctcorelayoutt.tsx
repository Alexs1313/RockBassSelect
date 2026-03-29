import {ImageBackground, ScrollView} from 'react-native';

const Slctcorelayoutt = ({children}: {children: React.ReactNode}) => {
  return (
    <ImageBackground
      style={{flex: 1}}
      source={require('../../elmnts/i/slctcorelayout.png')}>
      <ScrollView
        contentContainerStyle={{flexGrow: 1}}
        showsVerticalScrollIndicator={false}>
        {children}
      </ScrollView>
    </ImageBackground>
  );
};

export default Slctcorelayoutt;
