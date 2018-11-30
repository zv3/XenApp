/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {View, Text, ActivityIndicator, StyleSheet, AppState} from 'react-native';
import {Token} from "./src/utils/Token";
import BatchApi from "./src/api/BatchApi";
import Visitor from "./src/utils/Visitor";
import OAuthApi from "./src/api/OAuthApi";
import {AppNavigator} from './src/AppRoutes'

type Props = {};
export default class App extends Component<Props> {
    _handleAppStateChange = (nextAppState) => {
        if (nextAppState === 'active') {
            // refresh token in background?
        }
    };

    constructor(props) {
        super(props);

        this.state = {
            isLoading: true
        };
    }

    componentDidMount() {
        const loadDone = () => this.setState({ isLoading: false });

        const preloadData = () => {
            BatchApi.addRequest('GET', 'users/me');
            BatchApi.dispatch()
                .then((data) => {
                    Visitor.setVisitor(data['users/me'].user);

                    loadDone();
                })
                .catch(loadDone);
        };

        Token.getOAuthData()
            .then((oauthData) => {
                OAuthApi.refresh(oauthData)
                    .then((response) => {
                        Token.saveToken(response);

                        preloadData();
                    })
                    .catch(() => {
                        Token.removeOAuth();
                        loadDone();
                    });
            })
            .catch(loadDone);

        AppState.addEventListener('change', this._handleAppStateChange);
    }

    componentWillUnmount(): void {
        AppState.removeEventListener('change', this._handleAppStateChange);
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

        return <AppNavigator/>;
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
