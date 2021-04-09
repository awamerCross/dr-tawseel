import Reactotron from 'reactotron-react-native';
import { reactotronRedux } from 'reactotron-redux';
import React from "react";

const reactotron = Reactotron.configure({ name: 'DR-Tawsel', host: '192.168.1.33', port: 9090 })
	.use(reactotronRedux()).useReactNative()
	.connect();

export default reactotron
