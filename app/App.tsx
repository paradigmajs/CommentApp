import React, {useEffect} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';

import {createTables} from './database/database';
import RegisterScreen from './screens/RegisterScreen';
import CommentScreen from './screens/CommentScreen';

const Stack = createStackNavigator();

const App: React.FC = () => {
  useEffect(() => {
    createTables();
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="RegisterScreen">
        <Stack.Screen name="RegisterScreen" component={RegisterScreen} />
        <Stack.Screen name="CommentScreen" component={CommentScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
