import style from './styles';
import { Colors } from '../../themes';

const ButtonThemes = {
  primary: {
    gradient: true,
    gradientColors: [Colors.brand.orange, Colors.brand.shadow.orange],
  },
  dark: {
    style: style.darkBtn,
    textStyle: style.darkBtnText,
  },
  disallow: {
    style: style.btnDisallow,
    textStyle: style.btnDisallowText,
  },
};

export default ButtonThemes;
