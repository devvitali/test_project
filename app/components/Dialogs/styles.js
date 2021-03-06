import { StyleSheet } from 'react-native';
import { Colors, Metrics } from '../../themes';

export default StyleSheet.create({
  dialogContainer: {
    width: Metrics.screenWidth - 80,
    paddingVertical: Metrics.baseMargin,
  },
  contentContainer: {
    alignSelf: 'center',
    minHeight: 100,
    width: Metrics.screenWidth - 100,
    backgroundColor: Colors.brand.black,
    borderRadius: 15,
    borderColor: Colors.brand.gray,
    borderWidth: 2,
    padding: Metrics.doubleBaseMargin,
    flexDirection: 'column',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  subcontentContainer: {
    width: Metrics.screenWidth - 100,
  },
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  closeButton: {
    justifyContent: 'center',
    position: 'absolute',
    top: 0,
    right: 0,
    width: 30,
    height: 30,
    backgroundColor: Colors.brand.dark,
    borderRadius: 15,
    borderColor: Colors.brand.gray,
    borderWidth: 2,
  },
  closeIcon: {
    paddingBottom: 2,
    backgroundColor: Colors.transparent,
    alignSelf: 'center',
  },
});
