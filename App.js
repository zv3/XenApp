/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {Platform, View, Text, ActivityIndicator, StyleSheet} from 'react-native';

import {
    createStackNavigator,
    createDrawerNavigator
} from "react-navigation";
import HomeScreen from "./src/screens/HomeScreen";
import ThreadDetailScreen from "./src/screens/ThreadDetailScreen";
import LoginScreen from "./src/screens/LoginScreen";
import {Fetcher} from "./src/utils/Fetcher";
import {CLIENT_ID, CLIENT_SECRET} from "./src/Config";
import {Token} from "./src/utils/Token";
import ForumScreen from "./src/screens/ForumScreen";
import ThreadCreateScreen from "./src/screens/ThreadCreateScreen";
import DrawerNavList from "./src/drawer/DrawerNavList";

const AppRootStack = createStackNavigator({
    Home: HomeScreen,
    ThreadDetail: ThreadDetailScreen,
    Forum: ForumScreen,
    ThreadCreate: ThreadCreateScreen,


    // oauth screens
    Login: LoginScreen
}, {
    initialRouteName: 'Home'
});

const AppNavigator = createDrawerNavigator({
    AppRoot: AppRootStack
}, {
    initialRouteName: 'AppRoot',
    /* eslint-disable */
    contentComponent: ({navigation}) => <DrawerNavList navigation={navigation} />,
    /* eslint-enable */
    mode: Platform.OS === 'ios' ? 'modal' : 'card'
});

type Props = {};
export default class App extends Component<Props> {
    state = {
        isLoading: true
    };

    componentDidMount() {
        const loadDone = () => this.setState({ isLoading: false });

        const refreshToken = (oAuthData) => {
            const payload = {
                grant_type: 'refresh_token',
                client_id: CLIENT_ID,
                client_secret: CLIENT_SECRET,
                refresh_token: oAuthData.refreshToken
            };

            Fetcher.post('oauth/token', payload)
                .then((response) => {
                    Token.saveToken(response);
                    loadDone();
                })
                .catch(loadDone);
        };

        Token.getOAuthData()
            .then((oauthData) => {
                const aMinuteMS = 60;
                if (!oauthData.expiresAt || (oauthData.expiresAt - Math.floor(Date.now()/1000)) < aMinuteMS) {
                    // Need refresh token
                    refreshToken(oauthData);
                } else {
                    loadDone();
                }
            })
            .catch(loadDone);
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
