/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {Platform, View, Text, ActivityIndicator, StyleSheet, AsyncStorage} from 'react-native';

import {
    createStackNavigator,
    createDrawerNavigator
} from "react-navigation";
import HomeScreen from "./src/screens/HomeScreen";
import {DrawerMenuContent} from "./src/components/Drawer"
import ThreadDetailScreen from "./src/screens/ThreadDetailScreen";
import LoginScreen from "./src/screens/LoginScreen";
import {fetcher} from "./src/utils/Fetcher";
import {CLIENT_ID, CLIENT_SECRET} from "./src/Config";
import {getOAuthData, saveToken, Token} from "./src/utils/Token";

const AppRootStack = createStackNavigator({
    Home: HomeScreen,
    ThreadDetail: ThreadDetailScreen,


    // oauth screens
    Login: LoginScreen
}, {
    initialRouteName: 'Home'
});

const AppNavigator = createDrawerNavigator({
    AppRoot: AppRootStack
}, {
    initialRouteName: 'AppRoot',
    contentComponent: ({navigation}) => <DrawerMenuContent navigation={navigation} />,
    mode: Platform.OS === 'ios' ? 'modal' : 'card'
});

type Props = {};
export default class App extends Component<Props> {
    state = {
        isLoading: true
    };

    componentDidMount() {
        const loadDone = () => {
            this.setState({ isLoading: false })
        };

        const refreshToken = (oAuthData) => {
            const payload = {
                grant_type: 'refresh_token',
                client_id: CLIENT_ID,
                client_secret: CLIENT_SECRET,
                refresh_token: oAuthData.refreshToken
            };

            fetcher.post('oauth/token', {
                body: payload
            }).then((response) => {
                Token.saveToken(response);
                loadDone();
            }).catch((errors) => {
                loadDone();
            });
        };

        Token.getOAuthData()
            .then((oauthData) => {
                const aMinuteMS = 60 * 1000;
                if (!oauthData.expiresAt || (oauthData.expiresAt - Date.now()) < aMinuteMS) {
                    // Need refresh token
                    refreshToken(oauthData);
                } else {
                    loadDone();
                }
            })
            .catch((error) => {
                loadDone();
            });
    }

    render() {
        if (this.state.isLoading) {
            return (
                <View style={styles.container}>
                    <ActivityIndicator/>
                    <Text style={styles.loadingText}>Loading data...</Text>
                </View>
            );
        }

        return (<AppNavigator/>);
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },

    loadingText: {
        fontSize: 18,
        marginTop: 10
    }
});
