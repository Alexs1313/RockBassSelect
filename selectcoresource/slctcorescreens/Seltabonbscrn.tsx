import React, {useState} from 'react';
import {
  View,
  Text,
  ImageBackground,
  Image,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import Slctcorelayoutt from '../slctcorecmpnts/Slctcorelayoutt';
import {useNavigation} from '@react-navigation/native';

const slctonboardindata = [
  {
    id: 1,
    title: `Choose your mood. Not the route.
You set the vibe — the app builds the variant.`,
    image: require('../../elmnts/i/slctcoreonbr1.png'),
    button: 'Continue',
  },
  {
    id: 2,
    title: `You decide where and with whom.
No accidents. No noise.`,
    image: require('../../elmnts/i/slctcoreonbr2.png'),
    button: 'Next',
  },
  {
    id: 3,
    title: `Make your choice.
Leave a moment for yourself.`,
    image: require('../../elmnts/i/slctcoreonbr3.png'),
    button: 'Okay',
  },
  {
    id: 4,
    title: `Photos and decisions are stored only for you.
No publicity. No pressure.`,
    image: require('../../elmnts/i/slctcoreonbr4.png'),
    button: 'Start Now',
  },
];

const Seltabonbscrn = () => {
  const [slctcoreIndex, setSlctcoreIndex] = useState(0);
  const navigation = useNavigation();

  const onSlctcoreIndexChange = (index: number) => {
    slctcoreIndex === 3
      ? navigation.replace('Seltabcretacc')
      : setSlctcoreIndex(index + 1);
  };
  return (
    <Slctcorelayoutt>
      <View style={styles.slctcoreonbrcontainer}>
        <Image source={slctonboardindata[slctcoreIndex].image} />

        <ImageBackground
          source={require('../../elmnts/i/slctcoreboard.png')}
          style={{
            width: 353,
            height: 333,
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: 68,
            paddingVertical: 60,
            paddingHorizontal: 30,
          }}
          resizeMode="stretch">
          <Text style={styles.slctcoreonbtext}>
            {slctonboardindata[slctcoreIndex].title}
          </Text>

          <TouchableOpacity
            style={styles.slctcorebtn}
            onPress={() => onSlctcoreIndexChange(slctcoreIndex)}
            activeOpacity={0.8}>
            <Text style={styles.slctcorebtntext}>
              {slctonboardindata[slctcoreIndex].button}
            </Text>
          </TouchableOpacity>
        </ImageBackground>
      </View>
    </Slctcorelayoutt>
  );
};

export default Seltabonbscrn;

const styles = StyleSheet.create({
  slctcoreonbrcontainer: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: 60,
  },
  slctcorebtn: {
    backgroundColor: '#3AFFA0',
    padding: 10,
    borderRadius: 44,
    width: 228,
    height: 69,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
  },
  slctcorebtntext: {
    fontSize: 20,
    fontFamily: 'Manrope-SemiBold',
    color: '#000000',
    textAlign: 'center',
  },
  slctcoreonbtext: {
    fontSize: 20,
    fontFamily: 'Manrope-SemiBold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 5,
  },
});
