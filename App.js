import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, I18nManager, AsyncStorage } from 'react-native';
import * as Font from 'expo-font';
import { Ionicons } from '@expo/vector-icons';
import { AppLoading } from 'expo';
import { Root } from 'native-base';
import MainRoot from './src/routes/Auth';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistedStore } from './src/store';
import './ReactotronConfig';
import * as Notifications from 'expo-notifications';
import { Asset } from 'expo-asset';

export default function App() {

  const [isLoading, setisLoading] = useState(true);
  // AsyncStorage.clear()

  useEffect(() => {

    if (Platform.OS === 'android') {
      Notifications.setNotificationChannelAsync('orders', {
        name: 'E-mail notifications',
        importance: Notifications.AndroidImportance.HIGH,
        sound: true, // <- for Android 8.0+, see channelId property below
      });
    }

    // I18nManager.forceRTL(true)
    async function loadFont() {
      await Font.loadAsync({
        flatLight: require('./assets/fonts/JF-Flat-light.ttf'),
        flatMedium: require('./assets/fonts/JF-Flat-medium.ttf'),
        flatRegular: require('./assets/fonts/JF-Flat-regular.ttf'),
        ...Ionicons.font,
      });


      setisLoading(false)
    }
    loadFont();

  }, []);


  const _cacheResourcesAsync = async () => {
    const images = [require('./assets/splash.png')]

    const cacheImages = images.map(image => {
      return Asset.fromModule(image).downloadAsync();
    });
    return Promise.all(cacheImages);
  }

  if (isLoading) {
    return <AppLoading
      startAsync={_cacheResourcesAsync}
      onFinish={() => setisLoading(true)}
      onError={console.warn}
    />
  } else {
    return (
      <Provider store={store}>
        <PersistGate persistor={persistedStore}>
          <Root>
            <MainRoot />
          </Root>
        </PersistGate>
      </Provider>
    );
  }



}
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

//
// Keystore password: e5769234948b481d801aa13ddc4ae79c
// Key alias:         QG1fc2hhbXMvRFJUYXdzZWVs
// Key password:      cae6e8e4912d40f2a3149593690ea90c
