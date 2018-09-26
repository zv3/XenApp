import React from 'react';
import {
    Text,
    View,
    Platform,
    FlatList,
    TouchableHighlight,
    StyleSheet
} from 'react-native';

import {
    createStackNavigator,
    createDrawerNavigator,
} from 'react-navigation';

import Icon from 'react-native-vector-icons/Feather';

import HomeScreen from "./src/screens/HomeScreen";
import ForumScreen from "./src/screens/ForumScreen";
import DrawerTrigger from './src/DrawerTrigger'
import ThreadListScreen from "./src/screens/ThreadListScreen";
import LoginScreen from "./src/screens/LoginScreen";
import RegisterScreen from "./src/screens/RegisterScreen";

const AuthenticateStack = createStackNavigator({
    Login: LoginScreen,
    Register: RegisterScreen
}, {
    initialRouteName: 'Login',
    navigationOptions: {
        header: null
    }
});

const AppRootStack = createStackNavigator({
    Home: {
        screen: HomeScreen,
        navigationOptions: ({navigation}) => ({
            title: 'Home',
            headerLeft: <DrawerTrigger navigation={navigation} />
        })
    },
    Forum: ForumScreen,
    ThreadList: ThreadListScreen
}, {
    initialRouteName: 'Home'
});

const AppNavigator = createDrawerNavigator({
    AppRoot: AppRootStack,
    Authenticate: AuthenticateStack
}, {
    initialRouteName: 'AppRoot',
    contentComponent: ({navigation}) => <DrawerMenuContent navigation={navigation} />,
    mode: Platform.OS === 'ios' ? 'modal' : 'card'
});

const style = StyleSheet.create({
    drawer: {
        backgroundColor: 'rgb(245,245,245)',
        flex: 1,
        borderWidth: 0
    },

    drawerHeader: {
        backgroundColor: 'red',
        height: 160,
        padding: 15
    },

    drawerItem: {
        paddingTop: 10,
        paddingBottom: 10,
        paddingLeft: 15,
        paddingRight: 15,
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center'
    }
});

class DrawerMenuContent extends React.Component {
    constructor(props) {
        super(props)
    }

    _onPress(item) {
        this.props.navigation.navigate(item.navigationId);
    }

    render() {
        const navItems = [
            {
                title: 'Home',
                key: 'home',
                icon: 'home',
                navigationId: 'Home'
            },
            {
                title: 'Notifications',
                key: 'notifications',
                icon: 'bell',
                navigationId: ''
            },
            {
                title: 'Conversations',
                key: 'conversations',
                icon: 'inbox',
                navigationId: 'Conversation'
            },
            {
                title: 'Forums',
                key: 'forums',
                icon: 'folder',
                navigationId: 'Forum'
            },
            {
                title: 'Watched Content',
                key: 'watched_content',
                icon: 'bookmark',
                navigationId: ''
            },
            {
                title: 'Settings',
                key: 'settings',
                icon: 'settings',
                navigationId: ''
            }
        ];

        return (
            <View style={style.drawer}>
                <View style={style.drawerHeader}>
                    <Text style={{ color: '#fff' }}>Header...</Text>
                </View>

                <FlatList
                    data={navItems}
                    renderItem={({item, separators}) => (
                        <TouchableHighlight
                            onPress={() => this._onPress(item)}
                            underlayColor="rgb(237, 246, 253)">

                            <View style={style.drawerItem}>
                                <Icon name={item.icon} size={20} style={{ paddingRight: 20 }} />
                                <Text style={{ fontSize: 16 }}>{item.title}</Text>
                            </View>
                        </TouchableHighlight>
                    )}
                />
            </View>
        );
    }
}

export default class App extends React.Component {
    render() {
        return <AppNavigator />;
    }
}
