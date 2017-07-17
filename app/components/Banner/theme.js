import style from './styles';
import { Colors } from '../../themes';

export default {
  info: {
    gradientColors: [Colors.brand.yellow, Colors.brand.shadow.yellow],
    iconColor: Colors.brand.black,
  },
  alert: {
    gradientColors: [Colors.brand.orange, Colors.brand.shadow.orange],
    textStyle: style.alertText,
    iconColor: Colors.snow,
  },
};
