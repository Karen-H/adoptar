import React from 'react';
import {
  Text,
  View,
} from 'react-native';

class Greetings extends React.Component {
  render() {
    return (
      <Text>AGREGADOS</Text>
    )
  }  
}

const MyComponent = () => {
  return (
    <View>
      <Greetings/>
    </View>
  )
}
export default MyComponent