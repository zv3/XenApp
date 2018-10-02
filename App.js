import React from 'react';
import {
    Platform,
    SafeAreaView
} from 'react-native';

import {
    createStackNavigator,
    createDrawerNavigator,
} from 'react-navigation';

import HomeScreen from "./src/screens/HomeScreen";
import ForumScreen from "./src/screens/ForumScreen";
import {DrawerMenuContent, DrawerTrigger} from './src/components/Drawer'

import ThreadListScreen from "./src/screens/ThreadListScreen";
import ThreadDetailScreen from "./src/screens/ThreadDetailScreen"

import LoginScreen from "./src/screens/LoginScreen";
import RegisterScreen from "./src/screens/RegisterScreen";
import {dataStore} from "./src/data/dataStore";
import {LoadingSwitch} from "./src/screens/LoadingScreen";
import {apiFetcher} from "./src/helpers/apiFetcher";
import {objectStore} from "./src/data/objectStore";
import {Config} from "./src/Config";
import {isPlainObject} from "./src/helpers/funcs"


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
    [Config.Constants.SCREEN_THREAD_LIST]: ThreadListScreen,
    [Config.Constants.SCREEN_THREAD_DETAIL]: ThreadDetailScreen
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
            loadState: Config.Constants.LOADING_STATE_BEGIN
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
            this.setState({ loadState: Config.Constants.LOADING_STATE_DONE })
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

        // dataStore.remove(Config.Constants.OAUTH_DATA);

        doFetchData().then((val) => {
            let json;
            try {
                json = JSON.parse(val);
            } catch (e) {
            }

            if (isPlainObject(json) && json.hasOwnProperty('access_token')) {
                this._doFetchData(json);
            } else {
                this.setState({ loadState: Config.Constants.LOADING_STATE_DONE });
            }
        });
    }

    render() {
        const finalView = (
            <AppNavigator />
        );

        return <LoadingSwitch loadState={this.state.loadState} view={finalView}/>;
    }
}
