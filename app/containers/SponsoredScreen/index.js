import React from 'react';
import { View, ScrollView } from 'react-native';
import { download } from '../../utils/downloadUtils';
import AppContainer from '../AppContainer';
import { NavItems, MarkDown, parseFile } from '../../components';
import styles from './styles';

export default class SponsoredScreen extends React.Component {
  renderContent(eventContent) {
    return (
      <View style={styles.mainContainer}>
        <ScrollView>
          <MarkDown content={eventContent.content} style={styles} />
        </ScrollView>
      </View>
    );
  }
  render() {
    const { event } = this.props.navigation.state.params;
    if (event) {
      const eventContent = parseFile(event.content);
      return (
        <AppContainer
          title={eventContent.metadata.title}
          renderLeftButton={NavItems.backButton(this.props.navigation)}
        >
          {this.renderContent(eventContent)}
        </AppContainer>
      );
    }
    return null;
  }
}
