import React from 'react';
import {
    View, StyleSheet, ActivityIndicator,
    TextInput, Alert
} from 'react-native';

import {Config} from '../Config'
import {Button} from "../components/Button"
import {style} from "../Style"
import {passwordEncrypter} from "../helpers/encrypter";
import {apiFetcher} from "../helpers/apiFetcher";
import {isPlainObject} from "../helpers/funcs";
import {dataStore} from "../data/dataStore";
import {objectStore} from "../data/objectStore";

export default class RegisterScreen extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            isLoading: false,
            focusField: ''
        }
    }

    _updateDateState(fieldId, value) {
        this.setState(prevState => ({
            ...prevState,
            data: {
                ...prevState.data,
                [fieldId]: value
            }
        }));
    }

    _doRenderField(fieldId, placeholder, autoFocus = false) {
        let secureTextEntry = false, keyboardType = 'default';
        if (fieldId.indexOf('password') === 0) {
            secureTextEntry = true;
        }

        if (fieldId === 'email') {
            keyboardType = 'email-address';
        }

        let inputFocusStyle;
        if (this.state.focusField === fieldId) {
            inputFocusStyle = style.input.focus;
        }

        return (
            <TextInput
                placeholder={placeholder}
                placeholderTextColor={style.input.placeholder.color}
                editable={!this.state.isLoading}
                secureTextEntry={secureTextEntry}
                keyboardType={keyboardType}
                autoFocus={autoFocus}
                onFocus={() => this.setState({ focusField: fieldId })}
                onChangeText={(text) => this._updateDateState(fieldId, text)}
                style={[style.input.normal, inputFocusStyle]}
            />
        );
    }

    _doRegister() {
        if (this.state.data.password !== this.state.data.password_confirmation) {
            Alert.alert(
                'Password not matched',
                'Please enter same password in both fields'
            );

            return;
        }

        this.setState({ isLoading: true });

        const payload = {
            username: this.state.data.username,
            password: passwordEncrypter(this.state.data.password),
            user_email: this.state.data.email,
            password_algo: 'aes128',
            client_id: Config.clientId
        };

        apiFetcher.post('users', payload, {
            onSuccess: (newUser) => {
                dataStore.setOAuthData(newUser.token);
                objectStore.set(Config.Constants.VISITOR, newUser.user);

                this.props.navigation.navigate(Config.Constants.SCREEN_HOME);
            },
            onError: (errors) => {
                let errorShown;
                if (isPlainObject(errors)) {
                    errorShown = errors[0];
                }

                Alert.alert(
                    'An error occurred!',
                    errorShown ? errorShown : 'Please enter valid data'
                );

                setTimeout(() => {
                    this.setState({ isLoading: false });
                }, 2000);
            }
        });
    }

    render() {
        let loadingIndicator, buttonDisabled = !this.state.data;
        if (this.state.isLoading) {
            buttonDisabled = true;
            loadingIndicator = <ActivityIndicator/>;
        }

        const customStyle = StyleSheet.create({
            container: {
                paddingLeft: 15,
                paddingRight: 15,
                paddingTop: 230,
                paddingBottom: 30
            },
        });

        for (let dataKey in this.state.data) {
            if (!this.state.data.hasOwnProperty(dataKey)
                || !this.state.data[dataKey]
            ) {
                buttonDisabled = true;
                break;
            }
        }

        return (
            <View style={customStyle.container}>
                {this._doRenderField('username', 'User Name', true)}
                {this._doRenderField('email', 'Email')}
                {this._doRenderField('password', 'Password')}
                {this._doRenderField('password_confirmation', 'Password Confirmation')}

                <Button text="REGISTER"
                        disabled={buttonDisabled}
                        iconView={loadingIndicator}
                        onPress={() => this._doRegister()}  />
            </View>
        );
    }
}