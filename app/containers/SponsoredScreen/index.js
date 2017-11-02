import React from 'react';
import { View, ScrollView } from 'react-native';
import { connect } from 'react-redux';
import { DrinkupActions } from '../../redux';
import AppContainer from '../AppContainer';
import { NavItems, MarkDown, parseFile, Button } from '../../components';
import styles from './styles';

class SponsoredScreen extends React.Component {
  onEnterBar = () => {
    const { event } = this.props.navigation.state.params;
    this.props.setDrinkupBar({ ...event.bar });
    this.props.navigation.navigate('JoinDrinkUpScreen', { barId: event.bar.id });
  };
  render() {
    const { event } = this.props.navigation.state.params;
    if (event) {
      const eventContent = parseFile(event.content);
      return (
        <AppContainer
          title={eventContent.metadata.title}
          renderLeftButton={NavItems.backButton(this.props.navigation)}
        >
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

