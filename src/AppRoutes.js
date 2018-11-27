import React from 'react';
import {
    createStackNavigator,
    createDrawerNavigator
} from "react-navigation";
import DrawerNavList from "./drawer/DrawerNavList";
import {Platform} from "react-native";
import HomeScreen from "./screens/Home/HomeScreen";
import ThreadDetailScreen from "./screens/Thread/ThreadDetailScreen";
import ForumScreen from "./screens/Forum/ForumScreen";
import ThreadCreateScreen from "./screens/Thread/ThreadCreateScreen";
import LoginScreen from "./screens/Auth/LoginScreen";
import ConversationList from "./screens/Conversation/ConversationList";

const AppRootStack = createStackNavigator({
    Home: HomeScreen,
    ThreadDetail: ThreadDetailScreen,
    Forum: ForumScreen,
    ThreadCreate: ThreadCreateScreen,

    ConversationList: ConversationList,

    // oauth screens
    Login: LoginScreen
}, {
    initialRouteName: 'ConversationList'
});

export const AppNavigator = createDrawerNavigator({
    AppRoot: AppRootStack
}, {
    initialRouteName: 'AppRoot',
    /* eslint-disable */
    contentComponent: ({navigation}) => <DrawerNavList navigation={navigation} />,
    /* eslint-enable */
    mode: Platform.OS === 'ios' ? 'modal' : 'card'
});