import React from 'react';
import {
    View, StyleSheet, ActivityIndicator,
    TextInput
} from 'react-native';

import {Config} from '../Config'
import {Button} from "../components/Button"
import {style} from "../Style"

export default class RegisterScreen extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            isLoading: false,
            focusField: '',
            data: {}
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

    _doRenderField(fieldId, placeholder) {
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
                onFocus={() => this.setState({ focusField: fieldId })}
                onChangeText={(text) => this._updateDateState(fieldId, text)}
                style={[style.input.normal, inputFocusStyle]}
            />
        );
    }

    _doRegister() {
        this.setState({ isLoading: true });
    }

    render() {
        let loadingIndicator;
        if (this.state.isLoading) {
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

        return (
            <View style={customStyle.container}>
                {this._doRenderField('username', 'User Name')}
                {this._doRenderField('email', 'Email')}
                {this._doRenderField('password', 'Password')}
                {this._doRenderField('password_confirmation', 'Password Confirmation')}

                <Button text="REGISTER"
                        disabled={this.state.isLoading}
                        iconView={loadingIndicator}
                        onPress={() => this._doRegister()}  />
            </View>
        );
    }
}