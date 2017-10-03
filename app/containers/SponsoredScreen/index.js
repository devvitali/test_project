import React from 'react';
import { View, ScrollView } from 'react-native';
import AppContainer from '../AppContainer';
import { NavItems, MarkDown, parseFile, Button } from '../../components';
import styles from './styles';

export default class SponsoredScreen extends React.Component {
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
            <Button onPress={this.onDraftJoined} text={'Go to'} />
          </View>
        </AppContainer>
      );
    }
    return null;
  }
}
