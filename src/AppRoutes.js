import React from 'react';
import {
    createAppContainer,
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
import ConversationAddScreen from "./screens/Conversation/ConversationAddScreen";
import NotificationListScreen from "./screens/Notification/NotificationListScreen";
import UserScreen from "./screens/User/UserScreen";

const AppRootStack = createStackNavigator({
    Home: HomeScreen,
    Thread: ThreadDetailScreen,
    Forum: ForumScreen,
    ThreadCreate: ThreadCreateScreen,

    ConversationList: ConversationListScreen,
    ConversationDetail: ConversationDetailScreen,
    ConversationAdd: ConversationAddScreen,

    NotificationList: NotificationListScreen,

    User: UserScreen,

    // oauth screens
    Login: LoginScreen
}, {
    initialRouteName: 'Home'
});

const AppDrawerNavigator = createDrawerNavigator({
    AppRoot: AppRootStack
}, {
    initialRouteName: 'AppRoot',
    /* eslint-disable */
    contentComponent: ({navigation}) => <DrawerNavList navigation={navigation} />,
    /* eslint-enable */
    mode: Platform.OS === 'ios' ? 'modal' : 'card'
});

export const AppNavigator = createAppContainer(AppDrawerNavigator);