import React from 'react';
import {
    View,
    TextInput,
    StyleSheet,
    ActivityIndicator,
    Alert
} from 'react-native';
import Button from '../components/Button';
import { passwordEncrypter } from '../utils/Encrypter';
import { CLIENT_ID } from '../Config';
import { Fetcher } from '../utils/Fetcher';
import { Token } from '../utils/Token';
import PropTypes from 'prop-types';

export default class LoginScreen extends React.Component {
    static navigationOptions = () => {
        return {
            title: 'Login'
        };
    };

    static propTypes = {
        navigation: PropTypes.object.isRequired
    };

    _doLogin = () => {
        this.setState({
            isSubmitting: true
        });

        const { username, password } = this.state.data;

        const payload = {
            username: username,
            password: passwordEncrypter(password),
            grant_type: 'password',
            client_id: CLIENT_ID,
            password_algo: 'aes128'
        };

        const onFailedLogin = () => {
            Alert.alert('Cannot log-in', 'Invalid password or email');

            setTimeout(() => {
                this.setState({
                    isSubmitting: false
                });
            }, 2000);
        };

        Fetcher.post('oauth/token', payload)
            .then((response) => {
                if (response.hasOwnProperty('access_token')) {
                    // login access.

                    Token.saveToken(response);
                    this.props.navigation.dispatch('Home');

                    // AuthEvent.dispatch();

                    return;
                }

                onFailedLogin();
            })
            .catch(onFailedLogin);
    };

    constructor(props) {
        super(props);

        this.state = {
            data: {},
            isSubmitting: false
        };
    }

    _onChangeText(name, value) {
        this.setState((prevState) => ({
            ...prevState,
            data: {
                ...prevState.data,
                [name]: value
            }
        }));
    }

    _doRenderField(name, placeholder) {
        let secureTextEntry = false,
            keyboardType = 'default';
        if (name.indexOf('password') === 0) {
            secureTextEntry = true;
        }

        return (
            <TextInput
                editable={!this.state.isSubmitting}
                style={styles.input}
                secureTextEntry={secureTextEntry}
                keyboardType={keyboardType}
                onChangeText={(text) => this._onChangeText(name, text)}
                placeholder={placeholder}
            />
        );
    }

    render() {
        const { data, isSubmitting } = this.state;

        return (
            <View style={styles.container}>
                {this._doRenderField('username', 'Username or Email')}
                {this._doRenderField('password', 'Password')}
                <Button
                    title="Login"
                    disabled={!data.username || !data.password}
                    onPress={this._doLogin}
                    style={styles.submit}
                    textStyle={styles.textStyle}>
                    {isSubmitting && <ActivityIndicator color="white" />}
                </Button>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingLeft: 20,
        paddingRight: 20
    },

    input: {
        width: '100%',
        marginBottom: 10,
        padding: 10,

        color: 'red',
        fontSize: 18,
        backgroundColor: '#FFF',

        borderRadius: 4
    },

    submit: {
        backgroundColor: '#2577b1',
        width: 200,
        borderRadius: 3,
        marginTop: 20,
        flexDirection: 'row',
        justifyContent: 'center'
    },
    textStyle: {
        color: '#FFF'
    }
});
