import Firestack from 'react-native-firestack';

const firestack = new Firestack();
firestack.on('debug', (msg) => {
  console.log({
    name: 'Firestack Debug',
    value: msg,
    important: true,
  });
});

export default firestack;
