import React from 'react';
import { View, ScrollView } from 'react-native';
import { connect } from 'react-redux';
import { firebaseAnalytics } from '../../firebase';
import { DrinkupActions } from '../../redux';
import { BarImages } from '../BarScreen/BarImages';
import AppContainer from '../AppContainer';
import { NavItems, MarkDown, parseFile, Button } from '../../components';
import styles from './styles';

class SponsoredScreen extends React.Component {

  componentDidMount() {
    firebaseAnalytics.setCurrentScreen('Event');
  }

  onEnterBar = () => {
    const { event } = this.props.navigation.state.params;
    this.props.setDrinkupBar({ ...event.bar });
    this.props.navigation.navigate('JoinDrinkUpScreen', { barId: event.bar.id });
  };

  render() {
    const { event } = this.props.navigation.state.params;
    if (event) {
      const eventContent = parseFile(event.content);
      const images = [
        eventContent.metadata.image,
      ];
      return (
        <AppContainer
          title={eventContent.metadata.title}
          renderLeftButton={NavItems.backButton(this.props.navigation)}
        >
          <BarImages images={images} />
          <View style={styles.mainContainer}>
            <ScrollView>
              <MarkDown content={eventContent.content} style={styles} />
            </ScrollView>
          </View>
          <View style={styles.buttonContainer}>
            <Button onPress={this.onEnterBar} text={eventContent.metadata.action} />
          </View>
        </AppContainer>
      );
    }
    return null;
  }

}
const mapDispatchToProps = dispatch => ({
  setDrinkupBar: bar => dispatch(DrinkupActions.initDrinkupBar(bar)),
});

export default connect(null, mapDispatchToProps)(SponsoredScreen);
