import React from 'react';
import {
    View, TextInput, StyleSheet, ActivityIndicator, Alert
} from 'react-native';

import {Config} from '../Config'
import CryptoJS from "crypto-js"
import {apiFetcher} from "../helpers/apiFetcher"

import {style} from "../Style"
import {Button} from "../components/Button"

export default class LoginScreen extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            focusField: '',
            data: {},
            isLoading: false
        };
    }

    _onTextInputChanged(text, inputType) {
        if (inputType === 1) {
            this.setState({ username: text });
        } else if (inputType === 2) {
            this.setState({ password: text });
        }

    }

    _doLogin() {
        if (!this.state.data.username || !this.state.data.password) {
            return;
        }

        this.setState({
            isLoading: true
        });

        const key = CryptoJS.MD5(Config.clientSecret);
        const encrypted = CryptoJS.AES.encrypt(this.state.data.password, key, {
            mode: CryptoJS.mode.ECB,
            padding: CryptoJS.pad.Pkcs7
        });

        let payload = {
            username: this.state.data.username,
            password: encrypted.toString(),
            grant_type: 'password',
            client_id: Config.clientId,
            password_algo: 'aes128'
        };

        apiFetcher.post('oauth/token', payload, {
            onSuccess: (data) => {
                console.log(data)
            },
            onComplete: () => {
                this.setState({ isLoading: false });
            },
            onError: () => {
                Alert.alert(
                    'Invalid password',
                    'Please enter valid password'
                );
            }
        });
    }

    _goToRegister() {
        this.props.navigation.navigate('Register');
    }

    _updateDataState(fieldId, value) {
        this.setState(prevState => ({
            ...prevState,
            data: {
                ...prevState.data,
                [fieldId]: value
            }
        }));
    }

    _doRenderField(fieldId, placeholder) {
        let secureTextEntry = false, keyboardType = 'default';
        if (fieldId.indexOf('password') === 0) {
            secureTextEntry = true;
        }

        let inputFocusStyle;
        if (this.state.focusField === fieldId) {
            inputFocusStyle = style.input.focus;
        }

        return (
            <TextInput
                placeholder={placeholder}
                placeholderTextColor={style.input.placeholder.color}
                secureTextEntry={secureTextEntry}
                editable={!this.state.isLoading}
                keyboardType={keyboardType}
                onFocus={() => this.setState({ focusField: fieldId })}
                onChangeText={(text) => this._updateDataState(fieldId, text)}
                style={[style.input.normal, inputFocusStyle]}
            />
        );
    }


    render() {
        let loadingIndicator;
        if (this.state.isLoading) {
            loadingIndicator = <ActivityIndicator/>;
        }

        const containerStyle = StyleSheet.create({
            container: {
                paddingLeft: 15,
                paddingRight: 15,
                paddingTop: 230,
                paddingBottom: 30
            }
        });

        return (
            <View style={containerStyle.container}>
                {this._doRenderField('username', 'User Name or Email')}
                {this._doRenderField('password', 'Password')}

                <Button text="LOG IN"
                        disabled={this.state.isLoading}
                        iconView={loadingIndicator}
                        onPress={() => this._doLogin()}/>

                <Button text="Don't have an account?"
                        type="default"
                        style={{ marginTop: 10 }}
                        onPress={() => this._goToRegister()} />
            </View>
        );
    }
}