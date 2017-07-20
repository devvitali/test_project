import React from 'react';
import { View, ScrollView } from 'react-native';
import { download } from '../../utils/downloadUtils';
import AppContainer from '../AppContainer';
import { NavItems, MarkDown, parseFile } from '../../components';
import styles from './styles';

export default class SponsoredScreen extends React.Component {
  static propTypes = {
    bar: React.PropTypes.object.isRequired,
  };
  constructor(props) {
    super(props);
    this.state = {
      file: null,
    };
  }
  componentDidMount() {
    if (this.props.bar) {
      const { event } = this.props.bar;
      download(event.content)
        .then((file) => {
          this.setState({
            file: parseFile(file),
          });
        });
    }
  }
  renderContent() {
    const { file } = this.state;
    if (file) {
      return (
        <View style={styles.mainContainer}>
          <ScrollView>
            <MarkDown content={file.content} style={styles} />
          </ScrollView>
        </View>
      );
    }
    return null;
  }
  render() {
    return (
      <AppContainer renderLeftButton={NavItems.backButton(this.props.navigation)}>
        {this.renderContent()}
      </AppContainer>
    );
  }
}
