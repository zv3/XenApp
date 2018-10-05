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

        AsyncStorage.getItem('oauthData')
            .then((data) => {
                // TODO: Refresh token?
                let oauthData;

                try {
                    oauthData = JSON.parse(data);
                } catch (e) {
                }

                if (!oauthData) {
                    loadDone();

                    return;
                }

                Object.freeze()
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
