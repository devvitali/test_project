import { StyleSheet } from 'react-native';
import { Fonts, Metrics, Colors } from '../themes';

export default StyleSheet.create({
  applicationView: {
    flex: 1,
    backgroundColor: Colors.brand.dark,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: Colors.brand.dark,
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    fontFamily: Fonts.type.base,
    margin: Metrics.baseMargin,
  },
  myImage: {
    width: 200,
    height: 200,
    alignSelf: 'center',
  },
});
