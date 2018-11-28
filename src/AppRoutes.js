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
import ConversationListScreen from "./screens/Conversation/ConversationListScreen";
import ConversationDetailScreen from "./screens/Conversation/ConversationDetailScreen";

const AppRootStack = createStackNavigator({
    Home: HomeScreen,
    ThreadDetail: ThreadDetailScreen,
    Forum: ForumScreen,
    ThreadCreate: ThreadCreateScreen,

    ConversationList: ConversationListScreen,
    ConversationDetail: ConversationDetailScreen,

    // oauth screens
    Login: LoginScreen
}, {
    initialRouteName: 'Home'
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