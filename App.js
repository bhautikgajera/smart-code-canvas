import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './src/screens/HomeScreen';
import { NavigationContainer } from '@react-navigation/native';
import { DIMENVALUES } from './src/utils/DimenValues';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import TextScreen from './src/screens/TextScreen';
import QRScreen from './src/screens/QRScreen';
import BarCodeScreen from './src/screens/BarCodeScreen';

const Stack = createStackNavigator();

const App = () => {
  return (
    <View style={styles.root}>
      <SafeAreaProvider>
        <SafeAreaView style={styles.container}>
          <NavigationContainer>
            <Stack.Navigator initialRouteName="Home" screenOptions={{ headerShown: false, animation: 'slide_from_bottom' }}>
              <Stack.Screen name="Home" component={HomeScreen} />
              <Stack.Screen name="TextScreen" component={TextScreen} />
              <Stack.Screen name="QRScreen" component={QRScreen} />
              <Stack.Screen name="BarCodeScreen" component={BarCodeScreen} />
            </Stack.Navigator>
          </NavigationContainer>
        </SafeAreaView>
      </SafeAreaProvider>
    </View>
  )
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    paddingTop: DIMENVALUES.paddingTop,
    paddingBottom: DIMENVALUES.paddingBottom,
    backgroundColor: '#000f14',
  },
  container: {
    flex: 1,
    backgroundColor: '#000f14',
  },
});

export default App