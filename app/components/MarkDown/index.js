import React from 'react';
import PropTypes from 'prop-types';
import { ScrollView, Text, View } from 'react-native';
import { findIndex, map, slice } from 'lodash';

export function parseFile(file) {
  const lines = file.split(/\n/);
  const metadata = {};
  const index = findIndex(lines, (line) => {
    if (line === '') {
      return true;
    }
    const parts = line.split(/: /);
    metadata[parts[0]] = parts[1];
    return false;
  });

  const content = slice(lines, index + 1);
  return { metadata, content };
}

const Markdown = ({ content, style, children }) => (
  <ScrollView style={style.container}>
    {children}
    {map(content, (line, i) => {
      if (line[0] === '#') {
        return <Text key={i} style={style.header}>{line.substr(2)}</Text>;
      } else if (line === '') {
        return <View key={i} style={style.spacer} />;
      }
      return <Text key={i} style={style.body}>{line}</Text>;
    })}
  </ScrollView>
);
Markdown.propTypes = {
  style: PropTypes.any,
  content: PropTypes.arrayOf(PropTypes.string),
  children: PropTypes.any,
};
export default Markdown;
