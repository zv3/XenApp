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

import Icon from "react-native-vector-icons/Feather";

import HomeScreen from "./src/screens/HomeScreen";
import ForumScreen from "./src/screens/ForumScreen";
import {DrawerMenuContent, DrawerTrigger} from './src/components/Drawer'
import {ThreadListScreen} from "./src/screens/ThreadScreen";
import LoginScreen from "./src/screens/LoginScreen";
import RegisterScreen from "./src/screens/RegisterScreen";
import {dataStore} from "./src/helpers/dataStore";
import LoadingScreen from "./src/screens/LoadingScreen";
import {apiFetcher} from "./src/helpers/apiFetcher";
import {objectStore} from "./src/data/objectStore";
import {Config} from "./src/Config";


const AuthenticateStack = createStackNavigator({
    [Config.Constants.SCREEN_LOGIN]: LoginScreen,
    [Config.Constants.SCREEN_REGISTER]: RegisterScreen
}, {
    initialRouteName: Config.Constants.SCREEN_LOGIN,
    navigationOptions: {
        header: null
    }
});

const AppRootStack = createStackNavigator({
    [Config.Constants.SCREEN_HOME]: {
        screen: HomeScreen,
        navigationOptions: ({navigation}) => ({
            title: 'Home',
            headerLeft: <DrawerTrigger navigation={navigation} />
        })
    },
    [Config.Constants.SCREEN_FORUM]: ForumScreen,
    [Config.Constants.SCREEN_THREAD_LIST]: ThreadListScreen
}, {
    initialRouteName: Config.defaultScreen
});

const AppNavigator = createDrawerNavigator({
    AppRoot: AppRootStack,
    Authenticate: AuthenticateStack
}, {
    initialRouteName: 'AppRoot',
    contentComponent: ({navigation}) => <DrawerMenuContent navigation={navigation} />,
    mode: Platform.OS === 'ios' ? 'modal' : 'card'
});


export default class App extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            isLoading: true
        };
    }

    _doFetchData(oAuthData) {
        const batchJson = [
            {
                method: 'GET',
                uri: 'users/me'
            }
        ];

        const doneFetch = () => {
            this.setState({ isLoading: false })
        };

        apiFetcher.post(`batch?oauth_token=${oAuthData.access_token}`, JSON.stringify(batchJson), {
            onSuccess: (data) => {
                const userData = data["jobs"]["users/me"];
                if (userData.hasOwnProperty('user')) {
                    objectStore.set(Config.Constants.VISITOR, userData.user);
                }

                doneFetch();
            },

            onError: (error) => {
                doneFetch();
            }
        });
    }

    componentDidMount() {
        const doFetchData = async () => {
            return await dataStore.getOAuthData();
        };

        doFetchData().then((val) => {
            let json;
            try {
                json = JSON.parse(val);
            } catch (e) {
            }

            if (json && json.hasOwnProperty('access_token')) {
                this._doFetchData(json);
            } else {
                this.setState({ isLoading: false });
            }
        });
    }

    render() {
        if (this.state.isLoading) {
            return (<LoadingScreen/>);
        }

        return <AppNavigator />;
    }
}
