import React from 'react';
import { createIconSetFromFontello } from 'react-native-vector-icons';
import fontelloConfig from './config.json';
const Icon = createIconSetFromFontello(fontelloConfig, 'alko');
export default props => <Icon {...props} />;
