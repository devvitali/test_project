import React from 'react';
import { Text, View } from 'react-native';
import moment from 'moment';

import Styles from './styles';
import Markdown, { parseFile } from '../MarkDown';

const Document = ({ file }) => {
  const { metadata, content } = parseFile(file);
  const updatedOn = moment(metadata.updated_at).format('MMMM Do, YYYY');
  return (
    <View style={Styles.mainContainer}>
      <Markdown content={content} style={Styles}>
        <Text style={Styles.documentName}>{metadata.document}</Text>
        <Text style={Styles.updatedOn}>Last updated on {updatedOn}</Text>
      </Markdown>
    </View>
  );
};

export default Document;
